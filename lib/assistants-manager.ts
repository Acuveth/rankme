import { openai } from './openai'
import { prisma } from './prisma'
import { UserAssessmentData } from './openai'
import { CoachContext } from './coaching-types'

export interface AssistantConfig {
  name: string
  instructions: string
  model: string
  tools: any[]
}

export interface ConversationThread {
  id: string
  assistantId: string
  userId: string
  assessmentId: string
  createdAt: Date
  lastActive: Date
}

export class AssistantsManager {
  private assistantCache = new Map<string, string>() // userId:assessmentId -> assistantId

  async createOrGetAssistant(
    userId: string, 
    assessmentId: string, 
    assessmentData: UserAssessmentData, 
    context: CoachContext
  ): Promise<string> {
    const cacheKey = `${userId}:${assessmentId}`
    
    // Check if we already have an assistant for this user/assessment
    const cached = this.assistantCache.get(cacheKey)
    if (cached) {
      try {
        // Verify assistant still exists
        await openai.beta.assistants.retrieve(cached)
        return cached
      } catch (error) {
        // Assistant was deleted, remove from cache
        this.assistantCache.delete(cacheKey)
      }
    }

    // Check database for existing assistant
    const existingAssistant = await prisma.assistantConfig.findUnique({
      where: {
        userId_assessmentId: {
          userId,
          assessmentId
        }
      }
    })

    if (existingAssistant) {
      try {
        // Verify assistant still exists in OpenAI
        await openai.beta.assistants.retrieve(existingAssistant.assistantId)
        this.assistantCache.set(cacheKey, existingAssistant.assistantId)
        return existingAssistant.assistantId
      } catch (error) {
        // Assistant was deleted, remove from database
        await prisma.assistantConfig.delete({
          where: { id: existingAssistant.id }
        })
      }
    }

    // Create new assistant
    const assistantConfig = this.buildAssistantConfig(assessmentData, context)
    
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
      throw new Error('OpenAI API key not configured')
    }

    const assistant = await openai.beta.assistants.create({
      name: assistantConfig.name,
      instructions: assistantConfig.instructions,
      model: assistantConfig.model,
      tools: assistantConfig.tools
    })

    // Save to database
    await prisma.assistantConfig.create({
      data: {
        userId,
        assessmentId,
        assistantId: assistant.id,
        name: assistantConfig.name,
        instructions: assistantConfig.instructions,
        model: assistantConfig.model,
        tools: JSON.stringify(assistantConfig.tools),
        createdAt: new Date()
      }
    })

    // Cache the assistant ID
    this.assistantCache.set(cacheKey, assistant.id)
    
    return assistant.id
  }

  async createOrGetThread(userId: string, assessmentId: string, assistantId: string): Promise<string> {
    // Check for existing active thread
    const existingThread = await prisma.conversationThread.findFirst({
      where: {
        userId,
        assessmentId,
        assistantId,
        isActive: true
      },
      orderBy: { lastActive: 'desc' }
    })

    if (existingThread) {
      try {
        // Verify thread still exists in OpenAI
        await openai.beta.threads.retrieve(existingThread.threadId)
        
        // Update last active time
        await prisma.conversationThread.update({
          where: { id: existingThread.id },
          data: { lastActive: new Date() }
        })
        
        return existingThread.threadId
      } catch (error) {
        // Thread was deleted, mark as inactive
        await prisma.conversationThread.update({
          where: { id: existingThread.id },
          data: { isActive: false }
        })
      }
    }

    // Create new thread
    const thread = await openai.beta.threads.create()

    // Save to database
    await prisma.conversationThread.create({
      data: {
        userId,
        assessmentId,
        assistantId,
        threadId: thread.id,
        isActive: true,
        createdAt: new Date(),
        lastActive: new Date()
      }
    })

    return thread.id
  }

  async sendMessage(
    threadId: string, 
    assistantId: string, 
    message: string,
    userId: string,
    assessmentId: string
  ): Promise<{
    message: string
    runId: string
    threadId: string
    tokenUsage?: {
      promptTokens: number
      completionTokens: number
      totalTokens: number
    }
  }> {
    // Add message to thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message
    })

    // Save user message to database
    await prisma.chatMessage.create({
      data: {
        userId,
        assessmentId,
        role: 'user',
        content: message,
        threadId,
        createdAt: new Date()
      }
    })

    // Run the assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId
    })

    // Wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id)
    
    while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id)
    }

    if (runStatus.status === 'completed') {
      // Get the latest message from the thread
      const messages = await openai.beta.threads.messages.list(threadId)
      const latestMessage = messages.data[0]
      
      if (latestMessage.role === 'assistant') {
        const content = latestMessage.content[0]
        const assistantMessage = content.type === 'text' ? content.text.value : 'Unable to process response'

        // Save assistant message to database
        await prisma.chatMessage.create({
          data: {
            userId,
            assessmentId,
            role: 'assistant',
            content: assistantMessage,
            threadId,
            runId: run.id,
            createdAt: new Date()
          }
        })

        // Update thread last active time
        await prisma.conversationThread.updateMany({
          where: { threadId },
          data: { lastActive: new Date() }
        })

        return {
          message: assistantMessage,
          runId: run.id,
          threadId,
          tokenUsage: runStatus.usage ? {
            promptTokens: runStatus.usage.prompt_tokens,
            completionTokens: runStatus.usage.completion_tokens,
            totalTokens: runStatus.usage.total_tokens
          } : undefined
        }
      }
    }

    // Handle error cases
    if (runStatus.status === 'failed') {
      throw new Error(`Assistant run failed: ${runStatus.last_error?.message || 'Unknown error'}`)
    }

    throw new Error(`Assistant run incomplete. Status: ${runStatus.status}`)
  }

  async updateAssistantContext(
    assistantId: string,
    assessmentData: UserAssessmentData,
    context: CoachContext
  ): Promise<void> {
    const newConfig = this.buildAssistantConfig(assessmentData, context)
    
    await openai.beta.assistants.update(assistantId, {
      instructions: newConfig.instructions
    })

    // Update database record
    await prisma.assistantConfig.updateMany({
      where: { assistantId },
      data: {
        instructions: newConfig.instructions,
        updatedAt: new Date()
      }
    })
  }

  async deleteThread(threadId: string): Promise<void> {
    try {
      await openai.beta.threads.del(threadId)
    } catch (error) {
      console.warn(`Failed to delete thread ${threadId}:`, error)
    }

    // Mark thread as inactive in database
    await prisma.conversationThread.updateMany({
      where: { threadId },
      data: { isActive: false }
    })
  }

  async deleteAssistant(assistantId: string): Promise<void> {
    try {
      await openai.beta.assistants.del(assistantId)
    } catch (error) {
      console.warn(`Failed to delete assistant ${assistantId}:`, error)
    }

    // Remove from database
    await prisma.assistantConfig.deleteMany({
      where: { assistantId }
    })

    // Remove from cache
    for (const [key, cachedId] of this.assistantCache.entries()) {
      if (cachedId === assistantId) {
        this.assistantCache.delete(key)
        break
      }
    }
  }

  private buildAssistantConfig(
    assessmentData: UserAssessmentData, 
    context: CoachContext
  ): AssistantConfig {
    const style = this.getCoachingStyle(context.userSettings as any)
    
    // Build comprehensive assessment answers section
    const assessmentAnswersSection = this.buildAssessmentAnswersSection(context)
    
    const instructions = `# AI LIFE COACH ASSISTANT

## YOUR ROLE
You are an expert AI life coach providing personalized guidance and support. You have complete access to this user's comprehensive context and should reference it naturally in your responses.

## USER CONTEXT & DATA

### ASSESSMENT SCORES
- Overall: ${assessmentData.overall.percentile}th percentile (${assessmentData.overall.score}/100)
- Financial: ${assessmentData.categories.financial}th percentile
- Health: ${assessmentData.categories.health}th percentile
- Social: ${assessmentData.categories.social}th percentile
- Personal/Romantic: ${assessmentData.categories.romantic}th percentile
- Demographics: ${assessmentData.cohort.sex}, ${assessmentData.cohort.age_band}, ${assessmentData.cohort.region}

${assessmentAnswersSection}

### CURRENT PROGRESS & ENGAGEMENT
- Current streak: ${context.weeklyProgress.currentStreak} days
- Completion rate: ${context.weeklyProgress.completionRate}%
- Weekly completion rate: ${context.weeklyProgress.weeklyCompletionRate}%
- Total tasks completed: ${context.weeklyProgress.totalTasksCompleted}/${context.weeklyProgress.totalTasksAssigned}

### USER PREFERENCES & SETTINGS
- Primary focus area: ${(context.userSettings as any).primaryFocus}
- Coaching style: ${(context.userSettings as any).coachingStyle} - ${style.description}
- Task preferences: ${(context.userSettings as any).dailyTaskCount} daily, ${(context.userSettings as any).weeklyTaskCount} weekly
- Motivation level: ${(context.userSettings as any).motivationLevel}
- Daily reminders: ${(context.userSettings as any).dailyReminders ? 'enabled' : 'disabled'}
${(context.userSettings as any).specificGoals ? `- Specific goals: ${(context.userSettings as any).specificGoals}` : ''}

### RECENT ACTIVITY & CONTEXT
${context.recentJournalEntries.length > 0 ? `- Recent journal entries: ${context.recentJournalEntries.slice(0, 2).map(entry => `"${entry.entry.substring(0, 100)}..."`).join(', ')}` : '- No recent journal entries'}
${context.goalProgress.length > 0 ? `- Active goals: ${context.goalProgress.map(goal => `${goal.title} (${goal.progress}% complete)`).join(', ')}` : '- No active goals set'}
${context.achievements.length > 0 ? `- Recent achievements: ${context.achievements.slice(0, 3).map(a => a.title).join(', ')}` : '- No recent achievements'}
${context.recentCheckIns.length > 0 && context.recentCheckIns[0].mood ? `- Recent mood: ${context.recentCheckIns[0].mood}` : '- Mood not tracked recently'}

## COACHING APPROACH

### COMMUNICATION STYLE: ${(context.userSettings as any).coachingStyle.toUpperCase()}
${style.description}

Example responses:
- Greeting: "${style.prompts.greeting}"
- Encouragement: "${style.prompts.encouragement}"
- Challenge: "${style.prompts.challenge}"

### CORE RESPONSIBILITIES
1. **PERSONALIZED GUIDANCE**: Reference their specific progress, achievements, and context
2. **ASSESSMENT INTEGRATION**: Use their detailed assessment answers to provide highly specific advice that addresses their exact situation
3. **FOCUS AREA PRIORITIZATION**: Emphasize ${(context.userSettings as any).primaryFocus} based on their preferences
4. **PROGRESS ACKNOWLEDGMENT**: Celebrate their ${context.weeklyProgress.currentStreak}-day streak and ${context.weeklyProgress.completionRate}% completion rate
5. **GOAL ALIGNMENT**: Connect advice to their active goals and recent activities
6. **TASK GUIDANCE**: For task requests, guide users to use the dedicated task generation system
7. **MOTIVATION & SUPPORT**: Provide encouragement appropriate to their ${(context.userSettings as any).motivationLevel} motivation level

### CONVERSATION GUIDELINES
- Always reference specific context when relevant (progress, achievements, recent activities)
- **Use their assessment answers to give targeted advice** (e.g., "Since you mentioned you spend $500/month on dining out...")
- Maintain awareness of their journey and previous conversations
- Adapt intensity based on their motivation level and coaching style preferences
- Connect current requests to their broader goals and progress patterns
- Provide actionable, specific advice rather than generic responses

### TASK CREATION GUIDANCE
When users request tasks, explain that you work with a specialized task generation system that:
- Uses their full assessment answers for maximum personalization
- Creates tasks tailored to their specific challenges and goals  
- Allows complete customization of daily/weekly task counts and focus areas
- Integrates with their dashboard for easy tracking and completion

Guide them to specify:
- How many daily tasks they want (1-5 recommended)
- How many weekly tasks they want (0-3 recommended) 
- Which focus areas to prioritize
- Any specific goals or challenges to address

Remember: This context is persistent across our entire conversation. You don't need it repeated - reference it naturally as needed to provide the most personalized and effective coaching possible.`

    return {
      name: `Life Coach for ${assessmentData.cohort.sex}, ${assessmentData.cohort.age_band}`,
      instructions,
      model: "gpt-4-1106-preview",
      tools: []
    }
  }

  private getCoachingStyle(userSettings: any) {
    const styles = {
      supportive: {
        description: "Encouraging, gentle guidance with empathetic tone",
        prompts: {
          greeting: "I'm here to support you on your journey. How are you feeling today?",
          encouragement: "You're making great progress! Every small step counts.",
          challenge: "I believe in your ability to overcome this challenge."
        }
      },
      direct: {
        description: "Straightforward, action-oriented with clear instructions",
        prompts: {
          greeting: "Let's get straight to it. What do you want to accomplish today?",
          encouragement: "Good work. Now let's tackle the next task.",
          challenge: "This is where you need to push harder. What's your plan?"
        }
      },
      motivational: {
        description: "High-energy, achievement-focused with inspiring language",
        prompts: {
          greeting: "You're capable of amazing things! What goals are we crushing today?",
          encouragement: "Fantastic progress! You're on fire!",
          challenge: "This is your moment to shine. Let's turn this obstacle into an opportunity!"
        }
      },
      analytical: {
        description: "Data-driven, metric-focused with logical reasoning",
        prompts: {
          greeting: "Let's review your progress data and optimize your approach.",
          encouragement: "Your completion rate has improved by X%. This trend indicates success.",
          challenge: "Based on your patterns, I suggest this strategic approach."
        }
      }
    }

    return styles[userSettings.coachingStyle as keyof typeof styles] || styles.supportive
  }

  private buildAssessmentAnswersSection(context: CoachContext): string {
    if (!context.categorizedAnswers) {
      return "### ASSESSMENT ANSWERS\nNo detailed assessment answers available."
    }

    let answersSection = "### DETAILED ASSESSMENT ANSWERS\n"
    answersSection += "Use these specific user responses to provide highly personalized advice:\n\n"

    // Financial answers
    if (context.categorizedAnswers.financial && context.categorizedAnswers.financial.length > 0) {
      answersSection += "**FINANCIAL SITUATION:**\n"
      context.categorizedAnswers.financial.forEach((answer: any) => {
        answersSection += `- Q${answer.questionId}: "${answer.valueRaw}"\n`
      })
      answersSection += "\n"
    }

    // Health & Fitness answers  
    if (context.categorizedAnswers.health_fitness && context.categorizedAnswers.health_fitness.length > 0) {
      answersSection += "**HEALTH & FITNESS:**\n"
      context.categorizedAnswers.health_fitness.forEach((answer: any) => {
        answersSection += `- Q${answer.questionId}: "${answer.valueRaw}"\n`
      })
      answersSection += "\n"
    }

    // Social answers
    if (context.categorizedAnswers.social && context.categorizedAnswers.social.length > 0) {
      answersSection += "**SOCIAL LIFE:**\n"
      context.categorizedAnswers.social.forEach((answer: any) => {
        answersSection += `- Q${answer.questionId}: "${answer.valueRaw}"\n`
      })
      answersSection += "\n"
    }

    // Personal/Romantic answers
    if (context.categorizedAnswers.romantic && context.categorizedAnswers.romantic.length > 0) {
      answersSection += "**PERSONAL & ROMANTIC:**\n"
      context.categorizedAnswers.romantic.forEach((answer: any) => {
        answersSection += `- Q${answer.questionId}: "${answer.valueRaw}"\n`
      })
      answersSection += "\n"
    }

    // Career answers (if available)
    if (context.categorizedAnswers.career && context.categorizedAnswers.career.length > 0) {
      answersSection += "**CAREER & PROFESSIONAL:**\n"
      context.categorizedAnswers.career.forEach((answer: any) => {
        answersSection += `- Q${answer.questionId}: "${answer.valueRaw}"\n`
      })
      answersSection += "\n"
    }

    // Personal Growth answers (if available)
    if (context.categorizedAnswers.personal_growth && context.categorizedAnswers.personal_growth.length > 0) {
      answersSection += "**PERSONAL GROWTH:**\n"
      context.categorizedAnswers.personal_growth.forEach((answer: any) => {
        answersSection += `- Q${answer.questionId}: "${answer.valueRaw}"\n`
      })
      answersSection += "\n"
    }

    return answersSection
  }
}

export const assistantsManager = new AssistantsManager()
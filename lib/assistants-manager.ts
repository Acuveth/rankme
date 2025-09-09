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

    if (!assistant || !assistant.id) {
      throw new Error('Failed to create OpenAI assistant')
    }

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
    console.log(`createOrGetThread called for user: ${userId}, assessment: ${assessmentId}, assistant: ${assistantId}`)
    
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
      console.log(`Found existing thread: ${existingThread.threadId}`)
      try {
        // Verify thread still exists in OpenAI
        await openai.beta.threads.retrieve(existingThread.threadId)
        
        // Update last active time
        await prisma.conversationThread.update({
          where: { id: existingThread.id },
          data: { lastActive: new Date() }
        })
        
        console.log(`Returning existing thread: ${existingThread.threadId}`)
        return existingThread.threadId
      } catch (error) {
        console.log(`Existing thread ${existingThread.threadId} no longer exists, marking inactive`)
        // Thread was deleted, mark as inactive
        await prisma.conversationThread.update({
          where: { id: existingThread.id },
          data: { isActive: false }
        })
      }
    }

    // Create new thread
    const thread = await openai.beta.threads.create()

    if (!thread || !thread.id) {
      throw new Error('Failed to create OpenAI thread')
    }

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

    console.log(`Created new thread: ${thread.id}`)
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
    // Validate inputs
    if (!threadId) {
      throw new Error(`Thread ID is required, received: ${threadId}`)
    }
    if (!assistantId) {
      throw new Error(`Assistant ID is required, received: ${assistantId}`)
    }

    console.log(`SendMessage called with threadId: ${threadId}, assistantId: ${assistantId}`)

    // Check for active runs before adding message
    try {
      const runs = await openai.beta.threads.runs.list(threadId, { limit: 10 })
      const activeRuns = runs.data.filter(run => 
        ['queued', 'in_progress', 'requires_action'].includes(run.status)
      )
      
      if (activeRuns.length > 0) {
        console.log(`Found ${activeRuns.length} active runs on thread ${threadId}, cancelling them`)
        for (const activeRun of activeRuns) {
          try {
            // Use direct HTTP call to avoid SDK parameter bug
            const cancelResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${activeRun.id}/cancel`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'
              }
            })
            
            if (cancelResponse.ok) {
              console.log(`Successfully cancelled run ${activeRun.id}`)
            } else {
              const errorText = await cancelResponse.text()
              console.log(`Failed to cancel run ${activeRun.id}: ${cancelResponse.status} - ${errorText}`)
            }
          } catch (error) {
            console.log(`Failed to cancel run ${activeRun.id}, will try to wait:`, error)
          }
        }
        
        // Wait longer for cancellations to process and verify they succeeded
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Check if cancellation was successful
        const runsAfterCancel = await openai.beta.threads.runs.list(threadId, { limit: 10 })
        const stillActiveRuns = runsAfterCancel.data.filter(run => 
          ['queued', 'in_progress', 'requires_action'].includes(run.status)
        )
        
        if (stillActiveRuns.length > 0) {
          console.log(`Still have ${stillActiveRuns.length} active runs after cancellation attempts`)
          
          // Wait additional time for runs to complete naturally
          for (let i = 0; i < 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            const checkRuns = await openai.beta.threads.runs.list(threadId, { limit: 10 })
            const currentActiveRuns = checkRuns.data.filter(run => 
              ['queued', 'in_progress', 'requires_action'].includes(run.status)
            )
            
            if (currentActiveRuns.length === 0) {
              console.log('All runs completed naturally')
              break
            }
            
            console.log(`Waiting for ${currentActiveRuns.length} runs to complete... (attempt ${i + 1}/5)`)
          }
          
          // Final check - if still stuck, we'll need to create a new thread
          const finalCheck = await openai.beta.threads.runs.list(threadId, { limit: 10 })
          const finalActiveRuns = finalCheck.data.filter(run => 
            ['queued', 'in_progress', 'requires_action'].includes(run.status)
          )
          
          if (finalActiveRuns.length > 0) {
            console.log(`Thread ${threadId} appears to be permanently stuck with ${finalActiveRuns.length} active runs`)
            throw new Error('Thread has stuck runs that cannot be cancelled. Please create a new conversation.')
          }
        }
      }
    } catch (error) {
      console.warn('Failed to check/cancel active runs, proceeding anyway:', error)
    }

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

    // Validate run creation
    if (!run || !run.id) {
      throw new Error('Failed to create run')
    }

    console.log(`Created run ${run.id} for thread ${threadId}`)

    // Wait for completion - ensure threadId is still valid
    if (!threadId) {
      throw new Error('Thread ID became undefined before status check')
    }
    
    // Store values in local variables to prevent any scoping issues
    const safeThreadId = String(threadId)
    const safeRunId = String(run.id)
    
    // Validate parameters before API call
    if (!safeThreadId || safeThreadId === 'undefined') {
      throw new Error(`Invalid threadId: ${safeThreadId}`)
    }
    if (!safeRunId || safeRunId === 'undefined') {
      throw new Error(`Invalid runId: ${safeRunId}`)
    }
    
    console.log(`About to retrieve run status for threadId: ${safeThreadId}, runId: ${safeRunId}`)
    console.log(`Type checks - threadId type: ${typeof safeThreadId}, runId type: ${typeof safeRunId}`)
    console.log(`Direct values - threadId: "${safeThreadId}", runId: "${safeRunId}"`)
    let runStatus
    try {
      // Bypass SDK bug with direct HTTP call
      console.log('About to call retrieve with params:', { threadId: safeThreadId, runId: safeRunId })
      
      // Direct API call to bypass SDK issue
      const response = await fetch(`https://api.openai.com/v1/threads/${safeThreadId}/runs/${safeRunId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        }
      })
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
      }
      
      runStatus = await response.json()
    } catch (error) {
      console.error(`Failed to retrieve run status: threadId=${safeThreadId}, runId=${safeRunId}`, error)
      throw error
    }
    
    while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
      
      console.log(`Polling run status: threadId=${safeThreadId}, runId=${safeRunId}, status=${runStatus.status}`)
      try {
        // Validate parameters are still valid before polling
        if (!safeThreadId || safeThreadId === 'undefined') {
          throw new Error(`ThreadId became invalid during polling: ${safeThreadId}`)
        }
        if (!safeRunId || safeRunId === 'undefined') {
          throw new Error(`RunId became invalid during polling: ${safeRunId}`)
        }
        // Direct API call to bypass SDK issue
        const pollResponse = await fetch(`https://api.openai.com/v1/threads/${safeThreadId}/runs/${safeRunId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
          }
        })
        
        if (!pollResponse.ok) {
          throw new Error(`OpenAI API error during polling: ${pollResponse.status} ${pollResponse.statusText}`)
        }
        
        runStatus = await pollResponse.json()
      } catch (error) {
        console.error(`Failed to retrieve run status during polling: threadId=${safeThreadId}, runId=${safeRunId}`, error)
        throw error
      }
    }

    // Handle function calls if the assistant requires action
    if (runStatus.status === 'requires_action') {
      const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls
      const toolOutputs = []
      
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name
        const functionArgs = JSON.parse(toolCall.function.arguments)
        
        console.log(`Assistant is calling function: ${functionName}`, functionArgs)
        
        try {
          let functionResult = null
          
          switch (functionName) {
            case 'create_tasks_for_user':
              functionResult = await this.handleCreateTasks(userId, assessmentId, functionArgs)
              break
            case 'get_user_tasks':
              functionResult = await this.handleGetTasks(userId, assessmentId, functionArgs)
              break
            case 'update_user_task':
              functionResult = await this.handleUpdateTask(userId, functionArgs)
              break
            case 'delete_user_task':
              functionResult = await this.handleDeleteTask(userId, functionArgs)
              break
            case 'search_user_tasks':
              functionResult = await this.handleSearchTasks(userId, assessmentId, functionArgs)
              break
            default:
              functionResult = { error: `Unknown function: ${functionName}` }
          }
          
          toolOutputs.push({
            tool_call_id: toolCall.id,
            output: JSON.stringify(functionResult)
          })
          
        } catch (error) {
          console.error(`Error executing function ${functionName}:`, error)
          toolOutputs.push({
            tool_call_id: toolCall.id,
            output: JSON.stringify({ error: `Failed to execute ${functionName}: ${error.message}` })
          })
        }
      }
      
      // Submit tool outputs back to the assistant
      console.log(`About to submitToolOutputs with threadId: ${safeThreadId}, runId: ${safeRunId}`)
      
      // Additional validation right before the call
      if (!safeThreadId || safeThreadId === 'undefined' || safeThreadId === 'null') {
        console.error('Critical error: safeThreadId is invalid right before submitToolOutputs', {
          safeThreadId,
          safeRunId,
          originalThreadId: threadId
        })
        throw new Error(`Invalid threadId before submitToolOutputs: ${safeThreadId}`)
      }
      
      // Use direct HTTP call to avoid SDK parameter issues
      const submitResponse = await fetch(`https://api.openai.com/v1/threads/${safeThreadId}/runs/${safeRunId}/submit_tool_outputs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          tool_outputs: toolOutputs
        })
      })

      if (!submitResponse.ok) {
        const errorText = await submitResponse.text()
        throw new Error(`Failed to submit tool outputs: ${submitResponse.status} ${submitResponse.statusText} - ${errorText}`)
      }
      
      // Wait for the run to complete after submitting tool outputs
      let finalStatus = runStatus
      let pollCount = 0
      const maxPolls = 60 // Maximum 60 seconds
      
      while (['queued', 'in_progress', 'requires_action'].includes(finalStatus.status) && pollCount < maxPolls) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        pollCount++
        
        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${safeThreadId}/runs/${safeRunId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
          }
        })
        
        if (!statusResponse.ok) {
          throw new Error(`OpenAI API error during final polling: ${statusResponse.status} ${statusResponse.statusText}`)
        }
        
        finalStatus = await statusResponse.json()
        console.log(`Final polling ${pollCount}/${maxPolls}: status=${finalStatus.status}`)
        
        // If the assistant requires another action, handle it recursively
        if (finalStatus.status === 'requires_action') {
          console.log('Assistant requires additional action after tool outputs')
          
          const additionalToolCalls = finalStatus.required_action?.submit_tool_outputs?.tool_calls
          if (additionalToolCalls && additionalToolCalls.length > 0) {
            const additionalToolOutputs = []
            
            for (const toolCall of additionalToolCalls) {
              const functionName = toolCall.function.name
              const functionArgs = JSON.parse(toolCall.function.arguments)
              
              console.log(`Assistant calling additional function: ${functionName}`, functionArgs)
              
              let functionResult = null
              
              switch (functionName) {
                case 'create_tasks_for_user':
                  functionResult = await this.handleCreateTasks(userId, assessmentId, functionArgs)
                  break
                case 'update_user_progress':
                  functionResult = await this.handleUpdateProgress(userId, assessmentId, functionArgs)
                  break
                default:
                  functionResult = { error: `Unknown function: ${functionName}` }
              }
              
              additionalToolOutputs.push({
                tool_call_id: toolCall.id,
                output: JSON.stringify(functionResult)
              })
            }
            
            // Submit additional tool outputs
            const additionalSubmitResponse = await fetch(`https://api.openai.com/v1/threads/${safeThreadId}/runs/${safeRunId}/submit_tool_outputs`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'
              },
              body: JSON.stringify({
                tool_outputs: additionalToolOutputs
              })
            })
            
            if (!additionalSubmitResponse.ok) {
              const errorText = await additionalSubmitResponse.text()
              console.error(`Failed to submit additional tool outputs: ${errorText}`)
              break // Break out of the loop if we can't submit additional outputs
            }
            
            console.log('Successfully submitted additional tool outputs')
          } else {
            console.log('No additional tool calls found in requires_action state')
            break
          }
        }
      }
      
      if (pollCount >= maxPolls) {
        console.warn(`Reached maximum polling attempts (${maxPolls}), final status: ${finalStatus.status}`)
      }
      
      runStatus = finalStatus
    }

    if (runStatus.status === 'completed') {
      // Get the latest message from the thread
      const messages = await openai.beta.threads.messages.list(safeThreadId)
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
            threadId: safeThreadId,
            runId: safeRunId,
            createdAt: new Date()
          }
        })

        // Update thread last active time
        await prisma.conversationThread.updateMany({
          where: { threadId: safeThreadId },
          data: { lastActive: new Date() }
        })

        return {
          message: assistantMessage,
          runId: safeRunId,
          threadId: safeThreadId,
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
    
    if (runStatus.status === 'cancelled') {
      throw new Error('Assistant run was cancelled')
    }
    
    if (runStatus.status === 'expired') {
      throw new Error('Assistant run expired')
    }
    
    // If run is still in requires_action after max polling, try to get partial response
    if (runStatus.status === 'requires_action') {
      console.log('Run still requires action after polling timeout, attempting to get partial response')
      try {
        const messages = await openai.beta.threads.messages.list(safeThreadId)
        const latestMessage = messages.data[0]
        
        if (latestMessage && latestMessage.role === 'assistant') {
          const content = latestMessage.content[0]
          const assistantMessage = content.type === 'text' ? content.text.value : 'Partial response available'
          
          return {
            message: assistantMessage + '\n\n(Note: Some functionality may be incomplete due to processing timeout)',
            runId: safeRunId,
            threadId: safeThreadId
          }
        }
      } catch (error) {
        console.error('Failed to get partial response:', error)
      }
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

### TASK MANAGEMENT CAPABILITIES
You have direct access to the user's dashboard through function calls. You can:
- **CREATE** tasks directly using create_tasks_for_user function
- **VIEW** existing tasks using get_user_tasks function  
- **UPDATE** tasks (mark complete/incomplete, edit details) using update_user_task function
- **DELETE** unwanted tasks using delete_user_task function
- **SEARCH** for specific tasks using search_user_tasks function

**IMPORTANT**: When users request task creation, viewing, or management - USE these functions immediately. Don't suggest they do it manually. You have the power to manage their dashboard directly.

For task creation, use random quantities (1-10) unless they specify exact numbers. Focus on their primary area: ${(context.userSettings as any).primaryFocus}.

Remember: This context is persistent across our entire conversation. You don't need it repeated - reference it naturally as needed to provide the most personalized and effective coaching possible.`

    return {
      name: `Life Coach for ${assessmentData.cohort.sex}, ${assessmentData.cohort.age_band}`,
      instructions,
      model: "gpt-4-1106-preview",
      tools: [
        {
          type: "function",
          function: {
            name: "create_tasks_for_user",
            description: "Create personalized daily and weekly tasks directly on the user's dashboard based on their assessment and preferences",
            parameters: {
              type: "object",
              properties: {
                dailyCount: {
                  type: "number",
                  description: "Number of daily tasks to create (1-10)"
                },
                weeklyCount: {
                  type: "number", 
                  description: "Number of weekly tasks to create (1-10)"
                },
                focusAreas: {
                  type: "array",
                  items: { type: "string" },
                  description: "Focus areas for tasks (financial, health, social, personal, etc.)"
                },
                specificGoals: {
                  type: "string",
                  description: "Specific goals or preferences for the tasks"
                },
                date: {
                  type: "string",
                  description: "Date for daily tasks (YYYY-MM-DD format), defaults to today"
                }
              },
              required: ["dailyCount", "weeklyCount", "focusAreas"]
            }
          }
        },
        {
          type: "function",
          function: {
            name: "get_user_tasks",
            description: "Retrieve and display the user's existing tasks from their dashboard",
            parameters: {
              type: "object",
              properties: {
                taskType: {
                  type: "string",
                  enum: ["daily", "weekly", "both"],
                  description: "Type of tasks to retrieve"
                },
                includeCompleted: {
                  type: "boolean",
                  description: "Whether to include completed tasks",
                  default: false
                },
                date: {
                  type: "string",
                  description: "Specific date for daily tasks (YYYY-MM-DD format)"
                }
              },
              required: ["taskType"]
            }
          }
        },
        {
          type: "function",
          function: {
            name: "update_user_task",
            description: "Update or mark a specific task as completed/incomplete on the user's dashboard",
            parameters: {
              type: "object",
              properties: {
                taskId: {
                  type: "string",
                  description: "ID of the task to update"
                },
                taskType: {
                  type: "string",
                  enum: ["daily", "weekly"],
                  description: "Type of the task"
                },
                updates: {
                  type: "object",
                  properties: {
                    completed: { type: "boolean" },
                    title: { type: "string" },
                    description: { type: "string" }
                  }
                }
              },
              required: ["taskId", "taskType", "updates"]
            }
          }
        },
        {
          type: "function",
          function: {
            name: "delete_user_task", 
            description: "Remove a specific task from the user's dashboard",
            parameters: {
              type: "object",
              properties: {
                taskId: {
                  type: "string",
                  description: "ID of the task to delete"
                },
                taskType: {
                  type: "string",
                  enum: ["daily", "weekly"],
                  description: "Type of the task"
                }
              },
              required: ["taskId", "taskType"]
            }
          }
        },
        {
          type: "function",
          function: {
            name: "search_user_tasks",
            description: "Find tasks matching a search query or description", 
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query to find tasks"
                },
                category: {
                  type: "string",
                  description: "Filter by task category"
                }
              },
              required: ["query"]
            }
          }
        }
      ]
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

  // Function call handlers for OpenAI Assistant tools
  private async handleCreateTasks(userId: string, assessmentId: string, args: any) {
    try {
      // Import here to avoid circular dependency
      const { enhancedCoachingEngine } = await import('./enhanced-coaching')
      
      const assessment = await prisma.assessment.findUnique({
        where: { id: assessmentId, userId: userId },
        include: { scoreOverall: true }
      })

      if (!assessment || !assessment.scoreOverall) {
        return { error: 'Assessment not found' }
      }

      const assessmentData = {
        overall: {
          score: assessment.scoreOverall.overall,
          percentile: assessment.scoreOverall.percentileOverall
        },
        categories: {
          financial: assessment.scoreOverall.percentileFinancial,
          health: assessment.scoreOverall.percentileHealth,
          social: assessment.scoreOverall.percentileSocial,
          romantic: assessment.scoreOverall.percentileRomantic
        },
        cohort: {
          sex: assessment.cohortSex,
          age_band: assessment.cohortAge
        },
        assessmentId: assessment.id
      }

      const context = await enhancedCoachingEngine.gatherUserContext(userId, assessmentId)
      const currentDate = args.date ? new Date(args.date) : new Date()
      
      // Calculate current week based on assessment creation date (same logic as dashboard)
      const assessmentDate = new Date(assessment.createdAt)
      const daysDifference = Math.floor((currentDate.getTime() - assessmentDate.getTime()) / (1000 * 60 * 60 * 24))
      const currentWeek = Math.max(1, Math.floor(daysDifference / 7) + 1)

      // Check existing tasks to avoid duplicates
      const existingDailyTasks = await prisma.dailyTask.findMany({
        where: { 
          userId: userId,
          assessmentId: assessmentId,
          date: currentDate
        }
      })

      const existingWeeklyTasks = await prisma.weeklyTask.findMany({
        where: { 
          userId: userId,
          assessmentId: assessmentId,
          week: currentWeek
        }
      })

      console.log(`📋 Found ${existingDailyTasks.length} existing daily tasks for ${currentDate.toISOString().split('T')[0]}`)
      console.log(`📅 Found ${existingWeeklyTasks.length} existing weekly tasks for week ${currentWeek}`)

      const savedTasks = { daily: [], weekly: [] }

      // Check if we should skip creation due to existing tasks
      const skipDaily = existingDailyTasks.length >= 5 // Don't create more than 5 daily tasks per day
      const skipWeekly = existingWeeklyTasks.length >= 10 // Don't create more than 10 weekly tasks per week

      if (skipDaily && args.dailyCount > 0) {
        console.log(`⏭️ Skipping daily task creation - already have ${existingDailyTasks.length} daily tasks for today`)
        savedTasks.daily = existingDailyTasks.slice(0, args.dailyCount)
      }

      if (skipWeekly && args.weeklyCount > 0) {
        console.log(`⏭️ Skipping weekly task creation - already have ${existingWeeklyTasks.length} weekly tasks for this week`)
        savedTasks.weekly = existingWeeklyTasks.slice(0, args.weeklyCount)
      }

      // Generate and save daily tasks
      if (args.dailyCount > 0 && !skipDaily) {
        const dailyTasks = await enhancedCoachingEngine.generateDailyTasks(
          args.focusAreas,
          assessmentData,
          context,
          args.dailyCount,
          {
            difficulty: 'moderate',
            specificGoals: args.specificGoals,
            existingTasks: [],
            userRequest: `Create ${args.dailyCount} daily tasks`
          }
        )

        if (dailyTasks && dailyTasks.length > 0) {
          for (const task of dailyTasks) {
            try {
              const savedTask = await prisma.dailyTask.create({
                data: {
                  userId: userId,
                  assessmentId: assessmentId,
                  title: task.title,
                  description: task.description,
                  category: task.category,
                  source: 'ai_assistant',
                  priority: task.priority || 'medium',
                  estimatedMinutes: task.estimatedMinutes,
                  date: currentDate
                }
              })
              savedTasks.daily.push(savedTask)
            } catch (error) {
              console.log(`Skipping duplicate daily task: ${task.title}`)
            }
          }
        }
      }

      // Generate and save weekly tasks
      if (args.weeklyCount > 0 && !skipWeekly) {
        const weeklyTasks = await enhancedCoachingEngine.generateWeeklyTasks(
          args.focusAreas,
          assessmentData,
          context,
          args.weeklyCount,
          {
            difficulty: 'moderate',
            specificGoals: args.specificGoals,
            existingTasks: [],
            userRequest: `Create ${args.weeklyCount} weekly tasks`
          }
        )

        if (weeklyTasks && weeklyTasks.length > 0) {
          for (const task of weeklyTasks) {
            try {
              const savedTask = await prisma.weeklyTask.create({
                data: {
                  userId: userId,
                  assessmentId: assessmentId,
                  title: task.title,
                  description: task.description,
                  category: task.category,
                  source: 'ai_assistant',
                  priority: task.priority || 'medium',
                  estimatedMinutes: task.estimatedMinutes,
                  week: currentWeek
                }
              })
              savedTasks.weekly.push(savedTask)
            } catch (error) {
              console.log(`Skipping duplicate weekly task: ${task.title}`)
            }
          }
        }
      }

      const totalTasks = savedTasks.daily.length + savedTasks.weekly.length
      const createdDaily = skipDaily ? 0 : savedTasks.daily.length
      const createdWeekly = skipWeekly ? 0 : savedTasks.weekly.length
      const totalCreated = createdDaily + createdWeekly
      
      let message = ''
      if (totalCreated > 0) {
        message = `Successfully created ${createdDaily} daily tasks and ${createdWeekly} weekly tasks!`
      } else {
        message = `Found existing tasks: ${savedTasks.daily.length} daily and ${savedTasks.weekly.length} weekly tasks. No new tasks needed.`
      }
      
      if (skipDaily && skipWeekly) {
        message += ` You already have enough tasks for today and this week.`
      } else if (skipDaily) {
        message += ` You already have enough daily tasks for today.`
      } else if (skipWeekly) {
        message += ` You already have enough weekly tasks for this week.`
      }

      return {
        success: true,
        created: {
          dailyCount: createdDaily,
          weeklyCount: createdWeekly,
          totalCount: totalCreated
        },
        existing: {
          dailyCount: skipDaily ? savedTasks.daily.length : 0,
          weeklyCount: skipWeekly ? savedTasks.weekly.length : 0,
          totalCount: (skipDaily ? savedTasks.daily.length : 0) + (skipWeekly ? savedTasks.weekly.length : 0)
        },
        total: {
          dailyCount: savedTasks.daily.length,
          weeklyCount: savedTasks.weekly.length,
          totalCount: totalTasks
        },
        message: message
      }

    } catch (error) {
      console.error('Error in handleCreateTasks:', error)
      return { error: `Failed to create tasks: ${error.message}` }
    }
  }

  private async handleGetTasks(userId: string, assessmentId: string, args: any) {
    try {
      // Import here to avoid circular dependency
      const { enhancedCoachingEngine } = await import('./enhanced-coaching')
      
      const tasks = await enhancedCoachingEngine.getUserTasks(
        userId,
        assessmentId,
        {
          type: args.taskType,
          includeCompleted: args.includeCompleted,
          date: args.date ? new Date(args.date) : undefined
        }
      )

      return {
        success: true,
        tasks: tasks,
        summary: `Found ${tasks.totalCount} tasks total (${tasks.completedCount} completed, ${tasks.totalCount - tasks.completedCount} pending)`
      }
    } catch (error) {
      console.error('Error in handleGetTasks:', error)
      return { error: `Failed to get tasks: ${error.message}` }
    }
  }

  private async handleUpdateTask(userId: string, args: any) {
    try {
      // Import here to avoid circular dependency
      const { enhancedCoachingEngine } = await import('./enhanced-coaching')
      
      const result = await enhancedCoachingEngine.updateTask(
        args.taskId,
        args.taskType,
        userId,
        args.updates
      )

      return {
        success: true,
        updated: result,
        message: `Task updated successfully`
      }
    } catch (error) {
      console.error('Error in handleUpdateTask:', error)
      return { error: `Failed to update task: ${error.message}` }
    }
  }

  private async handleDeleteTask(userId: string, args: any) {
    try {
      // Import here to avoid circular dependency
      const { enhancedCoachingEngine } = await import('./enhanced-coaching')
      
      const result = await enhancedCoachingEngine.deleteTask(
        args.taskId,
        args.taskType,
        userId
      )

      return {
        success: true,
        deleted: result,
        message: `Task deleted successfully`
      }
    } catch (error) {
      console.error('Error in handleDeleteTask:', error)
      return { error: `Failed to delete task: ${error.message}` }
    }
  }

  private async handleSearchTasks(userId: string, assessmentId: string, args: any) {
    try {
      // Import here to avoid circular dependency
      const { enhancedCoachingEngine } = await import('./enhanced-coaching')
      
      const results = await enhancedCoachingEngine.searchTasks(
        userId,
        assessmentId,
        args.query,
        args.category
      )

      return {
        success: true,
        results: results,
        message: `Found ${results.length} matching tasks`
      }
    } catch (error) {
      console.error('Error in handleSearchTasks:', error)
      return { error: `Failed to search tasks: ${error.message}` }
    }
  }
}

export const assistantsManager = new AssistantsManager()
import { prisma } from '@/lib/prisma'
import { openai } from '@/lib/openai'
import { UserAssessmentData } from './openai'
import { 
  CoachContext, 
  CoachingStyles, 
  TaskAdaptation, 
  ProactiveInsight
} from './coaching-types'
import { assistantsManager } from './assistants-manager'

export class EnhancedCoachingEngine {
  private coachingStyles: CoachingStyles = {
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

  async gatherUserContext(userId: string, assessmentId?: string): Promise<CoachContext> {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Gather all context in parallel
    const [
      recentJournalEntries,
      completedTasks,
      activeGoals,
      conversationHistory,
      userSettings,
      progressStats,
      recentCheckIns,
      recentAchievements,
      assessmentData
    ] = await Promise.all([
      // Recent journal entries (last 7 days)
      prisma.journalEntry.findMany({
        where: {
          userId,
          date: { gte: weekAgo }
        },
        orderBy: { date: 'desc' },
        take: 5
      }),

      // Recent completed tasks (last 30 days) - split into separate queries
      Promise.all([
        prisma.dailyTask.findMany({
          where: {
            userId,
            completed: true,
            completedAt: { gte: monthAgo }
          },
          orderBy: { completedAt: 'desc' },
          take: 10
        }),
        prisma.weeklyTask.findMany({
          where: {
            userId,
            completed: true,
            completedAt: { gte: monthAgo }
          },
          orderBy: { completedAt: 'desc' },
          take: 10
        })
      ]).then(([dailyTasks, weeklyTasks]) => [...dailyTasks, ...weeklyTasks].slice(0, 20)),

      // Active goals
      prisma.goal.findMany({
        where: {
          userId,
          status: 'active'
        },
        orderBy: { createdAt: 'desc' }
      }),

      // Recent conversation history (last 20 messages)
      prisma.chatMessage.findMany({
        where: {
          userId,
          assessmentId: assessmentId || undefined
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),

      // Assessment-specific coaching settings
      prisma.coachSettings.findUnique({
        where: assessmentId ? { 
          userId_assessmentId: {
            userId,
            assessmentId
          }
        } : { userId_assessmentId: { userId, assessmentId: 'default' } }
      }),

      // Real-time progress calculation (consistent with user-progress API)
      assessmentId ? Promise.all([
        prisma.dailyTask.findMany({
          where: { 
            userId,
            assessmentId: assessmentId
          }
        }),
        prisma.weeklyTask.findMany({
          where: { 
            userId,
            assessmentId: assessmentId
          }
        })
      ]).then(([dailyTasks, weeklyTasks]) => {
        const totalTasks = dailyTasks.length + weeklyTasks.length
        const completedTasks = dailyTasks.filter(task => task.completed).length + 
                             weeklyTasks.filter(task => task.completed).length
        const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
        
        return {
          completionRate: completionPercentage,
          weeklyCompletionRate: completionPercentage, // Use same value for consistency
          totalTasksCompleted: completedTasks,
          totalTasksAssigned: totalTasks,
          currentStreak: 0, // Will be calculated from other sources if needed
          lastActiveDate: undefined
        }
      }) : prisma.userProgressStats.findUnique({
        where: { userId }
      }),

      // Recent check-ins (last 7 days)
      prisma.checkIn.findMany({
        where: {
          userId,
          scheduledFor: { gte: weekAgo }
        },
        orderBy: { scheduledFor: 'desc' },
        take: 10
      }),

      // Recent achievements (last 30 days)
      prisma.achievement.findMany({
        where: {
          userId,
          earnedAt: { gte: monthAgo }
        },
        orderBy: { earnedAt: 'desc' },
        take: 5
      }),

      // Assessment answers and categorized answers (if assessmentId provided)
      assessmentId ? prisma.assessment.findUnique({
        where: { id: assessmentId },
        include: {
          answers: true,
          categorizedAnswers: true
        }
      }) : Promise.resolve(null)
    ])

    return {
      recentJournalEntries: recentJournalEntries.map(entry => ({
        id: entry.id,
        entry: entry.entry,
        question: entry.question || undefined,
        mood: entry.mood || undefined,
        date: entry.date
      })),
      completedTasks: completedTasks as any[],
      goalProgress: activeGoals.map(goal => ({
        id: goal.id,
        title: goal.title,
        category: goal.category,
        target: goal.target,
        progress: goal.progress,
        status: goal.status as any,
        deadline: goal.deadline || undefined
      })),
      conversationHistory: conversationHistory.reverse().map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        createdAt: msg.createdAt,
        coaching_style: msg.coaching_style || undefined
      })),
      userSettings: userSettings ? (userSettings as any) : {
        primaryFocus: 'financial',
        secondaryFocus: null,
        coachingStyle: 'supportive',
        goalFrequency: 'daily',
        dailyReminders: true,
        checkInFrequency: 'daily',
        checkInTime: '09:00',
        dailyTaskCount: 3,
        weeklyTaskCount: 2,
        taskDifficulty: 'moderate',
        motivationLevel: 'balanced',
        feedbackFrequency: 'regular',
        progressTracking: true,
        celebrateMilestones: true,
        specificGoals: null
      },
      weeklyProgress: {
        currentStreak: progressStats?.currentStreak || 0,
        completionRate: progressStats?.completionRate || 0,
        weeklyCompletionRate: progressStats?.weeklyCompletionRate || 0,
        totalTasksCompleted: progressStats?.totalTasksCompleted || 0,
        totalTasksAssigned: progressStats?.totalTasksAssigned || 0,
        lastActiveDate: progressStats?.lastActiveDate || undefined
      },
      recentCheckIns: recentCheckIns.map(checkIn => ({
        id: checkIn.id,
        type: checkIn.type,
        status: checkIn.status,
        mood: checkIn.mood || undefined,
        energy: checkIn.energy || undefined,
        notes: checkIn.notes || undefined,
        scheduledFor: checkIn.scheduledFor,
        completedAt: checkIn.completedAt || undefined
      })),
      achievements: recentAchievements.map(achievement => ({
        id: achievement.id,
        type: achievement.type,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category || undefined,
        level: achievement.level,
        earnedAt: achievement.earnedAt
      })),
      
      // Assessment answers for detailed context
      categorizedAnswers: assessmentData?.categorizedAnswers ? {
        financial: assessmentData.categorizedAnswers.financialAnswers ? JSON.parse(assessmentData.categorizedAnswers.financialAnswers) : null,
        health_fitness: assessmentData.categorizedAnswers.healthFitnessAnswers ? JSON.parse(assessmentData.categorizedAnswers.healthFitnessAnswers) : null,
        social: assessmentData.categorizedAnswers.socialAnswers ? JSON.parse(assessmentData.categorizedAnswers.socialAnswers) : null,
        romantic: assessmentData.categorizedAnswers.romanticAnswers ? JSON.parse(assessmentData.categorizedAnswers.romanticAnswers) : null,
        career: assessmentData.categorizedAnswers.careerAnswers ? JSON.parse(assessmentData.categorizedAnswers.careerAnswers) : null,
        personal_growth: assessmentData.categorizedAnswers.personalGrowthAnswers ? JSON.parse(assessmentData.categorizedAnswers.personalGrowthAnswers) : null
      } : null
    }
  }

  // REMOVED: Category-specific recommendations - integrated into enhanced coach response

  async generateEnhancedCoachResponseWithAssistants(
    userMessage: string,
    userId: string,
    assessmentId: string,
    assessmentData: UserAssessmentData,
    context: CoachContext,
    isTaskRequest: boolean = false
  ): Promise<{
    message: string
    suggestions: string[]
    insights: ProactiveInsight[]
    threadId: string
    assistantId: string
    tokenUsage?: {
      promptTokens: number
      completionTokens: number
      totalTokens: number
    }
  }> {
    try {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
        return {
          message: "Sorry, the AI Coach is currently unavailable. Please check back later or contact support for assistance.",
          suggestions: [],
          insights: [],
          threadId: '',
          assistantId: ''
        }
      }

      // Create or get assistant with full context
      const assistantId = await assistantsManager.createOrGetAssistant(
        userId,
        assessmentId,
        assessmentData,
        context
      )

      // Create or get conversation thread
      const threadId = await assistantsManager.createOrGetThread(
        userId,
        assessmentId,
        assistantId
      )

      // Send message using Assistants API
      const response = await assistantsManager.sendMessage(
        threadId,
        assistantId,
        userMessage,
        userId,
        assessmentId
      )

      // Generate proactive insights based on context
      const insights = await this.generateProactiveInsightsInternal(context, assessmentData)

      return {
        message: response.message,
        suggestions: this.generateContextualSuggestions(context),
        insights,
        threadId: response.threadId,
        assistantId,
        tokenUsage: response.tokenUsage
      }

    } catch (error) {
      console.error('Enhanced coaching with Assistants API error:', error)
      return {
        message: "Sorry, the AI Coach is currently unavailable. Please check back later or contact support for assistance.",
        suggestions: [],
        insights: [],
        threadId: '',
        assistantId: ''
      }
    }
  }

  async generateEnhancedCoachResponse(
    userMessage: string,
    assessmentData: UserAssessmentData,
    context: CoachContext,
    isTaskRequest: boolean = false,
    taskPreferences?: {
      dailyCount?: number;
      weeklyCount?: number;
      focusAreas?: string[];
      specificGoals?: string;
      confirmTasks?: boolean;
    },
    forceContextRefresh: boolean = false
  ): Promise<{ 
    message: string; 
    suggestions: string[]; 
    insights: ProactiveInsight[];
    suggestedTasks?: {
      daily: Array<{title: string; description: string; category: string; estimatedMinutes: number}>;
      weekly: Array<{title: string; description: string; category: string; estimatedMinutes: number}>;
    };
    taskPreview?: {
      daily: Array<{title: string; description: string; category: string; estimatedMinutes: number}>;
      weekly: Array<{title: string; description: string; category: string; estimatedMinutes: number}>;
    };
    needsMoreInfo?: boolean;
    questionsForUser?: string[];
    awaitingConfirmation?: boolean;
    contextSent?: boolean;
  }> {
    const style = this.coachingStyles[(context.userSettings as any).coachingStyle as keyof CoachingStyles] || this.coachingStyles.supportive

    // Generate proactive insights
    const insights = await this.generateProactiveInsightsInternal(context, assessmentData)

    // Determine if we need to send full context
    const shouldSendFullContext = this.shouldSendFullContext(context, forceContextRefresh)
    
    let systemPrompt = ""
    let contextSent = false
    
    if (shouldSendFullContext) {
      // Send comprehensive context (first message or context changed)
      const contextPrompt = this.buildContextPrompt(context, assessmentData, style)
      systemPrompt = `${contextPrompt}\n\nYour role is to be a personalized AI life coach. Use the comprehensive context provided to give specific, actionable advice. Adapt your tone to match the user's preferred coaching style: ${(context.userSettings as any).coachingStyle}. Remember this context for the rest of our conversation - I won't repeat it unless something significant changes.`
      contextSent = true
    } else {
      // Lightweight reminder (subsequent messages)
      systemPrompt = `Continue our coaching conversation. Remember the user's context and preferences from earlier in our conversation. Maintain your ${(context.userSettings as any).coachingStyle} coaching style focused on ${(context.userSettings as any).primaryFocus}.`
    }

    try {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
        return {
          message: "Sorry, the AI Coach is currently unavailable. Please check back later or contact support for assistance.",
          suggestions: [],
          insights: []
        }
      }

      const messages = [
        { role: "system", content: systemPrompt },
        ...context.conversationHistory.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content: userMessage }
      ]

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages as any,
        temperature: 0.8,
        max_tokens: 600,
      })

      const response = completion.choices[0].message.content || "I'm here to help! Can you tell me more?"

      const result: any = {
        message: response,
        suggestions: this.generateContextualSuggestions(context),
        insights,
        contextSent
      }
      
      // If user requested tasks, check if we need more information
      if (isTaskRequest) {
        // Try to get preferences from user settings if not provided
        let effectivePreferences = taskPreferences
        if (!effectivePreferences && context.userSettings) {
          // Use stored preferences from database with intelligent variation
          const baseDailyCount = (context.userSettings as any).dailyTaskCount || 3
          const baseWeeklyCount = (context.userSettings as any).weeklyTaskCount || 2
          
          effectivePreferences = {
            dailyCount: this.getVariedTaskCount(baseDailyCount, 'daily', context),
            weeklyCount: this.getVariedTaskCount(baseWeeklyCount, 'weekly', context),
            focusAreas: [(context.userSettings as any).primaryFocus, (context.userSettings as any).secondaryFocus].filter(Boolean) || [(context.userSettings as any).primaryFocus],
            specificGoals: (context.userSettings as any).specificGoals
          }
        }

        // Check if we still need more information
        if (!effectivePreferences || (!effectivePreferences.dailyCount && !effectivePreferences.weeklyCount && !effectivePreferences.specificGoals)) {
          // Ask user for preferences
          result.needsMoreInfo = true
          result.questionsForUser = [
            "What specific areas would you like to focus on for improvement?",
            "How many daily tasks would you like? (1-5 recommended)",
            "How many weekly tasks would you like? (0-3 recommended)",
            "What are your specific goals or challenges you want to address?"
          ]
          result.message = "I'd love to create personalized tasks for you! To make them as relevant as possible, could you tell me:\n\n" +
            "1. What specific areas you want to improve (e.g., financial budgeting, exercise routine, social connections)?\n" +
            "2. How many daily tasks you'd like (1-5 is recommended)\n" +
            "3. How many weekly tasks you'd like (0-3 is recommended)\n" +
            "4. Any specific goals or challenges you're facing?\n\n" +
            "This will help me create tasks that truly fit your needs and schedule."
        } else {
          // Generate tasks based on preferences (either provided or stored)
          const finalPreferences = effectivePreferences || taskPreferences
          const focusAreas = finalPreferences.focusAreas || [(context.userSettings as any).primaryFocus]
          const dailyCount = finalPreferences.dailyCount || 3
          const weeklyCount = finalPreferences.weeklyCount || 2
          
          // Get existing tasks to avoid duplicates
          const existingTasks = context.completedTasks.filter(t => 
            'date' in t && this.isToday(t.date as Date)
          ).map(t => t.title)
          
          // Use AI to generate personalized tasks with user preferences
          // Generate daily and weekly tasks separately
          const dailyTasks = dailyCount > 0 ? await this.generateDailyTasks(
            focusAreas,
            assessmentData,
            context,
            dailyCount,
            {
              difficulty: 'moderate',
              specificGoals: finalPreferences.specificGoals,
              existingTasks,
              userRequest: `${userMessage}\nUser preferences: ${JSON.stringify(finalPreferences)}`
            }
          ) : []
          
          const weeklyTasks = weeklyCount > 0 ? await this.generateWeeklyTasks(
            focusAreas,
            assessmentData,
            context,
            weeklyCount,
            {
              difficulty: 'moderate',
              specificGoals: finalPreferences.specificGoals,
              existingTasks,
              userRequest: `${userMessage}\nUser preferences: ${JSON.stringify(finalPreferences)}`
            }
          ) : []
          
          const aiGeneratedTasks = (dailyTasks || weeklyTasks) ? {
            daily: dailyTasks || [],
            weekly: weeklyTasks || []
          } : null
          
          // Check if user is confirming tasks
          if (finalPreferences.confirmTasks) {
            // User has confirmed, so add tasks to dashboard
            // Use previewed tasks if available (exact tasks user approved)
            if ((finalPreferences as any).previewedTasks) {
              result.suggestedTasks = (finalPreferences as any).previewedTasks
              result.message = `Perfect! I've added ${(finalPreferences as any).previewedTasks.daily.length} daily tasks${(finalPreferences as any).previewedTasks.weekly.length > 0 ? ` and ${(finalPreferences as any).previewedTasks.weekly.length} weekly tasks` : ''} to your dashboard. You can start working on them right away!`
            } else if (aiGeneratedTasks) {
              result.suggestedTasks = aiGeneratedTasks
              result.message = `Perfect! I've added ${aiGeneratedTasks.daily.length} daily tasks${aiGeneratedTasks.weekly.length > 0 ? ` and ${aiGeneratedTasks.weekly.length} weekly tasks` : ''} to your dashboard. You can start working on them right away!`
            } else {
              // AI unavailable fallback
              const dailyTasks: any[] = []
              const weeklyTasks: any[] = []
              
              result.suggestedTasks = {
                daily: dailyTasks,
                weekly: weeklyTasks
              }
              
              result.message = "AI Coach is currently unavailable for task generation. Please try again later."
            }
          } else {
            // Show preview for user to review
            if (aiGeneratedTasks) {
              result.taskPreview = aiGeneratedTasks
              result.awaitingConfirmation = true
              
              // Add explanation for variation if counts differ from preferences
              let variationNote = ""
              if (dailyCount !== (taskPreferences?.dailyCount || 3) || weeklyCount !== (taskPreferences?.weeklyCount || 2)) {
                const reasons = []
                if (context.weeklyProgress.completionRate > 80) reasons.push("your excellent completion rate")
                if (context.weeklyProgress.currentStreak > 7) reasons.push("your strong streak")
                if (new Date().getDay() === 5) reasons.push("it's Friday")
                if ([0, 6].includes(new Date().getDay())) reasons.push("it's the weekend")
                
                variationNote = reasons.length > 0 
                  ? `I've adjusted the task count based on ${reasons.join(" and ")}. ` 
                  : "I've adjusted the task count to keep things interesting. "
              }

              let previewMessage = `Great! ${variationNote}Based on your preferences, I've created ${aiGeneratedTasks.daily.length} daily tasks${aiGeneratedTasks.weekly.length > 0 ? ` and ${aiGeneratedTasks.weekly.length} weekly tasks` : ''} for you to review:\n\n`
              
              previewMessage += "**Daily Tasks:**\n"
              aiGeneratedTasks.daily.forEach((task, index) => {
                previewMessage += `${index + 1}. **${task.title}** (${task.estimatedMinutes} min)\n   ${task.description}\n\n`
              })
              
              if (aiGeneratedTasks.weekly.length > 0) {
                previewMessage += "\n**Weekly Tasks:**\n"
                aiGeneratedTasks.weekly.forEach((task, index) => {
                  previewMessage += `${index + 1}. **${task.title}** (${task.estimatedMinutes} min)\n   ${task.description}\n\n`
                })
              }
              
              previewMessage += "\nDo these tasks look good to you? You can:\n"
              previewMessage += "- Type **'yes'** or **'confirm'** to add them to your dashboard\n"
              previewMessage += "- Type **'change'** followed by what you'd like to modify\n"
              previewMessage += "- Type **'regenerate'** to get completely new tasks\n"
              previewMessage += "- Or tell me specifically what to change (e.g., 'make the first task easier' or 'change task 2 to focus on saving money')"
              
              result.message = previewMessage
            } else {
              // AI unavailable fallback
              const dailyTasks: any[] = []
              const weeklyTasks: any[] = []
              
              result.taskPreview = {
                daily: dailyTasks,
                weekly: weeklyTasks
              }
              result.awaitingConfirmation = true
              
              result.message = "AI Coach is currently unavailable for task generation. Please try again later."
            }
          }
        }
      }

      return result
    } catch (error) {
      console.error('Enhanced coaching error:', error)
      return {
        message: "Sorry, the AI Coach is currently unavailable. Please check back later or contact support for assistance.",
        suggestions: [],
        insights: []
      }
    }
  }

  private shouldSendFullContext(context: CoachContext, forceRefresh: boolean): boolean {
    // Always send context if forced
    if (forceRefresh) return true
    
    // Send context if this is the first message in conversation
    if (context.conversationHistory.length === 0) return true
    
    // Send context if conversation is old (more than 10 messages ago)
    const recentMessages = context.conversationHistory.slice(-10)
    const hasSystemMessage = recentMessages.some(msg => msg.content.includes('COMPREHENSIVE USER CONTEXT'))
    
    if (!hasSystemMessage) return true
    
    // Send context if significant changes detected
    const latestMessage = context.conversationHistory[context.conversationHistory.length - 1]
    const timeSinceLastMessage = Date.now() - latestMessage.createdAt.getTime()
    const hoursSinceLastMessage = timeSinceLastMessage / (1000 * 60 * 60)
    
    // Refresh context after 2+ hours of inactivity
    if (hoursSinceLastMessage > 2) return true
    
    // Check for significant context changes that warrant refresh
    const hasRecentAchievements = context.achievements.some(achievement => {
      const hoursAgo = (Date.now() - achievement.earnedAt.getTime()) / (1000 * 60 * 60)
      return hoursAgo < 24
    })
    
    const hasRecentGoalChanges = context.goalProgress.some(goal => 
      goal.status === 'active' && goal.progress > 0
    )
    
    // Major streak milestone reached
    const isStreakMilestone = context.weeklyProgress.currentStreak > 0 && 
                             context.weeklyProgress.currentStreak % 7 === 0
    
    return hasRecentAchievements || hasRecentGoalChanges || isStreakMilestone
  }

  private buildContextPrompt(context: CoachContext, assessmentData: UserAssessmentData, style: any): string {
    const recentJournalSummary = context.recentJournalEntries.length > 0 
      ? `Recent journal reflections: ${context.recentJournalEntries.slice(0, 3).map(entry => `"${entry.entry.substring(0, 100)}..."`).join(', ')}`
      : 'No recent journal entries'

    const completionTrend = context.weeklyProgress.weeklyCompletionRate > context.weeklyProgress.completionRate 
      ? 'improving' : context.weeklyProgress.weeklyCompletionRate < context.weeklyProgress.completionRate 
      ? 'declining' : 'stable'

    const activeGoalsSummary = context.goalProgress.length > 0
      ? `Active goals: ${context.goalProgress.map(goal => `${goal.title} (${goal.progress}% complete)`).join(', ')}`
      : 'No active goals set'

    const recentMood = context.recentCheckIns.length > 0 && context.recentCheckIns[0].mood
      ? `Recent mood: ${context.recentCheckIns[0].mood}` 
      : 'Mood not tracked recently'

    // Build comprehensive assessment answers section
    const assessmentAnswersSection = this.buildAssessmentAnswersSection(context)

    return `COMPREHENSIVE USER CONTEXT:

ASSESSMENT DATA:
- Overall: ${assessmentData.overall.percentile}th percentile (${assessmentData.overall.score}/100)
- Financial: ${assessmentData.categories.financial}th percentile
- Health: ${assessmentData.categories.health}th percentile  
- Social: ${assessmentData.categories.social}th percentile
- Personal: ${assessmentData.categories.romantic}th percentile
- Demographics: ${assessmentData.cohort.sex}, ${assessmentData.cohort.age_band}

${assessmentAnswersSection}

PROGRESS & ENGAGEMENT:
- Current streak: ${context.weeklyProgress.currentStreak} days
- Completion rate: ${context.weeklyProgress.completionRate}% (${completionTrend} trend)
- Weekly completion rate: ${context.weeklyProgress.weeklyCompletionRate}%
- Total tasks completed: ${context.weeklyProgress.totalTasksCompleted}/${context.weeklyProgress.totalTasksAssigned}

RECENT ACTIVITY:
- ${recentJournalSummary}
- ${activeGoalsSummary}  
- ${recentMood}
- Recent achievements: ${context.achievements.map(a => a.title).join(', ') || 'None'}

PREFERENCES & SETTINGS:
- Primary focus area: ${(context.userSettings as any).primaryFocus}${(context.userSettings as any).secondaryFocus ? ` (secondary: ${(context.userSettings as any).secondaryFocus})` : ''}
- Coaching style: ${(context.userSettings as any).coachingStyle} - ${style.description}
- Motivation level: ${(context.userSettings as any).motivationLevel} (adapt intensity accordingly)
- Task preferences: ${(context.userSettings as any).dailyTaskCount} daily tasks, ${(context.userSettings as any).weeklyTaskCount} weekly tasks
- Task difficulty: ${(context.userSettings as any).taskDifficulty} (adjust complexity of suggestions)
- Goal frequency: ${(context.userSettings as any).goalFrequency}
- Feedback frequency: ${(context.userSettings as any).feedbackFrequency}
- Progress tracking: ${(context.userSettings as any).progressTracking ? 'enabled' : 'disabled'}
- Celebrate milestones: ${(context.userSettings as any).celebrateMilestones ? 'yes' : 'no'}
- Daily reminders: ${(context.userSettings as any).dailyReminders ? 'enabled' : 'disabled'}
${(context.userSettings as any).specificGoals ? `- Specific goals: ${(context.userSettings as any).specificGoals}` : ''}

YOUR ROLE AS AI COACH:
You are an expert AI life coach with comprehensive access to this user's progress, preferences, and context. Your role is to:

1. COACHING STYLE: Adapt your communication to their preferred ${(context.userSettings as any).coachingStyle} style with ${(context.userSettings as any).motivationLevel} motivation intensity
2. PERSONALIZATION: Reference their specific context, progress patterns, streak, achievements, and recent activities in your responses
3. ASSESSMENT INTEGRATION: Use their detailed assessment answers to provide highly specific, personalized advice that addresses their exact situation
4. FOCUS AREAS: Prioritize ${(context.userSettings as any).primaryFocus}${(context.userSettings as any).secondaryFocus ? ` and ${(context.userSettings as any).secondaryFocus}` : ''} based on their preferences
5. TASK GUIDANCE: When users request tasks, guide them to use the task generation system rather than creating tasks yourself
6. PROGRESS SUPPORT: Acknowledge their ${context.weeklyProgress.currentStreak}-day streak and ${context.weeklyProgress.completionRate}% completion rate
7. GOAL ALIGNMENT: Reference their active goals and recent achievements when providing guidance
8. CONVERSATION FLOW: Maintain context from previous conversations and build on their journey

COACHING CAPABILITIES:
- Provide personalized advice based on their assessment scores, answers, and progress
- Reference specific assessment responses to give targeted recommendations (e.g., "Since you mentioned you spend $500/month on dining out...")
- Help interpret their progress patterns and suggest improvements
- Offer motivation and support tailored to their coaching style preference
- Guide them through challenges using their historical context and specific assessment insights
- Celebrate milestones and achievements when appropriate
- Connect their recent activities (journal entries, check-ins) to their goals and assessment responses

IMPORTANT: Always reference specific assessment answers when giving advice to make your coaching highly personalized and relevant to their exact situation.`
  }

  private async generateProactiveInsightsInternal(context: CoachContext, assessmentData: UserAssessmentData): Promise<ProactiveInsight[]> {
    const insights: ProactiveInsight[] = []

    // Milestone celebration
    if (context.weeklyProgress.currentStreak >= 7 && context.weeklyProgress.currentStreak % 7 === 0) {
      insights.push({
        type: 'milestone_celebration',
        priority: 'high',
        message: `🎉 Amazing! You've maintained a ${context.weeklyProgress.currentStreak}-day streak! This consistency is building powerful habits.`,
        actionable: true,
        suggestedActions: [
          'Set a new stretch goal to maintain momentum',
          'Reflect on what strategies helped you maintain this streak',
          'Consider increasing task difficulty to match your growing discipline'
        ],
        triggerData: { streakDays: context.weeklyProgress.currentStreak }
      })
    }

    // Obstacle warning
    if (context.weeklyProgress.weeklyCompletionRate < 50 && context.weeklyProgress.completionRate > 70) {
      insights.push({
        type: 'obstacle_warning',
        priority: 'high',
        message: 'I notice your completion rate has dropped recently. This often happens when life gets busy or tasks become too challenging.',
        actionable: true,
        suggestedActions: [
          'Review and simplify this week\'s tasks',
          'Identify what changed in your routine',
          'Consider adjusting task difficulty or frequency'
        ],
        triggerData: { 
          weeklyRate: context.weeklyProgress.weeklyCompletionRate,
          overallRate: context.weeklyProgress.completionRate
        }
      })
    }

    // Habit suggestion based on category performance
    const lowestCategory = Object.entries(assessmentData.categories)
      .sort(([,a], [,b]) => a - b)[0]
    
    if (lowestCategory && lowestCategory[1] < 30) {
      insights.push({
        type: 'habit_suggestion',
        priority: 'medium',
        message: `Your ${lowestCategory[0]} area shows the most potential for growth. Small daily habits here could create significant improvements.`,
        actionable: true,
        suggestedActions: [
          `Set one micro-habit for ${lowestCategory[0]} improvement`,
          `Schedule 15 minutes daily for ${lowestCategory[0]} tasks`,
          `Track progress in this area for better awareness`
        ],
        triggerData: { category: lowestCategory[0], percentile: lowestCategory[1] }
      })
    }

    // Motivation boost
    if (context.recentCheckIns.length > 0 && 
        context.recentCheckIns[0].mood && 
        ['challenging', 'difficult'].includes(context.recentCheckIns[0].mood)) {
      insights.push({
        type: 'motivation_boost',
        priority: 'medium',
        message: 'I see you\'ve been facing some challenges lately. Remember, difficult periods are often when the most growth happens.',
        actionable: true,
        suggestedActions: [
          'Focus on just one small win today',
          'Practice self-compassion - progress isn\'t always linear',
          'Consider what support or resources might help'
        ],
        triggerData: { mood: context.recentCheckIns[0].mood }
      })
    }

    return insights
  }

  private generateContextualSuggestions(context: CoachContext): string[] {
    const suggestions = []

    if (context.goalProgress.length === 0) {
      suggestions.push("Help me set meaningful goals")
    } else {
      suggestions.push("How can I make progress on my goals?")
    }

    if (context.weeklyProgress.weeklyCompletionRate < 70) {
      suggestions.push("Why am I struggling to complete tasks?")
    } else {
      suggestions.push("I'm doing well - what's next?")
    }

    if (context.recentJournalEntries.length === 0) {
      suggestions.push("How can journaling help me grow?")
    }

    suggestions.push("What area should I focus on this week?")
    
    return suggestions.slice(0, 3)
  }

  // Mock response generation has been removed - AI Coach unavailable without API key
  
  private isToday(date: Date): boolean {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    return checkDate.getTime() === today.getTime()
  }
  
  async generateDailyTasks(
    focusAreas: string[],
    assessmentData: UserAssessmentData,
    context: CoachContext,
    taskCount: number,
    preferences: {
      difficulty?: 'easy' | 'moderate' | 'challenging';
      specificGoals?: string;
      timeframe?: string;
      existingTasks?: string[];
      userRequest?: string;
    } = {}
  ): Promise<any[] | null> {
    try {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
        throw new Error('AI Coach is currently unavailable')
      }

      const existingTasks = preferences.existingTasks || []
      
      // Get assessment answers only for requested focus areas (token efficient)
      const focusAreaAnswers = this.getAssessmentAnswersForFocusAreas(context, focusAreas)

      const prompt = `You are an expert personalized life coach creating highly customized daily tasks for a user.

USER CONTEXT:
- Assessment Scores:
  - Financial: ${assessmentData.categories.financial}th percentile
  - Health: ${assessmentData.categories.health}th percentile
  - Social: ${assessmentData.categories.social}th percentile
  - Personal: ${assessmentData.categories.romantic}th percentile
- Demographics: ${assessmentData.cohort.sex}, ${assessmentData.cohort.age_band}${focusAreaAnswers}

TASK PREFERENCES:
- Number of Tasks: ${taskCount}
- Focus Areas: ${focusAreas.join(', ')}
${preferences.difficulty ? `- Difficulty Level: ${preferences.difficulty}` : ''}
- Specific Goals: ${preferences.specificGoals || 'General improvement'}
- Timeframe: ${preferences.timeframe || 'Today'}
- User Request: "${preferences.userRequest || 'Create personalized daily tasks'}"

CONSTRAINTS:
- Existing Tasks to Avoid: ${existingTasks.join(', ') || 'None'}

REQUIREMENTS FOR TASK GENERATION:
1. Create exactly ${taskCount} daily tasks for the specified focus areas
2. Each task should be:
   - Specific and actionable based on their assessment answers provided above
   - Completable in one day
   - Tailored to user's percentile scores and specific responses
   - Different from existing tasks
   - Creative and directly address their situation
3. Use the assessment answers to create targeted solutions for their specific challenges

Return ONLY valid JSON in this format:
{
  "tasks": [
    {
      "title": "Specific daily task title",
      "description": "Detailed description with clear steps",
      "category": "financial|health|social|personal",
      "estimatedMinutes": 30,
      ${preferences.difficulty ? `"difficulty": "${preferences.difficulty}",` : ''}
      "priority": "high|medium|low",
      "tags": ["tag1", "tag2"],
      "reasoning": "Why this task is relevant for this user"
    }
  ]
}`

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { 
            role: "system", 
            content: "You are an expert life coach. Create personalized daily tasks using the provided assessment answers for the specified focus areas. Always return valid JSON." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 800,
      })

      const response = completion.choices[0].message.content || "{}"
      
      try {
        const result = JSON.parse(response)
        return result.tasks || []
      } catch (parseError) {
        console.error('Failed to parse daily task response:', parseError, response)
        return null
      }
    } catch (error) {
      console.error('Error generating daily tasks:', error)
      return null
    }
  }

  async generateWeeklyTasks(
    focusAreas: string[],
    assessmentData: UserAssessmentData,
    context: CoachContext,
    taskCount: number,
    preferences: {
      difficulty?: 'easy' | 'moderate' | 'challenging';
      specificGoals?: string;
      timeframe?: string;
      existingTasks?: string[];
      userRequest?: string;
    } = {}
  ): Promise<any[] | null> {
    try {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
        throw new Error('AI Coach is currently unavailable')
      }

      const existingTasks = preferences.existingTasks || []
      
      // Get assessment answers only for requested focus areas (token efficient)
      const focusAreaAnswers = this.getAssessmentAnswersForFocusAreas(context, focusAreas)
      
      const prompt = `You are an expert personalized life coach creating highly customized weekly tasks for a user.

USER CONTEXT:
- Assessment Scores:
  - Financial: ${assessmentData.categories.financial}th percentile
  - Health: ${assessmentData.categories.health}th percentile
  - Social: ${assessmentData.categories.social}th percentile
  - Personal: ${assessmentData.categories.romantic}th percentile
- Demographics: ${assessmentData.cohort.sex}, ${assessmentData.cohort.age_band}${focusAreaAnswers}

TASK PREFERENCES:
- Number of Tasks: ${taskCount}
- Focus Areas: ${focusAreas.join(', ')}
${preferences.difficulty ? `- Difficulty Level: ${preferences.difficulty}` : ''}
- Specific Goals: ${preferences.specificGoals || 'General improvement'}
- Timeframe: ${preferences.timeframe || 'This week'}
- User Request: "${preferences.userRequest || 'Create personalized weekly tasks'}"

CONSTRAINTS:
- Existing Tasks to Avoid: ${existingTasks.join(', ') || 'None'}

REQUIREMENTS FOR TASK GENERATION:
1. Create exactly ${taskCount} weekly tasks for the specified focus areas
2. Each task should be:
   - Specific and actionable based on their assessment answers provided above
   - Completable within one week
   - Tailored to user's percentile scores and specific responses
   - Different from existing tasks
   - Strategic and directly address their situation
3. Use the assessment answers to create targeted solutions for their specific challenges

Return ONLY valid JSON in this format:
{
  "tasks": [
    {
      "title": "Specific weekly task title", 
      "description": "Detailed description with clear steps",
      "category": "financial|health|social|personal",
      "estimatedMinutes": 120,
      ${preferences.difficulty ? `"difficulty": "${preferences.difficulty}",` : ''}
      "priority": "high|medium|low",
      "tags": ["tag1", "tag2"],
      "reasoning": "Why this task is relevant for this user",
      "milestones": ["milestone1", "milestone2"]
    }
  ]
}`

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { 
            role: "system", 
            content: "You are an expert life coach. Create personalized weekly tasks using the provided assessment answers for the specified focus areas. Always return valid JSON." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      })

      const response = completion.choices[0].message.content || "{}"
      
      try {
        const result = JSON.parse(response)
        return result.tasks || []
      } catch (parseError) {
        console.error('Failed to parse weekly task response:', parseError, response)
        return null
      }
    } catch (error) {
      console.error('Error generating weekly tasks:', error)
      return null
    }
  }
  
  // Helper function to get assessment answers for specific focus areas only
  private getAssessmentAnswersForFocusAreas(context: any, focusAreas: string[]): string {
    if (!context.categorizedAnswers) {
      return ''
    }

    const focusAreaMapping: { [key: string]: string } = {
      'financial': 'financial',
      'health': 'health_fitness', 
      'social': 'social',
      'personal': 'romantic', // romantic maps to personal growth
      'career': 'career',
      'personal_growth': 'personal_growth'
    }

    let answersContext = ''
    
    for (const focusArea of focusAreas) {
      const mappedCategory = focusAreaMapping[focusArea]
      if (mappedCategory && context.categorizedAnswers[mappedCategory]) {
        const answers = context.categorizedAnswers[mappedCategory]
        if (answers && answers.length > 0) {
          answersContext += `\n${focusArea.toUpperCase()} ASSESSMENT ANSWERS:\n${answers.map((answer: any) => `- ${answer.questionId}: "${answer.valueRaw}"`).join('\n')}\n`
        }
      }
    }
    
    return answersContext
  }

  private buildAssessmentAnswersSection(context: CoachContext): string {
    if (!context.categorizedAnswers) {
      return "DETAILED ASSESSMENT ANSWERS:\nNo detailed assessment answers available."
    }

    let answersSection = "DETAILED ASSESSMENT ANSWERS:\n"
    answersSection += "Use these specific user responses to provide highly personalized advice:\n\n"

    // Financial answers
    if (context.categorizedAnswers.financial && context.categorizedAnswers.financial.length > 0) {
      answersSection += "FINANCIAL SITUATION:\n"
      context.categorizedAnswers.financial.forEach((answer: any) => {
        answersSection += `- Q${answer.questionId}: "${answer.valueRaw}"\n`
      })
      answersSection += "\n"
    }

    // Health & Fitness answers  
    if (context.categorizedAnswers.health_fitness && context.categorizedAnswers.health_fitness.length > 0) {
      answersSection += "HEALTH & FITNESS:\n"
      context.categorizedAnswers.health_fitness.forEach((answer: any) => {
        answersSection += `- Q${answer.questionId}: "${answer.valueRaw}"\n`
      })
      answersSection += "\n"
    }

    // Social answers
    if (context.categorizedAnswers.social && context.categorizedAnswers.social.length > 0) {
      answersSection += "SOCIAL LIFE:\n"
      context.categorizedAnswers.social.forEach((answer: any) => {
        answersSection += `- Q${answer.questionId}: "${answer.valueRaw}"\n`
      })
      answersSection += "\n"
    }

    // Personal/Romantic answers
    if (context.categorizedAnswers.romantic && context.categorizedAnswers.romantic.length > 0) {
      answersSection += "PERSONAL & ROMANTIC:\n"
      context.categorizedAnswers.romantic.forEach((answer: any) => {
        answersSection += `- Q${answer.questionId}: "${answer.valueRaw}"\n`
      })
      answersSection += "\n"
    }

    // Career answers (if available)
    if (context.categorizedAnswers.career && context.categorizedAnswers.career.length > 0) {
      answersSection += "CAREER & PROFESSIONAL:\n"
      context.categorizedAnswers.career.forEach((answer: any) => {
        answersSection += `- Q${answer.questionId}: "${answer.valueRaw}"\n`
      })
      answersSection += "\n"
    }

    // Personal Growth answers (if available)
    if (context.categorizedAnswers.personal_growth && context.categorizedAnswers.personal_growth.length > 0) {
      answersSection += "PERSONAL GROWTH:\n"
      context.categorizedAnswers.personal_growth.forEach((answer: any) => {
        answersSection += `- Q${answer.questionId}: "${answer.valueRaw}"\n`
      })
      answersSection += "\n"
    }

    return answersSection
  }

  // REMOVED: Basic template-based task generation - use generateCustomTasks instead

  async saveChatMessage(
    userId: string, 
    role: 'user' | 'assistant', 
    content: string, 
    assessmentId?: string,
    coaching_style?: string,
    response_time?: number,
    tokens_used?: number,
    threadId?: string,
    runId?: string
  ) {
    return await prisma.chatMessage.create({
      data: {
        userId,
        role,
        content,
        assessmentId,
        coaching_style,
        response_time,
        tokens_used,
        threadId,
        runId
      }
    })
  }

  async refreshAssistantContext(
    userId: string,
    assessmentId: string,
    assessmentData: UserAssessmentData,
    context: CoachContext
  ): Promise<void> {
    try {
      // Find existing assistant
      const existingAssistant = await prisma.assistantConfig.findUnique({
        where: {
          userId_assessmentId: {
            userId,
            assessmentId
          }
        }
      })

      if (existingAssistant) {
        // Update assistant context
        await assistantsManager.updateAssistantContext(
          existingAssistant.assistantId,
          assessmentData,
          context
        )
      }
    } catch (error) {
      console.error('Error refreshing assistant context:', error)
    }
  }

  async deleteUserAssistant(userId: string, assessmentId: string): Promise<void> {
    try {
      const existingAssistant = await prisma.assistantConfig.findUnique({
        where: {
          userId_assessmentId: {
            userId,
            assessmentId
          }
        }
      })

      if (existingAssistant) {
        await assistantsManager.deleteAssistant(existingAssistant.assistantId)
      }
    } catch (error) {
      console.error('Error deleting user assistant:', error)
    }
  }

  async adaptTaskDifficulty(userId: string, category: string): Promise<TaskAdaptation[]> {
    // Get recent task completion data
    const recentTasks = await prisma.dailyTask.findMany({
      where: {
        userId,
        category,
        date: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // Last 14 days
        }
      },
      orderBy: { date: 'desc' }
    })

    const completionRate = recentTasks.length > 0 
      ? recentTasks.filter(task => task.completed).length / recentTasks.length 
      : 0

    const adaptations: TaskAdaptation[] = []

    // If completion rate is too low, simplify tasks
    if (completionRate < 0.3 && recentTasks.length > 3) {
      const failedTasks = recentTasks.filter(task => !task.completed)
      
      for (const task of failedTasks.slice(0, 3)) {
        adaptations.push({
          difficultyLevel: 'beginner',
          adaptationReason: 'completion_rate',
          originalTask: task.title,
          adaptedTask: this.simplifyTask(task.title, category),
          explanation: `Simplified based on ${Math.round(completionRate * 100)}% completion rate in ${category}`
        })
      }
    }
    // If completion rate is high, increase difficulty
    else if (completionRate > 0.8 && recentTasks.length > 5) {
      const recentCompletedTasks = recentTasks.filter(task => task.completed).slice(0, 2)
      
      for (const task of recentCompletedTasks) {
        adaptations.push({
          difficultyLevel: 'advanced',
          adaptationReason: 'completion_rate',
          originalTask: task.title,
          adaptedTask: this.enhanceTask(task.title, category),
          explanation: `Enhanced based on ${Math.round(completionRate * 100)}% completion rate in ${category}`
        })
      }
    }

    return adaptations
  }

  async generateProactiveInsights(context: CoachContext, assessmentData: UserAssessmentData): Promise<ProactiveInsight[]> {
    const insights: ProactiveInsight[] = []

    // Streak milestones
    if (context.weeklyProgress.currentStreak >= 7 && context.weeklyProgress.currentStreak % 7 === 0) {
      insights.push({
        type: 'milestone_celebration',
        priority: 'high',
        message: `🎉 Amazing! You've maintained a ${context.weeklyProgress.currentStreak}-day streak! This consistency is building powerful habits.`,
        actionable: true,
        suggestedActions: [
          'Set a new stretch goal to maintain momentum',
          'Reflect on what strategies helped you maintain this streak',
          'Consider increasing task difficulty to match your growing discipline'
        ],
        triggerData: { streakDays: context.weeklyProgress.currentStreak }
      })
    }

    // Obstacle warning
    if (context.weeklyProgress.weeklyCompletionRate < 50 && context.weeklyProgress.completionRate > 70) {
      insights.push({
        type: 'obstacle_warning',
        priority: 'high',
        message: 'I notice your completion rate has dropped recently. This often happens when life gets busy or tasks become too challenging.',
        actionable: true,
        suggestedActions: [
          'Review and simplify this week\'s tasks',
          'Identify what changed in your routine',
          'Consider adjusting task difficulty or frequency'
        ],
        triggerData: { 
          weeklyRate: context.weeklyProgress.weeklyCompletionRate,
          overallRate: context.weeklyProgress.completionRate
        }
      })
    }

    // Habit suggestion based on category performance
    const lowestCategory = Object.entries(assessmentData.categories)
      .sort(([,a], [,b]) => a - b)[0]
    
    if (lowestCategory && lowestCategory[1] < 30) {
      insights.push({
        type: 'habit_suggestion',
        priority: 'medium',
        message: `Your ${lowestCategory[0]} area shows the most potential for growth. Small daily habits here could create significant improvements.`,
        actionable: true,
        suggestedActions: [
          `Set one micro-habit for ${lowestCategory[0]} improvement`,
          `Schedule 15 minutes daily for ${lowestCategory[0]} tasks`,
          `Track progress in this area for better awareness`
        ],
        triggerData: { category: lowestCategory[0], percentile: lowestCategory[1] }
      })
    }

    // Motivation boost
    if (context.recentCheckIns.length > 0 && 
        context.recentCheckIns[0].mood && 
        ['challenging', 'difficult'].includes(context.recentCheckIns[0].mood)) {
      insights.push({
        type: 'motivation_boost',
        priority: 'medium',
        message: 'I see you\'ve been facing some challenges lately. Remember, difficult periods are often when the most growth happens.',
        actionable: true,
        suggestedActions: [
          'Focus on just one small win today',
          'Practice self-compassion - progress isn\'t always linear',
          'Consider what support or resources might help'
        ],
        triggerData: { mood: context.recentCheckIns[0].mood }
      })
    }

    // Goal suggestions based on low goal count and assessment data
    if (context.goalProgress.length < 2) {
      const lowestCategory = Object.entries(assessmentData.categories)
        .sort(([,a], [,b]) => a - b)[0]
      
      if (lowestCategory && lowestCategory[1] < 50) {
        const categoryGoals = {
          financial: {
            title: 'Improve Financial Health',
            description: 'Build better financial habits and increase financial stability',
            target: 'Increase financial percentile by 20 points'
          },
          health: {
            title: 'Enhance Health & Fitness',
            description: 'Establish consistent health routines and improve physical wellness',
            target: 'Complete 30 days of health-focused activities'
          },
          social: {
            title: 'Strengthen Social Connections',
            description: 'Build and maintain meaningful relationships',
            target: 'Engage in social activities 3 times per week'
          },
          romantic: {
            title: 'Improve Personal Relationships',
            description: 'Focus on personal growth and relationship building',
            target: 'Complete relationship improvement activities weekly'
          }
        }
        
        const goalData = categoryGoals[lowestCategory[0] as keyof typeof categoryGoals]
        if (goalData) {
          insights.push({
            type: 'goal_suggestion',
            priority: 'high',
            message: `Based on your assessment, I recommend focusing on ${lowestCategory[0]} improvement. Let me create a specific goal for you.`,
            actionable: true,
            title: goalData.title,
            description: goalData.description,
            category: lowestCategory[0],
            target: goalData.target,
            triggerData: { 
              category: lowestCategory[0], 
              percentile: lowestCategory[1],
              currentGoals: context.goalProgress.length 
            }
          })
        }
      }
    }

    return insights
  }

  private simplifyTask(originalTask: string, category: string): string {
    const simplifications: { [key: string]: (task: string) => string } = {
      financial: (task) => task.replace(/(\d+)\s*minutes?/, '10 minutes').replace(/week(ly)?/g, 'today'),
      health: (task) => task.replace(/(\d+)\s*minutes?/, '15 minutes').replace(/daily/g, 'today'),
      social: (task) => task.replace(/group|multiple people/g, 'one person'),
      personal: (task) => task.replace(/(\d+)\s*minutes?/, '10 minutes')
    }

    return simplifications[category]?.(originalTask) || 
           originalTask.replace(/(\d+)\s*minutes?/, '10 minutes')
  }

  private enhanceTask(originalTask: string, category: string): string {
    const enhancements: { [key: string]: (task: string) => string } = {
      financial: (task) => task.replace(/review/gi, 'analyze and optimize').replace(/(\d+)\s*minutes?/, '45 minutes'),
      health: (task) => task.replace(/walk/gi, 'run or intense walk').replace(/(\d+)\s*minutes?/, '45 minutes'),
      social: (task) => task.replace(/one person/g, 'a group').replace(/call/g, 'video call'),
      personal: (task) => task.replace(/read/gi, 'read and summarize').replace(/(\d+)\s*minutes?/, '30 minutes')
    }

    return enhancements[category]?.(originalTask) || 
           originalTask.replace(/(\d+)\s*minutes?/, '30 minutes') + ' with detailed reflection'
  }

  private getVariedTaskCount(baseCount: number, type: 'daily' | 'weekly', context: CoachContext): number {
    // Add intelligent variation based on user context
    let variation = 0
    
    // Factor 1: Completion rate - if doing well, maybe add more
    if (context.weeklyProgress.completionRate > 80) {
      variation += Math.random() < 0.3 ? 1 : 0  // 30% chance to add 1 more
    } else if (context.weeklyProgress.completionRate < 50) {
      variation += Math.random() < 0.4 ? -1 : 0  // 40% chance to reduce by 1
    }

    // Factor 2: Current streak - longer streaks can handle more variety
    if (context.weeklyProgress.currentStreak > 7) {
      const randomFactor = Math.random()
      if (randomFactor < 0.2) variation += 1      // 20% chance +1
      else if (randomFactor < 0.4) variation -= 1 // 20% chance -1
      // 60% chance no change
    }

    // Factor 3: Day of week variation for daily tasks
    if (type === 'daily') {
      const dayOfWeek = new Date().getDay()
      
      // Monday/Tuesday - start strong
      if ([1, 2].includes(dayOfWeek) && Math.random() < 0.25) {
        variation += 1
      }
      // Wednesday - mid-week balance, slight chance to reduce
      else if (dayOfWeek === 3 && Math.random() < 0.15) {
        variation -= 1
      }
      // Friday - end of week, sometimes reduce
      else if (dayOfWeek === 5 && Math.random() < 0.3) {
        variation -= 1
      }
      // Weekend - lighter load
      else if ([0, 6].includes(dayOfWeek) && Math.random() < 0.4) {
        variation -= 1
      }
    }

    // Factor 4: Recent task completion patterns
    const recentCompletedCount = context.completedTasks.filter(task => {
      if ('date' in task) {
        const taskDate = new Date(task.date as Date)
        const threeDaysAgo = new Date()
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
        return taskDate >= threeDaysAgo
      }
      return false
    }).length

    // If user completed a lot recently, maybe give them a lighter day
    if (recentCompletedCount > baseCount * 2 && Math.random() < 0.3) {
      variation -= 1
    }

    // Apply bounds to keep reasonable ranges
    const minCount = type === 'daily' ? 1 : 0
    const maxCount = type === 'daily' ? 5 : 4
    
    const finalCount = Math.max(minCount, Math.min(maxCount, baseCount + variation))
    
    // Add some pure randomness occasionally (10% chance for ±1)
    if (Math.random() < 0.1) {
      const randomVariation = Math.random() < 0.5 ? -1 : 1
      return Math.max(minCount, Math.min(maxCount, finalCount + randomVariation))
    }
    
    return finalCount
  }

  // REMOVED: Task generation from recommendations - use generateCustomTasks with specific goals instead
}

export const enhancedCoachingEngine = new EnhancedCoachingEngine()
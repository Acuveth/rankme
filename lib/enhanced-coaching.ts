import { prisma } from '@/lib/prisma'
import { openai } from '@/lib/openai'
import { UserAssessmentData } from './openai'
import { 
  CoachContext, 
  CoachingStyles, 
  TaskAdaptation, 
  ProactiveInsight
} from './coaching-types'

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
      recentAchievements
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

      // User coaching settings
      prisma.coachSettings.findUnique({
        where: { userId }
      }),

      // Progress statistics
      prisma.userProgressStats.findUnique({
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
      })
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
      userSettings: userSettings ? {
        primaryFocus: userSettings.primaryFocus,
        coachingStyle: userSettings.coachingStyle,
        goalFrequency: userSettings.goalFrequency,
        dailyReminders: userSettings.dailyReminders,
        checkInFrequency: userSettings.checkInFrequency,
        checkInTime: userSettings.checkInTime
      } : {
        primaryFocus: 'financial',
        coachingStyle: 'supportive',
        goalFrequency: 'daily',
        dailyReminders: true,
        checkInFrequency: 'daily',
        checkInTime: '09:00'
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
      }))
    }
  }

  async generateEnhancedCoachResponse(
    userMessage: string,
    assessmentData: UserAssessmentData,
    context: CoachContext
  ): Promise<{ message: string; suggestions: string[]; insights: ProactiveInsight[] }> {
    const style = this.coachingStyles[context.userSettings.coachingStyle as keyof CoachingStyles] || this.coachingStyles.supportive

    // Generate proactive insights
    const insights = await this.generateProactiveInsights(context, assessmentData)

    // Build comprehensive context for the LLM
    const contextPrompt = this.buildContextPrompt(context, assessmentData, style)
    const systemPrompt = `${contextPrompt}\n\nYour role is to be a personalized AI life coach. Use the comprehensive context provided to give specific, actionable advice. Adapt your tone to match the user's preferred coaching style: ${context.userSettings.coachingStyle}.`

    try {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
        return this.generateMockEnhancedResponse(userMessage, context, insights)
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

      return {
        message: response,
        suggestions: this.generateContextualSuggestions(context),
        insights
      }
    } catch (error) {
      console.error('Enhanced coaching error:', error)
      return this.generateMockEnhancedResponse(userMessage, context, insights)
    }
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

    return `COMPREHENSIVE USER CONTEXT:

ASSESSMENT DATA:
- Overall: ${assessmentData.overall.percentile}th percentile (${assessmentData.overall.score}/100)
- Financial: ${assessmentData.categories.financial}th percentile
- Health: ${assessmentData.categories.health}th percentile  
- Social: ${assessmentData.categories.social}th percentile
- Personal: ${assessmentData.categories.romantic}th percentile
- Demographics: ${assessmentData.cohort.sex}, ${assessmentData.cohort.age_band}

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

PREFERENCES:
- Primary focus area: ${context.userSettings.primaryFocus}
- Coaching style: ${context.userSettings.coachingStyle} - ${style.description}
- Goal frequency: ${context.userSettings.goalFrequency}

COACHING APPROACH: Use the ${context.userSettings.coachingStyle} style. ${style.description}. Reference specific context from their recent activities, progress patterns, and goals when providing advice.`
  }

  private async generateProactiveInsights(context: CoachContext, assessmentData: UserAssessmentData): Promise<ProactiveInsight[]> {
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

  private generateMockEnhancedResponse(
    userMessage: string, 
    context: CoachContext, 
    insights: ProactiveInsight[]
  ): { message: string; suggestions: string[]; insights: ProactiveInsight[] } {
    const style = context.userSettings.coachingStyle
    
    let response = ""
    
    if (style === 'supportive') {
      response = `I appreciate you sharing that with me. Based on your recent progress (${context.weeklyProgress.weeklyCompletionRate}% completion rate this week), I can see you're working hard. `
    } else if (style === 'motivational') {
      response = `Great question! You're showing real commitment with your ${context.weeklyProgress.currentStreak}-day streak. `
    } else if (style === 'direct') {
      response = `Here's what I see: ${context.weeklyProgress.completionRate}% completion rate, ${context.goalProgress.length} active goals. `
    } else {
      response = `Based on your data patterns, `
    }

    if (context.recentJournalEntries.length > 0) {
      response += `Your recent journal entries show you're reflecting thoughtfully on your growth. `
    }

    response += `Let's focus on your ${context.userSettings.primaryFocus} area since that's your priority. What specific challenge are you facing there?`

    return {
      message: response,
      suggestions: this.generateContextualSuggestions(context),
      insights
    }
  }

  async saveChatMessage(
    userId: string, 
    role: 'user' | 'assistant', 
    content: string, 
    assessmentId?: string,
    coaching_style?: string,
    response_time?: number,
    tokens_used?: number
  ) {
    return await prisma.chatMessage.create({
      data: {
        userId,
        role,
        content,
        assessmentId,
        coaching_style,
        response_time,
        tokens_used
      }
    })
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
}

export const enhancedCoachingEngine = new EnhancedCoachingEngine()
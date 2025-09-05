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
      }))
    }
  }

  async generateCategorySpecificRecommendations(
    category: string,
    categoryAnswers: any[],
    categoryScore: number,
    categoryPercentile: number,
    assessmentData: any
  ): Promise<{
    insights: string[]
    specificIssues: string[]
    recommendations: string[]
    improvementPlan: string[]
  }> {
    if (!categoryAnswers || categoryAnswers.length === 0) {
      return {
        insights: [],
        specificIssues: [],
        recommendations: [],
        improvementPlan: []
      }
    }

    // Create a detailed prompt for category-specific analysis
    const prompt = `You are an expert life coach analyzing a person's ${category} assessment results.

Here are their specific answers in the ${category} category:
${categoryAnswers.map(answer => `- Question: ${answer.questionId}\n  Answer: ${answer.valueRaw}`).join('\n')}

Their ${category} score: ${categoryScore}/100 (${categoryPercentile}th percentile for their demographic)

Demographic context: ${assessmentData.cohort?.age_band} ${assessmentData.cohort?.sex} in ${assessmentData.cohort?.region}

Based on their specific answers, provide:

1. Key insights about their ${category} situation (2-3 specific observations)
2. Specific issues or challenges they're facing (based on their actual answers)
3. Targeted recommendations to improve their situation (3-4 actionable items)
4. A step-by-step improvement plan (4-5 concrete steps)

Be specific and reference their actual answers. Focus on practical, actionable advice that directly addresses the issues revealed in their responses.

Format your response as JSON:
{
  "insights": ["insight1", "insight2", "insight3"],
  "specificIssues": ["issue1", "issue2"],
  "recommendations": ["rec1", "rec2", "rec3", "rec4"],
  "improvementPlan": ["step1", "step2", "step3", "step4", "step5"]
}`

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "You are an expert life coach. Analyze assessment answers and provide specific, actionable advice. Always respond with valid JSON."
        }, {
          role: "user",
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 800,
      })

      const response = completion.choices[0].message.content
      if (response) {
        try {
          return JSON.parse(response)
        } catch (parseError) {
          console.error('Failed to parse category analysis JSON:', parseError)
        }
      }
    } catch (error) {
      console.error(`Error generating ${category} recommendations:`, error)
    }

    // Fallback response
    return {
      insights: [`Your ${category} score of ${categoryScore} indicates there's room for improvement`],
      specificIssues: ["Based on your responses, there are areas that need attention"],
      recommendations: ["Focus on incremental improvements in this area", "Set specific, measurable goals", "Track your progress regularly"],
      improvementPlan: ["Assess current situation", "Set clear goals", "Create action plan", "Track progress weekly", "Adjust strategy as needed"]
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
    }
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
  }> {
    const style = this.coachingStyles[(context.userSettings as any).coachingStyle as keyof CoachingStyles] || this.coachingStyles.supportive

    // Generate proactive insights
    const insights = await this.generateProactiveInsightsInternal(context, assessmentData)

    // Build comprehensive context for the LLM
    const contextPrompt = this.buildContextPrompt(context, assessmentData, style)
    const systemPrompt = `${contextPrompt}\n\nYour role is to be a personalized AI life coach. Use the comprehensive context provided to give specific, actionable advice. Adapt your tone to match the user's preferred coaching style: ${(context.userSettings as any).coachingStyle}.`

    try {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
        return this.generateMockEnhancedResponse(userMessage, context, insights, isTaskRequest)
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
        insights
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
          const aiGeneratedTasks = await this.generateAITasks(
            focusAreas[0], 
            assessmentData, 
            context, 
            existingTasks,
            `${userMessage}\nUser preferences: ${JSON.stringify(finalPreferences)}`,
            dailyCount,
            weeklyCount
          )
          
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
              // Fallback to template-based generation if AI fails
              const dailyTasks = this.generateDailyTasks(focusAreas[0], existingTasks.length, dailyCount)
              const weeklyTasks = weeklyCount > 0 ? this.generateWeeklyTasks(focusAreas[0], weeklyCount) : []
              
              result.suggestedTasks = {
                daily: dailyTasks,
                weekly: weeklyTasks
              }
              
              result.message = `I've added ${dailyTasks.length} daily tasks${weeklyTasks.length > 0 ? ` and ${weeklyTasks.length} weekly tasks` : ''} to your dashboard!`
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
              // Fallback preview
              const dailyTasks = this.generateDailyTasks(focusAreas[0], existingTasks.length, dailyCount)
              const weeklyTasks = weeklyCount > 0 ? this.generateWeeklyTasks(focusAreas[0], weeklyCount) : []
              
              result.taskPreview = {
                daily: dailyTasks,
                weekly: weeklyTasks
              }
              result.awaitingConfirmation = true
              
              let previewMessage = `I've prepared ${dailyTasks.length} daily tasks${weeklyTasks.length > 0 ? ` and ${weeklyTasks.length} weekly tasks` : ''} for you to review:\n\n`
              
              previewMessage += "**Daily Tasks:**\n"
              dailyTasks.forEach((task, index) => {
                previewMessage += `${index + 1}. **${task.title}** (${task.estimatedMinutes} min)\n   ${task.description}\n\n`
              })
              
              if (weeklyTasks.length > 0) {
                previewMessage += "\n**Weekly Tasks:**\n"
                weeklyTasks.forEach((task, index) => {
                  previewMessage += `${index + 1}. **${task.title}** (${task.estimatedMinutes} min)\n   ${task.description}\n\n`
                })
              }
              
              previewMessage += "\nWould you like to add these tasks to your dashboard? Type 'yes' to confirm or tell me what you'd like to change."
              
              result.message = previewMessage
            }
          }
        }
      }

      return result
    } catch (error) {
      console.error('Enhanced coaching error:', error)
      return this.generateMockEnhancedResponse(userMessage, context, insights, isTaskRequest, taskPreferences)
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

COACHING APPROACH: 
- Use the ${(context.userSettings as any).coachingStyle} style with ${(context.userSettings as any).motivationLevel} motivation intensity
- Focus primarily on ${(context.userSettings as any).primaryFocus}${(context.userSettings as any).secondaryFocus ? ` and secondarily on ${(context.userSettings as any).secondaryFocus}` : ''}
- When suggesting tasks, create ${(context.userSettings as any).dailyTaskCount} daily and ${(context.userSettings as any).weeklyTaskCount} weekly tasks at ${(context.userSettings as any).taskDifficulty} difficulty level
- Provide ${(context.userSettings as any).feedbackFrequency} feedback and ${(context.userSettings as any).celebrateMilestones ? 'celebrate achievements' : 'focus on progress without excessive celebration'}
- Reference specific context from their recent activities, progress patterns, and goals when providing advice.`
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

  private generateMockEnhancedResponse(
    userMessage: string, 
    context: CoachContext, 
    insights: ProactiveInsight[],
    isTaskRequest: boolean = false,
    taskPreferences?: {
      dailyCount?: number;
      weeklyCount?: number;
      focusAreas?: string[];
      specificGoals?: string;
    }
  ): { 
    message: string; 
    suggestions: string[]; 
    insights: ProactiveInsight[];
    suggestedTasks?: {
      daily: Array<{title: string; description: string; category: string; estimatedMinutes: number}>;
      weekly: Array<{title: string; description: string; category: string; estimatedMinutes: number}>;
    };
    needsMoreInfo?: boolean;
    questionsForUser?: string[];
  } {
    const style = (context.userSettings as any).coachingStyle
    
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

    response += `Let's focus on your ${(context.userSettings as any).primaryFocus} area since that's your priority. What specific challenge are you facing there?`

    const result: any = {
      message: response,
      suggestions: this.generateContextualSuggestions(context),
      insights
    }
    
    // If user requested tasks, check if we need more info
    if (isTaskRequest) {
      if (!taskPreferences || (!(taskPreferences as any).dailyCount && !(taskPreferences as any).weeklyCount && !(taskPreferences as any).specificGoals)) {
        // Ask for preferences
        result.needsMoreInfo = true
        result.questionsForUser = [
          "What specific areas would you like to focus on?",
          "How many daily tasks would you like? (1-5 recommended)",
          "How many weekly tasks would you like? (0-3 recommended)",
          "What are your specific goals or challenges?"
        ]
        result.message = "I'd love to create personalized tasks for you! To make them as relevant as possible, could you tell me:\n\n" +
          "1. What specific areas you want to improve?\n" +
          "2. How many daily tasks you'd like (1-5 is recommended)\n" +
          "3. How many weekly tasks you'd like (0-3 is recommended)\n" +
          "4. Any specific goals or challenges you're facing?\n\n" +
          "For example, you could say: 'I want 3 daily tasks and 1 weekly task focused on budgeting and saving money'"
      } else {
        // Generate tasks based on preferences with variation
        const focusAreas = (taskPreferences as any).focusAreas || [(context.userSettings as any).primaryFocus]
        const baseDailyCount = (taskPreferences as any).dailyCount || 3
        const baseWeeklyCount = (taskPreferences as any).weeklyCount || 2
        
        // Apply intelligent variation to mock responses too
        const dailyCount = this.getVariedTaskCount(baseDailyCount, 'daily', context)
        const weeklyCount = this.getVariedTaskCount(baseWeeklyCount, 'weekly', context)
        const focusArea = focusAreas[0]
        
        // Count existing tasks
        const allDailyTasks = context.completedTasks.filter(t => 
          'date' in t && this.isToday(t.date as Date)
        )
        const existingDailyTasksCount = allDailyTasks.length
        
        // Generate requested number of tasks
        const dailyTasks = this.generateDailyTasks(focusArea, existingDailyTasksCount, dailyCount)
        const weeklyTasks = weeklyCount > 0 ? this.generateWeeklyTasks(focusArea, weeklyCount) : []
        
        // Check if user is confirming tasks
        if ((taskPreferences as any).confirmTasks) {
          // Use previewed tasks if available (exact tasks user approved)
          if ((taskPreferences as any).previewedTasks) {
            result.suggestedTasks = (taskPreferences as any).previewedTasks
            result.message = `Perfect! I've added ${(taskPreferences as any).previewedTasks.daily.length} daily tasks${(taskPreferences as any).previewedTasks.weekly.length > 0 ? ` and ${(taskPreferences as any).previewedTasks.weekly.length} weekly tasks` : ''} to your dashboard. You can start working on them right away!`
          } else {
            result.suggestedTasks = {
              daily: dailyTasks,
              weekly: weeklyTasks
            }
            result.message = `Perfect! I've added ${dailyTasks.length} daily tasks${weeklyTasks.length > 0 ? ` and ${weeklyTasks.length} weekly tasks` : ''} to your dashboard. You can start working on them right away!`
          }
        } else {
          // Show preview for user to review
          result.taskPreview = {
            daily: dailyTasks,
            weekly: weeklyTasks
          }
          result.awaitingConfirmation = true
          
          // Add explanation for variation if counts differ from preferences
          let variationNote = ""
          if (dailyCount !== baseDailyCount || weeklyCount !== baseWeeklyCount) {
            const reasons = []
            if (context.weeklyProgress.completionRate > 80) reasons.push("your excellent completion rate")
            if (context.weeklyProgress.currentStreak > 7) reasons.push("your strong streak")
            if (new Date().getDay() === 5) reasons.push("it's Friday")
            if ([0, 6].includes(new Date().getDay())) reasons.push("it's the weekend")
            
            variationNote = reasons.length > 0 
              ? `I've adjusted the task count based on ${reasons.join(" and ")}. ` 
              : "I've adjusted the task count to keep things interesting. "
          }

          let previewMessage = `${variationNote}I've prepared ${dailyTasks.length} daily tasks${weeklyTasks.length > 0 ? ` and ${weeklyTasks.length} weekly tasks` : ''} for you to review:\n\n`
          
          previewMessage += "**Daily Tasks:**\n"
          dailyTasks.forEach((task, index) => {
            previewMessage += `${index + 1}. **${task.title}** (${task.estimatedMinutes} min)\n   ${task.description}\n\n`
          })
          
          if (weeklyTasks.length > 0) {
            previewMessage += "\n**Weekly Tasks:**\n"
            weeklyTasks.forEach((task, index) => {
              previewMessage += `${index + 1}. **${task.title}** (${task.estimatedMinutes} min)\n   ${task.description}\n\n`
            })
          }
          
          previewMessage += "\nDo these tasks look good? You can:\n"
          previewMessage += "- Type **'yes'** to add them to your dashboard\n"
          previewMessage += "- Type **'change'** followed by what you'd like to modify\n"
          previewMessage += "- Or tell me specifically what to change"
          
          result.message = previewMessage
        }
      }
    }

    return result
  }
  
  private isToday(date: Date): boolean {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    return checkDate.getTime() === today.getTime()
  }
  
  private async generateAITasks(
    focusArea: string,
    assessmentData: UserAssessmentData,
    context: CoachContext,
    existingTasks: string[],
    userRequest: string,
    dailyCount: number = 3,
    weeklyCount: number = 2
  ): Promise<{ daily: any[], weekly: any[] } | null> {
    try {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
        return null // Fall back to templates if no API key
      }

      const prompt = `You are a personalized life coach creating tasks for a user.
      
User Context:
- Primary Focus Area: ${focusArea}
- Assessment Scores: 
  - Financial: ${assessmentData.categories.financial}th percentile
  - Health: ${assessmentData.categories.health}th percentile
  - Social: ${assessmentData.categories.social}th percentile
  - Personal: ${assessmentData.categories.romantic}th percentile
- Current Streak: ${context.weeklyProgress.currentStreak} days
- Completion Rate: ${context.weeklyProgress.completionRate}%
- User Request: "${userRequest}"

Existing tasks today (avoid these exact titles): ${existingTasks.join(', ') || 'None'}

Generate ${dailyCount} unique, creative, and actionable daily tasks for ${focusArea} improvement. Each task should be:
- Specific and measurable
- Achievable in one day
- Different from existing tasks
- Tailored to the user's percentile scores (lower scores need easier tasks)
- Creative and engaging (not generic)

${weeklyCount > 0 ? `Also generate ${weeklyCount} weekly tasks for longer-term goals.` : ''}

Return ONLY a JSON object in this exact format:
{
  "daily": [${Array(dailyCount).fill(0).map((_, i) => 
    `\n    {"title": "Task ${i+1} title", "description": "Specific description", "category": "${focusArea}", "estimatedMinutes": 20}`
  ).join(',')}
  ]${weeklyCount > 0 ? `,\n  "weekly": [${Array(weeklyCount).fill(0).map((_, i) => 
    `\n    {"title": "Weekly task ${i+1}", "description": "Description", "category": "${focusArea}", "estimatedMinutes": 60}`
  ).join(',')}
  ]` : ''}
}`

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a task generation assistant. Return only valid JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.9, // Higher temperature for more creativity
        max_tokens: 500,
      })

      const response = completion.choices[0].message.content || "{}"
      
      // Parse the JSON response
      try {
        const tasks = JSON.parse(response)
        
        // Validate the structure
        if (!tasks.daily || !Array.isArray(tasks.daily)) {
          console.error('Invalid task structure from AI')
          return null
        }
        
        // If no weekly tasks were requested, ensure empty array
        if (!tasks.weekly) {
          tasks.weekly = []
        }
        
        return tasks
      } catch (parseError) {
        console.error('Failed to parse AI task response:', parseError, response)
        return null
      }
    } catch (error) {
      console.error('Error generating AI tasks:', error)
      return null
    }
  }
  
  private generateDailyTasks(focusArea: string, skipFirst: number = 0, count: number = 3): Array<{title: string; description: string; category: string; estimatedMinutes: number}> {
    const taskTemplates = {
      financial: [
        { title: 'Review daily spending', description: 'Track and categorize today\'s expenses', estimatedMinutes: 10 },
        { title: 'Update budget tracker', description: 'Log income and expenses in your budget app', estimatedMinutes: 15 },
        { title: 'Read one finance article', description: 'Learn something new about personal finance', estimatedMinutes: 15 },
        { title: 'Check bank account balances', description: 'Review your current financial position', estimatedMinutes: 5 },
        { title: 'Review subscription services', description: 'Identify any unnecessary recurring charges', estimatedMinutes: 20 },
        { title: 'Compare prices before purchase', description: 'Research best deals for planned purchases', estimatedMinutes: 15 },
        { title: 'Update financial goals tracker', description: 'Log progress toward savings goals', estimatedMinutes: 10 },
        { title: 'Review credit card statements', description: 'Check for errors or fraudulent charges', estimatedMinutes: 15 },
        { title: 'Calculate daily cost average', description: 'Track your average daily spending', estimatedMinutes: 10 },
        { title: 'Research investment opportunity', description: 'Learn about a new investment option', estimatedMinutes: 30 },
        { title: 'Set aside emergency fund money', description: 'Transfer money to savings', estimatedMinutes: 5 },
        { title: 'Review and pay bills', description: 'Ensure all bills are paid on time', estimatedMinutes: 20 }
      ],
      health: [
        { title: 'Morning stretching routine', description: 'Complete 10-minute stretching exercises', estimatedMinutes: 10 },
        { title: 'Track water intake', description: 'Log your water consumption throughout the day', estimatedMinutes: 5 },
        { title: '20-minute walk', description: 'Take a brisk walk outdoors or on treadmill', estimatedMinutes: 20 },
        { title: 'Prepare healthy meal', description: 'Cook a nutritious meal from scratch', estimatedMinutes: 30 },
        { title: 'Meditation session', description: 'Practice mindfulness meditation', estimatedMinutes: 15 },
        { title: 'Track calories consumed', description: 'Log your meals and snacks', estimatedMinutes: 10 },
        { title: 'Do bodyweight exercises', description: 'Complete pushups, squats, and planks', estimatedMinutes: 15 },
        { title: 'Take vitamins and supplements', description: 'Remember your daily nutrients', estimatedMinutes: 2 },
        { title: 'Practice deep breathing', description: '5 minutes of breathing exercises', estimatedMinutes: 5 },
        { title: 'Healthy snack prep', description: 'Prepare nutritious snacks for the day', estimatedMinutes: 15 },
        { title: 'Sleep hygiene check', description: 'Prepare bedroom for quality sleep', estimatedMinutes: 10 },
        { title: 'Posture awareness exercise', description: 'Check and correct posture throughout day', estimatedMinutes: 5 }
      ],
      social: [
        { title: 'Reach out to a friend', description: 'Send a meaningful message to someone you care about', estimatedMinutes: 10 },
        { title: 'Practice active listening', description: 'Have a focused conversation without distractions', estimatedMinutes: 20 },
        { title: 'Join a group activity', description: 'Participate in a social event or online community', estimatedMinutes: 30 },
        { title: 'Call a family member', description: 'Check in with a relative', estimatedMinutes: 15 },
        { title: 'Send thank you message', description: 'Express gratitude to someone who helped you', estimatedMinutes: 10 },
        { title: 'Schedule social activity', description: 'Plan a meetup with friends', estimatedMinutes: 10 },
        { title: 'Compliment someone', description: 'Give genuine praise to brighten someone\'s day', estimatedMinutes: 5 },
        { title: 'Join online discussion', description: 'Engage in meaningful online conversation', estimatedMinutes: 20 },
        { title: 'Practice empathy', description: 'Try to understand someone else\'s perspective', estimatedMinutes: 15 },
        { title: 'Share something valuable', description: 'Share knowledge or resources with others', estimatedMinutes: 15 },
        { title: 'Reconnect with old friend', description: 'Reach out to someone you haven\'t talked to recently', estimatedMinutes: 20 },
        { title: 'Volunteer or help someone', description: 'Offer assistance to someone in need', estimatedMinutes: 30 }
      ],
      personal: [
        { title: 'Journal reflection', description: 'Write about your thoughts and feelings today', estimatedMinutes: 15 },
        { title: 'Practice gratitude', description: 'List 3 things you\'re grateful for', estimatedMinutes: 5 },
        { title: 'Learn something new', description: 'Spend time on a hobby or skill development', estimatedMinutes: 30 },
        { title: 'Read for pleasure', description: 'Read a book or article you enjoy', estimatedMinutes: 20 },
        { title: 'Creative expression', description: 'Draw, write, or create something', estimatedMinutes: 30 },
        { title: 'Plan tomorrow', description: 'Organize your schedule for the next day', estimatedMinutes: 10 },
        { title: 'Digital declutter', description: 'Organize files or clean up inbox', estimatedMinutes: 15 },
        { title: 'Practice a new skill', description: 'Work on developing a new ability', estimatedMinutes: 25 },
        { title: 'Self-care activity', description: 'Do something that makes you feel good', estimatedMinutes: 20 },
        { title: 'Set daily intentions', description: 'Define what you want to accomplish today', estimatedMinutes: 10 },
        { title: 'Review personal goals', description: 'Check progress on long-term objectives', estimatedMinutes: 15 },
        { title: 'Practice positive self-talk', description: 'Replace negative thoughts with positive ones', estimatedMinutes: 10 }
      ]
    }
    
    const allTasks = taskTemplates[focusArea as keyof typeof taskTemplates] || taskTemplates.personal
    
    // Return requested number of tasks, but from different parts of the array
    const startIndex = skipFirst % allTasks.length
    const tasks = []
    
    // Get requested number of tasks, wrapping around if necessary
    for (let i = 0; i < count; i++) {
      const index = (startIndex + i) % allTasks.length
      tasks.push({ ...allTasks[index], category: focusArea })
    }
    
    return tasks
  }
  
  private generateWeeklyTasks(focusArea: string, count: number = 2): Array<{title: string; description: string; category: string; estimatedMinutes: number}> {
    const taskTemplates = {
      financial: [
        { title: 'Weekly budget review', description: 'Analyze spending patterns and adjust budget', estimatedMinutes: 45 },
        { title: 'Investment research', description: 'Research and learn about investment opportunities', estimatedMinutes: 60 },
        { title: 'Financial goal planning', description: 'Review and update financial goals', estimatedMinutes: 30 }
      ],
      health: [
        { title: 'Meal prep for the week', description: 'Prepare healthy meals in advance', estimatedMinutes: 120 },
        { title: 'Complete 3 workout sessions', description: 'Full body workouts spread across the week', estimatedMinutes: 150 },
        { title: 'Health metrics review', description: 'Track weight, measurements, and health indicators', estimatedMinutes: 20 }
      ],
      social: [
        { title: 'Plan social gathering', description: 'Organize or attend a social event', estimatedMinutes: 60 },
        { title: 'Deepen one relationship', description: 'Have meaningful conversation with someone important', estimatedMinutes: 90 },
        { title: 'Community involvement', description: 'Volunteer or participate in community activities', estimatedMinutes: 120 }
      ],
      personal: [
        { title: 'Weekly reflection session', description: 'Review progress and set intentions for next week', estimatedMinutes: 45 },
        { title: 'Skill development project', description: 'Work on learning a new skill or hobby', estimatedMinutes: 120 },
        { title: 'Self-care routine', description: 'Dedicate time to relaxation and self-care', estimatedMinutes: 60 }
      ]
    }
    
    const allTasks = taskTemplates[focusArea as keyof typeof taskTemplates] || taskTemplates.personal
    return allTasks.slice(0, count).map(task => ({ ...task, category: focusArea }))
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

  async generateTasksFromRecommendations(
    category: string,
    recommendations: {
      insights: string[]
      specificIssues: string[]
      recommendations: string[]
      improvementPlan: string[]
    },
    categoryAnswers: any[],
    userPreferences?: {
      dailyTaskCount?: number
      weeklyTaskCount?: number
      difficulty?: 'easy' | 'moderate' | 'challenging'
    }
  ): Promise<{
    daily: Array<{
      title: string
      description: string
      category: string
      estimatedMinutes: number
      priority: 'low' | 'medium' | 'high'
      reasoning: string
    }>
    weekly: Array<{
      title: string
      description: string
      category: string
      estimatedMinutes: number
      priority: 'low' | 'medium' | 'high'
      reasoning: string
    }>
  }> {
    const prompt = `You are an expert life coach creating specific, actionable daily and weekly tasks based on assessment insights and recommendations.

Category: ${category}

User's Assessment Insights:
${recommendations.insights.map(insight => `- ${insight}`).join('\n')}

Specific Issues Identified:
${recommendations.specificIssues.map(issue => `- ${issue}`).join('\n')}

Recommendations to Address:
${recommendations.recommendations.map(rec => `- ${rec}`).join('\n')}

Improvement Plan Steps:
${recommendations.improvementPlan.map(step => `- ${step}`).join('\n')}

User's Actual Assessment Answers (for context):
${categoryAnswers.map(answer => `- ${answer.questionId}: "${answer.valueRaw}"`).join('\n')}

Task Preferences:
- Daily tasks needed: ${userPreferences?.dailyTaskCount || 3}
- Weekly tasks needed: ${userPreferences?.weeklyTaskCount || 2}
- Difficulty level: ${userPreferences?.difficulty || 'moderate'}

Create specific, actionable tasks that directly address the user's situation. Each task should:
1. Be concrete and measurable
2. Directly relate to their specific answers and issues
3. Help implement the recommendations
4. Be appropriately sized for daily vs weekly completion
5. Include a brief reasoning explaining why this task addresses their specific situation

Format your response as JSON:
{
  "daily": [
    {
      "title": "Specific daily task title",
      "description": "Detailed description of what to do",
      "category": "${category}",
      "estimatedMinutes": 30,
      "priority": "high",
      "reasoning": "Why this task addresses their specific situation"
    }
  ],
  "weekly": [
    {
      "title": "Specific weekly task title",
      "description": "Detailed description of what to do",
      "category": "${category}",
      "estimatedMinutes": 60,
      "priority": "medium",
      "reasoning": "Why this task addresses their specific situation"
    }
  ]
}`

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "You are an expert life coach and task designer. Create specific, actionable tasks based on user assessment data. Always respond with valid JSON."
        }, {
          role: "user",
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const response = completion.choices[0].message.content
      if (response) {
        try {
          return JSON.parse(response)
        } catch (parseError) {
          console.error('Failed to parse task generation JSON:', parseError)
        }
      }
    } catch (error) {
      console.error(`Error generating ${category} tasks:`, error)
    }

    // Fallback task generation based on category and recommendations
    return this.generateFallbackTasks(category, recommendations, userPreferences)
  }

  private generateFallbackTasks(
    category: string,
    recommendations: any,
    userPreferences?: any
  ) {
    const dailyCount = userPreferences?.dailyTaskCount || 3
    const weeklyCount = userPreferences?.weeklyTaskCount || 2

    // Category-specific task templates
    const taskTemplates = {
      financial: {
        daily: [
          { title: "Track daily expenses", description: "Log every purchase and expense in a notebook or app", estimatedMinutes: 10, priority: "high" as const },
          { title: "Review debt repayment progress", description: "Check one debt balance and calculate how much progress you've made", estimatedMinutes: 15, priority: "high" as const },
          { title: "Read about budgeting strategies", description: "Learn one new budgeting tip or strategy online", estimatedMinutes: 20, priority: "medium" as const }
        ],
        weekly: [
          { title: "Create detailed debt repayment plan", description: "List all debts, interest rates, and create a strategic payoff plan", estimatedMinutes: 90, priority: "high" as const },
          { title: "Build emergency fund strategy", description: "Set up automatic transfer for $25-50/week to emergency savings", estimatedMinutes: 30, priority: "high" as const }
        ]
      },
      career: {
        daily: [
          { title: "Update one professional skill", description: "Spend 20 minutes learning something relevant to your career goals", estimatedMinutes: 20, priority: "medium" as const },
          { title: "Network with industry contact", description: "Reach out to one person in your field or desired field", estimatedMinutes: 15, priority: "high" as const }
        ],
        weekly: [
          { title: "Conduct skills audit and improvement plan", description: "List your skills, identify gaps, and create a learning plan", estimatedMinutes: 60, priority: "high" as const },
          { title: "Start strategic job search", description: "Research companies and roles, update resume, apply to 3-5 positions", estimatedMinutes: 120, priority: "high" as const }
        ]
      }
    }

    const categoryTasks = taskTemplates[category as keyof typeof taskTemplates] || {
      daily: [{ title: "Work on personal improvement", description: "Take steps to improve in this area", estimatedMinutes: 20, priority: "medium" as const }],
      weekly: [{ title: "Create improvement plan", description: "Develop a strategy for growth in this area", estimatedMinutes: 45, priority: "medium" as const }]
    }

    return {
      daily: categoryTasks.daily.slice(0, dailyCount).map(task => ({
        ...task,
        reasoning: `This task helps address the ${category} challenges identified in your assessment`
      })),
      weekly: categoryTasks.weekly.slice(0, weeklyCount).map(task => ({
        ...task,
        reasoning: `This weekly task supports your ${category} improvement plan`
      }))
    }
  }
}

export const enhancedCoachingEngine = new EnhancedCoachingEngine()
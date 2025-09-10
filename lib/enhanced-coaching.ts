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
import { ScoreUpdater } from './score-updater'

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
        dailyTaskCount: Math.floor(Math.random() * 10) + 1,
        weeklyTaskCount: Math.floor(Math.random() * 10) + 1,
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

      // Validate inputs
      if (!userId || !assessmentId || !userMessage?.trim()) {
        throw new Error('Missing required parameters for coaching request')
      }

      // Create or get assistant with full context
      const assistantId = await assistantsManager.createOrGetAssistant(
        userId,
        assessmentId,
        assessmentData,
        context
      )

      if (!assistantId) {
        throw new Error('Failed to create or retrieve assistant')
      }

      // Create or get conversation thread
      const threadId = await assistantsManager.createOrGetThread(
        userId,
        assessmentId,
        assistantId
      )

      console.log(`Enhanced coaching received threadId: ${threadId}`)
      
      if (!threadId) {
        throw new Error('Failed to create or retrieve conversation thread')
      }

      // Send message using Assistants API
      console.log(`About to call sendMessage with threadId: ${threadId}, assistantId: ${assistantId}`)
      let response
      try {
        response = await assistantsManager.sendMessage(
          threadId,
          assistantId,
          userMessage,
          userId,
          assessmentId
        )
      } catch (error: any) {
        // If thread has stuck runs, create a new thread and retry
        if (error.message && error.message.includes('stuck runs')) {
          console.log('Thread has stuck runs, creating new thread and retrying...')
          
          // Delete the stuck thread record from database
          await assistantsManager.deleteThread(threadId)
          
          // Create a new thread
          const newThreadId = await assistantsManager.createOrGetThread(
            userId,
            assessmentId,
            assistantId
          )
          
          console.log(`Created new thread ${newThreadId}, retrying message...`)
          
          // Retry with new thread
          response = await assistantsManager.sendMessage(
            newThreadId,
            assistantId,
            userMessage,
            userId,
            assessmentId
          )
        } else {
          throw error
        }
      }

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
      console.error('Enhanced coaching with Assistants API error:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        userId,
        assessmentId,
        messageLength: userMessage?.length
      })
      
      // Return fallback response
      return {
        message: "Sorry, I'm experiencing technical difficulties right now. Please try again in a moment, or feel free to ask me something else!",
        suggestions: this.generateContextualSuggestions(context),
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
      systemPrompt = `${contextPrompt}\n\nYour role is to be a personalized AI life coach. Use the comprehensive context provided to give specific, actionable advice. Adapt your tone to match the user's preferred coaching style: ${(context.userSettings as any).coachingStyle}. 

IMPORTANT CAPABILITIES: You have direct access to the user's dashboard through function calls. You can:
- CREATE tasks directly on their dashboard using create_tasks_for_user function
- VIEW their existing tasks using get_user_tasks function  
- UPDATE their tasks using update_user_task function
- DELETE their tasks using delete_user_task function
- SEARCH their tasks using search_user_tasks function

When users ask you to create tasks, add tasks to their dashboard, or set up new tasks - USE the create_tasks_for_user function immediately. Don't suggest they do it manually. You have the power to do it for them directly.

Remember this context for the rest of our conversation - I won't repeat it unless something significant changes.`
      contextSent = true
    } else {
      // Lightweight reminder (subsequent messages)
      systemPrompt = `Continue our coaching conversation. Remember the user's context and preferences from earlier in our conversation. Maintain your ${(context.userSettings as any).coachingStyle} coaching style focused on ${(context.userSettings as any).primaryFocus}.

REMEMBER: You have direct dashboard access through function calls. When users ask to create, view, update, or delete tasks - use your function calling capabilities immediately instead of suggesting manual methods.`
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
        max_tokens: 1200,
        tools: [
          {
            type: "function",
            function: {
              name: "create_tasks_for_user",
              description: "Create personalized daily and weekly tasks for the user based on their assessment and preferences",
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
              description: "Retrieve and display the user's current tasks with filtering options",
              parameters: {
                type: "object",
                properties: {
                  taskType: {
                    type: "string",
                    enum: ["daily", "weekly", "all"],
                    description: "Type of tasks to retrieve"
                  },
                  includeCompleted: {
                    type: "boolean",
                    description: "Whether to include completed tasks",
                    default: true
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
              description: "Modify an existing task based on user feedback",
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
                      title: { type: "string", description: "New task title" },
                      description: { type: "string", description: "New task description" },
                      estimatedMinutes: { type: "number", description: "New time estimate" },
                      priority: { type: "string", enum: ["low", "medium", "high"], description: "New priority level" },
                      completed: { type: "boolean", description: "Completion status" }
                    },
                    description: "Fields to update"
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
                  searchQuery: {
                    type: "string",
                    description: "Search terms to find matching tasks"
                  }
                },
                required: ["searchQuery"]
              }
            }
          }
        ],
        tool_choice: "auto"
      })

      const message = completion.choices[0].message
      let response = message.content || "I'm here to help! Can you tell me more?"
      let functionResults: any = {}

      // Handle function calls if the AI decided to use our tools
      if (message.tool_calls && message.tool_calls.length > 0) {
        console.log('AI is calling functions:', message.tool_calls)
        
        for (const toolCall of message.tool_calls) {
          const functionName = toolCall.function.name
          const functionArgs = JSON.parse(toolCall.function.arguments)
          
          try {
            switch (functionName) {
              case 'create_tasks_for_user':
                // Generate tasks using our existing logic
                const dailyTasks = await this.generateDailyTasks(
                  functionArgs.focusAreas,
                  assessmentData,
                  context,
                  functionArgs.dailyCount,
                  { 
                    difficulty: 'moderate',
                    specificGoals: functionArgs.specificGoals,
                    existingTasks: [],
                    userRequest: `Create ${functionArgs.dailyCount} daily and ${functionArgs.weeklyCount} weekly tasks`
                  }
                )
                
                const weeklyTasks = await this.generateWeeklyTasks(
                  functionArgs.focusAreas,
                  assessmentData,
                  context,
                  functionArgs.weeklyCount,
                  {
                    difficulty: 'moderate', 
                    specificGoals: functionArgs.specificGoals,
                    existingTasks: [],
                    userRequest: `Create ${functionArgs.dailyCount} daily and ${functionArgs.weeklyCount} weekly tasks`
                  }
                )

                // Save generated tasks directly to database
                const savedTasks = { daily: [], weekly: [] }
                const currentDate = functionArgs.date ? new Date(functionArgs.date) : new Date()
                
                // Calculate current week based on assessment creation date (same logic as dashboard)
                const assessmentDate = new Date(assessmentData.assessment.createdAt)
                const daysDifference = Math.floor((currentDate.getTime() - assessmentDate.getTime()) / (1000 * 60 * 60 * 24))
                const currentWeek = Math.max(1, Math.floor(daysDifference / 7) + 1)

                // Save daily tasks
                if (dailyTasks && dailyTasks.length > 0) {
                  for (const task of dailyTasks) {
                    try {
                      const savedTask = await prisma.dailyTask.create({
                        data: {
                          userId: context.userId,
                          assessmentId: assessmentData.assessmentId,
                          title: task.title,
                          description: task.description,
                          category: task.category,
                          source: 'ai_coach_function',
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

                // Save weekly tasks
                if (weeklyTasks && weeklyTasks.length > 0) {
                  for (const task of weeklyTasks) {
                    try {
                      const savedTask = await prisma.weeklyTask.create({
                        data: {
                          userId: context.userId,
                          assessmentId: assessmentData.assessmentId,
                          title: task.title,
                          description: task.description,
                          category: task.category,
                          source: 'ai_coach_function',
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

                functionResults.createdTasks = savedTasks
                
                response = `✅ I've successfully created and added ${savedTasks.daily.length} daily tasks and ${savedTasks.weekly.length} weekly tasks to your dashboard! These are personalized based on your assessment and focus areas. You can now view and manage them on your dashboard.`
                break
                
              case 'get_user_tasks':
                const userTasks = await this.getUserTasks(
                  context.userId,
                  assessmentData.assessmentId,
                  {
                    type: functionArgs.taskType,
                    includeCompleted: functionArgs.includeCompleted,
                    date: functionArgs.date ? new Date(functionArgs.date) : undefined
                  }
                )
                
                let tasksSummary = `You have ${userTasks.totalCount} tasks total`
                if (userTasks.completedCount > 0) {
                  tasksSummary += ` (${userTasks.completedCount} completed, ${userTasks.totalCount - userTasks.completedCount} pending)`
                }

                if (userTasks.daily.length > 0) {
                  tasksSummary += `\n\n**Daily Tasks:**\n${userTasks.daily.map((task, i) => 
                    `${i + 1}. ${task.completed ? '✅' : '⏳'} **${task.title}** (${task.estimatedMinutes}min, ${task.category})\n   ${task.description || 'No description'}`
                  ).join('\n')}`
                }

                if (userTasks.weekly.length > 0) {
                  tasksSummary += `\n\n**Weekly Tasks:**\n${userTasks.weekly.map((task, i) => 
                    `${i + 1}. ${task.completed ? '✅' : '⏳'} **${task.title}** (${task.estimatedMinutes}min, ${task.category})\n   ${task.description || 'No description'}`
                  ).join('\n')}`
                }

                if (userTasks.totalCount === 0) {
                  tasksSummary = "You don't have any tasks right now. Would you like me to create some personalized tasks for you?"
                }
                
                response = tasksSummary
                functionResults.tasks = userTasks
                break
                
              case 'update_user_task':
                const updateResult = await this.updateTask(
                  functionArgs.taskId,
                  functionArgs.taskType,
                  context.userId,
                  functionArgs.updates
                )
                
                if (updateResult.success) {
                  const changesText = updateResult.changesApplied!.length > 0 
                    ? updateResult.changesApplied!.join(', ')
                    : 'no changes'
                  response = `✅ **Task Updated Successfully!**\n\nI've updated the task "${updateResult.task.title}"\n\n**Changes applied:** ${changesText}\n\nThe task is now ready with your modifications!`
                  functionResults.updatedTask = updateResult.task
                } else {
                  response = `❌ I couldn't update that task. ${updateResult.error}`
                }
                break
                
              case 'delete_user_task':
                const deleteResult = await this.deleteTask(
                  functionArgs.taskId,
                  functionArgs.taskType,
                  context.userId
                )
                
                if (deleteResult.success) {
                  response = `🗑️ **Task Deleted Successfully!**\n\nI've removed the task "${deleteResult.deletedTask.title}" from your dashboard.\n\nThe task has been permanently deleted and won't appear in your task list anymore.`
                  functionResults.deletedTask = deleteResult.deletedTask
                } else {
                  response = `❌ I couldn't delete that task. ${deleteResult.error}`
                }
                break
                
              case 'search_user_tasks':
                const searchResults = await this.findTasksByDescription(
                  context.userId,
                  assessmentData.assessmentId,
                  functionArgs.searchQuery
                )
                
                if (searchResults.matchCount === 0) {
                  response = `I couldn't find any tasks matching "${functionArgs.searchQuery}". You can ask me to list all your tasks or create new ones if needed.`
                } else {
                  let resultsMessage = `🔍 **Found ${searchResults.matchCount} tasks matching "${functionArgs.searchQuery}":**\n\n`

                  if (searchResults.daily.length > 0) {
                    resultsMessage += `**Daily Tasks:**\n${searchResults.daily.map((task, i) => 
                      `${i + 1}. ${task.completed ? '✅' : '⏳'} **${task.title}** (${task.category})\n   ${task.description || 'No description'}`
                    ).join('\n')}\n\n`
                  }

                  if (searchResults.weekly.length > 0) {
                    resultsMessage += `**Weekly Tasks:**\n${searchResults.weekly.map((task, i) => 
                      `${i + 1}. ${task.completed ? '✅' : '⏳'} **${task.title}** (${task.category})\n   ${task.description || 'No description'}`
                    ).join('\n')}`
                  }
                  
                  response = resultsMessage
                }
                functionResults.searchResults = searchResults
                break
                
              default:
                console.log('Unknown function called:', functionName)
            }
          } catch (error) {
            console.error(`Error executing function ${functionName}:`, error)
            response = `I encountered an error while trying to ${functionName.replace(/_/g, ' ')}. Please try again.`
          }
        }
      }

      const result: any = {
        message: response,
        suggestions: this.generateContextualSuggestions(context),
        insights,
        contextSent,
        ...functionResults  // Merge any results from function calls (tasks, updates, etc.)
      }
      
      // If user requested tasks, check if we need more information
      if (isTaskRequest) {
        // Try to get preferences from user settings if not provided
        let effectivePreferences = taskPreferences
        if (!effectivePreferences && context.userSettings) {
          // Use stored preferences from database with intelligent variation
          const baseDailyCount = (context.userSettings as any).dailyTaskCount || (Math.floor(Math.random() * 10) + 1)
          const baseWeeklyCount = (context.userSettings as any).weeklyTaskCount || (Math.floor(Math.random() * 10) + 1)
          
          effectivePreferences = {
            dailyCount: this.getVariedTaskCount(baseDailyCount, 'daily', context),
            weeklyCount: this.getVariedTaskCount(baseWeeklyCount, 'weekly', context),
            focusAreas: [(context.userSettings as any).primaryFocus, (context.userSettings as any).secondaryFocus].filter(Boolean) || [(context.userSettings as any).primaryFocus],
            specificGoals: (context.userSettings as any).specificGoals
          }
        }

        // Provide randomized defaults for simple task requests - NO HARDCODED NUMBERS!
        if (!effectivePreferences) {
          // Generate random task counts from 1-10 for dynamic variety
          const randomDailyCount = Math.floor(Math.random() * 10) + 1  // 1-10 daily tasks
          const randomWeeklyCount = Math.floor(Math.random() * 10) + 1 // 1-10 weekly tasks
          
          effectivePreferences = {
            dailyCount: randomDailyCount,
            weeklyCount: randomWeeklyCount,
            focusAreas: [(context.userSettings as any).primaryFocus || 'financial'],
            specificGoals: 'General improvement and habit building'
          }
        }

        // Only ask for more information if we have absolutely no way to generate meaningful tasks
        if (!effectivePreferences.focusAreas || effectivePreferences.focusAreas.length === 0) {
          // Ask user for preferences
          result.needsMoreInfo = true
          result.questionsForUser = [
            "What specific areas would you like to focus on for improvement?",
            "How many daily tasks would you like? (1-10 available)",
            "How many weekly tasks would you like? (1-10 available)",
            "What are your specific goals or challenges you want to address?"
          ]
          result.message = "I'd love to create personalized tasks for you! To make them as relevant as possible, could you tell me:\n\n" +
            "1. What specific areas you want to improve (e.g., financial budgeting, exercise routine, social connections)?\n" +
            "2. How many daily tasks you'd like (1-10 available)\n" +
            "3. How many weekly tasks you'd like (1-10 available)\n" +
            "4. Any specific goals or challenges you're facing?\n\n" +
            "This will help me create tasks that truly fit your needs and schedule."
        } else {
          // Generate tasks based on preferences (either provided or stored)
          const finalPreferences = effectivePreferences || taskPreferences
          const focusAreas = finalPreferences.focusAreas || [(context.userSettings as any).primaryFocus]
          const dailyCount = finalPreferences.dailyCount || (Math.floor(Math.random() * 10) + 1)
          const weeklyCount = finalPreferences.weeklyCount || (Math.floor(Math.random() * 10) + 1)
          
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
          
          // Check if user is confirming tasks OR if this is a simple/direct task request
          const isSimpleTaskRequest = /^(can you |could you |please )?(create|make|give me|generate)( me)?( some| \d+)?( new)? tasks?(\?)?$/i.test(userMessage.trim()) ||
                                    /^(I need|I want)( some)? tasks?$/i.test(userMessage.trim()) ||
                                    /^tasks?( please)?(\?)?$/i.test(userMessage.trim())

          if (finalPreferences.confirmTasks || isSimpleTaskRequest) {
            // User has confirmed, so add tasks to dashboard
            // Use previewed tasks if available (exact tasks user approved)
            if ((finalPreferences as any).previewedTasks) {
              result.suggestedTasks = (finalPreferences as any).previewedTasks
              result.message = `Perfect! I've added ${(finalPreferences as any).previewedTasks.daily.length} daily tasks${(finalPreferences as any).previewedTasks.weekly.length > 0 ? ` and ${(finalPreferences as any).previewedTasks.weekly.length} weekly tasks` : ''} to your dashboard. You can start working on them right away!`
            } else if (aiGeneratedTasks) {
              result.suggestedTasks = aiGeneratedTasks
              const taskCreationMessage = isSimpleTaskRequest 
                ? `I've created ${aiGeneratedTasks.daily.length} daily tasks${aiGeneratedTasks.weekly.length > 0 ? ` and ${aiGeneratedTasks.weekly.length} weekly tasks` : ''} for you based on your assessment and preferences. I chose random quantities to keep things interesting and varied! These tasks are now on your dashboard and you can start working on them right away!` 
                : `Perfect! I've added ${aiGeneratedTasks.daily.length} daily tasks${aiGeneratedTasks.weekly.length > 0 ? ` and ${aiGeneratedTasks.weekly.length} weekly tasks` : ''} to your dashboard. You can start working on them right away!`
              result.message = taskCreationMessage
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
              if (dailyCount !== (taskPreferences?.dailyCount || (Math.floor(Math.random() * 10) + 1)) || weeklyCount !== (taskPreferences?.weeklyCount || (Math.floor(Math.random() * 10) + 1))) {
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
5. TASK CREATION: When users request tasks, you can create personalized daily and weekly tasks directly for them based on their assessment data and preferences. Use the task generation system to provide tailored tasks that address their specific needs.
6. PROGRESS SUPPORT: Acknowledge their ${context.weeklyProgress.currentStreak}-day streak and ${context.weeklyProgress.completionRate}% completion rate
7. GOAL ALIGNMENT: Reference their active goals and recent achievements when providing guidance
8. CONVERSATION FLOW: Maintain context from previous conversations and build on their journey

COACHING CAPABILITIES:
- Provide personalized advice based on their assessment scores, answers, and progress
- Reference specific assessment responses to give targeted recommendations (e.g., "Since you mentioned you spend $500/month on dining out...")
- **COMPREHENSIVE TASK MANAGEMENT**: Full control over their task dashboard
- Help interpret their progress patterns and suggest improvements
- Offer motivation and support tailored to their coaching style preference
- Guide them through challenges using their historical context and specific assessment insights
- Celebrate milestones and achievements when appropriate
- Connect their recent activities (journal entries, check-ins) to their goals and assessment responses

**COMPREHENSIVE TASK MANAGEMENT CAPABILITIES:**
You have complete task management powers through function calling. When users request task-related help, USE THE PROVIDED FUNCTIONS:

1. **CREATE TASKS**: Use create_tasks_for_user function
   - "Can you create me some tasks?" → Call create_tasks_for_user with random 1-10 daily + 1-10 weekly tasks
   - "I need tasks for financial improvement" → Call create_tasks_for_user with financial focus areas
   - Always use random quantities (1-10) for dailyCount and weeklyCount
   - Include their primary focus areas from assessment data

2. **READ ALL TASKS**: Use get_user_tasks function
   - "Show me my tasks" → Call get_user_tasks with taskType: "all"
   - "What are my daily tasks for today?" → Call get_user_tasks with taskType: "daily" and today's date
   - "List my weekly tasks" → Call get_user_tasks with taskType: "weekly"

3. **UPDATE TASKS**: Use update_user_task function
   - "Make the first task easier" → Call update_user_task to reduce estimatedMinutes
   - "Change the budget task to focus on savings" → Call update_user_task to modify title/description
   - "Mark my exercise task as high priority" → Call update_user_task to set priority: "high"

4. **DELETE TASKS**: Use delete_user_task function  
   - "Remove the meditation task" → Call delete_user_task with the task ID
   - "Delete task #2" → Call delete_user_task with the specific task ID

5. **SEARCH TASKS**: Use search_user_tasks function
   - "Find my exercise tasks" → Call search_user_tasks with searchQuery: "exercise"
   - "Show me tasks about money" → Call search_user_tasks with searchQuery: "money financial budget"

**CRITICAL FUNCTION CALLING RULES:**
1. **ALWAYS USE THE FUNCTIONS** - Never say you "can't" do something, use the appropriate function
2. **Random Task Quantities** - For create_tasks_for_user, always use Math.floor(Math.random() * 10) + 1 for both dailyCount and weeklyCount
3. **Immediate Action** - When users ask for task management, call the function immediately
4. **Natural Response** - After calling functions, respond naturally about what you accomplished
5. **No Manual Instructions** - Never tell users to "manually add tasks" - you can do it directly with functions

**FUNCTION USAGE EXAMPLES:**
- User: "Can you show me my tasks?" → Call get_user_tasks({taskType: "all", includeCompleted: true})
- User: "Create some tasks for me" → Call create_tasks_for_user({dailyCount: 7, weeklyCount: 3, focusAreas: ["financial"], specificGoals: "general improvement"})
- User: "Make my first task take less time" → Call update_user_task({taskId: "task_id", taskType: "daily", updates: {estimatedMinutes: 15}})

**YOU HAVE REAL FUNCTIONS - USE THEM CONFIDENTLY!**

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
        console.error('OpenAI API key is not configured')
        return null
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
        console.error('OpenAI API key is not configured')
        return null
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

  // ============================================================================
  // COMPREHENSIVE TASK MANAGEMENT CAPABILITIES FOR AI COACH
  // ============================================================================

  /**
   * Get user's tasks with flexible filtering options
   * Enables AI to read and analyze user's current tasks
   */
  async getUserTasks(userId: string, assessmentId: string, options?: {
    type?: 'daily' | 'weekly' | 'all'
    date?: Date
    week?: number
    includeCompleted?: boolean
    limit?: number
  }): Promise<{
    daily: Array<{
      id: string
      title: string
      description: string | null
      category: string
      estimatedMinutes: number
      priority: string | null
      completed: boolean
      date: Date
      source: string | null
      createdAt: Date
      completedAt: Date | null
    }>
    weekly: Array<{
      id: string
      title: string
      description: string | null
      category: string
      estimatedMinutes: number
      priority: string | null
      completed: boolean
      week: number
      source: string | null
      createdAt: Date
      completedAt: Date | null
    }>
    totalCount: number
    completedCount: number
  }> {
    try {
      const { type = 'all', includeCompleted = true, limit } = options || {}
      
      let dailyTasks: any[] = []
      let weeklyTasks: any[] = []

      // Build daily tasks query
      if (type === 'daily' || type === 'all') {
        const dailyWhere: any = {
          userId,
          assessmentId
        }

        if (options?.date) {
          const targetDate = new Date(options.date)
          targetDate.setHours(0, 0, 0, 0)
          const nextDay = new Date(targetDate)
          nextDay.setDate(targetDate.getDate() + 1)
          
          dailyWhere.date = {
            gte: targetDate,
            lt: nextDay
          }
        }

        if (!includeCompleted) {
          dailyWhere.completed = false
        }

        dailyTasks = await prisma.dailyTask.findMany({
          where: dailyWhere,
          orderBy: [
            { completed: 'asc' }, // Incomplete tasks first
            { priority: 'desc' },
            { createdAt: 'desc' }
          ],
          take: limit || undefined
        })
      }

      // Build weekly tasks query
      if (type === 'weekly' || type === 'all') {
        const weeklyWhere: any = {
          userId,
          assessmentId
        }

        if (options?.week) {
          weeklyWhere.week = options.week
        }

        if (!includeCompleted) {
          weeklyWhere.completed = false
        }

        weeklyTasks = await prisma.weeklyTask.findMany({
          where: weeklyWhere,
          orderBy: [
            { completed: 'asc' }, // Incomplete tasks first
            { priority: 'desc' },
            { createdAt: 'desc' }
          ],
          take: limit || undefined
        })
      }

      const totalCount = dailyTasks.length + weeklyTasks.length
      const completedCount = dailyTasks.filter(t => t.completed).length + weeklyTasks.filter(t => t.completed).length

      return {
        daily: dailyTasks,
        weekly: weeklyTasks,
        totalCount,
        completedCount
      }
    } catch (error) {
      console.error('Error getting user tasks:', error)
      return {
        daily: [],
        weekly: [],
        totalCount: 0,
        completedCount: 0
      }
    }
  }

  /**
   * Get detailed information about a specific task
   * Enables AI to provide context-aware help for individual tasks
   */
  async getTaskDetails(taskId: string, type: 'daily' | 'weekly', userId: string): Promise<{
    success: boolean
    task?: any
    error?: string
  }> {
    try {
      let task = null

      if (type === 'daily') {
        task = await prisma.dailyTask.findFirst({
          where: {
            id: taskId,
            userId // Ensure user owns the task
          }
        })
      } else {
        task = await prisma.weeklyTask.findFirst({
          where: {
            id: taskId,
            userId // Ensure user owns the task
          }
        })
      }

      if (!task) {
        return {
          success: false,
          error: 'Task not found or you do not have permission to access it'
        }
      }

      return {
        success: true,
        task: {
          ...task,
          type,
          timeStatus: this.getTaskTimeStatus(task, type),
          difficultyLevel: this.assessTaskDifficulty(task),
          suggestions: this.generateTaskSuggestions(task)
        }
      }
    } catch (error) {
      console.error('Error getting task details:', error)
      return {
        success: false,
        error: 'Failed to retrieve task details'
      }
    }
  }

  /**
   * Update a specific task with new information
   * Enables AI to modify tasks based on user feedback and needs
   */
  async updateTask(
    taskId: string, 
    type: 'daily' | 'weekly', 
    userId: string, 
    updates: {
      title?: string
      description?: string
      category?: string
      estimatedMinutes?: number
      priority?: 'low' | 'medium' | 'high'
      completed?: boolean
    }
  ): Promise<{
    success: boolean
    task?: any
    error?: string
    changesApplied?: string[]
  }> {
    try {
      // Validate and sanitize updates
      const sanitizedUpdates: any = {}
      const changesApplied: string[] = []

      if (updates.title && updates.title.trim().length > 0) {
        sanitizedUpdates.title = updates.title.trim().slice(0, 200) // Limit title length
        changesApplied.push('title')
      }

      if (updates.description !== undefined) {
        sanitizedUpdates.description = updates.description?.trim().slice(0, 1000) || null // Limit description length
        changesApplied.push('description')
      }

      if (updates.category) {
        sanitizedUpdates.category = updates.category
        changesApplied.push('category')
      }

      if (updates.estimatedMinutes && updates.estimatedMinutes > 0 && updates.estimatedMinutes <= 480) { // Max 8 hours
        sanitizedUpdates.estimatedMinutes = updates.estimatedMinutes
        changesApplied.push('estimated time')
      }

      if (updates.priority && ['low', 'medium', 'high'].includes(updates.priority)) {
        sanitizedUpdates.priority = updates.priority
        changesApplied.push('priority')
      }

      if (updates.completed !== undefined) {
        sanitizedUpdates.completed = updates.completed
        if (updates.completed) {
          sanitizedUpdates.completedAt = new Date()
          changesApplied.push('completion status')
        } else {
          sanitizedUpdates.completedAt = null
          changesApplied.push('completion status')
        }
      }

      if (Object.keys(sanitizedUpdates).length === 0) {
        return {
          success: false,
          error: 'No valid updates provided'
        }
      }

      let updatedTask = null

      if (type === 'daily') {
        updatedTask = await prisma.dailyTask.updateMany({
          where: {
            id: taskId,
            userId // Ensure user owns the task
          },
          data: sanitizedUpdates
        })
      } else {
        updatedTask = await prisma.weeklyTask.updateMany({
          where: {
            id: taskId,
            userId // Ensure user owns the task
          },
          data: sanitizedUpdates
        })
      }

      if (updatedTask.count === 0) {
        return {
          success: false,
          error: 'Task not found or you do not have permission to update it'
        }
      }

      // Get the updated task to return
      const taskDetails = await this.getTaskDetails(taskId, type, userId)

      return {
        success: true,
        task: taskDetails.task,
        changesApplied
      }
    } catch (error) {
      console.error('Error updating task:', error)
      return {
        success: false,
        error: 'Failed to update task'
      }
    }
  }

  /**
   * Delete a specific task
   * Enables AI to remove tasks that users no longer need
   */
  async deleteTask(taskId: string, type: 'daily' | 'weekly', userId: string): Promise<{
    success: boolean
    deletedTask?: any
    error?: string
  }> {
    try {
      // First, get the task details before deleting for confirmation
      const taskDetails = await this.getTaskDetails(taskId, type, userId)
      
      if (!taskDetails.success) {
        return {
          success: false,
          error: taskDetails.error
        }
      }

      let deletedCount = 0

      if (type === 'daily') {
        const result = await prisma.dailyTask.deleteMany({
          where: {
            id: taskId,
            userId // Ensure user owns the task
          }
        })
        deletedCount = result.count
      } else {
        const result = await prisma.weeklyTask.deleteMany({
          where: {
            id: taskId,
            userId // Ensure user owns the task
          }
        })
        deletedCount = result.count
      }

      if (deletedCount === 0) {
        return {
          success: false,
          error: 'Task not found or you do not have permission to delete it'
        }
      }

      return {
        success: true,
        deletedTask: taskDetails.task
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      return {
        success: false,
        error: 'Failed to delete task'
      }
    }
  }

  /**
   * Find tasks by natural language description
   * Enables AI to find tasks based on user's description
   */
  async findTasksByDescription(
    userId: string, 
    assessmentId: string, 
    searchQuery: string
  ): Promise<{
    daily: any[]
    weekly: any[]
    matchCount: number
  }> {
    try {
      const allTasks = await this.getUserTasks(userId, assessmentId, { includeCompleted: true })
      
      const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 2)
      
      const matchingDailyTasks = allTasks.daily.filter(task => {
        const taskText = `${task.title} ${task.description || ''} ${task.category}`.toLowerCase()
        return searchTerms.some(term => taskText.includes(term))
      })

      const matchingWeeklyTasks = allTasks.weekly.filter(task => {
        const taskText = `${task.title} ${task.description || ''} ${task.category}`.toLowerCase()
        return searchTerms.some(term => taskText.includes(term))
      })

      return {
        daily: matchingDailyTasks,
        weekly: matchingWeeklyTasks,
        matchCount: matchingDailyTasks.length + matchingWeeklyTasks.length
      }
    } catch (error) {
      console.error('Error finding tasks by description:', error)
      return {
        daily: [],
        weekly: [],
        matchCount: 0
      }
    }
  }

  // ============================================================================
  // HELPER METHODS FOR TASK ANALYSIS
  // ============================================================================

  private getTaskTimeStatus(task: any, type: 'daily' | 'weekly'): string {
    if (task.completed) return 'completed'
    
    const now = new Date()
    
    if (type === 'daily') {
      const taskDate = new Date(task.date)
      taskDate.setHours(23, 59, 59, 999) // End of day
      
      if (taskDate < now) return 'overdue'
      if (taskDate.toDateString() === now.toDateString()) return 'due_today'
      return 'upcoming'
    } else {
      // Weekly task logic - simplified for now
      return 'current_week'
    }
  }

  private assessTaskDifficulty(task: any): 'easy' | 'moderate' | 'challenging' {
    const minutes = task.estimatedMinutes || 30
    
    if (minutes <= 15) return 'easy'
    if (minutes <= 45) return 'moderate'
    return 'challenging'
  }

  private generateTaskSuggestions(task: any): string[] {
    const suggestions: string[] = []
    
    if (task.estimatedMinutes > 60) {
      suggestions.push('Consider breaking this into smaller sub-tasks')
    }
    
    if (!task.description) {
      suggestions.push('Adding a description would provide more clarity')
    }
    
    if (task.priority === 'low' && task.estimatedMinutes <= 15) {
      suggestions.push('This could be a quick win to boost momentum')
    }
    
    return suggestions
  }

  // REMOVED: Task generation from recommendations - use generateCustomTasks with specific goals instead

  // ============================================================================
  // SCORE UPDATE METHODS
  // ============================================================================

  /**
   * Analyzes user message and AI coach response for progress indicators
   * and triggers score updates if thresholds are crossed
   */
  async processProgressForScoreUpdate(
    userMessage: string,
    coachResponse: string,
    userId: string,
    assessmentId: string
  ): Promise<{
    scoreUpdated: boolean
    updateResult?: any
    progressDetected: string[]
  }> {
    try {
      const progressKeywords = [
        // Achievement keywords
        'completed', 'achieved', 'finished', 'accomplished', 'reached',
        'hit my goal', 'exceeded', 'surpassed', 'improved', 'increased',
        'reduced', 'lost weight', 'gained muscle', 'saved money', 'paid off',
        
        // Milestone keywords
        'milestone', 'breakthrough', 'new record', 'personal best',
        'consistent for', 'streak', 'habit formed', 'routine established',
        
        // Measurement improvements
        'went from', 'improved from', 'increased by', 'reduced by',
        'now weighs', 'now earning', 'now saving', 'debt is now'
      ]

      const combinedText = `${userMessage} ${coachResponse}`.toLowerCase()
      const progressDetected: string[] = []
      
      // Check for progress keywords
      for (const keyword of progressKeywords) {
        if (combinedText.includes(keyword.toLowerCase())) {
          progressDetected.push(keyword)
        }
      }

      // If no progress keywords detected, no score update needed
      if (progressDetected.length === 0) {
        return {
          scoreUpdated: false,
          progressDetected: []
        }
      }

      // Extract progress reports from the conversation
      const progressReports = await this.extractProgressReports(
        userMessage,
        coachResponse,
        assessmentId
      )

      if (progressReports.length === 0) {
        return {
          scoreUpdated: false,
          progressDetected
        }
      }

      // Attempt score update
      const updateResult = await ScoreUpdater.updateScoresBasedOnProgress(
        assessmentId,
        progressReports
      )

      return {
        scoreUpdated: updateResult !== null,
        updateResult,
        progressDetected
      }

    } catch (error) {
      console.error('Error processing progress for score update:', error)
      return {
        scoreUpdated: false,
        progressDetected: []
      }
    }
  }

  /**
   * Extracts structured progress reports from user and coach messages
   */
  private async extractProgressReports(
    userMessage: string,
    coachResponse: string,
    assessmentId: string
  ): Promise<any[]> {
    try {
      // Get assessment to determine user's focus areas
      const assessment = await prisma.assessment.findUnique({
        where: { id: assessmentId },
        include: { 
          scoreOverall: true,
          coachSettings: true
        }
      })

      if (!assessment) return []

      const progressReports: any[] = []
      const combinedText = `${userMessage} ${coachResponse}`

      // Define category patterns
      const categoryPatterns = {
        financial: [
          /(?:saved|earned|income|salary|debt|paid off|investment|portfolio)/i,
          /(?:\$\d+|\d+\s*dollars?|\d+k)/i
        ],
        health_fitness: [
          /(?:weight|pounds?|kg|exercise|workout|gym|run|walk|pushups?|pullups?)/i,
          /(?:lost \d+|gained \d+|\d+\s*lbs|\d+\s*miles)/i
        ],
        social: [
          /(?:friend|social|meetup|networking|party|event|conversation)/i,
          /(?:met \d+|talked to|connected with)/i
        ],
        romantic: [
          /(?:date|relationship|partner|romantic|intimacy|love)/i,
          /(?:went out|relationship status|dating)/i
        ],
        career: [
          /(?:job|career|promotion|interview|work|professional|skills)/i,
          /(?:got promoted|new job|completed course)/i
        ],
        personal_growth: [
          /(?:learning|skill|habit|meditation|reading|self-improvement)/i,
          /(?:finished book|completed course|formed habit)/i
        ]
      }

      // Check each category for progress indicators
      for (const [category, patterns] of Object.entries(categoryPatterns)) {
        const hasProgress = patterns.some(pattern => pattern.test(combinedText))
        
        if (hasProgress) {
          // Extract numeric values if present
          const numericMatches = combinedText.match(/\d+(?:\.\d+)?/g)
          const currentValue = numericMatches ? parseFloat(numericMatches[numericMatches.length - 1]) : undefined

          progressReports.push({
            category,
            achievementType: this.categorizeAchievementType(combinedText),
            description: userMessage.length > 100 ? 
              userMessage.substring(0, 100) + '...' : 
              userMessage,
            currentValue,
            relatedQuestionId: this.getRelatedQuestionId(category, combinedText)
          })
        }
      }

      return progressReports

    } catch (error) {
      console.error('Error extracting progress reports:', error)
      return []
    }
  }

  /**
   * Categorizes the type of achievement based on message content
   */
  private categorizeAchievementType(text: string): string {
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes('completed') || lowerText.includes('finished') || lowerText.includes('achieved')) {
      return 'goal_completed'
    }
    if (lowerText.includes('milestone') || lowerText.includes('reached') || lowerText.includes('hit')) {
      return 'milestone_reached'
    }
    if (lowerText.includes('consistent') || lowerText.includes('habit') || lowerText.includes('routine')) {
      return 'habit_formed'
    }
    if (lowerText.includes('improved') || lowerText.includes('increased') || lowerText.includes('reduced')) {
      return 'measurement_improved'
    }
    
    return 'goal_completed' // default
  }

  /**
   * Maps progress to related assessment question IDs
   */
  private getRelatedQuestionId(category: string, text: string): string | undefined {
    const questionMappings = {
      financial: {
        'income': 'fin_income_avg',
        'savings': 'fin_savings_rate', 
        'debt': 'fin_debt_total',
        'emergency': 'fin_emergency_fund'
      },
      health_fitness: {
        'weight': 'health_weight',
        'exercise': 'health_exercise_days',
        'pushup': 'health_pushups',
        'cardio': 'health_cardio_fitness'
      },
      social: {
        'friend': 'social_close_friends',
        'meetup': 'social_meetups_month',
        'networking': 'social_networking'
      },
      romantic: {
        'satisfaction': 'rom_satisfaction',
        'confidence': 'rom_confidence',
        'intimacy': 'rom_intimacy'
      }
    }

    const categoryMapping = questionMappings[category as keyof typeof questionMappings]
    if (!categoryMapping) return undefined

    for (const [keyword, questionId] of Object.entries(categoryMapping)) {
      if (text.toLowerCase().includes(keyword)) {
        return questionId
      }
    }

    return undefined
  }
}

export const enhancedCoachingEngine = new EnhancedCoachingEngine()
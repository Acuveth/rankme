import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
// REMOVED: Basic coaching functions - using enhancedCoachingEngine only
import { enhancedCoachingEngine } from '@/lib/enhanced-coaching'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url)
    const skipOpenAI = url.searchParams.get('skipOpenAI') === 'true'
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          where: {
            status: 'active',
            product: 'ai_coach_monthly'
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has active AI Coach subscription
    if (user.subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No active AI Coach subscription' },
        { status: 403 }
      )
    }

    // Get the assessment with scores and categorized answers
    const assessment = await prisma.assessment.findUnique({
      where: { 
        id: params.id,
        userId: user.id // Make sure user owns this assessment
      },
      include: {
        scoreCategory: true,
        scoreOverall: true,
        categorizedAnswers: true,
        answers: true
      }
    })

    if (!assessment || !assessment.scoreOverall) {
      return NextResponse.json(
        { error: 'Assessment not found or incomplete' },
        { status: 404 }
      )
    }

    // Parse categorized answers if available
    let categorizedAnswers = null
    if (assessment.categorizedAnswers) {
      categorizedAnswers = {
        financial: JSON.parse(assessment.categorizedAnswers.financialAnswers),
        health_fitness: JSON.parse(assessment.categorizedAnswers.healthFitnessAnswers),
        social: JSON.parse(assessment.categorizedAnswers.socialAnswers),
        romantic: JSON.parse(assessment.categorizedAnswers.romanticAnswers),
        career: JSON.parse(assessment.categorizedAnswers.careerAnswers),
        personal_growth: JSON.parse(assessment.categorizedAnswers.personalGrowthAnswers)
      }
    }

    // Generate AI coaching insights using LLM based on assessment results
    const assessmentData = {
      assessmentId: assessment.id,  // Add assessment ID for function calls
      overall: {
        score: assessment.scoreOverall.overall,
        percentile: assessment.scoreOverall.percentileOverall
      },
      categories: {
        financial: assessment.scoreOverall.percentileFinancial,
        health: assessment.scoreOverall.percentileHealth,
        social: assessment.scoreOverall.percentileSocial,
        romantic: assessment.scoreOverall.percentileRomantic,
        career: assessment.scoreOverall.percentileCareer,
        personal_growth: assessment.scoreOverall.percentilePersonalGrowth
      },
      scores: {
        financial: assessment.scoreCategory?.financial,
        health_fitness: assessment.scoreCategory?.healthFitness,
        social: assessment.scoreCategory?.social,
        romantic: assessment.scoreCategory?.romantic,
        career: assessment.scoreCategory?.career,
        personal_growth: assessment.scoreCategory?.personalGrowth
      },
      categorizedAnswers: categorizedAnswers,
      cohort: {
        age_band: assessment.cohortAge,
        sex: assessment.cohortSex,
        region: assessment.cohortRegion
      },
      completionTime: assessment.completionTime || undefined
    }

    // Use enhanced coaching engine for all coach interactions
    let coachingData = null
    if (!skipOpenAI) {
      try {
        // Enhanced coaching provides comprehensive coaching through chat interactions
        // Basic coaching data is no longer generated here
        coachingData = {
          summary: "Welcome to your personalized AI coach! Start a conversation to get customized guidance and tasks.",
          focus_area: focusArea,
          available_features: [
            "Personalized chat interactions with full context awareness",
            "Custom task generation with detailed preferences",
            "Progress tracking and adaptive recommendations"
          ]
        }
      } catch (error) {
        console.error('Enhanced coaching initialization error:', error)
        coachingData = {
          summary: "AI coaching temporarily unavailable. Please try again later.",
          focus_area: focusArea
        }
      }
    }

    // Load coach settings for this specific assessment to get focus area
    const coachSettings = await prisma.coachSettings.findUnique({
      where: {
        userId_assessmentId: {
          userId: user.id,
          assessmentId: params.id
        }
      }
    })

    // Get the lowest category as fallback focus area
    const getLowestCategory = (categories: any) => {
      const categoryPercentiles = [
        { name: 'financial', percentile: categories.financial },
        { name: 'health', percentile: categories.health },
        { name: 'social', percentile: categories.social },
        { name: 'romantic', percentile: categories.romantic }
      ]
      
      categoryPercentiles.sort((a, b) => a.percentile - b.percentile)
      return categoryPercentiles[0].name
    }

    const focusArea = coachSettings?.primaryFocus || getLowestCategory({
      financial: assessment.scoreOverall.percentileFinancial,
      health: assessment.scoreOverall.percentileHealth,
      social: assessment.scoreOverall.percentileSocial,
      romantic: assessment.scoreOverall.percentileRomantic
    })

    return NextResponse.json({
      assessment: {
        id: assessment.id,
        createdAt: assessment.createdAt,
        completionTime: assessment.completionTime,
        overall: {
          score: assessment.scoreOverall.overall,
          percentile: assessment.scoreOverall.percentileOverall
        },
        categories: {
          financial: assessment.scoreOverall.percentileFinancial,
          health: assessment.scoreOverall.percentileHealth,
          social: assessment.scoreOverall.percentileSocial,
          romantic: assessment.scoreOverall.percentileRomantic
        }
      },
      user: {
        id: user.id,
        focus_area: focusArea,
        subscription_status: user.subscriptions.length > 0 ? user.subscriptions[0].status : 'none',
        trial_days_left: user.subscriptions.length > 0 ? Math.max(0, Math.ceil((new Date(user.subscriptions[0].periodEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0
      },
      coaching: coachingData,
      subscription: {
        status: user.subscriptions[0]?.status || 'none',
        periodEnd: user.subscriptions[0]?.periodEnd || null
      }
    })
  } catch (error) {
    console.error('Error fetching coach data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coach data' },
      { status: 500 }
    )
  }
}


export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, data } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          where: {
            status: 'active',
            product: 'ai_coach_monthly'
          }
        }
      }
    })

    if (!user || user.subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No active AI Coach subscription' },
        { status: 403 }
      )
    }

    // Get the assessment for context
    const assessment = await prisma.assessment.findUnique({
      where: { 
        id: params.id,
        userId: user.id 
      },
      include: {
        scoreOverall: true
      }
    })

    if (!assessment || !assessment.scoreOverall) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    const assessmentData = {
      assessmentId: assessment.id,  // Add assessment ID for function calls
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
        age_band: assessment.cohortAge,
        sex: assessment.cohortSex,
        region: assessment.cohortRegion
      },
      completionTime: assessment.completionTime || undefined
    }

    // Handle different coach actions
    switch (action) {
      case 'complete_checkin':
        // In a real app, you'd save this to the database
        return NextResponse.json({ 
          success: true, 
          message: 'Check-in completed! Great job staying consistent.' 
        })
      
      case 'update_goal':
        // In a real app, you'd update user goals in the database
        return NextResponse.json({ 
          success: true, 
          message: 'Goal updated successfully!' 
        })

      case 'chat':
        const startTime = Date.now()
        const { message, taskPreferences, useAssistantsAPI } = data
        
        // Determine which API to use (default to Assistants API for better performance)
        const shouldUseAssistantsAPI = useAssistantsAPI !== false
        
        // Handle with Assistants API (persistent memory, optimal token usage)
        if (shouldUseAssistantsAPI) {
          try {
            // Gather user context for assistant
            const context = await enhancedCoachingEngine.gatherUserContext(user.id, assessment.id)
            
            // Use Assistants API for the conversation
            const assistantsResponse = await enhancedCoachingEngine.generateEnhancedCoachResponseWithAssistants(
              message,
              user.id,
              assessment.id,
              assessmentData,
              context
            )
            
            // Process the conversation for potential score updates
            const scoreUpdateResult = await enhancedCoachingEngine.processProgressForScoreUpdate(
              message,
              assistantsResponse.message,
              user.id,
              assessment.id
            )
            
            const responseTime = Date.now() - startTime
            
            return NextResponse.json({
              success: true,
              response: {
                message: assistantsResponse.message,
                suggestions: assistantsResponse.suggestions,
                apiType: 'assistants',
                threadId: assistantsResponse.threadId,
                assistantId: assistantsResponse.assistantId
              },
              insights: assistantsResponse.insights,
              context: {
                streak: context.weeklyProgress.currentStreak,
                completionRate: context.weeklyProgress.weeklyCompletionRate,
                activeGoals: context.goalProgress.length,
                recentAchievements: context.achievements.length
              },
              optimization: {
                apiType: 'assistants',
                tokenUsage: assistantsResponse.tokenUsage,
                persistentMemory: true,
                contextStored: true
              },
              scoreUpdate: scoreUpdateResult.scoreUpdated ? {
                updated: true,
                improvementAreas: scoreUpdateResult.updateResult?.improvementAreas || [],
                scoreChange: scoreUpdateResult.updateResult ? {
                  oldOverall: scoreUpdateResult.updateResult.oldScores.overall,
                  newOverall: scoreUpdateResult.updateResult.newScores.overall,
                  improvement: scoreUpdateResult.updateResult.newScores.overall - scoreUpdateResult.updateResult.oldScores.overall
                } : null
              } : { updated: false },
              responseTime
            })
            
          } catch (error) {
            console.error('Assistants API error, falling back to standard API:', error)
            // Fall through to standard API on error
          }
        }

        // Save user message for standard API flow
        await enhancedCoachingEngine.saveChatMessage(
          user.id,
          'user',
          message,
          assessment.id
        )
        
        // ============================================================================
        // COMPREHENSIVE TASK MANAGEMENT REQUEST DETECTION AND ROUTING
        // ============================================================================
        
        // Detect different types of task management requests
        const taskManagementPatterns = {
          // READ ALL TASKS
          readAllTasks: /^(can you |could you |please )?(show|list|what are|display|view).*(my |all |current )?tasks?(\?)?$|^(tasks?|my tasks?)(\?)?$/i,
          readDailyTasks: /(can you |could you |please )?(show|list|what are).*(daily|today).*(tasks?)/i,
          readWeeklyTasks: /(can you |could you |please )?(show|list|what are).*(weekly|this week).*(tasks?)/i,
          
          // READ INDIVIDUAL TASK
          readTaskDetails: /(tell me (more )?about|show me details|what.s).*(task|the .*(task|one))/i,
          
          // UPDATE TASKS
          updateTask: /(make|change|update|modify|edit).*(task|first|second|third|the .*(task|one)|my .*task)/i,
          markComplete: /(mark|set).*(complete|done|finished)/i,
          
          // DELETE TASKS
          deleteTask: /(delete|remove|get rid of).*(task|first|second|third|the .*(task|one)|my .*task)/i,
          
          // SEARCH TASKS
          searchTasks: /(find|search for|look for).*(task|tasks)/i,
          
          // CREATE TASKS
          createTasks: /(can you |could you |please )?(create|make|add|generate|give me).*(task|tasks)/i
        }
        
        // Route to appropriate task management action
        if (taskManagementPatterns.readAllTasks.test(message)) {
          return await handleTaskManagementAction('read_all_tasks', { taskType: 'all', includeCompleted: true }, user, assessment, params.id)
        }
        
        if (taskManagementPatterns.readDailyTasks.test(message)) {
          return await handleTaskManagementAction('read_all_tasks', { taskType: 'daily', taskDate: new Date().toISOString(), includeCompleted: true }, user, assessment, params.id)
        }
        
        if (taskManagementPatterns.readWeeklyTasks.test(message)) {
          const currentWeek = Math.ceil((Date.now() - new Date('2024-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000))
          return await handleTaskManagementAction('read_all_tasks', { taskType: 'weekly', taskWeek: currentWeek, includeCompleted: true }, user, assessment, params.id)
        }
        
        if (taskManagementPatterns.searchTasks.test(message)) {
          // Extract search query from message
          const searchMatch = message.match(/(find|search for|look for).*?(tasks?).*?["']?([^"']*?)["']?$/i)
          const searchQuery = searchMatch ? searchMatch[3] || message.replace(/(find|search for|look for).*(tasks?)/i, '').trim() : message
          return await handleTaskManagementAction('find_tasks', { searchQuery }, user, assessment, params.id)
        }
        
        if (taskManagementPatterns.createTasks.test(message)) {
          // Handle task creation request - let AI coach handle this with its existing logic
          // Don't return here, let it fall through to the enhanced coach response
        }
        
        // For task details, updates, and deletions, we'll need to first get all tasks to identify which one they mean
        if (taskManagementPatterns.readTaskDetails.test(message) || taskManagementPatterns.updateTask.test(message) || taskManagementPatterns.deleteTask.test(message)) {
          // Get all current tasks to enable AI to identify which task user is referring to
          const allTasks = await enhancedCoachingEngine.getUserTasks(user.id, assessment.id, { includeCompleted: false })
          
          // Add task context to the message for AI to process
          const taskContext = {
            userTasks: allTasks,
            requestType: taskManagementPatterns.readTaskDetails.test(message) ? 'details' : 
                        taskManagementPatterns.updateTask.test(message) ? 'update' : 'delete',
            originalMessage: message
          }
          
          // Let the AI coach handle this with full task context
          data.taskContext = taskContext
        }
        
        // Helper function for task management actions
        async function handleTaskManagementAction(action: string, actionData: any, user: any, assessment: any, assessmentId: string) {
          try {
            // Handle the action directly based on action type
            if (action === 'read_all_tasks') {
              const { taskType = 'all', includeCompleted = true, taskDate, taskWeek } = actionData
              const allTasks = await enhancedCoachingEngine.getUserTasks(
                user.id,
                assessment.id,
                {
                  type: taskType,
                  date: taskDate ? new Date(taskDate) : undefined,
                  week: taskWeek,
                  includeCompleted
                }
              )

              let responseMessage = `You have ${allTasks.totalCount} tasks total`
              if (allTasks.completedCount > 0) {
                responseMessage += ` (${allTasks.completedCount} completed, ${allTasks.totalCount - allTasks.completedCount} pending)`
              }

              if (allTasks.daily.length > 0) {
                responseMessage += `\n\n**Daily Tasks:**\n${allTasks.daily.map((task, i) => 
                  `${i + 1}. ${task.completed ? '✅' : '⏳'} **${task.title}** (${task.estimatedMinutes}min, ${task.category})\n   ${task.description || 'No description'}`
                ).join('\n')}`
              }

              if (allTasks.weekly.length > 0) {
                responseMessage += `\n\n**Weekly Tasks:**\n${allTasks.weekly.map((task, i) => 
                  `${i + 1}. ${task.completed ? '✅' : '⏳'} **${task.title}** (${task.estimatedMinutes}min, ${task.category})\n   ${task.description || 'No description'}`
                ).join('\n')}`
              }

              if (allTasks.totalCount === 0) {
                responseMessage = "You don't have any tasks right now. Would you like me to create some personalized tasks for you?"
              }

              await enhancedCoachingEngine.saveChatMessage(
                user.id,
                'assistant',
                responseMessage,
                assessment.id
              )

              return NextResponse.json({
                success: true,
                message: responseMessage,
                tasks: allTasks
              })
            }
            
            if (action === 'find_tasks') {
              const { searchQuery } = actionData
              const searchResults = await enhancedCoachingEngine.findTasksByDescription(
                user.id,
                assessment.id,
                searchQuery
              )

              if (searchResults.matchCount === 0) {
                const noResultsMessage = `I couldn't find any tasks matching "${searchQuery}". You can ask me to list all your tasks or create new ones if needed.`
                
                await enhancedCoachingEngine.saveChatMessage(
                  user.id,
                  'assistant',
                  noResultsMessage,
                  assessment.id
                )

                return NextResponse.json({
                  success: true,
                  message: noResultsMessage,
                  searchResults
                })
              }

              let resultsMessage = `🔍 **Found ${searchResults.matchCount} tasks matching "${searchQuery}":**\n\n`

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

              await enhancedCoachingEngine.saveChatMessage(
                user.id,
                'assistant',
                resultsMessage,
                assessment.id
              )

              return NextResponse.json({
                success: true,
                message: resultsMessage,
                searchResults
              })
            }
          } catch (error) {
            console.error(`Error handling ${action}:`, error)
            const errorMessage = "I encountered an error while managing your tasks. Please try again."
            
            await enhancedCoachingEngine.saveChatMessage(
              user.id,
              'assistant',
              errorMessage,
              assessment.id
            )

            return NextResponse.json({
              success: false,
              message: errorMessage
            })
          }
        }
        
        // ============================================================================
        // LEGACY TASK HANDLING (keep for backward compatibility)
        // ============================================================================
        
        // Check if user is asking to list their tasks
        const isListRequest = /list.*tasks?|show.*tasks?|what.*tasks?|my tasks?|current tasks?/i.test(message)
        
        // Handle list tasks request
        if (isListRequest) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const nextDay = new Date(today)
          nextDay.setDate(today.getDate() + 1)
          const currentWeek = Math.floor((Date.now() - Date.UTC(2024, 0, 1)) / (1000 * 60 * 60 * 24 * 7)) + 1
          
          try {
            // Get daily tasks for today FOR THIS ASSESSMENT
            const dailyTasks = await prisma.dailyTask.findMany({
              where: {
                userId: user.id,
                assessmentId: params.id,
                date: {
                  gte: today,
                  lt: nextDay
                }
              }
            })
            
            // Get weekly tasks for current week FOR THIS ASSESSMENT
            const weeklyTasks = await prisma.weeklyTask.findMany({
              where: {
                userId: user.id,
                assessmentId: params.id,
                week: currentWeek
              }
            })
            
            let listMessage = "Here are your current tasks:\n\n"
            
            if (dailyTasks.length > 0) {
              listMessage += "**Daily Tasks:**\n"
              dailyTasks.forEach((task, index) => {
                const status = task.completed ? "✅" : "⏳"
                listMessage += `${index + 1}. ${status} ${task.title}\n`
              })
              listMessage += "\n"
            }
            
            if (weeklyTasks.length > 0) {
              listMessage += "**Weekly Tasks:**\n"
              weeklyTasks.forEach((task, index) => {
                const status = task.completed ? "✅" : "⏳"
                listMessage += `${index + 1}. ${status} ${task.title}\n`
              })
            }
            
            if (dailyTasks.length === 0 && weeklyTasks.length === 0) {
              listMessage = "You don't have any tasks right now. Would you like me to create some tasks for you?"
            } else {
              listMessage += "\nTo delete a specific task, just say 'delete [task name]' or 'remove [task name]'."
            }
            
            await enhancedCoachingEngine.saveChatMessage(
              user.id,
              'assistant',
              listMessage,
              assessment.id
            )
            
            return NextResponse.json({
              success: true,
              message: listMessage,
              taskList: { daily: dailyTasks, weekly: weeklyTasks }
            })
          } catch (error) {
            console.error('Error listing tasks:', error)
            const errorMessage = "Sorry, I encountered an error while trying to list your tasks. Please try again."
            
            await enhancedCoachingEngine.saveChatMessage(
              user.id,
              'assistant',
              errorMessage,
              assessment.id
            )
            
            return NextResponse.json({
              success: false,
              message: errorMessage
            })
          }
        }
        
        // Check if user is asking for task/goal deletion
        const isDeleteRequest = /delete|remove|clear|get rid of|cancel.*(task|goal|daily|weekly)/i.test(message) ||
                               /^(delete|remove|clear|cancel).*$/i.test(message.trim())
        
        // Handle delete requests
        if (isDeleteRequest) {
          // Extract what to delete from the message
          const deleteDailyTasks = /delete.*daily|remove.*daily|clear.*daily/i.test(message)
          const deleteWeeklyTasks = /delete.*weekly|remove.*weekly|clear.*weekly/i.test(message)
          const deleteAllTasks = /delete.*all|remove.*all|clear.*all|delete.*tasks|remove.*tasks/i.test(message)
          
          // Check for individual task deletion by searching for quoted task names or specific patterns
          const individualTaskMatch = message.match(/"([^"]+)"|'([^']+)'|delete\s+(.+?)(?:\s+task)?$/i)
          const taskNameToDelete = individualTaskMatch ? (individualTaskMatch[1] || individualTaskMatch[2] || individualTaskMatch[3])?.trim() : null
          
          let deletedTasks: { daily: any[], weekly: any[] } = { daily: [], weekly: [] }
          
          // Handle individual task deletion first
          if (taskNameToDelete && !deleteAllTasks && !deleteDailyTasks && !deleteWeeklyTasks) {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const nextDay = new Date(today)
            nextDay.setDate(today.getDate() + 1)
            const currentWeek = Math.floor((Date.now() - Date.UTC(2024, 0, 1)) / (1000 * 60 * 60 * 24 * 7)) + 1
            
            try {
              // Search for matching daily tasks FOR THIS ASSESSMENT
              const dailyTasks = await prisma.dailyTask.findMany({
                where: {
                  userId: user.id,
                  assessmentId: params.id,
                  date: {
                    gte: today,
                    lt: nextDay
                  }
                }
              })
              
              // Search for matching weekly tasks FOR THIS ASSESSMENT
              const weeklyTasks = await prisma.weeklyTask.findMany({
                where: {
                  userId: user.id,
                  assessmentId: params.id,
                  week: currentWeek
                }
              })
              
              // Find tasks that match the name (case-insensitive, partial match)
              const matchingDailyTasks = dailyTasks.filter(task => 
                task.title.toLowerCase().includes(taskNameToDelete.toLowerCase())
              )
              const matchingWeeklyTasks = weeklyTasks.filter(task => 
                task.title.toLowerCase().includes(taskNameToDelete.toLowerCase())
              )
              
              // Delete matching tasks
              for (const task of matchingDailyTasks) {
                await prisma.dailyTask.delete({
                  where: { id: task.id }
                })
                deletedTasks.daily.push(task)
              }
              
              for (const task of matchingWeeklyTasks) {
                await prisma.weeklyTask.delete({
                  where: { id: task.id }
                })
                deletedTasks.weekly.push(task)
              }
              
              if (deletedTasks.daily.length === 0 && deletedTasks.weekly.length === 0) {
                const noTaskMessage = `I couldn't find any tasks matching "${taskNameToDelete}". You can ask me to "list my tasks" to see what tasks you have, or delete tasks by their exact name.`
                
                await enhancedCoachingEngine.saveChatMessage(
                  user.id,
                  'assistant',
                  noTaskMessage,
                  assessment.id
                )
                
                return NextResponse.json({
                  success: true,
                  message: noTaskMessage
                })
              }
              
              const deleteMessage = `I've deleted ${deletedTasks.daily.length + deletedTasks.weekly.length} task(s) matching "${taskNameToDelete}": ${[...deletedTasks.daily, ...deletedTasks.weekly].map(t => t.title).join(', ')}`
              
              await enhancedCoachingEngine.saveChatMessage(
                user.id,
                'assistant',
                deleteMessage,
                assessment.id
              )
              
              return NextResponse.json({
                success: true,
                message: deleteMessage,
                deletedTasks
              })
            } catch (error) {
              console.error('Error deleting individual task:', error)
              const errorMessage = `Sorry, I encountered an error while trying to delete the task "${taskNameToDelete}". Please try again.`
              
              await enhancedCoachingEngine.saveChatMessage(
                user.id,
                'assistant',
                errorMessage,
                assessment.id
              )
              
              return NextResponse.json({
                success: false,
                message: errorMessage
              })
            }
          }
          
          if (deleteAllTasks || deleteDailyTasks) {
            // Delete all daily tasks for today
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const nextDay = new Date(today)
            nextDay.setDate(today.getDate() + 1)
            
            try {
              const dailyTasks = await prisma.dailyTask.findMany({
                where: {
                  userId: user.id,
                  assessmentId: params.id,
                  date: {
                    gte: today,
                    lt: nextDay
                  }
                }
              })
              
              await prisma.dailyTask.deleteMany({
                where: {
                  userId: user.id,
                  assessmentId: params.id,
                  date: {
                    gte: today,
                    lt: nextDay
                  }
                }
              })
              
              deletedTasks.daily = dailyTasks
            } catch (error) {
              console.error('Error deleting daily tasks:', error)
            }
          }
          
          if (deleteAllTasks || deleteWeeklyTasks) {
            // Delete weekly tasks for current week
            const currentWeek = Math.floor((Date.now() - Date.UTC(2024, 0, 1)) / (1000 * 60 * 60 * 24 * 7)) + 1
            
            try {
              const weeklyTasks = await prisma.weeklyTask.findMany({
                where: {
                  userId: user.id,
                  assessmentId: params.id,
                  week: currentWeek
                }
              })
              
              await prisma.weeklyTask.deleteMany({
                where: {
                  userId: user.id,
                  assessmentId: params.id,
                  week: currentWeek
                }
              })
              
              deletedTasks.weekly = weeklyTasks
            } catch (error) {
              console.error('Error deleting weekly tasks:', error)
            }
          }
          
          // Save assistant message
          const deleteMessage = `I've deleted ${deletedTasks.daily.length} daily tasks and ${deletedTasks.weekly.length} weekly tasks for you. Your task list has been cleared as requested.`
          
          await enhancedCoachingEngine.saveChatMessage(
            user.id,
            'assistant',
            deleteMessage,
            assessment.id
          )
          
          return NextResponse.json({
            success: true,
            message: deleteMessage,
            deletedTasks
          })
        }
        
        // Enhanced focus area detection
        const focusAreaMap = {
          financial: ['financial', 'money', 'budget', 'finance', 'saving', 'investment', 'expense', 'income', 'debt', 'wealth'],
          health: ['health', 'fitness', 'exercise', 'workout', 'nutrition', 'diet', 'wellness', 'medical', 'physical', 'mental health'],
          social: ['social', 'relationship', 'friends', 'family', 'network', 'communication', 'dating', 'romantic', 'connection'],
          personal: ['personal', 'development', 'growth', 'skill', 'learning', 'education', 'career', 'hobby', 'habit', 'productivity']
        }
        
        // Detect requested focus area from message
        let requestedFocusArea = null
        for (const [area, keywords] of Object.entries(focusAreaMap)) {
          if (keywords.some(keyword => new RegExp(`\\b${keyword}`, 'i').test(message))) {
            requestedFocusArea = area
            break
          }
        }
        
        // Check if user is asking for task/goal creation or if we're in task flow
        const isInTaskFlow = data.additionalContext?.isInTaskFlow || false
        const isTaskRequest = isInTaskFlow || 
                             /create|make|add|set|generate|give me|suggest|need|more.*(task|goal|plan|schedule|routine|daily|weekly)/i.test(message) ||
                             /^(more|add more|create more|another|give me more)$/i.test(message.trim())
        
        // Enhanced task request detection with focus area specificity
        const isFocusAreaTaskRequest = isTaskRequest || 
                                     /(daily|weekly).*(task|goal|plan).*for.*(financial|health|social|personal)/i.test(message) ||
                                     /(financial|health|social|personal).*(daily|weekly).*(task|goal|plan)/i.test(message) ||
                                     /help.*with.*(financial|health|social|personal)/i.test(message)
        
        // Direct task creation for specific focus areas
        const isDirectTaskCreation = /^(create|make|give me).*(financial|health|social|personal).*(task|goal)/i.test(message.trim()) ||
                                    /^(financial|health|social|personal).*(task|goal).*please$/i.test(message.trim())
        
        // Handle direct task creation requests
        if (isDirectTaskCreation && requestedFocusArea) {
          const taskTemplates = {
            financial: {
              daily: [
                "Track daily expenses for 15 minutes",
                "Review one financial goal and progress",
                "Check savings account balance",
                "Read one financial article or tip",
                "Log all purchases in expense tracker"
              ],
              weekly: [
                "Create or update monthly budget",
                "Review and organize financial documents",
                "Research one investment opportunity",
                "Calculate net worth and track changes",
                "Plan upcoming major expenses"
              ]
            },
            health: {
              daily: [
                "Take a 30-minute walk or exercise",
                "Drink 8 glasses of water",
                "Eat at least 5 servings of fruits/vegetables",
                "Get 7-8 hours of sleep",
                "Practice 10 minutes of meditation or mindfulness"
              ],
              weekly: [
                "Plan healthy meals for the week",
                "Schedule and attend one medical checkup",
                "Try a new healthy recipe",
                "Review and adjust fitness goals",
                "Spend time outdoors in nature"
              ]
            },
            social: {
              daily: [
                "Reach out to one friend or family member",
                "Practice active listening in conversations",
                "Give someone a genuine compliment",
                "Share something positive on social media",
                "Make eye contact and smile at strangers"
              ],
              weekly: [
                "Plan and organize a social activity",
                "Join a new social group or community event",
                "Have a meaningful conversation with someone",
                "Volunteer for a cause you care about",
                "Reconnect with an old friend"
              ]
            },
            personal: {
              daily: [
                "Read for 30 minutes",
                "Learn something new for 15 minutes",
                "Practice a skill or hobby",
                "Write in a journal or reflect on the day",
                "Set and work toward one small goal"
              ],
              weekly: [
                "Complete an online course module",
                "Set goals for the upcoming week",
                "Organize and declutter one area of home",
                "Plan a new learning project",
                "Review personal values and priorities"
              ]
            }
          }
          
          const templates = taskTemplates[requestedFocusArea as keyof typeof taskTemplates]
          
          // Extract numbers from user message or use coach preferences
          const dailyCountMatch = message.match(/(\d+)\s*daily/i)
          const weeklyCountMatch = message.match(/(\d+)\s*weekly/i)
          const generalCountMatch = message.match(/(\d+)\s*task/i)
          
          // Determine task counts based on user request or preferences
          let requestedDailyCount = dailyCountMatch ? parseInt(dailyCountMatch[1]) : null
          let requestedWeeklyCount = weeklyCountMatch ? parseInt(weeklyCountMatch[1]) : null
          
          // If user specified a general number without specifying daily/weekly, split it
          if (generalCountMatch && !dailyCountMatch && !weeklyCountMatch) {
            const totalCount = parseInt(generalCountMatch[1])
            if (totalCount <= 2) {
              requestedDailyCount = totalCount
              requestedWeeklyCount = 0
            } else {
              requestedDailyCount = Math.ceil(totalCount * 0.6) // 60% daily
              requestedWeeklyCount = Math.floor(totalCount * 0.4) // 40% weekly
            }
          }
          
          // Use task preferences or defaults if no specific numbers requested
          const finalDailyCount = requestedDailyCount ?? (taskPreferences?.dailyCount || 3)
          const finalWeeklyCount = requestedWeeklyCount ?? (taskPreferences?.weeklyCount || 2)
          
          const dailyTasks = templates.daily.slice(0, Math.min(finalDailyCount, templates.daily.length))
          const weeklyTasks = templates.weekly.slice(0, Math.min(finalWeeklyCount, templates.weekly.length))
          
          // Create tasks directly
          let createdTasks: { daily: any[], weekly: any[] } = { daily: [], weekly: [] }
          
          try {
            // Create daily tasks
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            
            for (const taskTitle of dailyTasks) {
              const dailyTask = await prisma.dailyTask.create({
                data: {
                  userId: user.id,
                  assessmentId: assessment.id,
                  title: taskTitle,
                  description: `Daily ${requestedFocusArea} task`,
                  category: requestedFocusArea,
                  estimatedMinutes: 30,
                  source: 'ai_coach',
                  date: today
                }
              })
              createdTasks.daily.push(dailyTask)
            }
            
            // Create weekly tasks
            const currentWeek = Math.floor((Date.now() - Date.UTC(2024, 0, 1)) / (1000 * 60 * 60 * 24 * 7)) + 1
            
            for (const taskTitle of weeklyTasks) {
              const weeklyTask = await prisma.weeklyTask.create({
                data: {
                  userId: user.id,
                  assessmentId: assessment.id,
                  title: taskTitle,
                  description: `Weekly ${requestedFocusArea} task`,
                  category: requestedFocusArea,
                  week: currentWeek,
                  estimatedMinutes: 60
                }
              })
              createdTasks.weekly.push(weeklyTask)
            }
            
            const successMessage = `I've created ${createdTasks.daily.length} daily tasks and ${createdTasks.weekly.length} weekly tasks focused on **${requestedFocusArea}** for you!\n\n**Daily Tasks:**\n${dailyTasks.map((task, i) => `${i + 1}. ${task}`).join('\n')}\n\n**Weekly Tasks:**\n${weeklyTasks.map((task, i) => `${i + 1}. ${task}`).join('\n')}\n\nYou can see these tasks in your dashboard and check them off as you complete them!`
            
            await enhancedCoachingEngine.saveChatMessage(
              user.id,
              'assistant',
              successMessage,
              assessment.id
            )
            
            return NextResponse.json({
              success: true,
              message: successMessage,
              createdTasks,
              focusArea: requestedFocusArea
            })
          } catch (error) {
            console.error('Error creating focus area tasks:', error)
            const errorMessage = `Sorry, I encountered an error while creating ${requestedFocusArea} tasks. Please try again.`
            
            await enhancedCoachingEngine.saveChatMessage(
              user.id,
              'assistant',
              errorMessage,
              assessment.id
            )
            
            return NextResponse.json({
              success: false,
              message: errorMessage
            })
          }
        }
        
        // Gather comprehensive user context
        const context = await enhancedCoachingEngine.gatherUserContext(user.id, assessment.id)
        
        // Override focus area if user specifically requested tasks for a different area
        let effectiveTaskPreferences = taskPreferences
        if (isFocusAreaTaskRequest && requestedFocusArea) {
          effectiveTaskPreferences = {
            ...taskPreferences,
            focusAreas: [requestedFocusArea], // Override with requested focus area
            dailyCount: taskPreferences?.dailyCount || (Math.floor(Math.random() * 10) + 1),
            weeklyCount: taskPreferences?.weeklyCount || (Math.floor(Math.random() * 10) + 1)
          }
        }
        
        // Check if we should force context refresh (e.g., first message of session)
        const forceContextRefresh = data.additionalContext?.forceContextRefresh || false
        
        // Generate enhanced response with proactive insights and context optimization
        const enhancedResponse = await enhancedCoachingEngine.generateEnhancedCoachResponse(
          message,
          assessmentData,
          context,
          isFocusAreaTaskRequest || isTaskRequest,
          effectiveTaskPreferences,
          forceContextRefresh
        )
        
        const responseTime = Date.now() - startTime
        
        // Save assistant message
        await enhancedCoachingEngine.saveChatMessage(
          user.id,
          'assistant',
          enhancedResponse.message,
          assessment.id,
          context.userSettings.coachingStyle,
          responseTime
        )
        
        // Check if the AI response suggests creating specific goals
        const shouldCreateGoals = enhancedResponse.insights.some(insight => 
          insight.type === 'goal_suggestion' && insight.actionable === true
        )
        
        let createdGoals = []
        if (shouldCreateGoals) {
          // Extract goal suggestions from insights
          const goalSuggestions = enhancedResponse.insights.filter(insight => 
            insight.type === 'goal_suggestion' && insight.actionable === true
          )
          
          for (const suggestion of goalSuggestions) {
            try {
              const goal = await prisma.goal.create({
                data: {
                  userId: user.id,
                  title: suggestion.title || 'New Goal',
                  description: suggestion.description || '',
                  category: suggestion.category || 'personal',
                  target: suggestion.target || '100%',
                  priority: 'medium',
                  status: 'active'
                }
              })
              createdGoals.push(goal)
            } catch (error) {
              console.error('Error creating goal:', error)
            }
          }
        }
        
        // Check if AI suggested tasks and create them ONLY if confirmed (not preview)
        let createdTasks: { daily: any[], weekly: any[] } = { daily: [], weekly: [] }
        // Only create tasks if we have suggestedTasks (confirmed), not taskPreview
        if (enhancedResponse.suggestedTasks && !enhancedResponse.taskPreview) {
          console.log('Creating confirmed tasks:', enhancedResponse.suggestedTasks)
          // Create daily tasks
          for (const task of enhancedResponse.suggestedTasks.daily) {
            try {
              const today = new Date()
              today.setHours(0, 0, 0, 0) // Set to start of day for consistency
              
              const dailyTask = await prisma.dailyTask.create({
                data: {
                  userId: user.id,
                  assessmentId: assessment.id,
                  title: task.title,
                  description: task.description,
                  category: task.category,
                  estimatedMinutes: task.estimatedMinutes,
                  source: 'ai_coach',
                  date: today
                }
              })
              console.log('Created daily task:', dailyTask)
              createdTasks.daily.push(dailyTask)
            } catch (error) {
              console.error('Error creating daily task:', error)
            }
          }
          
          // Create weekly tasks
          const currentWeek = Math.ceil((Date.now() - new Date('2024-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000))
          console.log('Creating weekly tasks for week:', currentWeek)
          
          for (const task of enhancedResponse.suggestedTasks.weekly) {
            try {
              const weeklyTask = await prisma.weeklyTask.create({
                data: {
                  userId: user.id,
                  assessmentId: assessment.id,
                  title: task.title,
                  description: task.description,
                  category: task.category,
                  estimatedMinutes: task.estimatedMinutes,
                  source: 'ai_coach',
                  week: currentWeek
                }
              })
              console.log('Created weekly task:', weeklyTask)
              createdTasks.weekly.push(weeklyTask)
            } catch (error) {
              console.error('Error creating weekly task:', error)
            }
          }
        }
        
        return NextResponse.json({ 
          success: true, 
          response: {
            message: enhancedResponse.message,
            suggestions: enhancedResponse.suggestions,
            needsMoreInfo: enhancedResponse.needsMoreInfo,
            questionsForUser: enhancedResponse.questionsForUser,
            awaitingConfirmation: enhancedResponse.awaitingConfirmation,
            contextSent: enhancedResponse.contextSent,
            apiType: 'standard'
          },
          taskPreview: enhancedResponse.taskPreview,
          insights: enhancedResponse.insights,
          context: {
            streak: context.weeklyProgress.currentStreak,
            completionRate: context.weeklyProgress.weeklyCompletionRate,
            activeGoals: context.goalProgress.length,
            recentAchievements: context.achievements.length
          },
          createdGoals: createdGoals,
          createdTasks: createdTasks,
          optimization: {
            apiType: 'standard',
            contextSent: enhancedResponse.contextSent,
            tokensSaved: enhancedResponse.contextSent ? 0 : 600, // Approximate tokens saved
            persistentMemory: false
          }
        })

      case 'generate_weekly_plan':
        // Use enhanced coaching engine for weekly planning
        return NextResponse.json({ 
          success: true, 
          message: "Weekly planning is now integrated into the chat experience. Ask your AI coach to create a weekly plan for you!",
          suggestion: "Try saying: 'Create a weekly plan focused on my lowest scoring areas'"
        })

      case 'update_focus_area':
        const { focusArea, preferences } = data
        // Update focus area in coach settings
        await prisma.coachSettings.upsert({
          where: { 
            userId_assessmentId: {
              userId: user.id,
              assessmentId: assessment.id
            }
          },
          create: {
            userId: user.id,
            assessmentId: assessment.id,
            primaryFocus: focusArea,
            ...preferences
          },
          update: {
            primaryFocus: focusArea,
            ...preferences
          }
        })
        return NextResponse.json({ 
          success: true, 
          message: `Focus area updated to ${focusArea}. Your AI coach will now prioritize this area in conversations and task generation.`,
          focusArea
        })

      case 'adapt_tasks':
        const { category } = data
        const adaptations = await enhancedCoachingEngine.adaptTaskDifficulty(user.id, category)
        return NextResponse.json({
          success: true,
          adaptations,
          message: `Task difficulty adapted based on your ${category} performance patterns.`
        })

      case 'get_proactive_insights':
        const userContext = await enhancedCoachingEngine.gatherUserContext(user.id, assessment.id)
        const insights = await enhancedCoachingEngine.generateProactiveInsights(userContext, assessmentData)
        return NextResponse.json({
          success: true,
          insights,
          contextSummary: {
            streak: userContext.weeklyProgress.currentStreak,
            completionRate: userContext.weeklyProgress.completionRate,
            activeGoals: userContext.goalProgress.length,
            recentJournalEntries: userContext.recentJournalEntries.length
          }
        })

      case 'update_coaching_style':
        const { style } = data
        await prisma.coachSettings.upsert({
          where: { 
            userId_assessmentId: {
              userId: user.id,
              assessmentId: assessment.id
            }
          },
          create: {
            userId: user.id,
            assessmentId: assessment.id,
            coachingStyle: style
          },
          update: {
            coachingStyle: style
          }
        })
        return NextResponse.json({
          success: true,
          message: `Coaching style updated to ${style}. I'll adjust my communication approach accordingly.`
        })

      case 'create_goal':
        const { title, description, category: goalCategory, target, priority } = data
        const newGoal = await prisma.goal.create({
          data: {
            userId: user.id,
            title,
            description: description || '',
            category: goalCategory || 'personal',
            target: target || '100%',
            priority: priority || 'medium',
            status: 'active'
          }
        })
        return NextResponse.json({
          success: true,
          message: 'New goal created successfully!',
          goal: newGoal
        })

      case 'create_daily_tasks':
        const { tasks: dailyTasks } = data
        const createdDailyTasks = []
        
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Set to start of day for consistency
        
        for (const task of dailyTasks) {
          try {
            const dailyTask = await prisma.dailyTask.create({
              data: {
                userId: user.id,
                assessmentId: assessment.id,
                title: task.title,
                description: task.description || '',
                category: task.category || 'personal',
                priority: task.priority || 'medium',
                estimatedMinutes: task.estimatedMinutes || 30,
                source: 'ai_coach',
                date: today
              }
            })
            createdDailyTasks.push(dailyTask)
          } catch (error) {
            console.error('Error creating daily task:', error)
          }
        }
        
        return NextResponse.json({
          success: true,
          message: `Created ${createdDailyTasks.length} daily tasks`,
          tasks: createdDailyTasks
        })

      case 'create_weekly_tasks':
        const { tasks: weeklyTasks, week } = data
        const createdWeeklyTasks = []
        
        // Calculate current week number if not provided
        const currentWeek = week || Math.ceil((Date.now() - new Date('2024-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000))
        
        for (const task of weeklyTasks) {
          try {
            const weeklyTask = await prisma.weeklyTask.create({
              data: {
                userId: user.id,
                assessmentId: assessment.id,
                title: task.title,
                description: task.description || '',
                category: task.category || 'personal',
                priority: task.priority || 'medium',
                estimatedMinutes: task.estimatedMinutes || 60,
                source: 'ai_coach',
                week: currentWeek
              }
            })
            createdWeeklyTasks.push(weeklyTask)
          } catch (error) {
            console.error('Error creating weekly task:', error)
          }
        }
        
        return NextResponse.json({
          success: true,
          message: `Created ${createdWeeklyTasks.length} weekly tasks for week ${currentWeek}`,
          tasks: createdWeeklyTasks,
          week: currentWeek
        })

      case 'read_all_tasks':
        const { taskType: mainTaskType = 'all', includeCompleted = true, taskDate, taskWeek } = data
        try {
          const allTasks = await enhancedCoachingEngine.getUserTasks(
            user.id,
            assessment.id,
            {
              type: mainTaskType,
              date: taskDate ? new Date(taskDate) : undefined,
              week: taskWeek,
              includeCompleted
            }
          )

          let responseMessage = `You have ${allTasks.totalCount} tasks total`
          if (allTasks.completedCount > 0) {
            responseMessage += ` (${allTasks.completedCount} completed, ${allTasks.totalCount - allTasks.completedCount} pending)`
          }

          if (allTasks.daily.length > 0) {
            responseMessage += `\n\n**Daily Tasks:**\n${allTasks.daily.map((task, i) => 
              `${i + 1}. ${task.completed ? '✅' : '⏳'} **${task.title}** (${task.estimatedMinutes}min, ${task.category})\n   ${task.description || 'No description'}`
            ).join('\n')}`
          }

          if (allTasks.weekly.length > 0) {
            responseMessage += `\n\n**Weekly Tasks:**\n${allTasks.weekly.map((task, i) => 
              `${i + 1}. ${task.completed ? '✅' : '⏳'} **${task.title}** (${task.estimatedMinutes}min, ${task.category})\n   ${task.description || 'No description'}`
            ).join('\n')}`
          }

          if (allTasks.totalCount === 0) {
            responseMessage = "You don't have any tasks right now. Would you like me to create some personalized tasks for you?"
          }

          await enhancedCoachingEngine.saveChatMessage(
            user.id,
            'assistant',
            responseMessage,
            assessment.id
          )

          return NextResponse.json({
            success: true,
            message: responseMessage,
            tasks: allTasks
          })
        } catch (error) {
          console.error('Error reading all tasks:', error)
          const errorMessage = "I encountered an error while reading your tasks. Please try again."
          
          await enhancedCoachingEngine.saveChatMessage(
            user.id,
            'assistant',
            errorMessage,
            assessment.id
          )

          return NextResponse.json({
            success: false,
            message: errorMessage
          })
        }

      case 'read_task_details':
        const { taskId, taskType: readTaskType } = data
        try {
          const taskDetails = await enhancedCoachingEngine.getTaskDetails(taskId, readTaskType, user.id)
          
          if (!taskDetails.success) {
            const errorMessage = `I couldn't find that task. ${taskDetails.error}`
            
            await enhancedCoachingEngine.saveChatMessage(
              user.id,
              'assistant',
              errorMessage,
              assessment.id
            )

            return NextResponse.json({
              success: false,
              message: errorMessage
            })
          }

          const task = taskDetails.task
          let detailsMessage = `**Task Details:**\n\n`
          detailsMessage += `**${task.title}**\n`
          detailsMessage += `📝 ${task.description || 'No description provided'}\n`
          detailsMessage += `⏱️ Estimated time: ${task.estimatedMinutes} minutes\n`
          detailsMessage += `📂 Category: ${task.category}\n`
          detailsMessage += `⚡ Priority: ${task.priority || 'medium'}\n`
          detailsMessage += `📊 Status: ${task.completed ? '✅ Completed' : '⏳ Pending'}\n`
          detailsMessage += `📅 Type: ${task.type === 'daily' ? 'Daily task' : 'Weekly task'}\n`
          detailsMessage += `🔍 Difficulty: ${task.difficultyLevel}\n`
          detailsMessage += `⏰ Time Status: ${task.timeStatus.replace(/_/g, ' ')}\n`

          if (task.suggestions && task.suggestions.length > 0) {
            detailsMessage += `\n**Suggestions for improvement:**\n${task.suggestions.map(s => `• ${s}`).join('\n')}`
          }

          await enhancedCoachingEngine.saveChatMessage(
            user.id,
            'assistant',
            detailsMessage,
            assessment.id
          )

          return NextResponse.json({
            success: true,
            message: detailsMessage,
            taskDetails: task
          })
        } catch (error) {
          console.error('Error reading task details:', error)
          const errorMessage = "I encountered an error while reading the task details. Please try again."
          
          await enhancedCoachingEngine.saveChatMessage(
            user.id,
            'assistant',
            errorMessage,
            assessment.id
          )

          return NextResponse.json({
            success: false,
            message: errorMessage
          })
        }

      case 'update_task':
        const { taskId: updateTaskId, taskType: updateTaskType, updates } = data
        try {
          const updateResult = await enhancedCoachingEngine.updateTask(
            updateTaskId,
            updateTaskType,
            user.id,
            updates
          )

          if (!updateResult.success) {
            const errorMessage = `I couldn't update that task. ${updateResult.error}`
            
            await enhancedCoachingEngine.saveChatMessage(
              user.id,
              'assistant',
              errorMessage,
              assessment.id
            )

            return NextResponse.json({
              success: false,
              message: errorMessage
            })
          }

          const changesText = updateResult.changesApplied!.length > 0 
            ? updateResult.changesApplied!.join(', ')
            : 'no changes'

          const successMessage = `✅ **Task Updated Successfully!**\n\nI've updated the task "${updateResult.task.title}"\n\n**Changes applied:** ${changesText}\n\nThe task is now ready with your modifications!`

          await enhancedCoachingEngine.saveChatMessage(
            user.id,
            'assistant',
            successMessage,
            assessment.id
          )

          return NextResponse.json({
            success: true,
            message: successMessage,
            updatedTask: updateResult.task,
            changesApplied: updateResult.changesApplied
          })
        } catch (error) {
          console.error('Error updating task:', error)
          const errorMessage = "I encountered an error while updating the task. Please try again."
          
          await enhancedCoachingEngine.saveChatMessage(
            user.id,
            'assistant',
            errorMessage,
            assessment.id
          )

          return NextResponse.json({
            success: false,
            message: errorMessage
          })
        }

      case 'delete_individual_task':
        const { taskId: deleteTaskId, taskType: deleteTaskType } = data
        try {
          const deleteResult = await enhancedCoachingEngine.deleteTask(
            deleteTaskId,
            deleteTaskType,
            user.id
          )

          if (!deleteResult.success) {
            const errorMessage = `I couldn't delete that task. ${deleteResult.error}`
            
            await enhancedCoachingEngine.saveChatMessage(
              user.id,
              'assistant',
              errorMessage,
              assessment.id
            )

            return NextResponse.json({
              success: false,
              message: errorMessage
            })
          }

          const successMessage = `🗑️ **Task Deleted Successfully!**\n\nI've removed the task "${deleteResult.deletedTask.title}" from your dashboard.\n\nThe task has been permanently deleted and won't appear in your task list anymore.`

          await enhancedCoachingEngine.saveChatMessage(
            user.id,
            'assistant',
            successMessage,
            assessment.id
          )

          return NextResponse.json({
            success: true,
            message: successMessage,
            deletedTask: deleteResult.deletedTask
          })
        } catch (error) {
          console.error('Error deleting task:', error)
          const errorMessage = "I encountered an error while deleting the task. Please try again."
          
          await enhancedCoachingEngine.saveChatMessage(
            user.id,
            'assistant',
            errorMessage,
            assessment.id
          )

          return NextResponse.json({
            success: false,
            message: errorMessage
          })
        }

      case 'find_tasks':
        const { searchQuery } = data
        try {
          const searchResults = await enhancedCoachingEngine.findTasksByDescription(
            user.id,
            assessment.id,
            searchQuery
          )

          if (searchResults.matchCount === 0) {
            const noResultsMessage = `I couldn't find any tasks matching "${searchQuery}". You can ask me to list all your tasks or create new ones if needed.`
            
            await enhancedCoachingEngine.saveChatMessage(
              user.id,
              'assistant',
              noResultsMessage,
              assessment.id
            )

            return NextResponse.json({
              success: true,
              message: noResultsMessage,
              searchResults
            })
          }

          let resultsMessage = `🔍 **Found ${searchResults.matchCount} tasks matching "${searchQuery}":**\n\n`

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

          await enhancedCoachingEngine.saveChatMessage(
            user.id,
            'assistant',
            resultsMessage,
            assessment.id
          )

          return NextResponse.json({
            success: true,
            message: resultsMessage,
            searchResults
          })
        } catch (error) {
          console.error('Error finding tasks:', error)
          const errorMessage = "I encountered an error while searching for tasks. Please try again."
          
          await enhancedCoachingEngine.saveChatMessage(
            user.id,
            'assistant',
            errorMessage,
            assessment.id
          )

          return NextResponse.json({
            success: false,
            message: errorMessage
          })
        }
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error processing coach action:', error)
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    )
  }
}
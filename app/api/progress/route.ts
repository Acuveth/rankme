import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProgressTracker } from '@/lib/progress-tracker'
import { LoginTracker } from '@/lib/login-tracker'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const assessmentId = searchParams.get('assessmentId')
    const date = searchParams.get('date')

    if (type === 'daily') {
      const targetDate = date ? new Date(date) : new Date()
      targetDate.setHours(0, 0, 0, 0)
      
      const nextDay = new Date(targetDate)
      nextDay.setDate(targetDate.getDate() + 1)

      const whereClause: any = {
        userId: user.id,
        date: {
          gte: targetDate,
          lt: nextDay
        }
      }
      
      // If assessmentId is provided, filter by it, otherwise get all
      if (assessmentId) {
        whereClause.assessmentId = assessmentId
      }
      
      console.log('Loading daily tasks with whereClause:', whereClause)
      
      const dailyTasks = await prisma.dailyTask.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'asc'
        }
      })

      console.log(`Found ${dailyTasks.length} daily tasks for user ${user.id}`)

      return NextResponse.json({ tasks: dailyTasks })
    }

    if (type === 'weekly') {
      const week = searchParams.get('week')
      const category = searchParams.get('category')
      
      const weeklyWhereClause: any = {
        userId: user.id,
        ...(week && { week: parseInt(week) }),
        ...(category && { category })
      }
      
      // If assessmentId is provided, filter by it, otherwise get all
      if (assessmentId) {
        weeklyWhereClause.assessmentId = assessmentId
      }
      
      console.log('[PROGRESS API] Loading weekly tasks with where clause:', weeklyWhereClause)
      
      const weeklyTasks = await prisma.weeklyTask.findMany({
        where: weeklyWhereClause,
        orderBy: [
          { week: 'desc' },
          { createdAt: 'asc' }
        ]
      })

      console.log(`[PROGRESS API] Found ${weeklyTasks.length} weekly tasks for week ${week}`)
      weeklyTasks.forEach(task => {
        console.log(`[PROGRESS API]   - ${task.title} (${task.id}): completed=${task.completed}, completedAt=${task.completedAt}`)
      })

      return NextResponse.json({ tasks: weeklyTasks })
    }

    if (type === 'journal') {
      const limit = searchParams.get('limit')
      
      const journalWhereClause: any = {
        userId: user.id
      }
      
      // If assessmentId is provided, filter by it, otherwise get all
      if (assessmentId) {
        journalWhereClause.assessmentId = assessmentId
      }
      
      const journalEntries = await prisma.journalEntry.findMany({
        where: journalWhereClause,
        orderBy: {
          date: 'desc'
        },
        take: limit ? parseInt(limit) : 10
      })

      return NextResponse.json({ entries: journalEntries })
    }

    if (type === 'settings') {
      let coachSettings = null
      
      if (assessmentId) {
        // Get settings for specific assessment
        coachSettings = await prisma.coachSettings.findUnique({
          where: {
            userId_assessmentId: {
              userId: user.id,
              assessmentId: assessmentId
            }
          }
        })
      } else {
        // Get most recent settings across all assessments (fallback)
        coachSettings = await prisma.coachSettings.findFirst({
          where: {
            userId: user.id
          },
          orderBy: {
            updatedAt: 'desc'
          }
        })
      }

      return NextResponse.json({ settings: coachSettings })
    }

    // CONSOLIDATED: User progress stats (formerly /api/user-progress)
    if (type === 'stats') {
      if (assessmentId) {
        // Assessment-specific progress
        const assessmentProgressStats = await prisma.assessmentProgressStats.findUnique({
          where: { assessmentId: assessmentId }
        })

        // Get this specific assessment for current score
        const assessment = await prisma.assessment.findUnique({
          where: { 
            id: assessmentId,
            userId: user.id 
          },
          include: { scoreOverall: true }
        })

        if (!assessment) {
          return NextResponse.json(
            { error: 'Assessment not found' },
            { status: 404 }
          )
        }

        const currentScore = assessment.scoreOverall?.percentileOverall || 0

        // Get login-based streak information (this is still global)
        const loginStreak = await LoginTracker.getDayStreak(user.id)

        // Get improvement for THIS assessment
        const initialScore = assessmentProgressStats?.initialScore || currentScore
        const improvementPoints = Math.round(currentScore - initialScore)

        // Calculate real-time completion rate based on actual tasks
        const [allDailyTasks, allWeeklyTasks] = await Promise.all([
          prisma.dailyTask.findMany({
            where: { 
              userId: user.id,
              assessmentId: assessmentId
            }
          }),
          prisma.weeklyTask.findMany({
            where: { 
              userId: user.id,
              assessmentId: assessmentId
            }
          })
        ])

        const totalTasks = allDailyTasks.length + allWeeklyTasks.length
        const completedTasks = allDailyTasks.filter(task => task.completed).length + 
                             allWeeklyTasks.filter(task => task.completed).length
        const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

        // Get recent activity FOR THIS ASSESSMENT
        const recentJournalEntries = await prisma.journalEntry.findMany({
          where: { 
            userId: user.id,
            assessmentId: assessmentId
          },
          orderBy: { date: 'desc' },
          take: 3
        })

        const recentCompletedTasks = await prisma.dailyTask.findMany({
          where: {
            userId: user.id,
            assessmentId: assessmentId,
            completed: true,
            completedAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 7))
            }
          },
          orderBy: { completedAt: 'desc' },
          take: 5
        })

        return NextResponse.json({
          streak: {
            days: assessmentProgressStats?.currentStreak || 0,
            message: getStreakMessage(assessmentProgressStats?.currentStreak || 0)
          },
          completionRate: {
            percentage: completionPercentage,
            completed: completedTasks,
            total: totalTasks
          },
          currentScore: {
            percentile: Math.round(currentScore),
            improvement: improvementPoints
          },
          recentActivity: {
            journalEntries: recentJournalEntries.length,
            completedTasks: recentCompletedTasks.length,
            lastEntry: recentJournalEntries[0]?.date || null,
            lastTaskCompleted: recentCompletedTasks[0]?.completedAt || null,
            longestStreak: assessmentProgressStats?.longestStreak || 0,
            weeklyCompletionRate: Math.round(assessmentProgressStats?.weeklyCompletionRate || 0),
            lastActiveDate: assessmentProgressStats?.lastActiveDate?.toISOString() || null
          },
          lastUpdated: assessmentProgressStats?.lastCalculated?.toISOString() || new Date().toISOString()
        })
      } else {
        // Global progress (original logic)
        const progressStats = await ProgressTracker.getUserProgress(user.id)
        
        // Get login-based streak information
        const loginStreak = await LoginTracker.getDayStreak(user.id)

        // Get user's most recent COMPLETED assessment for current score
        const latestAssessment = await prisma.assessment.findFirst({
          where: { 
            userId: user.id,
            status: 'completed'
          },
          include: { scoreOverall: true },
          orderBy: { completedAt: 'desc' }
        })

        const currentScore = latestAssessment?.scoreOverall?.percentileOverall || 0

        // Calculate improvement since first COMPLETED assessment
        const firstAssessment = await prisma.assessment.findFirst({
          where: { 
            userId: user.id,
            status: 'completed'
          },
          include: { scoreOverall: true },
          orderBy: { completedAt: 'asc' }
        })

        const improvementPoints = firstAssessment?.scoreOverall?.percentileOverall 
          ? Math.round(currentScore - firstAssessment.scoreOverall.percentileOverall)
          : 0

        // Get recent activity for activity feed
        const recentJournalEntries = await prisma.journalEntry.findMany({
          where: { userId: user.id },
          orderBy: { date: 'desc' },
          take: 3
        })

        const recentCompletedTasks = await prisma.dailyTask.findMany({
          where: {
            userId: user.id,
            completed: true,
            completedAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 7))
            }
          },
          orderBy: { completedAt: 'desc' },
          take: 5
        })

        return NextResponse.json({
          streak: {
            days: loginStreak?.consecutiveLoginDays || 0,
            message: getStreakMessage(loginStreak?.consecutiveLoginDays || 0)
          },
          completionRate: {
            percentage: Math.round(progressStats?.monthlyCompletionRate || 0),
            completed: progressStats?.totalTasksCompleted || 0,
            total: progressStats?.totalTasksAssigned || 0
          },
          currentScore: {
            percentile: Math.round(currentScore),
            improvement: improvementPoints
          },
          recentActivity: {
            journalEntries: recentJournalEntries.length,
            completedTasks: recentCompletedTasks.length,
            lastEntry: recentJournalEntries[0]?.date || null,
            lastTaskCompleted: recentCompletedTasks[0]?.completedAt || null,
            longestStreak: loginStreak?.longestStreak || 0,
            weeklyCompletionRate: Math.round(progressStats?.weeklyCompletionRate || 0),
            lastActiveDate: progressStats?.lastActiveDate?.toISOString() || null
          },
          lastUpdated: progressStats?.lastCalculated?.toISOString() || new Date().toISOString()
        })
      }
    }

    // CONSOLIDATED: Assessment history (formerly /api/user/progress)
    if (type === 'assessment-history') {
      // Get user's assessment history (for display)
      const assessments = await prisma.assessment.findMany({
        where: {
          userId: user.id,
          status: 'completed'
        },
        include: {
          scoreOverall: true,
          scoreCategory: true
        },
        orderBy: {
          completedAt: 'desc'
        },
        take: 10 // Last 10 assessments for display
      })

      // Get total count and first/latest for accurate statistics
      const totalCount = await prisma.assessment.count({
        where: {
          userId: user.id,
          status: 'completed'
        }
      })

      // Get the very first assessment for accurate trend calculation
      const firstAssessment = await prisma.assessment.findFirst({
        where: {
          userId: user.id,
          status: 'completed'
        },
        include: {
          scoreOverall: true
        },
        orderBy: {
          completedAt: 'asc'
        }
      })

      // Calculate progress trends
      const progressData = assessments.map((assessment, index) => {
        const previous = assessments[index + 1]
        let improvements: { [key: string]: number } = {}
        
        if (previous && assessment.scoreOverall && previous.scoreOverall) {
          improvements = {
            overall: assessment.scoreOverall.percentileOverall - previous.scoreOverall.percentileOverall,
            financial: assessment.scoreOverall.percentileFinancial - previous.scoreOverall.percentileFinancial,
            health: assessment.scoreOverall.percentileHealth - previous.scoreOverall.percentileHealth,
            social: assessment.scoreOverall.percentileSocial - previous.scoreOverall.percentileSocial,
            romantic: assessment.scoreOverall.percentileRomantic - previous.scoreOverall.percentileRomantic
          }
        }

        return {
          id: assessment.id,
          date: assessment.completedAt,
          overall: {
            score: assessment.scoreOverall?.overall || 0,
            percentile: assessment.scoreOverall?.percentileOverall || 0
          },
          categories: [
            { id: 'financial', percentile: assessment.scoreOverall?.percentileFinancial || 0 },
            { id: 'health_fitness', percentile: assessment.scoreOverall?.percentileHealth || 0 },
            { id: 'social', percentile: assessment.scoreOverall?.percentileSocial || 0 },
            { id: 'romantic', percentile: assessment.scoreOverall?.percentileRomantic || 0 }
          ],
          improvements,
          isLatest: index === 0
        }
      })

      // Calculate overall statistics using accurate data
      const stats = {
        totalAssessments: totalCount,
        firstAssessmentDate: firstAssessment?.completedAt,
        latestAssessmentDate: assessments[0]?.completedAt,
        overallTrend: (assessments.length > 0 && firstAssessment?.scoreOverall) ? 
          (assessments[0].scoreOverall?.percentileOverall || 0) - (firstAssessment.scoreOverall?.percentileOverall || 0) : 0,
        improvingCategories: [] as any[],
        decliningCategories: [] as any[]
      }

      // Calculate category trends using first assessment vs latest
      if (assessments.length > 0 && firstAssessment?.scoreOverall) {
        const latest = assessments[0].scoreOverall
        const first = firstAssessment.scoreOverall
        
        if (latest && first) {
          const categoryChanges = {
            financial: latest.percentileFinancial - first.percentileFinancial,
            health_fitness: latest.percentileHealth - first.percentileHealth,
            social: latest.percentileSocial - first.percentileSocial,
            romantic: latest.percentileRomantic - first.percentileRomantic
          }

          stats.improvingCategories = Object.entries(categoryChanges)
            .filter(([_, change]) => change > 5)
            .map(([category, change]) => ({ category, change }))

          stats.decliningCategories = Object.entries(categoryChanges)
            .filter(([_, change]) => change < -5)
            .map(([category, change]) => ({ category, change }))
        }
      }

      return NextResponse.json({
        assessments: progressData,
        stats
      })
    }

    return NextResponse.json(
      { error: 'Invalid type parameter' },
      { status: 400 }
    )
  } catch (error) {
    // Handle client disconnection gracefully
    if (error instanceof Error && error.message.includes('aborted')) {
      console.log('Client disconnected during progress data fetch')
      return new Response(null, { status: 499 }) // Client Closed Request
    }
    
    console.error('Error fetching progress data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { type, data } = body

    if (type === 'daily_task') {
      const { title, description, category, date, completed, assessmentId } = data
      
      if (!assessmentId) {
        return NextResponse.json(
          { error: 'Assessment ID is required for daily tasks' },
          { status: 400 }
        )
      }
      
      const task = await prisma.dailyTask.upsert({
        where: {
          userId_assessmentId_title_date: {
            userId: user.id,
            assessmentId: assessmentId,
            title,
            date: new Date(date)
          }
        },
        update: {
          completed,
          completedAt: completed ? new Date() : null
        },
        create: {
          userId: user.id,
          assessmentId: assessmentId,
          title,
          description,
          category,
          date: new Date(date),
          completed: completed || false,
          completedAt: completed ? new Date() : null
        }
      })

      // Update progress tracking for daily task
      await ProgressTracker.updateUserProgress(user.id)
      
      return NextResponse.json({ success: true, task })
    }

    if (type === 'weekly_task') {
      const { title, description, category, week, completed, assessmentId } = data
      
      if (!assessmentId) {
        return NextResponse.json(
          { error: 'Assessment ID is required for weekly tasks' },
          { status: 400 }
        )
      }
      
      console.log('[PROGRESS API] Upserting weekly task:', {
        userId: user.id,
        assessmentId,
        title,
        week,
        category,
        completed
      })
      
      const task = await prisma.weeklyTask.upsert({
        where: {
          userId_assessmentId_title_week_category: {
            userId: user.id,
            assessmentId: assessmentId,
            title,
            week,
            category
          }
        },
        update: {
          completed,
          completedAt: completed ? new Date() : null
        },
        create: {
          userId: user.id,
          assessmentId: assessmentId,
          title,
          description,
          category,
          week,
          completed: completed || false,
          completedAt: completed ? new Date() : null
        }
      })
      
      console.log('[PROGRESS API] Upserted task result:', {
        id: task.id,
        title: task.title,
        completed: task.completed
      })

      // Update progress tracking for weekly task
      await ProgressTracker.updateUserProgress(user.id)
      
      return NextResponse.json({ success: true, task })
    }

    if (type === 'journal_entry') {
      const { entry, question, mood, assessmentId } = data
      
      if (!assessmentId) {
        return NextResponse.json(
          { error: 'Assessment ID is required for journal entries' },
          { status: 400 }
        )
      }
      
      const journalEntry = await prisma.journalEntry.create({
        data: {
          userId: user.id,
          assessmentId: assessmentId,
          entry,
          question,
          mood,
          date: new Date()
        }
      })

      // Update progress tracking for journal entry
      await ProgressTracker.updateUserProgress(user.id)

      return NextResponse.json({ success: true, entry: journalEntry })
    }

    if (type === 'coach_settings') {
      const { primaryFocus, coachingStyle, goalFrequency, dailyReminders, assessmentId } = data
      
      if (!assessmentId) {
        return NextResponse.json(
          { error: 'Assessment ID is required for coach settings' },
          { status: 400 }
        )
      }
      
      const settings = await prisma.coachSettings.upsert({
        where: {
          userId_assessmentId: {
            userId: user.id,
            assessmentId: assessmentId
          }
        },
        update: {
          primaryFocus,
          coachingStyle,
          goalFrequency,
          dailyReminders
        },
        create: {
          userId: user.id,
          assessmentId: assessmentId,
          primaryFocus: primaryFocus || 'financial',
          coachingStyle: coachingStyle || 'supportive',
          goalFrequency: goalFrequency || 'daily',
          dailyReminders: dailyReminders !== undefined ? dailyReminders : true
        }
      })

      return NextResponse.json({ success: true, settings })
    }

    if (type === 'settings') {
      const { 
        primaryFocus, 
        coachingStyle, 
        goalFrequency, 
        dailyReminders,
        checkInFrequency,
        checkInTime,
        checkInTimes,
        checkInDays,
        checkInTimeOfDay,
        checkInReminderMinutes,
        assessmentId
      } = data
      
      if (!assessmentId) {
        return NextResponse.json(
          { error: 'Assessment ID is required for settings' },
          { status: 400 }
        )
      }
      
      try {
        const settings = await prisma.coachSettings.upsert({
          where: {
            userId_assessmentId: {
              userId: user.id,
              assessmentId: assessmentId
            }
          },
          update: {
            ...(primaryFocus && { primaryFocus }),
            ...(coachingStyle && { coachingStyle }),
            ...(goalFrequency && { goalFrequency }),
            ...(dailyReminders !== undefined && { dailyReminders }),
            ...(checkInFrequency && { checkInFrequency }),
            ...(checkInTime && { checkInTime }),
            ...(checkInTimes && { checkInTimes }),
            ...(checkInDays && { checkInDays }),
            ...(checkInTimeOfDay && { checkInTimeOfDay }),
            ...(checkInReminderMinutes !== undefined && { checkInReminderMinutes })
          },
          create: {
            userId: user.id,
            assessmentId: assessmentId,
            primaryFocus: primaryFocus || 'financial',
            coachingStyle: coachingStyle || 'supportive',
            goalFrequency: goalFrequency || 'daily',
            dailyReminders: dailyReminders !== undefined ? dailyReminders : true,
            checkInFrequency: checkInFrequency || 'daily',
            checkInTime: checkInTime || '09:00',
            checkInTimes: checkInTimes || null,
            checkInDays: checkInDays || null,
            checkInTimeOfDay: checkInTimeOfDay || null,
            checkInReminderMinutes: checkInReminderMinutes !== undefined ? checkInReminderMinutes : 15
          }
        })
        
        return NextResponse.json({ success: true, settings })
      } catch (prismaError) {
        console.error('PROGRESS API: Prisma error saving settings:', prismaError)
        return NextResponse.json({ 
          error: 'Database error saving settings', 
          details: prismaError instanceof Error ? prismaError.message : String(prismaError)
        }, { status: 500 })
      }
    }

    return NextResponse.json(
      { error: 'Invalid type' },
      { status: 400 }
    )
  } catch (error) {
    // Handle client disconnection gracefully
    if (error instanceof Error && error.message.includes('aborted')) {
      console.log('Client disconnected during progress data save')
      return new Response(null, { status: 499 }) // Client Closed Request
    }
    
    console.error('Error saving progress data:', error)
    return NextResponse.json(
      { error: 'Failed to save progress data' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    let type = searchParams.get('type')
    let id = searchParams.get('id')

    // If not in query params, try to get from request body
    if (!type || !id) {
      try {
        const body = await request.json()
        type = type || body.type
        id = id || body.id
      } catch (error) {
        // If no body, continue with query params
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: 'ID required' },
        { status: 400 }
      )
    }

    if (type === 'daily_task') {
      await prisma.dailyTask.delete({
        where: {
          id,
          userId: user.id
        }
      })
    } else if (type === 'weekly_task') {
      await prisma.weeklyTask.delete({
        where: {
          id,
          userId: user.id
        }
      })
    } else if (type === 'journal_entry') {
      await prisma.journalEntry.delete({
        where: {
          id,
          userId: user.id
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    // Handle client disconnection gracefully
    if (error instanceof Error && error.message.includes('aborted')) {
      console.log('Client disconnected during progress data delete')
      return new Response(null, { status: 499 }) // Client Closed Request
    }
    
    console.error('Error deleting progress data:', error)
    return NextResponse.json(
      { error: 'Failed to delete progress data' },
      { status: 500 }
    )
  }
}

// Helper function for streak messages
function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your streak today!"
  if (streak === 1) return "Great start!"
  if (streak < 7) return "Keep going!"
  if (streak < 14) return "You're on fire!"
  if (streak < 30) return "Amazing streak!"
  return "Legendary streak!"
}
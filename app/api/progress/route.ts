import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProgressTracker } from '@/lib/progress-tracker'

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

    return NextResponse.json(
      { error: 'Invalid type parameter' },
      { status: 400 }
    )
  } catch (error) {
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
    console.error('Error deleting progress data:', error)
    return NextResponse.json(
      { error: 'Failed to delete progress data' },
      { status: 500 }
    )
  }
}
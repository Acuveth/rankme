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
    const date = searchParams.get('date')

    if (type === 'daily') {
      const targetDate = date ? new Date(date) : new Date()
      targetDate.setHours(0, 0, 0, 0)
      
      const nextDay = new Date(targetDate)
      nextDay.setDate(targetDate.getDate() + 1)

      const dailyTasks = await prisma.dailyTask.findMany({
        where: {
          userId: user.id,
          date: {
            gte: targetDate,
            lt: nextDay
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      })

      return NextResponse.json({ tasks: dailyTasks })
    }

    if (type === 'weekly') {
      const week = searchParams.get('week')
      const category = searchParams.get('category')
      
      const weeklyTasks = await prisma.weeklyTask.findMany({
        where: {
          userId: user.id,
          ...(week && { week: parseInt(week) }),
          ...(category && { category })
        },
        orderBy: [
          { week: 'desc' },
          { createdAt: 'asc' }
        ]
      })

      return NextResponse.json({ tasks: weeklyTasks })
    }

    if (type === 'journal') {
      const limit = searchParams.get('limit')
      
      const journalEntries = await prisma.journalEntry.findMany({
        where: {
          userId: user.id
        },
        orderBy: {
          date: 'desc'
        },
        take: limit ? parseInt(limit) : 10
      })

      return NextResponse.json({ entries: journalEntries })
    }

    if (type === 'settings') {
      const coachSettings = await prisma.coachSettings.findUnique({
        where: {
          userId: user.id
        }
      })

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
      const { title, description, category, date, completed } = data
      
      const task = await prisma.dailyTask.upsert({
        where: {
          userId_title_date: {
            userId: user.id,
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
      
      const task = await prisma.weeklyTask.upsert({
        where: {
          userId_title_week_category: {
            userId: user.id,
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
          title,
          description,
          category,
          week,
          completed: completed || false,
          completedAt: completed ? new Date() : null,
          assessmentId
        }
      })

      // Update progress tracking for weekly task
      await ProgressTracker.updateUserProgress(user.id)
      
      return NextResponse.json({ success: true, task })
    }

    if (type === 'journal_entry') {
      const { entry, question, mood } = data
      
      const journalEntry = await prisma.journalEntry.create({
        data: {
          userId: user.id,
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
      const { primaryFocus, coachingStyle, goalFrequency, dailyReminders } = data
      
      const settings = await prisma.coachSettings.upsert({
        where: {
          userId: user.id
        },
        update: {
          primaryFocus,
          coachingStyle,
          goalFrequency,
          dailyReminders
        },
        create: {
          userId: user.id,
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
        checkInDays
      } = data
      
      const settings = await prisma.coachSettings.upsert({
        where: {
          userId: user.id
        },
        update: {
          ...(primaryFocus && { primaryFocus }),
          ...(coachingStyle && { coachingStyle }),
          ...(goalFrequency && { goalFrequency }),
          ...(dailyReminders !== undefined && { dailyReminders }),
          ...(checkInFrequency && { checkInFrequency }),
          ...(checkInTime && { checkInTime }),
          ...(checkInDays && { checkInDays })
        },
        create: {
          userId: user.id,
          primaryFocus: primaryFocus || 'financial',
          coachingStyle: coachingStyle || 'supportive',
          goalFrequency: goalFrequency || 'daily',
          dailyReminders: dailyReminders !== undefined ? dailyReminders : true,
          checkInFrequency: checkInFrequency || 'daily',
          checkInTime: checkInTime || '09:00',
          checkInDays: checkInDays || null
        }
      })
      return NextResponse.json({ success: true, settings })
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
    const type = searchParams.get('type')
    const id = searchParams.get('id')

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
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const url = new URL(request.url)
    const type = url.searchParams.get('type') || 'upcoming'
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const assessmentId = url.searchParams.get('assessmentId')
    
    if (!assessmentId) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 })
    }

    let checkIns
    
    if (type === 'upcoming') {
      // Get upcoming check-ins
      checkIns = await prisma.checkIn.findMany({
        where: {
          userId: user.id,
          assessmentId: assessmentId,
          status: 'pending',
          scheduledFor: {
            gte: new Date()
          }
        },
        orderBy: {
          scheduledFor: 'asc'
        },
        take: limit
      })
    } else if (type === 'completed') {
      // Get completed check-ins
      checkIns = await prisma.checkIn.findMany({
        where: {
          userId: user.id,
          assessmentId: assessmentId,
          status: 'completed'
        },
        orderBy: {
          completedAt: 'desc'
        },
        take: limit
      })
    } else {
      // Get all check-ins
      checkIns = await prisma.checkIn.findMany({
        where: {
          userId: user.id,
          assessmentId: assessmentId
        },
        orderBy: {
          scheduledFor: 'desc'
        },
        take: limit
      })
    }

    return NextResponse.json({ checkIns })
  } catch (error) {
    console.error('Error fetching check-ins:', error)
    return NextResponse.json({ error: 'Failed to fetch check-ins' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { action, data } = body

    if (action === 'schedule') {
      // Schedule new check-ins based on user preferences
      const { assessmentId } = data
      
      if (!assessmentId) {
        return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 })
      }

      // Validate that the assessment exists and belongs to the user
      const assessment = await prisma.assessment.findFirst({
        where: {
          id: assessmentId,
          userId: user.id
        }
      })

      if (!assessment) {
        return NextResponse.json({ 
          error: 'Assessment not found or does not belong to user' 
        }, { status: 404 })
      }
      
      let settings = await prisma.coachSettings.findFirst({
        where: { 
          userId: user.id,
          assessmentId: assessmentId
        },
        orderBy: { updatedAt: 'desc' }
      })

      // If no settings found for this specific assessment, create default settings
      if (!settings) {
        settings = await prisma.coachSettings.create({
          data: {
            userId: user.id,
            assessmentId: assessmentId,
            primaryFocus: 'financial',
            coachingStyle: 'supportive',
            goalFrequency: 'daily',
            dailyReminders: true,
            checkInFrequency: 'daily',
            checkInTime: '09:00',
            checkInReminderMinutes: 15
          }
        })
      }

      // Parse times if stored as JSON string
      let times = undefined
      if (settings.checkInFrequency === 'multiple-daily' && settings.checkInTimes) {
        try {
          times = JSON.parse(settings.checkInTimes)
        } catch (e) {
          console.error('Failed to parse checkInTimes:', e)
        }
      }

      // Delete existing pending check-ins for this assessment to avoid duplicates
      await prisma.checkIn.deleteMany({
        where: {
          userId: user.id,
          assessmentId: assessmentId,
          status: 'pending'
        }
      })

      const checkInDates = calculateCheckInDates(
        settings.checkInFrequency,
        settings.checkInTime,
        settings.checkInDays ? JSON.parse(settings.checkInDays) : null,
        times
      )

      const checkIns = await Promise.all(
        checkInDates.map(date => 
          prisma.checkIn.create({
            data: {
              userId: user.id,
              assessmentId: assessmentId,
              type: settings.checkInFrequency,
              scheduledFor: date,
              status: 'pending'
            }
          })
        )
      )

      // Update next check-in in settings
      if (checkInDates.length > 0) {
        await prisma.coachSettings.update({
          where: { 
            userId_assessmentId: {
              userId: user.id,
              assessmentId: assessmentId
            }
          },
          data: { nextCheckIn: checkInDates[0] }
        })
      }

      return NextResponse.json({ 
        message: 'Check-ins scheduled successfully',
        checkIns 
      })
    } else if (action === 'complete') {
      // Complete a check-in
      const { checkInId, mood, energy, notes, responses } = data

      const checkIn = await prisma.checkIn.update({
        where: { id: checkInId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          mood,
          energy,
          notes,
          responses: responses ? JSON.stringify(responses) : null
        }
      })

      // Update last check-in in settings (update most recent settings)
      const settingsToUpdate = await prisma.coachSettings.findFirst({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' }
      })
      
      if (settingsToUpdate) {
        await prisma.coachSettings.update({
          where: { id: settingsToUpdate.id },
          data: { lastCheckIn: new Date() }
        })
      }

      // Check for achievements related to check-ins
      const completedCheckIns = await prisma.checkIn.count({
        where: {
          userId: user.id,
          status: 'completed'
        }
      })

      // You could trigger achievement checks here
      // e.g., first check-in, 7 consecutive check-ins, etc.

      return NextResponse.json({ 
        message: 'Check-in completed',
        checkIn,
        totalCompleted: completedCheckIns
      })
    } else if (action === 'skip') {
      // Skip a check-in
      const { checkInId, reason } = data

      const checkIn = await prisma.checkIn.update({
        where: { id: checkInId },
        data: {
          status: 'skipped',
          notes: reason || 'Skipped by user'
        }
      })

      return NextResponse.json({ 
        message: 'Check-in skipped',
        checkIn 
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error processing check-in:', error)
    return NextResponse.json({ error: 'Failed to process check-in' }, { status: 500 })
  }
}

// Helper function to calculate check-in dates
function calculateCheckInDates(
  frequency: string, 
  time: string, 
  days: string[] | null,
  times?: string[] // For multiple daily check-ins
): Date[] {
  const dates: Date[] = []
  const now = new Date()
  const [hours, minutes] = time.split(':').map(Number)

  switch (frequency) {
    case 'daily':
      // Schedule for the next 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(now)
        date.setDate(date.getDate() + i)
        date.setHours(hours, minutes, 0, 0)
        if (date > now) {
          dates.push(date)
        }
      }
      break

    case 'multiple-daily':
      // Schedule multiple times per day for the next 7 days
      const checkInTimes = times || [time]
      for (let i = 0; i < 7; i++) {
        checkInTimes.forEach(checkTime => {
          const [h, m] = checkTime.split(':').map(Number)
          const date = new Date(now)
          date.setDate(date.getDate() + i)
          date.setHours(h, m, 0, 0)
          if (date > now) {
            dates.push(date)
          }
        })
      }
      break

    case 'weekly':
      // Schedule for specific days of the week
      const daysToSchedule = days || ['Monday']
      const dayMap: { [key: string]: number } = {
        'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
        'Thursday': 4, 'Friday': 5, 'Saturday': 6
      }

      for (let week = 0; week < 4; week++) {
        daysToSchedule.forEach(day => {
          const targetDay = dayMap[day]
          const date = new Date(now)
          date.setDate(date.getDate() + (7 * week) + ((targetDay - now.getDay() + 7) % 7))
          date.setHours(hours, minutes, 0, 0)
          if (date > now) {
            dates.push(date)
          }
        })
      }
      break

    case 'biweekly':
      // Schedule every 2 weeks
      for (let i = 0; i < 2; i++) {
        const date = new Date(now)
        date.setDate(date.getDate() + (14 * i))
        date.setHours(hours, minutes, 0, 0)
        if (date > now) {
          dates.push(date)
        }
      }
      break

    case 'monthly':
      // Schedule once per month
      const date = new Date(now)
      date.setMonth(date.getMonth() + 1)
      date.setHours(hours, minutes, 0, 0)
      dates.push(date)
      break
  }

  return dates.sort((a, b) => a.getTime() - b.getTime())
}
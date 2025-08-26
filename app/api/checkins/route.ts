import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const type = url.searchParams.get('type') || 'upcoming'
    const limit = parseInt(url.searchParams.get('limit') || '10')

    let checkIns
    
    if (type === 'upcoming') {
      // Get upcoming check-ins
      checkIns = await prisma.checkIn.findMany({
        where: {
          userId: session.user.id,
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
          userId: session.user.id,
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
          userId: session.user.id
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
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, data } = body

    if (action === 'schedule') {
      // Schedule new check-ins based on user preferences
      const settings = await prisma.coachSettings.findUnique({
        where: { userId: session.user.id }
      })

      if (!settings) {
        return NextResponse.json({ error: 'Coach settings not found' }, { status: 404 })
      }

      const checkInDates = calculateCheckInDates(
        settings.checkInFrequency,
        settings.checkInTime,
        settings.checkInDays ? JSON.parse(settings.checkInDays) : null
      )

      const checkIns = await Promise.all(
        checkInDates.map(date => 
          prisma.checkIn.create({
            data: {
              userId: session.user.id,
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
          where: { userId: session.user.id },
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

      // Update last check-in in settings
      await prisma.coachSettings.update({
        where: { userId: session.user.id },
        data: { lastCheckIn: new Date() }
      })

      // Check for achievements related to check-ins
      const completedCheckIns = await prisma.checkIn.count({
        where: {
          userId: session.user.id,
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
  days: string[] | null
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
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
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
    const action = searchParams.get('action') || 'session'

    if (action === 'history') {
      // CONSOLIDATED: Login history functionality (formerly /api/login-history)
      const days = parseInt(searchParams.get('days') || '30')
      const includeAnalytics = searchParams.get('analytics') === 'true'

      // Get basic streak information
      const streakInfo = await LoginTracker.getDayStreak(user.id)

      let response: any = {
        streak: streakInfo,
        totalLogins: 0,
        uniqueDays: 0,
        recentLogins: []
      }

      if (includeAnalytics) {
        // Get detailed analytics
        const analytics = await LoginTracker.getLoginAnalytics(user.id, days)
        response = {
          ...response,
          ...analytics
        }
      } else {
        // Get basic login history
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)
        
        const loginHistory = await prisma.loginHistory.findMany({
          where: {
            userId: user.id,
            loginTime: {
              gte: startDate
            }
          },
          orderBy: {
            loginTime: 'desc'
          },
          take: 50
        })

        response.recentLogins = loginHistory
        response.totalLogins = loginHistory.length
        
        // Calculate unique days
        const uniqueDays = new Set()
        loginHistory.forEach(login => {
          const day = login.loginTime.toISOString().split('T')[0]
          uniqueDays.add(day)
        })
        response.uniqueDays = uniqueDays.size
      }

      return NextResponse.json(response)
    }

    if (action === 'session') {
      // Default: return session information
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        authenticated: true
      })
    }

    return NextResponse.json(
      { error: 'Invalid action parameter' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error processing auth request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
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

    const body = await request.json()
    const action = body.action || 'track'

    if (action === 'track') {
      // CONSOLIDATED: Track login functionality (formerly /api/track-login)
      
      // Get user from database with timeout protection
      const user = await Promise.race([
        prisma.user.findUnique({
          where: { email: session.user.email }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 5000)
        )
      ]) as any

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Get IP address and user agent from request headers
      const headers = request.headers
      const ipAddress = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown'
      const userAgent = headers.get('user-agent') || 'unknown'

      // Check if we already have a login record for today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const existingLogin = await prisma.loginHistory.findFirst({
        where: {
          userId: user.id,
          loginTime: {
            gte: today,
            lt: tomorrow
          }
        }
      })

      // If no login today, create a new record
      if (!existingLogin) {
        await prisma.loginHistory.create({
          data: {
            userId: user.id,
            loginTime: new Date(),
            ipAddress: ipAddress,
            userAgent: userAgent
          }
        })

        console.log(`📊 LOGIN TRACKED: User ${user.id} logged in from ${ipAddress}`)
      }

      // Always update streak info (handles day changes)
      await LoginTracker.updateDayStreak(user.id)

      const updatedStreakInfo = await LoginTracker.getDayStreak(user.id)

      return NextResponse.json({
        success: true,
        message: existingLogin ? 'Login already tracked today' : 'Login tracked successfully',
        streak: updatedStreakInfo,
        isFirstLoginToday: !existingLogin
      })
    }

    return NextResponse.json(
      { error: 'Invalid action parameter' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error processing auth action:', error)
    
    if (error.message === 'Database timeout') {
      return NextResponse.json(
        { error: 'Database connection timeout' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    )
  }
}
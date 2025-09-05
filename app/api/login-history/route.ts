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

    // Get query parameters
    const { searchParams } = new URL(request.url)
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
      const loginHistory = await prisma.loginHistory.findMany({
        where: { 
          userId: user.id,
          loginTime: {
            gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { loginTime: 'desc' },
        take: 20,
        select: {
          loginTime: true
        }
      })

      response.totalLogins = loginHistory.length
      response.uniqueDays = new Set(loginHistory.map(login => 
        login.loginTime.toISOString().split('T')[0]
      )).size
      response.recentLogins = loginHistory.map(login => ({
        date: login.loginTime.toLocaleDateString(),
        time: login.loginTime.toLocaleTimeString(),
        dayOfWeek: login.loginTime.toLocaleDateString('en-US', { weekday: 'long' }),
        timestamp: login.loginTime
      }))
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching login history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch login history' },
      { status: 500 }
    )
  }
}
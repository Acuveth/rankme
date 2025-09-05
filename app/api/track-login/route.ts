import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LoginTracker } from '@/lib/login-tracker'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

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

    // Track the login with timeout protection
    const result = await Promise.race([
      existingLogin 
        ? { success: true } // Skip if already recorded today
        : LoginTracker.trackLogin(user.id, ipAddress, userAgent),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login tracking timeout')), 8000)
      )
    ]) as any

    if (!result.success) {
      // Return success even if tracking fails to prevent user-facing errors
      console.warn('Login tracking failed, but continuing:', result.error)
      return NextResponse.json({
        success: true,
        streak: { currentStreak: 0, longestStreak: 0, consecutiveLoginDays: 0, totalLoginDays: 0 }
      })
    }

    // Get the updated streak information with timeout
    const streakInfo = await Promise.race([
      LoginTracker.getDayStreak(user.id),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Streak fetch timeout')), 3000)
      )
    ]) as any

    return NextResponse.json({
      success: true,
      streak: streakInfo,
      loginTime: new Date().toISOString(),
      todayDate: new Date().toLocaleDateString(),
      todayTime: new Date().toLocaleTimeString()
    })
  } catch (error) {
    console.error('Error in track-login API:', error)
    // Return success to prevent login issues, just with default streak values
    return NextResponse.json({
      success: true,
      streak: { currentStreak: 0, longestStreak: 0, consecutiveLoginDays: 0, totalLoginDays: 0 }
    })
  }
}
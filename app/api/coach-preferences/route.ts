import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    // Get assessmentId from query parameters
    const url = new URL(request.url)
    const assessmentId = url.searchParams.get('assessmentId')

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID required' },
        { status: 400 }
      )
    }

    // Verify assessment belongs to user
    const assessment = await prisma.assessment.findFirst({
      where: {
        id: assessmentId,
        userId: user.id
      }
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found or unauthorized' },
        { status: 404 }
      )
    }

    // Get or create coach settings for this specific assessment
    let settings = await prisma.coachSettings.findUnique({
      where: { 
        userId_assessmentId: {
          userId: user.id,
          assessmentId: assessmentId
        }
      }
    })

    if (!settings) {
      // Create default settings for this assessment
      settings = await prisma.coachSettings.create({
        data: {
          userId: user.id,
          assessmentId: assessmentId,
          primaryFocus: 'financial',
          coachingStyle: 'supportive',
          dailyTaskCount: 3,
          weeklyTaskCount: 2,
          taskDifficulty: 'moderate',
          motivationLevel: 'balanced',
          checkInFrequency: 'daily',
          checkInTime: '09:00',
          hasCompletedSetup: false
        }
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching coach preferences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
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
    const { preferences, assessmentId } = body

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID required' },
        { status: 400 }
      )
    }

    // Verify assessment belongs to user
    const assessment = await prisma.assessment.findFirst({
      where: {
        id: assessmentId,
        userId: user.id
      }
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found or unauthorized' },
        { status: 404 }
      )
    }

    // Update or create coach settings for this specific assessment
    const settings = await prisma.coachSettings.upsert({
      where: { 
        userId_assessmentId: {
          userId: user.id,
          assessmentId: assessmentId
        }
      },
      update: {
        primaryFocus: preferences.primaryFocus,
        secondaryFocus: preferences.secondaryFocus,
        dailyTaskCount: preferences.dailyTaskCount,
        weeklyTaskCount: preferences.weeklyTaskCount,
        taskDifficulty: preferences.taskDifficulty,
        coachingStyle: preferences.coachingStyle,
        motivationLevel: preferences.motivationLevel,
        checkInFrequency: preferences.checkInFrequency,
        checkInTime: preferences.checkInTime,
        specificGoals: preferences.specificGoals,
        hasCompletedSetup: true,
        setupCompletedAt: new Date()
      },
      create: {
        userId: user.id,
        assessmentId: assessmentId,
        primaryFocus: preferences.primaryFocus,
        secondaryFocus: preferences.secondaryFocus,
        dailyTaskCount: preferences.dailyTaskCount,
        weeklyTaskCount: preferences.weeklyTaskCount,
        taskDifficulty: preferences.taskDifficulty,
        coachingStyle: preferences.coachingStyle,
        motivationLevel: preferences.motivationLevel,
        checkInFrequency: preferences.checkInFrequency,
        checkInTime: preferences.checkInTime,
        specificGoals: preferences.specificGoals,
        hasCompletedSetup: true,
        setupCompletedAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true,
      settings 
    })
  } catch (error) {
    console.error('Error saving coach preferences:', error)
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
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
    const { updates, assessmentId } = body

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID required' },
        { status: 400 }
      )
    }

    // Verify assessment belongs to user
    const assessment = await prisma.assessment.findFirst({
      where: {
        id: assessmentId,
        userId: user.id
      }
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found or unauthorized' },
        { status: 404 }
      )
    }

    // Update specific fields for this assessment
    const settings = await prisma.coachSettings.update({
      where: { 
        userId_assessmentId: {
          userId: user.id,
          assessmentId: assessmentId
        }
      },
      data: updates
    })

    return NextResponse.json({ 
      success: true,
      settings 
    })
  } catch (error) {
    console.error('Error updating coach preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
}
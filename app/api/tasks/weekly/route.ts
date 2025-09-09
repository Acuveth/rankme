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

    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get('assessmentId')
    const week = searchParams.get('week')
    const includeCompleted = searchParams.get('includeCompleted') === 'true'

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      )
    }

    // Verify user owns the assessment
    const assessment = await prisma.assessment.findUnique({
      where: { 
        id: assessmentId,
        userId: user.id 
      }
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found or access denied' },
        { status: 404 }
      )
    }

    // Build query filters
    const whereClause: any = {
      userId: user.id,
      assessmentId: assessmentId
    }

    // If specific week provided, filter by that week
    if (week) {
      whereClause.week = parseInt(week)
    }

    // Filter by completion status if specified
    if (!includeCompleted) {
      // Default behavior can be to include all tasks
      // This parameter allows filtering out completed ones if needed
    }

    const weeklyTasks = await prisma.weeklyTask.findMany({
      where: whereClause,
      orderBy: [
        { week: 'desc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      tasks: weeklyTasks,
      count: weeklyTasks.length
    })

  } catch (error) {
    console.error('Error fetching weekly tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weekly tasks' },
      { status: 500 }
    )
  }
}
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

// CONSOLIDATED: User weekly task creation (formerly /api/tasks/user POST for weekly tasks)
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
    const { title, description, category, priority, estimatedMinutes, weekNumber, assessmentId } = body

    if (!title || !category || !weekNumber) {
      return NextResponse.json(
        { error: 'Title, category, and week number are required' },
        { status: 400 }
      )
    }

    // Use provided assessmentId or get the user's most recent assessment
    let finalAssessmentId = assessmentId
    
    if (!finalAssessmentId) {
      const assessment = await prisma.assessment.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })

      if (!assessment) {
        return NextResponse.json(
          { error: 'No assessment found. Please complete an assessment first.' },
          { status: 400 }
        )
      }
      
      finalAssessmentId = assessment.id
    } else {
      // Verify the provided assessmentId belongs to the user
      const assessment = await prisma.assessment.findFirst({
        where: { 
          id: finalAssessmentId,
          userId: user.id 
        }
      })
      
      if (!assessment) {
        return NextResponse.json(
          { error: 'Invalid assessment ID.' },
          { status: 400 }
        )
      }
    }

    const task = await prisma.weeklyTask.create({
      data: {
        userId: user.id,
        assessmentId: finalAssessmentId,
        title,
        description: description || '',
        category,
        source: 'user',
        priority: priority || 'medium',
        estimatedMinutes: estimatedMinutes || 60,
        week: weekNumber
      }
    })

    return NextResponse.json({
      success: true,
      task
    })

  } catch (error) {
    console.error('Error creating weekly task:', error)
    
    // Handle unique constraint violations
    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        { error: 'A task with this title already exists for this week' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
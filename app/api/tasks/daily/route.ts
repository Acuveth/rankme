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
    const date = searchParams.get('date')

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

    // If specific date provided, filter by that date
    if (date) {
      const targetDate = new Date(date)
      const startOfDay = new Date(targetDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(targetDate)
      endOfDay.setHours(23, 59, 59, 999)
      
      whereClause.date = {
        gte: startOfDay,
        lte: endOfDay
      }
    }

    const dailyTasks = await prisma.dailyTask.findMany({
      where: whereClause,
      orderBy: [
        { date: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      tasks: dailyTasks,
      count: dailyTasks.length
    })

  } catch (error) {
    console.error('Error fetching daily tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily tasks' },
      { status: 500 }
    )
  }
}

// CONSOLIDATED: User task creation (formerly /api/tasks/user POST for daily tasks)
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
    const { title, description, category, priority, estimatedMinutes, date, assessmentId } = body

    if (!title || !category || !date) {
      return NextResponse.json(
        { error: 'Title, category, and date are required' },
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

    const task = await prisma.dailyTask.create({
      data: {
        userId: user.id,
        assessmentId: finalAssessmentId,
        title,
        description: description || '',
        category,
        source: 'user',
        priority: priority || 'medium',
        estimatedMinutes: estimatedMinutes || 30,
        date: new Date(date)
      }
    })

    return NextResponse.json({
      success: true,
      task
    })

  } catch (error) {
    console.error('Error creating daily task:', error)
    
    // Handle unique constraint violations
    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        { error: 'A task with this title already exists for this date' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
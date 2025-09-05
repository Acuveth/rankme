import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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
    const { type, title, description, category, priority, estimatedMinutes, date, weekNumber, assessmentId } = body

    if (!title || !category) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      )
    }

    if (type === 'daily') {
      if (!date) {
        return NextResponse.json(
          { error: 'Date is required for daily tasks' },
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

      console.log('Creating daily task with:', {
        userId: user.id,
        assessmentId: finalAssessmentId,
        title,
        date: new Date(date),
        category
      })

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

      console.log('Daily task created successfully:', task.id)

      return NextResponse.json({
        success: true,
        task
      })
    }

    if (type === 'weekly') {
      if (!weekNumber) {
        return NextResponse.json(
          { error: 'Week number is required for weekly tasks' },
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
    }

    return NextResponse.json(
      { error: 'Invalid task type. Use "daily" or "weekly"' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error creating user task:', error)
    
    // Handle unique constraint violations
    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        { error: 'A task with this title already exists for this date/week' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create task' },
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
    const taskId = searchParams.get('id')
    const type = searchParams.get('type')

    if (!taskId || !type) {
      return NextResponse.json(
        { error: 'Task ID and type are required' },
        { status: 400 }
      )
    }

    if (type === 'daily') {
      await prisma.dailyTask.delete({
        where: {
          id: taskId,
          userId: user.id,
          source: 'user' // Only allow deleting user-created tasks
        }
      })
    } else if (type === 'weekly') {
      await prisma.weeklyTask.delete({
        where: {
          id: taskId,
          userId: user.id,
          source: 'user' // Only allow deleting user-created tasks
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid task type' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting user task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
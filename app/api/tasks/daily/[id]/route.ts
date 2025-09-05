import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const { completed, assessmentId } = body

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      )
    }

    // Verify the task belongs to the user and assessment
    const task = await prisma.dailyTask.findUnique({
      where: {
        id: params.id,
      }
    })

    if (!task || task.userId !== user.id || task.assessmentId !== assessmentId) {
      return NextResponse.json(
        { error: 'Task not found or access denied' },
        { status: 404 }
      )
    }

    // Update the task completion status
    const updatedTask = await prisma.dailyTask.update({
      where: {
        id: params.id
      },
      data: {
        completed: completed,
        completedAt: completed ? new Date() : null
      }
    })

    return NextResponse.json({ 
      success: true, 
      task: updatedTask 
    })

  } catch (error) {
    console.error('Error updating daily task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Verify the task belongs to the user
    const task = await prisma.dailyTask.findUnique({
      where: {
        id: params.id,
      }
    })

    if (!task || task.userId !== user.id) {
      return NextResponse.json(
        { error: 'Task not found or access denied' },
        { status: 404 }
      )
    }

    // Delete the task
    await prisma.dailyTask.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting daily task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
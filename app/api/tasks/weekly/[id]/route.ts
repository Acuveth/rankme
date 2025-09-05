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

    console.log(`[WEEKLY TASK API] PUT request for task ${params.id}, completed: ${completed}`)

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      )
    }

    // Verify the task belongs to the user and assessment
    const task = await prisma.weeklyTask.findUnique({
      where: {
        id: params.id,
      }
    })

    if (!task) {
      console.log(`[WEEKLY TASK API] Task not found with ID: ${params.id}`)
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    console.log(`[WEEKLY TASK API] Found task:`, {
      id: task.id,
      title: task.title,
      currentCompleted: task.completed,
      userId: task.userId,
      assessmentId: task.assessmentId
    })

    if (task.userId !== user.id || task.assessmentId !== assessmentId) {
      console.log(`[WEEKLY TASK API] Access denied - userId or assessmentId mismatch`)
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Update the task completion status
    const updatedTask = await prisma.weeklyTask.update({
      where: {
        id: params.id
      },
      data: {
        completed: completed,
        completedAt: completed ? new Date() : null
      }
    })

    console.log(`[WEEKLY TASK API] Updated task:`, {
      id: updatedTask.id,
      title: updatedTask.title,
      completed: updatedTask.completed
    })

    return NextResponse.json({ 
      success: true, 
      task: updatedTask 
    })

  } catch (error) {
    console.error('Error updating weekly task:', error)
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
    const task = await prisma.weeklyTask.findUnique({
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
    await prisma.weeklyTask.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting weekly task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
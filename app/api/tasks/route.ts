import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { taskUpdateSchema, objectIdSchema } from '@/lib/validations/schemas'
import { withMiddleware, withValidation, withSecurityHeaders } from '@/lib/middleware/security'
import { withErrorHandler, throwIfNotFound, AuthenticationError, AuthorizationError, validateInput } from '@/lib/utils/errorHandler'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      throw new AuthenticationError()
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    throwIfNotFound(user, 'User not found')

    const { searchParams } = new URL(request.url)
    const taskType = searchParams.get('type') // daily or weekly
    const taskId = searchParams.get('id')

    if (!taskType || !taskId) {
      return NextResponse.json(
        { error: 'Type and ID parameters are required' },
        { status: 400 }
      )
    }

    if (taskType !== 'daily' && taskType !== 'weekly') {
      return NextResponse.json(
        { error: 'Type must be daily or weekly' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = validateInput(taskUpdateSchema, body)

    let updatedTask

    if (taskType === 'daily') {
      // CONSOLIDATED: Daily task update (formerly /api/tasks/daily/[id])
      updatedTask = await prisma.dailyTask.update({
        where: {
          id: taskId,
          userId: user!.id
        },
        data: {
          ...validatedData,
          completedAt: validatedData.completed ? new Date() : null
        }
      })
    } else {
      // CONSOLIDATED: Weekly task update (formerly /api/tasks/weekly/[id])  
      updatedTask = await prisma.weeklyTask.update({
        where: {
          id: taskId,
          userId: user!.id
        },
        data: {
          ...validatedData,
          completedAt: validatedData.completed ? new Date() : null
        }
      })
    }

    return NextResponse.json({
      success: true,
      task: updatedTask
    })

  } catch (error) {
    console.error(`Error updating ${searchParams?.get('type')} task:`, error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      throw new AuthenticationError()
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    throwIfNotFound(user, 'User not found')

    const { searchParams } = new URL(request.url)
    const taskType = searchParams.get('type') // daily or weekly
    const taskId = searchParams.get('id')

    if (!taskType || !taskId) {
      return NextResponse.json(
        { error: 'Type and ID parameters are required' },
        { status: 400 }
      )
    }

    if (taskType !== 'daily' && taskType !== 'weekly') {
      return NextResponse.json(
        { error: 'Type must be daily or weekly' },
        { status: 400 }
      )
    }

    if (taskType === 'daily') {
      // CONSOLIDATED: Daily task delete (formerly /api/tasks/daily/[id])
      await prisma.dailyTask.delete({
        where: {
          id: taskId,
          userId: user!.id
        }
      })
    } else {
      // CONSOLIDATED: Weekly task delete (formerly /api/tasks/weekly/[id])
      await prisma.weeklyTask.delete({
        where: {
          id: taskId,
          userId: user!.id
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: `${taskType} task deleted successfully`
    })

  } catch (error) {
    console.error(`Error deleting ${searchParams?.get('type')} task:`, error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      throw new AuthenticationError()
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    throwIfNotFound(user, 'User not found')

    const { searchParams } = new URL(request.url)
    const taskType = searchParams.get('type') // daily or weekly
    const taskId = searchParams.get('id')

    if (!taskType || !taskId) {
      return NextResponse.json(
        { error: 'Type and ID parameters are required' },
        { status: 400 }
      )
    }

    if (taskType !== 'daily' && taskType !== 'weekly') {
      return NextResponse.json(
        { error: 'Type must be daily or weekly' },
        { status: 400 }
      )
    }

    let task

    if (taskType === 'daily') {
      // CONSOLIDATED: Get daily task (formerly /api/tasks/daily/[id])
      task = await prisma.dailyTask.findUnique({
        where: {
          id: taskId,
          userId: user!.id
        }
      })
    } else {
      // CONSOLIDATED: Get weekly task (formerly /api/tasks/weekly/[id])
      task = await prisma.weeklyTask.findUnique({
        where: {
          id: taskId,
          userId: user!.id
        }
      })
    }

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      task
    })

  } catch (error) {
    console.error(`Error fetching ${searchParams?.get('type')} task:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    )
  }
}
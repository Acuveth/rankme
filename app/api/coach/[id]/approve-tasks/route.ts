import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
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

    const body = await request.json()
    const { 
      selectedTasks,
      category,
      // Optional: allow users to modify tasks before creation
      customizations = {}
    } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          where: {
            status: 'active',
            product: 'ai_coach_monthly'
          }
        }
      }
    })

    if (!user || user.subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No active AI Coach subscription' },
        { status: 403 }
      )
    }

    // Verify assessment exists and belongs to user
    const assessment = await prisma.assessment.findUnique({
      where: { 
        id: params.id,
        userId: user.id 
      }
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    // Validate selected tasks structure
    if (!selectedTasks || (!selectedTasks.daily && !selectedTasks.weekly)) {
      return NextResponse.json(
        { error: 'No tasks selected for creation' },
        { status: 400 }
      )
    }

    const createdTasks = {
      daily: [],
      weekly: [],
      rejected: [],
      customized: []
    }

    // Get current date/week info
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const currentWeek = Math.floor((Date.now() - Date.UTC(2024, 0, 1)) / (1000 * 60 * 60 * 24 * 7)) + 1

    // Create selected daily tasks
    if (selectedTasks.daily && selectedTasks.daily.length > 0) {
      for (const selectedTask of selectedTasks.daily) {
        try {
          // Check if user customized this task
          const customization = customizations[selectedTask.id] || {}
          
          const taskData = {
            userId: user.id,
            assessmentId: assessment.id,
            title: customization.title || selectedTask.title,
            description: customization.description || selectedTask.description,
            category: selectedTask.category,
            estimatedMinutes: customization.estimatedMinutes || selectedTask.estimatedMinutes,
            priority: customization.priority || selectedTask.priority,
            source: 'ai_coach_approved',
            date: today
          }

          const dailyTask = await prisma.dailyTask.create({
            data: taskData
          })

          createdTasks.daily.push({
            ...dailyTask,
            wasCustomized: Object.keys(customization).length > 0,
            originalTask: selectedTask
          })

          if (Object.keys(customization).length > 0) {
            createdTasks.customized.push({
              taskId: dailyTask.id,
              changes: customization
            })
          }
        } catch (error) {
          console.error('Error creating daily task:', error)
          createdTasks.rejected.push({
            task: selectedTask,
            error: 'Failed to create task',
            type: 'daily'
          })
        }
      }
    }

    // Create selected weekly tasks
    if (selectedTasks.weekly && selectedTasks.weekly.length > 0) {
      for (const selectedTask of selectedTasks.weekly) {
        try {
          // Check if user customized this task
          const customization = customizations[selectedTask.id] || {}
          
          const taskData = {
            userId: user.id,
            assessmentId: assessment.id,
            title: customization.title || selectedTask.title,
            description: customization.description || selectedTask.description,
            category: selectedTask.category,
            estimatedMinutes: customization.estimatedMinutes || selectedTask.estimatedMinutes,
            priority: customization.priority || selectedTask.priority,
            source: 'ai_coach_approved',
            week: currentWeek
          }

          const weeklyTask = await prisma.weeklyTask.create({
            data: taskData
          })

          createdTasks.weekly.push({
            ...weeklyTask,
            wasCustomized: Object.keys(customization).length > 0,
            originalTask: selectedTask
          })

          if (Object.keys(customization).length > 0) {
            createdTasks.customized.push({
              taskId: weeklyTask.id,
              changes: customization
            })
          }
        } catch (error) {
          console.error('Error creating weekly task:', error)
          createdTasks.rejected.push({
            task: selectedTask,
            error: 'Failed to create task',
            type: 'weekly'
          })
        }
      }
    }

    const totalCreated = createdTasks.daily.length + createdTasks.weekly.length
    const totalCustomized = createdTasks.customized.length
    const totalRejected = createdTasks.rejected.length

    return NextResponse.json({
      success: true,
      message: `Successfully created ${totalCreated} personalized tasks for ${category}${totalCustomized > 0 ? ` (${totalCustomized} customized)` : ''}${totalRejected > 0 ? `. ${totalRejected} tasks failed to create.` : '.'}`,
      summary: {
        totalRequested: (selectedTasks.daily?.length || 0) + (selectedTasks.weekly?.length || 0),
        totalCreated,
        totalCustomized,
        totalRejected,
        category
      },
      createdTasks: {
        daily: createdTasks.daily,
        weekly: createdTasks.weekly
      },
      ...(totalRejected > 0 && {
        rejectedTasks: createdTasks.rejected
      }),
      ...(totalCustomized > 0 && {
        customizations: createdTasks.customized
      }),
      nextSteps: {
        dashboard: "Visit your dashboard to see and manage your new tasks",
        coaching: "Continue chatting with your AI coach for guidance on completing these tasks",
        progress: "Tasks will be tracked automatically as you complete them"
      },
      flow: {
        step1: "✅ Assessment analyzed for specific issues",
        step2: "✅ AI generated personalized task recommendations", 
        step3: "✅ You reviewed and selected preferred tasks",
        step4: "✅ Selected tasks added to your dashboard",
        step5: "🎯 Ready to start improving your life!"
      }
    })
  } catch (error) {
    console.error('Error approving tasks:', error)
    return NextResponse.json(
      { error: 'Failed to create approved tasks' },
      { status: 500 }
    )
  }
}
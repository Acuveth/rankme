import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateDailyTasks, generateWeeklyTasks } from '@/lib/openai'
import { enhancedCoachingEngine } from '@/lib/enhanced-coaching'

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
    const { type, date, weekNumber, assessmentId } = body

    // Get user's assessment data for personalization
    let assessment = null
    if (assessmentId) {
      assessment = await prisma.assessment.findUnique({
        where: {
          id: assessmentId,
          userId: user.id
        },
        include: {
          scoreOverall: true
        }
      })
    }

    if (!assessment) {
      // Get the most recent assessment
      assessment = await prisma.assessment.findFirst({
        where: { userId: user.id },
        include: { scoreOverall: true },
        orderBy: { createdAt: 'desc' }
      })
    }

    if (!assessment || !assessment.scoreOverall) {
      return NextResponse.json(
        { error: 'No assessment data found' },
        { status: 400 }
      )
    }

    const assessmentData = {
      overall: {
        score: assessment.scoreOverall.overall,
        percentile: assessment.scoreOverall.percentileOverall
      },
      categories: {
        financial: assessment.scoreOverall.percentileFinancial,
        health: assessment.scoreOverall.percentileHealth,
        social: assessment.scoreOverall.percentileSocial,
        romantic: assessment.scoreOverall.percentileRomantic
      },
      cohort: {
        age_band: assessment.cohortAge,
        sex: assessment.cohortSex,
        region: assessment.cohortRegion
      }
    }

    if (type === 'daily') {
      if (!date) {
        return NextResponse.json(
          { error: 'Date is required for daily tasks' },
          { status: 400 }
        )
      }

      // Get existing tasks for this date to avoid duplicates
      const existingTasks = await prisma.dailyTask.findMany({
        where: {
          userId: user.id,
          date: new Date(date)
        },
        select: { title: true }
      })

      const existingTaskTitles = existingTasks.map(task => task.title)
      const generatedTasks = await generateDailyTasks(assessmentData, date, existingTaskTitles)

      // Get task adaptations for better personalization
      const adaptations = await Promise.all(
        ['financial', 'health', 'social', 'romantic'].map(category =>
          enhancedCoachingEngine.adaptTaskDifficulty(user.id, category)
        )
      )
      const allAdaptations = adaptations.flat()

      // Apply adaptations to generated tasks
      const adaptedTasks = generatedTasks.tasks.map(task => {
        const adaptation = allAdaptations.find(a => a.originalTask.toLowerCase().includes(task.title.toLowerCase().split(' ')[0]))
        if (adaptation) {
          return {
            ...task,
            title: adaptation.adaptedTask,
            description: `${task.description} (Adapted: ${adaptation.explanation})`
          }
        }
        return task
      })

      // Save generated tasks to database
      const savedTasks = []
      for (const task of adaptedTasks) {
        const savedTask = await prisma.dailyTask.create({
          data: {
            userId: user.id,
            title: task.title,
            description: task.description,
            category: task.category,
            source: 'llm',
            priority: task.priority,
            estimatedMinutes: task.estimatedMinutes,
            date: new Date(date)
          }
        })
        savedTasks.push(savedTask)
      }

      return NextResponse.json({
        success: true,
        tasks: savedTasks,
        count: savedTasks.length
      })
    }

    if (type === 'weekly') {
      if (!weekNumber) {
        return NextResponse.json(
          { error: 'Week number is required for weekly tasks' },
          { status: 400 }
        )
      }

      const generatedTasks = await generateWeeklyTasks(assessmentData, weekNumber)

      // Save generated tasks to database
      const savedTasks = []
      for (const task of generatedTasks.tasks) {
        try {
          const savedTask = await prisma.weeklyTask.create({
            data: {
              userId: user.id,
              title: task.title,
              description: task.description,
              category: task.category,
              source: 'llm',
              priority: task.priority,
              estimatedMinutes: task.estimatedMinutes,
              week: weekNumber,
              assessmentId: assessment.id
            }
          })
          savedTasks.push(savedTask)
        } catch (error) {
          // Skip duplicate tasks (based on unique constraint)
          console.log(`Skipping duplicate task: ${task.title}`)
        }
      }

      return NextResponse.json({
        success: true,
        tasks: savedTasks,
        count: savedTasks.length
      })
    }

    return NextResponse.json(
      { error: 'Invalid task type. Use "daily" or "weekly"' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error generating tasks:', error)
    return NextResponse.json(
      { error: 'Failed to generate tasks' },
      { status: 500 }
    )
  }
}
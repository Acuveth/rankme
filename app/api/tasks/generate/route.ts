import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
// REMOVED: Basic task generation functions - using enhancedCoachingEngine.generateCustomTasks only
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
    const { 
      type, 
      date, 
      weekNumber, 
      assessmentId,
      // New customization options
      focusAreas = [],
      difficulty = 'moderate',
      dailyCount,
      weeklyCount,
      specificGoals,
      categories,
      userRequest
    } = body

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

    // Gather user context for personalized task generation
    const context = await enhancedCoachingEngine.gatherUserContext(user.id, assessment.id)

    // Determine focus areas
    const effectiveFocusAreas = focusAreas.length > 0 ? focusAreas : ['financial', 'health', 'social', 'personal']
    
    // Get existing tasks to avoid duplicates
    const existingTasks = []
    if (type === 'daily' || !type) {
      if (!date) {
        return NextResponse.json(
          { error: 'Date is required when generating daily tasks' },
          { status: 400 }
        )
      }
      const existing = await prisma.dailyTask.findMany({
        where: { userId: user.id, date: new Date(date) },
        select: { title: true }
      })
      existingTasks.push(...existing.map(task => task.title))
    }

    if (type === 'weekly' || !type) {
      const currentWeek = weekNumber || Math.ceil((Date.now() - new Date('2024-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000))
      const existing = await prisma.weeklyTask.findMany({
        where: { userId: user.id, week: currentWeek },
        select: { title: true }
      })
      existingTasks.push(...existing.map(task => task.title))
    }

    // Set up task preferences for separate generation functions
    const taskPreferences = {
      difficulty: difficulty as 'easy' | 'moderate' | 'challenging',
      specificGoals,
      existingTasks,
      userRequest: userRequest || `Generate ${type || 'daily and weekly'} tasks`,
      timeframe: date ? new Date(date).toLocaleDateString() : `Week ${weekNumber || 'current'}`
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
      return NextResponse.json(
        { 
          error: 'Sorry, the AI Coach is currently unavailable. Please check back later or contact support if this persists.',
          success: false
        },
        { status: 503 }
      )
    }

    try {
      const savedTasks = { daily: [], weekly: [] }

      // Generate and save daily tasks if requested
      if ((type === 'daily' || !type) && dailyCount > 0 && date) {
        const dailyTasksGenerated = await enhancedCoachingEngine.generateDailyTasks(
          effectiveFocusAreas,
          assessmentData,
          context,
          dailyCount,
          taskPreferences
        )

        if (dailyTasksGenerated && dailyTasksGenerated.length > 0) {
          for (const task of dailyTasksGenerated) {
            try {
              const savedTask = await prisma.dailyTask.create({
                data: {
                  userId: user.id,
                  assessmentId: assessment.id,
                  title: task.title,
                  description: task.description,
                  category: task.category,
                  source: 'ai_coach_custom',
                  priority: task.priority || 'medium',
                  estimatedMinutes: task.estimatedMinutes,
                  date: new Date(date)
                }
              })
              savedTasks.daily.push(savedTask)
            } catch (error) {
              console.log(`Skipping duplicate daily task: ${task.title}`)
            }
          }
        } else {
          return NextResponse.json(
            { 
              error: 'Sorry, the AI Coach is currently unavailable. Please try again later.',
              success: false
            },
            { status: 503 }
          )
        }
      }

      // Generate and save weekly tasks if requested
      if ((type === 'weekly' || !type) && weeklyCount > 0) {
        const currentWeek = weekNumber || Math.ceil((Date.now() - new Date('2024-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000))
        
        const weeklyTasksGenerated = await enhancedCoachingEngine.generateWeeklyTasks(
          effectiveFocusAreas,
          assessmentData,
          context,
          weeklyCount,
          taskPreferences
        )

        if (weeklyTasksGenerated && weeklyTasksGenerated.length > 0) {
          for (const task of weeklyTasksGenerated) {
            try {
              const savedTask = await prisma.weeklyTask.create({
                data: {
                  userId: user.id,
                  assessmentId: assessment.id,
                  title: task.title,
                  description: task.description,
                  category: task.category,
                  source: 'ai_coach_custom',
                  priority: task.priority || 'medium',
                  estimatedMinutes: task.estimatedMinutes,
                  week: currentWeek
                }
              })
              savedTasks.weekly.push(savedTask)
            } catch (error) {
              console.log(`Skipping duplicate weekly task: ${task.title}`)
            }
          }
        } else if (weeklyCount > 0) {
          return NextResponse.json(
            { 
              error: 'Sorry, the AI Coach is currently unavailable. Please try again later.',
              success: false
            },
            { status: 503 }
          )
        }
      }

      return NextResponse.json({
        success: true,
        tasks: savedTasks,
        dailyCount: savedTasks.daily.length,
        weeklyCount: savedTasks.weekly.length,
        totalCount: savedTasks.daily.length + savedTasks.weekly.length,
        preferences: {
          focusAreas: effectiveFocusAreas,
          dailyCount,
          weeklyCount,
          difficulty,
          specificGoals,
          userRequest
        }
      })

    } catch (error) {
      console.error('Error generating tasks:', error)
      return NextResponse.json(
        { 
          error: 'Sorry, the AI Coach is currently unavailable. Please try again later.',
          success: false
        },
        { status: 503 }
      )
    }

  } catch (error) {
    console.error('Error in task generation endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to process task generation request' },
      { status: 500 }
    )
  }
}
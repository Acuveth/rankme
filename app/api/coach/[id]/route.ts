import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generatePersonalizedCoaching, generateCoachResponse } from '@/lib/openai'
import { enhancedCoachingEngine } from '@/lib/enhanced-coaching'

export async function GET(
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

    // Find the user
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

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has active AI Coach subscription
    if (user.subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No active AI Coach subscription' },
        { status: 403 }
      )
    }

    // Get the assessment with scores
    const assessment = await prisma.assessment.findUnique({
      where: { 
        id: params.id,
        userId: user.id // Make sure user owns this assessment
      },
      include: {
        scoreCategory: true,
        scoreOverall: true
      }
    })

    if (!assessment || !assessment.scoreOverall) {
      return NextResponse.json(
        { error: 'Assessment not found or incomplete' },
        { status: 404 }
      )
    }

    // Generate AI coaching insights using LLM based on assessment results
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
      },
      completionTime: assessment.completionTime || undefined
    }

    const coachingData = await generatePersonalizedCoaching(assessmentData)

    return NextResponse.json({
      assessment: {
        id: assessment.id,
        createdAt: assessment.createdAt,
        completionTime: assessment.completionTime,
        overall: {
          score: assessment.scoreOverall.overall,
          percentile: assessment.scoreOverall.percentileOverall
        },
        categories: {
          financial: assessment.scoreOverall.percentileFinancial,
          health: assessment.scoreOverall.percentileHealth,
          social: assessment.scoreOverall.percentileSocial,
          romantic: assessment.scoreOverall.percentileRomantic
        }
      },
      coaching: coachingData,
      subscription: {
        status: user.subscriptions[0].status,
        periodEnd: user.subscriptions[0].periodEnd
      }
    })
  } catch (error) {
    console.error('Error fetching coach data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coach data' },
      { status: 500 }
    )
  }
}


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
    const { action, data } = body

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

    // Get the assessment for context
    const assessment = await prisma.assessment.findUnique({
      where: { 
        id: params.id,
        userId: user.id 
      },
      include: {
        scoreOverall: true
      }
    })

    if (!assessment || !assessment.scoreOverall) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
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
      },
      completionTime: assessment.completionTime || undefined
    }

    // Handle different coach actions
    switch (action) {
      case 'complete_checkin':
        // In a real app, you'd save this to the database
        return NextResponse.json({ 
          success: true, 
          message: 'Check-in completed! Great job staying consistent.' 
        })
      
      case 'update_goal':
        // In a real app, you'd update user goals in the database
        return NextResponse.json({ 
          success: true, 
          message: 'Goal updated successfully!' 
        })

      case 'chat':
        const startTime = Date.now()
        const { message } = data
        
        // Save user message
        await enhancedCoachingEngine.saveChatMessage(
          user.id,
          'user',
          message,
          assessment.id
        )
        
        // Gather comprehensive user context
        const context = await enhancedCoachingEngine.gatherUserContext(user.id, assessment.id)
        
        // Generate enhanced response with proactive insights
        const enhancedResponse = await enhancedCoachingEngine.generateEnhancedCoachResponse(
          message,
          assessmentData,
          context
        )
        
        const responseTime = Date.now() - startTime
        
        // Save assistant message
        await enhancedCoachingEngine.saveChatMessage(
          user.id,
          'assistant',
          enhancedResponse.message,
          assessment.id,
          context.userSettings.coachingStyle,
          responseTime
        )
        
        return NextResponse.json({ 
          success: true, 
          response: {
            message: enhancedResponse.message,
            suggestions: enhancedResponse.suggestions
          },
          insights: enhancedResponse.insights,
          context: {
            streak: context.weeklyProgress.currentStreak,
            completionRate: context.weeklyProgress.weeklyCompletionRate,
            activeGoals: context.goalProgress.length,
            recentAchievements: context.achievements.length
          }
        })

      case 'generate_weekly_plan':
        const newCoachingData = await generatePersonalizedCoaching(assessmentData)
        return NextResponse.json({ 
          success: true, 
          weeklyPlan: newCoachingData.weeklyPlan
        })

      case 'update_focus_area':
        const { focusArea, preferences } = data
        // Generate new coaching data based on updated focus area
        const updatedAssessmentData = {
          ...assessmentData,
          preferences: preferences
        }
        const updatedCoachingData = await generatePersonalizedCoaching(updatedAssessmentData)
        return NextResponse.json({ 
          success: true, 
          message: `Focus area updated to ${focusArea}. New weekly plan generated!`,
          coachingData: updatedCoachingData
        })

      case 'adapt_tasks':
        const { category } = data
        const adaptations = await enhancedCoachingEngine.adaptTaskDifficulty(user.id, category)
        return NextResponse.json({
          success: true,
          adaptations,
          message: `Task difficulty adapted based on your ${category} performance patterns.`
        })

      case 'get_proactive_insights':
        const userContext = await enhancedCoachingEngine.gatherUserContext(user.id, assessment.id)
        const insights = await enhancedCoachingEngine.generateProactiveInsights(userContext, assessmentData)
        return NextResponse.json({
          success: true,
          insights,
          contextSummary: {
            streak: userContext.weeklyProgress.currentStreak,
            completionRate: userContext.weeklyProgress.completionRate,
            activeGoals: userContext.goalProgress.length,
            recentJournalEntries: userContext.recentJournalEntries.length
          }
        })

      case 'update_coaching_style':
        const { style } = data
        await prisma.coachSettings.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            coachingStyle: style
          },
          update: {
            coachingStyle: style
          }
        })
        return NextResponse.json({
          success: true,
          message: `Coaching style updated to ${style}. I'll adjust my communication approach accordingly.`
        })
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error processing coach action:', error)
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    )
  }
}
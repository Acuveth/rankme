import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { enhancedCoachingEngine } from '@/lib/enhanced-coaching'

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
    const { category, taskPreferences } = body

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

    // Get the assessment with categorized answers and scores
    const assessment = await prisma.assessment.findUnique({
      where: { 
        id: params.id,
        userId: user.id 
      },
      include: {
        scoreCategory: true,
        scoreOverall: true,
        categorizedAnswers: true
      }
    })

    if (!assessment || !assessment.categorizedAnswers || !assessment.scoreCategory || !assessment.scoreOverall) {
      return NextResponse.json(
        { error: 'Assessment not found or incomplete' },
        { status: 404 }
      )
    }

    // Parse categorized answers
    const categorizedAnswers = {
      financial: JSON.parse(assessment.categorizedAnswers.financialAnswers),
      health_fitness: JSON.parse(assessment.categorizedAnswers.healthFitnessAnswers),
      social: JSON.parse(assessment.categorizedAnswers.socialAnswers),
      romantic: JSON.parse(assessment.categorizedAnswers.romanticAnswers),
      career: JSON.parse(assessment.categorizedAnswers.careerAnswers),
      personal_growth: JSON.parse(assessment.categorizedAnswers.personalGrowthAnswers)
    }

    // Get category-specific data
    const categoryMap = {
      financial: {
        answers: categorizedAnswers.financial,
        score: assessment.scoreCategory.financial,
        percentile: assessment.scoreOverall.percentileFinancial
      },
      health_fitness: {
        answers: categorizedAnswers.health_fitness,
        score: assessment.scoreCategory.healthFitness,
        percentile: assessment.scoreOverall.percentileHealth
      },
      social: {
        answers: categorizedAnswers.social,
        score: assessment.scoreCategory.social,
        percentile: assessment.scoreOverall.percentileSocial
      },
      romantic: {
        answers: categorizedAnswers.romantic,
        score: assessment.scoreCategory.romantic,
        percentile: assessment.scoreOverall.percentileRomantic
      },
      career: {
        answers: categorizedAnswers.career,
        score: assessment.scoreCategory.career,
        percentile: assessment.scoreOverall.percentileCareer
      },
      personal_growth: {
        answers: categorizedAnswers.personal_growth,
        score: assessment.scoreCategory.personalGrowth,
        percentile: assessment.scoreOverall.percentilePersonalGrowth
      }
    }

    const categoryData = categoryMap[category as keyof typeof categoryMap]
    
    if (!categoryData) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Step 1: Generate category-specific recommendations
    const recommendations = await enhancedCoachingEngine.generateCategorySpecificRecommendations(
      category,
      categoryData.answers,
      categoryData.score,
      categoryData.percentile,
      {
        cohort: {
          age_band: assessment.cohortAge,
          sex: assessment.cohortSex,
          region: assessment.cohortRegion
        }
      }
    )

    // Step 2: Generate tasks based on recommendations
    const generatedTasks = await enhancedCoachingEngine.generateTasksFromRecommendations(
      category,
      recommendations,
      categoryData.answers,
      taskPreferences
    )

    // Step 3: Always show preview - never auto-create tasks
    // Tasks will be created via separate approval endpoint

    return NextResponse.json({
      category,
      analysis: {
        score: categoryData.score,
        percentile: categoryData.percentile,
        insights: recommendations.insights,
        specificIssues: recommendations.specificIssues,
        recommendations: recommendations.recommendations,
        improvementPlan: recommendations.improvementPlan
      },
      taskPreview: {
        daily: generatedTasks.daily.map((task, index) => ({
          id: `daily_${index}`,
          ...task,
          reasoningExplanation: `Based on your assessment answers: ${categoryData.answers.slice(0, 2).map(a => `${a.questionId}: "${a.valueRaw}"`).join(', ')}`,
          selected: false // Default to unselected
        })),
        weekly: generatedTasks.weekly.map((task, index) => ({
          id: `weekly_${index}`,
          ...task,
          reasoningExplanation: `Addresses the specific issues identified in your ${category} assessment`,
          selected: false // Default to unselected
        }))
      },
      approvalRequired: true,
      nextStep: {
        message: "Review these personalized tasks and select which ones you'd like to add to your dashboard.",
        endpoint: `/api/coach/${params.id}/approve-tasks`,
        instruction: "Send selected task IDs to create only the tasks you want"
      },
      flow: {
        step1: "✅ Assessment answers analyzed for specific issues",
        step2: "✅ AI coach generated targeted insights and recommendations", 
        step3: "✅ Personalized tasks created based on your exact situation",
        step4: "⏳ Awaiting your approval - select which tasks to add to dashboard"
      }
    })
  } catch (error) {
    console.error('Error generating category tasks:', error)
    return NextResponse.json(
      { error: 'Failed to generate category tasks' },
      { status: 500 }
    )
  }
}
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
    const { category } = body

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

    // Generate category-specific recommendations
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

    // Get improvement gap to excellence
    const excellenceBenchmarks = {
      financial: 93.4,
      health_fitness: 88.6,
      social: 85.4,
      romantic: 91.4,
      career: 92.0,
      personal_growth: 86.1
    }

    const gapToExcellence = Math.max(0, excellenceBenchmarks[category as keyof typeof excellenceBenchmarks] - categoryData.score)

    return NextResponse.json({
      category,
      currentStatus: {
        score: categoryData.score,
        percentile: categoryData.percentile,
        gapToExcellence: Math.round(gapToExcellence)
      },
      analysis: {
        totalAnswers: categoryData.answers.length,
        keyAnswers: categoryData.answers.slice(0, 3) // Show first 3 answers as examples
      },
      recommendations: {
        insights: recommendations.insights,
        specificIssues: recommendations.specificIssues,
        actionItems: recommendations.recommendations,
        improvementPlan: recommendations.improvementPlan
      },
      cohortContext: {
        demographic: `${assessment.cohortAge} ${assessment.cohortSex} in ${assessment.cohortRegion}`,
        percentileExplanation: `You scored better than ${categoryData.percentile}% of people in your demographic group`
      }
    })
  } catch (error) {
    console.error('Error generating category recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
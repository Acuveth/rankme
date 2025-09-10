import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateScores, calculateDualScoring, getAbsolutePotentialInsights, categorizeAnswers } from '@/lib/scoring'
import { getCohortKey } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { assessmentId } = body

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: { answers: true }
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    const answers = assessment.answers.map(a => ({
      questionId: a.questionId,
      value: a.valueRaw
    }))

    // Categorize answers by life areas
    const categorizedAnswers = categorizeAnswers(assessment.answers)

    const scores = calculateScores(answers)
    
    const cohortKey = `${assessment.cohortAge}_${assessment.cohortSex}_${assessment.cohortRegion}`
    
    // Calculate dual scoring: cohort percentiles + absolute potential
    const { cohortPercentiles, absolutePotential } = calculateDualScoring(scores, cohortKey)
    
    // Get insights about gap to excellence
    const potentialInsights = getAbsolutePotentialInsights(scores)

    await prisma.scoreCategory.upsert({
      where: { assessmentId },
      create: {
        assessmentId,
        financial: scores.categories.financial,
        healthFitness: scores.categories.health_fitness,
        social: scores.categories.social,
        romantic: scores.categories.romantic,
        career: scores.categories.career,
        personalGrowth: scores.categories.personal_growth
      },
      update: {
        financial: scores.categories.financial,
        healthFitness: scores.categories.health_fitness,
        social: scores.categories.social,
        romantic: scores.categories.romantic,
        career: scores.categories.career,
        personalGrowth: scores.categories.personal_growth
      }
    })

    await prisma.scoreOverall.upsert({
      where: { assessmentId },
      create: {
        assessmentId,
        overall: scores.overall,
        percentileOverall: cohortPercentiles.overall,
        percentileFinancial: cohortPercentiles.financial,
        percentileHealth: cohortPercentiles.health,
        percentileSocial: cohortPercentiles.social,
        percentileRomantic: cohortPercentiles.romantic,
        percentileCareer: cohortPercentiles.career,
        percentilePersonalGrowth: cohortPercentiles.personal_growth
      },
      update: {
        overall: scores.overall,
        percentileOverall: cohortPercentiles.overall,
        percentileFinancial: cohortPercentiles.financial,
        percentileHealth: cohortPercentiles.health,
        percentileSocial: cohortPercentiles.social,
        percentileRomantic: cohortPercentiles.romantic,
        percentileCareer: cohortPercentiles.career,
        percentilePersonalGrowth: cohortPercentiles.personal_growth
      }
    })

    // Store categorized answers for AI coach
    await prisma.categorizedAnswers.upsert({
      where: { assessmentId },
      create: {
        assessmentId,
        financialAnswers: JSON.stringify(categorizedAnswers.financial),
        healthFitnessAnswers: JSON.stringify(categorizedAnswers.health_fitness),
        socialAnswers: JSON.stringify(categorizedAnswers.social),
        romanticAnswers: JSON.stringify(categorizedAnswers.romantic),
        careerAnswers: JSON.stringify(categorizedAnswers.career),
        personalGrowthAnswers: JSON.stringify(categorizedAnswers.personal_growth)
      },
      update: {
        financialAnswers: JSON.stringify(categorizedAnswers.financial),
        healthFitnessAnswers: JSON.stringify(categorizedAnswers.health_fitness),
        socialAnswers: JSON.stringify(categorizedAnswers.social),
        romanticAnswers: JSON.stringify(categorizedAnswers.romantic),
        careerAnswers: JSON.stringify(categorizedAnswers.career),
        personalGrowthAnswers: JSON.stringify(categorizedAnswers.personal_growth)
      }
    })

    // Calculate completion time
    const completedAt = new Date()
    const startedAt = assessment.startedAt || assessment.createdAt
    const completionTimeInSeconds = Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000)

    await prisma.assessment.update({
      where: { id: assessmentId },
      data: { 
        status: 'completed',
        completedAt,
        completionTime: completionTimeInSeconds
      }
    })

    // Trigger cohort stats update in the background (non-blocking)
    updateCohortStatsForAssessment(assessmentId, cohortKey, scores).catch(error => {
      console.error('Failed to update cohort stats:', error)
    })

    return NextResponse.json({
      cohort: {
        age_band: assessment.cohortAge,
        sex: assessment.cohortSex,
        region: assessment.cohortRegion
      },
      overall: {
        score_0_100: scores.overall,
        cohort_percentile: cohortPercentiles.overall,
        absolute_potential: absolutePotential.overall,
        gap_to_excellence: potentialInsights.overall.gapToExcellence
      },
      categories: [
        { 
          id: 'financial', 
          score: scores.categories.financial, 
          cohort_percentile: cohortPercentiles.financial,
          absolute_potential: absolutePotential.financial,
          gap_to_excellence: potentialInsights.financial.gapToExcellence
        },
        { 
          id: 'health_fitness', 
          score: scores.categories.health_fitness, 
          cohort_percentile: cohortPercentiles.health,
          absolute_potential: absolutePotential.health,
          gap_to_excellence: potentialInsights.health.gapToExcellence
        },
        { 
          id: 'social', 
          score: scores.categories.social, 
          cohort_percentile: cohortPercentiles.social,
          absolute_potential: absolutePotential.social,
          gap_to_excellence: potentialInsights.social.gapToExcellence
        },
        { 
          id: 'romantic', 
          score: scores.categories.romantic, 
          cohort_percentile: cohortPercentiles.romantic,
          absolute_potential: absolutePotential.romantic,
          gap_to_excellence: potentialInsights.romantic.gapToExcellence
        },
        { 
          id: 'career', 
          score: scores.categories.career, 
          cohort_percentile: cohortPercentiles.career,
          absolute_potential: absolutePotential.career,
          gap_to_excellence: potentialInsights.career.gapToExcellence
        },
        { 
          id: 'personal_growth', 
          score: scores.categories.personal_growth, 
          cohort_percentile: cohortPercentiles.personal_growth,
          absolute_potential: absolutePotential.personal_growth,
          gap_to_excellence: potentialInsights.personal_growth.gapToExcellence
        }
      ],
      insights: {
        description: "Your scores are compared both to your demographic peers and to absolute excellence standards.",
        cohort_comparison: `Compared to other ${assessment.cohortAge} ${assessment.cohortSex.toLowerCase()} individuals in ${assessment.cohortRegion}`,
        excellence_benchmark: "Excellence benchmark represents the top 1% performers across all demographics"
      }
    })
  } catch (error) {
    console.error('Error calculating scores:', error)
    return NextResponse.json(
      { error: 'Failed to calculate scores' },
      { status: 500 }
    )
  }
}

async function updateCohortStatsForAssessment(
  assessmentId: string,
  cohortKey: string,
  scores: { categories: any, overall: number }
) {
  try {
    // Get all assessments in this cohort
    const [cohortAge, cohortSex, cohortRegion] = cohortKey.split('_')
    
    const cohortAssessments = await prisma.assessment.findMany({
      where: {
        cohortAge,
        cohortSex,
        cohortRegion,
        status: 'completed'
      },
      include: {
        scoreCategory: true,
        scoreOverall: true
      }
    })

    // Need at least 5 assessments for meaningful statistics
    if (cohortAssessments.length < 5) {
      return
    }

    // Collect all scores
    const allScores = {
      overall: [] as number[],
      financial: [] as number[],
      health_fitness: [] as number[],
      social: [] as number[],
      romantic: [] as number[]
    }

    for (const assessment of cohortAssessments) {
      if (assessment.scoreOverall && assessment.scoreCategory) {
        allScores.overall.push(assessment.scoreOverall.overall)
        allScores.financial.push(assessment.scoreCategory.financial)
        allScores.health_fitness.push(assessment.scoreCategory.healthFitness)
        allScores.social.push(assessment.scoreCategory.social)
        allScores.romantic.push(assessment.scoreCategory.romantic)
      }
    }

    // Update statistics for each category
    const updates = []
    for (const [category, scores] of Object.entries(allScores)) {
      if (scores.length === 0) continue
      
      const stats = calculateStatistics(scores)
      const dbCategory = category === 'health_fitness' ? 'health_fitness' : category
      
      updates.push(
        prisma.cohortStats.upsert({
          where: {
            cohortKey: `${cohortKey}_${dbCategory}`
          },
          update: {
            mean: stats.mean,
            stddev: stats.stddev,
            p1: stats.p1,
            p99: stats.p99,
            n: scores.length,
            updatedAt: new Date()
          },
          create: {
            cohortKey: `${cohortKey}_${dbCategory}`,
            category: dbCategory,
            mean: stats.mean,
            stddev: stats.stddev,
            p1: stats.p1,
            p99: stats.p99,
            n: scores.length
          }
        })
      )
    }

    if (updates.length > 0) {
      await prisma.$transaction(updates)
    }
  } catch (error) {
    console.error('Error updating cohort stats for assessment:', error)
  }
}

function calculateStatistics(scores: number[]): {
  mean: number
  stddev: number
  p1: number
  p99: number
} {
  const n = scores.length
  
  // Calculate mean
  const mean = scores.reduce((sum, score) => sum + score, 0) / n
  
  // Calculate standard deviation
  const squaredDiffs = scores.map(score => Math.pow(score - mean, 2))
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / n
  const stddev = Math.sqrt(variance)
  
  // Sort scores for percentiles
  const sorted = [...scores].sort((a, b) => a - b)
  
  // Calculate percentiles (using linear interpolation)
  const p1Index = 0.01 * (n - 1)
  const p99Index = 0.99 * (n - 1)
  
  const p1 = interpolate(sorted, p1Index)
  const p99 = interpolate(sorted, p99Index)
  
  return {
    mean: Math.round(mean * 100) / 100,
    stddev: Math.round(stddev * 100) / 100,
    p1: Math.round(p1 * 100) / 100,
    p99: Math.round(p99 * 100) / 100
  }
}

function interpolate(array: number[], index: number): number {
  if (index <= 0) return array[0]
  if (index >= array.length - 1) return array[array.length - 1]
  
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index - lower
  
  return array[lower] * (1 - weight) + array[upper] * weight
}
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateScores, calculatePercentiles } from '@/lib/scoring'
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

    const scores = calculateScores(answers)
    
    const cohortKey = `${assessment.cohortAge}_${assessment.cohortSex}_${assessment.cohortRegion}`
    
    let cohortStats = await prisma.cohortStats.findFirst({
      where: { cohortKey }
    })

    if (!cohortStats) {
      cohortStats = await prisma.cohortStats.create({
        data: {
          cohortKey,
          category: 'all',
          mean: 50,
          stddev: 20,
          p1: 1,
          p99: 99,
          n: 1
        }
      })
    }

    const percentiles = calculatePercentiles(scores, {
      overall: { mean: 50, stddev: 15 },
      financial: { mean: 50, stddev: 20 },
      health_fitness: { mean: 50, stddev: 20 },
      social: { mean: 50, stddev: 20 },
      romantic: { mean: 50, stddev: 20 }
    })

    await prisma.scoreCategory.create({
      data: {
        assessmentId,
        financial: scores.categories.financial,
        healthFitness: scores.categories.health_fitness,
        social: scores.categories.social,
        romantic: scores.categories.romantic
      }
    })

    await prisma.scoreOverall.create({
      data: {
        assessmentId,
        overall: scores.overall,
        percentileOverall: percentiles.overall,
        percentileFinancial: percentiles.financial,
        percentileHealth: percentiles.health,
        percentileSocial: percentiles.social,
        percentileRomantic: percentiles.romantic
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

    return NextResponse.json({
      cohort: {
        age_band: assessment.cohortAge,
        sex: assessment.cohortSex,
        region: assessment.cohortRegion
      },
      overall: {
        score_0_100: scores.overall,
        percentile: percentiles.overall
      },
      categories: [
        { id: 'financial', percentile: percentiles.financial },
        { id: 'health_fitness', percentile: percentiles.health },
        { id: 'social', percentile: percentiles.social },
        { id: 'romantic', percentile: percentiles.romantic }
      ]
    })
  } catch (error) {
    console.error('Error calculating scores:', error)
    return NextResponse.json(
      { error: 'Failed to calculate scores' },
      { status: 500 }
    )
  }
}
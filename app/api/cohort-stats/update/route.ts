import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// This endpoint updates cohort statistics based on completed assessments
export async function POST(request: Request) {
  try {
    // Get all completed assessments with their scores
    const assessments = await prisma.assessment.findMany({
      where: { status: 'completed' },
      include: {
        scoreCategory: true,
        scoreOverall: true
      }
    })

    // Group assessments by cohort
    const cohortGroups: { [key: string]: any[] } = {}
    
    for (const assessment of assessments) {
      if (!assessment.scoreCategory || !assessment.scoreOverall) continue
      
      const cohortKey = `${assessment.cohortAge}_${assessment.cohortSex}_${assessment.cohortRegion}`
      
      if (!cohortGroups[cohortKey]) {
        cohortGroups[cohortKey] = []
      }
      
      cohortGroups[cohortKey].push({
        overall: assessment.scoreOverall.overall,
        financial: assessment.scoreCategory.financial,
        healthFitness: assessment.scoreCategory.healthFitness,
        social: assessment.scoreCategory.social,
        romantic: assessment.scoreCategory.romantic
      })
    }

    // Calculate statistics for each cohort
    const updates = []
    
    for (const [cohortKey, scores] of Object.entries(cohortGroups)) {
      // Skip cohorts with too few samples
      if (scores.length < 5) continue
      
      // Calculate stats for each category
      const categories = ['overall', 'financial', 'healthFitness', 'social', 'romantic']
      
      for (const category of categories) {
        const categoryScores = scores.map(s => s[category])
        const stats = calculateStatistics(categoryScores)
        
        // Map category names for database
        const dbCategory = category === 'healthFitness' ? 'health_fitness' : category
        
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
    }

    // Execute all updates
    if (updates.length > 0) {
      await prisma.$transaction(updates)
    }

    return NextResponse.json({
      success: true,
      message: `Updated statistics for ${Object.keys(cohortGroups).length} cohorts`,
      totalAssessments: assessments.length
    })
  } catch (error) {
    console.error('Error updating cohort statistics:', error)
    return NextResponse.json(
      { error: 'Failed to update cohort statistics' },
      { status: 500 }
    )
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
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: params.id },
      include: {
        scoreCategory: true,
        scoreOverall: true
      }
    })

    if (!assessment || !assessment.scoreOverall) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    const scoreData = {
      cohort: {
        age_band: assessment.cohortAge,
        sex: assessment.cohortSex,
        region: assessment.cohortRegion
      },
      overall: {
        score_0_100: assessment.scoreOverall.overall,
        percentile: assessment.scoreOverall.percentileOverall
      },
      categories: [
        { id: 'financial', percentile: assessment.scoreOverall.percentileFinancial },
        { id: 'health_fitness', percentile: assessment.scoreOverall.percentileHealth },
        { id: 'social', percentile: assessment.scoreOverall.percentileSocial },
        { id: 'romantic', percentile: assessment.scoreOverall.percentileRomantic }
      ],
      completionTime: assessment.completionTime // Time in seconds
    }

    return NextResponse.json(scoreData)
  } catch (error) {
    console.error('Error fetching scorecard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scorecard' },
      { status: 500 }
    )
  }
}
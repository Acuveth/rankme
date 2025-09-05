import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id

    // Check if user has purchased the report (handle multiple product variations)
    const purchase = await prisma.purchase.findFirst({
      where: {
        assessmentId,
        status: 'completed',
        OR: [
          { product: 'deep_report_oneoff' },
          { product: 'deep_report' }
        ]
      }
    })

    if (!purchase) {
      return NextResponse.json(
        { error: 'Unauthorized - Purchase required' },
        { status: 403 }
      )
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        answers: true,
        scoreCategory: true,
        scoreOverall: true
      }
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    // Generate detailed report data
    const categoryScores = assessment.scoreCategory
    const overallScore = assessment.scoreOverall

    // Category analysis with detailed insights
    const categoryNames: { [key: string]: string } = {
      financial: 'Financial Wellness',
      healthFitness: 'Health & Fitness',
      social: 'Social Life',
      romantic: 'Personal Relationships'
    }

    const categoryPercentiles: { [key: string]: number } = {
      financial: overallScore?.percentileFinancial || 50,
      healthFitness: overallScore?.percentileHealth || 50,
      social: overallScore?.percentileSocial || 50,
      romantic: overallScore?.percentileRomantic || 50
    }

    const detailedCategories = Object.entries(categoryNames).map(([key, name]) => {
      const score = categoryScores ? (categoryScores as any)[key] || 50 : 50
      const percentile = categoryPercentiles[key]
      
      // Generate dynamic strengths and opportunities based on percentile
      const strengths = percentile > 60 ? [
        `Strong foundation in ${name}`,
        'Consistent habits and routines',
        'Above-average performance vs peers'
      ] : percentile > 40 ? [
        'Some positive habits established',
        'Room for optimization exists',
        'Baseline competency achieved'
      ] : [
        'Awareness of improvement areas',
        'Potential for significant gains',
        'Starting point established'
      ]

      const opportunities = percentile < 80 ? [
        'Increase consistency in daily practices',
        'Explore advanced strategies',
        'Connect with mentors or experts'
      ] : [
        'Maintain current momentum',
        'Share knowledge with others',
        'Focus on fine-tuning'
      ]

      const recommendations = [
        'Track progress weekly',
        'Set specific, measurable goals',
        'Celebrate small wins regularly'
      ]

      return {
        id: key,
        name: name,
        percentile: Math.round(percentile),
        score: Math.round(score),
        strengths,
        opportunities,
        recommendations
      }
    })

    // Peer comparison data
    const peerComparison = {
      betterThan: Math.round(overallScore?.percentileOverall || 50),
      similarTo: 100 - Math.round(overallScore?.percentileOverall || 50),
      category: detailedCategories.reduce((max: any, cat: any) => 
        cat.percentile > (max?.percentile || 0) ? cat : max
      )?.name || 'balanced lifestyle'
    }

    // Generate 30-day action plan
    const actionPlan = [
      {
        week: 1,
        focus: 'Foundation Building',
        actions: [
          'Complete daily self-assessment for baseline',
          'Identify top 3 priorities across all life areas',
          'Set up tracking systems and accountability'
        ],
        timeCommitment: '30 min/day'
      },
      {
        week: 2,
        focus: 'Quick Wins Implementation',
        actions: [
          'Implement 2 high-impact habits from weakest category',
          'Schedule weekly review sessions',
          'Connect with support network or accountability partner'
        ],
        timeCommitment: '45 min/day'
      },
      {
        week: 3,
        focus: 'Momentum Building',
        actions: [
          'Scale successful habits from week 2',
          'Address secondary improvement areas',
          'Measure and document progress'
        ],
        timeCommitment: '45 min/day'
      },
      {
        week: 4,
        focus: 'Integration & Optimization',
        actions: [
          'Refine routines for sustainability',
          'Plan next 30-day cycle based on results',
          'Celebrate achievements and reassess goals'
        ],
        timeCommitment: '30 min/day'
      }
    ]

    return NextResponse.json({
      assessment_id: assessment.id,
      cohort: {
        age_band: assessment.cohortAge || '20-29',
        sex: assessment.cohortSex || 'Not specified',
        region: assessment.cohortRegion || 'Global'
      },
      overall: {
        score_0_100: Math.round(overallScore?.overall || 50),
        percentile: Math.round(overallScore?.percentileOverall || 50)
      },
      categories: detailedCategories,
      peerComparison,
      actionPlan
    })
  } catch (error) {
    console.error('Error fetching report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    )
  }
}
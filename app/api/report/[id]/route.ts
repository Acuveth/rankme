import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id

    // Check if user has purchased the report
    const purchase = await prisma.purchase.findFirst({
      where: {
        assessmentId,
        product: 'deep_report',
        status: 'completed'
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

    // Generate insights (simplified for MVP)
    const insights = {
      strengths: [
        { category: 'financial', item: 'Savings Rate', score: 85 },
        { category: 'health_fitness', item: 'Exercise Frequency', score: 78 },
        { category: 'social', item: 'Friend Network', score: 72 }
      ],
      opportunities: [
        { category: 'romantic', item: 'Relationship Building', score: 45 },
        { category: 'financial', item: 'Investment Diversity', score: 38 },
        { category: 'health_fitness', item: 'Sleep Quality', score: 42 }
      ],
      drivers: {
        financial: [
          { item: 'Emergency Fund', impact: 'Increasing to 6 months could add 15 points' },
          { item: 'Debt Reduction', impact: 'Eliminating high-interest debt adds 10 points' }
        ],
        health_fitness: [
          { item: 'Strength Training', impact: 'Add 2 sessions/week for 12 point boost' },
          { item: 'Sleep Duration', impact: 'Reach 7-8 hours for 8 point improvement' }
        ],
        social: [
          { item: 'Social Initiation', impact: 'Initiate plans weekly for 10 point gain' },
          { item: 'Community Involvement', impact: 'Join 1 group for 8 point increase' }
        ],
        romantic: [
          { item: 'Date Frequency', impact: 'Increase by 2x for 15 point improvement' },
          { item: 'Communication Skills', impact: 'Practice active listening for better connection' }
        ]
      }
    }

    const actionPlan = {
      financial: [
        'Week 1-2: Review and optimize monthly expenses, target 10% reduction',
        'Week 3-4: Open high-yield savings account, automate 20% income transfer'
      ],
      health_fitness: [
        'Week 1: Establish consistent sleep schedule (10pm-6am)',
        'Week 2-4: Add 3x30min cardio sessions + 2x strength training'
      ],
      social: [
        'Week 1: Reach out to 3 old friends, schedule catch-ups',
        'Week 2-4: Join one local club or volunteer organization'
      ],
      romantic: [
        'Week 1-2: Update dating profiles with quality photos',
        'Week 3-4: Initiate 2 dates per week or plan weekly date nights'
      ]
    }

    return NextResponse.json({
      assessment,
      scores: {
        overall: assessment.scoreOverall,
        categories: assessment.scoreCategory
      },
      insights,
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
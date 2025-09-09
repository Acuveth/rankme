import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ScoreUpdater } from '@/lib/score-updater'

interface ProgressReport {
  category: 'financial' | 'health_fitness' | 'social' | 'romantic' | 'career' | 'personal_growth'
  achievementType: 'goal_completed' | 'milestone_reached' | 'habit_formed' | 'measurement_improved'
  description: string
  previousValue?: string | number
  currentValue?: string | number
  relatedQuestionId?: string
}

interface ScoreUpdateRequest {
  assessmentId: string
  progressReports: ProgressReport[]
  coachMessage?: string // Optional: the AI coach message that triggered this
}

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

    const body: ScoreUpdateRequest = await request.json()
    const { assessmentId, progressReports, coachMessage } = body

    // Validate input
    if (!assessmentId || !progressReports || !Array.isArray(progressReports)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Verify the assessment belongs to the user
    const assessment = await prisma.assessment.findUnique({
      where: { 
        id: assessmentId,
        userId: user.id
      }
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found or access denied' },
        { status: 404 }
      )
    }

    // If coachMessage is provided, extract additional progress reports
    let allProgressReports = [...progressReports]
    if (coachMessage) {
      for (const report of progressReports) {
        const extractedReports = ScoreUpdater.extractProgressFromCoachMessage(
          coachMessage,
          report.category
        )
        allProgressReports.push(...extractedReports)
      }
    }

    // Process the score update
    const updateResult = await ScoreUpdater.updateScoresBasedOnProgress(
      assessmentId,
      allProgressReports
    )

    if (!updateResult) {
      return NextResponse.json({
        updated: false,
        message: 'No significant progress detected that warrants score update',
        thresholdInfo: 'Score updates require crossing significant thresholds based on assessment questions'
      })
    }

    // Log the successful update for analytics
    console.log(`Score update successful for assessment ${assessmentId}:`, {
      oldOverallScore: updateResult.oldScores.overall,
      newOverallScore: updateResult.newScores.overall,
      improvementAreas: updateResult.improvementAreas,
      triggeredBy: updateResult.triggeredBy
    })

    return NextResponse.json({
      updated: true,
      message: 'Scores updated based on your progress!',
      scoreChanges: {
        overall: {
          old: Math.round(updateResult.oldScores.overall * 10) / 10,
          new: Math.round(updateResult.newScores.overall * 10) / 10,
          change: Math.round((updateResult.newScores.overall - updateResult.oldScores.overall) * 10) / 10
        },
        categories: Object.keys(updateResult.newScores.categories).reduce((acc, category) => {
          const oldScore = updateResult.oldScores.categories[category]
          const newScore = updateResult.newScores.categories[category]
          const change = newScore - oldScore
          
          if (Math.abs(change) >= 1) { // Only include categories with significant change
            acc[category] = {
              old: Math.round(oldScore * 10) / 10,
              new: Math.round(newScore * 10) / 10,
              change: Math.round(change * 10) / 10
            }
          }
          return acc
        }, {} as any),
        percentiles: Object.keys(updateResult.newScores.percentiles).reduce((acc, category) => {
          const oldPercentile = updateResult.oldScores.percentiles[category]
          const newPercentile = updateResult.newScores.percentiles[category]
          const change = newPercentile - oldPercentile
          
          if (Math.abs(change) >= 2) { // Only include percentiles with significant change
            acc[category] = {
              old: Math.round(oldPercentile),
              new: Math.round(newPercentile),
              change: Math.round(change)
            }
          }
          return acc
        }, {} as any)
      },
      improvementAreas: updateResult.improvementAreas,
      triggeredBy: updateResult.triggeredBy
    })

  } catch (error) {
    console.error('Error updating scores based on progress:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update scores',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get('assessmentId')

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID required' },
        { status: 400 }
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

    // Get score update history for this assessment
    const scoreUpdates = await prisma.scoreUpdateLog.findMany({
      where: { 
        assessment: {
          id: assessmentId,
          userId: user.id
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10 // Last 10 updates
    })

    const formattedUpdates = scoreUpdates.map(update => ({
      id: update.id,
      date: update.createdAt,
      oldOverallScore: update.oldOverallScore,
      newOverallScore: update.newOverallScore,
      improvement: update.newOverallScore - update.oldOverallScore,
      triggerReason: JSON.parse(update.triggerReason),
      categoryChanges: {
        old: JSON.parse(update.oldCategoryScores),
        new: JSON.parse(update.newCategoryScores)
      },
      percentileChanges: {
        old: JSON.parse(update.oldPercentiles),
        new: JSON.parse(update.newPercentiles)
      }
    }))

    return NextResponse.json({
      assessmentId,
      totalUpdates: scoreUpdates.length,
      updates: formattedUpdates
    })

  } catch (error) {
    console.error('Error fetching score update history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch score update history' },
      { status: 500 }
    )
  }
}
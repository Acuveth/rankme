import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProgressTracker } from '@/lib/progress-tracker'

export async function GET(request: Request) {
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

    // Get comprehensive progress stats using the tracker
    const progressStats = await ProgressTracker.getUserProgress(user.id)

    // Get user's most recent assessment for current score
    const latestAssessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      include: { scoreOverall: true },
      orderBy: { createdAt: 'desc' }
    })

    const currentScore = latestAssessment?.scoreOverall?.percentileOverall || 0

    // Calculate improvement since first assessment
    const firstAssessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      include: { scoreOverall: true },
      orderBy: { createdAt: 'asc' }
    })

    const improvementPoints = firstAssessment?.scoreOverall?.percentileOverall 
      ? Math.round(currentScore - firstAssessment.scoreOverall.percentileOverall)
      : 0

    // Get recent activity for activity feed
    const recentJournalEntries = await prisma.journalEntry.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 3
    })

    const recentCompletedTasks = await prisma.dailyTask.findMany({
      where: {
        userId: user.id,
        completed: true,
        completedAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      },
      orderBy: { completedAt: 'desc' },
      take: 5
    })

    return NextResponse.json({
      streak: {
        days: progressStats?.currentStreak || 0,
        message: getStreakMessage(progressStats?.currentStreak || 0)
      },
      completionRate: {
        percentage: Math.round(progressStats?.monthlyCompletionRate || 0),
        completed: progressStats?.totalTasksCompleted || 0,
        total: progressStats?.totalTasksAssigned || 0
      },
      currentScore: {
        percentile: Math.round(currentScore),
        improvement: improvementPoints
      },
      recentActivity: {
        journalEntries: recentJournalEntries.length,
        completedTasks: recentCompletedTasks.length,
        lastEntry: recentJournalEntries[0]?.date || null,
        lastTaskCompleted: recentCompletedTasks[0]?.completedAt || null,
        longestStreak: progressStats?.longestStreak || 0,
        weeklyCompletionRate: Math.round(progressStats?.weeklyCompletionRate || 0),
        lastActiveDate: progressStats?.lastActiveDate?.toISOString() || null
      },
      lastUpdated: progressStats?.lastCalculated?.toISOString() || new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching user progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user progress' },
      { status: 500 }
    )
  }
}


function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your streak today!"
  if (streak === 1) return "Great start!"
  if (streak < 7) return "Keep going!"
  if (streak < 14) return "You're on fire!"
  if (streak < 30) return "Amazing streak!"
  return "Legendary streak!"
}
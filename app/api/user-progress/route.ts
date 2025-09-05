import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProgressTracker } from '@/lib/progress-tracker'
import { LoginTracker } from '@/lib/login-tracker'

export async function GET(request: Request) {
  console.log('🚀 USER-PROGRESS API: Called at', new Date().toISOString())
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

    // Get assessmentId from query params
    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get('assessmentId')

    if (assessmentId) {
      // Assessment-specific progress
      const assessmentProgressStats = await prisma.assessmentProgressStats.findUnique({
        where: { assessmentId: assessmentId }
      })

      // Get this specific assessment for current score
      const assessment = await prisma.assessment.findUnique({
        where: { 
          id: assessmentId,
          userId: user.id 
        },
        include: { scoreOverall: true }
      })

      if (!assessment) {
        return NextResponse.json(
          { error: 'Assessment not found' },
          { status: 404 }
        )
      }

      const currentScore = assessment.scoreOverall?.percentileOverall || 0

      // Get login-based streak information (this is still global)
      const loginStreak = await LoginTracker.getDayStreak(user.id)

      // Get improvement for THIS assessment
      const initialScore = assessmentProgressStats?.initialScore || currentScore
      const improvementPoints = Math.round(currentScore - initialScore)

      // Calculate real-time completion rate based on actual tasks
      const [allDailyTasks, allWeeklyTasks] = await Promise.all([
        prisma.dailyTask.findMany({
          where: { 
            userId: user.id,
            assessmentId: assessmentId
          }
        }),
        prisma.weeklyTask.findMany({
          where: { 
            userId: user.id,
            assessmentId: assessmentId
          }
        })
      ])

      // Debug logging to show all tasks being counted
      console.log(`📊 USER-PROGRESS API: Counting tasks for assessment ${assessmentId}`)
      console.log(`📋 DAILY TASKS (${allDailyTasks.length}):`)
      allDailyTasks.forEach((task, index) => {
        console.log(`  ${index + 1}. "${task.title}" (ID: ${task.id}, date: ${task.date.toISOString().split('T')[0]}, completed: ${task.completed})`)
      })
      console.log(`📋 WEEKLY TASKS (${allWeeklyTasks.length}):`)
      allWeeklyTasks.forEach((task, index) => {
        console.log(`  ${index + 1}. "${task.title}" (ID: ${task.id}, week: ${task.week}, category: ${task.category}, completed: ${task.completed})`)
      })

      const totalTasks = allDailyTasks.length + allWeeklyTasks.length
      const completedTasks = allDailyTasks.filter(task => task.completed).length + 
                           allWeeklyTasks.filter(task => task.completed).length
      const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      // Get recent activity FOR THIS ASSESSMENT
      const recentJournalEntries = await prisma.journalEntry.findMany({
        where: { 
          userId: user.id,
          assessmentId: assessmentId
        },
        orderBy: { date: 'desc' },
        take: 3
      })

      const recentCompletedTasks = await prisma.dailyTask.findMany({
        where: {
          userId: user.id,
          assessmentId: assessmentId,
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
          days: assessmentProgressStats?.currentStreak || 0,
          message: getStreakMessage(assessmentProgressStats?.currentStreak || 0)
        },
        completionRate: {
          percentage: completionPercentage,
          completed: completedTasks,
          total: totalTasks
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
          longestStreak: assessmentProgressStats?.longestStreak || 0,
          weeklyCompletionRate: Math.round(assessmentProgressStats?.weeklyCompletionRate || 0),
          lastActiveDate: assessmentProgressStats?.lastActiveDate?.toISOString() || null
        },
        lastUpdated: assessmentProgressStats?.lastCalculated?.toISOString() || new Date().toISOString()
      })
    } else {
      // Global progress (original logic)
      const progressStats = await ProgressTracker.getUserProgress(user.id)
      
      // Get login-based streak information
      const loginStreak = await LoginTracker.getDayStreak(user.id)

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
          days: loginStreak?.consecutiveLoginDays || 0,
          message: getStreakMessage(loginStreak?.consecutiveLoginDays || 0)
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
          longestStreak: loginStreak?.longestStreak || 0,
          weeklyCompletionRate: Math.round(progressStats?.weeklyCompletionRate || 0),
          lastActiveDate: progressStats?.lastActiveDate?.toISOString() || null
        },
        lastUpdated: progressStats?.lastCalculated?.toISOString() || new Date().toISOString()
      })
    }
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
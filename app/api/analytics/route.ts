import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // week, month, year
    const category = searchParams.get('category')

    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Get task completion analytics
    const taskAnalytics = await getTaskAnalytics(user.id, startDate, category)
    
    // Get journal analytics
    const journalAnalytics = await getJournalAnalytics(user.id, startDate)
    
    // Get goal progress analytics
    const goalAnalytics = await getGoalAnalytics(user.id)
    
    // Get streak analytics
    const streakAnalytics = await getStreakAnalytics(user.id, startDate)
    
    // Get category performance trends
    const categoryTrends = await getCategoryTrends(user.id, startDate)
    
    // Get coaching engagement
    const coachingAnalytics = await getCoachingAnalytics(user.id, startDate)

    return NextResponse.json({
      period,
      analytics: {
        tasks: taskAnalytics,
        journal: journalAnalytics,
        goals: goalAnalytics,
        streaks: streakAnalytics,
        categories: categoryTrends,
        coaching: coachingAnalytics
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

async function getTaskAnalytics(userId: string, startDate: Date, category?: string | null) {
  const whereClause = {
    userId,
    date: { gte: startDate },
    ...(category && { category })
  }

  const [totalTasks, completedTasks, tasksByCategory, tasksByDay] = await Promise.all([
    prisma.dailyTask.count({ where: whereClause }),
    prisma.dailyTask.count({ where: { ...whereClause, completed: true } }),
    prisma.dailyTask.groupBy({
      by: ['category'],
      where: whereClause,
      _count: {
        id: true
      },
      _sum: {
        completed: true
      }
    }),
    prisma.dailyTask.groupBy({
      by: ['date'],
      where: whereClause,
      _count: {
        id: true
      },
      _sum: {
        completed: true
      },
      orderBy: {
        date: 'asc'
      }
    })
  ])

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return {
    totalTasks,
    completedTasks,
    completionRate: Math.round(completionRate * 100) / 100,
    byCategory: tasksByCategory.map(category => ({
      category: category.category,
      total: category._count.id,
      completed: category._sum.completed || 0,
      completionRate: category._count.id > 0 
        ? Math.round(((category._sum.completed || 0) / category._count.id) * 10000) / 100
        : 0
    })),
    dailyTrend: tasksByDay.map(day => ({
      date: day.date,
      total: day._count.id,
      completed: day._sum.completed || 0,
      completionRate: day._count.id > 0 
        ? Math.round(((day._sum.completed || 0) / day._count.id) * 10000) / 100
        : 0
    }))
  }
}

async function getJournalAnalytics(userId: string, startDate: Date) {
  const [totalEntries, entriesByDay, moodDistribution] = await Promise.all([
    prisma.journalEntry.count({
      where: {
        userId,
        date: { gte: startDate }
      }
    }),
    prisma.journalEntry.groupBy({
      by: ['date'],
      where: {
        userId,
        date: { gte: startDate }
      },
      _count: {
        id: true
      },
      orderBy: {
        date: 'asc'
      }
    }),
    prisma.journalEntry.groupBy({
      by: ['mood'],
      where: {
        userId,
        date: { gte: startDate },
        mood: { not: null }
      },
      _count: {
        id: true
      }
    })
  ])

  const daysWithEntries = entriesByDay.length
  const totalPossibleDays = Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const journalConsistency = totalPossibleDays > 0 ? (daysWithEntries / totalPossibleDays) * 100 : 0

  return {
    totalEntries,
    daysWithEntries,
    consistency: Math.round(journalConsistency * 100) / 100,
    dailyTrend: entriesByDay,
    moodDistribution: moodDistribution.map(mood => ({
      mood: mood.mood,
      count: mood._count.id
    }))
  }
}

async function getGoalAnalytics(userId: string) {
  const [totalGoals, completedGoals, goalsByCategory, goalsByStatus] = await Promise.all([
    prisma.goal.count({ where: { userId } }),
    prisma.goal.count({ where: { userId, status: 'completed' } }),
    prisma.goal.groupBy({
      by: ['category'],
      where: { userId },
      _count: { id: true },
      _avg: { progress: true }
    }),
    prisma.goal.groupBy({
      by: ['status'],
      where: { userId },
      _count: { id: true }
    })
  ])

  const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0

  return {
    totalGoals,
    completedGoals,
    completionRate: Math.round(completionRate * 100) / 100,
    byCategory: goalsByCategory.map(category => ({
      category: category.category,
      count: category._count.id,
      avgProgress: Math.round((category._avg.progress || 0) * 100) / 100
    })),
    byStatus: goalsByStatus.map(status => ({
      status: status.status,
      count: status._count.id
    }))
  }
}

async function getStreakAnalytics(userId: string, startDate: Date) {
  const progressStats = await prisma.userProgressStats.findUnique({
    where: { userId }
  })

  const dailySnapshots = await prisma.dailyProgressSnapshot.findMany({
    where: {
      userId,
      date: { gte: startDate }
    },
    orderBy: { date: 'asc' }
  })

  return {
    currentStreak: progressStats?.currentStreak || 0,
    longestStreak: progressStats?.longestStreak || 0,
    streakHistory: dailySnapshots.map(snapshot => ({
      date: snapshot.date,
      streakDay: snapshot.streakDay,
      hasActivity: snapshot.hasActivity
    }))
  }
}

async function getCategoryTrends(userId: string, startDate: Date) {
  // Get task completion by category over time
  const categoryData = await prisma.dailyTask.groupBy({
    by: ['category', 'date'],
    where: {
      userId,
      date: { gte: startDate }
    },
    _count: {
      id: true
    },
    _sum: {
      completed: true
    },
    orderBy: [
      { category: 'asc' },
      { date: 'asc' }
    ]
  })

  const trends: { [key: string]: any[] } = {}
  
  categoryData.forEach(data => {
    if (!trends[data.category]) {
      trends[data.category] = []
    }
    
    trends[data.category].push({
      date: data.date,
      total: data._count.id,
      completed: data._sum.completed || 0,
      completionRate: data._count.id > 0 
        ? Math.round(((data._sum.completed || 0) / data._count.id) * 10000) / 100
        : 0
    })
  })

  return Object.entries(trends).map(([category, data]) => ({
    category,
    trend: data
  }))
}

async function getCoachingAnalytics(userId: string, startDate: Date) {
  const [totalMessages, messagesByDay, coachingStyles] = await Promise.all([
    prisma.chatMessage.count({
      where: {
        userId,
        createdAt: { gte: startDate }
      }
    }),
    prisma.chatMessage.groupBy({
      by: ['createdAt'],
      where: {
        userId,
        createdAt: { gte: startDate }
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    }),
    prisma.chatMessage.groupBy({
      by: ['coaching_style'],
      where: {
        userId,
        createdAt: { gte: startDate },
        coaching_style: { not: null }
      },
      _count: {
        id: true
      }
    })
  ])

  const userMessages = await prisma.chatMessage.count({
    where: {
      userId,
      role: 'user',
      createdAt: { gte: startDate }
    }
  })

  return {
    totalMessages,
    userMessages,
    engagement: totalMessages > 0 ? Math.round((userMessages / totalMessages) * 10000) / 100 : 0,
    messagesByDay,
    stylesUsed: coachingStyles.map(style => ({
      style: style.coaching_style,
      count: style._count.id
    }))
  }
}
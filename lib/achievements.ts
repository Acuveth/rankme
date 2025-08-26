import { prisma } from '@/lib/prisma'

export interface AchievementDefinition {
  type: string
  title: string
  description: string
  icon: string
  category?: string
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
  check: (data: any) => boolean
}

// Define all possible achievements
export const achievementDefinitions: AchievementDefinition[] = [
  // Streak Achievements
  {
    type: 'streak',
    title: 'Getting Started',
    description: 'Complete tasks for 3 days in a row',
    icon: 'fire',
    level: 'bronze',
    check: (data) => data.currentStreak >= 3
  },
  {
    type: 'streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'fire',
    level: 'silver',
    check: (data) => data.currentStreak >= 7
  },
  {
    type: 'streak',
    title: 'Consistency Champion',
    description: 'Achieve a 30-day streak',
    icon: 'fire',
    level: 'gold',
    check: (data) => data.currentStreak >= 30
  },
  
  // Task Completion Achievements
  {
    type: 'completion',
    title: 'First Step',
    description: 'Complete your first task',
    icon: 'check-circle',
    level: 'bronze',
    check: (data) => data.totalTasksCompleted >= 1
  },
  {
    type: 'completion',
    title: 'Task Master',
    description: 'Complete 25 tasks',
    icon: 'trophy',
    level: 'silver',
    check: (data) => data.totalTasksCompleted >= 25
  },
  {
    type: 'completion',
    title: 'Productivity Pro',
    description: 'Complete 100 tasks',
    icon: 'trophy',
    level: 'gold',
    check: (data) => data.totalTasksCompleted >= 100
  },
  
  // Category-specific achievements
  {
    type: 'milestone',
    title: 'Financial Focus',
    description: 'Complete 10 financial tasks',
    icon: 'dollar-sign',
    category: 'financial',
    level: 'bronze',
    check: (data) => data.financialTasksCompleted >= 10
  },
  {
    type: 'milestone',
    title: 'Health Hero',
    description: 'Complete 10 health & wellness tasks',
    icon: 'heart',
    category: 'health',
    level: 'bronze',
    check: (data) => data.healthTasksCompleted >= 10
  },
  {
    type: 'milestone',
    title: 'Social Butterfly',
    description: 'Complete 10 social connection tasks',
    icon: 'users',
    category: 'social',
    level: 'bronze',
    check: (data) => data.socialTasksCompleted >= 10
  },
  
  // Weekly achievements
  {
    type: 'completion',
    title: 'Perfect Week',
    description: 'Complete all tasks in a week',
    icon: 'star',
    level: 'gold',
    check: (data) => data.weeklyCompletionRate === 100
  },
  {
    type: 'completion',
    title: 'Strong Finisher',
    description: 'Complete 80% of weekly tasks',
    icon: 'trending-up',
    level: 'silver',
    check: (data) => data.weeklyCompletionRate >= 80
  },
  
  // Journal achievements
  {
    type: 'first_time',
    title: 'Reflective Mind',
    description: 'Write your first journal entry',
    icon: 'book',
    level: 'bronze',
    check: (data) => data.journalEntries >= 1
  },
  {
    type: 'milestone',
    title: 'Journaling Habit',
    description: 'Write 10 journal entries',
    icon: 'book',
    level: 'silver',
    check: (data) => data.journalEntries >= 10
  },
  
  // Improvement achievements
  {
    type: 'improvement',
    title: 'Rising Star',
    description: 'Improve your score by 10 points',
    icon: 'trending-up',
    level: 'bronze',
    check: (data) => data.scoreImprovement >= 10
  },
  {
    type: 'improvement',
    title: 'Breakthrough',
    description: 'Improve your score by 25 points',
    icon: 'zap',
    level: 'silver',
    check: (data) => data.scoreImprovement >= 25
  }
]

// Check and award achievements for a user
export async function checkAndAwardAchievements(userId: string) {
  try {
    // Fetch user's progress stats
    const progressStats = await prisma.userProgressStats.findUnique({
      where: { userId }
    })

    if (!progressStats) {
      return []
    }

    // Get task completion counts by category
    const categoryStats = await prisma.dailyTask.groupBy({
      by: ['category'],
      where: {
        userId,
        completed: true
      },
      _count: true
    })

    const categoryCompletions = {
      financialTasksCompleted: 0,
      healthTasksCompleted: 0,
      socialTasksCompleted: 0,
      personalTasksCompleted: 0
    }

    categoryStats.forEach(stat => {
      switch(stat.category) {
        case 'financial':
          categoryCompletions.financialTasksCompleted = stat._count
          break
        case 'health':
          categoryCompletions.healthTasksCompleted = stat._count
          break
        case 'social':
          categoryCompletions.socialTasksCompleted = stat._count
          break
        case 'personal':
          categoryCompletions.personalTasksCompleted = stat._count
          break
      }
    })

    // Count journal entries
    const journalCount = await prisma.journalEntry.count({
      where: { userId }
    })

    // Prepare data for achievement checks
    const checkData = {
      ...progressStats,
      ...categoryCompletions,
      journalEntries: journalCount,
      scoreImprovement: 0 // This would need to be calculated based on assessment scores
    }

    // Check each achievement
    const newAchievements = []
    
    for (const definition of achievementDefinitions) {
      if (definition.check(checkData)) {
        // Check if achievement already exists
        const existing = await prisma.achievement.findFirst({
          where: {
            userId,
            type: definition.type,
            title: definition.title
          }
        })

        if (!existing) {
          // Award the achievement
          const achievement = await prisma.achievement.create({
            data: {
              userId,
              type: definition.type,
              title: definition.title,
              description: definition.description,
              icon: definition.icon,
              category: definition.category || null,
              level: definition.level
            }
          })
          newAchievements.push(achievement)
        }
      }
    }

    return newAchievements
  } catch (error) {
    console.error('Error checking achievements:', error)
    return []
  }
}

// Check for achievements after task completion
export async function checkAchievementsAfterTaskCompletion(userId: string, taskCategory?: string) {
  // Update user progress stats first
  const stats = await updateUserProgressStats(userId)
  
  // Then check for new achievements
  const newAchievements = await checkAndAwardAchievements(userId)
  
  return {
    stats,
    newAchievements
  }
}

// Update user progress statistics
async function updateUserProgressStats(userId: string) {
  try {
    // Calculate current stats
    const totalTasks = await prisma.dailyTask.count({
      where: { userId }
    })

    const completedTasks = await prisma.dailyTask.count({
      where: {
        userId,
        completed: true
      }
    })

    // Calculate streak
    const recentTasks = await prisma.dailyTask.findMany({
      where: {
        userId,
        completed: true
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: 100
    })

    // Calculate current streak (simplified logic)
    let currentStreak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      
      const hasTaskOnDay = recentTasks.some(task => {
        if (!task.completedAt) return false
        const taskDate = new Date(task.completedAt)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate.getTime() === checkDate.getTime()
      })

      if (hasTaskOnDay) {
        currentStreak++
      } else if (i > 0) {
        break // Streak is broken
      }
    }

    // Update or create progress stats
    const stats = await prisma.userProgressStats.upsert({
      where: { userId },
      update: {
        currentStreak,
        totalTasksCompleted: completedTasks,
        totalTasksAssigned: totalTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        lastActiveDate: new Date()
      },
      create: {
        userId,
        currentStreak,
        totalTasksCompleted: completedTasks,
        totalTasksAssigned: totalTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        lastActiveDate: new Date()
      }
    })

    return stats
  } catch (error) {
    console.error('Error updating progress stats:', error)
    return null
  }
}
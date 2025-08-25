import { PrismaClient } from '@prisma/client'

export class ProgressTracker {
  private static getPrisma() {
    const globalForPrisma = globalThis as unknown as {
      prisma: PrismaClient | undefined
    }
    return globalForPrisma.prisma ?? new PrismaClient()
  }
  
  /**
   * Updates user progress when they complete a task or make a journal entry
   */
  static async updateUserProgress(userId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    // Get today's tasks and journal entries
    const prisma = this.getPrisma()
    const [dailyTasks, weeklyTasks, journalEntries] = await Promise.all([
      prisma.dailyTask.findMany({
        where: {
          userId,
          date: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      prisma.weeklyTask.findMany({
        where: {
          userId,
          completedAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      prisma.journalEntry.findMany({
        where: {
          userId,
          date: {
            gte: today,
            lt: tomorrow
          }
        }
      })
    ])

    const tasksCompleted = dailyTasks.filter(t => t.completed).length + weeklyTasks.filter(t => t.completed).length
    const tasksTotal = dailyTasks.length + weeklyTasks.length
    const completionRate = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0
    const hasActivity = tasksCompleted > 0 || journalEntries.length > 0

    // Update or create daily snapshot
    await prisma.dailyProgressSnapshot.upsert({
      where: {
        userId_date: {
          userId,
          date: today
        }
      },
      update: {
        tasksCompleted,
        tasksTotal,
        journalEntries: journalEntries.length,
        completionRate,
        hasActivity
      },
      create: {
        userId,
        date: today,
        tasksCompleted,
        tasksTotal,
        journalEntries: journalEntries.length,
        completionRate,
        hasActivity
      }
    })

    // Calculate streak
    await this.calculateStreak(userId)
    
    // Update overall progress stats
    await this.updateOverallStats(userId)
  }

  /**
   * Calculates current streak for a user
   */
  static async calculateStreak(userId: string) {
    const prisma = this.getPrisma()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let currentStreak = 0
    let checkDate = new Date(today)
    
    // Check backwards from today to find streak
    for (let i = 0; i < 365; i++) { // Max 365 days check
      const dayStart = new Date(checkDate)
      dayStart.setHours(0, 0, 0, 0)
      
      const dayEnd = new Date(checkDate)
      dayEnd.setHours(23, 59, 59, 999)

      const snapshot = await prisma.dailyProgressSnapshot.findUnique({
        where: {
          userId_date: {
            userId,
            date: dayStart
          }
        }
      })

      if (snapshot && snapshot.hasActivity) {
        currentStreak++
        snapshot.streakDay = currentStreak
        await prisma.dailyProgressSnapshot.update({
          where: { id: snapshot.id },
          data: { streakDay: currentStreak }
        })
      } else {
        // Streak broken
        break
      }

      checkDate.setDate(checkDate.getDate() - 1)
    }

    // Update user progress stats
    const existingStats = await prisma.userProgressStats.findUnique({
      where: { userId }
    })

    const longestStreak = Math.max(currentStreak, existingStats?.longestStreak || 0)

    await prisma.userProgressStats.upsert({
      where: { userId },
      update: {
        currentStreak,
        longestStreak,
        lastActiveDate: new Date(),
        lastCalculated: new Date()
      },
      create: {
        userId,
        currentStreak,
        longestStreak,
        lastActiveDate: new Date(),
        lastCalculated: new Date()
      }
    })

    return currentStreak
  }

  /**
   * Updates overall completion rate statistics
   */
  static async updateOverallStats(userId: string) {
    const prisma = this.getPrisma()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Get all-time stats
    const [allDailyTasks, allWeeklyTasks] = await Promise.all([
      prisma.dailyTask.findMany({ where: { userId } }),
      prisma.weeklyTask.findMany({ where: { userId } })
    ])

    // Get recent stats
    const [recentDailyTasks, recentWeeklyTasks] = await Promise.all([
      prisma.dailyTask.findMany({ 
        where: { 
          userId, 
          date: { gte: thirtyDaysAgo }
        } 
      }),
      prisma.weeklyTask.findMany({ 
        where: { 
          userId,
          createdAt: { gte: thirtyDaysAgo }
        } 
      })
    ])

    // Get weekly stats  
    const [weeklyDailyTasks, weeklyWeeklyTasks] = await Promise.all([
      prisma.dailyTask.findMany({ 
        where: { 
          userId, 
          date: { gte: sevenDaysAgo }
        } 
      }),
      prisma.weeklyTask.findMany({ 
        where: { 
          userId,
          createdAt: { gte: sevenDaysAgo }
        } 
      })
    ])

    // Calculate completion rates
    const totalCompleted = allDailyTasks.filter(t => t.completed).length + allWeeklyTasks.filter(t => t.completed).length
    const totalAssigned = allDailyTasks.length + allWeeklyTasks.length
    const overallRate = totalAssigned > 0 ? (totalCompleted / totalAssigned) * 100 : 0

    const monthlyCompleted = recentDailyTasks.filter(t => t.completed).length + recentWeeklyTasks.filter(t => t.completed).length
    const monthlyAssigned = recentDailyTasks.length + recentWeeklyTasks.length
    const monthlyRate = monthlyAssigned > 0 ? (monthlyCompleted / monthlyAssigned) * 100 : 0

    const weeklyCompleted = weeklyDailyTasks.filter(t => t.completed).length + weeklyWeeklyTasks.filter(t => t.completed).length
    const weeklyAssigned = weeklyDailyTasks.length + weeklyWeeklyTasks.length
    const weeklyRate = weeklyAssigned > 0 ? (weeklyCompleted / weeklyAssigned) * 100 : 0

    await prisma.userProgressStats.upsert({
      where: { userId },
      update: {
        totalTasksCompleted: totalCompleted,
        totalTasksAssigned: totalAssigned,
        completionRate: overallRate,
        weeklyCompletionRate: weeklyRate,
        monthlyCompletionRate: monthlyRate,
        lastCalculated: new Date()
      },
      create: {
        userId,
        totalTasksCompleted: totalCompleted,
        totalTasksAssigned: totalAssigned,
        completionRate: overallRate,
        weeklyCompletionRate: weeklyRate,
        monthlyCompletionRate: monthlyRate,
        lastCalculated: new Date()
      }
    })
  }

  /**
   * Gets user progress statistics
   */
  static async getUserProgress(userId: string) {
    const prisma = this.getPrisma()
    let stats = await prisma.userProgressStats.findUnique({
      where: { userId }
    })

    // If no stats exist, create initial stats
    if (!stats) {
      await this.updateUserProgress(userId)
      stats = await prisma.userProgressStats.findUnique({
        where: { userId }
      })
    }

    // Check if stats need updating (older than 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    if (!stats || stats.lastCalculated < oneHourAgo) {
      await this.updateUserProgress(userId)
      stats = await prisma.userProgressStats.findUnique({
        where: { userId }
      })
    }

    return stats
  }

  /**
   * Creates weekly progress snapshot
   */
  static async createWeeklySnapshot(userId: string, weekStart: Date) {
    const prisma = this.getPrisma()
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)
    
    const year = weekStart.getFullYear()
    const weekNumber = this.getWeekNumber(weekStart)

    // Get all daily snapshots for this week
    const dailySnapshots = await prisma.dailyProgressSnapshot.findMany({
      where: {
        userId,
        date: {
          gte: weekStart,
          lt: weekEnd
        }
      }
    })

    // Get weekly tasks created/completed this week
    const weeklyTasks = await prisma.weeklyTask.findMany({
      where: {
        userId,
        OR: [
          { createdAt: { gte: weekStart, lt: weekEnd } },
          { completedAt: { gte: weekStart, lt: weekEnd } }
        ]
      }
    })

    const dailyTasksCompleted = dailySnapshots.reduce((sum, snap) => sum + snap.tasksCompleted, 0)
    const dailyTasksTotal = dailySnapshots.reduce((sum, snap) => sum + snap.tasksTotal, 0)
    const weeklyTasksCompleted = weeklyTasks.filter(t => t.completed).length
    const weeklyTasksTotal = weeklyTasks.length
    const journalEntries = dailySnapshots.reduce((sum, snap) => sum + snap.journalEntries, 0)
    const daysActive = dailySnapshots.filter(snap => snap.hasActivity).length

    const totalCompleted = dailyTasksCompleted + weeklyTasksCompleted
    const totalTasks = dailyTasksTotal + weeklyTasksTotal
    const completionRate = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0

    await prisma.weeklyProgressSnapshot.upsert({
      where: {
        userId_year_weekNumber: {
          userId,
          year,
          weekNumber
        }
      },
      update: {
        dailyTasksCompleted,
        dailyTasksTotal,
        weeklyTasksCompleted,
        weeklyTasksTotal,
        journalEntries,
        completionRate,
        daysActive
      },
      create: {
        userId,
        weekStart,
        weekEnd,
        weekNumber,
        year,
        dailyTasksCompleted,
        dailyTasksTotal,
        weeklyTasksCompleted,
        weeklyTasksTotal,
        journalEntries,
        completionRate,
        daysActive
      }
    })
  }

  /**
   * Gets week number for a date
   */
  static getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  }
}
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

class ProgressTracker {
  static getPrisma() {
    const globalForPrisma = globalThis
    return globalForPrisma.prisma ?? new PrismaClient()
  }
  
  static async updateUserProgress(userId) {
    const prisma = this.getPrisma()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    console.log('Fetching today\'s data...')
    
    // Get today's tasks and journal entries
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

    console.log('Today:', {
      tasksCompleted,
      tasksTotal,
      completionRate,
      hasActivity,
      journalEntries: journalEntries.length
    })

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

  static async calculateStreak(userId) {
    const prisma = this.getPrisma()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let currentStreak = 0
    let checkDate = new Date(today)
    
    console.log('Calculating streak...')
    
    // Check backwards from today to find streak
    for (let i = 0; i < 365; i++) { // Max 365 days check
      const dayStart = new Date(checkDate)
      dayStart.setHours(0, 0, 0, 0)
      
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
        await prisma.dailyProgressSnapshot.update({
          where: { id: snapshot.id },
          data: { streakDay: currentStreak }
        })
      } else {
        break
      }

      checkDate.setDate(checkDate.getDate() - 1)
    }

    console.log('Calculated streak:', currentStreak)

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

  static async updateOverallStats(userId) {
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

    console.log('Overall stats:', {
      allDailyTasks: allDailyTasks.length,
      allWeeklyTasks: allWeeklyTasks.length,
      dailyCompleted: allDailyTasks.filter(t => t.completed).length,
      weeklyCompleted: allWeeklyTasks.filter(t => t.completed).length
    })

    // Get recent stats for monthly calculation
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

    console.log('Completion rates:', {
      overall: `${totalCompleted}/${totalAssigned} = ${overallRate}%`,
      monthly: `${monthlyCompleted}/${monthlyAssigned} = ${monthlyRate}%`,
      weekly: `${weeklyCompleted}/${weeklyAssigned} = ${weeklyRate}%`
    })

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
}

async function runCalculation() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'lukagaberscek3@gmail.com' }
    })
    
    if (!user) {
      console.log('User not found')
      return
    }

    console.log('Running progress calculation for user:', user.email)
    await ProgressTracker.updateUserProgress(user.id)
    
    console.log('\n=== FINAL RESULTS ===')
    const stats = await prisma.userProgressStats.findUnique({
      where: { userId: user.id }
    })
    console.log('Final stats:', stats)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

runCalculation()
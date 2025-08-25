const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

class DebugProgressTracker {
  
  static async updateUserProgress(userId) {
    console.log('=== STARTING PROGRESS UPDATE ===')
    console.log('User ID:', userId)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    console.log('Today:', today.toDateString())
    console.log('Tomorrow:', tomorrow.toDateString())

    // Get today's tasks and journal entries
    console.log('\n=== FETCHING TODAY\'S DATA ===')
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

    console.log('Daily tasks for today:', dailyTasks.length)
    console.log('Weekly tasks completed today:', weeklyTasks.length)
    console.log('Journal entries for today:', journalEntries.length)

    const tasksCompleted = dailyTasks.filter(t => t.completed).length + weeklyTasks.filter(t => t.completed).length
    const tasksTotal = dailyTasks.length + weeklyTasks.length
    const completionRate = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0
    const hasActivity = tasksCompleted > 0 || journalEntries.length > 0

    console.log('\n=== TODAY\'S CALCULATIONS ===')
    console.log('Tasks completed today:', tasksCompleted)
    console.log('Tasks total today:', tasksTotal)
    console.log('Completion rate today:', completionRate, '%')
    console.log('Has activity today:', hasActivity)

    // Update or create daily snapshot
    console.log('\n=== UPDATING DAILY SNAPSHOT ===')
    const snapshot = await prisma.dailyProgressSnapshot.upsert({
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
    
    console.log('Daily snapshot created/updated:', snapshot.id)

    // Calculate streak
    const streak = await this.calculateStreak(userId)
    console.log('Calculated streak:', streak)
    
    // Update overall progress stats
    await this.updateOverallStats(userId)
    console.log('Overall stats updated')
  }

  static async calculateStreak(userId) {
    console.log('\n=== CALCULATING STREAK ===')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let currentStreak = 0
    let checkDate = new Date(today)
    
    console.log('Starting streak calculation from:', checkDate.toDateString())
    
    // Check backwards from today to find streak
    for (let i = 0; i < 365; i++) { // Max 365 days check
      const dayStart = new Date(checkDate)
      dayStart.setHours(0, 0, 0, 0)
      
      console.log(`Checking day ${i + 1}: ${dayStart.toDateString()}`)

      const snapshot = await prisma.dailyProgressSnapshot.findUnique({
        where: {
          userId_date: {
            userId,
            date: dayStart
          }
        }
      })

      console.log('  Snapshot found:', !!snapshot)
      if (snapshot) {
        console.log('  Has activity:', snapshot.hasActivity)
        console.log('  Tasks:', `${snapshot.tasksCompleted}/${snapshot.tasksTotal}`)
        console.log('  Journal entries:', snapshot.journalEntries)
      }

      if (snapshot && snapshot.hasActivity) {
        currentStreak++
        console.log('  -> Streak continues, now:', currentStreak)
        
        // Update this snapshot with streak day info
        await prisma.dailyProgressSnapshot.update({
          where: { id: snapshot.id },
          data: { streakDay: currentStreak }
        })
      } else {
        console.log('  -> Streak broken at day', i + 1)
        break
      }

      checkDate.setDate(checkDate.getDate() - 1)
    }

    console.log('Final calculated streak:', currentStreak)

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
    console.log('\n=== UPDATING OVERALL STATS ===')
    
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    console.log('30 days ago:', thirtyDaysAgo.toDateString())
    console.log('7 days ago:', sevenDaysAgo.toDateString())

    // Get all-time stats
    const [allDailyTasks, allWeeklyTasks] = await Promise.all([
      prisma.dailyTask.findMany({ where: { userId } }),
      prisma.weeklyTask.findMany({ where: { userId } })
    ])

    console.log('All time daily tasks:', allDailyTasks.length)
    console.log('All time weekly tasks:', allWeeklyTasks.length)

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

    console.log('Recent (30 days) daily tasks:', recentDailyTasks.length)
    console.log('Recent (30 days) weekly tasks:', recentWeeklyTasks.length)

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

    console.log('Weekly (7 days) daily tasks:', weeklyDailyTasks.length)
    console.log('Weekly (7 days) weekly tasks:', weeklyWeeklyTasks.length)

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

    console.log('\n=== COMPLETION RATE CALCULATIONS ===')
    console.log('Overall:', `${totalCompleted}/${totalAssigned} = ${overallRate}%`)
    console.log('Monthly:', `${monthlyCompleted}/${monthlyAssigned} = ${monthlyRate}%`)
    console.log('Weekly:', `${weeklyCompleted}/${weeklyAssigned} = ${weeklyRate}%`)

    const finalStats = await prisma.userProgressStats.upsert({
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
    
    console.log('Final stats saved:', {
      completionRate: finalStats.completionRate,
      weeklyCompletionRate: finalStats.weeklyCompletionRate,
      monthlyCompletionRate: finalStats.monthlyCompletionRate,
      currentStreak: finalStats.currentStreak
    })
  }
}

async function runDebugTracker() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'lukagaberscek3@gmail.com' }
    })
    
    if (!user) {
      console.log('User not found')
      return
    }
    
    await DebugProgressTracker.updateUserProgress(user.id)
    
    console.log('\n=== FINAL RESULTS ===')
    const finalStats = await prisma.userProgressStats.findUnique({
      where: { userId: user.id }
    })
    console.log(finalStats)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

runDebugTracker()
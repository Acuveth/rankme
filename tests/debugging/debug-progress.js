const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function debugUserProgress() {
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: 'lukagaberscek3@gmail.com' }
    })
    
    if (!user) {
      console.log('User not found')
      return
    }
    
    console.log('=== USER INFO ===')
    console.log('User ID:', user.id)
    console.log('Name:', user.name)
    console.log('Email:', user.email)
    console.log('')
    
    // Get user progress stats
    const progressStats = await prisma.userProgressStats.findUnique({
      where: { userId: user.id }
    })
    
    console.log('=== PROGRESS STATS ===')
    if (progressStats) {
      console.log('Current Streak:', progressStats.currentStreak)
      console.log('Longest Streak:', progressStats.longestStreak)
      console.log('Total Tasks Completed:', progressStats.totalTasksCompleted)
      console.log('Total Tasks Assigned:', progressStats.totalTasksAssigned)
      console.log('Overall Completion Rate:', progressStats.completionRate)
      console.log('Weekly Completion Rate:', progressStats.weeklyCompletionRate)
      console.log('Monthly Completion Rate:', progressStats.monthlyCompletionRate)
      console.log('Last Active:', progressStats.lastActiveDate)
      console.log('Last Calculated:', progressStats.lastCalculated)
    } else {
      console.log('No progress stats found')
    }
    console.log('')
    
    // Get daily snapshots
    const dailySnapshots = await prisma.dailyProgressSnapshot.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 10
    })
    
    console.log('=== DAILY SNAPSHOTS (Last 10) ===')
    dailySnapshots.forEach((snap, i) => {
      console.log(`Day ${i + 1}: ${snap.date.toDateString()}`)
      console.log(`  Tasks: ${snap.tasksCompleted}/${snap.tasksTotal} (${snap.completionRate}%)`)
      console.log(`  Journal Entries: ${snap.journalEntries}`)
      console.log(`  Has Activity: ${snap.hasActivity}`)
      console.log(`  Streak Day: ${snap.streakDay}`)
      console.log('')
    })
    
    // Get all daily tasks
    const dailyTasks = await prisma.dailyTask.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' }
    })
    
    console.log('=== DAILY TASKS ===')
    console.log('Total Daily Tasks:', dailyTasks.length)
    console.log('Completed:', dailyTasks.filter(t => t.completed).length)
    console.log('')
    
    // Get all weekly tasks
    const weeklyTasks = await prisma.weeklyTask.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('=== WEEKLY TASKS ===')
    console.log('Total Weekly Tasks:', weeklyTasks.length)
    console.log('Completed:', weeklyTasks.filter(t => t.completed).length)
    console.log('')
    
    // Get journal entries
    const journalEntries = await prisma.journalEntry.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' }
    })
    
    console.log('=== JOURNAL ENTRIES ===')
    console.log('Total Journal Entries:', journalEntries.length)
    console.log('')
    
    // Get assessments for improvement calculation
    const assessments = await prisma.assessment.findMany({
      where: { userId: user.id },
      include: { scoreOverall: true },
      orderBy: { createdAt: 'asc' }
    })
    
    console.log('=== ASSESSMENTS ===')
    console.log('Total Assessments:', assessments.length)
    if (assessments.length > 0) {
      const first = assessments[0]
      const latest = assessments[assessments.length - 1]
      console.log('First Assessment Score:', first.scoreOverall?.percentileOverall || 'N/A')
      console.log('Latest Assessment Score:', latest.scoreOverall?.percentileOverall || 'N/A')
      if (first.scoreOverall && latest.scoreOverall) {
        const improvement = latest.scoreOverall.percentileOverall - first.scoreOverall.percentileOverall
        console.log('Improvement:', Math.round(improvement), 'points')
      }
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugUserProgress()
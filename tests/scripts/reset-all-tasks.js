const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function resetAllTasks() {
  try {
    console.log('=== Resetting All Tasks to Incomplete ===\n')
    
    // Get the user
    const user = await prisma.user.findFirst()
    if (!user) {
      console.log('No user found')
      return
    }
    
    console.log(`User: ${user.name} (${user.email})\n`)
    
    // Check current weekly tasks
    console.log('=== Current Weekly Tasks ===')
    const weeklyTasks = await prisma.weeklyTask.findMany({
      where: { userId: user.id }
    })
    
    const completedWeekly = weeklyTasks.filter(t => t.completed)
    console.log(`Found ${weeklyTasks.length} weekly tasks, ${completedWeekly.length} marked as completed`)
    
    if (completedWeekly.length > 0) {
      console.log('\nCompleted weekly tasks:')
      completedWeekly.forEach(task => {
        console.log(`- ${task.title} (Week ${task.week}, ${task.category})`)
      })
    }
    
    // Check current daily tasks
    console.log('\n=== Current Daily Tasks ===')
    const dailyTasks = await prisma.dailyTask.findMany({
      where: { userId: user.id }
    })
    
    const completedDaily = dailyTasks.filter(t => t.completed)
    console.log(`Found ${dailyTasks.length} daily tasks, ${completedDaily.length} marked as completed`)
    
    if (completedDaily.length > 0) {
      console.log('\nCompleted daily tasks:')
      completedDaily.forEach(task => {
        console.log(`- ${task.title} (${task.date.toISOString().split('T')[0]})`)
      })
    }
    
    // Reset all weekly tasks to incomplete
    console.log('\n=== Resetting Weekly Tasks ===')
    const resetWeekly = await prisma.weeklyTask.updateMany({
      where: {
        userId: user.id,
        completed: true
      },
      data: {
        completed: false,
        completedAt: null
      }
    })
    console.log(`Reset ${resetWeekly.count} weekly tasks to incomplete`)
    
    // Reset all daily tasks to incomplete
    console.log('\n=== Resetting Daily Tasks ===')
    const resetDaily = await prisma.dailyTask.updateMany({
      where: {
        userId: user.id,
        completed: true
      },
      data: {
        completed: false,
        completedAt: null
      }
    })
    console.log(`Reset ${resetDaily.count} daily tasks to incomplete`)
    
    // Reset user progress stats
    console.log('\n=== Resetting User Progress Stats ===')
    const stats = await prisma.userProgressStats.findUnique({
      where: { userId: user.id }
    })
    
    if (stats) {
      await prisma.userProgressStats.update({
        where: { userId: user.id },
        data: {
          currentStreak: 0,
          longestStreak: 0,
          totalTasksCompleted: 0,
          completionRate: 0.0,
          updatedAt: new Date()
        }
      })
      console.log('Reset user progress stats to 0')
    }
    
    // Verify reset
    console.log('\n=== Verification ===')
    const verifyWeekly = await prisma.weeklyTask.count({
      where: { userId: user.id, completed: true }
    })
    const verifyDaily = await prisma.dailyTask.count({
      where: { userId: user.id, completed: true }
    })
    
    console.log(`Completed weekly tasks after reset: ${verifyWeekly}`)
    console.log(`Completed daily tasks after reset: ${verifyDaily}`)
    
    if (verifyWeekly === 0 && verifyDaily === 0) {
      console.log('\n✅ Successfully reset all tasks to incomplete!')
    } else {
      console.log('\n⚠️ Some tasks may still be marked as completed')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetAllTasks()
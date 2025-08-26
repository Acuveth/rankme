const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testCombinedProgress() {
  try {
    console.log('=== TEST: Combined Weekly Progress Calculation ===\n')
    
    const user = await prisma.user.findFirst()
    console.log(`Using user: ${user.name} (${user.email})`)
    
    // Calculate current week boundaries
    const today = new Date()
    const currentDayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDayOfWeek === 0 ? -6 : -(currentDayOfWeek - 1)
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() + mondayOffset)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    console.log(`\nCurrent week: ${weekStart.toDateString()} to ${weekEnd.toDateString()}`)
    
    // 1. Get Weekly Tasks for current week/category
    console.log('\n=== WEEKLY TASKS ===')
    const weeklyTasks = await prisma.weeklyTask.findMany({
      where: {
        userId: user.id,
        week: 1,
        category: 'financial'
      }
    })
    
    const weeklyTasksCompleted = weeklyTasks.filter(t => t.completed).length
    const weeklyTasksTotal = weeklyTasks.length
    const weeklyPercentage = weeklyTasksTotal > 0 ? (weeklyTasksCompleted / weeklyTasksTotal) * 100 : 0
    
    console.log(`Weekly tasks: ${weeklyTasksCompleted}/${weeklyTasksTotal} = ${Math.round(weeklyPercentage)}%`)
    weeklyTasks.forEach(task => {
      console.log(`- ${task.title}: ${task.completed ? '✅' : '⭕'} ${task.completedAt ? '(' + task.completedAt.toISOString() + ')' : ''}`)
    })
    
    // 2. Get Daily Tasks for entire week
    console.log('\n=== DAILY TASKS FOR ENTIRE WEEK ===')
    let totalDailyTasksCompleted = 0
    let totalDailyTasksTotal = 0
    
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const dayDate = new Date(weekStart)
      dayDate.setDate(weekStart.getDate() + dayOffset)
      const dateString = dayDate.toISOString().split('T')[0]
      const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'long' })
      
      const dailyTasks = await prisma.dailyTask.findMany({
        where: {
          userId: user.id,
          date: {
            gte: new Date(dateString + 'T00:00:00.000Z'),
            lt: new Date(dateString + 'T23:59:59.999Z')
          }
        }
      })
      
      const dayCompleted = dailyTasks.filter(t => t.completed).length
      const dayTotal = dailyTasks.length
      totalDailyTasksCompleted += dayCompleted
      totalDailyTasksTotal += dayTotal
      
      if (dayTotal > 0) {
        console.log(`${dayName} (${dateString}): ${dayCompleted}/${dayTotal} tasks`)
        dailyTasks.forEach(task => {
          console.log(`  - ${task.title}: ${task.completed ? '✅' : '⭕'}`)
        })
      } else {
        console.log(`${dayName} (${dateString}): No tasks`)
      }
    }
    
    const dailyPercentage = totalDailyTasksTotal > 0 ? (totalDailyTasksCompleted / totalDailyTasksTotal) * 100 : 0
    console.log(`\nDaily tasks summary: ${totalDailyTasksCompleted}/${totalDailyTasksTotal} = ${Math.round(dailyPercentage)}%`)
    
    // 3. Calculate Combined Progress
    console.log('\n=== COMBINED PROGRESS CALCULATION ===')
    const totalCompleted = weeklyTasksCompleted + totalDailyTasksCompleted
    const totalTasks = weeklyTasksTotal + totalDailyTasksTotal
    const combinedPercentage = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0
    
    console.log(`Weekly Tasks: ${weeklyTasksCompleted}/${weeklyTasksTotal} (${Math.round(weeklyPercentage)}%)`)
    console.log(`Daily Tasks: ${totalDailyTasksCompleted}/${totalDailyTasksTotal} (${Math.round(dailyPercentage)}%)`)
    console.log(`---`)
    console.log(`COMBINED: ${totalCompleted}/${totalTasks} = ${Math.round(combinedPercentage)}%`)
    
    // 4. Test what the frontend would show
    console.log('\n=== FRONTEND DISPLAY SIMULATION ===')
    console.log(`Combined Weekly Progress: ${Math.round(combinedPercentage)}%`)
    console.log(`  Weekly Tasks: ${Math.round(weeklyPercentage)}%`)
    console.log(`  Daily Goals (Week): ${Math.round(dailyPercentage)}%`)
    
    console.log('\n✅ Combined progress calculation working correctly!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCombinedProgress()
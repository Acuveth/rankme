const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testDailyProgressTracking() {
  try {
    console.log('=== TEST: Daily Progress Tracking Across Week ===\n')
    
    const user = await prisma.user.findUnique({
      where: { email: 'lukagaberscekl@gmail.com' }
    })
    
    if (!user) {
      console.log('❌ User not found')
      const allUsers = await prisma.user.findMany({
        select: { id: true, email: true, name: true }
      })
      console.log('Available users:', allUsers)
      return
    }
    
    // Create test daily goals for the past few days
    const today = new Date()
    const testDays = []
    
    // Generate dates for the past 3 days
    for (let i = 2; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      testDays.push(date)
    }
    
    console.log('=== Creating Test Daily Goals ===')
    
    for (const [index, date] of testDays.entries()) {
      const dateString = date.toISOString().split('T')[0]
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
      
      console.log(`\nDay ${index + 1}: ${dayName} (${dateString})`)
      
      // Create 2 daily goals for each day
      const goals = [
        {
          title: `Daily goal 1 for ${dayName}`,
          description: 'Test daily goal',
          category: 'financial',
          completed: Math.random() > 0.5, // Random completion
        },
        {
          title: `Daily goal 2 for ${dayName}`,
          description: 'Test daily goal',
          category: 'health',
          completed: Math.random() > 0.3, // Higher chance of completion
        }
      ]
      
      for (const goal of goals) {
        const task = await prisma.dailyTask.upsert({
          where: {
            userId_title_date: {
              userId: user.id,
              title: goal.title,
              date: date
            }
          },
          update: {
            completed: goal.completed,
            completedAt: goal.completed ? new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000) : null
          },
          create: {
            userId: user.id,
            title: goal.title,
            description: goal.description,
            category: goal.category,
            date: date,
            completed: goal.completed,
            completedAt: goal.completed ? new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000) : null
          }
        })
        
        console.log(`  ✅ ${goal.title}: ${task.completed ? 'Completed' : 'Incomplete'}`)
        if (task.completedAt) {
          console.log(`     Completed at: ${task.completedAt.toISOString()}`)
        }
      }
    }
    
    // Test the API endpoint for each day
    console.log('\n=== Testing API Endpoints ===')
    
    for (const [index, date] of testDays.entries()) {
      const dateString = date.toISOString().split('T')[0]
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
      
      console.log(`\nTesting ${dayName} (${dateString}):`)
      
      // This would be called by the frontend
      const tasks = await prisma.dailyTask.findMany({
        where: {
          userId: user.id,
          date: {
            gte: new Date(dateString + 'T00:00:00.000Z'),
            lt: new Date(dateString + 'T23:59:59.999Z')
          }
        }
      })
      
      const completed = tasks.filter(t => t.completed).length
      const total = tasks.length
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
      
      console.log(`  Tasks: ${completed}/${total} = ${percentage}%`)
      console.log(`  API would return: { tasks: [${tasks.length} items], completion: ${percentage}% }`)
    }
    
    // Test what the weekly progress calculation would show
    console.log('\n=== Weekly Progress Simulation ===')
    
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const weekStart = new Date(today)
    const currentDayOfWeek = today.getDay()
    const mondayOffset = currentDayOfWeek === 0 ? -6 : -(currentDayOfWeek - 1)
    weekStart.setDate(today.getDate() + mondayOffset)
    
    console.log('Week starting:', weekStart.toDateString())
    console.log('Current day:', today.toLocaleDateString('en-US', { weekday: 'long' }))
    
    for (const [index, day] of daysOfWeek.entries()) {
      const dayDate = new Date(weekStart)
      dayDate.setDate(weekStart.getDate() + index)
      const dateString = dayDate.toISOString().split('T')[0]
      
      const currentDayIndex = (today.getDay() + 6) % 7 // Monday-based
      
      let progressPercentage = 0
      let status = ''
      
      if (index < currentDayIndex) {
        // Past day - load from database
        const tasks = await prisma.dailyTask.findMany({
          where: {
            userId: user.id,
            date: {
              gte: new Date(dateString + 'T00:00:00.000Z'),
              lt: new Date(dateString + 'T23:59:59.999Z')
            }
          }
        })
        
        const completed = tasks.filter(t => t.completed).length
        const total = tasks.length
        progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0
        status = `${completed}/${total} tasks`
      } else if (index === currentDayIndex) {
        // Today - would use live state
        status = 'Live tracking'
        progressPercentage = 50 // Placeholder
      } else {
        // Future day
        status = 'Not yet'
        progressPercentage = 0
      }
      
      console.log(`  ${day}: ${progressPercentage}% (${status})`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDailyProgressTracking()
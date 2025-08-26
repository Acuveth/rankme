const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function debugFrontendMapping() {
  try {
    console.log('=== DEBUG: Frontend Mapping Logic ===\n')
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { email: 'lukagaberscek3@gmail.com' }
    })
    
    if (!user) {
      console.log('❌ User not found')
      return
    }
    
    // Simulate frontend logic
    const currentWeek = 1
    const focusAreas = ['financial', 'health', 'social', 'personal']
    const currentFocusArea = focusAreas[(currentWeek - 1) % focusAreas.length]
    
    console.log('Current week:', currentWeek)
    console.log('Current focus area:', currentFocusArea)
    
    // Frontend task definitions
    const getWeeklyTasksForArea = (area) => {
      const tasksByArea = {
        financial: [
          "Set up automatic savings transfer of $50/week",
          "Track all expenses for one week using an app", 
          "Research one investment option (index funds, ETFs, etc.)",
          "Calculate your net worth and create a simple spreadsheet",
          "Read one article about personal finance or budgeting"
        ],
        health: [
          "Take a 20-minute walk every day this week",
          "Prep healthy meals for 3 days in advance",
          "Drink 8 glasses of water daily and track it",
          "Go to bed 30 minutes earlier than usual",
          "Schedule one health checkup you've been postponing"
        ]
      }
      return tasksByArea[area] || []
    }
    
    const frontendTasks = getWeeklyTasksForArea(currentFocusArea)
    console.log('\n=== FRONTEND TASK DEFINITIONS ===')
    frontendTasks.forEach((task, index) => {
      const taskId = `${currentFocusArea}-week-${currentWeek}-task-${index}`
      console.log(`${index}. ID: "${taskId}"`)
      console.log(`   Title: "${task}"`)
    })
    
    // Database tasks
    console.log('\n=== DATABASE TASKS ===')
    const dbTasks = await prisma.weeklyTask.findMany({
      where: {
        userId: user.id,
        week: currentWeek,
        category: currentFocusArea
      },
      orderBy: [
        { week: 'desc' },
        { createdAt: 'asc' }
      ]
    })
    
    console.log(`Found ${dbTasks.length} database tasks:`)
    dbTasks.forEach((task, index) => {
      console.log(`${index}. Title: "${task.title}"`)
      console.log(`   Completed: ${task.completed}`)
      console.log(`   Created: ${task.createdAt}`)
    })
    
    // Test mapping logic that frontend uses
    console.log('\n=== MAPPING LOGIC TEST ===')
    const weeklyProgressMap = {}
    
    if (dbTasks && Array.isArray(dbTasks)) {
      dbTasks.forEach((task, index) => {
        const taskId = `${currentFocusArea}-week-${currentWeek}-task-${index}`
        weeklyProgressMap[taskId] = task.completed
        
        // Check if titles match
        const frontendTitle = frontendTasks[index]
        const dbTitle = task.title
        const titlesMatch = frontendTitle === dbTitle
        
        console.log(`Task ${index}:`)
        console.log(`  Frontend ID: "${taskId}"`)
        console.log(`  Frontend Title: "${frontendTitle}"`)
        console.log(`  Database Title: "${dbTitle}"`)
        console.log(`  Titles Match: ${titlesMatch} ${!titlesMatch ? '❌' : '✅'}`)
        console.log(`  Completed: ${task.completed}`)
        console.log(`  Mapped State: ${weeklyProgressMap[taskId]}`)
        console.log('')
      })
    }
    
    console.log('Final weeklyProgressMap:', weeklyProgressMap)
    
    // Test what happens when we click a task
    console.log('\n=== SIMULATE TASK CLICK ===')
    const clickedTaskId = `${currentFocusArea}-week-${currentWeek}-task-0`
    const currentState = weeklyProgressMap[clickedTaskId] ?? false
    const newState = !currentState
    
    console.log(`Clicked task: "${clickedTaskId}"`)
    console.log(`Current state: ${currentState}`)
    console.log(`New state: ${newState}`)
    
    // Find corresponding database task
    const clickedTaskIndex = 0
    const correspondingDbTask = dbTasks[clickedTaskIndex]
    const correspondingFrontendTask = frontendTasks[clickedTaskIndex]
    
    if (correspondingDbTask && correspondingFrontendTask) {
      console.log(`\nWould save to database:`)
      console.log(`  Title: "${correspondingFrontendTask}"`)
      console.log(`  Week: ${currentWeek}`)
      console.log(`  Category: ${currentFocusArea}`)
      console.log(`  Completed: ${newState}`)
      
      // Check if this matches exactly what's in database
      const exactMatch = correspondingDbTask.title === correspondingFrontendTask
      console.log(`  Exact title match: ${exactMatch} ${!exactMatch ? '❌' : '✅'}`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugFrontendMapping()
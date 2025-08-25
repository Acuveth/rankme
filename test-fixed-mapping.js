const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testFixedMapping() {
  try {
    console.log('=== TEST: Fixed Title-Based Mapping ===\n')
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { email: 'lukagaberscek3@gmail.com' }
    })
    
    // Simulate the fixed mapping logic
    const currentWeek = 1
    const currentFocusArea = 'financial'
    
    // Frontend task definitions (same as in component)
    const frontendTasks = [
      "Set up automatic savings transfer of $50/week",
      "Track all expenses for one week using an app", 
      "Research one investment option (index funds, ETFs, etc.)",
      "Calculate your net worth and create a simple spreadsheet",
      "Read one article about personal finance or budgeting"
    ]
    
    // Get database tasks
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
    
    console.log('=== FIXED MAPPING LOGIC ===')
    const weeklyProgressMap = {}
    
    frontendTasks.forEach((frontendTitle, frontendIndex) => {
      const taskId = `${currentFocusArea}-week-${currentWeek}-task-${frontendIndex}`
      
      // Find matching database task by title
      const matchingDbTask = dbTasks.find(dbTask => dbTask.title === frontendTitle)
      
      if (matchingDbTask) {
        weeklyProgressMap[taskId] = matchingDbTask.completed
      } else {
        weeklyProgressMap[taskId] = false
      }
      
      console.log(`Task ${frontendIndex}:`)
      console.log(`  Frontend ID: "${taskId}"`)
      console.log(`  Frontend Title: "${frontendTitle}"`)
      console.log(`  Found Match: ${!!matchingDbTask} ${matchingDbTask ? '✅' : '❌'}`)
      if (matchingDbTask) {
        console.log(`  DB Completed: ${matchingDbTask.completed}`)
        console.log(`  Mapped State: ${weeklyProgressMap[taskId]}`)
      } else {
        console.log(`  Default State: ${weeklyProgressMap[taskId]}`)
      }
      console.log('')
    })
    
    console.log('Final mapping result:', weeklyProgressMap)
    
    // Test what happens when we click each task
    console.log('\n=== TEST TASK CLICKS ===')
    frontendTasks.forEach((title, index) => {
      const taskId = `${currentFocusArea}-week-${currentWeek}-task-${index}`
      const currentState = weeklyProgressMap[taskId]
      const newState = !currentState
      
      console.log(`Click Task ${index}: "${title.substring(0, 50)}..."`)
      console.log(`  Current: ${currentState} → New: ${newState}`)
      
      // Check if this would save correctly to database
      const matchingDbTask = dbTasks.find(dbTask => dbTask.title === title)
      if (matchingDbTask) {
        console.log(`  ✅ Would update existing DB task (ID: ${matchingDbTask.id})`)
      } else {
        console.log(`  ⚠️ Would create new DB task`)
      }
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testFixedMapping()
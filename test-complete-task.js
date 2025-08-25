const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testCompleteTask() {
  try {
    console.log('=== TEST: Complete a Task and Verify Loading ===\n')
    
    const user = await prisma.user.findUnique({
      where: { email: 'lukagaberscek3@gmail.com' }
    })
    
    // Complete the first task
    const taskTitle = "Set up automatic savings transfer of $50/week"
    
    console.log(`Completing task: "${taskTitle}"`)
    
    const updatedTask = await prisma.weeklyTask.updateMany({
      where: {
        userId: user.id,
        title: taskTitle,
        week: 1,
        category: 'financial'
      },
      data: {
        completed: true,
        completedAt: new Date()
      }
    })
    
    console.log(`✅ Updated ${updatedTask.count} task(s)`)
    
    // Now test the mapping again
    const dbTasks = await prisma.weeklyTask.findMany({
      where: {
        userId: user.id,
        week: 1,
        category: 'financial'
      }
    })
    
    const frontendTasks = [
      "Set up automatic savings transfer of $50/week",
      "Track all expenses for one week using an app", 
      "Research one investment option (index funds, ETFs, etc.)",
      "Calculate your net worth and create a simple spreadsheet",
      "Read one article about personal finance or budgeting"
    ]
    
    console.log('\n=== VERIFY MAPPING AFTER COMPLETION ===')
    const weeklyProgressMap = {}
    
    frontendTasks.forEach((frontendTitle, frontendIndex) => {
      const taskId = `financial-week-1-task-${frontendIndex}`
      const matchingDbTask = dbTasks.find(dbTask => dbTask.title === frontendTitle)
      
      if (matchingDbTask) {
        weeklyProgressMap[taskId] = matchingDbTask.completed
      } else {
        weeklyProgressMap[taskId] = false
      }
      
      console.log(`Task ${frontendIndex}: "${frontendTitle.substring(0, 40)}..."`);
      console.log(`  Completed: ${matchingDbTask?.completed || false} ${matchingDbTask?.completed ? '✅' : '⭕'}`);
    })
    
    console.log('\nFinal state:', weeklyProgressMap)
    
    // Now set it back to incomplete for testing
    console.log('\n=== SETTING BACK TO INCOMPLETE ===')
    await prisma.weeklyTask.updateMany({
      where: {
        userId: user.id,
        title: taskTitle,
        week: 1,
        category: 'financial'
      },
      data: {
        completed: false,
        completedAt: null
      }
    })
    
    console.log('✅ Task set back to incomplete for further testing')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCompleteTask()
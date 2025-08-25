const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function debugTaskCompletion() {
  try {
    console.log('=== DEBUG: Task Completion System ===\n')
    
    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: 'lukagaberscek3@gmail.com' }
    })
    
    if (!user) {
      console.log('❌ User not found')
      return
    }
    
    console.log('✅ User found:', user.id)
    
    // 2. Check existing weekly tasks
    console.log('\n=== EXISTING WEEKLY TASKS ===')
    const existingWeeklyTasks = await prisma.weeklyTask.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`Found ${existingWeeklyTasks.length} weekly tasks:`)
    existingWeeklyTasks.forEach((task, i) => {
      console.log(`${i + 1}. "${task.title}" - Week ${task.week} - Category: ${task.category} - Completed: ${task.completed}`)
    })
    
    // 3. Simulate creating a new weekly task
    console.log('\n=== SIMULATING TASK CREATION ===')
    const testTask = {
      userId: user.id,
      title: 'Test Weekly Task - Create a basic budget',
      description: 'Set up a simple monthly budget tracking your income and expenses',
      category: 'financial',
      week: 1,
      completed: false,
      assessmentId: 'test-assessment-id'
    }
    
    console.log('Creating test task:', testTask.title)
    
    const createdTask = await prisma.weeklyTask.upsert({
      where: {
        userId_title_week_category: {
          userId: testTask.userId,
          title: testTask.title,
          week: testTask.week,
          category: testTask.category
        }
      },
      update: {
        completed: testTask.completed,
        completedAt: testTask.completed ? new Date() : null
      },
      create: testTask
    })
    
    console.log('✅ Task created/updated:', createdTask.id)
    
    // 4. Simulate completing the task
    console.log('\n=== SIMULATING TASK COMPLETION ===')
    const completedTask = await prisma.weeklyTask.update({
      where: { id: createdTask.id },
      data: {
        completed: true,
        completedAt: new Date()
      }
    })
    
    console.log('✅ Task marked as completed:', completedTask.completed)
    
    // 5. Test the API query that the frontend uses
    console.log('\n=== TESTING FRONTEND QUERY ===')
    const frontendQuery = await prisma.weeklyTask.findMany({
      where: {
        userId: user.id,
        week: 1,
        category: 'financial'
      },
      orderBy: [
        { week: 'desc' },
        { createdAt: 'asc' }
      ]
    })
    
    console.log(`Frontend would see ${frontendQuery.length} tasks for week 1, financial:`)
    frontendQuery.forEach((task, i) => {
      console.log(`${i + 1}. "${task.title}" - Completed: ${task.completed}`)
    })
    
    // 6. Test uncompleting the task
    console.log('\n=== TESTING TASK UNCOMPLETE ===')
    const uncompletedTask = await prisma.weeklyTask.update({
      where: { id: createdTask.id },
      data: {
        completed: false,
        completedAt: null
      }
    })
    
    console.log('✅ Task marked as incomplete:', uncompletedTask.completed)
    
    // 7. Final verification
    const finalCheck = await prisma.weeklyTask.findUnique({
      where: { id: createdTask.id }
    })
    
    console.log('\n=== FINAL VERIFICATION ===')
    console.log('Task in database:', {
      id: finalCheck?.id,
      title: finalCheck?.title,
      completed: finalCheck?.completed,
      completedAt: finalCheck?.completedAt
    })
    
    console.log('\n✅ Database operations working correctly')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugTaskCompletion()
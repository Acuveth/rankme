const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testTimestampRecording() {
  try {
    console.log('=== TEST: Timestamp Recording for Weekly Tasks ===\n')
    
    const user = await prisma.user.findUnique({
      where: { email: 'lukagaberscek3@gmail.com' }
    })
    
    if (!user) {
      console.log('❌ User not found')
      return
    }
    
    const testTaskTitle = "Set up automatic savings transfer of $50/week"
    
    // Find the task
    const task = await prisma.weeklyTask.findFirst({
      where: {
        userId: user.id,
        title: testTaskTitle,
        week: 1,
        category: 'financial'
      }
    })
    
    if (!task) {
      console.log('❌ Test task not found')
      return
    }
    
    console.log('Found task:', {
      id: task.id,
      title: task.title,
      completed: task.completed,
      completedAt: task.completedAt,
      createdAt: task.createdAt
    })
    
    // Test completing the task
    console.log('\n=== Testing Task Completion with Timestamp ===')
    
    const completionTime = new Date()
    console.log('Completion time:', completionTime.toISOString())
    
    const updatedTask = await prisma.weeklyTask.update({
      where: { id: task.id },
      data: {
        completed: true,
        completedAt: completionTime
      }
    })
    
    console.log('✅ Task updated:', {
      completed: updatedTask.completed,
      completedAt: updatedTask.completedAt?.toISOString(),
      timeDifference: updatedTask.completedAt ? 
        `${Math.abs(updatedTask.completedAt.getTime() - completionTime.getTime())}ms` : 'N/A'
    })
    
    // Test uncompleting the task
    console.log('\n=== Testing Task Incompletion ===')
    
    const uncompletedTask = await prisma.weeklyTask.update({
      where: { id: task.id },
      data: {
        completed: false,
        completedAt: null
      }
    })
    
    console.log('✅ Task set to incomplete:', {
      completed: uncompletedTask.completed,
      completedAt: uncompletedTask.completedAt
    })
    
    // Test the API endpoint directly
    console.log('\n=== Testing API Endpoint ===')
    
    // Simulate what the frontend sends
    const apiData = {
      type: 'weekly_task',
      data: {
        title: testTaskTitle,
        description: 'Set up a simple monthly budget tracking your income and expenses',
        category: 'financial',
        week: 1,
        completed: true,
        assessmentId: 'test-assessment-id'
      }
    }
    
    console.log('API would receive:', apiData)
    
    // Test the upsert logic directly
    const apiResult = await prisma.weeklyTask.upsert({
      where: {
        userId_title_week_category: {
          userId: user.id,
          title: apiData.data.title,
          week: apiData.data.week,
          category: apiData.data.category
        }
      },
      update: {
        completed: apiData.data.completed,
        completedAt: apiData.data.completed ? new Date() : null
      },
      create: {
        userId: user.id,
        title: apiData.data.title,
        description: apiData.data.description,
        category: apiData.data.category,
        week: apiData.data.week,
        completed: apiData.data.completed || false,
        completedAt: apiData.data.completed ? new Date() : null,
        assessmentId: apiData.data.assessmentId
      }
    })
    
    console.log('✅ API simulation result:', {
      id: apiResult.id,
      completed: apiResult.completed,
      completedAt: apiResult.completedAt?.toISOString(),
      updatedAt: apiResult.updatedAt.toISOString()
    })
    
    // Verify the timestamp is recent (within last few seconds)
    if (apiResult.completedAt) {
      const timeDiff = Math.abs(Date.now() - apiResult.completedAt.getTime())
      const isRecent = timeDiff < 5000 // Within 5 seconds
      console.log(`Timestamp is recent (${timeDiff}ms ago): ${isRecent ? '✅' : '❌'}`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testTimestampRecording()
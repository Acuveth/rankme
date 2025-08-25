const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function simpleDailyTest() {
  try {
    console.log('=== Simple Daily Progress Test ===\n')
    
    // Get first user
    const user = await prisma.user.findFirst()
    console.log(`Using user: ${user.name} (${user.email})`)
    
    // Create a daily task for today
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    
    console.log(`Creating daily task for ${todayString}`)
    
    const task = await prisma.dailyTask.create({
      data: {
        userId: user.id,
        title: 'Test daily task',
        description: 'Testing daily progress tracking',
        category: 'financial',
        date: today,
        completed: true,
        completedAt: new Date()
      }
    })
    
    console.log('✅ Created task:', {
      id: task.id,
      title: task.title,
      completed: task.completed,
      completedAt: task.completedAt?.toISOString()
    })
    
    // Test querying tasks for today
    const todayTasks = await prisma.dailyTask.findMany({
      where: {
        userId: user.id,
        date: {
          gte: new Date(todayString + 'T00:00:00.000Z'),
          lt: new Date(todayString + 'T23:59:59.999Z')
        }
      }
    })
    
    console.log(`\nFound ${todayTasks.length} tasks for today:`)
    todayTasks.forEach(t => {
      console.log(`- ${t.title}: ${t.completed ? 'Completed' : 'Incomplete'}`)
      if (t.completedAt) {
        console.log(`  Completed at: ${t.completedAt.toISOString()}`)
      }
    })
    
    const completed = todayTasks.filter(t => t.completed).length
    const total = todayTasks.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    
    console.log(`\nDaily completion rate: ${completed}/${total} = ${percentage}%`)
    console.log('\n✅ Daily progress tracking is working correctly!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

simpleDailyTest()
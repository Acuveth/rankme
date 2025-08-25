const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testProgressAfterFix() {
  try {
    // Delete existing progress data to test fresh calculation
    const user = await prisma.user.findUnique({
      where: { email: 'lukagaberscek3@gmail.com' }
    })
    
    if (!user) {
      console.log('User not found')
      return
    }
    
    console.log('=== CLEANING UP OLD PROGRESS DATA ===')
    await prisma.userProgressStats.deleteMany({
      where: { userId: user.id }
    })
    
    await prisma.dailyProgressSnapshot.deleteMany({
      where: { userId: user.id }
    })
    
    console.log('Old progress data cleared')
    
    // Now make a request to the progress API to trigger calculation
    const response = await fetch('http://localhost:3000/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'daily_task',
        data: {
          title: 'Test Task',
          description: 'Test task to trigger progress calculation',
          category: 'financial',
          date: new Date().toISOString(),
          completed: true
        }
      })
    })
    
    console.log('Response status:', response.status)
    const data = await response.json()
    console.log('Response data:', data)
    
    // Check what was created
    const progressStats = await prisma.userProgressStats.findUnique({
      where: { userId: user.id }
    })
    
    const dailySnapshots = await prisma.dailyProgressSnapshot.findMany({
      where: { userId: user.id }
    })
    
    console.log('\n=== RESULTS AFTER API CALL ===')
    console.log('Progress Stats:', progressStats)
    console.log('Daily Snapshots:', dailySnapshots.length)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testProgressAfterFix()
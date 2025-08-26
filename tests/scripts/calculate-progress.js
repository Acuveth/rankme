const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function calculateProgress() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'lukagaberscek3@gmail.com' }
    })
    
    if (!user) {
      console.log('User not found')
      return
    }
    
    console.log('Manually calculating progress for user:', user.email)
    
    // Import and use ProgressTracker
    const { ProgressTracker } = require('./lib/progress-tracker.ts')
    
    await ProgressTracker.updateUserProgress(user.id)
    console.log('Progress calculation completed')
    
    // Check results
    const stats = await prisma.userProgressStats.findUnique({
      where: { userId: user.id }
    })
    
    console.log('Results:', stats)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

calculateProgress()
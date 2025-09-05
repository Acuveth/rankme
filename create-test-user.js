const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Find or create test user
    let user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })
    
    if (!user) {
      // Hash a simple password for testing
      const hashedPassword = await bcrypt.hash('testpassword123', 10)
      
      // Create test user
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: hashedPassword
        }
      })
      console.log('Created test user:', user.id)
    } else {
      console.log('Using existing test user:', user.id)
    }

    // Create an active subscription for the user
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        product: 'ai_coach_monthly',
        status: 'active',
        periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        stripeId: 'test_sub_' + Date.now()
      }
    })

    console.log('Created subscription:', subscription.id)

    // Update the completed assessment to belong to this user
    const assessment = await prisma.assessment.update({
      where: { id: 'cmf3w7qz4002ozrczb9s82phb' },
      data: {
        userId: user.id,
        anonId: null // Clear the anonymous ID since it's now linked to a user
      }
    })

    console.log('Updated assessment to belong to user')

    // Create coach preferences for this assessment
    const coachSettings = await prisma.coachSettings.create({
      data: {
        userId: user.id,
        assessmentId: 'cmf3w7qz4002ozrczb9s82phb',
        primaryFocus: 'financial',
        coachingStyle: 'supportive',
        dailyTaskCount: 3,
        weeklyTaskCount: 2,
        taskDifficulty: 'moderate',
        motivationLevel: 'balanced',
        checkInFrequency: 'daily',
        checkInTime: '09:00',
        hasCompletedSetup: true,
        setupCompletedAt: new Date()
      }
    })

    console.log('Created coach settings:', coachSettings.id)

    console.log(`
Test user created successfully!
Email: test@example.com
Password: testpassword123
User ID: ${user.id}
Assessment ID: cmf3w7qz4002ozrczb9s82phb
    `)

  } catch (error) {
    console.error('Error creating test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
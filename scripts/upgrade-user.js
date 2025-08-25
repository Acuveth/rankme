const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function upgradeUser() {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: 'lukagaberscek3@gmail.com' }
    })

    if (!user) {
      console.log('User not found!')
      return
    }

    console.log('Found user:', user.email)

    // Create a subscription record for AI Coach
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        product: 'ai_coach_monthly',
        status: 'active',
        periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        stripeId: 'dev_test_subscription'
      }
    })

    console.log('Created subscription:', subscription)

    // Find user's most recent assessment
    const assessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    if (assessment) {
      // Create a purchase record linking the assessment to AI Coach
      const purchase = await prisma.purchase.create({
        data: {
          userId: user.id,
          assessmentId: assessment.id,
          product: 'ai_coach_monthly',
          price: 19.00,
          currency: 'USD',
          status: 'completed',
          stripeId: 'dev_test_purchase'
        }
      })

      console.log('Created purchase record:', purchase)
      console.log('User upgraded successfully!')
    } else {
      console.log('No assessment found for user')
    }

  } catch (error) {
    console.error('Error upgrading user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

upgradeUser()
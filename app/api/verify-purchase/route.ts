import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId } = body

    console.log('Verifying purchase for session:', sessionId)

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (!session || session.payment_status !== 'paid') {
      console.log('Payment not completed:', session?.payment_status)
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    const { assessmentId, product } = session.metadata!
    let { userId } = session.metadata!
    console.log('Session metadata:', { assessmentId, product, userId })

    // Handle user linking
    if (userId === 'anonymous') {
      // Anonymous user - create or find a user based on the assessment
      const assessment = await prisma.assessment.findUnique({
        where: { id: assessmentId },
        include: { user: true }
      })

      if (assessment?.userId) {
        userId = assessment.userId
      } else {
        // Create a temporary user based on customer email from Stripe session
        const customerEmail = session.customer_details?.email || `temp_${assessmentId}@rankme.app`
        
        // Check if user with this email exists
        let user = await prisma.user.findUnique({
          where: { email: customerEmail }
        })

        if (!user) {
          // Create new user
          user = await prisma.user.create({
            data: {
              email: customerEmail,
              name: session.customer_details?.name || 'Guest User'
            }
          })
        }

        userId = user.id

        // Link assessment to user
        await prisma.assessment.update({
          where: { id: assessmentId },
          data: { userId }
        })
      }
    } else {
      // Logged-in user - ensure assessment is linked to them
      const assessment = await prisma.assessment.findUnique({
        where: { id: assessmentId }
      })

      if (assessment && !assessment.userId) {
        // Link the assessment to the logged-in user
        await prisma.assessment.update({
          where: { id: assessmentId },
          data: { userId }
        })
      } else if (assessment && assessment.userId && assessment.userId !== userId) {
        // Assessment belongs to a different user - use the assessment's actual owner
        console.warn(`Assessment ${assessmentId} belongs to user ${assessment.userId}, but purchase is for user ${userId}`)
        console.log(`Using assessment owner ${assessment.userId} for purchase records`)
        userId = assessment.userId
      }
    }

    // Check for purchase with multiple product name variations (for backwards compatibility)
    if (product === 'deep_report_oneoff') {
      // Try multiple product variations to handle migration
      const purchase = await prisma.purchase.findFirst({
        where: {
          assessmentId,
          stripeId: session.id,
          OR: [
            { product: 'deep_report_oneoff' },
            { product: 'deep_report' }
          ]
        }
      })

      console.log('Deep report purchase found:', !!purchase)

      if (purchase) {
        return NextResponse.json({
          product: 'deep_report_oneoff',
          assessmentId
        })
      } else {
        // If purchase doesn't exist yet, create it (webhook might be delayed)
        console.log('Creating purchase record as webhook may be delayed')
        const newPurchase = await prisma.purchase.create({
          data: {
            userId,
            assessmentId,
            product: 'deep_report_oneoff',
            price: session.amount_total! / 100,
            currency: session.currency!,
            status: 'completed',
            stripeId: session.id
          }
        })
        
        return NextResponse.json({
          product: 'deep_report_oneoff',
          assessmentId
        })
      }
    } else if (product === 'ai_coach_monthly') {
      const subscription = await prisma.subscription.findFirst({
        where: {
          assessmentId,
          status: 'active',
          OR: [
            { product: 'ai_coach_monthly' },
            { product: 'ai_coach' }
          ]
        }
      })

      console.log('AI coach subscription found:', !!subscription)

      if (subscription) {
        return NextResponse.json({
          product: 'ai_coach_monthly',
          assessmentId
        })
      } else if (session.subscription) {
        // Create subscription if it doesn't exist yet
        console.log('Creating subscription record as webhook may be delayed')
        const stripeSubscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )
        
        const newSubscription = await prisma.subscription.create({
          data: {
            userId,
            assessmentId,
            product: 'ai_coach_monthly',
            status: 'active',
            periodEnd: new Date(stripeSubscription.current_period_end * 1000),
            stripeId: stripeSubscription.id
          }
        })
        
        return NextResponse.json({
          product: 'ai_coach_monthly',
          assessmentId
        })
      }
    }

    console.log('Purchase not found for product:', product)
    return NextResponse.json(
      { error: 'Purchase not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error verifying purchase:', error)
    return NextResponse.json(
      { error: 'Failed to verify purchase' },
      { status: 500 }
    )
  }
}
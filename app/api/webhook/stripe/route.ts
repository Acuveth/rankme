import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { assessmentId, product } = session.metadata!
        let { userId } = session.metadata!

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

        if (product === 'deep_report_oneoff') {
          await prisma.purchase.create({
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
        } else if (product === 'ai_coach_monthly') {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          await prisma.subscription.create({
            data: {
              userId,
              assessmentId,
              product: 'ai_coach_monthly',
              status: 'active',
              periodEnd: new Date(subscription.current_period_end * 1000),
              stripeId: subscription.id
            }
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        await prisma.subscription.updateMany({
          where: { stripeId: subscription.id },
          data: { status: 'cancelled' }
        })
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        await prisma.subscription.updateMany({
          where: { stripeId: subscription.id },
          data: {
            status: subscription.status,
            periodEnd: new Date(subscription.current_period_end * 1000)
          }
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
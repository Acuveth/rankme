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
        const { assessmentId, userId, product } = session.metadata!

        if (product === 'deep_report_oneoff') {
          await prisma.purchase.create({
            data: {
              userId: userId === 'anonymous' ? assessmentId : userId,
              assessmentId,
              product: 'deep_report',
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
              userId: userId === 'anonymous' ? assessmentId : userId,
              product: 'ai_coach',
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
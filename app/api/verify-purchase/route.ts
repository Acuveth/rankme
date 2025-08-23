import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId } = body

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (!session || session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    const { assessmentId, product } = session.metadata!

    // Verify purchase exists in database
    if (product === 'deep_report_oneoff') {
      const purchase = await prisma.purchase.findFirst({
        where: {
          assessmentId,
          product: 'deep_report',
          stripeId: session.id
        }
      })

      if (purchase) {
        return NextResponse.json({
          product: 'deep_report',
          assessmentId
        })
      }
    } else if (product === 'ai_coach_monthly') {
      const subscription = await prisma.subscription.findFirst({
        where: {
          product: 'ai_coach',
          status: 'active'
        }
      })

      if (subscription) {
        return NextResponse.json({
          product: 'ai_coach',
          assessmentId
        })
      }
    }

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
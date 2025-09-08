import { NextResponse } from 'next/server'
import { stripe, PRODUCTS } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured')
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { product, assessmentId, userId } = body

    console.log('Checkout request:', { product, assessmentId, userId })

    const productInfo = product === 'deep_report_oneoff' 
      ? PRODUCTS.DEEP_REPORT 
      : PRODUCTS.AI_COACH

    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productInfo.name,
              description: productInfo.description,
            },
            unit_amount: productInfo.price,
            ...(productInfo.type === 'subscription' && productInfo.interval && {
              recurring: {
                interval: productInfo.interval
              }
            })
          },
          quantity: 1,
        },
      ],
      mode: productInfo.type === 'subscription' ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/scorecard/${assessmentId}`,
      metadata: {
        assessmentId,
        userId: userId || 'anonymous',
        product: product
      }
    }

    // Add 7-day free trial for AI Coach subscription
    if (product === 'ai_coach_monthly' && productInfo.type === 'subscription') {
      sessionConfig.subscription_data = {
        trial_period_days: 7,
        metadata: {
          assessmentId,
          userId: userId || 'anonymous',
          product: product
        }
      }
    }

    console.log('Creating Stripe session with config:', JSON.stringify(sessionConfig, null, 2))
    
    const session = await stripe.checkout.sessions.create(sessionConfig)

    console.log('Stripe session created:', session.id)

    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    console.error('Detailed checkout error:', {
      message: error.message,
      type: error.type,
      statusCode: error.statusCode,
      stack: error.stack
    })
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create checkout session',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
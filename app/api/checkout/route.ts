import { NextResponse } from 'next/server'
import { stripe, PRODUCTS } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { product, assessmentId, userId } = body

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
            ...(productInfo.type === 'subscription' && {
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

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
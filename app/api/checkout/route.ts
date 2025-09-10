import { NextRequest, NextResponse } from 'next/server'
import { stripe, PRODUCTS } from '@/lib/stripe'
import { checkoutSchema } from '@/lib/validations/schemas'
import { withMiddleware, withValidation, withSecurityHeaders, sanitizeString } from '@/lib/middleware/security'
import { withErrorHandler, validateInput, ExternalAPIError } from '@/lib/utils/errorHandler'
import { prisma } from '@/lib/prisma'

async function createCheckoutHandler(request: NextRequest, validatedData: any) {
  // Check if Stripe key is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new ExternalAPIError('Stripe', 'Payment system not configured')
  }

  const { product, assessmentId, successUrl, cancelUrl } = validatedData

  // Verify assessment exists
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    select: { id: true, status: true }
  })

  if (!assessment) {
    return NextResponse.json(
      { error: 'Assessment not found' },
      { status: 404 }
    )
  }

  // Validate product exists
  const productInfo = product === 'deep_report_oneoff' || product === 'deep_report'
    ? PRODUCTS.DEEP_REPORT 
    : product === 'ai_coach_monthly'
    ? PRODUCTS.AI_COACH
    : null

  if (!productInfo) {
    return NextResponse.json(
      { error: 'Invalid product selected' },
      { status: 400 }
    )
  }

  // Sanitize URLs
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'
  const sanitizedSuccessUrl = successUrl || `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`
  const sanitizedCancelUrl = cancelUrl || `${baseUrl}/scorecard/${assessmentId}`

  // Build session configuration
  const sessionConfig: any = {
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: sanitizeString(productInfo.name),
            description: sanitizeString(productInfo.description),
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
    success_url: sanitizedSuccessUrl,
    cancel_url: sanitizedCancelUrl,
    metadata: {
      assessmentId: sanitizeString(assessmentId),
      product: sanitizeString(product),
      created_at: new Date().toISOString()
    },
    expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    allow_promotion_codes: false, // Disable for security
  }

  // Add 7-day free trial for AI Coach subscription
  if (product === 'ai_coach_monthly' && productInfo.type === 'subscription') {
    sessionConfig.subscription_data = {
      trial_period_days: 7,
      metadata: {
        assessmentId: sanitizeString(assessmentId),
        product: sanitizeString(product),
        trial_start: new Date().toISOString()
      }
    }
  }

  try {
    const session = await stripe.checkout.sessions.create(sessionConfig)

    // Log successful session creation (without sensitive data)
    console.log('Checkout session created:', {
      sessionId: session.id,
      product: product,
      assessmentId: assessmentId,
      mode: sessionConfig.mode
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error: any) {
    console.error('Stripe session creation failed:', {
      error: error.message,
      type: error.type,
      code: error.code
    })
    
    throw new ExternalAPIError('Stripe', 'Failed to create payment session')
  }
}

export const POST = withMiddleware(
  withValidation(checkoutSchema),
  withSecurityHeaders,
  withErrorHandler
)(createCheckoutHandler)
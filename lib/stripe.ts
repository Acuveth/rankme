import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PRODUCTS = {
  DEEP_REPORT: {
    id: 'deep_report_oneoff',
    name: 'Deep Life Report',
    description: 'Comprehensive analysis with actionable insights and 30-day plan',
    price: 2900, // $29.00 in cents
    type: 'one_time'
  },
  AI_COACH: {
    id: 'ai_coach_monthly',
    name: 'AI Life Coach',
    description: 'Personalized weekly plans, progress tracking, and guidance',
    price: 1900, // $19.00 in cents
    type: 'subscription',
    interval: 'month' as const
  }
}
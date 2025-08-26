'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { CheckCircle, MessageSquare, Calendar, Trophy, Lock, ArrowLeft, Star, Zap, Target, Users, TrendingUp } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CoachPaywallPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedFocus, setSelectedFocus] = useState('financial')

  const focusAreas = [
    { id: 'financial', label: 'Financial Growth', icon: TrendingUp, description: 'Improve income, savings, and investments' },
    { id: 'health', label: 'Health & Fitness', icon: Target, description: 'Build sustainable fitness and wellness habits' },
    { id: 'social', label: 'Social Network', icon: Users, description: 'Expand relationships and professional connections' },
    { id: 'personal', label: 'Personal Development', icon: Star, description: 'Enhance confidence and life satisfaction' }
  ]

  const features = [
    {
      icon: Calendar,
      title: 'Personalized Weekly Plans',
      description: 'Receive custom action plans every week based on your progress and goals'
    },
    {
      icon: MessageSquare,
      title: 'AI Coach Check-ins',
      description: 'Daily motivation and guidance through intelligent coaching conversations'
    },
    {
      icon: Trophy,
      title: 'Progress Tracking',
      description: 'Monitor your improvement with detailed analytics and milestone celebrations'
    },
    {
      icon: Zap,
      title: 'Habit Optimization',
      description: 'Science-backed strategies to build lasting positive habits'
    },
    {
      icon: Target,
      title: 'Goal Achievement',
      description: 'Break down big goals into manageable daily actions with accountability'
    }
  ]

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: 'ai_coach_monthly',
          assessmentId: params.id,
          focusArea: selectedFocus
        })
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise
      
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Stripe error:', error)
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </button>
          
          <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your Personal AI Life Coach
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get personalized coaching, weekly action plans, and continuous support 
            to achieve your life goals faster than ever before.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Focus Area Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Primary Focus</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {focusAreas.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => setSelectedFocus(area.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedFocus === area.id
                        ? 'border-gray-900 bg-gray-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <area.icon className="h-5 w-5 text-gray-600 mr-2" />
                      <span className="font-semibold text-gray-900">{area.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{area.description}</p>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                You can change your focus area anytime after subscribing.
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-gray-100 p-3 rounded-lg mr-4 flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Stories */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What Our Users Say</h2>
              <div className="grid gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <div className="font-semibold text-gray-900">Sarah M.</div>
                      <div className="text-sm text-gray-600">Financial Focus</div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    "In just 3 months, I increased my savings rate from 10% to 25% and started investing. 
                    The daily check-ins kept me accountable and motivated."
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <div className="font-semibold text-gray-900">Mike R.</div>
                      <div className="text-sm text-gray-600">Health Focus</div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    "Lost 30 pounds and can now run a 5K. The personalized weekly plans made 
                    fitness feel achievable instead of overwhelming."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-gray-400 mr-2" />
                  <span className="text-gray-600 font-medium">AI Life Coach</span>
                </div>
                
                <div className="text-5xl font-bold text-gray-900 mb-2">$19</div>
                <p className="text-gray-600">per month</p>
                <p className="text-sm text-gray-500 mt-2">Cancel anytime</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-gray-600 mr-3" />
                  <span className="text-gray-700">Personalized weekly action plans</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-gray-600 mr-3" />
                  <span className="text-gray-700">Daily AI coach check-ins</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-gray-600 mr-3" />
                  <span className="text-gray-700">Progress tracking & analytics</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-gray-600 mr-3" />
                  <span className="text-gray-700">Monthly re-assessments</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-gray-600 mr-3" />
                  <span className="text-gray-700">24/7 motivation & support</span>
                </div>
              </div>

              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full bg-gray-900 text-white py-4 rounded-xl hover:bg-gray-800 transition-all font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Start My Coaching Journey'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                First week free • Cancel anytime • No commitment
              </p>
            </div>

            {/* Money Back Guarantee */}
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <div className="text-center">
                <CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-bold text-green-800 mb-2">30-Day Guarantee</h3>
                <p className="text-sm text-green-700">
                  If you don't see improvement in your chosen focus area within 30 days, 
                  we'll refund your entire subscription.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Frequently Asked</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm text-gray-900 mb-1">How is this different from other apps?</p>
                  <p className="text-xs text-gray-600">Our AI is trained specifically on your assessment results and adapts to your progress.</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 mb-1">Can I change my focus area?</p>
                  <p className="text-xs text-gray-600">Yes, you can switch focus areas anytime in your dashboard.</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 mb-1">How much time does it take daily?</p>
                  <p className="text-xs text-gray-600">Just 5-10 minutes for check-ins, plus time for your personalized actions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { CheckCircle, FileText, TrendingUp, Calendar, Lock, ArrowLeft, Star, Users, Target, BarChart3 } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function ReportPaywallPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const features = [
    {
      icon: BarChart3,
      title: 'Complete Performance Analysis',
      description: 'Detailed breakdown of all 32 assessment items with individual scores and rankings'
    },
    {
      icon: TrendingUp,
      title: 'Improvement Drivers',
      description: 'Identify your top 3 strengths and top 3 opportunities with impact analysis'
    },
    {
      icon: Calendar,
      title: 'Personalized 30-Day Plan',
      description: 'Actionable, prioritized steps tailored to your specific results and goals'
    },
    {
      icon: Target,
      title: 'Peer Comparison Insights',
      description: 'Understand how you compare to similar individuals in your demographic'
    },
    {
      icon: FileText,
      title: 'Professional PDF Report',
      description: 'Download a beautifully formatted report perfect for sharing or tracking'
    }
  ]

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: 'deep_report_oneoff',
          assessmentId: params.id
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
            <Lock className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Unlock Your Deep Life Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get comprehensive insights, personalized recommendations, and a detailed action plan 
            to improve your life performance across all dimensions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Features */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
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

            {/* Sample Insights */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sample Insights You'll Receive</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-800 font-medium mb-1">Top Strength Identified</p>
                      <p className="text-gray-700 text-sm">
                        "Your savings rate is in the 85th percentile - this financial discipline is your strongest asset and foundation for wealth building."
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-start">
                    <Target className="h-5 w-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-800 font-medium mb-1">Growth Opportunity</p>
                      <p className="text-gray-700 text-sm">
                        "Increasing weekly exercise by 90 minutes could boost your health score by 15 points and move you from 60th to 75th percentile."
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-blue-800 font-medium mb-1">Peer Comparison</p>
                      <p className="text-blue-700 text-sm">
                        "Among professionals aged 25-30, your social network diversity ranks in the 40th percentile. Here's how to improve..."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-gray-400 mr-2" />
                  <span className="text-gray-600 font-medium">Deep Analysis Report</span>
                </div>
                
                <div className="text-5xl font-bold text-gray-900 mb-2">$29</div>
                <p className="text-gray-600">One-time purchase</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                  <span className="text-gray-700">Instant access after payment</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                  <span className="text-gray-700">Professional PDF download</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                  <span className="text-gray-700">Lifetime access to results</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                  <span className="text-gray-700">30-day money-back guarantee</span>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                disabled={loading}
                className="w-full bg-gray-900 text-white py-4 rounded-xl hover:bg-gray-800 transition-all font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Get My Deep Analysis'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure payment powered by Stripe
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Why Choose Our Analysis?</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">Based on validated psychological research</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">Compared against 10,000+ assessments</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">Actionable insights, not generic advice</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">4.8/5 average user rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
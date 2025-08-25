'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Star, Zap, FileText, MessageSquare, TrendingUp, Shield, Award } from 'lucide-react'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Path to Growth
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Whether you want deep insights or ongoing coaching support, we have the perfect option 
              to help you improve your life performance.
            </p>
            
            <div className="bg-white p-1 rounded-xl inline-flex shadow-sm">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly (Save 25%)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Free Assessment */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Assessment</h3>
              <p className="text-gray-600">Perfect for getting started</p>
            </div>

            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gray-900 mb-2">$0</div>
              <p className="text-gray-600">Always free</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Complete 32-question assessment</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Basic percentile rankings</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Category performance breakdown</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Top strengths & opportunities</span>
              </div>
            </div>

            <Link
              href="/assessment"
              className="w-full flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            >
              Start Free Assessment
            </Link>
          </div>

          {/* Deep Report */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gray-900 text-white px-4 py-1 rounded-full text-xs font-semibold">
                MOST POPULAR
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Deep Analysis Report</h3>
              <p className="text-gray-600">Comprehensive insights & action plan</p>
            </div>

            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gray-900 mb-2">$29</div>
              <p className="text-gray-600">One-time purchase</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Everything in Free Assessment</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Detailed category analysis</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Personalized 30-day action plan</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Peer comparison insights</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Professional PDF download</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">30-day money-back guarantee</span>
              </div>
            </div>

            <Link
              href="/assessment?product=report"
              className="w-full flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold"
            >
              Get Deep Analysis
            </Link>
          </div>

          {/* AI Coach */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 relative">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Life Coach</h3>
              <p className="text-gray-600">Ongoing support & accountability</p>
            </div>

            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                ${billingCycle === 'monthly' ? '19' : '14'}
              </div>
              <p className="text-gray-600">
                per month{billingCycle === 'yearly' && ', billed yearly'}
              </p>
              {billingCycle === 'yearly' && (
                <p className="text-green-600 text-sm font-semibold mt-1">Save $60/year</p>
              )}
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Everything in Deep Report</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Weekly personalized plans</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Daily AI coach check-ins</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Progress tracking & analytics</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Monthly re-assessments</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Cancel anytime</span>
              </div>
            </div>

            <Link
              href="/assessment?product=coach"
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all font-semibold"
            >
              Start Free Trial
            </Link>
            <p className="text-xs text-center text-gray-500 mt-3">First 7 days free</p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Feature Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Deep Report</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">AI Coach</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">32-Question Assessment</td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">Basic Percentile Rankings</td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">Detailed Analysis & Insights</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">30-Day Action Plan</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">PDF Download</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">Weekly Coaching Plans</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">Daily AI Check-ins</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">Progress Tracking</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">30-Day Guarantee</h3>
            <p className="text-sm text-gray-600">
              Not satisfied? Get a full refund within 30 days, no questions asked.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">4.8/5 Rating</h3>
            <p className="text-sm text-gray-600">
              Trusted by over 10,000 users who've improved their lives with RankMe.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Instant Access</h3>
            <p className="text-sm text-gray-600">
              Get immediate access to your personalized insights and coaching tools.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Can I upgrade from the free version?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Absolutely! You can purchase the Deep Report or start an AI Coach subscription 
                at any time after completing your free assessment.
              </p>

              <h3 className="font-bold text-gray-900 mb-3">What's included in the 7-day trial?</h3>
              <p className="text-gray-600 text-sm mb-4">
                The AI Coach trial includes all premium features: personalized weekly plans, 
                daily check-ins, progress tracking, and unlimited access to coaching tools.
              </p>

              <h3 className="font-bold text-gray-900 mb-3">How accurate are the results?</h3>
              <p className="text-gray-600 text-sm">
                Our assessment is based on validated research and calibrated against 10,000+ 
                responses. Results are as accurate as the information you provide.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Yes, you can cancel your AI Coach subscription anytime from your account settings. 
                You'll keep access until your current billing period ends.
              </p>

              <h3 className="font-bold text-gray-900 mb-3">Is my data secure and private?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Absolutely. We use bank-level encryption and never sell your personal data. 
                Read our privacy policy for complete details.
              </p>

              <h3 className="font-bold text-gray-900 mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards through Stripe, our secure payment processor. 
                All transactions are encrypted and PCI compliant.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Life?</h2>
            <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
              Join thousands of people who've used RankMe to understand their strengths, 
              identify opportunities, and create lasting positive change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/assessment"
                className="px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all font-semibold"
              >
                Start Free Assessment
              </Link>
              <Link
                href="/sample-report"
                className="inline-block px-8 py-4 border border-white/30 text-white rounded-xl hover:bg-white/10 transition-all font-semibold"
              >
                View Sample Report
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
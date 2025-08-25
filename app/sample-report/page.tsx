'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Target, Brain, Heart, DollarSign, Users, ChevronRight, BarChart3, Award, Lightbulb, CheckCircle, AlertCircle, Star } from 'lucide-react'

export default function SampleReportPage() {
  // Sample data for demonstration
  const sampleData = {
    overall: 72,
    percentile: 78,
    categories: {
      financial: { score: 68, percentile: 71, trend: 'up' },
      health: { score: 75, percentile: 82, trend: 'stable' },
      social: { score: 70, percentile: 76, trend: 'up' },
      romantic: { score: 74, percentile: 79, trend: 'down' }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/pricing"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pricing
          </Link>
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white mb-8 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <span className="text-sm font-semibold">SAMPLE REPORT</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Deep Life Analysis Report</h1>
            <p className="text-xl text-gray-300 mb-6">
              This is a sample of what you'll receive with our comprehensive analysis upgrade
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
                <span className="text-sm text-gray-400">Report Length</span>
                <p className="font-bold text-white">15+ Pages</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
                <span className="text-sm text-gray-400">Insights</span>
                <p className="font-bold text-white">50+ Data Points</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
                <span className="text-sm text-gray-400">Action Items</span>
                <p className="font-bold text-white">30+ Recommendations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="h-6 w-6 mr-3 text-gray-700" />
            Executive Summary
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Overall Performance</h3>
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-bold text-gray-900">{sampleData.overall}</span>
                <span className="text-xl text-gray-600 ml-2">/ 100</span>
              </div>
              <p className="text-gray-600">
                You're performing better than <span className="font-semibold text-gray-900">{sampleData.percentile}%</span> of 
                your peers in your age group and demographic.
              </p>
            </div>
            
            <div className="bg-gray-100 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Key Insight</h3>
              <p className="text-gray-700">
                Your strongest area is <span className="font-semibold">Physical Wellness</span>, where you rank in the 
                82nd percentile. This is a significant competitive advantage that you can leverage in other areas of your life.
              </p>
            </div>
          </div>

          <div className="border-l-4 border-gray-800 pl-4 py-2 bg-gray-50 rounded">
            <p className="text-gray-700">
              <span className="font-semibold">Bottom Line:</span> You have strong fundamentals with clear opportunities 
              for growth. Focus on your financial planning and social connections to unlock your full potential.
            </p>
          </div>
        </div>

        {/* Detailed Category Analysis */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Brain className="h-6 w-6 mr-3 text-gray-700" />
            Detailed Category Analysis
          </h2>

          <div className="space-y-6">
            {/* Financial Health */}
            <div className="border rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-gray-700 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Financial Health</h3>
                    <p className="text-gray-600">Score: {sampleData.categories.financial.score} | Percentile: {sampleData.categories.financial.percentile}th</p>
                  </div>
                </div>
                <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Growth Area
                </span>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Analysis</h4>
                <p className="text-gray-700">
                  Your financial health score indicates moderate stability with room for improvement. 
                  You're managing day-to-day expenses well but may lack long-term investment strategies 
                  and emergency fund planning.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Key Recommendations</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Build an emergency fund covering 6 months of expenses</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Increase retirement contributions by 2% annually</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Explore passive income opportunities aligned with your skills</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Physical Wellness */}
            <div className="border rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-gray-700 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Physical Wellness</h3>
                    <p className="text-gray-600">Score: {sampleData.categories.health.score} | Percentile: {sampleData.categories.health.percentile}th</p>
                  </div>
                </div>
                <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Top Strength
                </span>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Analysis</h4>
                <p className="text-gray-700">
                  Excellent performance in physical wellness! You're maintaining consistent exercise habits, 
                  good nutrition, and adequate sleep. This strong foundation positively impacts all other life areas.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Optimization Strategies</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Star className="h-5 w-5 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Consider adding meditation or mindfulness practices</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="h-5 w-5 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Track biomarkers quarterly for data-driven health optimization</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Peer Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Users className="h-6 w-6 mr-3 text-gray-700" />
            Peer Comparison Insights
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">You Excel At</h3>
              <ul className="space-y-3">
                <li className="flex items-center bg-gray-100 p-3 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-gray-700 mr-3" />
                  <span className="text-gray-700">Maintaining physical fitness (+15% vs peers)</span>
                </li>
                <li className="flex items-center bg-gray-100 p-3 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-gray-700 mr-3" />
                  <span className="text-gray-700">Work-life balance (+12% vs peers)</span>
                </li>
                <li className="flex items-center bg-gray-100 p-3 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-gray-700 mr-3" />
                  <span className="text-gray-700">Personal relationships (+8% vs peers)</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Focus Areas</h3>
              <ul className="space-y-3">
                <li className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <AlertCircle className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-gray-700">Investment diversification (-10% vs peers)</span>
                </li>
                <li className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <AlertCircle className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-gray-700">Professional networking (-8% vs peers)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Plan Preview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="h-6 w-6 mr-3 text-gray-700" />
            90-Day Action Plan (Preview)
          </h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-gray-400 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Days 1-30: Foundation Building</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• Set up automated savings for emergency fund</li>
                <li>• Schedule quarterly health checkups</li>
                <li>• Join one professional networking group</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-gray-600 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Days 31-60: Momentum Building</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• Increase investment contributions by 5%</li>
                <li>• Establish weekly social activities routine</li>
                <li>• Begin skill development in high-income area</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-gray-800 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Days 61-90: Optimization</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• Review and adjust strategies based on progress</li>
                <li>• Expand professional network connections</li>
                <li>• Implement advanced wellness practices</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sample Notice */}
        <div className="bg-gray-50 border-2 border-gray-300 rounded-2xl p-8 mb-8">
          <div className="flex items-start">
            <Lightbulb className="h-8 w-8 text-gray-700 mr-4 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">This is a Sample Report</h3>
              <p className="text-gray-700 mb-4">
                The actual Deep Analysis Report you'll receive will be completely personalized based on your 
                assessment results. It includes:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Your specific scores and percentile rankings
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Customized recommendations based on your situation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Detailed peer comparisons for your demographic
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Personalized 90-day action plan with weekly milestones
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <Award className="h-12 w-12 text-gray-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready for Your Personalized Deep Analysis?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Get your complete 15+ page report with detailed insights, peer comparisons, 
              and a customized 90-day action plan to transform your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/assessment"
                className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold"
              >
                Take Assessment First
                <ChevronRight className="h-5 w-5 ml-2" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
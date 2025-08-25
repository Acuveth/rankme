import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Target, Users, Brain, BarChart3, Shield, Heart, Zap, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              About RankMe
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe everyone deserves to understand where they stand and how to improve. 
              RankMe provides data-driven insights into your life performance across the dimensions that matter most.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-gray-700" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600">
                To democratize access to comprehensive life assessment and personalized improvement strategies, 
                helping millions of people achieve better outcomes across all areas of life.
              </p>
            </div>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Makes RankMe Different</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Unlike generic self-help or one-size-fits-all solutions, RankMe provides personalized, 
              data-driven insights based on your unique situation and peer comparisons.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Evidence-Based</h3>
              <p className="text-gray-600">
                Our assessment is grounded in psychological research and validated across thousands of users. 
                Every recommendation is backed by data, not opinion.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Peer-Calibrated</h3>
              <p className="text-gray-600">
                Your results are compared against people similar to you in age, background, and circumstances. 
                See where you truly stand, not where you think you stand.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered</h3>
              <p className="text-gray-600">
                Our AI coaching system adapts to your progress, providing personalized weekly plans 
                and daily motivation tailored to your specific goals and challenges.
              </p>
            </div>
          </div>
        </div>

        {/* The Four Dimensions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Four Life Dimensions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive assessment covers the key areas that research shows drive life satisfaction 
              and long-term success.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Financial Health</h3>
              <p className="text-sm text-gray-600">
                Income, savings, investments, and financial planning across 8 key metrics
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Physical Wellness</h3>
              <p className="text-sm text-gray-600">
                Fitness, nutrition, sleep, and overall health habits across 8 dimensions
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Social Network</h3>
              <p className="text-sm text-gray-600">
                Relationships, social connections, and network quality across 8 factors
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Personal Growth</h3>
              <p className="text-sm text-gray-600">
                Career satisfaction, goals, learning, and life fulfillment across 8 areas
              </p>
            </div>
          </div>
        </div>

        {/* Our Approach */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Approach</h2>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Comprehensive Assessment</h3>
                  <p className="text-gray-600">
                    Our 32-question assessment covers all major life dimensions. Unlike surface-level surveys, 
                    we dig deep into the specific behaviors and circumstances that drive results.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Data-Driven Insights</h3>
                  <p className="text-gray-600">
                    Your responses are analyzed against our database of over 10,000 assessments, 
                    providing accurate percentile rankings and identifying your top strengths and opportunities.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Action Plans</h3>
                  <p className="text-gray-600">
                    Based on your specific results, we generate customized 30-day action plans with 
                    prioritized steps that deliver the highest impact for your unique situation.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ongoing Support</h3>
                  <p className="text-gray-600">
                    Our AI coaching system provides daily check-ins, weekly plan updates, and continuous 
                    motivation to help you stay on track and achieve lasting change.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-gray-700" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy & Security First</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Your personal information and assessment results are treated with the highest level of security and privacy.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-2">No Data Selling</h3>
              <p className="text-sm text-gray-600">
                We never sell your personal information or assessment results to third parties. Your data is yours.
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-2">Encrypted Storage</h3>
              <p className="text-sm text-gray-600">
                All data is encrypted both in transit and at rest using industry-standard security protocols.
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-2">Anonymous Analytics</h3>
              <p className="text-sm text-gray-600">
                When we use data for research, it's completely anonymized with no personal identifiers.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-gray-200">
              Join the growing community of people using data-driven insights to improve their lives
            </p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-gray-200">Assessments Completed</div>
            </div>
            
            <div>
              <div className="text-4xl font-bold mb-2">4.8/5</div>
              <div className="text-gray-200">Average User Rating</div>
            </div>
            
            <div>
              <div className="text-4xl font-bold mb-2">32</div>
              <div className="text-gray-200">Data Points Analyzed</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">
              Take the first step toward a better life with our comprehensive assessment.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold"
            >
              <Award className="h-5 w-5 mr-2" />
              Take Free Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
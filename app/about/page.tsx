'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Target, Users, Brain, BarChart3, Shield, Heart, Zap, Award } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSelector from '@/components/LanguageSelector'

export default function AboutPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <Link 
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('about.backToHome')}
            </Link>
            <LanguageSelector />
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {t('about.aboutRankMe')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.aboutSubtitle')}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.ourMission')}</h2>
              <p className="text-lg text-gray-600">
                {t('about.ourMissionDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.whatMakesUsDifferent')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about.whatMakesUsDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.evidenceBased')}</h3>
              <p className="text-gray-600">
                {t('about.evidenceBasedDesc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.peerCalibrated')}</h3>
              <p className="text-gray-600">
                {t('about.peerCalibratedDesc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.aiPowered')}</h3>
              <p className="text-gray-600">
                {t('about.aiPoweredDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* The Four Dimensions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.fourLifeDimensions')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about.fourDimensionsDesc')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t('about.financialHealthDim')}</h3>
              <p className="text-sm text-gray-600">
                {t('about.financialHealthDimDesc')}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t('about.physicalWellnessDim')}</h3>
              <p className="text-sm text-gray-600">
                {t('about.physicalWellnessDimDesc')}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t('about.socialNetworkDim')}</h3>
              <p className="text-sm text-gray-600">
                {t('about.socialNetworkDimDesc')}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{t('about.personalGrowthDim')}</h3>
              <p className="text-sm text-gray-600">
                {t('about.personalGrowthDimDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Our Approach */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('about.ourApproach')}</h2>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('about.comprehensiveAssessmentStep')}</h3>
                  <p className="text-gray-600">
                    {t('about.comprehensiveAssessmentDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('about.dataDrivenInsights')}</h3>
                  <p className="text-gray-600">
                    {t('about.dataDrivenInsightsDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('about.personalizedActionPlans')}</h3>
                  <p className="text-gray-600">
                    {t('about.personalizedActionPlansDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('about.ongoingSupport')}</h3>
                  <p className="text-gray-600">
                    {t('about.ongoingSupportDesc')}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.privacySecurityFirst')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              {t('about.privacySecurityDesc')}
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-2">{t('about.noDataSelling')}</h3>
              <p className="text-sm text-gray-600">
                {t('about.noDataSellingDesc')}
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-2">{t('about.encryptedStorage')}</h3>
              <p className="text-sm text-gray-600">
                {t('about.encryptedStorageDesc')}
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="font-bold text-gray-900 mb-2">{t('about.anonymousAnalytics')}</h3>
              <p className="text-sm text-gray-600">
                {t('about.anonymousAnalyticsDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">{t('about.trustedByThousands')}</h2>
            <p className="text-gray-200">
              {t('about.trustedDesc')}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-gray-200">{t('about.assessmentsCompleted')}</div>
            </div>
            
            <div>
              <div className="text-4xl font-bold mb-2">4.8/5</div>
              <div className="text-gray-200">{t('about.averageUserRating')}</div>
            </div>
            
            <div>
              <div className="text-4xl font-bold mb-2">32</div>
              <div className="text-gray-200">{t('about.dataPointsAnalyzed')}</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.readyToGetStarted')}</h2>
            <p className="text-gray-600 mb-6">
              {t('about.takeFirstStep')}
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold"
            >
              <Award className="h-5 w-5 mr-2" />
              {t('about.takeAssessment')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
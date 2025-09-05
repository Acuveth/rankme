'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Star, Zap, FileText, MessageSquare, TrendingUp, Shield, Award } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSelector from '@/components/LanguageSelector'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <Link 
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('pricing.backToHome')}
            </Link>
            <LanguageSelector />
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {t('pricing.pageTitle')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {t('pricing.pageSubtitle')}
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
                {t('pricing.monthly')}
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('pricing.yearly')}
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
                <Award className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('pricing.freeAssessment')}</h3>
              <p className="text-gray-600">{t('pricing.freeAssessmentDesc')}</p>
            </div>

            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gray-900 mb-2">{t('pricing.freePrice')}</div>
              <p className="text-gray-600">{t('pricing.alwaysFree')}</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-gray-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{t('pricing.freeFeature1')}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-gray-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{t('pricing.freeFeature2')}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-gray-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{t('pricing.freeFeature3')}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-gray-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{t('pricing.freeFeature4')}</span>
              </div>
            </div>

            <Link
              href="/assessment"
              className="w-full flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            >
              {t('pricing.startFreeAssessment')}
            </Link>
          </div>

          {/* Deep Report */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gray-900 text-white px-4 py-1 rounded-full text-xs font-semibold">
                {t('pricing.mostPopular')}
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('pricing.deepAnalysisReport')}</h3>
              <p className="text-gray-600">{t('pricing.deepAnalysisDesc')}</p>
            </div>

            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gray-900 mb-2">{t('pricing.deepPrice')}</div>
              <p className="text-gray-600">{t('pricing.oneTimePurchase')}</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-gray-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{t('pricing.deepFeature1')}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-gray-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{t('pricing.deepFeature2')}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-gray-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{t('pricing.deepFeature3')}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-gray-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{t('pricing.deepFeature4')}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-gray-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{t('pricing.deepFeature5')}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-gray-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{t('pricing.deepFeature6')}</span>
              </div>
            </div>

            <Link
              href="/assessment?product=report"
              className="w-full flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold"
            >
              {t('pricing.getDeepAnalysis')}
            </Link>
          </div>

          {/* AI Coach */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 relative">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('pricing.aiLifeCoach')}</h3>
              <p className="text-gray-600">{t('pricing.aiCoachDesc')}</p>
            </div>

            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {billingCycle === 'monthly' ? t('pricing.monthlyPrice') : t('pricing.yearlyPrice')}
              </div>
              <p className="text-gray-600">
                {t('pricing.perMonth')}{billingCycle === 'yearly' && t('pricing.billedYearly')}
              </p>
              {billingCycle === 'yearly' && (
                <p className="text-green-600 text-sm font-semibold mt-1">{t('pricing.savePerYear')}</p>
              )}
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-gray-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{t('pricing.aiCoachFeature1')}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-gray-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{t('pricing.aiCoachFeature2')}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-gray-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{t('pricing.aiCoachFeature3')}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-gray-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{t('pricing.aiCoachFeature4')}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-gray-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{t('pricing.aiCoachFeature5')}</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-gray-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{t('pricing.aiCoachFeature6')}</span>
              </div>
            </div>

            <Link
              href="/assessment?product=coach"
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all font-semibold"
            >
              {t('pricing.startFreeTrial')}
            </Link>
            <p className="text-xs text-center text-gray-500 mt-3">{t('pricing.sevenDaysFree')}</p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('pricing.featureComparison')}</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">{t('pricing.features')}</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">{t('pricing.free')}</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">{t('pricing.deepReport')}</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">{t('pricing.aiCoach')}</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">{t('pricing.feature32Question')}</td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">{t('pricing.featureBasicRankings')}</td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">{t('pricing.featureDetailedAnalysis')}</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">{t('pricing.feature30DayPlan')}</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">{t('pricing.featurePdfDownload')}</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">{t('pricing.featureWeeklyPlans')}</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6 text-gray-700">{t('pricing.featureDailyCheckins')}</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6 text-gray-400">-</td>
                    <td className="text-center py-4 px-6"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700">{t('pricing.featureProgressTracking')}</td>
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
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{t('pricing.thirtyDayGuarantee')}</h3>
            <p className="text-sm text-gray-600">
              {t('pricing.guaranteeDesc')}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{t('pricing.rating')}</h3>
            <p className="text-sm text-gray-600">
              {t('pricing.ratingDesc')}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{t('pricing.instantAccess')}</h3>
            <p className="text-sm text-gray-600">
              {t('pricing.instantAccessDesc')}
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('pricing.faqTitle')}</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">{t('pricing.faq1Question')}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('pricing.faq1Answer')}
              </p>

              <h3 className="font-bold text-gray-900 mb-3">{t('pricing.faq2Question')}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('pricing.faq2Answer')}
              </p>

              <h3 className="font-bold text-gray-900 mb-3">{t('pricing.faq3Question')}</h3>
              <p className="text-gray-600 text-sm">
                {t('pricing.faq3Answer')}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">{t('pricing.faq4Question')}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('pricing.faq4Answer')}
              </p>

              <h3 className="font-bold text-gray-900 mb-3">{t('pricing.faq5Question')}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('pricing.faq5Answer')}
              </p>

              <h3 className="font-bold text-gray-900 mb-3">{t('pricing.faq6Question')}</h3>
              <p className="text-gray-600 text-sm">
                {t('pricing.faq6Answer')}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">{t('pricing.ctaTitle')}</h2>
            <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
              {t('pricing.ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/assessment"
                className="px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all font-semibold"
              >
                {t('pricing.ctaStartAssessment')}
              </Link>
              <Link
                href="/sample-report"
                className="inline-block px-8 py-4 border border-white/30 text-white rounded-xl hover:bg-white/10 transition-all font-semibold"
              >
                {t('pricing.ctaViewSample')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
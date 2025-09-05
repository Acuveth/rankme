'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, TrendingUp, Users, Heart, DollarSign, Star, Shield, Zap, User, LogOut } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSelector from '@/components/LanguageSelector'

export default function LandingPage() {
  const { data: session } = useSession()
  const { t } = useLanguage()
  const getFeatures = () => [
    { icon: DollarSign, title: t('home.financialHealth'), description: t('home.financialHealthDesc') },
    { icon: Heart, title: t('home.physicalWellness'), description: t('home.physicalWellnessDesc') },
    { icon: Users, title: t('home.socialNetwork'), description: t('home.socialNetworkDesc') },
    { icon: TrendingUp, title: t('home.personalGrowth'), description: t('home.personalGrowthDesc') },
  ]

  const getBenefits = () => [
    t('home.comprehensiveAssessment'),
    t('home.instantRankings'),
    t('home.professionalScorecard'),
    t('home.personalizedInsights')
  ]

  const getSocialProof = () => [
    { metric: '10,000+', label: t('home.assessmentsTaken') },
    { metric: '4.8/5', label: t('home.userRating') },
    { metric: '92%', label: t('home.completionRate') },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">{t('home.title')}</h1>
              <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">{t('home.beta')}</span>
            </div>
            <div className="hidden sm:flex items-center space-x-6">
              <LanguageSelector />
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('home.about')}
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('home.pricing')}
              </Link>
              {session ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/dashboard"
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <User className="h-4 w-4 mr-1" />
                    {t('home.dashboard')}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    {t('header.signOut')}
                  </button>
                  <Link
                    href="/assessment"
                    className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all shadow-sm"
                  >
                    {t('home.newAssessment')}
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/auth/signin"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {t('home.signIn')}
                  </Link>
                  <Link
                    href="/assessment"
                    className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all shadow-sm"
                  >
                    {t('home.tryFree')}
                  </Link>
                </div>
              )}
            </div>
            <div className="sm:hidden">
              <Link
                href="/assessment"
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm"
              >
                {t('home.start')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 animate-slide-in">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('home.heroTitle1')}
            <span className="gradient-text block mt-2">{t('home.heroTitle2')}</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('home.heroSubtitle')}
          </p>
          
          {/* Social Proof */}
          <div className="flex justify-center items-center space-x-8 mb-10">
            {getSocialProof().map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{item.metric}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>

          <Link
            href="/assessment"
            className="inline-flex items-center bg-gray-900 text-white text-lg px-8 py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 group"
          >
            {t('home.tryFree')}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            {t('home.noSignupRequired')}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('home.fourKeyDimensions')}
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.assessmentEvaluatesDesc')}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {getFeatures().map((feature, index) => (
              <div key={index} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all animate-fade-scale border border-gray-100">
                <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-gray-700" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                {t('home.whatYoullGet')}
              </h3>
              <ul className="space-y-4 mb-8">
                {getBenefits().map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-gray-600 mr-4 flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/assessment"
                className="inline-flex items-center bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all"
              >
                {t('home.getStarted')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
              <div className="flex items-center mb-6">
                <Star className="h-6 w-6 text-white mr-2" />
                <h4 className="text-xl font-semibold">{t('home.premiumFeatures')}</h4>
              </div>
              
              <div className="space-y-4">
                <div className="border-b border-gray-700 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t('home.freeAssessment')}</span>
                    <span className="text-sm text-gray-300">$0</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{t('home.freeAssessmentDesc')}</p>
                </div>
                
                <div className="border-b border-gray-700 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t('home.deepAnalysis')}</span>
                    <span className="text-sm text-gray-300">$29</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{t('home.deepAnalysisDesc')}</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t('home.aiLifeCoach')}</span>
                    <span className="text-sm text-gray-300">$19/mo</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{t('home.aiLifeCoachDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <Shield className="h-12 w-12 text-gray-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {t('home.yourPrivacyMatters')}
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('home.privacyDescription')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-gray-700">{t('home.instantResults')}</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-gray-700">{t('home.privacyFirst')}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-gray-700">{t('home.noSpam')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {t('home.readyToDiscover')}
          </h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('home.joinThousands')}
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center bg-white text-gray-900 text-lg px-8 py-4 rounded-xl hover:bg-gray-100 transition-all shadow-lg font-semibold"
          >
            {t('home.startYourAssessment')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <h4 className="text-xl font-bold text-gray-900">{t('home.title')}</h4>
              <p className="text-gray-500 text-sm">{t('home.platformDesc')}</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-700 transition-colors">
                {t('home.privacy')}
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-700 transition-colors">
                {t('home.terms')}
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-700 transition-colors">
                {t('home.contact')}
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              {t('home.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
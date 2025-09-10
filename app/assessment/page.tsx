'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import questions from '@/data/questions.json'
import categories from '@/data/categories.json'
import countries from '@/data/countries.json'
import { ChevronLeft, ChevronRight, Check, User, Globe, Calendar } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSelector from '@/components/LanguageSelector'
import { getTranslatedQuestion } from '@/lib/question-translations'

interface CohortData {
  age: number
  country: string
  sexGender: string
}

interface Answers {
  [key: string]: any
}

export default function AssessmentPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const { t, language } = useLanguage()
  const [step, setStep] = useState<'cohort' | 'questions' | 'review'>('cohort')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [activeQuestions, setActiveQuestions] = useState<any[]>([])
  const [showCategoryIntro, setShowCategoryIntro] = useState(false)
  const [currentCategory, setCurrentCategory] = useState('')
  const [cohortData, setCohortData] = useState<CohortData>({
    age: 0,
    country: '',
    sexGender: ''
  })
  const [answers, setAnswers] = useState<Answers>({})
  const [assessmentId, setAssessmentId] = useState<string>('')

  const questionList = questions.questions

  // Helper function to get translated category content
  const getCategoryTranslations = (categoryId: string) => {
    const translations: { [key: string]: { name: string; introduction: string; description: string } } = {
      financial: {
        name: t('assessment.financialHealthName'),
        introduction: t('assessment.financialHealthIntroduction'),
        description: t('assessment.financialHealthDescription')
      },
      health_fitness: {
        name: t('assessment.physicalWellnessName'),
        introduction: t('assessment.physicalWellnessIntroduction'),
        description: t('assessment.physicalWellnessDescription')
      },
      social: {
        name: t('assessment.socialNetworkName'),
        introduction: t('assessment.socialNetworkIntroduction'),
        description: t('assessment.socialNetworkDescription')
      },
      romantic: {
        name: t('assessment.romanticName'),
        introduction: t('assessment.romanticIntroduction'),
        description: t('assessment.romanticDescription')
      },
      career: {
        name: t('assessment.careerDevelopmentName'),
        introduction: t('assessment.careerDevelopmentIntroduction'),
        description: t('assessment.careerDevelopmentDescription')
      },
      personal_growth: {
        name: t('assessment.personalGrowthName'),
        introduction: t('assessment.personalGrowthIntroduction'),
        description: t('assessment.personalGrowthDescription')
      }
    }
    return translations[categoryId] || { name: categoryId, introduction: '', description: '' }
  }
  
  // Generate adaptive question list based on answers
  const generateAdaptiveQuestions = (allAnswers: Answers) => {
    const adaptiveQuestions: any[] = []
    const categoryOrder = ['financial', 'health_fitness', 'social', 'romantic', 'career', 'personal_growth']
    
    for (const categoryId of categoryOrder) {
      const category = categories.categories[categoryId]
      if (!category) continue
      
      // Always include core questions
      for (const questionId of category.coreQuestions) {
        const question = questionList.find(q => q.id === questionId)
        if (question) adaptiveQuestions.push({...question, isCore: true, categoryIntro: adaptiveQuestions.filter(q => q.category === categoryId).length === 0})
      }
      
      // Add adaptive questions based on conditions and priority
      for (const questionId of category.adaptiveQuestions) {
        const question = questionList.find(q => q.id === questionId)
        if (!question) continue
        
        let shouldSkip = false
        const skipCondition = category.skipConditions?.[questionId]
        
        if (skipCondition && allAnswers[skipCondition.if]) {
          const conditionQuestionId = Object.keys(skipCondition.if)[0]
          const conditionValues = skipCondition.if[conditionQuestionId]
          const userAnswer = allAnswers[conditionQuestionId]
          
          if (userAnswer !== undefined && conditionValues.includes(userAnswer.toString())) {
            shouldSkip = true
          }
        }
        
        // Skip low priority questions if we're over the target length
        if (category.priority === 'low' && adaptiveQuestions.length > categories.adaptiveLogic.maxQuestions * 0.8) {
          shouldSkip = true
        }
        
        if (!shouldSkip) {
          adaptiveQuestions.push({...question, isCore: false})
        }
      }
    }
    
    return adaptiveQuestions.slice(0, categories.adaptiveLogic.maxQuestions)
  }

  const handleCohortSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Creating assessment with cohort data:', cohortData)
    
    const response = await fetch('/api/assessment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cohortData)
    })
    
    if (!response.ok) {
      console.error('Failed to create assessment:', response.status, response.statusText)
      return
    }
    
    const data = await response.json()
    console.log('Assessment created with ID:', data.assessmentId)
    setAssessmentId(data.assessmentId)
    
    // If user is logged in, immediately connect the assessment
    if (session?.user) {
      try {
        await fetch('/api/assessment/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assessmentId: data.assessmentId })
        })
      } catch (error) {
        console.error('Failed to connect assessment to user:', error)
      }
    }
    
    // Initialize with all questions for now, will adapt as user answers
    const initialQuestions = generateAdaptiveQuestions({})
    setActiveQuestions(initialQuestions)
    setCurrentCategory(initialQuestions[0]?.category || '')
    setShowCategoryIntro(true)
    setStep('questions')
  }

  const handleAnswer = (value: any) => {
    const question = activeQuestions[currentQuestion]
    setAnswers({ ...answers, [question.id]: value })
  }

  const handleNext = async () => {
    if (showCategoryIntro) {
      setShowCategoryIntro(false)
      return
    }
    
    if (currentQuestion < activeQuestions.length - 1) {
      const nextQuestion = currentQuestion + 1
      setCurrentQuestion(nextQuestion)
      
      // Check if we're entering a new category
      const currentCat = activeQuestions[currentQuestion]?.category
      const nextCat = activeQuestions[nextQuestion]?.category
      
      if (currentCat !== nextCat) {
        setCurrentCategory(nextCat)
        setShowCategoryIntro(true)
      }
      
      // Regenerate adaptive questions based on current answers
      const updatedQuestions = generateAdaptiveQuestions(answers)
      if (updatedQuestions.length !== activeQuestions.length) {
        setActiveQuestions(updatedQuestions)
      }
    } else {
      try {
        await saveAnswers()
        // Skip review step and go directly to scoring and scorecard
        await handleSubmit()
      } catch (error) {
        console.error('Failed to complete assessment:', error)
      }
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const saveAnswers = async () => {
    try {
      console.log('Saving answers for assessment:', assessmentId)
      console.log('Answers to save:', answers)
      
      const response = await fetch('/api/assessment/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId,
          answers: Object.entries(answers).map(([questionId, value]) => ({
            questionId,
            value
          }))
        })
      })
      
      if (!response.ok) {
        console.error('Failed to save answers:', response.status, response.statusText)
        const errorData = await response.json()
        console.error('Save answers error:', errorData)
        throw new Error('Failed to save answers')
      }
      
      console.log('Answers saved successfully')
    } catch (error) {
      console.error('Error saving answers:', error)
      alert('Failed to save answers. Please try again.')
      throw error
    }
  }

  const handleSubmit = async () => {
    try {
      console.log('Submitting assessment with ID:', assessmentId)
      console.log('Current answers:', answers)
      
      const response = await fetch('/api/assessment/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId })
      })
      
      console.log('Score response status:', response.status)
      
      if (response.ok) {
        console.log('Assessment scored successfully, redirecting to scorecard...')
        const product = searchParams.get('product')
        
        if (product === 'report') {
          router.push(`/paywall/report/${assessmentId}`)
        } else if (product === 'coach') {
          router.push(`/paywall/coach/${assessmentId}`)
        } else {
          console.log('Redirecting to scorecard:', `/scorecard/${assessmentId}`)
          router.push(`/scorecard/${assessmentId}`)
        }
      } else {
        console.error('Error scoring assessment:', response.status, response.statusText)
        const errorData = await response.json()
        console.error('Error details:', errorData)
        alert('Failed to score assessment. Please try again.')
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const progress = activeQuestions.length > 0 ? ((currentQuestion + 1) / activeQuestions.length) * 100 : 0

  if (step === 'cohort') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md animate-fade-scale">
          {/* Language Selector */}
          <div className="flex justify-end mb-4">
            <LanguageSelector />
          </div>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-gray-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {t('assessment.letsGetStarted')}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {t('assessment.basicInformationDesc')}
            </p>
          </div>

          <form onSubmit={handleCohortSubmit} className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                {t('assessment.age')}
              </label>
              <input
                type="number"
                min="18"
                max="100"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                value={cohortData.age || ''}
                onChange={(e) => setCohortData({ ...cohortData, age: parseInt(e.target.value) })}
                placeholder={t('assessment.enterYourAge')}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                <Globe className="h-4 w-4 mr-2" />
                {t('assessment.country')}
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                value={cohortData.country}
                onChange={(e) => setCohortData({ ...cohortData, country: e.target.value })}
              >
                <option value="">{t('assessment.selectYourCountry')}</option>
                {countries.countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                <User className="h-4 w-4 mr-2" />
                {t('assessment.gender')}
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                value={cohortData.sexGender}
                onChange={(e) => setCohortData({ ...cohortData, sexGender: e.target.value })}
              >
                <option value="">{t('assessment.selectGender')}</option>
                <option value="Male">{t('assessment.male')}</option>
                <option value="Female">{t('assessment.female')}</option>
                <option value="Other">{t('assessment.other')}</option>
                <option value="PNTS">{t('assessment.preferNotToSay')}</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-4 rounded-xl hover:bg-gray-800 transition-all font-semibold text-lg shadow-sm"
            >
              {t('assessment.startAssessment')}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            {t('assessment.informationConfidential')}
          </p>
        </div>
      </div>
    )
  }

  if (step === 'questions') {
    // Show category introduction
    if (showCategoryIntro) {
      const categoryTranslations = getCategoryTranslations(currentCategory)
      const categoryColors: { [key: string]: string } = {
        financial: 'bg-gray-800 text-white',
        health_fitness: 'bg-gray-700 text-white',
        social: 'bg-gray-600 text-white',
        romantic: 'bg-gray-500 text-white',
        career: 'bg-gray-600 text-white',
        personal_growth: 'bg-gray-500 text-white'
      }
      
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-2xl animate-fade-scale">
            {/* Language Selector */}
            <div className="flex justify-end mb-4">
              <LanguageSelector />
            </div>
            
            {/* Progress */}
            <div className="mb-8">
              <div className="text-sm font-medium text-gray-600 mb-2">
                {Math.round(progress)}% {t('assessment.complete')}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-gray-700 to-gray-900 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            {/* Category Introduction */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold mb-4 ${categoryColors[currentCategory]}`}>
                {categoryTranslations.name}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {categoryTranslations.introduction}
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                {categoryTranslations.description}
              </p>
            </div>
            
            {/* Continue Button */}
            <div className="flex justify-center">
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold shadow-sm"
              >
                {t('assessment.continueToQuestions')}
              </button>
            </div>
          </div>
        </div>
      )
    }
    
    const question = activeQuestions[currentQuestion]
    if (!question) return null

    // Get translated question content
    const translatedQuestion = getTranslatedQuestion(question.id, language)
    const questionLabel = translatedQuestion?.label || question.label
    const questionDescription = translatedQuestion?.description || question.description
    const questionOptions = translatedQuestion?.options || question.options
    
    const categoryColors: { [key: string]: string } = {
      financial: 'bg-gray-800 text-white',
      health_fitness: 'bg-gray-700 text-white',
      social: 'bg-gray-600 text-white',
      romantic: 'bg-gray-500 text-white',
      career: 'bg-gray-600 text-white',
      personal_growth: 'bg-gray-500 text-white'
    }

    const categoryNames: { [key: string]: string } = {
      financial: t('assessment.financial'),
      health_fitness: t('assessment.healthFitness'),
      social: t('assessment.social'),
      romantic: t('assessment.personal'),
      career: 'Career',
      personal_growth: 'Personal Growth'
    }


    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-2xl animate-fade-scale">
          {/* Language Selector */}
          <div className="flex justify-end mb-4">
            <LanguageSelector />
          </div>
          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
              <span className="text-sm font-medium text-gray-600 mb-2 sm:mb-0">
                {t('assessment.question')} {currentQuestion + 1} {t('assessment.of')} {activeQuestions.length}
                {question.isCore && <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Core</span>}
              </span>
              <span className={`px-4 py-1 rounded-full text-xs font-bold ${categoryColors[question.category]} w-fit`}>
                {categoryNames[question.category]}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div
                className="bg-gradient-to-r from-gray-700 to-gray-900 h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-800">
                  {Math.round(progress)}% {t('assessment.complete')}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {progress < 25 ? t('assessment.justGettingStarted') :
                 progress < 50 ? t('assessment.makingGreatProgress') :
                 progress < 75 ? t('assessment.halfwayThere') :
                 progress < 90 ? t('assessment.almostFinished') :
                 t('assessment.justAFewMore')}
              </div>
            </div>
          </div>

          {/* Question Section */}
          <div className="mb-8">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 leading-relaxed">
              {questionLabel}
            </h3>
            
            {questionDescription && (
              <p className="text-sm text-gray-600 mb-6 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {questionDescription}
              </p>
            )}
            
            {(question.type === 'single' || question.type === 'likert') && questionOptions && (
              <div className="space-y-3">
                {questionOptions.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                      answers[question.id] === index
                        ? 'border-gray-900 bg-gray-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex-shrink-0 ${
                        answers[question.id] === index
                          ? 'border-gray-900 bg-gray-900'
                          : 'border-gray-300'
                      }`}>
                        {answers[question.id] === index && (
                          <Check className="w-3 h-3 text-white mx-auto mt-0.5" />
                        )}
                      </div>
                      <span className={`text-sm sm:text-base leading-relaxed ${
                        answers[question.id] === index ? 'font-medium text-gray-900' : 'text-gray-700'
                      }`}>
                        {option}
                      </span>
                    </div>
                  </button>
                ))}
                
                {question.pnts && (
                  <button
                    onClick={() => handleAnswer('PNTS')}
                    className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                      answers[question.id] === 'PNTS'
                        ? 'border-gray-400 bg-gray-100'
                        : 'border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex-shrink-0 ${
                        answers[question.id] === 'PNTS'
                          ? 'border-gray-400 bg-gray-400'
                          : 'border-gray-300'
                      }`}>
                        {answers[question.id] === 'PNTS' && (
                          <Check className="w-3 h-3 text-white mx-auto mt-0.5" />
                        )}
                      </div>
                      <span className="text-sm italic">{t('assessment.preferNotToSay')}</span>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">{t('assessment.back')}</span>
            </button>
            
            <button
              onClick={handleNext}
              disabled={answers[question.id] === undefined}
              className="flex items-center px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none font-semibold"
            >
              <span className="mr-2">
                {currentQuestion === activeQuestions.length - 1 ? t('finish') : t('assessment.next')}
              </span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'review') {
    const categoryCounts = questionList.reduce((acc, q) => {
      acc[q.category] = (acc[q.category] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    const answeredCounts = questionList.reduce((acc, q) => {
      if (answers[q.id] !== undefined) {
        acc[q.category] = (acc[q.category] || 0) + 1
      }
      return acc
    }, {} as { [key: string]: number })

    const categoryNames: { [key: string]: string } = {
      financial: t('assessment.financialHealth'),
      health_fitness: t('assessment.physicalWellness'),
      social: t('assessment.socialNetwork'), 
      romantic: t('assessment.personalGrowthCategory')
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-2xl animate-fade-scale">
          {/* Language Selector */}
          <div className="flex justify-end mb-4">
            <LanguageSelector />
          </div>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-gray-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {t('assessment.reviewYourAssessment')}
            </h2>
            <p className="text-gray-600">
              {t('assessment.checkResponsesDesc')}
            </p>
          </div>
          
          <div className="space-y-4 mb-8">
            {Object.entries(categoryCounts).map(([category, total]) => (
              <div key={category} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-900">
                  {categoryNames[category]}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {answeredCounts[category] || 0} / {total}
                  </span>
                  {(answeredCounts[category] || 0) === total ? (
                    <Check className="h-4 w-4 text-gray-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setStep('questions')}
              className="flex-1 px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              {t('assessment.editAnswers')}
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold shadow-sm"
            >
              {t('assessment.getMyResults')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import questions from '@/data/questions.json'
import { ChevronLeft, ChevronRight, Check, User, Globe, Calendar } from 'lucide-react'

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
  const [step, setStep] = useState<'cohort' | 'questions' | 'review'>('cohort')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [cohortData, setCohortData] = useState<CohortData>({
    age: 0,
    country: '',
    sexGender: ''
  })
  const [answers, setAnswers] = useState<Answers>({})
  const [assessmentId, setAssessmentId] = useState<string>('')

  const questionList = questions.questions

  const handleCohortSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const response = await fetch('/api/assessment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cohortData)
    })
    
    const data = await response.json()
    setAssessmentId(data.assessmentId)
    setStep('questions')
  }

  const handleAnswer = (value: any) => {
    const question = questionList[currentQuestion]
    setAnswers({ ...answers, [question.id]: value })
  }

  const handleNext = async () => {
    if (currentQuestion < questionList.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      await saveAnswers()
      setStep('review')
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const saveAnswers = async () => {
    await fetch('/api/assessment/answers', {
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
  }

  const handleSubmit = async () => {
    const response = await fetch('/api/assessment/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessmentId })
    })
    
    if (response.ok) {
      router.push(`/scorecard/${assessmentId}`)
    }
  }

  const progress = ((currentQuestion + 1) / questionList.length) * 100

  if (step === 'cohort') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md animate-fade-scale">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-gray-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Let's Get Started
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              First, we need some basic information to compare you with your peers.
            </p>
          </div>

          <form onSubmit={handleCohortSubmit} className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                Age
              </label>
              <input
                type="number"
                min="18"
                max="100"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                value={cohortData.age || ''}
                onChange={(e) => setCohortData({ ...cohortData, age: parseInt(e.target.value) })}
                placeholder="Enter your age"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                <Globe className="h-4 w-4 mr-2" />
                Country
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white"
                value={cohortData.country}
                onChange={(e) => setCohortData({ ...cohortData, country: e.target.value })}
              >
                <option value="">Select your country</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                <User className="h-4 w-4 mr-2" />
                Gender
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white"
                value={cohortData.sexGender}
                onChange={(e) => setCohortData({ ...cohortData, sexGender: e.target.value })}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="PNTS">Prefer not to say</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-4 rounded-xl hover:bg-gray-800 transition-all font-semibold text-lg shadow-sm"
            >
              Start Assessment
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Your information is kept completely confidential
          </p>
        </div>
      </div>
    )
  }

  if (step === 'questions') {
    const question = questionList[currentQuestion]
    const categoryColors: { [key: string]: string } = {
      financial: 'bg-gray-800 text-white',
      health_fitness: 'bg-gray-700 text-white',
      social: 'bg-gray-600 text-white',
      romantic: 'bg-gray-500 text-white'
    }

    const categoryNames: { [key: string]: string } = {
      financial: 'Financial',
      health_fitness: 'Health & Fitness',
      social: 'Social',
      romantic: 'Personal'
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-2xl animate-fade-scale">
          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
              <span className="text-sm font-medium text-gray-600 mb-2 sm:mb-0">
                Question {currentQuestion + 1} of {questionList.length}
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
                  {Math.round(progress)}% Complete
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {progress < 25 ? "Just getting started..." :
                 progress < 50 ? "Making great progress!" :
                 progress < 75 ? "You're halfway there!" :
                 progress < 90 ? "Almost finished!" :
                 "Just a few more!"}
              </div>
            </div>
          </div>

          {/* Question Section */}
          <div className="mb-8">
            <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 leading-relaxed">
              {question.label}
            </h3>
            
            {(question.type === 'single' || question.type === 'likert') && question.options && (
              <div className="space-y-3">
                {question.options.map((option: string, index: number) => (
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
                      <span className="text-sm italic">Prefer not to say</span>
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
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <button
              onClick={handleNext}
              disabled={answers[question.id] === undefined}
              className="flex items-center px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none font-semibold"
            >
              <span className="mr-2">
                {currentQuestion === questionList.length - 1 ? 'Review' : 'Next'}
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
      financial: 'Financial Health',
      health_fitness: 'Physical Wellness',
      social: 'Social Network', 
      romantic: 'Personal Growth'
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-2xl animate-fade-scale">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-gray-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Review Your Assessment
            </h2>
            <p className="text-gray-600">
              Check your responses before getting your life score
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
                    <Check className="h-4 w-4 text-green-600" />
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
              Edit Answers
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold shadow-sm"
            >
              Get My Results
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, FileText, Sparkles } from 'lucide-react'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [purchaseInfo, setPurchaseInfo] = useState<any>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (sessionId) {
      verifyPurchase(sessionId)
      
      // Fallback: If we still don't have purchase info after 3 seconds, 
      // check if this is likely an AI coach purchase and redirect anyway
      setTimeout(() => {
        if (!purchaseInfo && sessionId) {
          console.log('Fallback: No purchase info after 3 seconds, checking stored data...')
          // Check if we can determine the product from session storage
          const assessmentId = localStorage.getItem('lastAssessmentId')
          const productType = localStorage.getItem('lastProductType')
          
          if (assessmentId && productType === 'ai_coach_monthly') {
            console.log('Fallback redirect to coach with stored assessmentId:', assessmentId)
            router.push(`/coach/${assessmentId}`)
          } else if (assessmentId && productType === 'deep_report_oneoff') {
            console.log('Fallback redirect to deep report with stored assessmentId:', assessmentId)
            router.push(`/report/${assessmentId}`)
          } else if (assessmentId) {
            console.log('Fallback redirect to scorecard with assessmentId:', assessmentId)
            router.push(`/scorecard/${assessmentId}`)
          }
        }
      }, 3000)
    }
  }, [searchParams, purchaseInfo])

  const verifyPurchase = async (sessionId: string) => {
    try {
      console.log('Verifying purchase for session:', sessionId)
      const response = await fetch('/api/verify-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Purchase verified:', data)
        setPurchaseInfo(data)
        setLoading(false)
        
        // Auto-redirect based on product type after a short delay
        if (data.product === 'ai_coach_monthly') {
          console.log('✅ AI Coach purchase detected!')
          console.log('📍 Assessment ID:', data.assessmentId)
          console.log('🚀 Redirecting to coach onboarding in 1.5 seconds...')
          setTimeout(() => {
            const coachUrl = `/coach/${data.assessmentId}`
            console.log('🎯 Redirecting to:', coachUrl)
            router.push(coachUrl)
          }, 1500)
        } else if (data.product === 'deep_report_oneoff') {
          console.log('✅ Deep Report purchase detected!')
          console.log('📍 Assessment ID:', data.assessmentId)
          console.log('🚀 Redirecting to deep report in 1.5 seconds...')
          setTimeout(() => {
            const reportUrl = `/report/${data.assessmentId}`
            console.log('🎯 Redirecting to:', reportUrl)
            router.push(reportUrl)
          }, 1500)
        }
      } else {
        console.error('Purchase verification failed:', response.status)
        const errorData = await response.json()
        console.error('Error details:', errorData)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error verifying purchase:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-gray-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Purchase Successful!</h1>
        
        <p className="text-gray-600 mb-8">
          {purchaseInfo ? (
            purchaseInfo.product === 'ai_coach_monthly' ? 
              <>Your AI Life Coach subscription is now active! Redirecting you to start coaching...</> :
            purchaseInfo.product === 'deep_report_oneoff' ?
              <>Thank you for your purchase! Your Deep Analysis Report is ready. Redirecting you to view your report...</> :
              <>Thank you for your purchase. Your report is now ready.</>
          ) : (
            <>Processing your purchase. Please wait...</>
          )}
        </p>

        {purchaseInfo && (
          <div className="space-y-4">
            {purchaseInfo.product === 'deep_report_oneoff' ? (
              <button
                onClick={() => router.push(`/report/${purchaseInfo.assessmentId}`)}
                className="w-full flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold"
              >
                <FileText className="h-5 w-5 mr-2" />
                View Your Deep Report
              </button>
            ) : (
              <button
                onClick={() => router.push(`/coach/${purchaseInfo.assessmentId}`)}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-500 hover:to-green-600 transition-all font-semibold shadow-lg animate-pulse"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start AI Coaching Now
              </button>
            )}
            
            <button
              onClick={() => router.push(`/scorecard/${purchaseInfo.assessmentId}`)}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
            >
              Back to Scorecard
            </button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Questions? Contact us at support@rankme.app
          </p>
        </div>
      </div>
    </div>
  )
}
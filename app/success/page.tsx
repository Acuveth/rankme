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
    }
  }, [searchParams])

  const verifyPurchase = async (sessionId: string) => {
    try {
      const response = await fetch('/api/verify-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      
      if (response.ok) {
        const data = await response.json()
        setPurchaseInfo(data)
      }
    } catch (error) {
      console.error('Error verifying purchase:', error)
    } finally {
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
          Thank you for your purchase. Your {purchaseInfo?.product === 'deep_report_oneoff' ? 'Deep Analysis Report' : 'AI Life Coach subscription'} is now ready.
        </p>

        <div className="space-y-4">
          {purchaseInfo?.product === 'deep_report_oneoff' ? (
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
              className="w-full flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Start AI Coaching
            </button>
          )}
          
          <button
            onClick={() => router.push(`/scorecard/${purchaseInfo?.assessmentId}`)}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
          >
            Back to Scorecard
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Questions? Contact us at support@rankme.app
          </p>
        </div>
      </div>
    </div>
  )
}
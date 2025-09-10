'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

export function LoginTrackerComponent() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Track the login
      trackLogin()
    }
  }, [status, session])

  const trackLogin = async () => {
    try {
      // Check if we've already tracked login today
      const today = new Date().toISOString().split('T')[0]
      const lastTrackedDate = sessionStorage.getItem('loginTrackedDate')
      
      // Only track once per day to avoid excessive tracking while capturing all login days
      if (lastTrackedDate === today) {
        return
      }

      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'track'
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Day streak tracked successfully. Current streak:', data.streak?.consecutiveLoginDays || 0)
        sessionStorage.setItem('loginTrackedDate', today)
      }
    } catch (error) {
      console.error('Error tracking login:', error)
    }
  }

  return null // This component doesn't render anything
}
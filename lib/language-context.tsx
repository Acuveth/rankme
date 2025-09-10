'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Language, TranslationKey } from './translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
  availableLanguages: { code: Language; name: string; nativeName: string }[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const availableLanguages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'es' as Language, name: 'Spanish', nativeName: 'Español' },
  { code: 'fr' as Language, name: 'French', nativeName: 'Français' },
  { code: 'de' as Language, name: 'German', nativeName: 'Deutsch' },
]

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const loadLanguagePreference = async () => {
      // Check if we're on the client side
      if (typeof window === 'undefined') {
        setIsInitialized(true)
        return
      }

      // First check localStorage for immediate loading
      try {
        const savedLanguage = localStorage.getItem('preferred-language') as Language
        if (savedLanguage && translations[savedLanguage]) {
          setLanguageState(savedLanguage)
        } else {
          // Detect browser language as fallback
          const browserLanguage = navigator.language.split('-')[0] as Language
          if (translations[browserLanguage]) {
            setLanguageState(browserLanguage)
          }
        }
      } catch (error) {
        console.debug('Error accessing localStorage:', error)
      }

      // Then try to load from database (for logged-in users)
      try {
        const response = await fetch('/api/user?type=language')
        if (response.ok) {
          const data = await response.json()
          if (data.language && translations[data.language]) {
            setLanguageState(data.language)
            if (typeof window !== 'undefined') {
              localStorage.setItem('preferred-language', data.language)
            }
          }
        }
      } catch (error) {
        // Silently ignore errors (user might not be logged in)
        console.debug('Could not fetch language preference from database:', error)
      }

      setIsInitialized(true)
    }

    loadLanguagePreference()
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('preferred-language', lang)
    
    // Also save to database if user is logged in
    if (typeof window !== 'undefined') {
      fetch('/api/user?type=language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang })
      }).catch(error => {
        console.warn('Failed to save language preference to database:', error)
      })
    }
  }

  const t = (key: TranslationKey): string => {
    try {
      const keys = key.split('.')
      let value: any = translations[language]
      
      // Check if translations object exists
      if (!translations || !translations[language]) {
        console.warn('Translation object not found for language:', language)
        return key
      }
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k]
        } else {
          value = undefined
          break
        }
      }
      
      if (typeof value === 'string' && value.length > 0) {
        return value
      }
      
      // Fallback to English if translation not found
      if (language !== 'en' && translations.en) {
        value = translations.en
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k]
          } else {
            value = undefined
            break
          }
        }
        
        if (typeof value === 'string' && value.length > 0) {
          return value
        }
      }
      
      console.warn('Translation not found for key:', key)
      return key
    } catch (error) {
      console.error('Error in translation function:', error, 'for key:', key)
      return key
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        availableLanguages
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
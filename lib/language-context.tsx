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

  useEffect(() => {
    const loadLanguagePreference = async () => {
      // First check localStorage for immediate loading
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

      // Then try to load from database (for logged-in users)
      try {
        const response = await fetch('/api/user/language')
        if (response.ok) {
          const data = await response.json()
          if (data.language && translations[data.language]) {
            setLanguageState(data.language)
            localStorage.setItem('preferred-language', data.language)
          }
        }
      } catch (error) {
        // Silently ignore errors (user might not be logged in)
        console.debug('Could not fetch language preference from database:', error)
      }
    }

    loadLanguagePreference()
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('preferred-language', lang)
    
    // Also save to database if user is logged in
    if (typeof window !== 'undefined') {
      fetch('/api/user/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang })
      }).catch(error => {
        console.warn('Failed to save language preference to database:', error)
      })
    }
  }

  const t = (key: TranslationKey): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    if (typeof value === 'string') {
      return value
    }
    
    // Fallback to English if translation not found
    value = translations.en
    for (const k of keys) {
      value = value?.[k]
    }
    
    return typeof value === 'string' ? value : key
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
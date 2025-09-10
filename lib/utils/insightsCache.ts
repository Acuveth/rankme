import { AIPredictiveInsight } from '@/lib/ai-predictive-analytics'

interface CacheEntry {
  insights: AIPredictiveInsight[]
  metadata: any
  createdAt: string
  expiresAt: string
  assessmentIds?: string[]
  cacheKey: string
}

interface CacheOptions {
  ttlHours?: number
  assessmentIds?: string[]
  includeAllAssessments?: boolean
}

export class InsightsCache {
  private static readonly CACHE_PREFIX = 'ai_insights_cache_'
  private static readonly DEFAULT_TTL_HOURS = 48 // 2 days

  /**
   * Generate a cache key based on user ID and options
   */
  static generateCacheKey(userId: string, options: CacheOptions = {}): string {
    const { assessmentIds, includeAllAssessments } = options
    
    if (includeAllAssessments) {
      return `${this.CACHE_PREFIX}${userId}_all_assessments`
    }
    
    if (assessmentIds && assessmentIds.length > 0) {
      const sortedIds = [...assessmentIds].sort().join('_')
      return `${this.CACHE_PREFIX}${userId}_assessment_${sortedIds}`
    }
    
    return `${this.CACHE_PREFIX}${userId}_latest`
  }

  /**
   * Check if cache entry is valid
   */
  static isCacheValid(entry: CacheEntry): boolean {
    const now = new Date()
    const expiresAt = new Date(entry.expiresAt)
    return now < expiresAt
  }

  /**
   * Get insights from cache if valid
   */
  static async getCachedInsights(
    userId: string, 
    options: CacheOptions = {}
  ): Promise<{ insights: AIPredictiveInsight[], metadata: any } | null> {
    try {
      const cacheKey = this.generateCacheKey(userId, options)
      
      // In a real implementation, this would use Redis or similar
      // For now, we'll use a simple in-memory cache with localStorage fallback
      const cachedData = this.getFromStorage(cacheKey)
      
      if (!cachedData) {
        console.log('🚫 No cached insights found for key:', cacheKey)
        return null
      }

      const cacheEntry: CacheEntry = JSON.parse(cachedData)
      
      if (!this.isCacheValid(cacheEntry)) {
        console.log('⏰ Cache expired for key:', cacheKey)
        this.removeFromStorage(cacheKey)
        return null
      }

      console.log('✅ Using cached insights for key:', cacheKey, 'expires at:', cacheEntry.expiresAt)
      return {
        insights: cacheEntry.insights,
        metadata: {
          ...cacheEntry.metadata,
          cached: true,
          cacheCreatedAt: cacheEntry.createdAt,
          cacheExpiresAt: cacheEntry.expiresAt
        }
      }
    } catch (error) {
      console.error('❌ Error retrieving cached insights:', error)
      return null
    }
  }

  /**
   * Store insights in cache
   */
  static async setCachedInsights(
    userId: string,
    insights: AIPredictiveInsight[],
    metadata: any,
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const cacheKey = this.generateCacheKey(userId, options)
      const ttlHours = options.ttlHours || this.DEFAULT_TTL_HOURS
      
      const now = new Date()
      const expiresAt = new Date(now.getTime() + (ttlHours * 60 * 60 * 1000))
      
      const cacheEntry: CacheEntry = {
        insights,
        metadata: {
          ...metadata,
          cached: false // Original metadata shows it's not from cache
        },
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        assessmentIds: options.assessmentIds,
        cacheKey
      }

      this.setInStorage(cacheKey, JSON.stringify(cacheEntry))
      
      console.log('💾 Cached insights for key:', cacheKey, 'expires at:', expiresAt.toISOString())
      console.log('📊 Cached', insights.length, 'insights')
    } catch (error) {
      console.error('❌ Error caching insights:', error)
    }
  }

  /**
   * Clear cache for a user
   */
  static async clearUserCache(userId: string): Promise<void> {
    try {
      const keys = this.getAllCacheKeys().filter(key => key.includes(`${this.CACHE_PREFIX}${userId}`))
      
      keys.forEach(key => this.removeFromStorage(key))
      
      console.log('🗑️ Cleared', keys.length, 'cache entries for user:', userId)
    } catch (error) {
      console.error('❌ Error clearing user cache:', error)
    }
  }

  /**
   * Clear expired cache entries
   */
  static async clearExpiredCache(): Promise<void> {
    try {
      const keys = this.getAllCacheKeys()
      let clearedCount = 0
      
      keys.forEach(key => {
        try {
          const cachedData = this.getFromStorage(key)
          if (cachedData) {
            const cacheEntry: CacheEntry = JSON.parse(cachedData)
            if (!this.isCacheValid(cacheEntry)) {
              this.removeFromStorage(key)
              clearedCount++
            }
          }
        } catch (error) {
          // Remove invalid cache entries
          this.removeFromStorage(key)
          clearedCount++
        }
      })
      
      if (clearedCount > 0) {
        console.log('🧹 Cleared', clearedCount, 'expired cache entries')
      }
    } catch (error) {
      console.error('❌ Error clearing expired cache:', error)
    }
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): {
    totalEntries: number
    validEntries: number
    expiredEntries: number
    totalSizeKB: number
  } {
    const keys = this.getAllCacheKeys()
    let validEntries = 0
    let expiredEntries = 0
    let totalSize = 0

    keys.forEach(key => {
      try {
        const cachedData = this.getFromStorage(key)
        if (cachedData) {
          totalSize += new Blob([cachedData]).size
          
          const cacheEntry: CacheEntry = JSON.parse(cachedData)
          if (this.isCacheValid(cacheEntry)) {
            validEntries++
          } else {
            expiredEntries++
          }
        }
      } catch (error) {
        expiredEntries++
      }
    })

    return {
      totalEntries: keys.length,
      validEntries,
      expiredEntries,
      totalSizeKB: Math.round(totalSize / 1024)
    }
  }

  // Storage abstraction methods
  private static getFromStorage(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key)
    }
    // Server-side fallback - in production this would use Redis
    return null
  }

  private static setInStorage(key: string, value: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(key, value)
      } catch (error) {
        console.warn('⚠️ LocalStorage full, clearing old cache entries')
        this.clearExpiredCache()
        try {
          localStorage.setItem(key, value)
        } catch (retryError) {
          console.error('❌ Failed to cache insights after cleanup:', retryError)
        }
      }
    }
  }

  private static removeFromStorage(key: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key)
    }
  }

  private static getAllCacheKeys(): string[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const keys: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.CACHE_PREFIX)) {
          keys.push(key)
        }
      }
      return keys
    }
    return []
  }
}
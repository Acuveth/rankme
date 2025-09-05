import { prisma } from '@/lib/prisma'

export class LoginTracker {
  static async trackLogin(userId: string, ipAddress?: string, userAgent?: string) {
    try {
      // Check if we already have a login record for today to prevent duplicates
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const existingLogin = await prisma.loginHistory.findFirst({
        where: {
          userId,
          loginTime: {
            gte: today,
            lt: tomorrow
          }
        }
      })

      if (!existingLogin) {
        // Record the login in history with detailed time tracking
        const loginTime = new Date()
        await prisma.loginHistory.create({
          data: {
            userId,
            ipAddress: ipAddress || null,
            userAgent: userAgent || null,
            loginTime: loginTime
          }
        })
        console.log(`🕐 Login tracked for user ${userId} at ${loginTime.toLocaleString()}`)
      } else {
        console.log(`🔄 Login already recorded today for user ${userId}`)
      }

      // Update user's last login
      await prisma.user.update({
        where: { id: userId },
        data: { lastLogin: new Date() }
      })

      // Calculate and update the day streak
      await this.updateDayStreak(userId)

      return { success: true }
    } catch (error) {
      console.error('Error tracking login:', error)
      return { success: false, error }
    }
  }

  static async updateDayStreak(userId: string) {
    try {
      // Get user's login history - limit to 30 days for performance
      const loginHistory = await prisma.loginHistory.findMany({
        where: { 
          userId,
          loginTime: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days only
          }
        },
        orderBy: { loginTime: 'desc' },
        select: {
          loginTime: true
        },
        take: 50 // Limit results to prevent memory issues
      })

      if (loginHistory.length === 0) {
        return
      }

      // Get or create user progress stats
      let progressStats = await prisma.userProgressStats.findUnique({
        where: { userId }
      })

      if (!progressStats) {
        progressStats = await prisma.userProgressStats.create({
          data: {
            userId,
            currentStreak: 0,
            longestStreak: 0,
            consecutiveLoginDays: 0,
            totalLoginDays: 0
          }
        })
      }

      // Calculate unique login days
      const uniqueLoginDays = new Set<string>()
      loginHistory.forEach(login => {
        const dateKey = login.loginTime.toISOString().split('T')[0]
        uniqueLoginDays.add(dateKey)
      })

      const sortedDays = Array.from(uniqueLoginDays).sort().reverse()
      
      // Calculate current streak with better date handling
      let currentStreak = 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayString = today.toISOString().split('T')[0]
      
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toISOString().split('T')[0]
      
      // Check if user logged in today or yesterday to continue streak
      if (sortedDays.includes(todayString) || sortedDays.includes(yesterdayString)) {
        // Start with most recent login day
        let currentDate = sortedDays.includes(todayString) ? todayString : yesterdayString
        currentStreak = 1
        
        // Count consecutive days backwards
        for (let i = 1; i < sortedDays.length; i++) {
          const expectedPrevDay = new Date(currentDate)
          expectedPrevDay.setDate(expectedPrevDay.getDate() - 1)
          const expectedPrevDayString = expectedPrevDay.toISOString().split('T')[0]
          
          if (sortedDays[i] === expectedPrevDayString) {
            currentStreak++
            currentDate = expectedPrevDayString
          } else {
            break
          }
        }
      }

      // For performance, don't recalculate longest streak every time
      // Only update if current streak is higher than stored longest streak
      let longestStreak = Math.max(currentStreak, progressStats.longestStreak)

      // Update progress stats
      await prisma.userProgressStats.update({
        where: { userId },
        data: {
          currentStreak,
          longestStreak,
          consecutiveLoginDays: currentStreak,
          totalLoginDays: uniqueLoginDays.size,
          lastLoginDate: new Date()
        }
      })

      return { currentStreak, longestStreak }
    } catch (error) {
      console.error('Error updating login streak:', error)
      return null
    }
  }

  static async getDayStreak(userId: string) {
    try {
      const progressStats = await prisma.userProgressStats.findUnique({
        where: { userId },
        select: {
          currentStreak: true,
          longestStreak: true,
          consecutiveLoginDays: true,
          totalLoginDays: true,
          lastLoginDate: true
        }
      })

      if (!progressStats) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          consecutiveLoginDays: 0,
          totalLoginDays: 0,
          lastLoginDate: null
        }
      }

      // Check if streak is still valid (user logged in today or yesterday)
      if (progressStats.lastLoginDate) {
        const lastLoginDate = progressStats.lastLoginDate.toISOString().split('T')[0]
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayString = today.toISOString().split('T')[0]
        
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayString = yesterday.toISOString().split('T')[0]
        
        if (lastLoginDate !== todayString && lastLoginDate !== yesterdayString) {
          // Streak is broken, reset to 0
          await prisma.userProgressStats.update({
            where: { userId },
            data: {
              currentStreak: 0,
              consecutiveLoginDays: 0
            }
          })
          
          return {
            ...progressStats,
            currentStreak: 0,
            consecutiveLoginDays: 0
          }
        }
      }

      return progressStats
    } catch (error) {
      console.error('Error getting day streak:', error)
      return {
        currentStreak: 0,
        longestStreak: 0,
        consecutiveLoginDays: 0,
        totalLoginDays: 0,
        lastLoginDate: null
      }
    }
  }

  static async getLoginAnalytics(userId: string, days: number = 30) {
    try {
      // Get login history for the specified number of days
      const loginHistory = await prisma.loginHistory.findMany({
        where: { 
          userId,
          loginTime: {
            gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { loginTime: 'desc' },
        select: {
          loginTime: true,
          ipAddress: true,
          userAgent: true
        }
      })

      if (loginHistory.length === 0) {
        return {
          totalLogins: 0,
          uniqueDays: 0,
          averageTimeOfDay: null,
          mostCommonHour: null,
          loginPattern: 'No data',
          recentLogins: [],
          timeDistribution: {}
        }
      }

      // Calculate analytics
      const uniqueDays = new Set(loginHistory.map(login => 
        login.loginTime.toISOString().split('T')[0]
      )).size

      // Time of day analytics
      const hours = loginHistory.map(login => login.loginTime.getHours())
      const hourCounts: { [key: number]: number } = {}
      
      hours.forEach(hour => {
        hourCounts[hour] = (hourCounts[hour] || 0) + 1
      })

      const mostCommonHour = Object.keys(hourCounts).reduce((a, b) => 
        hourCounts[parseInt(a)] > hourCounts[parseInt(b)] ? a : b
      )

      const averageHour = hours.reduce((sum, hour) => sum + hour, 0) / hours.length

      // Determine login pattern
      let loginPattern = 'Mixed'
      if (averageHour >= 6 && averageHour < 12) loginPattern = 'Morning person'
      else if (averageHour >= 12 && averageHour < 17) loginPattern = 'Afternoon active'
      else if (averageHour >= 17 && averageHour < 22) loginPattern = 'Evening user'
      else loginPattern = 'Night owl'

      // Recent logins with time formatting
      const recentLogins = loginHistory.slice(0, 10).map(login => ({
        date: login.loginTime.toLocaleDateString(),
        time: login.loginTime.toLocaleTimeString(),
        dayOfWeek: login.loginTime.toLocaleDateString('en-US', { weekday: 'long' }),
        timestamp: login.loginTime
      }))

      return {
        totalLogins: loginHistory.length,
        uniqueDays,
        averageTimeOfDay: `${Math.floor(averageHour)}:${Math.round((averageHour % 1) * 60).toString().padStart(2, '0')}`,
        mostCommonHour: parseInt(mostCommonHour),
        loginPattern,
        recentLogins,
        timeDistribution: hourCounts,
        lastLoginTime: loginHistory[0]?.loginTime || null,
        firstLoginTime: loginHistory[loginHistory.length - 1]?.loginTime || null
      }
    } catch (error) {
      console.error('Error getting login analytics:', error)
      return {
        totalLogins: 0,
        uniqueDays: 0,
        averageTimeOfDay: null,
        mostCommonHour: null,
        loginPattern: 'Error',
        recentLogins: [],
        timeDistribution: {},
        lastLoginTime: null,
        firstLoginTime: null
      }
    }
  }
}
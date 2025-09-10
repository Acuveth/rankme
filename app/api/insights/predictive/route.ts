import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AIPredictiveAnalytics } from '@/lib/ai-predictive-analytics'
import { withMiddleware, withSecurityHeaders } from '@/lib/middleware/security'
import { withErrorHandler } from '@/lib/utils/errorHandler'
import { InsightsCache } from '@/lib/utils/insightsCache'

async function getPredictiveInsightsHandler(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }

  const { searchParams } = new URL(request.url)
  const assessmentId = searchParams.get('assessmentId')
  const includeTypes = searchParams.get('types')?.split(',') || []
  const maxInsights = parseInt(searchParams.get('limit') || '10')
  const useAllAssessments = searchParams.get('useAllAssessments') === 'true'
  const skipCache = searchParams.get('skipCache') === 'true'

  try {
    // Determine caching strategy
    const cacheOptions = {
      ttlHours: 48, // 2 days
      useAllAssessments,
      assessmentIds: useAllAssessments ? undefined : (assessmentId ? [assessmentId] : undefined)
    }

    // Check cache first (unless skipCache is true)
    if (!skipCache) {
      const cachedResult = await InsightsCache.getCachedInsights(user.id, cacheOptions)
      if (cachedResult) {
        const filteredInsights = includeTypes.length > 0 
          ? cachedResult.insights.filter(insight => includeTypes.includes(insight.type))
          : cachedResult.insights
        
        const limitedInsights = filteredInsights.slice(0, maxInsights)
        
        return NextResponse.json({
          insights: limitedInsights,
          metadata: {
            ...cachedResult.metadata,
            totalGenerated: cachedResult.insights.length,
            totalReturned: limitedInsights.length,
            fromCache: true
          }
        }, {
          headers: {
            'Cache-Control': 'private, max-age=3600', // Cache in browser for 1 hour
            'Content-Type': 'application/json'
          }
        })
      }
    }

    // Get the user's assessment(s) if not using all assessments
    let targetAssessmentId = assessmentId
    if (!useAllAssessments && !targetAssessmentId) {
      const recentAssessment = await prisma.assessment.findFirst({
        where: { userId: user.id, status: 'completed' },
        orderBy: { completedAt: 'desc' },
        select: { id: true }
      })
      targetAssessmentId = recentAssessment?.id || undefined
    }

    // Initialize AI-powered predictive analytics with user's language preference
    const userLanguage = user.language || 'en'
    const aiAnalytics = new AIPredictiveAnalytics(user.id, targetAssessmentId, useAllAssessments, userLanguage)
    
    // Check if OpenAI API key is available before proceeding
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key' || process.env.OPENAI_API_KEY.trim() === '') {
      const sorryMessage = aiAnalytics.getSorryMessage('no_api_key')
      console.log('🚫 OpenAI API key not available, returning sorry message')
      
      return NextResponse.json({
        insights: [],
        sorryMessage,
        metadata: {
          totalGenerated: 0,
          totalReturned: 0,
          assessmentId: useAllAssessments ? 'all' : (targetAssessmentId || 'unknown'),
          useAllAssessments,
          generatedAt: new Date().toISOString(),
          fromCache: false,
          aiUnavailable: true,
          reason: 'no_api_key',
          language: userLanguage
        }
      }, {
        headers: {
          'Cache-Control': 'private, max-age=3600', // Cache for 1 hour when API key is missing
          'Content-Type': 'application/json'
        }
      })
    }
    
    // Generate AI-powered insights
    console.log('🧠 Generating AI-powered insights for user:', user.id, 
                'assessment:', useAllAssessments ? 'all' : targetAssessmentId,
                'useAllAssessments:', useAllAssessments,
                'language:', userLanguage)
    const startTime = Date.now()
    const allInsights = await aiAnalytics.generateAIInsights()
    const endTime = Date.now()
    console.log(`⏱️ AI insights generation completed in ${endTime - startTime}ms, generated ${allInsights.length} insights`)

    // Check if no insights were generated and provide appropriate error message
    if (allInsights.length === 0) {
      const sorryMessage = aiAnalytics.getSorryMessage('no_insights_generated')
      console.log('⚠️ No AI insights generated, returning sorry message')
      
      return NextResponse.json({
        insights: [],
        sorryMessage,
        metadata: {
          totalGenerated: 0,
          totalReturned: 0,
          assessmentId: useAllAssessments ? 'all' : (targetAssessmentId || 'unknown'),
          useAllAssessments,
          generatedAt: new Date().toISOString(),
          fromCache: false,
          aiUnavailable: true,
          reason: 'no_insights_generated',
          language: userLanguage
        }
      }, {
        headers: {
          'Cache-Control': 'private, max-age=300', // Cache for 5 minutes only when AI is unavailable
          'Content-Type': 'application/json'
        }
      })
    }

    // Cache the results
    const metadata = {
      totalGenerated: allInsights.length,
      assessmentId: useAllAssessments ? 'all' : targetAssessmentId,
      generatedAt: new Date().toISOString(),
      useAllAssessments,
      confidenceDistribution: {
        high: allInsights.filter(i => i.confidence >= 80).length,
        medium: allInsights.filter(i => i.confidence >= 60 && i.confidence < 80).length,
        low: allInsights.filter(i => i.confidence < 60).length
      },
      aiPowered: allInsights.some(i => i.aiGenerated),
      typeDistribution: allInsights.reduce((acc, insight) => {
        acc[insight.type] = (acc[insight.type] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
    
    await InsightsCache.setCachedInsights(user.id, allInsights, metadata, cacheOptions)
    
    // Filter by types if specified
    const filteredInsights = includeTypes.length > 0 
      ? allInsights.filter(insight => includeTypes.includes(insight.type))
      : allInsights
    
    // Limit results
    const limitedInsights = filteredInsights.slice(0, maxInsights)

    // Add metadata
    const response = {
      insights: limitedInsights,
      metadata: {
        ...metadata,
        totalReturned: limitedInsights.length,
        fromCache: false
      }
    }

    // Cache for 2 hours to prevent excessive computation (insights are cached for 2 days)
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'private, max-age=7200',
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Error generating predictive insights:', error)
    
    // Create analytics instance to get language-aware error message
    const userLanguage = user.language || 'en'
    const aiAnalytics = new AIPredictiveAnalytics(user.id, assessmentId, useAllAssessments, userLanguage)
    const sorryMessage = aiAnalytics.getSorryMessage('error')
    
    return NextResponse.json(
      { 
        insights: [],
        sorryMessage,
        metadata: {
          totalGenerated: 0,
          totalReturned: 0,
          assessmentId: useAllAssessments ? 'all' : (assessmentId || 'unknown'),
          useAllAssessments,
          generatedAt: new Date().toISOString(),
          fromCache: false,
          aiUnavailable: true,
          reason: 'error',
          language: userLanguage,
          technicalError: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 200 } // Return 200 instead of 500 since we're handling this gracefully
    )
  }
}

// Export with middleware
export const GET = withMiddleware(
  withSecurityHeaders,
  withErrorHandler
)(getPredictiveInsightsHandler)
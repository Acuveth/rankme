import { prisma } from '@/lib/prisma'
import { openai } from '@/lib/openai'
import { startOfWeek, addDays, format, differenceInDays, subDays, startOfDay, endOfDay } from 'date-fns'

export interface AIPredictiveInsight {
  id: string
  type: 'risk_detection' | 'behavior_forecast' | 'personalized_recommendation' | 'intervention_timing' | 'pattern_coaching'
  confidence: number // AI-generated confidence score 0-100
  priority: 'high' | 'medium' | 'low'
  title: string
  message: string
  reasoning: string // AI's explanation of the insight
  data: any
  actionable: boolean
  suggestedActions?: string[]
  timeFrame?: string
  category?: string
  aiGenerated: boolean
}

export interface UserDataContext {
  userId: string
  assessmentId?: string
  demographics: {
    age_band: string
    sex: string
    region: string
  }
  assessmentScores: {
    overall: number
    financial: number
    health: number
    social: number
    romantic: number
    career?: number
  }
  assessmentHistory?: Array<{
    id: string
    createdAt: Date
    scores: {
      overall: number
      financial: number
      health: number
      social: number
      romantic: number
      career?: number
    }
  }>
  taskHistory: {
    daily: Array<{
      id: string
      title: string
      category: string
      completed: boolean
      date: Date
      completedAt?: Date
      estimatedMinutes?: number
    }>
    weekly: Array<{
      id: string
      title: string
      category: string
      completed: boolean
      week: number
      completedAt?: Date
    }>
  }
  journalEntries: Array<{
    date: Date
    mood?: string
    content?: string
    createdAt: Date
  }>
  goals: Array<{
    category: string
    status: string
    progress: number
    createdAt: Date
    updatedAt: Date
  }>
  loginHistory: Array<{
    loginTime: Date
    dayOfWeek: number
    hour: number
  }>
  streakData: {
    currentStreak: number
    longestStreak: number
    totalLoginDays: number
  }
  coachingHistory: Array<{
    message: string
    timestamp: Date
    style?: string
  }>
}

export class AIPredictiveAnalytics {
  private userId: string
  private assessmentId?: string
  private useAllAssessments: boolean
  private userLanguage: string

  constructor(userId: string, assessmentId?: string, useAllAssessments: boolean = false, userLanguage: string = 'en') {
    this.userId = userId
    this.assessmentId = assessmentId
    this.useAllAssessments = useAllAssessments
    this.userLanguage = userLanguage
  }

  private getSystemPromptByType(type: string): string {
    const prompts: Record<string, Record<string, string>> = {
      risk_detection: {
        en: "You are an AI life coach specializing in predictive analytics and risk assessment. Analyze user behavior patterns to identify potential risks and challenges. Provide specific, actionable insights with confidence scores. ALWAYS respond with valid JSON format only, no other text.",
        es: "Eres un coach de vida de IA especializado en análisis predictivo y evaluación de riesgos. Analiza los patrones de comportamiento del usuario para identificar riesgos y desafíos potenciales. Proporciona información específica y procesable con puntuaciones de confianza. SIEMPRE responde SOLO con formato JSON válido, sin otro texto.",
        fr: "Vous êtes un coach de vie IA spécialisé dans l'analyse prédictive et l'évaluation des risques. Analysez les modèles de comportement de l'utilisateur pour identifier les risques et défis potentiels. Fournissez des insights spécifiques et exploitables avec des scores de confiance. TOUJOURS répondre UNIQUEMENT avec un format JSON valide, aucun autre texte.",
        de: "Sie sind ein KI-Lebenscoach, spezialisiert auf prädiktive Analytik und Risikobewertung. Analysieren Sie Nutzerverhaltensmustern, um potenzielle Risiken und Herausforderungen zu identifizieren. Geben Sie spezifische, umsetzbare Einblicke mit Vertrauenswerten. IMMER NUR mit gültigem JSON-Format antworten, kein anderer Text."
      },
      behavior_forecast: {
        en: "You are an AI behavioral analyst specializing in productivity patterns and forecasting. Analyze user data to predict future behavior patterns and optimal performance windows. ALWAYS respond with valid JSON format only, no other text.",
        es: "Eres un analista de comportamiento de IA especializado en patrones de productividad y pronósticos. Analiza los datos del usuario para predecir patrones de comportamiento futuro y ventanas de rendimiento óptimo. SIEMPRE responde SOLO con formato JSON válido, sin otro texto.",
        fr: "Vous êtes un analyste comportemental IA spécialisé dans les modèles de productivité et les prévisions. Analysez les données utilisateur pour prédire les modèles de comportement futurs et les fenêtres de performance optimales. TOUJOURS répondre UNIQUEMENT avec un format JSON valide, aucun autre texte.",
        de: "Sie sind ein KI-Verhaltensanalyst, spezialisiert auf Produktivitätsmuster und Prognosen. Analysieren Sie Benutzerdaten, um zukünftige Verhaltensmuster und optimale Leistungsfenster vorherzusagen. IMMER NUR mit gültigem JSON-Format antworten, kein anderer Text."
      },
      personalized_recommendation: {
        en: "You are an AI optimization expert specializing in personalized recommendations. Analyze user performance data and demographics to provide tailored suggestions for improvement. ALWAYS respond with valid JSON format only, no other text.",
        es: "Eres un experto en optimización de IA especializado en recomendaciones personalizadas. Analiza los datos de rendimiento del usuario y la demografía para proporcionar sugerencias personalizadas para la mejora. SIEMPRE responde SOLO con formato JSON válido, sin otro texto.",
        fr: "Vous êtes un expert en optimisation IA spécialisé dans les recommandations personnalisées. Analysez les données de performance de l'utilisateur et la démographie pour fournir des suggestions sur mesure pour l'amélioration. TOUJOURS répondre UNIQUEMENT avec un format JSON valide, aucun autre texte.",
        de: "Sie sind ein KI-Optimierungsexperte, spezialisiert auf personalisierte Empfehlungen. Analysieren Sie Benutzerleistungsdaten und Demographie, um maßgeschneiderte Verbesserungsvorschläge zu geben. IMMER NUR mit gültigem JSON-Format antworten, kein anderer Text."
      },
      intervention_timing: {
        en: "You are an AI intervention specialist focused on optimal timing for behavioral changes and support. Analyze patterns to identify critical intervention moments. ALWAYS respond with valid JSON format only, no other text.",
        es: "Eres un especialista en intervención de IA enfocado en el momento óptimo para cambios de comportamiento y apoyo. Analiza patrones para identificar momentos críticos de intervención. SIEMPRE responde SOLO con formato JSON válido, sin otro texto.",
        fr: "Vous êtes un spécialiste des interventions IA axé sur le timing optimal pour les changements comportementaux et le soutien. Analysez les modèles pour identifier les moments d'intervention critiques. TOUJOURS répondre UNIQUEMENT avec un format JSON valide, aucun autre texte.",
        de: "Sie sind ein KI-Interventionsspezialist, fokussiert auf optimales Timing für Verhaltensänderungen und Unterstützung. Analysieren Sie Muster, um kritische Interventionsmomente zu identifizieren. IMMER NUR mit gültigem JSON-Format antworten, kein anderer Text."
      },
      pattern_coaching: {
        en: "You are an AI pattern recognition coach specializing in deep behavioral analysis and self-awareness insights. Identify meaningful correlations and provide profound coaching insights. ALWAYS respond with valid JSON format only, no other text.",
        es: "Eres un coach de reconocimiento de patrones de IA especializado en análisis de comportamiento profundo y perspectivas de autoconciencia. Identifica correlaciones significativas y proporciona perspectivas de coaching profundas. SIEMPRE responde SOLO con formato JSON válido, sin otro texto.",
        fr: "Vous êtes un coach de reconnaissance de modèles IA spécialisé dans l'analyse comportementale approfondie et les insights de conscience de soi. Identifiez les corrélations significatives et fournissez des insights de coaching profonds. TOUJOURS répondre UNIQUEMENT avec un format JSON valide, aucun autre texte.",
        de: "Sie sind ein KI-Mustererkennung-Coach, spezialisiert auf tiefe Verhaltensanalyse und Selbstbewusstsein-Einblicke. Identifizieren Sie bedeutungsvolle Korrelationen und bieten Sie tiefgreifende Coaching-Einblicke. IMMER NUR mit gültigem JSON-Format antworten, kein anderer Text."
      }
    }

    return prompts[type]?.[this.userLanguage] || prompts[type]?.['en'] || prompts[type]?.[Object.keys(prompts[type])[0]]
  }

  public getSorryMessage(reason: 'no_api_key' | 'no_insights_generated' | 'error'): string {
    const messages: Record<string, Record<string, string>> = {
      no_api_key: {
        en: "AI Predictive Insights are currently unavailable. The AI service is not configured. Please contact support for assistance.",
        es: "Los Insights Predictivos de IA no están disponibles actualmente. El servicio de IA no está configurado. Por favor contacta con soporte para asistencia.",
        fr: "Les Insights Prédictifs IA ne sont pas disponibles actuellement. Le service IA n'est pas configuré. Veuillez contacter le support pour obtenir de l'aide.",
        de: "KI-Predictive Insights sind derzeit nicht verfügbar. Der KI-Service ist nicht konfiguriert. Bitte kontaktieren Sie den Support für Hilfe."
      },
      no_insights_generated: {
        en: "AI Predictive Insights could not be generated at this time. The AI service may be temporarily unavailable. Please try again later.",
        es: "No se pudieron generar Insights Predictivos de IA en este momento. El servicio de IA puede estar temporalmente no disponible. Por favor inténtalo de nuevo más tarde.",
        fr: "Les Insights Prédictifs IA n'ont pas pu être générés en ce moment. Le service IA peut être temporairement indisponible. Veuillez réessayer plus tard.",
        de: "KI-Predictive Insights konnten derzeit nicht generiert werden. Der KI-Service ist möglicherweise vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut."
      },
      error: {
        en: "Sorry, we encountered an error while generating your AI Predictive Insights. Please try refreshing the page or contact support if the issue persists.",
        es: "Lo sentimos, encontramos un error al generar tus Insights Predictivos de IA. Por favor intenta actualizar la página o contacta con soporte si el problema persiste.",
        fr: "Désolé, nous avons rencontré une erreur lors de la génération de vos Insights Prédictifs IA. Veuillez essayer d'actualiser la page ou contacter le support si le problème persiste.",
        de: "Entschuldigung, wir sind auf einen Fehler gestoßen beim Generieren Ihrer KI-Predictive Insights. Bitte versuchen Sie, die Seite zu aktualisieren oder kontaktieren Sie den Support, wenn das Problem weiterhin besteht."
      }
    }

    return messages[reason]?.[this.userLanguage] || messages[reason]?.['en'] || "AI Predictive Insights are temporarily unavailable."
  }

  async generateAIInsights(): Promise<AIPredictiveInsight[]> {
    try {
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key' || process.env.OPENAI_API_KEY.trim() === '') {
        console.log('🚫 OpenAI API key not available, returning empty insights with sorry message')
        return []
      }

      console.log('🧠 OpenAI API key found, generating AI insights...')

      // Gather comprehensive user context
      const userContext = await this.gatherUserContext()
      console.log('📊 User context gathered, assessment scores:', userContext.assessmentScores)
      
      // Generate different types of AI insights with individual error handling
      const insights = []
      
      try {
        const riskInsights = await this.generateRiskDetectionInsights(userContext)
        console.log('🚨 Risk insights generated:', riskInsights.length)
        insights.push(...riskInsights)
      } catch (error) {
        console.warn('Warning: Risk insights generation failed:', error)
      }
      
      try {
        const behaviorInsights = await this.generateBehaviorForecastInsights(userContext)
        console.log('📈 Behavior insights generated:', behaviorInsights.length)
        insights.push(...behaviorInsights)
      } catch (error) {
        console.warn('Warning: Behavior insights generation failed:', error)
      }
      
      try {
        const recommendationInsights = await this.generatePersonalizedRecommendations(userContext)
        console.log('💡 Recommendation insights generated:', recommendationInsights.length)
        insights.push(...recommendationInsights)
      } catch (error) {
        console.warn('Warning: Recommendation insights generation failed:', error)
      }
      
      try {
        const interventionInsights = await this.generateInterventionTimingInsights(userContext)
        console.log('⏰ Intervention insights generated:', interventionInsights.length)
        insights.push(...interventionInsights)
      } catch (error) {
        console.warn('Warning: Intervention insights generation failed:', error)
      }
      
      try {
        const patternInsights = await this.generatePatternCoachingInsights(userContext)
        console.log('🎯 Pattern insights generated:', patternInsights.length)
        insights.push(...patternInsights)
      } catch (error) {
        console.warn('Warning: Pattern insights generation failed:', error)
      }

      // If no insights were generated, return empty array
      if (insights.length === 0) {
        console.log('⚠️ No AI insights generated, returning empty insights array')
        return []
      }

      console.log('✅ Total AI insights generated:', insights.length)

      // Sort by AI-determined priority and confidence
      return insights.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
        if (priorityDiff !== 0) return priorityDiff
        return b.confidence - a.confidence
      })

    } catch (error) {
      console.error('❌ Error generating AI insights:', error)
      return []
    }
  }

  private async gatherUserContext(): Promise<UserDataContext> {
    const thirtyDaysAgo = subDays(new Date(), 30)
    
    // Gather all user data in parallel
    const [
      assessmentData,
      dailyTasks,
      weeklyTasks,
      journalEntries,
      goals,
      loginHistory,
      progressStats,
      chatMessages
    ] = await Promise.all([
      this.getAssessmentData(),
      
      prisma.dailyTask.findMany({
        where: {
          userId: this.userId,
          date: { gte: thirtyDaysAgo }
        },
        orderBy: { date: 'desc' },
        take: 200
      }),
      
      prisma.weeklyTask.findMany({
        where: {
          userId: this.userId,
          createdAt: { gte: thirtyDaysAgo }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      }),
      
      prisma.journalEntry.findMany({
        where: {
          userId: this.userId,
          date: { gte: thirtyDaysAgo }
        },
        orderBy: { date: 'desc' },
        take: 50
      }),
      
      prisma.goal.findMany({
        where: { userId: this.userId },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      
      prisma.loginHistory.findMany({
        where: {
          userId: this.userId,
          loginTime: { gte: thirtyDaysAgo }
        },
        orderBy: { loginTime: 'desc' },
        take: 100
      }),
      
      prisma.userProgressStats.findUnique({
        where: { userId: this.userId }
      }),
      
      prisma.chatMessage.findMany({
        where: {
          userId: this.userId,
          createdAt: { gte: thirtyDaysAgo }
        },
        orderBy: { createdAt: 'desc' },
        take: 30
      })
    ])

    // Process assessment data
    let contextData
    if (Array.isArray(assessmentData)) {
      // Multiple assessments - get the latest for demographics, aggregate scores
      const latestAssessment = assessmentData[0]
      const avgScores = this.calculateAverageScores(assessmentData)
      
      contextData = {
        userId: this.userId,
        assessmentId: this.useAllAssessments ? 'all' : this.assessmentId,
        demographics: {
          age_band: latestAssessment?.cohortAge || 'unknown',
          sex: latestAssessment?.cohortSex || 'unknown',
          region: latestAssessment?.cohortRegion || 'unknown'
        },
        assessmentScores: avgScores,
        assessmentHistory: assessmentData.map(a => ({
          id: a.id,
          createdAt: a.createdAt,
          scores: {
            overall: a.scoreOverall?.score || 50,
            financial: a.scoreCategory?.financial || 50,
            health: a.scoreCategory?.healthFitness || 50,
            social: a.scoreCategory?.social || 50,
            romantic: a.scoreCategory?.romantic || 50,
            career: a.scoreCategory?.career
          }
        }))
      }
    } else {
      // Single assessment
      contextData = {
        userId: this.userId,
        assessmentId: this.assessmentId,
        demographics: {
          age_band: assessmentData?.cohortAge || 'unknown',
          sex: assessmentData?.cohortSex || 'unknown',
          region: assessmentData?.cohortRegion || 'unknown'
        },
        assessmentScores: {
          overall: assessmentData?.scoreOverall?.score || 50,
          financial: assessmentData?.scoreCategory?.financial || 50,
          health: assessmentData?.scoreCategory?.healthFitness || 50,
          social: assessmentData?.scoreCategory?.social || 50,
          romantic: assessmentData?.scoreCategory?.romantic || 50,
          career: assessmentData?.scoreCategory?.career
        }
      }
    }

    return {
      ...contextData,
      taskHistory: {
        daily: dailyTasks.map(task => ({
          id: task.id,
          title: task.title,
          category: task.category,
          completed: task.completed,
          date: new Date(task.date),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          estimatedMinutes: task.estimatedMinutes
        })),
        weekly: weeklyTasks.map(task => ({
          id: task.id,
          title: task.title,
          category: task.category,
          completed: task.completed,
          week: task.week,
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        }))
      },
      journalEntries: journalEntries.map(entry => ({
        date: new Date(entry.date),
        mood: entry.mood,
        content: entry.content,
        createdAt: new Date(entry.createdAt)
      })),
      goals: goals.map(goal => ({
        category: goal.category,
        status: goal.status,
        progress: goal.progress,
        createdAt: new Date(goal.createdAt),
        updatedAt: new Date(goal.updatedAt)
      })),
      loginHistory: loginHistory.map(login => ({
        loginTime: new Date(login.loginTime),
        dayOfWeek: new Date(login.loginTime).getDay(),
        hour: new Date(login.loginTime).getHours()
      })),
      streakData: {
        currentStreak: progressStats?.currentStreak || 0,
        longestStreak: progressStats?.longestStreak || 0,
        totalLoginDays: progressStats?.totalLoginDays || 0
      },
      coachingHistory: chatMessages.map(msg => ({
        message: msg.content,
        timestamp: new Date(msg.createdAt),
        style: msg.coaching_style
      }))
    }
  }

  private async generateRiskDetectionInsights(context: UserDataContext): Promise<AIPredictiveInsight[]> {
    try {
      const prompt = this.createRiskDetectionPrompt(context)
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: this.getSystemPromptByType('risk_detection')
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })

      const response = completion.choices[0]?.message?.content?.trim()
      if (!response) {
        console.warn('No response from OpenAI for risk detection')
        return []
      }

      console.log('🔍 Raw OpenAI response for risk detection:', response.substring(0, 100) + '...')

      // Clean the response to ensure it's valid JSON
      const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim()
      
      try {
        const aiResponse = JSON.parse(cleanResponse)
        const insights = this.parseAIInsights(aiResponse, 'risk_detection')
        console.log('✅ Successfully parsed', insights.length, 'risk detection insights')
        return insights
      } catch (parseError) {
        console.error('❌ Failed to parse OpenAI response for risk detection:', parseError)
        console.error('Raw response:', cleanResponse)
        return []
      }

    } catch (error) {
      console.error('Error generating risk detection insights:', error)
      return []
    }
  }

  private async generateBehaviorForecastInsights(context: UserDataContext): Promise<AIPredictiveInsight[]> {
    try {
      const prompt = this.createBehaviorForecastPrompt(context)
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: this.getSystemPromptByType('behavior_forecast')
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 800
      })

      const response = completion.choices[0]?.message?.content?.trim()
      if (!response) {
        console.warn('No response from OpenAI for behavior forecast')
        return []
      }

      const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim()
      
      try {
        const aiResponse = JSON.parse(cleanResponse)
        const insights = this.parseAIInsights(aiResponse, 'behavior_forecast')
        console.log('✅ Successfully parsed', insights.length, 'behavior forecast insights')
        return insights
      } catch (parseError) {
        console.error('❌ Failed to parse OpenAI response for behavior forecast:', parseError)
        return []
      }

    } catch (error) {
      console.error('Error generating behavior forecast insights:', error)
      return []
    }
  }

  private async generatePersonalizedRecommendations(context: UserDataContext): Promise<AIPredictiveInsight[]> {
    try {
      const prompt = this.createPersonalizationPrompt(context)
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: this.getSystemPromptByType('personalized_recommendation')
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })

      const response = completion.choices[0]?.message?.content?.trim()
      if (!response) {
        console.warn('No response from OpenAI for personalized recommendations')
        return []
      }

      const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim()
      
      try {
        const aiResponse = JSON.parse(cleanResponse)
        const insights = this.parseAIInsights(aiResponse, 'personalized_recommendation')
        console.log('✅ Successfully parsed', insights.length, 'personalized recommendation insights')
        return insights
      } catch (parseError) {
        console.error('❌ Failed to parse OpenAI response for personalized recommendations:', parseError)
        return []
      }

    } catch (error) {
      console.error('Error generating personalized recommendations:', error)
      return []
    }
  }

  private async generateInterventionTimingInsights(context: UserDataContext): Promise<AIPredictiveInsight[]> {
    try {
      const prompt = this.createInterventionTimingPrompt(context)
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: this.getSystemPromptByType('intervention_timing')
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 800
      })

      const response = completion.choices[0]?.message?.content?.trim()
      if (!response) {
        console.warn('No response from OpenAI for intervention timing')
        return []
      }

      const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim()
      
      try {
        const aiResponse = JSON.parse(cleanResponse)
        const insights = this.parseAIInsights(aiResponse, 'intervention_timing')
        console.log('✅ Successfully parsed', insights.length, 'intervention timing insights')
        return insights
      } catch (parseError) {
        console.error('❌ Failed to parse OpenAI response for intervention timing:', parseError)
        return []
      }

    } catch (error) {
      console.error('Error generating intervention timing insights:', error)
      return []
    }
  }

  private async generatePatternCoachingInsights(context: UserDataContext): Promise<AIPredictiveInsight[]> {
    try {
      const prompt = this.createPatternCoachingPrompt(context)
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: this.getSystemPromptByType('pattern_coaching')
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })

      const response = completion.choices[0]?.message?.content?.trim()
      if (!response) {
        console.warn('No response from OpenAI for pattern coaching')
        return []
      }

      const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim()
      
      try {
        const aiResponse = JSON.parse(cleanResponse)
        const insights = this.parseAIInsights(aiResponse, 'pattern_coaching')
        console.log('✅ Successfully parsed', insights.length, 'pattern coaching insights')
        return insights
      } catch (parseError) {
        console.error('❌ Failed to parse OpenAI response for pattern coaching:', parseError)
        return []
      }

    } catch (error) {
      console.error('Error generating pattern coaching insights:', error)
      return []
    }
  }

  private createRiskDetectionPrompt(context: UserDataContext): string {
    const lowScoreAreas = Object.entries(context.assessmentScores)
      .filter(([key, score]) => key !== 'overall' && score < 60)
      .map(([area, score]) => `${area}: ${score}/100`)
    
    const criticalAnswers = this.identifyCriticalAssessmentAnswers(context)

    return `
Analyze this user's assessment data to identify potential life risks and challenges:

USER PROFILE:
- Demographics: ${context.demographics.age_band} ${context.demographics.sex} from ${context.demographics.region}
- Overall life score: ${context.assessmentScores.overall}/100
- Category scores: Financial ${context.assessmentScores.financial}, Health ${context.assessmentScores.health}, Social ${context.assessmentScores.social}, Romantic ${context.assessmentScores.romantic}

CRITICAL ASSESSMENT INDICATORS:
${criticalAnswers.join('\n')}

LOW-SCORING AREAS NEEDING ATTENTION:
${lowScoreAreas.length > 0 ? lowScoreAreas.join('\n') : 'No significantly low areas identified'}

RECENT COACH INTERACTIONS:
${context.coachingHistory.slice(0, 3).map(msg => 
  `- "${msg.message.slice(0, 80)}..." (${format(msg.timestamp, 'MMM dd')})`
).join('\n')}

FOCUS AREAS: Analyze the assessment responses to identify:
- Areas with concerning responses that could lead to future problems
- Life domains showing vulnerability or instability
- Patterns suggesting need for immediate intervention
- Risk factors based on demographic and score combinations

Please return a JSON object focusing on assessment-driven insights:
{
  "insights": [
    {
      "title": "Assessment-based risk alert",
      "message": "Specific insight based on their assessment responses",
      "reasoning": "Analysis of which assessment answers triggered this insight", 
      "confidence": 85,
      "priority": "high|medium|low",
      "timeFrame": "This month|Next 3 months|Ongoing concern",
      "category": "financial|health|social|romantic|career",
      "suggestedActions": ["specific action based on assessment weakness", "targeted improvement step"],
      "data": {"assessmentArea": "category", "currentScore": 45, "benchmarkScore": 70}
    }
  ]
}

Base insights on actual assessment responses, not task completion patterns.
`
  }

  private createBehaviorForecastPrompt(context: UserDataContext): string {
    const assessmentInsights = this.extractAssessmentBehaviorPatterns(context)
    const goalProgressPatterns = context.goals.map(g => 
      `${g.category}: ${g.status} (${g.progress}% complete, ${Math.round(differenceInDays(new Date(), g.updatedAt))} days since update)`
    )

    return `
Analyze this user's assessment responses and coach interactions to forecast behavioral patterns:

USER PROFILE:
- Demographics: ${context.demographics.age_band} ${context.demographics.sex} from ${context.demographics.region}
- Assessment scores: Financial ${context.assessmentScores.financial}, Health ${context.assessmentScores.health}, Social ${context.assessmentScores.social}, Romantic ${context.assessmentScores.romantic}

ASSESSMENT-BASED BEHAVIORAL INSIGHTS:
${assessmentInsights.join('\n')}

GOAL PROGRESS PATTERNS:
${goalProgressPatterns.join('\n')}

COACHING CONVERSATION THEMES:
${context.coachingHistory.slice(0, 5).map(msg => 
  `- "${msg.message.slice(0, 100)}..." (${msg.style || 'standard'} style)`
).join('\n')}

JOURNAL SELF-REFLECTION PATTERNS:
${context.journalEntries.slice(0, 8).map(j => 
  `${format(j.date, 'MMM dd')}: ${j.mood || 'neutral'} mood - ${j.content ? 'reflective entry' : 'no reflection'}`
).join('\n')}

FOCUS: Predict behavioral patterns based on:
- Assessment responses indicating personality/lifestyle patterns
- Goal-setting and achievement patterns
- Coach interaction themes and responsiveness
- Self-reflection habits and emotional awareness

Please return JSON analyzing assessment-based behavioral patterns:
{
  "insights": [
    {
      "title": "Assessment-driven behavioral forecast", 
      "message": "Prediction based on assessment responses and coach interactions",
      "reasoning": "Analysis of assessment patterns and coaching themes",
      "confidence": 78,
      "priority": "high|medium|low", 
      "timeFrame": "Next month|Next quarter|Ongoing pattern",
      "category": "goal_achievement|self_awareness|coaching_responsiveness|lifestyle",
      "suggestedActions": ["coaching strategy adjustment", "assessment-based recommendation"],
      "data": {"assessmentFactor": "category", "coachingStyle": "preferred", "predictedOutcome": "likely"}
    }
  ]
}

Base predictions on assessment psychology and coach interaction quality, not login times.
`
  }

  private createPersonalizationPrompt(context: UserDataContext): string {
    const strengthsAndWeaknesses = this.analyzeAssessmentStrengthsWeaknesses(context)
    const coachingThemes = this.extractCoachingThemes(context)

    return `
Create personalized recommendations based on this user's assessment profile and coaching interactions:

USER PROFILE:
- Demographics: ${context.demographics.age_band} ${context.demographics.sex} from ${context.demographics.region}
- Life assessment scores: Overall ${context.assessmentScores.overall}, Financial ${context.assessmentScores.financial}, Health ${context.assessmentScores.health}, Social ${context.assessmentScores.social}, Romantic ${context.assessmentScores.romantic}

ASSESSMENT STRENGTHS & WEAKNESSES:
${strengthsAndWeaknesses.join('\n')}

COACHING INTERACTION ANALYSIS:
${coachingThemes.join('\n')}

CURRENT LIFE GOALS & FOCUS AREAS:
${context.goals.slice(0, 5).map(g => 
  `${g.category}: ${g.status} (${g.progress}% progress, created ${Math.round(differenceInDays(new Date(), g.createdAt))} days ago)`
).join('\n')}

SELF-REFLECTION PATTERNS:
${context.journalEntries.slice(0, 5).map(j => 
  `${format(j.date, 'MMM dd')}: ${j.mood || 'neutral'} - ${j.content ? 'wrote reflective entry' : 'no journaling'}`
).join('\n')}

FOCUS: Create recommendations based on:
- Assessment gaps with highest improvement potential
- Coaching conversation insights about user's mindset/approach
- Goal-setting patterns and areas of focus
- Personal growth trajectory and self-awareness level

Please return JSON with assessment-driven personalized recommendations:
{
  "insights": [
    {
      "title": "Assessment-based personalized recommendation",
      "message": "Specific recommendation based on assessment weaknesses and coaching insights", 
      "reasoning": "Why this recommendation addresses their specific assessment profile",
      "confidence": 82,
      "priority": "high|medium|low",
      "timeFrame": "Next month|Next quarter|Ongoing development",
      "category": "financial|health|social|romantic|career|personal_growth", 
      "suggestedActions": ["assessment-targeted action", "coaching-informed strategy"],
      "data": {"assessmentGap": "specific_weakness", "improvementPotential": 40, "coachingInsight": "relevant_theme"}
    }
  ]
}

Focus on assessment-driven recommendations that align with their coaching conversations and goals.
`
  }

  private createInterventionTimingPrompt(context: UserDataContext): string {
    const goalStagnationAnalysis = context.goals.map(g => ({
      category: g.category,
      daysSinceUpdate: Math.round(differenceInDays(new Date(), g.updatedAt)),
      progress: g.progress,
      status: g.status
    })).filter(g => g.daysSinceUpdate > 7 || g.status === 'stalled')

    return `
Identify optimal intervention timing based on assessment profile and goal progress patterns:

USER PROFILE: 
- Assessment scores: Overall ${context.assessmentScores.overall}, Financial ${context.assessmentScores.financial}, Health ${context.assessmentScores.health}, Social ${context.assessmentScores.social}, Romantic ${context.assessmentScores.romantic}
- Demographics: ${context.demographics.age_band} ${context.demographics.sex} from ${context.demographics.region}

GOAL STAGNATION INDICATORS:
${goalStagnationAnalysis.length > 0 ? goalStagnationAnalysis.map(g => 
  `${g.category}: ${g.status} (${g.progress}% complete, ${g.daysSinceUpdate} days without update)`
).join('\n') : 'No stagnated goals identified'}

ASSESSMENT-BASED RISK FACTORS:
${this.identifyCriticalAssessmentAnswers(context).join('\n')}

COACHING ENGAGEMENT PATTERNS:
${context.coachingHistory.length > 0 ? 
  `- Last coaching: ${Math.round(differenceInDays(new Date(), context.coachingHistory[0].timestamp))} days ago
- Total interactions: ${context.coachingHistory.length}
- Recent coaching theme: "${context.coachingHistory[0].message.slice(0, 60)}..."` :
  '- No coaching history - prime time for intervention'
}

SELF-REFLECTION PATTERNS:
${context.journalEntries.slice(0, 5).map(j => 
  `${format(j.date, 'MMM dd')}: ${j.mood || 'neutral'} - ${j.content ? 'reflected' : 'no journaling'}`
).join('\n')}

FOCUS: Identify intervention moments based on:
- Assessment scores indicating vulnerability windows
- Goal progress stalls that need coaching support
- Coaching conversation gaps that suggest disengagement
- Mood/journal patterns indicating need for support

Please return JSON identifying assessment-based intervention timing:
{
  "insights": [
    {
      "title": "Assessment-based intervention timing",
      "message": "When to intervene based on assessment profile and progress patterns",
      "reasoning": "Analysis of assessment vulnerabilities and goal stagnation patterns",
      "confidence": 79,
      "priority": "high|medium|low",
      "timeFrame": "This week|Next few days|When X condition occurs", 
      "category": "goal_support|assessment_followup|coaching_reengagement",
      "suggestedActions": ["targeted coaching conversation", "assessment-specific intervention"],
      "data": {"assessmentTrigger": "low_score_area", "goalStatus": "stagnant", "interventionType": "supportive"}
    }
  ]
}

Focus on intervention timing based on assessment insights and meaningful progress patterns, not login times.
`
  }

  private createPatternCoachingPrompt(context: UserDataContext): string {
    const assessmentPatterns = this.analyzeDeepAssessmentPatterns(context)
    const coachingEvolution = this.analyzeCoachingProgressions(context)

    return `
Provide deep pattern recognition and coaching insights based on assessment responses and coaching evolution:

USER PROFILE:
- Life assessment: Overall ${context.assessmentScores.overall}/100
- Assessment profile: Financial ${context.assessmentScores.financial}, Health ${context.assessmentScores.health}, Social ${context.assessmentScores.social}, Romantic ${context.assessmentScores.romantic}
- Goal focus areas: ${context.goals.slice(0, 3).map(g => g.category).join(', ')}

DEEP ASSESSMENT PATTERN ANALYSIS:
${assessmentPatterns.join('\n')}

COACHING CONVERSATION EVOLUTION:
${coachingEvolution.join('\n')}

GOAL SETTING & ACHIEVEMENT PATTERNS:
${context.goals.map(g => 
  `${g.category}: ${g.status} - ${g.progress}% progress (${Math.round(differenceInDays(new Date(), g.createdAt))} days old, last update ${Math.round(differenceInDays(new Date(), g.updatedAt))} days ago)`
).join('\n')}

SELF-REFLECTION & AWARENESS EVOLUTION:
${context.journalEntries.slice(0, 8).map(j => 
  `${format(j.date, 'MMM dd')}: ${j.mood || 'neutral'} mood - ${j.content ? `journaled (${j.content.length > 50 ? 'detailed' : 'brief'})` : 'no reflection'}`
).join('\n')}

FOCUS: Identify profound patterns in:
- Assessment responses that reveal personality/mindset patterns
- Coaching conversation themes and user's growth/resistance areas
- Goal-setting approaches and success/failure patterns
- Self-awareness development through journaling and reflection
- Correlations between different life domains based on assessment scores

Please return JSON with deep assessment-based insights:
{
  "insights": [
    {
      "title": "Deep assessment pattern insight",
      "message": "Profound insight about their life approach based on assessment responses and coaching",
      "reasoning": "Analysis of assessment patterns and coaching conversation themes that reveal this insight",
      "confidence": 88,
      "priority": "high|medium|low",
      "timeFrame": "Long-term awareness building",
      "category": "self_awareness|life_philosophy|growth_pattern|coaching_responsiveness", 
      "suggestedActions": ["deep self-reflection exercise", "coaching conversation direction"],
      "data": {"assessmentInsight": "key_pattern", "coachingTheme": "growth_area", "awareness_level": "developing"}
    }
  ]
}

Focus on profound insights about their approach to life based on assessment responses and coaching interactions.
`
  }

  private identifyCriticalAssessmentAnswers(context: UserDataContext): string[] {
    const criticalPatterns = []
    
    // Financial red flags
    if (context.assessmentScores.financial < 40) {
      criticalPatterns.push('- Financial score extremely low, indicates potential debt/income issues')
    }
    
    // Health concerns
    if (context.assessmentScores.health < 50) {
      criticalPatterns.push('- Health score below average, may indicate fitness/lifestyle concerns')
    }
    
    // Social isolation indicators
    if (context.assessmentScores.social < 45) {
      criticalPatterns.push('- Social score very low, potential isolation or relationship difficulties')
    }
    
    // Romantic relationship concerns
    if (context.assessmentScores.romantic < 40) {
      criticalPatterns.push('- Romantic score critically low, indicates relationship challenges')
    }
    
    return criticalPatterns.length > 0 ? criticalPatterns : ['- No critical assessment indicators identified']
  }

  private extractAssessmentBehaviorPatterns(context: UserDataContext): string[] {
    const patterns = []
    
    // Goal achievement patterns
    const achievedGoals = context.goals.filter(g => g.status === 'completed').length
    const totalGoals = context.goals.length
    if (totalGoals > 0) {
      patterns.push(`- Goal completion rate: ${Math.round((achievedGoals / totalGoals) * 100)}% (${achievedGoals}/${totalGoals} completed)`)
    }
    
    // Self-awareness patterns
    const journalFrequency = context.journalEntries.length > 0 ? 'Regular journaler' : 'Minimal self-reflection'
    patterns.push(`- Self-reflection pattern: ${journalFrequency}`)
    
    // Life domain balance
    const scores = [context.assessmentScores.financial, context.assessmentScores.health, context.assessmentScores.social, context.assessmentScores.romantic]
    const scoreRange = Math.max(...scores) - Math.min(...scores)
    patterns.push(`- Life balance: ${scoreRange < 20 ? 'Well-balanced' : scoreRange < 40 ? 'Some imbalance' : 'Significant imbalance'} (range: ${scoreRange} points)`)
    
    return patterns
  }

  private analyzeAssessmentStrengthsWeaknesses(context: UserDataContext): string[] {
    const analysis = []
    const scores = {
      financial: context.assessmentScores.financial,
      health: context.assessmentScores.health,
      social: context.assessmentScores.social,
      romantic: context.assessmentScores.romantic
    }
    
    const sortedScores = Object.entries(scores).sort(([,a], [,b]) => b - a)
    
    analysis.push(`- Strongest area: ${sortedScores[0][0]} (${sortedScores[0][1]}/100)`)
    analysis.push(`- Weakest area: ${sortedScores[sortedScores.length-1][0]} (${sortedScores[sortedScores.length-1][1]}/100)`)
    
    const improvementPotential = 100 - sortedScores[sortedScores.length-1][1]
    analysis.push(`- Improvement potential: ${improvementPotential} points in ${sortedScores[sortedScores.length-1][0]}`)
    
    return analysis
  }

  private extractCoachingThemes(context: UserDataContext): string[] {
    const themes = []
    
    if (context.coachingHistory.length === 0) {
      themes.push('- No coaching interactions yet - new user')
      return themes
    }
    
    const recentMessages = context.coachingHistory.slice(0, 5)
    const messageStyles = recentMessages.map(m => m.style).filter(s => s)
    
    if (messageStyles.length > 0) {
      const preferredStyle = messageStyles[0] // Most recent style
      themes.push(`- Preferred coaching style: ${preferredStyle}`)
    }
    
    const avgMessageLength = recentMessages.reduce((acc, msg) => acc + msg.message.length, 0) / recentMessages.length
    themes.push(`- Engagement level: ${avgMessageLength > 100 ? 'High detail' : avgMessageLength > 50 ? 'Moderate' : 'Brief'} interactions`)
    
    themes.push(`- Coaching frequency: ${context.coachingHistory.length} total interactions`)
    
    return themes
  }

  private analyzeDeepAssessmentPatterns(context: UserDataContext): string[] {
    const patterns = []
    
    // Overall life satisfaction pattern
    const overallScore = context.assessmentScores.overall
    if (overallScore > 80) {
      patterns.push('- High achiever profile: Strong across most life domains')
    } else if (overallScore < 50) {
      patterns.push('- Growth-focused profile: Multiple areas need development')
    } else {
      patterns.push('- Balanced improver profile: Steady progress across domains')
    }
    
    // Domain correlation analysis
    const scores = [context.assessmentScores.financial, context.assessmentScores.health, context.assessmentScores.social, context.assessmentScores.romantic]
    const allHigh = scores.every(s => s > 70)
    const allLow = scores.every(s => s < 50)
    
    if (allHigh) {
      patterns.push('- Consistent high performer: Excellence across life domains')
    } else if (allLow) {
      patterns.push('- Universal growth opportunity: All domains need attention')
    } else {
      patterns.push('- Selective focus pattern: Stronger in some areas than others')
    }
    
    return patterns
  }

  private analyzeCoachingProgressions(context: UserDataContext): string[] {
    const progressions = []
    
    if (context.coachingHistory.length === 0) {
      progressions.push('- New to coaching: No conversation history to analyze')
      return progressions
    }
    
    const chronologicalMessages = [...context.coachingHistory].reverse() // Oldest first
    
    if (chronologicalMessages.length >= 3) {
      progressions.push(`- Coaching evolution: From "${chronologicalMessages[0].message.slice(0, 30)}..." to "${chronologicalMessages[chronologicalMessages.length-1].message.slice(0, 30)}..."`)
    }
    
    const recentDays = Math.round(differenceInDays(new Date(), chronologicalMessages[chronologicalMessages.length-1].timestamp))
    progressions.push(`- Last coaching interaction: ${recentDays} days ago`)
    
    progressions.push(`- Coaching engagement: ${context.coachingHistory.length} total conversations`)
    
    return progressions
  }

  private parseAIInsights(aiResponse: any, type: string): AIPredictiveInsight[] {
    if (!aiResponse.insights || !Array.isArray(aiResponse.insights)) {
      return []
    }

    return aiResponse.insights.map((insight: any, index: number) => ({
      id: `ai_${type}_${Date.now()}_${index}`,
      type: type as any,
      confidence: Math.min(100, Math.max(50, insight.confidence || 70)),
      priority: insight.priority || 'medium',
      title: insight.title || `${type} insight`,
      message: insight.message || 'AI-generated insight',
      reasoning: insight.reasoning || 'AI pattern analysis',
      data: insight.data || {},
      actionable: Array.isArray(insight.suggestedActions) && insight.suggestedActions.length > 0,
      suggestedActions: insight.suggestedActions || [],
      timeFrame: insight.timeFrame,
      category: insight.category,
      aiGenerated: true
    }))
  }


  private async getAssessmentData() {
    if (this.useAllAssessments) {
      // Get all completed assessments for the user
      return await prisma.assessment.findMany({
        where: { 
          userId: this.userId, 
          status: 'completed' 
        },
        include: {
          scoreCategory: true,
          scoreOverall: true
        },
        orderBy: { completedAt: 'desc' }
      })
    } else if (this.assessmentId) {
      // Get specific assessment
      return await prisma.assessment.findUnique({
        where: { id: this.assessmentId },
        include: {
          scoreCategory: true,
          scoreOverall: true
        }
      })
    } else {
      // Get latest assessment
      return await prisma.assessment.findFirst({
        where: { 
          userId: this.userId, 
          status: 'completed' 
        },
        include: {
          scoreCategory: true,
          scoreOverall: true
        },
        orderBy: { completedAt: 'desc' }
      })
    }
  }

  private calculateAverageScores(assessments: any[]) {
    if (assessments.length === 0) {
      return {
        overall: 50,
        financial: 50,
        health: 50,
        social: 50,
        romantic: 50,
        career: 50
      }
    }

    const totals = assessments.reduce((acc, assessment) => {
      acc.overall += assessment.scoreOverall?.score || 50
      acc.financial += assessment.scoreCategory?.financial || 50
      acc.health += assessment.scoreCategory?.healthFitness || 50
      acc.social += assessment.scoreCategory?.social || 50
      acc.romantic += assessment.scoreCategory?.romantic || 50
      acc.career += assessment.scoreCategory?.career || 50
      return acc
    }, { overall: 0, financial: 0, health: 0, social: 0, romantic: 0, career: 0 })

    const count = assessments.length
    return {
      overall: Math.round(totals.overall / count),
      financial: Math.round(totals.financial / count),
      health: Math.round(totals.health / count),
      social: Math.round(totals.social / count),
      romantic: Math.round(totals.romantic / count),
      career: totals.career > 0 ? Math.round(totals.career / count) : undefined
    }
  }
}
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { openai } from '@/lib/openai'
import questions from '@/data/questions.json'
import puppeteer from 'puppeteer'
import { promises as fs } from 'fs'
import path from 'path'
import { PDFCache } from '@/lib/utils/pdfCache'

// Helper function to get language instruction for AI prompts
function getLanguageInstruction(languageCode: string): string {
  const languageMap: { [key: string]: string } = {
    'en': 'Respond in English.',
    'es': 'Respond in Spanish (Español).',
    'fr': 'Respond in French (Français).',
    'de': 'Respond in German (Deutsch).'
  }
  return languageMap[languageCode] || languageMap['en']
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id
    
    // Get parameters from query
    const url = new URL(request.url)
    const userLanguage = url.searchParams.get('lang') || 'en'
    const format = url.searchParams.get('format') || 'json'

    // Check if user has purchased the report
    const purchase = await prisma.purchase.findFirst({
      where: {
        assessmentId,
        status: 'completed',
        OR: [
          { product: 'deep_report_oneoff' },
          { product: 'deep_report' }
        ]
      }
    })

    if (!purchase) {
      return NextResponse.json(
        { error: 'Unauthorized - Purchase required' },
        { status: format === 'pdf' ? 403 : 402 }
      )
    }

    // CONSOLIDATED: Handle PDF format (formerly /api/report/[id]/pdf)
    if (format === 'pdf') {
      return await generatePDFReport(assessmentId, userLanguage)
    }

    // Check if a deep report already exists for this assessment
    // Add ability to bypass cache with ?refresh=true
    const shouldRefresh = url.searchParams.get('refresh') === 'true'
    
    if (shouldRefresh) {
      // Clear both file system and database PDF cache when refreshing report
      await PDFCache.invalidateCache(assessmentId)
      
      // Also clear database PDF cache
      try {
        await prisma.deepReport.updateMany({
          where: { assessmentId },
          data: {
            pdfData: null,
            pdfLanguage: null,
            pdfGeneratedAt: null,
            pdfFileSize: null
          }
        })
        console.log(`Cleared database PDF cache for assessment ${assessmentId}`)
      } catch (clearError) {
        console.error('Error clearing database PDF cache:', clearError)
      }
    }
    
    if (!shouldRefresh) {
      const existingReport = await prisma.deepReport.findUnique({
        where: { assessmentId }
      })

      if (existingReport) {
        // Return the cached report
        return NextResponse.json(JSON.parse(existingReport.reportData))
      }
    }

    // Get assessment with all data
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        answers: true,
        scoreCategory: true,
        scoreOverall: true
      }
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    // REAL DEEP ANALYSIS - Question by question breakdown
    
    // Get all questions and create lookup
    const questionLookup = questions.questions.reduce((acc: any, q: any) => {
      acc[q.id] = q
      return acc
    }, {})

    // Get all user's answers - answers are stored as valueRaw (string) and valueNorm (float)
    const userAnswers = assessment.answers.reduce((acc: any, answer: any) => {
      const question = questionLookup[answer.questionId]
      if (!question) {
        console.log(`Question not found for ID: ${answer.questionId}`)
        return acc
      }
      
      // valueRaw appears to be storing the index, not the text
      // Let's try to get the actual option text from the question
      let selectedIndex = 0
      let selectedOption = 'Unknown'
      
      if (answer.valueRaw !== null && answer.valueRaw !== undefined) {
        // Try parsing valueRaw as index
        const rawIndex = parseInt(answer.valueRaw.toString())
        if (!isNaN(rawIndex) && rawIndex >= 0 && rawIndex < question.options.length) {
          selectedIndex = rawIndex
          selectedOption = question.options[rawIndex]
        } else {
          // If it's not a valid index, maybe it's already the text
          selectedOption = answer.valueRaw.toString()
          // Try to find the index for this text
          const foundIndex = question.options.findIndex((opt: string) => opt === selectedOption)
          if (foundIndex >= 0) {
            selectedIndex = foundIndex
          }
        }
      } else if (answer.valueNorm !== null && answer.valueNorm !== undefined) {
        // Fall back to valueNorm
        selectedIndex = Math.round(answer.valueNorm)
        if (selectedIndex >= 0 && selectedIndex < question.options.length) {
          selectedOption = question.options[selectedIndex]
        }
      }
      
      acc[answer.questionId] = {
        selectedIndex: selectedIndex,
        selectedOption: selectedOption,
        valueRaw: answer.valueRaw,
        valueNorm: answer.valueNorm
      }
      return acc
    }, {})

    // Analyze each category with detailed question-by-question insights
    const generateCategoryFallbackStrengths = (categoryId: string, percentile: number): string[] => {
      if (percentile >= 70) {
        const strengthMap: { [key: string]: string } = {
          financial: "Strong financial foundation with above-average performance across key metrics",
          health_fitness: "Excellent health and fitness habits that support long-term wellbeing",
          social: "Well-developed social connections and relationship-building skills",
          romantic: "Strong personal growth mindset and emotional intelligence",
          career: "Solid career trajectory with good professional development",
          personal_growth: "Committed to continuous improvement and self-development"
        }
        return [strengthMap[categoryId] || "Strong performance in this life area"]
      } else if (percentile >= 50) {
        const strengthMap: { [key: string]: string } = {
          financial: "Stable financial management with some areas of strength",
          health_fitness: "Decent health awareness and some good fitness habits",
          social: "Basic social connections with some relationship strengths",
          romantic: "Some areas of personal growth and self-awareness",
          career: "Foundational career skills with some professional strengths",
          personal_growth: "Some commitment to personal development"
        }
        return [strengthMap[categoryId] || "Some strengths in this life area"]
      } else {
        const strengthMap: { [key: string]: string } = {
          financial: "Basic financial awareness with potential for significant improvement",
          health_fitness: "Some health consciousness that can be built upon",
          social: "Existing social connections that can be strengthened and expanded",
          romantic: "Self-awareness that provides foundation for personal growth",
          career: "Professional experience that can be leveraged for advancement",
          personal_growth: "Willingness to assess areas for improvement"
        }
        return [strengthMap[categoryId] || "Foundation for growth in this area"]
      }
    }

    const generateCategoryFallbackOpportunities = (categoryId: string, percentile: number): string[] => {
      const opportunityMap: { [key: string]: string[] } = {
        financial: ["Optimize investment strategy for long-term wealth building", "Improve debt-to-income ratio for greater financial flexibility", "Build stronger emergency fund for financial security"],
        health_fitness: ["Establish more consistent exercise routine for improved fitness", "Optimize nutrition for better energy and health outcomes", "Improve sleep quality for better recovery and performance"],
        social: ["Expand social network to create more diverse relationships", "Develop stronger communication skills for deeper connections", "Build professional networking for career advancement"],
        romantic: ["Develop better emotional intelligence and self-awareness", "Improve communication skills in personal relationships", "Build confidence through personal achievement and growth"],
        career: ["Expand skill set to increase market value and opportunities", "Build stronger professional network for career advancement", "Develop leadership abilities for increased responsibility"],
        personal_growth: ["Set clearer goals and tracking systems for consistent progress", "Develop better habits for sustained personal improvement", "Build accountability systems to maintain growth momentum"]
      }
      
      const opportunities = opportunityMap[categoryId] || ["Significant potential for improvement in this life area"]
      
      // Return different opportunities based on percentile
      if (percentile >= 70) {
        return [opportunities[0]] // High performers get optimization suggestions
      } else if (percentile >= 50) {
        return [opportunities[1]] // Average performers get improvement suggestions
      } else {
        return opportunities.slice(0, 2) // Low performers get multiple fundamental improvements
      }
    }

    const generateCategoryFallbackRecommendations = (categoryId: string, percentile: number): string[] => {
      const recommendationMap: { [key: string]: string[] } = {
        financial: ["Automate savings and investments to ensure consistent progress", "Track all expenses for 30 days to identify optimization opportunities", "Meet with financial advisor to create comprehensive wealth plan"],
        health_fitness: ["Schedule specific workout times and treat them as unmovable appointments", "Meal prep on weekends to ensure consistent healthy nutrition", "Track daily steps and gradually increase weekly targets"],
        social: ["Schedule one social activity per week to maintain and build relationships", "Practice active listening skills in all conversations for deeper connections", "Join one new activity or group to expand social network"],
        romantic: ["Practice daily gratitude and self-reflection for increased self-awareness", "Read one personal development book monthly and implement key insights", "Seek feedback from trusted friends on areas for personal growth"],
        career: ["Identify 3 key skills needed for next career level and create learning plan", "Schedule monthly coffee meetings with industry contacts for networking", "Document achievements and create portfolio to showcase professional value"],
        personal_growth: ["Set up daily 10-minute reflection practice to maintain self-awareness", "Choose one area for focused improvement and track progress weekly", "Create accountability system with friend or coach for sustained progress"]
      }
      
      const recommendations = recommendationMap[categoryId] || ["Focus on consistent daily actions in this life area"]
      
      // Return different recommendations based on percentile
      if (percentile >= 70) {
        return [recommendations[2] || recommendations[0]] // High performers get advanced strategies
      } else if (percentile >= 50) {
        return [recommendations[1] || recommendations[0]] // Average performers get structured approaches
      } else {
        return [recommendations[0]] // Low performers get fundamental first steps
      }
    }

    const generateCategoryAnalysis = async (categoryId: string, categoryName: string) => {
      const categoryQuestions = questions.questions.filter((q: any) => q.category === categoryId)
      const categoryPercentile = categoryId === 'financial' ? assessment.scoreOverall?.percentileFinancial :
                                categoryId === 'health_fitness' ? assessment.scoreOverall?.percentileHealth :
                                categoryId === 'social' ? assessment.scoreOverall?.percentileSocial :
                                categoryId === 'romantic' ? assessment.scoreOverall?.percentileRomantic :
                                categoryId === 'career' ? assessment.scoreOverall?.percentileCareer :
                                categoryId === 'personal_growth' ? assessment.scoreOverall?.percentilePersonalGrowth : 50

      const questionInsights: any[] = []
      let strengths: string[] = []
      let opportunities: string[] = []
      let recommendations: string[] = []

      categoryQuestions.forEach((question: any) => {
        const userAnswer = userAnswers[question.id]
        if (!userAnswer) return

        const selectedIndex = userAnswer.selectedIndex
        const selectedOption = userAnswer.selectedOption
        const totalOptions = question.options.length
        
        // Calculate performance score for this question (0-100)
        const isReversed = question.reverse === true
        let questionScore = isReversed ? 
          ((totalOptions - 1 - selectedIndex) / (totalOptions - 1)) * 100 :
          (selectedIndex / (totalOptions - 1)) * 100

        // Generate specific insights for each question
        let insight = ""
        let strength = ""
        let opportunity = ""
        let recommendation = ""

        // FINANCIAL CATEGORY ANALYSIS
        if (categoryId === 'financial') {
          switch (question.id) {
            case 'fin_net_worth':
              if (selectedIndex >= 4) {
                insight = `Your net worth of ${selectedOption} places you in the top wealth bracket, indicating excellent financial accumulation and asset management.`
                strength = "Strong wealth building and asset accumulation capabilities"
              } else if (selectedIndex >= 2) {
                insight = `Your net worth of ${selectedOption} shows positive financial progress with room for acceleration.`
                opportunity = "Focus on increasing asset accumulation rate through higher savings or investment returns"
                recommendation = "Analyze your biggest expenses and find 1-2 areas to optimize for more wealth building"
              } else {
                insight = `Your current net worth situation (${selectedOption}) presents significant opportunity for financial foundation building.`
                opportunity = "Establish emergency fund and eliminate high-interest debt as immediate priorities"
                recommendation = "Create a debt elimination plan and start with $50/month emergency fund contributions"
              }
              break

            case 'fin_income_avg3y':
              if (selectedIndex >= 4) {
                insight = `Your income of ${selectedOption} provides excellent financial leverage for wealth building and lifestyle optimization.`
                strength = "High income provides strong foundation for all financial goals"
              } else if (selectedIndex >= 2) {
                insight = `Your income level of ${selectedOption} offers solid foundation with optimization potential.`
                recommendation = "Explore income diversification through side projects or skill development for promotion"
              } else {
                insight = `Your income of ${selectedOption} requires strategic focus on both earning potential and expense optimization.`
                opportunity = "Prioritize skill development that directly increases earning capacity in your field"
              }
              break

            case 'fin_income_trend':
              if (selectedIndex >= 3) {
                insight = `Your income having ${selectedOption} demonstrates excellent career trajectory and financial momentum.`
                strength = "Positive income growth indicates career advancement and expanding opportunities"
              } else if (selectedIndex === 2) {
                insight = `Your income ${selectedOption} provides stability but limited growth momentum.`
                recommendation = "Explore opportunities for income growth through skill development, certifications, or new responsibilities"
              } else {
                insight = `Your income having ${selectedOption} creates financial pressure and limits wealth building capacity.`
                opportunity = "Reversing income decline is critical for long-term financial security and stress reduction"
                recommendation = "Assess causes of income reduction and create action plan to restore earning growth through skills, networking, or career pivot"
              }
              break

            case 'fin_savings_rate':
              if (selectedIndex >= 4) {
                insight = `Saving ${selectedOption} demonstrates exceptional financial discipline and long-term thinking.`
                strength = "Outstanding savings discipline that will compound significantly over time"
              } else if (selectedIndex >= 2) {
                insight = `Your savings rate of ${selectedOption} shows good financial awareness with room for improvement.`
                recommendation = "Gradually increase savings rate by 1-2% each quarter through expense optimization"
              } else {
                insight = `Your current savings pattern (${selectedOption}) needs immediate attention for financial security.`
                opportunity = "Focus on expense tracking and finding your biggest spending leaks to redirect toward savings"
                recommendation = "Start with automating just $25/week into savings to build the habit"
              }
              break

            case 'fin_emergency_fund':
              if (selectedIndex >= 3) {
                insight = `Your emergency fund covering ${selectedOption} provides excellent financial security and peace of mind.`
                strength = "Strong financial safety net that protects against unexpected expenses"
              } else if (selectedIndex >= 1) {
                insight = `Your emergency fund of ${selectedOption} is a good start but needs expansion for full security.`
                opportunity = "Gradually build emergency fund to 6 months of expenses for optimal financial security"
                recommendation = "Automate $100-200/month into high-yield savings until you reach 6-month target"
              } else {
                insight = `Having ${selectedOption} emergency fund creates significant financial vulnerability.`
                opportunity = "Building emergency fund should be your immediate #1 financial priority"
                recommendation = "Start with $25/week automatic transfer to separate savings account for emergencies only"
              }
              break

            case 'fin_high_interest_debt':
              if (selectedIndex === 0) {
                insight = `Having no high-interest debt demonstrates excellent financial discipline and debt management.`
                strength = "Excellent debt management - avoiding wealth-destroying high-interest payments"
              } else {
                insight = `Carrying ${selectedOption} in high-interest debt is significantly impacting your wealth building potential.`
                opportunity = "Eliminating high-interest debt should be immediate priority - likely earning 18-25% guaranteed return"
                recommendation = "Use debt avalanche method: pay minimums on all debts, extra payments on highest interest rate debt"
              }
              break

            case 'fin_investment_portfolio':
              if (selectedIndex >= 4) {
                insight = `Your investment portfolio of ${selectedOption} shows excellent long-term wealth building strategy.`
                strength = "Strong investment discipline that will compound significantly over decades"
              } else if (selectedIndex >= 2) {
                insight = `Your portfolio value of ${selectedOption} is a good foundation for long-term wealth building.`
                recommendation = "Consider increasing monthly contributions to investments by 20-30% if cash flow allows"
              } else {
                insight = `Your investment level (${selectedOption}) needs immediate attention for long-term financial security.`
                opportunity = "Start investing immediately - even $50/month in index funds will compound significantly over time"
                recommendation = "Open low-cost index fund account and automate $50-100/month contributions"
              }
              break

            case 'fin_retirement_savings':
              if (selectedIndex >= 4) {
                insight = `Contributing ${selectedOption} monthly to retirement shows exceptional long-term planning.`
                strength = "Outstanding retirement planning that will provide financial security in later years"
              } else if (selectedIndex >= 2) {
                insight = `Your retirement contributions of ${selectedOption} are solid but could be optimized.`
                recommendation = "Consider increasing contributions by 20% to accelerate retirement timeline"
              } else {
                insight = `Contributing ${selectedOption} to retirement significantly limits your future financial security.`
                opportunity = "Starting retirement savings immediately is crucial - time is your biggest advantage"
                recommendation = "Start with 10% of income to retirement accounts, increase by 1% each year"
              }
              break

            case 'fin_debt_payments':
              if (selectedIndex <= 1) {
                insight = `Having ${selectedOption} in debt payments demonstrates excellent debt management.`
                strength = "Low debt burden maximizes cash flow for wealth building"
              } else if (selectedIndex <= 3) {
                insight = `Your debt payments of ${selectedOption} are manageable but limit wealth building capacity.`
                recommendation = "Focus on paying down debt aggressively to free up cash flow for investments"
              } else {
                insight = `Debt payments of ${selectedOption} significantly constrain your financial options and wealth building.`
                opportunity = "Debt reduction should be immediate priority to free up cash flow"
                recommendation = "Create debt avalanche plan and consider debt consolidation options"
              }
              break

            case 'fin_real_estate':
              if (selectedIndex >= 2) {
                insight = `Your real estate ownership (${selectedOption}) shows excellent asset diversification and wealth building.`
                strength = "Real estate ownership provides both shelter and investment returns"
              } else if (selectedIndex === 1) {
                insight = `Owning your ${selectedOption} provides stability and builds equity over time.`
                strength = "Primary residence ownership builds wealth and provides housing stability"
              } else {
                insight = `Having ${selectedOption} real estate limits wealth building through property appreciation.`
                opportunity = "Consider homeownership when financially stable for wealth building benefits"
                recommendation = "Focus on improving credit score and saving for down payment"
              }
              break

            case 'fin_financial_stress':
              if (selectedIndex >= 3) {
                insight = `Being ${selectedOption} about finances indicates excellent financial management and security.`
                strength = "Low financial stress supports better decision-making and overall wellbeing"
              } else {
                insight = `Feeling ${selectedOption} about finances impacts your mental health and decision quality.`
                opportunity = "Reducing financial stress through better planning would improve all life areas"
                recommendation = "Create detailed budget and emergency fund to reduce financial anxiety"
              }
              break

            case 'fin_insurance_coverage':
              if (selectedIndex >= 4) {
                insight = `Having ${selectedOption} insurance shows excellent risk management and financial protection.`
                strength = "Comprehensive insurance protects against financial catastrophe"
              } else if (selectedIndex >= 2) {
                insight = `Your insurance coverage (${selectedOption}) provides basic protection with room for improvement.`
                recommendation = "Consider adding life and disability insurance for comprehensive protection"
              } else {
                insight = `Having ${selectedOption} insurance creates significant financial vulnerability.`
                opportunity = "Basic insurance coverage is essential to protect against financial ruin"
                recommendation = "Start with health insurance, then add auto and basic life insurance"
              }
              break
          }
        }

        // HEALTH & FITNESS CATEGORY ANALYSIS  
        if (categoryId === 'health_fitness') {
          switch (question.id) {
            case 'health_exercise_freq':
              if (selectedIndex >= 4) {
                insight = `Exercising ${selectedOption} days per week demonstrates exceptional commitment to physical fitness.`
                strength = "Outstanding exercise consistency that will compound into excellent long-term health"
              } else if (selectedIndex >= 2) {
                insight = `Your exercise frequency of ${selectedOption} days/week is solid with room for optimization.`
                recommendation = "Gradually add one more exercise day per month until reaching 4-5 days consistently"
              } else {
                insight = `Exercising ${selectedOption} days per week significantly limits your health and energy potential.`
                opportunity = "Building consistent exercise habit should be immediate priority for energy and health"
                recommendation = "Start with 15-minute daily walks, then add 2 strength sessions per week"
              }
              break

            case 'health_training_minutes':
              if (selectedIndex >= 3) {
                insight = `Training ${selectedOption} minutes weekly shows excellent commitment to comprehensive fitness.`
                strength = "Meeting or exceeding recommended exercise guidelines for optimal health benefits"
              } else if (selectedIndex >= 1) {
                insight = `Your ${selectedOption} weekly training minutes is a good start but below optimal health recommendations.`
                recommendation = "Gradually increase to 150-300 minutes/week through longer sessions or additional days"
              } else {
                insight = `Training ${selectedOption} minutes weekly significantly impacts your physical and mental health potential.`
                opportunity = "Immediate priority: establish basic exercise routine for energy, mood, and longevity"
                recommendation = "Start with 20-minute walks 3x/week, then add basic bodyweight exercises"
              }
              break

            case 'health_sleep':
              if (selectedIndex === 3) { // 7-8 hours is optimal
                insight = `Sleeping ${selectedOption} hours nightly is in the optimal range for health, recovery, and performance.`
                strength = "Excellent sleep habits that support all other aspects of health and performance"
              } else {
                insight = `Your sleep pattern of ${selectedOption} hours is impacting your health, energy, and cognitive performance.`
                opportunity = "Optimizing sleep to 7-8 hours nightly would significantly improve all life areas"
                recommendation = "Create consistent bedtime routine and eliminate screens 1 hour before target bedtime"
              }
              break

            case 'health_nutrition':
              if (selectedIndex >= 3) {
                insight = `Your nutrition approach (${selectedOption}) provides excellent foundation for health and energy.`
                strength = "Strong nutritional foundation supporting optimal health and performance"
              } else if (selectedIndex >= 2) {
                insight = `Your nutrition habits (${selectedOption}) are adequate but have significant optimization potential.`
                recommendation = "Focus on meal prep for 3-4 healthy meals per week to improve consistency"
              } else {
                insight = `Your current nutrition pattern (${selectedOption}) is significantly impacting energy, health, and mood.`
                opportunity = "Nutrition improvement would provide immediate energy and long-term health benefits"
                recommendation = "Start with replacing one processed meal daily with whole foods (vegetables, lean protein)"
              }
              break

            case 'health_pushups':
              if (selectedIndex >= 4) {
                insight = `Being able to do ${selectedOption} pushups demonstrates excellent upper body strength and fitness.`
                strength = "Strong functional strength that supports daily activities and overall fitness"
              } else if (selectedIndex >= 2) {
                insight = `Your pushup capacity (${selectedOption}) shows decent strength with room for improvement.`
                recommendation = "Do pushup progression training 3x/week to build to 25+ pushups"
              } else {
                insight = `Your pushup ability (${selectedOption}) indicates significant opportunity for strength building.`
                opportunity = "Building basic functional strength would improve daily life and long-term health"
                recommendation = "Start with wall pushups or knee pushups, progress weekly until achieving standard pushups"
              }
              break

            case 'health_mental_health':
              if (selectedIndex >= 3) {
                insight = `Rating your mental health as ${selectedOption} indicates strong psychological well-being.`
                strength = "Strong mental health foundation supporting all life areas and relationships"
              } else {
                insight = `Your mental health rating (${selectedOption}) suggests this should be a priority focus area.`
                opportunity = "Improving mental health would positively impact all other life categories"
                recommendation = "Consider professional support, meditation practice, or stress management techniques"
              }
              break

            case 'health_height':
            case 'health_weight':
            case 'health_waist':
              // These are descriptive metrics, focus on overall health patterns
              insight = `Your physical measurements (${selectedOption}) are part of your overall health profile.`
              recommendation = "Focus on sustainable nutrition and exercise habits rather than just measurements"
              break

            case 'health_pullups':
              if (selectedIndex >= 3) {
                insight = `Being able to do ${selectedOption} pull-ups demonstrates excellent upper body and core strength.`
                strength = "Strong functional pulling strength that supports posture and overall fitness"
              } else if (selectedIndex >= 1) {
                insight = `Your pull-up ability (${selectedOption}) shows developing strength with room for improvement.`
                recommendation = "Use assisted pull-up progressions or resistance bands to build to 5+ pull-ups"
              } else {
                insight = `Currently doing ${selectedOption} pull-ups indicates significant opportunity for strength building.`
                opportunity = "Pull-ups are excellent functional strength indicators - building this capacity improves overall fitness"
                recommendation = "Start with dead hangs, then negative pull-ups, progress to assisted pull-ups"
              }
              break

            case 'health_cooper_or_5k':
              if (selectedIndex >= 4) {
                insight = `Your cardiovascular fitness (${selectedOption}) demonstrates outstanding aerobic capacity.`
                strength = "Excellent cardiovascular health that supports longevity and daily energy"
              } else if (selectedIndex >= 2) {
                insight = `Your cardio fitness level (${selectedOption}) is solid with room for improvement.`
                recommendation = "Gradually increase running distance/time by 10% weekly to improve aerobic capacity"
              } else {
                insight = `Your cardiovascular condition (${selectedOption}) significantly limits daily energy and long-term health.`
                opportunity = "Improving cardio fitness would immediately boost energy levels and long-term health outcomes"
                recommendation = "Start with daily 10-minute walks, progress to jogging intervals over 8 weeks"
              }
              break

            case 'health_alcohol':
              if (selectedIndex === 0) {
                insight = `Consuming ${selectedOption} alcohol demonstrates excellent health discipline and liver protection.`
                strength = "Avoiding alcohol eliminates health risks and supports optimal physical performance"
              } else if (selectedIndex <= 2) {
                insight = `Your alcohol consumption (${selectedOption}) is within moderate guidelines.`
                recommendation = "Continue moderate consumption or consider reducing further for optimal health benefits"
              } else {
                insight = `Consuming ${selectedOption} alcohol weekly may be impacting your health, sleep, and performance.`
                opportunity = "Reducing alcohol intake would improve sleep quality, energy, and long-term health"
                recommendation = "Consider reducing to 1-2 drinks per week and monitor improvements in energy/sleep"
              }
              break

            case 'health_stress_management':
              if (selectedIndex >= 3) {
                insight = `Using ${selectedOption} for stress management shows excellent mental health practices.`
                strength = "Strong stress management toolkit that supports resilience and performance"
              } else if (selectedIndex >= 1) {
                insight = `Your stress management approach (${selectedOption}) is a good start but could be enhanced.`
                recommendation = "Add one consistent daily practice like meditation or deep breathing exercises"
              } else {
                insight = `Having ${selectedOption} stress management practices leaves you vulnerable to burnout and health issues.`
                opportunity = "Building stress management skills is essential for both mental and physical health"
                recommendation = "Start with 5 minutes daily of breathing exercises or meditation apps"
              }
              break

            case 'health_medical_checkups':
              if (selectedIndex >= 3) {
                insight = `Your approach to checkups (${selectedOption}) demonstrates excellent preventive health care.`
                strength = "Proactive healthcare approach that catches issues early and maintains optimal health"
              } else if (selectedIndex >= 1) {
                insight = `Your medical care pattern (${selectedOption}) provides basic coverage but could be more proactive.`
                recommendation = "Schedule annual preventive checkups even when feeling healthy"
              } else {
                insight = `Your healthcare approach (${selectedOption}) creates significant risk for undetected health issues.`
                opportunity = "Regular preventive care catches problems early when they're most treatable"
                recommendation = "Schedule comprehensive physical exam and establish relationship with primary care doctor"
              }
              break

            case 'health_energy_levels':
              if (selectedIndex >= 3) {
                insight = `Having ${selectedOption} indicates excellent overall health optimization and lifestyle balance.`
                strength = "High energy levels support productivity, mood, and overall life satisfaction"
              } else {
                insight = `Experiencing ${selectedOption} significantly impacts your productivity and life enjoyment.`
                opportunity = "Improving energy through sleep, nutrition, and exercise would enhance all life areas"
                recommendation = "Focus on sleep optimization, regular exercise, and balanced nutrition for energy improvement"
              }
              break
          }
        }

        // SOCIAL CATEGORY ANALYSIS
        if (categoryId === 'social') {
          switch (question.id) {
            case 'social_emergency_contacts':
              if (selectedIndex >= 3) {
                insight = `Having ${selectedOption} people you could ask for $1,000 shows excellent social support network.`
                strength = "Strong financial safety network indicating deep, trusting relationships"
              } else if (selectedIndex >= 1) {
                insight = `Having ${selectedOption} emergency contacts is a foundation but could be strengthened.`
                recommendation = "Invest in deepening 2-3 existing relationships through regular contact and mutual support"
              } else {
                insight = `Having ${selectedOption} emergency financial contacts indicates isolation that needs attention.`
                opportunity = "Building trusted relationships should be immediate priority for life satisfaction and security"
                recommendation = "Join one community group or activity where you can build consistent relationships over time"
              }
              break

            case 'social_close_friends':
              if (selectedIndex >= 3) {
                insight = `Having ${selectedOption} close confidants demonstrates excellent emotional support system.`
                strength = "Strong emotional support network that enhances resilience and life satisfaction"
              } else if (selectedIndex >= 1) {
                insight = `Having ${selectedOption} close friend(s) is valuable but expanding your inner circle would be beneficial.`
                recommendation = "Deepen one existing friendship by initiating more personal conversations and shared experiences"
              } else {
                insight = `Having ${selectedOption} close friends to confide in creates emotional vulnerability and isolation.`
                opportunity = "Building intimate friendships is crucial for mental health and life satisfaction"
                recommendation = "Join activity groups aligned with your interests and gradually share more personally with compatible people"
              }
              break

            case 'social_meetups':
              if (selectedIndex >= 3) {
                insight = `Meeting friends ${selectedOption} demonstrates excellent social engagement and relationship maintenance.`
                strength = "Consistent social connection that supports mental health and relationship depth"
              } else {
                insight = `Meeting friends ${selectedOption} limits relationship depth and social support benefits.`
                opportunity = "Increasing face-to-face social time would significantly improve relationship quality and personal wellbeing"
                recommendation = "Schedule weekly coffee/meal with different friends to strengthen your social network"
              }
              break

            case 'social_professional_network':
              if (selectedIndex >= 3) {
                insight = `Having ${selectedOption} people who'd provide job leads shows excellent professional networking.`
                strength = "Strong professional network that enhances career opportunities and security"
              } else {
                insight = `Having ${selectedOption} professional contacts limits career opportunities and advancement potential.`
                opportunity = "Building professional network would accelerate career growth and provide opportunities"
                recommendation = "Attend one industry event monthly and follow up with 2-3 new contacts each time"
              }
              break

            case 'social_initiation':
              if (selectedIndex >= 3) {
                insight = `${selectedOption} initiating plans demonstrates strong leadership and social confidence.`
                strength = "Social leadership that strengthens relationships and creates opportunities"
              } else if (selectedIndex >= 1) {
                insight = `${selectedOption} initiating plans is balanced but you could take more social leadership.`
                recommendation = "Try initiating one social activity per week to strengthen relationships"
              } else {
                insight = `${selectedOption} initiating plans may signal social passivity or lack of confidence.`
                opportunity = "Taking more initiative in social situations would strengthen relationships and confidence"
                recommendation = "Start small - text one friend each week to make specific plans"
              }
              break

            case 'social_circle_diversity':
              if (selectedIndex >= 2) {
                insight = `Having ${selectedOption} shows excellent social diversity and broad relationship skills.`
                strength = "Diverse social connections provide varied perspectives and opportunities"
              } else if (selectedIndex === 1) {
                insight = `Having ${selectedOption} provides some social variety but could be expanded.`
                recommendation = "Join one new activity or group to diversify your social connections"
              } else {
                insight = `Having ${selectedOption} limits your exposure to different perspectives and opportunities.`
                opportunity = "Diversifying social circles would broaden perspectives and create new opportunities"
                recommendation = "Join a club, sports team, or volunteer organization outside your usual social sphere"
              }
              break

            case 'social_community':
              if (selectedIndex >= 2) {
                insight = `Participating in ${selectedOption} community groups shows excellent civic engagement.`
                strength = "Active community involvement that builds relationships and contributes to society"
              } else if (selectedIndex === 1) {
                insight = `Being involved in ${selectedOption} community group is valuable but could be expanded.`
                recommendation = "Consider adding one more community activity that aligns with your interests or values"
              } else {
                insight = `Having ${selectedOption} community involvement limits your sense of purpose and connection.`
                opportunity = "Community engagement would provide meaning, relationships, and personal growth"
                recommendation = "Find one cause you care about and commit to volunteering 2 hours per month"
              }
              break

            case 'social_loneliness':
              if (selectedIndex === 0) {
                insight = `${selectedOption} feeling lonely indicates excellent social connection and support.`
                strength = "Strong social bonds that provide emotional security and life satisfaction"
              } else if (selectedIndex <= 1) {
                insight = `${selectedOption} feeling lonely suggests generally good social health with occasional gaps.`
                recommendation = "Maintain current social connections and consider deepening 1-2 key relationships"
              } else {
                insight = `${selectedOption} feeling lonely significantly impacts mental health and life satisfaction.`
                opportunity = "Addressing loneliness is crucial for mental health and overall wellbeing"
                recommendation = "Join social groups aligned with your interests and practice vulnerable sharing with close friends"
              }
              break

            case 'social_family_relationships':
              if (selectedIndex >= 3) {
                insight = `Rating family relationships as ${selectedOption} indicates strong family bonds and support.`
                strength = "Strong family relationships provide emotional security and life foundation"
              } else if (selectedIndex >= 2) {
                insight = `Your family relationships (${selectedOption}) are adequate but could be strengthened.`
                recommendation = "Invest in improving one key family relationship through regular contact and quality time"
              } else {
                insight = `Having ${selectedOption} family relationships creates emotional stress and limits support.`
                opportunity = "Improving family dynamics would reduce stress and increase life satisfaction"
                recommendation = "Consider family therapy or focus on one relationship improvement at a time"
              }
              break

            case 'social_conflict_resolution':
              if (selectedIndex >= 3) {
                insight = `Being able to ${selectedOption} interpersonal conflicts shows excellent emotional intelligence.`
                strength = "Strong conflict resolution skills that support healthy relationships"
              } else if (selectedIndex >= 1) {
                insight = `Your conflict approach (${selectedOption}) is functional but could be improved.`
                recommendation = "Practice active listening and 'I' statements to improve conflict resolution"
              } else {
                insight = `Tending to ${selectedOption} conflicts creates relationship stress and unresolved issues.`
                opportunity = "Learning conflict resolution skills would dramatically improve all relationships"
                recommendation = "Read books on conflict resolution or consider therapy to develop these crucial skills"
              }
              break

            case 'social_giving_back':
              if (selectedIndex >= 3) {
                insight = `Your ${selectedOption} commitment to giving back shows excellent values and community connection.`
                strength = "Strong sense of purpose and community contribution that enhances life meaning"
              } else if (selectedIndex >= 1) {
                insight = `Your giving back approach (${selectedOption}) is positive but could be expanded.`
                recommendation = "Consider increasing community involvement to once monthly for greater impact and fulfillment"
              } else {
                insight = `${selectedOption} giving back to community limits your sense of purpose and connection.`
                opportunity = "Volunteering would provide meaning, relationships, and perspective on life challenges"
                recommendation = "Find one cause that matters to you and commit to 2 hours of service monthly"
              }
              break
          }
        }

        // ROMANTIC CATEGORY ANALYSIS
        if (categoryId === 'romantic') {
          switch (question.id) {
            case 'rom_satisfaction':
              if (selectedIndex >= 3) {
                insight = `Your relationship satisfaction level (${selectedOption}) indicates strong romantic fulfillment.`
                strength = "High relationship satisfaction that positively impacts overall life happiness and stability"
              } else {
                insight = `Your relationship satisfaction (${selectedOption}) suggests this area needs focused attention.`
                opportunity = "Improving romantic relationship quality would enhance overall life satisfaction"
                recommendation = "Focus on communication skills, quality time, and addressing specific relationship concerns"
              }
              break

            case 'rom_communication':
              if (selectedIndex >= 3) {
                insight = `Rating communication as ${selectedOption} shows strong relationship foundation and conflict resolution skills.`
                strength = "Excellent communication skills that support healthy relationships and personal growth"
              } else {
                insight = `Communication quality (${selectedOption}) is a key area for relationship improvement.`
                opportunity = "Better communication skills would improve all relationships, not just romantic ones"
                recommendation = "Practice active listening and learn to express needs clearly and non-defensively"
              }
              break

            case 'rom_confidence':
              if (selectedIndex >= 3) {
                insight = `Having ${selectedOption} confidence with attractive people shows strong self-esteem and social skills.`
                strength = "Strong romantic confidence that opens opportunities for meaningful connections"
              } else {
                insight = `Your confidence level (${selectedOption}) may be limiting romantic opportunities and connections.`
                opportunity = "Building social confidence would improve romantic prospects and overall self-esteem"
                recommendation = "Practice social interactions in low-pressure settings and work on self-improvement for confidence building"
              }
              break

            case 'rom_status':
              if (selectedIndex >= 2) {
                insight = `Being in a ${selectedOption} indicates commitment and relationship stability.`
                strength = "Committed relationship provides emotional support and life partnership"
              } else if (selectedIndex === 1) {
                insight = `Currently ${selectedOption} suggests exploring relationships while maintaining independence.`
                recommendation = "Clarify what you want from relationships and communicate boundaries clearly"
              } else {
                insight = `Being ${selectedOption} provides freedom but may limit emotional support and companionship.`
                opportunity = "Consider whether you want to actively pursue romantic connections for emotional fulfillment"
                recommendation = "Reflect on your relationship goals and take steps toward meaningful connections if desired"
              }
              break

            case 'rom_duration':
              if (selectedIndex >= 3) {
                insight = `A relationship lasting ${selectedOption} demonstrates strong compatibility and commitment.`
                strength = "Long-term relationship stability that builds deep emotional bonds and shared life experiences"
              } else if (selectedIndex >= 1) {
                insight = `Your relationship duration of ${selectedOption} is building a solid foundation.`
                recommendation = "Focus on deepening communication and shared experiences to strengthen the bond"
              } else {
                insight = `A relationship duration of ${selectedOption} is still in early stages of development.`
                recommendation = "Take time to really get to know each other and build trust gradually"
              }
              break

            case 'rom_intimacy_or_dates':
              if (selectedIndex >= 3) {
                insight = `Your intimacy/dating frequency (${selectedOption}) indicates strong romantic and physical connection.`
                strength = "Healthy romantic and physical relationship that supports emotional bonding"
              } else if (selectedIndex >= 1) {
                insight = `Your intimacy/dating pattern (${selectedOption}) is moderate but could potentially be enhanced.`
                recommendation = "Communicate with your partner about both emotional and physical intimacy needs"
              } else {
                insight = `Low intimacy/dating frequency (${selectedOption}) may indicate relationship challenges or personal barriers.`
                opportunity = "Addressing intimacy concerns could significantly improve relationship satisfaction and connection"
                recommendation = "Have open conversations about intimacy needs and consider couples therapy if needed"
              }
              break

            case 'rom_emotional_intelligence':
              if (selectedIndex >= 3) {
                insight = `Having ${selectedOption} emotional intelligence in relationships shows excellent interpersonal skills.`
                strength = "Strong emotional intelligence that supports healthy relationship dynamics and conflict resolution"
              } else if (selectedIndex >= 1) {
                insight = `Your emotional intelligence (${selectedOption}) is developing but has room for growth.`
                recommendation = "Practice recognizing and expressing emotions clearly in romantic contexts"
              } else {
                insight = `${selectedOption} emotional intelligence may be creating relationship challenges and misunderstandings.`
                opportunity = "Developing emotional intelligence would dramatically improve romantic relationships and satisfaction"
                recommendation = "Read about emotional intelligence, practice empathy, and consider therapy for relationship skills"
              }
              break

            case 'rom_future_planning':
              if (selectedIndex >= 3) {
                insight = `Having ${selectedOption} with your partner shows excellent alignment and commitment.`
                strength = "Strong shared vision for the future that supports relationship stability and goal achievement"
              } else if (selectedIndex >= 1) {
                insight = `Your future planning approach (${selectedOption}) provides some direction but could be clearer.`
                recommendation = "Have deeper conversations about long-term goals and how they align with your partner"
              } else {
                insight = `Having ${selectedOption} future planning may indicate uncertainty about relationship direction.`
                opportunity = "Clarifying future goals and compatibility would strengthen relationship foundation"
                recommendation = "Discuss important life goals, values, and timeline expectations with your partner"
              }
              break
          }
        }

        // CAREER CATEGORY ANALYSIS
        if (categoryId === 'career') {
          switch (question.id) {
            case 'career_satisfaction':
              if (selectedIndex >= 3) {
                insight = `Being ${selectedOption} with your career indicates strong alignment between work and personal fulfillment.`
                strength = "High career satisfaction that supports overall life happiness and motivation"
              } else if (selectedIndex >= 2) {
                insight = `Your career satisfaction (${selectedOption}) is balanced but could be improved.`
                recommendation = "Identify specific aspects of work that could be enhanced and create action plan"
              } else {
                insight = `Feeling ${selectedOption} with your career significantly impacts daily motivation and life satisfaction.`
                opportunity = "Improving career satisfaction would enhance overall wellbeing and life fulfillment"
                recommendation = "Consider career coaching, skill development, or exploring new opportunities aligned with your values"
              }
              break

            case 'career_growth':
              if (selectedIndex >= 3) {
                insight = `Experiencing ${selectedOption} in career shows excellent professional development and opportunities.`
                strength = "Strong career trajectory that builds skills, influence, and earning potential"
              } else if (selectedIndex >= 2) {
                insight = `Your career being ${selectedOption} suggests stability but limited growth opportunities.`
                opportunity = "Seeking growth opportunities would accelerate professional development and satisfaction"
                recommendation = "Proactively seek new projects, responsibilities, or roles that challenge and develop you"
              } else {
                insight = `Career experiencing ${selectedOption} creates professional frustration and limits future opportunities.`
                opportunity = "Addressing career decline should be immediate priority for professional and financial security"
                recommendation = "Assess what's causing setbacks and create plan to regain momentum through skills, networking, or role changes"
              }
              break

            case 'career_skills_development':
              if (selectedIndex >= 3) {
                insight = `Investing ${selectedOption} in skill development shows excellent commitment to professional growth.`
                strength = "Strong learning mindset that keeps you competitive and valuable in changing job market"
              } else if (selectedIndex >= 1) {
                insight = `Spending ${selectedOption} on skills is good but could be increased for competitive advantage.`
                recommendation = "Gradually increase learning time to 5-10 hours weekly for accelerated professional development"
              } else {
                insight = `Investing ${selectedOption} in skill development puts you at risk of becoming professionally obsolete.`
                opportunity = "Regular skill development is essential for career security and advancement in today's economy"
                recommendation = "Commit to 2-3 hours weekly of industry-relevant learning through courses, books, or practice"
              }
              break

            case 'career_work_life_balance':
              if (selectedIndex >= 3) {
                insight = `Having ${selectedOption} work-life balance indicates healthy boundaries and sustainable career approach.`
                strength = "Excellent work-life integration that supports both professional success and personal wellbeing"
              } else if (selectedIndex >= 1) {
                insight = `Your work-life balance (${selectedOption}) is manageable but could be optimized.`
                recommendation = "Set clearer boundaries around work hours and protect time for personal activities and relationships"
              } else {
                insight = `Having ${selectedOption} work-life balance creates stress and limits personal relationships and health.`
                opportunity = "Improving work-life balance would enhance both job performance and personal satisfaction"
                recommendation = "Evaluate workload, set boundaries, and consider whether current role is sustainable long-term"
              }
              break

            case 'career_leadership':
              if (selectedIndex >= 3) {
                insight = `Having ${selectedOption} responsibilities shows strong career progression and trust from others.`
                strength = "Leadership experience that develops valuable skills and opens senior career opportunities"
              } else if (selectedIndex >= 1) {
                insight = `Your leadership level (${selectedOption}) provides some influence but could be expanded.`
                recommendation = "Seek opportunities to lead projects or mentor others to develop leadership skills"
              } else {
                insight = `Having ${selectedOption} limits your influence and career advancement potential.`
                opportunity = "Developing leadership skills would significantly accelerate career growth and earning potential"
                recommendation = "Volunteer to lead small projects and develop skills in communication, delegation, and team building"
              }
              break

            case 'career_networking':
              if (selectedIndex >= 3) {
                insight = `Your ${selectedOption} networking shows excellent professional relationship building.`
                strength = "Strong professional network that creates opportunities and industry influence"
              } else if (selectedIndex >= 1) {
                insight = `Your networking approach (${selectedOption}) is decent but could be more strategic.`
                recommendation = "Attend one industry event monthly and follow up with new contacts consistently"
              } else {
                insight = `${selectedOption} professional networking significantly limits career opportunities and industry awareness.`
                opportunity = "Building professional network would accelerate career growth and provide valuable opportunities"
                recommendation = "Join one professional organization and commit to attending monthly events to build relationships"
              }
              break
          }
        }

        // PERSONAL GROWTH CATEGORY ANALYSIS
        if (categoryId === 'personal_growth') {
          switch (question.id) {
            case 'personal_goal_achievement':
              if (selectedIndex >= 3) {
                insight = `${selectedOption} your personal goals demonstrates excellent self-discipline and planning.`
                strength = "Strong goal achievement capability that builds confidence and creates positive life momentum"
              } else if (selectedIndex >= 1) {
                insight = `${selectedOption} your goals shows some progress but could be improved with better systems.`
                recommendation = "Break goals into smaller steps and create accountability systems for better achievement"
              } else {
                insight = `${selectedOption} your personal goals may indicate poor planning or unrealistic expectations.`
                opportunity = "Improving goal achievement would build confidence and accelerate personal development"
                recommendation = "Start with smaller, specific goals and build systems for tracking and accountability"
              }
              break

            case 'personal_learning':
              if (selectedIndex >= 3) {
                insight = `Having a ${selectedOption} demonstrates excellent growth mindset and intellectual curiosity.`
                strength = "Strong learning orientation that keeps you adaptable and continuously growing"
              } else if (selectedIndex >= 1) {
                insight = `Learning ${selectedOption} is positive but could be increased for accelerated growth.`
                recommendation = "Schedule 30 minutes daily for learning something new outside your work domain"
              } else {
                insight = `${selectedOption} learning new skills limits your personal development and adaptability.`
                opportunity = "Regular learning would expand your capabilities and keep you mentally sharp"
                recommendation = "Commit to reading one book monthly or taking one online course quarterly"
              }
              break

            case 'personal_creativity':
              if (selectedIndex >= 3) {
                insight = `Having ${selectedOption} shows excellent creative expression and personal fulfillment.`
                strength = "Strong creative outlet that supports mental health and provides personal satisfaction"
              } else if (selectedIndex >= 1) {
                insight = `Your creative engagement (${selectedOption}) provides some outlets but could be expanded.`
                recommendation = "Dedicate 2-3 hours weekly to a creative activity you genuinely enjoy"
              } else {
                insight = `Having ${selectedOption} creative pursuits limits self-expression and personal fulfillment.`
                opportunity = "Creative activities would enhance mental health, self-expression, and life satisfaction"
                recommendation = "Explore one creative activity that interests you - art, music, writing, crafting, or building"
              }
              break

            case 'personal_mindfulness':
              if (selectedIndex >= 3) {
                insight = `Having ${selectedOption} mindfulness practice shows excellent self-awareness and emotional regulation.`
                strength = "Strong mindfulness foundation that supports mental health and decision-making quality"
              } else if (selectedIndex >= 1) {
                insight = `Your mindfulness approach (${selectedOption}) is beneficial but could be deepened.`
                recommendation = "Increase mindfulness practice to daily 10-15 minute sessions for greater benefits"
              } else {
                insight = `Having ${selectedOption} mindfulness practice limits self-awareness and emotional regulation.`
                opportunity = "Regular mindfulness would improve decision-making, relationships, and overall life satisfaction"
                recommendation = "Start with 5 minutes daily of meditation, breathing exercises, or reflective journaling"
              }
              break

            case 'personal_values_alignment':
              if (selectedIndex >= 3) {
                insight = `Your life being ${selectedOption} with your values indicates excellent authenticity and life satisfaction.`
                strength = "Strong values alignment that supports life satisfaction and authentic decision-making"
              } else if (selectedIndex >= 1) {
                insight = `Your values alignment (${selectedOption}) shows some consistency but could be strengthened.`
                recommendation = "Identify your core values and assess how well your major life decisions reflect them"
              } else {
                insight = `Your life being ${selectedOption} with your values creates internal conflict and dissatisfaction.`
                opportunity = "Aligning life choices with values would significantly improve satisfaction and authenticity"
                recommendation = "Clarify your core values and make one significant change to better align your life with them"
              }
              break
          }
        }

        // Store the analysis
        if (insight) {
          questionInsights.push({
            questionId: question.id,
            questionText: question.label,
            userAnswer: selectedOption,
            score: Math.round(questionScore),
            insight: insight,
            rawIndex: selectedIndex,
            totalOptions: totalOptions
          })
        }

        if (strength) strengths.push(strength)
        if (opportunity) opportunities.push(opportunity)  
        if (recommendation) recommendations.push(recommendation)
      })

      // Generate LLM-based personalized advice based on user's specific answers
      try {
        // Prepare question-answer pairs for this category
        const categoryAnswerDetails = categoryQuestions.map((q: any) => {
          const answer = userAnswers[q.id]
          if (!answer) return null
          return {
            question: q.label,
            userAnswer: answer.selectedOption,
            score: Math.round(
              q.reverse ? 
              ((q.options.length - 1 - answer.selectedIndex) / (q.options.length - 1)) * 100 :
              (answer.selectedIndex / (q.options.length - 1)) * 100
            )
          }
        }).filter(Boolean)

        // Generate personalized strengths based on high-scoring answers
        const highScoringAnswers = categoryAnswerDetails.filter((a: any) => a.score >= 70)
        const lowScoringAnswers = categoryAnswerDetails.filter((a: any) => a.score < 50)
        const midScoringAnswers = categoryAnswerDetails.filter((a: any) => a.score >= 50 && a.score < 70)

        if (highScoringAnswers.length > 0 || lowScoringAnswers.length > 0) {
          const prompt = `Based on your ${categoryName} assessment:

High Performance Areas (70%+ scores):
${highScoringAnswers.map((a: any) => `- ${a.question}: "${a.userAnswer}" (${a.score}% score)`).join('\n') || 'None'}

Areas Needing Improvement (Below 50%):
${lowScoringAnswers.map((a: any) => `- ${a.question}: "${a.userAnswer}" (${a.score}% score)`).join('\n') || 'None'}

Moderate Performance (50-70%):
${midScoringAnswers.map((a: any) => `- ${a.question}: "${a.userAnswer}" (${a.score}% score)`).join('\n') || 'None'}

Generate personalized advice that references their SPECIFIC answers:

1. STRENGTHS (2-3 items): Highlight what you're doing well based on your high-scoring answers. Reference specific answers you gave.

2. OPPORTUNITIES (2-3 items): Identify improvement areas based on your low-scoring answers. Be specific about what needs work.

3. QUICK WINS (2-3 items): Provide actionable recommendations that directly address your weak areas while leveraging your strengths. Reference your specific situation.

Important:
- Always reference the user's specific answers (e.g., "Since you mentioned...", "Given that you...", "Your answer about...")
- Make advice specific to your situation, not generic
- For Quick Wins, provide concrete actions you can take TODAY or THIS WEEK
- Keep each item concise (1-2 sentences max)

Format as JSON:
{
  "strengths": ["strength1", "strength2"],
  "opportunities": ["opportunity1", "opportunity2"],
  "quickWins": ["action1", "action2"]
}`

          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an expert life coach analyzing assessment results. Provide personalized, specific advice using second person ("you", "your") based on the user's actual answers. Always reference their specific responses to make the advice relevant and actionable. Write directly to the person being assessed. ${getLanguageInstruction(userLanguage)}`
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' }
          })

          const aiAdvice = JSON.parse(completion.choices[0].message.content || '{}')
          
          // Use AI-generated advice if available, otherwise fall back to hardcoded
          if (aiAdvice.strengths && aiAdvice.strengths.length > 0) {
            strengths = aiAdvice.strengths
          }
          if (aiAdvice.opportunities && aiAdvice.opportunities.length > 0) {
            opportunities = aiAdvice.opportunities
          }
          if (aiAdvice.quickWins && aiAdvice.quickWins.length > 0) {
            recommendations = aiAdvice.quickWins
          }
        }
      } catch (aiError) {
        console.error('Error generating AI advice for category:', categoryId, aiError)
        // Fall back to existing logic if AI generation fails
      }

      return {
        id: categoryId,
        name: categoryName,
        percentile: Math.round(categoryPercentile || 50),
        score: Math.round((categoryPercentile || 50) * 2),
        strengths: strengths.length > 0 ? strengths : generateCategoryFallbackStrengths(categoryId, categoryPercentile || 50),
        opportunities: opportunities.length > 0 ? opportunities : generateCategoryFallbackOpportunities(categoryId, categoryPercentile || 50),
        recommendations: recommendations.length > 0 ? recommendations : generateCategoryFallbackRecommendations(categoryId, categoryPercentile || 50),
        questionInsights: questionInsights
      }
    }

    // Generate detailed analysis for each category
    const categoryNames: { [key: string]: string } = {
      financial: 'Financial Health',
      health_fitness: 'Physical Wellness', 
      social: 'Social Network',
      romantic: 'Romantic',
      career: 'Career',
      personal_growth: 'Personal Growth'
    }

    const detailedCategories = await Promise.all(
      Object.entries(categoryNames).map(([key, name]) => 
        generateCategoryAnalysis(key, name)
      )
    )

    // Generate peer comparison
    const overallPercentile = Math.round(assessment.scoreOverall?.percentileOverall || 50)
    const peerComparison = {
      betterThan: overallPercentile,
      similarTo: 100 - overallPercentile,
      category: detailedCategories.reduce((max: any, cat: any) => 
        cat.percentile > (max?.percentile || 0) ? cat : max
      )?.name || 'balanced lifestyle'
    }

    // Generate AI-powered 30-day action plan based on user's specific assessment
    const sortedCategories = [...detailedCategories].sort((a, b) => a.percentile - b.percentile)
    const focusAreas = sortedCategories.slice(0, 2) // Focus on bottom 2 categories
    
    let actionPlan = []
    
    try {
      // Prepare data for AI generation
      const categoryInsights = detailedCategories.map(cat => ({
        category: cat.name,
        percentile: cat.percentile,
        strengths: cat.strengths.slice(0, 2),
        opportunities: cat.opportunities.slice(0, 2),
        recommendations: cat.recommendations.slice(0, 2)
      }))

      const actionPlanPrompt = `Based on your life assessment results, create a personalized 30-day action plan:

ASSESSMENT OVERVIEW:
Overall Percentile: ${overallPercentile}%
Weakest Areas: ${focusAreas[0]?.name} (${focusAreas[0]?.percentile}%), ${focusAreas[1]?.name} (${focusAreas[1]?.percentile}%)
Strongest Area: ${sortedCategories[sortedCategories.length - 1]?.name} (${sortedCategories[sortedCategories.length - 1]?.percentile}%)

CATEGORY DETAILS:
${categoryInsights.map(cat => `
${cat.category} (${cat.percentile}th percentile):
Strengths: ${cat.strengths.join('; ')}
Opportunities: ${cat.opportunities.join('; ')}
Quick Wins: ${cat.recommendations.join('; ')}
`).join('\n')}

Create a PERSONALIZED 30-day action plan that:
1. Focuses primarily on your 2 weakest areas
2. Leverages your strengths from high-performing areas
3. References your specific assessment results
4. Provides concrete, actionable daily/weekly tasks
5. Is realistic and achievable given your current situation

Return a JSON object with a "weeks" array containing exactly 4 week objects:
{
  "weeks": [
    {
      "week": 1,
      "focus": "string - specific focus for week 1",
      "actions": ["action1", "action2", "action3", "action4"],
      "timeCommitment": "string - e.g., '30-45 minutes daily'"
    },
    // ... weeks 2, 3, 4 with same structure
  ]
}

Make it specific to YOUR situation, not generic. Reference your actual strengths and weaknesses.`

      const actionPlanCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert life coach creating personalized 30-day action plans. Return a JSON object with a "weeks" array containing exactly 4 week objects. Make recommendations specific to the user's assessment results using second person ("you", "your"), not generic advice. Write directly to the person being assessed. ${getLanguageInstruction(userLanguage)}`
          },
          {
            role: 'user',
            content: actionPlanPrompt
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })

      const aiActionPlan = JSON.parse(actionPlanCompletion.choices[0].message.content || '{}')
      
      // Try multiple possible response formats
      if (aiActionPlan.weeks && Array.isArray(aiActionPlan.weeks)) {
        actionPlan = aiActionPlan.weeks
      } else if (Array.isArray(aiActionPlan)) {
        actionPlan = aiActionPlan
      } else if (aiActionPlan.actionPlan && Array.isArray(aiActionPlan.actionPlan)) {
        actionPlan = aiActionPlan.actionPlan
      } else if (aiActionPlan.plan && Array.isArray(aiActionPlan.plan)) {
        actionPlan = aiActionPlan.plan
      }
      
      // Validate the structure
      if (!Array.isArray(actionPlan) || actionPlan.length !== 4) {
        console.error('Unexpected AI response format:', aiActionPlan)
        throw new Error('Invalid action plan format from AI')
      }
      
      // Ensure each week has the required properties
      actionPlan = actionPlan.map((week: any, index: number) => ({
        week: week.week || index + 1,
        focus: week.focus || `Week ${index + 1} Focus`,
        actions: Array.isArray(week.actions) ? week.actions : [],
        timeCommitment: week.timeCommitment || '30-60 minutes daily'
      }))
    } catch (aiError) {
      console.error('Error generating AI action plan:', aiError)
      // Fallback to basic action plan if AI fails
      actionPlan = [
        {
          week: 1,
          focus: 'Foundation Assessment & Goal Setting',
          actions: [
            'Complete daily self-reflection for baseline understanding',
            `Focus specifically on improving ${focusAreas[0]?.name.toLowerCase()}`,
            'Set up tracking systems for progress measurement',
            'Identify 3 specific, measurable improvement goals'
          ],
          timeCommitment: '30-45 minutes daily'
        },
        {
          week: 2,
          focus: `${focusAreas[0]?.name} Quick Wins Implementation`,
          actions: [
            'Implement 2 high-impact daily habits from week 1 insights',
            'Schedule weekly review sessions for accountability',
            'Connect with support network or find accountability partner',
            'Track daily progress using simple measurement system'
          ],
          timeCommitment: '45-60 minutes daily'
        },
        {
          week: 3,
          focus: `${focusAreas[1]?.name} Integration & Expansion`,
          actions: [
            'Scale successful habits from week 2 to second focus area',
            `Address secondary improvement areas in ${focusAreas[1]?.name.toLowerCase()}`,
            'Measure and document progress across both focus areas',
            'Adjust strategies based on week 2 results'
          ],
          timeCommitment: '45-60 minutes daily'
        },
        {
          week: 4,
          focus: 'Optimization & Future Planning',
          actions: [
            'Refine all routines for long-term sustainability',
            'Plan next 30-day improvement cycle based on results',
            'Celebrate achievements and assess goal completion',
            'Set up systems for continued progress monitoring'
          ],
          timeCommitment: '30-45 minutes daily'
        }
      ]
    }

    // Generate AI-powered personalized insights based on actual question responses
    const generatePersonalizedInsights = async () => {
      const strongestCategory = detailedCategories.reduce((max, cat) => cat.percentile > max.percentile ? cat : max)
      const weakestCategory = detailedCategories.reduce((min, cat) => cat.percentile < min.percentile ? cat : min)
      const strongCategories = detailedCategories.filter(c => c.percentile > 70)
      const weakCategories = detailedCategories.filter(c => c.percentile < 50)
      
      try {
        // Prepare detailed data for AI analysis
        const categoryBreakdown = detailedCategories.map(cat => {
          const highScoreQuestions = cat.questionInsights?.filter(q => q.score >= 80) || []
          const lowScoreQuestions = cat.questionInsights?.filter(q => q.score < 40) || []
          
          return {
            name: cat.name,
            percentile: cat.percentile,
            topStrengths: highScoreQuestions.map(q => ({
              question: q.questionText,
              answer: q.userAnswer,
              score: q.score
            })).slice(0, 3),
            biggestWeaknesses: lowScoreQuestions.map(q => ({
              question: q.questionText,
              answer: q.userAnswer,
              score: q.score
            })).slice(0, 3)
          }
        })

        const insightsPrompt = `Analyze your comprehensive life assessment results and generate personalized insights:

OVERALL PERFORMANCE:
- Total Questions Answered: ${assessment.answers.length}
- Overall Percentile: ${overallPercentile}%
- Demographics: ${assessment.cohortSex}, ${assessment.cohortAge}, ${assessment.cohortRegion}

CATEGORY PERFORMANCE:
${categoryBreakdown.map(cat => `
${cat.name}: ${cat.percentile}th percentile
Top Strengths: ${cat.topStrengths.map(s => `"${s.question}" - answered "${s.answer}" (${s.score}%)`).join('; ') || 'N/A'}
Biggest Weaknesses: ${cat.biggestWeaknesses.map(w => `"${w.question}" - answered "${w.answer}" (${w.score}%)`).join('; ') || 'N/A'}
`).join('\n')}

Generate personalized insights that:
1. Reference your SPECIFIC answers and scores
2. Identify surprising patterns across categories
3. Provide unique observations about your profile
4. Compare you meaningfully to your demographic cohort
5. Highlight unexpected strengths or concerning weaknesses

Return as JSON:
{
  "overallAssessment": "2-3 sentence comprehensive assessment referencing specific answers",
  "keyStrengths": ["strength1 with specific reference", "strength2 with specific reference", "strength3 with specific reference"],
  "primaryGrowthAreas": ["growth area 1 with specific context", "growth area 2 with specific context"],
  "crossCategoryPatterns": "Insights about relationships between your different life areas based on actual data",
  "surprisingFindings": "1-2 unexpected or notable patterns from your specific answers",
  "peerComparison": "Specific comparison to your demographic with meaningful context"
}`

        const insightsCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an expert psychologist and life coach analyzing assessment results. Provide deep, personalized insights using second person ("you", "your") that reference specific answers and patterns. Avoid generic observations - make every insight specific to the individual's data. Write directly to the person being assessed, not about them. ${getLanguageInstruction(userLanguage)}`
            },
            {
              role: 'user',
              content: insightsPrompt
            }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        })

        const aiInsights = JSON.parse(insightsCompletion.choices[0].message.content || '{}')
        
        return {
          overallAssessment: aiInsights.overallAssessment || `Based on your comprehensive analysis of ${assessment.answers.length} detailed questions, you demonstrate a ${overallPercentile > 70 ? 'strong' : overallPercentile > 50 ? 'solid' : 'developing'} foundation across key life areas.`,
          keyStrengths: aiInsights.keyStrengths || detailedCategories.filter(c => c.percentile > 60).map(c => `Strong performance in ${c.name.toLowerCase()} (${c.percentile}th percentile)`).slice(0, 3),
          primaryGrowthAreas: aiInsights.primaryGrowthAreas || detailedCategories.filter(c => c.percentile < 60).map(c => `${c.name} optimization potential`).slice(0, 2),
          crossCategoryPatterns: aiInsights.crossCategoryPatterns || `Your assessment reveals interesting connections between life areas.`,
          surprisingFindings: aiInsights.surprisingFindings || `Your performance patterns suggest unique opportunities for growth.`,
          peerComparison: aiInsights.peerComparison || `Compared to your demographic, you perform better than ${overallPercentile}% of similar individuals.`
        }
      } catch (aiError) {
        console.error('Error generating AI personalized insights:', aiError)
        // Fallback to basic insights
        return {
          overallAssessment: `Based on your comprehensive analysis of ${assessment.answers.length} detailed questions, you demonstrate a ${overallPercentile > 70 ? 'strong' : overallPercentile > 50 ? 'solid' : 'developing'} foundation across key life areas. Your standout area is ${strongestCategory.name.toLowerCase()}, where you rank in the ${strongestCategory.percentile}th percentile.`,
          keyStrengths: detailedCategories.filter(c => c.percentile > 60).map(c => `Strong performance in ${c.name.toLowerCase()} (${c.percentile}th percentile)`).slice(0, 3),
          primaryGrowthAreas: detailedCategories.filter(c => c.percentile < 60).map(c => `${c.name} optimization potential`).slice(0, 2),
          crossCategoryPatterns: `High ${strongestCategory.name.toLowerCase()} performance often correlates with improved outcomes in other categories.`,
          surprisingFindings: `Your ${strongestCategory.name.toLowerCase()} performance exceeds typical expectations for your demographic.`,
          peerComparison: `Compared to ${assessment.cohortSex.toLowerCase()} individuals in the ${assessment.cohortAge} age range from ${assessment.cohortRegion}, you perform better than ${overallPercentile}% of similar individuals.`
        }
      }
    }

    const personalizedInsights = await generatePersonalizedInsights()
    
    const mockAiReport = {
      executiveSummary: personalizedInsights,
      personalizedInsights: {
        crossCategoryPatterns: personalizedInsights.crossCategoryPatterns,
        surprisingFindings: personalizedInsights.surprisingFindings,
        peerComparison: personalizedInsights.peerComparison
      }
    }

    const reportData = {
      assessment_id: assessment.id,
      cohort: {
        age_band: assessment.cohortAge || '20-29',
        sex: assessment.cohortSex || 'Not specified',
        region: assessment.cohortRegion || 'Global'
      },
      overall: {
        score_0_100: Math.round(assessment.scoreOverall?.overall || 50),
        percentile: overallPercentile
      },
      categories: detailedCategories,
      peerComparison,
      actionPlan,
      aiReport: mockAiReport
    }

    // Save the report to database AND generate PDF simultaneously
    try {
      console.log('Generating PDF alongside JSON report for assessment:', assessmentId)
      
      // Generate PDF using the same HTML generation function
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      })
      
      const page = await browser.newPage()
      const htmlContent = generateReportHTML(reportData, userLanguage)
      await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' })
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '15mm',
          right: '15mm', 
          bottom: '15mm',
          left: '15mm'
        },
        preferCSSPageSize: true,
        displayHeaderFooter: false,
        scale: 0.95
      })
      
      await browser.close()
      
      console.log(`Generated PDF (${pdfBuffer.length} bytes) for assessment ${assessmentId}`)

      // Save both JSON report data and PDF to database
      await prisma.deepReport.upsert({
        where: { assessmentId },
        update: {
          reportData: JSON.stringify(reportData),
          pdfData: pdfBuffer,
          pdfLanguage: userLanguage,
          pdfGeneratedAt: new Date(),
          pdfFileSize: pdfBuffer.length
        },
        create: {
          assessmentId,
          reportData: JSON.stringify(reportData),
          pdfData: pdfBuffer,
          pdfLanguage: userLanguage,
          pdfGeneratedAt: new Date(),
          pdfFileSize: pdfBuffer.length
        }
      })

      console.log('Successfully saved both JSON and PDF to database')
      
      // Also maintain file system cache for backward compatibility
      await PDFCache.cachePDF(assessmentId, userLanguage, pdfBuffer)
      
    } catch (saveError) {
      console.error('Error saving deep report and PDF to database:', saveError)
      // Still try to save JSON-only report if PDF generation fails
      try {
        await prisma.deepReport.upsert({
          where: { assessmentId },
          update: {
            reportData: JSON.stringify(reportData)
          },
          create: {
            assessmentId,
            reportData: JSON.stringify(reportData)
          }
        })
        console.log('Saved JSON report to database (PDF generation failed)')
      } catch (fallbackError) {
        console.error('Error saving even JSON report:', fallbackError)
      }
      // Continue even if saving fails - user still gets their report
    }

    return NextResponse.json(reportData)

  } catch (error) {
    console.error('Error fetching report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    )
  }
}

// CONSOLIDATED: PDF generation function (formerly from /api/report/[id]/pdf)
async function generatePDFReport(assessmentId: string, userLanguage: string) {
  try {
    // First check database for cached PDF with matching language
    const existingReport = await prisma.deepReport.findUnique({
      where: { assessmentId }
    })

    if (!existingReport) {
      return NextResponse.json(
        { error: 'Report not found - Generate JSON report first' },
        { status: 404 }
      )
    }

    // Check if we have a cached PDF in database with the right language
    if (existingReport.pdfData && existingReport.pdfLanguage === userLanguage) {
      console.log(`Serving database-cached PDF for assessment ${assessmentId} (${userLanguage})`)
      return new NextResponse(existingReport.pdfData, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="deep-report-${assessmentId}.pdf"`,
          'X-Cache': 'DATABASE-HIT'
        }
      })
    }

    // Fall back to file system cache
    const cachedPdfBuffer = await PDFCache.getCachedPDF(assessmentId, userLanguage)
    
    if (cachedPdfBuffer) {
      console.log(`Serving file system cached PDF for assessment ${assessmentId}`)
      return new NextResponse(cachedPdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="deep-report-${assessmentId}.pdf"`,
          'X-Cache': 'FILE-HIT'
        }
      })
    }
    
    console.log(`Cache miss for assessment ${assessmentId}, generating new PDF`)

    const reportData = JSON.parse(existingReport.reportData)

    // Launch puppeteer to generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    })

    const page = await browser.newPage()
    
    // Create HTML content for the PDF
    const htmlContent = generateReportHTML(reportData, userLanguage)
    
    await page.setContent(htmlContent, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000
    })

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      scale: 0.95
    })

    await browser.close()

    // Cache the PDF in both database and file system
    try {
      await prisma.deepReport.update({
        where: { assessmentId },
        data: {
          pdfData: pdfBuffer,
          pdfLanguage: userLanguage,
          pdfGeneratedAt: new Date(),
          pdfFileSize: pdfBuffer.length
        }
      })
      console.log(`Updated database with new PDF for assessment ${assessmentId}`)
    } catch (dbError) {
      console.error('Error updating database with PDF:', dbError)
    }

    // Also cache in file system
    await PDFCache.cachePDF(assessmentId, userLanguage, pdfBuffer)

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="deep-report-${assessmentId}.pdf"`,
        'X-Cache': 'MISS'
      }
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

// Helper function to generate HTML content for PDF
function generateReportHTML(reportData: any, language: string): string {
  // Generate responsive radar chart with responsive sizing
  const generateRadarChart = (categories: any[]) => {
    if (!categories || categories.length === 0) {
      return '<div>No category data available</div>'
    }

    const centerX = 140
    const centerY = 140
    const maxRadius = 100  // Reduced from 120 for better fit
    const angleStep = (2 * Math.PI) / categories.length
    
    let pathData = ''
    let gridLines = ''
    let labels = ''
    
    // Generate grid circles
    for (let i = 1; i <= 5; i++) {
      const radius = (maxRadius * i) / 5
      gridLines += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="#e5e7eb" stroke-width="1" />`
    }
    
    // Generate grid lines and labels
    categories.forEach((category, index) => {
      const angle = index * angleStep - Math.PI / 2
      const x = centerX + Math.cos(angle) * maxRadius
      const y = centerY + Math.sin(angle) * maxRadius
      
      gridLines += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" stroke="#e5e7eb" stroke-width="1" />`
      
      // Calculate label position (a bit further out) with text wrapping
      const labelX = centerX + Math.cos(angle) * (maxRadius + 25)
      const labelY = centerY + Math.sin(angle) * (maxRadius + 25)
      
      labels += `<text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="central" font-size="10" fill="#374151">${category.name}</text>`
      
      // Calculate point for the data path
      const percentile = category.percentile || 0
      const dataRadius = (percentile / 100) * maxRadius
      const dataX = centerX + Math.cos(angle) * dataRadius
      const dataY = centerY + Math.sin(angle) * dataRadius
      
      if (index === 0) {
        pathData += `M ${dataX} ${dataY}`
      } else {
        pathData += ` L ${dataX} ${dataY}`
      }
    })
    
    pathData += ' Z' // Close the path
    
    return `
      <div style="width: 100%; max-width: 100%; margin: 0 auto; text-align: center; height: 48vh; display: flex; flex-direction: column; justify-content: center;">
        <h3 style="font-size: 20px; font-weight: 600; color: #1f2937; margin: 0 0 14px 0;">Life Performance Overview</h3>
        <svg width="100%" height="100%" viewBox="0 0 280 280" style="display: block; max-height: calc(42vh - 35px);">
          ${gridLines}
          <path d="${pathData}" fill="rgba(31, 41, 55, 0.2)" stroke="#1f2937" stroke-width="2" />
          ${categories.map((category, index) => {
            const angle = index * angleStep - Math.PI / 2
            const percentile = category.percentile || 0
            const dataRadius = (percentile / 100) * maxRadius
            const dataX = centerX + Math.cos(angle) * dataRadius
            const dataY = centerY + Math.sin(angle) * dataRadius
            return `<circle cx="${dataX}" cy="${dataY}" r="3" fill="#1f2937" stroke="#fff" stroke-width="2" />`
          }).join('')}
          ${labels}
        </svg>
      </div>
    `
  }

  // Generate responsive bar chart
  const generateBarChart = (categories: any[]) => {
    if (!categories || categories.length === 0) {
      return '<div>No category data available</div>'
    }

    const maxWidth = 350  // Reduced from 500
    const barHeight = 25   // Reduced from 30
    const chartHeight = categories.length * (barHeight + 8) + 50  // Reduced spacing
    const chartWidth = 520  // Reduced from 600
    
    return `
      <div style="width: 100%; max-width: 100%; margin: 0 auto; overflow: hidden; height: 46vh; display: flex; flex-direction: column; justify-content: center;">
        <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 10px 0; text-align: center;">Category Performance Breakdown</h3>
        <svg width="100%" height="100%" viewBox="0 0 ${chartWidth} ${chartHeight}" style="display: block; max-height: calc(42vh - 35px);">
          ${categories.map((category, index) => {
            const y = 20 + index * (barHeight + 8)
            const percentile = category.percentile || 0
            const width = (percentile / 100) * maxWidth
            let color = '#000000' // Black for low performance
            if (percentile >= 75) color = '#000000' // Black for high performance
            else if (percentile >= 50) color = '#4b5563' // Gray for medium performance
            else if (percentile >= 25) color = '#6b7280' // Light gray for low-medium performance
            
            return `
              <rect x="120" y="${y}" width="${maxWidth}" height="${barHeight}" fill="#f3f4f6" rx="3" />
              <rect x="120" y="${y}" width="${width}" height="${barHeight}" fill="${color}" rx="3" />
              <text x="115" y="${y + barHeight/2 + 4}" text-anchor="end" font-size="11" fill="#374151">${category.name}</text>
              <text x="${120 + width + 8}" y="${y + barHeight/2 + 4}" font-size="11" fill="#374151">${percentile}th</text>
            `
          }).join('')}
        </svg>
      </div>
    `
  }

  const radarChartSVG = generateRadarChart(reportData.categories || [])
  const barChartSVG = generateBarChart(reportData.categories || [])

  return `
    <!DOCTYPE html>
    <html lang="${language}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RankMe Deep Life Analysis Report</title>
      <style>
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box;
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
          max-width: 100%;
        }
        
        body {
          font-family: Arial, sans-serif;
          line-height: 1.5;
          color: #1f2937;
          background: white;
          padding: 10px;  /* Reduced from 20px */
          max-width: 100%;
          overflow: hidden;
        }

        .cover-page {
          height: 95vh;
          max-height: 95vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #000000;
          color: white;
          page-break-after: always;
          padding: 20px;
          text-align: center;
          margin: 0;
          box-sizing: border-box;
          overflow: hidden;
        }
        
        .cover-logo { 
          font-size: 60px; 
          font-weight: 800; 
          margin-bottom: 15px; 
          line-height: 1.1;
        }
        .cover-subtitle { 
          font-size: 20px; 
          margin-bottom: 40px; 
          line-height: 1.2;
        }
        .cover-meta { 
          font-size: 13px; 
          text-align: center; 
          line-height: 1.4;
        }
        
        .score-summary {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          color: white;
          padding: 20px 15px;  /* Reduced from 25px 20px */
          border-radius: 16px;
          text-align: center;
          margin-bottom: 20px;  /* Reduced from 30px */
          max-width: 100%;
        }
        
        .overall-score { 
          font-size: 72px; 
          font-weight: 800; 
          margin-bottom: 8px; 
          line-height: 1;
        }
        .score-label { 
          font-size: 16px; 
          margin-bottom: 15px; 
          line-height: 1.3;
        }
        .demographics { 
          font-size: 13px; 
          margin-top: 15px; 
          padding-top: 15px; 
          border-top: 1px solid rgba(255, 255, 255, 0.2); 
          line-height: 1.4;
        }
        
        .chart-container { 
          margin: 15px 0;  /* Reduced from 25px 0 */
          text-align: center; 
          max-width: 100%;
          overflow: hidden;
          padding-top: 0;  /* Remove any top padding */
        }
        
        .chart-container:first-of-type {
          margin-top: 0;  /* Remove top margin for first chart after page break */
          padding-top: 10px;  /* Small padding instead of margin */
        }
        
        .chart-container svg { 
          max-width: 100%; 
          border-radius: 10px; 
          background: white; 
          padding: 10px;  /* Reduced from 15px */
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .section { 
          margin-bottom: 25px;  /* Reduced from 35px */
          page-break-inside: avoid;
          break-inside: avoid;
          max-width: 100%;
          overflow: hidden;
        }
        
        .section:first-child {
          margin-top: 0;  /* Remove top margin for first section */
          padding-top: 10px;  /* Small padding instead */
        }
        
        .section-title { 
          font-size: 20px; 
          font-weight: bold; 
          color: #1f2937; 
          margin-bottom: 18px;
          line-height: 1.2;
          word-wrap: break-word;
        }
        
        .category-grid { 
          margin-bottom: 20px;  /* Reduced from 25px */
          max-width: 100%;
        }
        .category-card { 
          border: 1px solid #e5e7eb; 
          border-radius: 10px; 
          padding: 12px;  /* Reduced from 15px */
          background: #f9fafb;
          margin-bottom: 12px;  /* Reduced from 15px */
          page-break-inside: avoid;
          break-inside: avoid;
          max-width: 100%;
          overflow: hidden;
        }
        .category-header { 
          display: flex; 
          align-items: flex-start; 
          margin-bottom: 10px;  /* Reduced from 12px */
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .category-name { 
          font-size: 14px; 
          font-weight: 600;
          line-height: 1.3;
          word-wrap: break-word;
          flex: 1;
          min-width: 0;
        }
        .category-score { 
          font-weight: 600;
          font-size: 13px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        
        .performance-bar { 
          width: 100%; 
          height: 10px; 
          background: #e5e7eb; 
          border-radius: 5px; 
          margin: 12px 0;  /* Reduced from 15px 0 */
          overflow: hidden;
        }
        .performance-fill { 
          height: 100%; 
          border-radius: 5px;
          transition: width 0.3s ease;
        }
        
        .insight-item {
          margin: 6px 0;  /* Reduced from 8px 0 */
          padding: 6px 8px;  /* Reduced from 8px 10px */
          background: white;
          border-radius: 5px;
          border-left: 3px solid #000000;
          max-width: 100%;
          overflow: hidden;
        }
        
        .insight-title {
          font-weight: 600;
          font-size: 12px;
          color: #1f2937;
          margin-bottom: 3px;  /* Reduced from 4px */
          line-height: 1.3;
        }
        
        .insight-list {
          font-size: 11px;
          color: #4b5563;
          line-height: 1.4;
          margin: 0;
          padding-left: 14px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .insight-list li {
          margin-bottom: 2px;  /* Reduced from 3px */
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .page-break { 
          page-break-before: always;
          break-before: page;
          margin: 0;  /* Ensure no extra margin */
          padding: 0;  /* Ensure no extra padding */
        }
        
        .action-week {
          background: white;
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 10px;
          border-left: 4px solid #000000;
          page-break-inside: avoid;
          break-inside: avoid;
          max-width: 100%;
          overflow: hidden;
        }
        
        .action-week-header {
          font-weight: 600;
          font-size: 15px;
          color: #1f2937;
          margin-bottom: 8px;
          line-height: 1.3;
          word-wrap: break-word;
        }
        
        .action-content {
          font-size: 11px;
          color: #4b5563;
          line-height: 1.4;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .action-list {
          margin: 5px 0;
          padding-left: 14px;
          max-width: 100%;
        }
        
        .action-list li {
          margin-bottom: 4px;
          word-wrap: break-word;
          overflow-wrap: break-word;
          line-height: 1.4;
        }
        
        ul, ol {
          padding-left: 14px;
          margin: 3px 0;  /* Reduced from 4px 0 */
          max-width: 100%;
        }
        
        li {
          margin-bottom: 2px;  /* Reduced from 3px */
          line-height: 1.4;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        /* Special handling for content after page break */
        .after-page-break {
          margin-top: 0;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="cover-page">
        <div class="cover-logo">RankMe</div>
        <div class="cover-subtitle">Deep Life Analysis Report</div>
        <div class="cover-meta">
          <div style="font-size: 36px; font-weight: 700; margin-bottom: 15px; line-height: 1;">${Math.round(reportData.overall?.score_0_100 || 0)}</div>
          <div style="font-size: 16px; margin-bottom: 30px; line-height: 1.2;">Overall Life Score</div>
          <div style="line-height: 1.4;">${reportData.cohort?.sex || 'N/A'} • ${reportData.cohort?.age_band || 'N/A'} • ${reportData.cohort?.region || 'N/A'}</div>
          <div style="margin-top: 8px; line-height: 1.4;">${new Date().toLocaleDateString()}</div>
        </div>
      </div>
      
      <div style="margin: 0; padding: 20px 0 0 0;">
        ${radarChartSVG}
        
        <div style="margin-top: 20px;">
          ${barChartSVG}
        </div>
      </div>

      <!-- All categories on a separate page -->
      <div class="page-break"></div>
      
      <div class="section after-page-break" style="padding-top: 10px;">
        <h2 class="section-title" style="margin-bottom: 10px;">Category Performance Details</h2>
        
        <div class="category-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          ${(reportData.categories || []).map((category: any) => {
            const percentile = category.percentile || 0;
            const getColor = (perc: number) => {
              if (perc >= 75) return '#000000';
              if (perc >= 50) return '#4b5563';
              if (perc >= 25) return '#6b7280';
              return '#000000';
            };
            
            return `
          <div class="category-card" style="padding: 10px; margin-bottom: 2px;">
            <div class="category-header" style="margin-bottom: 8px;">
              <div class="category-name" style="font-size: 14px;">${category.name || 'Unknown'}</div>
              <div class="category-score" style="color: ${getColor(percentile)}; font-size: 13px;">${percentile}th</div>
            </div>
            <div class="performance-bar" style="height: 8px; margin: 8px 0;">
              <div class="performance-fill" style="width: ${percentile}%; background: ${getColor(percentile)};"></div>
            </div>
            
            ${category.strengths && category.strengths.length > 0 ? `
            <div class="insight-item" style="padding: 6px 8px; margin: 5px 0;">
              <div class="insight-title" style="font-size: 11px;">Strengths</div>
              <ul class="insight-list" style="font-size: 10px;">
                ${category.strengths.slice(0, 1).map((strength: string) => `<li>${strength}</li>`).join('')}
              </ul>
            </div>
            ` : ''}
            
            ${category.opportunities && category.opportunities.length > 0 ? `
            <div class="insight-item" style="padding: 6px 8px; margin: 5px 0;">
              <div class="insight-title" style="font-size: 11px;">Opportunities</div>
              <ul class="insight-list" style="font-size: 10px;">
                ${category.opportunities.slice(0, 1).map((opp: string) => `<li>${opp}</li>`).join('')}
              </ul>
            </div>
            ` : ''}
            
            ${category.recommendations && category.recommendations.length > 0 ? `
            <div class="insight-item" style="padding: 6px 8px; margin: 5px 0;">
              <div class="insight-title" style="font-size: 11px;">Quick Wins</div>
              <ul class="insight-list" style="font-size: 10px;">
                ${category.recommendations.slice(0, 1).map((rec: string) => `<li>${rec}</li>`).join('')}
              </ul>
            </div>
            ` : ''}
          </div>
          `;
          }).join('')}
        </div>
      </div>

      ${reportData.actionPlan && reportData.actionPlan.length > 0 ? `
      <div class="page-break"></div>
      
      <div class="section after-page-break">
        <h2 class="section-title">30-Day Action Plan</h2>
        <div style="background: #f3f4f6; border: 2px solid #e5e7eb; border-radius: 12px; padding: 15px; margin-bottom: 20px; max-width: 100%; overflow: hidden; page-break-inside: avoid;">
          ${reportData.actionPlan.map((week: any, index: number) => `
          <div class="action-week">
            <div class="action-week-header">Week ${week.week}: ${week.focus}</div>
            <div class="action-content">
              <strong>Time Commitment:</strong> ${week.timeCommitment}<br><br>
              <strong>Daily Actions:</strong>
              <ul class="action-list">
                ${week.actions.map((action: string) => `<li>${action}</li>`).join('')}
              </ul>
            </div>
          </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      <div style="text-align: center; margin-top: 30px; padding: 15px; background: #f9fafb; border-radius: 10px; color: #6b7280; font-size: 11px; line-height: 1.4; max-width: 100%; overflow: hidden;">
        <div style="font-weight: 600; color: #1f2937; margin-bottom: 6px;">Generated by RankMe</div>
        <div>Your Personal Life Performance Platform</div>
        <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e5e7eb;">
          Report ID: ${reportData.assessment_id}<br>
          Generated: ${new Date().toLocaleDateString()}
        </div>
      </div>
    </body>
    </html>
  `
}
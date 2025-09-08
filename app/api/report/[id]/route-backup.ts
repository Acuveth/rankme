import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { openai } from '@/lib/openai'
import questions from '@/data/questions.json'

// Helper function to generate deep report using OpenAI
async function generateDeepReport(assessmentId: string) {
  try {
    // Get assessment with all data
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        answers: true,
        scoreCategory: true,
        scoreOverall: true,
        categorizedAnswers: true
      }
    })

    if (!assessment) {
      return { error: 'Assessment not found', status: 404 }
    }

    // Format answers for analysis
    const formattedAnswers = assessment.answers.map(answer => {
      const question = questions.questions.find(q => q.id === answer.questionId)
      let answerText = answer.valueRaw
      
      if (question?.options && !isNaN(Number(answer.valueRaw))) {
        const optionIndex = Number(answer.valueRaw)
        answerText = question.options[optionIndex] || answer.valueRaw
      }
      
      return {
        questionId: answer.questionId,
        question: question?.label || '',
        category: question?.category || 'unknown',
        answer: answerText,
        normalizedScore: answer.valueNorm
      }
    })

    // Group answers by category
    const answersByCategory = formattedAnswers.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {} as Record<string, typeof formattedAnswers>)

    // Get scores
    const scores = {
      overall: assessment.scoreOverall?.overall || 50,
      percentile: assessment.scoreOverall?.percentileOverall || 50,
      categories: {
        financial: assessment.scoreOverall?.percentileFinancial || 50,
        health_fitness: assessment.scoreOverall?.percentileHealth || 50,
        social: assessment.scoreOverall?.percentileSocial || 50,
        romantic: assessment.scoreOverall?.percentileRomantic || 50
      }
    }

    // Create comprehensive prompt for OpenAI
    const comprehensivePrompt = `
# Deep Life Assessment Analysis

You are an expert life coach and analyst tasked with creating a comprehensive 2-page deep report based on a detailed life assessment. The user has completed a thorough evaluation covering financial health, physical wellness, social connections, and romantic life.

## Assessment Data:

**Overall Score:** ${scores.overall}/100 (${scores.percentile}th percentile)
**Demographics:** ${assessment.cohortSex}, ${assessment.cohortAge}, ${assessment.cohortRegion}

**Category Percentiles:**
- Financial Health: ${scores.categories.financial}th percentile
- Health & Fitness: ${scores.categories.health_fitness}th percentile  
- Social Network: ${scores.categories.social}th percentile
- Romantic Life: ${scores.categories.romantic}th percentile

## Detailed Responses by Category:

### Financial Health
${answersByCategory.financial?.map(item => `**${item.question}:** ${item.answer}`).join('\n') || 'No financial data'}

### Health & Fitness  
${answersByCategory.health_fitness?.map(item => `**${item.question}:** ${item.answer}`).join('\n') || 'No health data'}

### Social Network
${answersByCategory.social?.map(item => `**${item.question}:** ${item.answer}`).join('\n') || 'No social data'}

### Romantic Life
${answersByCategory.romantic?.map(item => `**${item.question}:** ${item.answer}`).join('\n') || 'No romantic data'}

## Analysis Requirements:

Create a comprehensive analysis that includes:

1. **Executive Summary**: 2-3 paragraphs summarizing their overall life performance, highlighting what makes them unique compared to peers

2. **Category Deep Dive**: For each of the 4 categories:
   - Specific strengths (3-4 actionable items based on actual responses)
   - Growth opportunities (3-4 specific areas for improvement)
   - Quick wins (2-3 immediate actions they can take)

3. **Personalized Insights**: Based on their specific responses:
   - Identify patterns and connections between categories
   - Highlight surprising strengths or hidden weaknesses
   - Provide context about how their scores compare to similar demographics

4. **30-Day Action Plan**: Create 4 weekly focus areas with:
   - Week-specific themes based on their lowest scores
   - 3-4 concrete daily actions per week
   - Realistic time commitments
   - Progressive difficulty that builds on previous weeks

5. **Long-term Growth Strategy**: 
   - Identify their #1 limiting factor across all categories
   - Suggest 3-month and 1-year goals based on their current baseline
   - Recommend resources, tools, or support systems

## Response Format:

Return a JSON object with this exact structure:

{
  "executiveSummary": {
    "overallAssessment": "string - 2-3 paragraph summary",
    "keyStrengths": ["string", "string", "string"],
    "primaryGrowthAreas": ["string", "string"]
  },
  "categoryAnalysis": {
    "financial": {
      "strengthsAnalysis": "string - detailed analysis of financial strengths",
      "specificStrengths": ["string", "string", "string"],
      "opportunitiesAnalysis": "string - detailed analysis of opportunities", 
      "specificOpportunities": ["string", "string", "string"],
      "quickWins": ["string", "string", "string"]
    },
    "health_fitness": {
      "strengthsAnalysis": "string",
      "specificStrengths": ["string", "string", "string"],
      "opportunitiesAnalysis": "string",
      "specificOpportunities": ["string", "string", "string"], 
      "quickWins": ["string", "string", "string"]
    },
    "social": {
      "strengthsAnalysis": "string",
      "specificStrengths": ["string", "string", "string"],
      "opportunitiesAnalysis": "string",
      "specificOpportunities": ["string", "string", "string"],
      "quickWins": ["string", "string", "string"]
    },
    "romantic": {
      "strengthsAnalysis": "string", 
      "specificStrengths": ["string", "string", "string"],
      "opportunitiesAnalysis": "string",
      "specificOpportunities": ["string", "string", "string"],
      "quickWins": ["string", "string", "string"]
    }
  },
  "personalizedInsights": {
    "crossCategoryPatterns": "string - how categories influence each other",
    "surprisingFindings": "string - unexpected strengths or weaknesses",
    "peerComparison": "string - how they compare to similar demographics"
  },
  "actionPlan": [
    {
      "week": 1,
      "theme": "string - focus theme for this week",
      "description": "string - why this week focuses on this area", 
      "dailyActions": ["string", "string", "string"],
      "timeCommitment": "string - realistic daily time needed",
      "successMetrics": ["string", "string"]
    },
    {
      "week": 2,
      "theme": "string",
      "description": "string",
      "dailyActions": ["string", "string", "string"],
      "timeCommitment": "string", 
      "successMetrics": ["string", "string"]
    },
    {
      "week": 3,
      "theme": "string",
      "description": "string",
      "dailyActions": ["string", "string", "string"],
      "timeCommitment": "string",
      "successMetrics": ["string", "string"] 
    },
    {
      "week": 4,
      "theme": "string",
      "description": "string", 
      "dailyActions": ["string", "string", "string"],
      "timeCommitment": "string",
      "successMetrics": ["string", "string"]
    }
  ],
  "longTermStrategy": {
    "primaryLimitingFactor": "string - the #1 thing holding them back",
    "threeMonthGoals": ["string", "string", "string"],
    "oneYearGoals": ["string", "string", "string"], 
    "recommendedResources": ["string", "string", "string"]
  }
}

## Important Guidelines:

- Be specific and actionable in all recommendations
- Reference their actual responses when making suggestions
- Use percentile rankings to provide context
- Focus on practical, implementable advice
- Maintain a supportive but honest tone
- Avoid generic advice - make everything personalized to their situation
- Consider interconnections between life areas (e.g., sleep affecting both health and work performance)
- Account for their demographic context when making suggestions
`

    // Generate report using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system", 
          content: "You are an expert life coach and analyst who creates personalized, actionable insights from comprehensive life assessments. You provide specific, practical advice tailored to each individual's unique situation and demographic context."
        },
        {
          role: "user",
          content: comprehensivePrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    })

    const generatedReport = JSON.parse(response.choices[0].message.content || '{}')

    return { generatedReport }

  } catch (error) {
    console.error('Error generating deep report:', error)
    return { error: 'Failed to generate deep report', status: 500 }
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id

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
        { status: 402 }
      )
    }

    // Generate report using OpenAI
    const generateResponse = await generateDeepReport(assessmentId)
    if (generateResponse.error) {
      return NextResponse.json(
        { error: generateResponse.error },
        { status: generateResponse.status || 500 }
      )
    }

    const generatedReport = generateResponse.generatedReport

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
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

    // Transform the OpenAI report to match the expected UI format
    const categoryNames: { [key: string]: string } = {
      financial: 'Financial Health',
      health_fitness: 'Health & Fitness', 
      social: 'Social Network',
      romantic: 'Personal Growth'
    }

    const categoryPercentiles: { [key: string]: number } = {
      financial: assessment.scoreOverall?.percentileFinancial || 50,
      health_fitness: assessment.scoreOverall?.percentileHealth || 50,
      social: assessment.scoreOverall?.percentileSocial || 50,
      romantic: assessment.scoreOverall?.percentileRomantic || 50
    }

    const detailedCategories = Object.entries(categoryNames).map(([key, name]) => {
      const analysis = generatedReport.categoryAnalysis[key]
      const percentile = categoryPercentiles[key]
      
      return {
        id: key,
        name: name,
        percentile: Math.round(percentile),
        score: Math.round(percentile * 2), // Convert percentile to 0-200 score for compatibility
        strengths: analysis.specificStrengths || [],
        opportunities: analysis.specificOpportunities || [],
        recommendations: analysis.quickWins || []
      }
    })

    // Peer comparison data
    const peerComparison = {
      betterThan: Math.round(assessment.scoreOverall?.percentileOverall || 50),
      similarTo: 100 - Math.round(assessment.scoreOverall?.percentileOverall || 50),
      category: detailedCategories.reduce((max: any, cat: any) => 
        cat.percentile > (max?.percentile || 0) ? cat : max
      )?.name || 'balanced lifestyle'
    }

    // Transform action plan from OpenAI format to expected format
    const actionPlan = generatedReport.actionPlan.map((week: any) => ({
      week: week.week,
      focus: week.theme,
      actions: week.dailyActions,
      timeCommitment: week.timeCommitment
    }))

    return NextResponse.json({
      assessment_id: assessment.id,
      cohort: {
        age_band: assessment.cohortAge || '20-29',
        sex: assessment.cohortSex || 'Not specified',
        region: assessment.cohortRegion || 'Global'
      },
      overall: {
        score_0_100: Math.round(assessment.scoreOverall?.overall || 50),
        percentile: Math.round(assessment.scoreOverall?.percentileOverall || 50)
      },
      categories: detailedCategories,
      peerComparison,
      actionPlan,
      // Add the full OpenAI report for enhanced sections
      aiReport: generatedReport
    })

  } catch (error) {
    console.error('Error fetching report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    )
  }
}
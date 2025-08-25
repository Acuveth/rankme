import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
})

export interface UserAssessmentData {
  overall: {
    score: number
    percentile: number
  }
  categories: {
    financial: number
    health: number
    social: number
    romantic: number
  }
  cohort: {
    age_band: string
    sex: string
    region: string
  }
  completionTime?: number
}

export async function generatePersonalizedCoaching(assessmentData: UserAssessmentData) {
  // If no API key, return mock data
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
    return generateMockCoachingData(assessmentData)
  }

  const prompt = `You are an expert life coach analyzing a comprehensive life assessment. Based on the following data, create a personalized coaching plan:

ASSESSMENT RESULTS:
- Overall Score: ${assessmentData.overall.score}/100 (${assessmentData.overall.percentile}th percentile)
- Financial Health: ${assessmentData.categories.financial}th percentile
- Physical Wellness: ${assessmentData.categories.health}th percentile
- Social Network: ${assessmentData.categories.social}th percentile
- Personal Growth: ${assessmentData.categories.romantic}th percentile
- Demographics: ${assessmentData.cohort.sex}, ${assessmentData.cohort.age_band}, ${assessmentData.cohort.region}

ANALYSIS REQUIREMENTS:
1. Identify the top strength and primary growth area
2. Create a personalized 7-day action plan with specific, achievable tasks
3. Generate 5 daily check-in questions focusing on the growth area
4. Provide motivational insights and next milestone
5. Consider their demographic context and life stage

FORMAT: Return valid JSON with this structure:
{
  "insights": {
    "topStrength": {
      "category": "category name",
      "percentile": number,
      "message": "personalized message about this strength"
    },
    "growthArea": {
      "category": "category name", 
      "percentile": number,
      "message": "encouraging message about growth potential"
    },
    "personalizedAnalysis": "2-3 sentence analysis of their unique situation"
  },
  "weeklyPlan": {
    "week": 1,
    "focus": "growth area",
    "tasks": ["task 1", "task 2", "task 3", "task 4", "task 5"],
    "rationale": "why these tasks are specifically chosen for this person"
  },
  "dailyCheckins": [
    {"day": "Monday", "question": "specific question", "tip": "actionable tip"},
    {"day": "Tuesday", "question": "specific question", "tip": "actionable tip"},
    {"day": "Wednesday", "question": "specific question", "tip": "actionable tip"},
    {"day": "Thursday", "question": "specific question", "tip": "actionable tip"},
    {"day": "Friday", "question": "specific question", "tip": "actionable tip"}
  ],
  "nextMilestone": {
    "title": "specific milestone title",
    "target": "measurable target",
    "timeframe": "realistic timeframe",
    "steps": ["step 1", "step 2", "step 3"]
  }
}`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert life coach with 20+ years of experience in personal development, psychology, and behavior change. You create personalized, actionable plans that lead to real improvement."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const response = completion.choices[0].message.content
    if (!response) throw new Error('No response from OpenAI')

    return JSON.parse(response)
  } catch (error) {
    console.error('OpenAI API error:', error)
    return generateMockCoachingData(assessmentData)
  }
}

export async function generateCoachResponse(userMessage: string, assessmentData: UserAssessmentData, conversationHistory: any[] = [], additionalContext: any = null) {
  // If no API key, return mock response
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
    return {
      message: `That's a great question! Based on your assessment results (${assessmentData.overall.percentile}th percentile), I'd suggest focusing on your growth area. Remember, small consistent actions lead to big changes. What specific challenge are you facing right now?`,
      suggestions: [
        "Tell me about your progress this week",
        "What's your biggest obstacle right now?",
        "How can I help you stay motivated?"
      ]
    }
  }

  let contextInfo = ''
  if (additionalContext) {
    const { weeklyProgress, recentJournalEntries, dailyGoals, settings } = additionalContext
    
    contextInfo = `

CURRENT PROGRESS CONTEXT:
- Weekly Progress: ${weeklyProgress.completed}/${weeklyProgress.total} tasks completed (${Math.round(weeklyProgress.percentage)}%)
- Focus Area: ${weeklyProgress.focusArea}
- Daily Goals Completed: ${dailyGoals.filter((g: any) => g.completed).length}/${dailyGoals.length}

${recentJournalEntries && recentJournalEntries.length > 0 ? `
RECENT JOURNAL ENTRIES:
${recentJournalEntries.map((entry: any) => `- ${new Date(entry.date).toDateString()}: "${entry.entry.substring(0, 100)}..."`).join('\n')}
` : ''}

COACHING PREFERENCES:
- Style: ${settings.coachingStyle}
- Goal Frequency: ${settings.goalFrequency}
- Daily Reminders: ${settings.dailyReminders ? 'Yes' : 'No'}
`
  }

  const systemPrompt = `You are an AI life coach helping someone improve their life based on their assessment:
- Overall: ${assessmentData.overall.percentile}th percentile
- Financial: ${assessmentData.categories.financial}th percentile  
- Health: ${assessmentData.categories.health}th percentile
- Social: ${assessmentData.categories.social}th percentile
- Personal: ${assessmentData.categories.romantic}th percentile
- Demographics: ${assessmentData.cohort.sex}, ${assessmentData.cohort.age_band}${contextInfo}

Be supportive, specific, and actionable. Keep responses concise but helpful. Use the progress and journal context to provide more personalized advice.`

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: userMessage }
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages as any,
      temperature: 0.8,
      max_tokens: 500,
    })

    const response = completion.choices[0].message.content || "I'm here to help! Can you tell me more about what you're working on?"

    return {
      message: response,
      suggestions: [
        "Tell me about your progress this week",
        "What's your biggest challenge right now?", 
        "How can I stay more motivated?"
      ]
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    return {
      message: "I'm having trouble connecting right now, but I'm here to support you! What would you like to work on today?",
      suggestions: [
        "Tell me about your progress this week",
        "What's your biggest obstacle right now?",
        "How can I help you stay motivated?"
      ]
    }
  }
}

function generateMockCoachingData(assessmentData: UserAssessmentData) {
  const categories = [
    { key: 'financial', value: assessmentData.categories.financial, name: 'Financial Health' },
    { key: 'health', value: assessmentData.categories.health, name: 'Physical Wellness' },
    { key: 'social', value: assessmentData.categories.social, name: 'Social Network' },
    { key: 'romantic', value: assessmentData.categories.romantic, name: 'Personal Growth' }
  ]

  const topStrength = categories.reduce((max, cat) => cat.value > max.value ? cat : max)
  const growthArea = categories.reduce((min, cat) => cat.value < min.value ? cat : min)

  const tasks = {
    financial: [
      "Set up automatic savings transfer of $50/week",
      "Track all expenses for one week using an app",
      "Research one investment option (index funds, ETFs, etc.)",
      "Calculate your net worth and create a simple spreadsheet",
      "Read one article about personal finance or budgeting"
    ],
    health: [
      "Take a 20-minute walk every day this week",
      "Prep healthy meals for 3 days in advance",
      "Drink 8 glasses of water daily and track it",
      "Go to bed 30 minutes earlier than usual",
      "Schedule one health checkup you've been postponing"
    ],
    social: [
      "Reach out to one old friend you haven't spoken to in months",
      "Join one new group or community (online or offline)",
      "Have one meaningful conversation with someone new",
      "Express gratitude to someone who has helped you recently",
      "Attend one social event or gathering this week"
    ],
    romantic: [
      "Journal for 15 minutes daily about your goals and feelings",
      "Set one personal boundary and practice maintaining it",
      "Learn something new about yourself through reflection",
      "Practice one stress-management technique daily",
      "Identify and work toward one personal goal this week"
    ]
  }

  return {
    insights: {
      topStrength: {
        category: topStrength.name,
        percentile: Math.round(topStrength.value),
        message: `Your ${topStrength.name.toLowerCase()} is your greatest asset. You're performing better than ${Math.round(topStrength.value)}% of your peers in this area. Let's leverage this strength to improve other areas of your life.`
      },
      growthArea: {
        category: growthArea.name,
        percentile: Math.round(growthArea.value),
        message: `Your ${growthArea.name.toLowerCase()} presents the greatest opportunity for growth. With focused effort, you can make significant improvements here.`
      },
      personalizedAnalysis: `As a ${assessmentData.cohort.sex} in the ${assessmentData.cohort.age_band} age group, you're well-positioned to make meaningful changes. Your overall ${assessmentData.overall.percentile}th percentile ranking shows strong fundamentals with clear areas for strategic improvement.`
    },
    weeklyPlan: {
      week: 1,
      focus: growthArea.key,
      tasks: tasks[growthArea.key as keyof typeof tasks] || tasks.financial,
      rationale: `These tasks are specifically designed to address your ${growthArea.name.toLowerCase()} while building on your existing strengths. Each task is achievable within your current life situation.`
    },
    dailyCheckins: [
      {
        day: "Monday",
        question: `How are you feeling about improving your ${growthArea.name.toLowerCase()} this week?`,
        tip: "Start with small, consistent actions. Progress compounds over time."
      },
      {
        day: "Tuesday", 
        question: "What's one specific thing you can do today to move forward?",
        tip: "Focus on the process, not perfection. Every small step counts."
      },
      {
        day: "Wednesday",
        question: "How did yesterday's actions make you feel about your progress?",
        tip: "Reflect on what's working well and what you can adjust."
      },
      {
        day: "Thursday",
        question: "What obstacle have you overcome so far this week?",
        tip: "Celebrate small wins - they build momentum for bigger changes."
      },
      {
        day: "Friday",
        question: "How will you maintain your progress over the weekend?",
        tip: "Plan ahead to keep your positive momentum going strong."
      }
    ],
    nextMilestone: {
      title: `Improve ${growthArea.name} by 10 percentile points`,
      target: `Move from ${Math.round(growthArea.value)}th to ${Math.round(growthArea.value + 10)}th percentile`,
      timeframe: "30 days",
      steps: [
        "Complete weekly action plans consistently",
        "Track daily progress and reflect on learnings", 
        "Apply insights from your top strength area",
        "Adjust strategies based on what works best for you"
      ]
    }
  }
}

export async function generateDailyTasks(assessmentData: UserAssessmentData, date: string, existingTasks: string[] = []) {
  // If no API key, return mock data
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
    return generateMockDailyTasks(assessmentData, date)
  }

  const prompt = `You are an AI life coach creating personalized daily tasks for ${date}. Based on the user's assessment data, create actionable daily tasks:

ASSESSMENT DATA:
- Overall Score: ${assessmentData.overall.score}/100 (${assessmentData.overall.percentile}th percentile)
- Financial Health: ${assessmentData.categories.financial}th percentile
- Physical Wellness: ${assessmentData.categories.health}th percentile
- Social Network: ${assessmentData.categories.social}th percentile
- Personal Growth: ${assessmentData.categories.romantic}th percentile
- Demographics: ${assessmentData.cohort.sex}, ${assessmentData.cohort.age_band}, ${assessmentData.cohort.region}

EXISTING TASKS: ${existingTasks.length > 0 ? existingTasks.join(', ') : 'None'}

REQUIREMENTS:
1. Create 6-8 diverse daily tasks across all 4 focus areas
2. Tasks should be achievable in 15-60 minutes each
3. Focus on the lowest scoring areas but include some from stronger areas
4. Make tasks specific, actionable, and relevant to their life stage
5. Avoid duplicating existing tasks
6. Consider it's ${new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}

FORMAT: Return valid JSON with this structure:
{
  "tasks": [
    {
      "title": "specific task title",
      "description": "brief explanation of why this helps",
      "category": "financial|health|social|personal",
      "priority": "high|medium|low",
      "estimatedMinutes": 30
    }
  ]
}`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert AI life coach who creates personalized, actionable daily tasks that lead to meaningful improvement across all life areas."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const response = completion.choices[0].message.content
    if (!response) throw new Error('No response from OpenAI')

    return JSON.parse(response)
  } catch (error) {
    console.error('OpenAI API error:', error)
    return generateMockDailyTasks(assessmentData, date)
  }
}

export async function generateWeeklyTasks(assessmentData: UserAssessmentData, weekNumber: number) {
  // If no API key, return mock data
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
    return generateMockWeeklyTasks(assessmentData, weekNumber)
  }

  const prompt = `You are an AI life coach creating personalized weekly tasks for Week ${weekNumber}. Based on the user's assessment data, create strategic weekly objectives:

ASSESSMENT DATA:
- Overall Score: ${assessmentData.overall.score}/100 (${assessmentData.overall.percentile}th percentile)
- Financial Health: ${assessmentData.categories.financial}th percentile
- Physical Wellness: ${assessmentData.categories.health}th percentile
- Social Network: ${assessmentData.categories.social}th percentile
- Personal Growth: ${assessmentData.categories.romantic}th percentile
- Demographics: ${assessmentData.cohort.sex}, ${assessmentData.cohort.age_band}, ${assessmentData.cohort.region}

REQUIREMENTS:
1. Create 12-16 weekly tasks across all 4 focus areas (3-4 per area)
2. Tasks should be completable within the week but require sustained effort
3. Prioritize the lowest scoring areas while maintaining balance
4. Make tasks build upon each other and create momentum
5. Consider their life stage and demographic context
6. Tasks should take 30 minutes to 2 hours each

FORMAT: Return valid JSON with this structure:
{
  "tasks": [
    {
      "title": "specific weekly objective",
      "description": "detailed explanation of the task and its benefits",
      "category": "financial|health|social|personal",
      "priority": "high|medium|low",
      "estimatedMinutes": 90
    }
  ]
}`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert AI life coach who creates strategic weekly objectives that drive meaningful long-term improvement across all life areas."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const response = completion.choices[0].message.content
    if (!response) throw new Error('No response from OpenAI')

    return JSON.parse(response)
  } catch (error) {
    console.error('OpenAI API error:', error)
    return generateMockWeeklyTasks(assessmentData, weekNumber)
  }
}

function generateMockDailyTasks(assessmentData: UserAssessmentData, date: string) {
  const categories = [
    { key: 'financial', value: assessmentData.categories.financial, name: 'Financial Health' },
    { key: 'health', value: assessmentData.categories.health, name: 'Physical Wellness' },
    { key: 'social', value: assessmentData.categories.social, name: 'Social Network' },
    { key: 'personal', value: assessmentData.categories.romantic, name: 'Personal Growth' }
  ]

  const lowestArea = categories.reduce((min, cat) => cat.value < min.value ? cat : min)
  
  const taskTemplates = {
    financial: [
      { title: "Review and update budget for this month", description: "Track spending and identify areas for improvement", priority: "high", estimatedMinutes: 30 },
      { title: "Research one investment opportunity", description: "Learn about index funds or retirement accounts", priority: "medium", estimatedMinutes: 45 },
      { title: "Check credit score and review report", description: "Monitor financial health and identify issues", priority: "medium", estimatedMinutes: 20 }
    ],
    health: [
      { title: "Take a 30-minute walk outdoors", description: "Improve cardiovascular health and mood", priority: "high", estimatedMinutes: 30 },
      { title: "Prepare a nutritious meal from scratch", description: "Practice healthy eating habits", priority: "medium", estimatedMinutes: 45 },
      { title: "Do 15 minutes of stretching or yoga", description: "Improve flexibility and reduce stress", priority: "medium", estimatedMinutes: 15 }
    ],
    social: [
      { title: "Call or text a friend you haven't spoken to recently", description: "Maintain important relationships", priority: "high", estimatedMinutes: 20 },
      { title: "Practice active listening in one conversation today", description: "Strengthen communication skills", priority: "medium", estimatedMinutes: 30 },
      { title: "Compliment or help someone genuinely", description: "Build positive social connections", priority: "low", estimatedMinutes: 10 }
    ],
    personal: [
      { title: "Journal for 10 minutes about today's goals", description: "Reflect on priorities and progress", priority: "high", estimatedMinutes: 10 },
      { title: "Learn something new for 20 minutes", description: "Expand knowledge and skills", priority: "medium", estimatedMinutes: 20 },
      { title: "Practice mindfulness or meditation", description: "Improve mental clarity and emotional regulation", priority: "medium", estimatedMinutes: 15 }
    ]
  }

  // Generate 6-8 tasks with emphasis on lowest scoring area
  const tasks = []
  
  // Add 2-3 tasks from lowest scoring area
  const lowestAreaTasks = taskTemplates[lowestArea.key as keyof typeof taskTemplates]
  tasks.push(...lowestAreaTasks.slice(0, 2))
  
  // Add 1-2 tasks from other areas
  categories.forEach(cat => {
    if (cat.key !== lowestArea.key) {
      const areaTasks = taskTemplates[cat.key as keyof typeof taskTemplates]
      tasks.push(areaTasks[0])
    }
  })

  return { tasks: tasks.map(task => ({ ...task, category: task.category || 'personal' })) }
}

function generateMockWeeklyTasks(assessmentData: UserAssessmentData, weekNumber: number) {
  const categories = [
    { key: 'financial', value: assessmentData.categories.financial, name: 'Financial Health' },
    { key: 'health', value: assessmentData.categories.health, name: 'Physical Wellness' },
    { key: 'social', value: assessmentData.categories.social, name: 'Social Network' },
    { key: 'personal', value: assessmentData.categories.romantic, name: 'Personal Growth' }
  ]

  const taskTemplates = {
    financial: [
      { title: "Set up automatic savings plan", description: "Establish consistent saving habits with automated transfers", priority: "high", estimatedMinutes: 60 },
      { title: "Complete comprehensive budget review", description: "Analyze spending patterns and optimize allocations", priority: "high", estimatedMinutes: 90 },
      { title: "Research and compare investment options", description: "Evaluate different investment vehicles for long-term growth", priority: "medium", estimatedMinutes: 120 },
      { title: "Negotiate one recurring bill or expense", description: "Reduce monthly expenses through negotiation", priority: "medium", estimatedMinutes: 45 }
    ],
    health: [
      { title: "Establish consistent workout routine", description: "Create and stick to exercise schedule for the week", priority: "high", estimatedMinutes: 180 },
      { title: "Meal prep for the entire week", description: "Prepare healthy meals to support nutrition goals", priority: "high", estimatedMinutes: 150 },
      { title: "Schedule preventive health checkup", description: "Book necessary medical appointments", priority: "medium", estimatedMinutes: 30 },
      { title: "Optimize sleep schedule", description: "Establish consistent bedtime and wake routines", priority: "medium", estimatedMinutes: 60 }
    ],
    social: [
      { title: "Plan and execute social gathering", description: "Organize an event to connect with friends or family", priority: "high", estimatedMinutes: 120 },
      { title: "Join a new group or community", description: "Find and participate in activities aligned with interests", priority: "medium", estimatedMinutes: 90 },
      { title: "Practice vulnerability in relationships", description: "Share something meaningful with someone close", priority: "medium", estimatedMinutes: 45 },
      { title: "Perform acts of service for others", description: "Help friends, family, or community members", priority: "low", estimatedMinutes: 60 }
    ],
    personal: [
      { title: "Define weekly personal development goal", description: "Set and work toward specific growth objective", priority: "high", estimatedMinutes: 90 },
      { title: "Complete skill-building course or tutorial", description: "Dedicate time to learning new competency", priority: "medium", estimatedMinutes: 180 },
      { title: "Conduct weekly reflection and planning", description: "Review progress and plan upcoming priorities", priority: "medium", estimatedMinutes: 45 },
      { title: "Practice stress management techniques", description: "Develop coping strategies for challenges", priority: "low", estimatedMinutes: 60 }
    ]
  }

  // Generate 3-4 tasks per area for balanced development
  const tasks: any[] = []
  categories.forEach(cat => {
    const areaTasks = taskTemplates[cat.key as keyof typeof taskTemplates]
    tasks.push(...areaTasks.slice(0, 3).map(task => ({ ...task, category: cat.key })))
  })

  return { tasks }
}

export { openai }
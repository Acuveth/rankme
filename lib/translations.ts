export type Language = 'en' | 'es' | 'fr' | 'de'

export interface Translations {
  // Header & Navigation
  header: {
    title: string
    signOut: string
  }
  
  // Dashboard
  dashboard: {
    welcome: string
    welcomeBack: string
    subtitle: string
    assessments: string
    totalCompleted: string
    dayStreak: string
    startStreak: string
    greatStart: string
    daysInRow: string
    latestScore: string
    outOf100: string
    percentile: string
    amongPeers: string
    yourAssessments: string
    takeNewAssessment: string
    noAssessmentsYet: string
    noAssessmentsDesc: string
    takeAssessment: string
    viewResults: string
    aiCoach: string
    getAiCoach: string
    viewReport: string
    deepReport: string
    lifeAssessment: string
    quickActions: string
    newAssessment: string
    aiCoachDashboard: string
    upgradeToAiCoach: string
    takeAssessmentUpgrade: string
    account: string
    email: string
    plan: string
    aiCoachPro: string
    free: string
    bestStreak: string
    days: string
    lastLogin: string
    youAre: string
    accountSettings: string
    recentActivity: string
    averageLoginTime: string
    needHelp: string
    needHelpDesc: string
    contactSupport: string
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
    yourTasks: string
    viewAiCoach: string
    todaysTasks: string
    thisWeeksTasks: string
  }
  
  // Account Settings
  settings: {
    accountSettings: string
    profileInformation: string
    accountName: string
    enterAccountName: string
    accountNameDesc: string
    country: string
    selectCountry: string
    gender: string
    selectGender: string
    male: string
    female: string
    other: string
    preferNotToSay: string
    changePassword: string
    currentPassword: string
    enterCurrentPassword: string
    newPassword: string
    enterNewPassword: string
    confirmPassword: string
    confirmNewPassword: string
    passwordFieldsDesc: string
    cancel: string
    saving: string
    saveChanges: string
    settingsUpdated: string
    emailCannotChange: string
  }
  
  // Countries
  countries: {
    us: string
    uk: string
    ca: string
    au: string
    de: string
    fr: string
    other: string
  }
  
  // Assessment
  assessment: {
    // Basic Assessment
    lifeAssessment: string
    assessmentDesc: string
    getStarted: string
    question: string
    of: string
    next: string
    previous: string
    submit: string
    selectOption: string
    completing: string
    almostDone: string
    
    // Cohort Setup
    letsGetStarted: string
    basicInformation: string
    basicInformationDesc: string
    age: string
    enterYourAge: string
    country: string
    selectYourCountry: string
    gender: string
    selectGender: string
    male: string
    female: string
    other: string
    preferNotToSay: string
    startAssessment: string
    informationConfidential: string
    
    // Questions Interface
    complete: string
    justGettingStarted: string
    makingGreatProgress: string
    halfwayThere: string
    almostFinished: string
    justAFewMore: string
    back: string
    review: string
    continueToQuestions: string
    
    // Categories
    financial: string
    healthFitness: string
    social: string
    romantic: string
    personal: string
    career: string
    personalGrowth: string
    
    // Category Descriptions
    financialHealthName: string
    financialHealthIntroduction: string
    financialHealthDescription: string
    physicalWellnessName: string
    physicalWellnessIntroduction: string
    physicalWellnessDescription: string
    socialNetworkName: string
    socialNetworkIntroduction: string
    socialNetworkDescription: string
    romanticName: string
    romanticIntroduction: string
    romanticDescription: string
    careerDevelopmentName: string
    careerDevelopmentIntroduction: string
    careerDevelopmentDescription: string
    personalGrowthName: string
    personalGrowthIntroduction: string
    personalGrowthDescription: string
    
    // Review Page
    reviewYourAssessment: string
    checkResponsesDesc: string
    editAnswers: string
    getMyResults: string
    
    // Category Names (for review)
    financialHealth: string
    physicalWellness: string
    socialNetwork: string
    personalGrowthCategory: string
    careerDevelopment: string
  }
  
  // Assessment Questions
  assessmentQuestions: {
    [key: string]: {
      label: string
      options?: string[]
      pnts?: string
    }
  }
  
  
  // Home Page
  home: {
    title: string
    beta: string
    heroTitle1: string
    heroTitle2: string
    heroSubtitle: string
    noSignupRequired: string
    getStarted: string
    newAssessment: string
    start: string
    startYourAssessment: string
    fourKeyDimensions: string
    assessmentEvaluatesDesc: string
    financialHealth: string
    financialHealthDesc: string
    physicalWellness: string
    physicalWellnessDesc: string
    socialNetwork: string
    socialNetworkDesc: string
    personalGrowth: string
    personalGrowthDesc: string
    whatYoullGet: string
    comprehensiveAssessment: string
    instantRankings: string
    professionalScorecard: string
    personalizedInsights: string
    premiumFeatures: string
    freeAssessment: string
    freeAssessmentDesc: string
    deepAnalysis: string
    deepAnalysisDesc: string
    aiLifeCoach: string
    aiLifeCoachDesc: string
    yourPrivacyMatters: string
    privacyDescription: string
    instantResults: string
    privacyFirst: string
    noSpam: string
    readyToDiscover: string
    joinThousands: string
    assessmentsTaken: string
    userRating: string
    completionRate: string
    about: string
    pricing: string
    dashboard: string
    signIn: string
    tryFree: string
    platformDesc: string
    privacy: string
    terms: string
    contact: string
    copyright: string
  }

  // Scorecard
  scorecard: {
    yourResults: string
    backToDashboard: string
    overallScore: string
    percentileRank: string
    categoryBreakdown: string
    getAiCoach: string
    getDeepReport: string
    shareResults: string
    takeAnother: string
    loading: string
    loadingResults: string
    scoreNotFound: string
    backToHome: string
    financialHealth: string
    physicalWellness: string
    socialNetwork: string
    personalGrowth: string
    excellent: string
    exceptional: string
    good: string
    average: string
    needsImprovement: string
    romantic: string
    career: string
    distribution: string
    sendMyResults: string
    deepAnalysis: string
    viewDeepReport: string
    emailYourResults: string
    enterEmailAddress: string
    emailResultsDesc: string
    assessmentStats: string
    saveYourResults: string
    createAccountDesc: string
    createFreeAccount: string
    signInToExistingAccount: string
    scorecardDesc: string
    resultsSentSuccessfully: string
    checkYourInbox: string
    sendToAnotherEmail: string
    aiLifeCoach: string
    greatJobSaveResults: string
    createFreeAccountTo: string
    trackProgressOverTime: string
    accessResultsAnyDevice: string
    compareImprovements: string
    getPersonalizedRecs: string
    iHaveAnAccount: string
    continueWithoutAccount: string
    downloadForStories: string
    shareLink: string
    howToUse: string
    uploadToInstagram: string
    shareWithFollowers: string
    somethingWentWrong: string
    scorecardShowsPercentiles: string
    unlockDeeperInsights: string
    accessYourReport: string
  }

  // Report Page
  report: {
    deepLifeAnalysisReport: string
    comprehensiveInsights: string
    executiveSummary: string
    overallScore: string
    performance: string
    overallPerformanceDistribution: string
    peerComparison: string
    peerComparisonText: string
    categoryBreakdown: string
    strengths: string
    opportunities: string
    recommendations: string
    actionPlan30Day: string
    week: string
    timeCommitment: string
    sampleReport: string
    sampleDescription: string
    financialHealth: string
    healthWellness: string
    socialConnections: string
    personalGrowth: string
    score: string
    percentile: string
    keyStrengths: string
    growthAreas: string
    performanceDistribution: string
    shareText: string
    captionCopied: string
    backToDashboard: string
    reportOverview: string
    assessmentDate: string
    questionsAnalyzed: string
    categoriesCovered: string
    peerGroupSize: string
    keyInsights: string
    topPerformer: string
    focusArea: string
    growthPotential: string
    shareReport: string
    downloadPDF: string
    categoryDeepDive: string
    quickWins: string
    wantOngoingSupport: string
    reportDataNotFound: string
    backToHome: string
    keyInsights: string
    youAreMostSimilarTo: string
    areas: string
    youExcelIn: string
    biggestOpportunityIn: string
    followingActionPlanCouldImprove: string
    shareYourLifeScore: string
    ofPeopleInYourDemographic: string
    thPercentile: string
    topPercent: string
    belowAverage: string
    aboveAverage: string
    bottomPercent: string
    yourLifeScore: string
    performanceBreakdown: string
    topStrength: string
    growthArea: string
    questionsAnswered: string
    completionTime: string
    seconds: string
    minutes: string
    mins: string
    sec: string
    defaultCompletionTime: string
    peerGroup: string
    recentActivity: string
    scoreDataNotFound: string
    readyToImproveYourScore: string
    improveScoreDescription: string
    shareYourLifeScore: string
    exceptional: string
    excellent: string
    good: string
    fair: string
    needsAttention: string
    personalizedInsights: string
    crossCategoryPatterns: string
    surprisingFindings: string
    longTermStrategy: string
    primaryLimitingFactor: string
    threeMonthGoals: string
    oneYearGoals: string
    recommendedResources: string
    primaryGrowthAreas: string
    generatingDeepReport: string
    individualQuestionAnalysis: string
    yourAnswer: string
    myRankMeLifeScoreDeepReport: string
    linkCopiedToClipboard: string
  }

  // Coach Dashboard
  coach: {
    // Navigation & Basic
    backToDashboard: string
    aiCoach: string
    yourCoach: string
    welcome: string
    weeklyGoals: string
    dailyTasks: string
    progress: string
    checkins: string
    achievements: string
    settings: string
    startWeek: string
    completeTask: string
    scheduleCheckin: string
    viewProgress: string
    welcomeTitle: string
    subscriptionActive: string
    coachNotFound: string
    
    // Header & Status
    yourAiLifeCoach: string
    activeSubscription: string
    daysLeftInTrial: string
    chatWithCoach: string
    
    // Focus Areas
    financialHealth: string
    physicalWellness: string
    socialNetwork: string
    personalDevelopment: string
    otherTasks: string
    
    // Date Navigation
    todaysGoals: string
    yesterdaysGoals: string
    tomorrowsGoals: string
    goalsFor: string
    
    // Onboarding
    letsGetYouStarted: string
    setYourCoachingPreferences: string
    chooseFocusAreaDesc: string
    scheduleYourCheckins: string
    setUpCheckinsDesc: string
    meetYourAiCoach: string
    firstConversationDesc: string
    
    // Benefits
    personalizedGoals: string
    personalizedGoalsDesc: string
    twentyFourSevenSupport: string
    twentyFourSevenSupportDesc: string
    trackProgress: string
    trackProgressDesc: string
    
    // Coach Configuration
    coachConfiguration: string
    primaryFocus: string
    secondary: string
    style: string
    motivation: string
    focusArea: string
    coachingStyle: string
    taskFrequency: string
    motivationLevel: string
    assessmentSpecificSettings: string
    difficulty: string
    
    // Coach Styles & Options
    supportive: string
    analytical: string
    direct: string
    encouraging: string
    gentle: string
    balanced: string
    intense: string
    easy: string
    moderate: string
    challenging: string
    financial: string
    health: string
    social: string
    personal: string
    none: string
    daily: string
    weekly: string
    
    // Progress
    yourProgress: string
    lastUpdated: string
    dayStreak: string
    completionRate: string
    currentScore: string
    pointsImproved: string
    sinceYouStarted: string
    onFire: string
    keepGoing: string
    completed: string
    percentile: string
    
    // Daily Progress
    dailyProgressByDay: string
    pastDays: string
    today: string
    future: string
    combinedWeeklyProgress: string
    allTasksForThisWeek: string
    weeklyTasks: string
    dailyGoals: string
    
    // Task Management
    weeklyTasksForWeek: string
    expandAll: string
    collapseAll: string
    expandTasks: string
    collapseTasks: string
    deleteTask: string
    showCompleted: string
    hideCompleted: string
    clickShowCompletedToView: string
    noGoalsSetForToday: string
    noGoalsPlanned: string
    noGoalsWereSet: string
    deleteGoal: string
    yesterday: string
    goToToday: string
    tomorrow: string
    
    // Chat Interface
    quickSuggestions: string
    howCanIImprove: string
    whatShouldIFocus: string
    feelingStuck: string
    typeYourMessage: string
    troubleConnecting: string
    
    // Journal
    reflectOnYourDay: string
    journalPrompt: string
    journalPlaceholder: string
    
    // Goals Management
    yourGoals: string
    addNewGoal: string
    goalCategory: string
    goalTitle: string
    goalDescription: string
    goalTarget: string
    goalDeadline: string
    goalDescriptionPlaceholder: string
    createGoal: string
    
    // Settings Modal
    accountSettings: string
    notifications: string
    dailyReminders: string
    weeklyReports: string
    reminderTime: string
    goalFrequency: string
    
    // Alerts & Messages
    taskCreatedSuccessfully: string
    failedToCreateTask: string
    journalEntrySaved: string
    journalEntryError: string
    checkInCompleted: string
    checkInFailed: string
    preferencesError: string
    checkInsSetupFailed: string
    coachingDataError: string
    goalCreated: string
    settingsSaved: string
    settingsError: string
    
    // Task Creator
    createTask: string
    taskTitle: string
    taskDescription: string
    category: string
    estimatedTime: string
    date: string
    creating: string
    enterTaskTitle: string
    describeTheTask: string
    
    // Journal Questions
    financialJournalPrompt: string
    healthJournalPrompt: string
    socialJournalPrompt: string
    personalJournalPrompt: string
    
    // Additional UI strings
    startYourStreakToday: string
    upcomingCheckIns: string
    quickActions: string
    needHelp: string
    questionsAboutCoaching: string
    noWeeklyTasksCompleted: string
    noDailyGoalsCompleted: string
    totalTasksCompleted: string
    clickShowCompletedDetails: string
    failedToUpdateTask: string
    failedToDeleteTask: string
    failedToSavePreferences: string
    checkInCompletedSuccess: string
    failedToCompleteCheckIn: string
    failedToSetupCheckIns: string
    failedToGenerateCoaching: string
    goalCreatedSuccess: string
    settingsSavedSuccess: string
    errorSavingSettings: string
    errorCreatingTask: string
    allFocusAreas: string
    completedTasksCount: string
    combinesAllTasks: string
    pastDays: string
    todayText: string
    futureText: string
    minutes: string
    contactSupport: string
    noCheckInsScheduled: string
    deleteGoal: string
    addNewGoal: string
    completedTasks: string
    totalTasksCompletedThis: string
    clickShowCompleted: string
    showCompleted: string
    hideCompleted: string
    noGoalsSetToday: string
    editSchedule: string
    completeNow: string
    overdue: string
    checkInType: string
    setUpCheckIns: string
    setUpCheckInsTitle: string
    continueSetup: string
    frequencyDaily: string
    frequencyWeekly: string
    frequencyBiweekly: string
    frequencyMonthly: string
    frequencyMultipleDaily: string
    dailyDescription: string
    weeklyDescription: string
    biweeklyDescription: string
    monthlyDescription: string
    multipleDailyDescription: string
    at: string
    howOften: string
    whenLabel: string
    times: string
    timeLabel: string
    daysLabel: string
    addTime: string
    hideAdvanced: string
    showAdvanced: string
    reminder: string
    schedule: string
    reminderMinBefore: string
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
    mon: string
    tue: string
    wed: string
    thu: string
    fri: string
    sat: string
    sun: string
    morning: string
    afternoon: string
    evening: string
    createNewTask: string
    createDailyGoal: string
    howCanIImprove: string
    whatShouldIFocus: string
    feelingStuck: string
    typeMessage: string
    sendMessage: string
    expandTasks: string
    collapseTasks: string
    workOnAllAreas: string
    expandAll: string
    collapseAll: string
    
    // Modal translations
    createWeeklyTasks: string
    weekOf: string
    taskNumber: string
    category: string
    taskTitle: string
    taskTitleRequired: string
    description: string
    descriptionRequired: string
    addTask: string
    saveTasks: string
    cancel: string
    financialHealth: string
    physicalWellness: string
    socialConnection: string
    personalDevelopment: string
    other: string
    createDailyTask: string
    priority: string
    date: string
    estimatedMinutes: string
    optional: string
    high: string
    medium: string
    low: string
    
    // Contact Support Modal
    howCanWeHelp: string
    subject: string
    message: string
    weWillRespondTo: string
    generalQuestion: string
    technicalIssue: string
    feedback: string
    featureRequest: string
    
    // Progress indicators
    complete: string
    noDailyGoalsCompleted: string
    overallProgress: string
    combined: string
    totalTasksCompletedThisWeek: string
    hideCompleted: string
    showCompleted: string
    
    // Additional elements that need translation
    weeklyTasks: string
    dailyGoalsToday: string
    week: string
    dailyGoals: string
    createYourFirstGoal: string
    needHelp: string
    questionsAboutCoachingPlan: string
    contactSupport: string
    addTask: string
    taskTitle: string
    descriptionOptional: string
    category: string
    priority: string
    date: string
    estMinutes: string
    createDailyTask: string
    
    // CoachPreferenceSetup component - Setup Process
    setupProgress: string
    step: string
    of: string
    stepOf: string
    welcomeToAICoach: string
    letsPersonalize: string
    personalizeExperience: string
    whatAreaFocus: string
    primaryFocusArea: string
    secondaryFocusArea: string
    secondaryFocusOptional: string
    
    // Focus Areas
    financialHealth: string
    physicalHealth: string
    socialLife: string
    personalGrowth: string
    budgetManagementWealth: string
    fitnessNutritionWellness: string
    relationshipsSocial: string
    selfImprovementSkills: string
    financialHealthDesc: string
    physicalHealthDesc: string
    socialLifeDesc: string
    personalGrowthDesc: string
    
    // Task Preferences
    taskPreferences: string
    howManyTasks: string
    dailyTasksCount: string
    weeklyTasksCount: string
    taskDifficulty: string
    oneTask: string
    tasksRecommended: string
    threeTasksRecommended: string
    twoThreeRecommended: string
    fiveTasks: string
    noWeeklyTasks: string
    recommendedTasks: string
    easy: string
    moderate: string
    challenging: string
    specificGoalsChallenges: string
    specificGoalsPlaceholder: string
    
    // Coaching Style
    coachingStyle: string
    howInteractWithYou: string
    howToInteract: string
    coachingApproach: string
    supportive: string
    direct: string
    motivational: string
    analytical: string
    supportiveDesc: string
    directDesc: string
    motivationalDesc: string
    analyticalDesc: string
    motivationLevel: string
    gentle: string
    balanced: string
    intense: string
    softEncouragement: string
    mixedApproach: string
    pushMeHard: string
    gentleDesc: string
    balancedDesc: string
    intenseDesc: string
    
    // Check-in Preferences  
    checkinPreferences: string
    howOftenCheckin: string
    howOftenCheckIn: string
    checkinFrequency: string
    preferredCheckinTime: string
    daily: string
    weekly: string
    biweekly: string
    youreAllSet: string
    preferencesWillBeSaved: string
    completeSetup: string
    saving: string
    
    // Journal & Reflection
    dailyJournal: string
    reflectOnTodaysProgress: string
    todaysReflection: string
    yourThoughts: string
    charactersCount: string
    journalingTips: string
    beHonestAuthentic: string
    focusSpecificExamples: string
    considerWhatLearned: string
    celebrateSmallWins: string
    
    // Personal Goals
    personalGoals: string
    setTrackObjectives: string
    yourCurrentGoals: string
    noGoalsSetYet: string
    addNewGoal: string
    goalTitle: string
    descriptionOptional: string
    targetOptional: string
    deadlineOptional: string
    
    // Settings Display Labels
    focusArea: string
    secondary: string
    taskFrequency: string
    assessmentSpecificSettings: string
    moderateDifficulty: string
    personal: string
    social: string
    
    // Navigation & Actions
    back: string
    next: string
    
    // Additional UI Elements
    createTasks: string
    setNewGoals: string
    hereToHelpGrow: string
    startAConversation: string
    askMeAboutProgress: string
    coachCapabilitiesTitle: string
    coachCapabilitiesSubtitle: string
    taskManagement: string
    taskManagementDesc: string
    progressTracking: string
    progressTrackingDesc: string
    personalizedAdvice: string
    personalizedAdviceDesc: string
    goalSetting: string
    goalSettingDesc: string
    exampleQuestions: string
    viewFullReport: string
    deepAnalysisInsights: string
    viewJournalEntries: string
    readPastReflections: string
    noJournalEntries: string
    journalEntriesTitle: string
    journalEntriesSubtitle: string
    briefDescription: string
    message: string
    pleaseProvideDetails: string
    updateYourObjectives: string
    categorySelection: string
    noGoalsSetYet: string
    category: string
    goalTitle: string
    descriptionOptional: string
    targetOptional: string
    deadlineOptional: string
    journalingTips: string
    beHonestAuthentic: string
    focusOnSpecificExamples: string
    considerWhatYouLearned: string
    celebrateSmallWins: string
    
    // Journal & Buttons
    takeAMomentToReflect: string
    cancel: string
    saveEntry: string
    createGoal: string
    weekNumber: string
    dailyCheckIn: string
    
    // Configuration Display
    moderateDifficulty: string
    
    // Form Validation & Placeholders
    enterFullName: string
    enterEmail: string
    createPassword: string
    confirmPassword: string
    yourName: string
  }

  // Predictive Insights
  insights: {
    // Main Component Headers
    aiPredictiveInsights: string
    aiInsights: string
    quickInsights: string
    
    // Description Text
    insightsBasedOnAssessment: string
    insightsBasedOnAllAssessments: string
    analyzingPatterns: string
    gatheringData: string
    noMoreInsights: string
    checkBackLater: string
    
    // Insight Type Labels
    riskAlert: string
    patternForecast: string
    smartRecommendation: string
    strategicTiming: string
    deepInsights: string
    
    // Insight Type Descriptions  
    riskAlertDesc: string
    patternForecastDesc: string
    smartRecommendationDesc: string
    strategicTimingDesc: string
    deepInsightsDesc: string
    
    // Priority Labels
    highPriority: string
    mediumPriority: string
    lowPriority: string
    confident: string
    
    // Filter Labels
    allInsights: string
    
    // Action Labels
    viewActions: string
    suggestedActions: string
    dismissInsight: string
    refreshInsights: string
    tryAgain: string
    
    // Metadata
    cached: string
    cachedFrom: string
    generated: string
    expires: string
    fromCache: string
    confidenceHigh: string
    confidenceMedium: string
    confidenceLow: string
    allAssessmentsMode: string
    
    // Error Messages
    errorLoadingInsights: string
    
    // Specific Insight Messages
    taskCompletionRisk: string
    streakAtRisk: string
    peakProductivityDetected: string
    weeklyPatternIdentified: string
    productivityDeclineDetected: string
    productivitySurge: string
    cohortSuccessPattern: string
    focusAreaIdentified: string
    optimalTaskLoad: string
    strategicPlanningAlert: string
    energyManagementTip: string
    burnoutPreventionAlert: string
    moodPerformanceConnection: string
    goalAchievementPattern: string
    taskTimingPattern: string
    
    // Common Action Suggestions
    scheduleTasksOptimalTime: string
    setReminder30Minutes: string
    prepareMaterialsTonight: string
    breakTasksIntoSteps: string
    completeOneMoreTask: string
    focusOnQuickWins: string
    setTimer25Minutes: string
    tryOptimalTimeForWeek: string
    setDailyReminders: string
    trackCompletionRate: string
    adjustSchedule: string
    planChallengingTasks: string
    useOptimalDay: string
    scheduleEasierTasks: string
    reviewSimplifyGoals: string
    takeShortBreak: string
    focusOneCategory: string
    adjustTaskDifficulty: string
    documentWhatWorks: string
    increaseTaskDifficulty: string
    shareSuccessStrategies: string
    setAmbitiousGoals: string
    prePlanSimpleWins: string
    scheduleFavoriteActivities: string
    prepareEverythingNight: string
    partnerAccountability: string
    makeRestPlanningDay: string
    scheduleBreaksBeforeEnergyDips: string
    planEnergizingActivities: string
    adjustMealTiming: string
    try10MinuteWalk: string
    takeCompleteRestDay: string
    reduceTaskLoad30Percent: string
    focusEssentialTasks: string
    scheduleEnjoyableActivity: string
    practiceSayingNo: string
    noticeWhatCreatesMood: string
    planImportantTasksGoodMood: string
    developShiftingStrategies: string
    keepJournaling: string
    considerMoodBoostingActivities: string
    breakLongTermGoals: string
    celebrateHalfwayPoint: string
    reviewGoalsWeekly: string
    try2MinuteRule: string
    scheduleTasksImmediately: string
    setCompletionDeadlines: string
    useTimeBlocking: string
  }

  // Common
  common: {
    loading: string
    error: string
    success: string
    save: string
    cancel: string
    close: string
    edit: string
    delete: string
    confirm: string
    back: string
    continue: string
    finish: string
    yes: string
    no: string
    today: string
    yesterday: string
    thisWeek: string
    lastWeek: string
    language: string
    overdue: string
    completeNow: string
  }
  
  // About Page
  about: {
    backToHome: string
    aboutRankMe: string
    aboutSubtitle: string
    ourMission: string
    ourMissionDesc: string
    whatMakesUsDifferent: string
    whatMakesUsDesc: string
    evidenceBased: string
    evidenceBasedDesc: string
    peerCalibrated: string
    peerCalibratedDesc: string
    aiPowered: string
    aiPoweredDesc: string
    fourLifeDimensions: string
    fourDimensionsDesc: string
    financialHealthDim: string
    financialHealthDimDesc: string
    physicalWellnessDim: string
    physicalWellnessDimDesc: string
    socialNetworkDim: string
    socialNetworkDimDesc: string
    personalGrowthDim: string
    personalGrowthDimDesc: string
    ourApproach: string
    comprehensiveAssessmentStep: string
    comprehensiveAssessmentDesc: string
    dataDrivenInsights: string
    dataDrivenInsightsDesc: string
    personalizedActionPlans: string
    personalizedActionPlansDesc: string
    ongoingSupport: string
    ongoingSupportDesc: string
    privacySecurityFirst: string
    privacySecurityDesc: string
    noDataSelling: string
    noDataSellingDesc: string
    encryptedStorage: string
    encryptedStorageDesc: string
    anonymousAnalytics: string
    anonymousAnalyticsDesc: string
    trustedByThousands: string
    trustedDesc: string
    assessmentsCompleted: string
    averageUserRating: string
    dataPointsAnalyzed: string
    readyToGetStarted: string
    takeFirstStep: string
    takeAssessment: string
  }

  // Login patterns
  pricing: {
    // Header
    backToHome: string
    pageTitle: string
    pageSubtitle: string
    
    // Billing Cycle
    monthly: string
    yearly: string
    
    // Free Assessment Plan
    freeAssessment: string
    freeAssessmentDesc: string
    freePrice: string
    alwaysFree: string
    freeFeature1: string
    freeFeature2: string
    freeFeature3: string
    freeFeature4: string
    startFreeAssessment: string
    
    // Deep Report Plan
    mostPopular: string
    deepAnalysisReport: string
    deepAnalysisDesc: string
    deepPrice: string
    oneTimePurchase: string
    deepFeature1: string
    deepFeature2: string
    deepFeature3: string
    deepFeature4: string
    deepFeature5: string
    deepFeature6: string
    getDeepAnalysis: string
    
    // AI Coach Plan
    aiLifeCoach: string
    aiCoachDesc: string
    monthlyPrice: string
    yearlyPrice: string
    perMonth: string
    billedYearly: string
    savePerYear: string
    aiCoachFeature1: string
    aiCoachFeature2: string
    aiCoachFeature3: string
    aiCoachFeature4: string
    aiCoachFeature5: string
    aiCoachFeature6: string
    startFreeTrial: string
    sevenDaysFree: string
    
    // Feature Comparison
    featureComparison: string
    features: string
    free: string
    deepReport: string
    aiCoach: string
    feature32Question: string
    featureBasicRankings: string
    featureDetailedAnalysis: string
    feature30DayPlan: string
    featurePdfDownload: string
    featureWeeklyPlans: string
    featureDailyCheckins: string
    featureProgressTracking: string
    
    // Trust Indicators
    thirtyDayGuarantee: string
    guaranteeDesc: string
    rating: string
    ratingDesc: string
    instantAccess: string
    instantAccessDesc: string
    
    // FAQ
    faqTitle: string
    faq1Question: string
    faq1Answer: string
    faq2Question: string
    faq2Answer: string
    faq3Question: string
    faq3Answer: string
    faq4Question: string
    faq4Answer: string
    faq5Question: string
    faq5Answer: string
    faq6Question: string
    faq6Answer: string
    
    // CTA Section
    ctaTitle: string
    ctaSubtitle: string
    ctaStartAssessment: string
    ctaViewSample: string
  }

  loginPatterns: {
    earlyBird: string
    nightOwl: string
    consistent: string
    weekend: string
    weekday: string
    irregular: string
  }
}

export type TranslationKey = 
  | 'header.title'
  | 'header.signOut'
  | 'home.title'
  | 'home.hero'
  | 'home.heroSubtitle'
  | 'home.getStarted'
  | 'home.financialHealth'
  | 'home.financialHealthDesc'
  | 'home.physicalWellness'
  | 'home.physicalWellnessDesc'
  | 'home.socialNetwork'
  | 'home.socialNetworkDesc'
  | 'home.personalGrowth'
  | 'home.personalGrowthDesc'
  | 'home.comprehensiveAssessment'
  | 'home.instantRankings'
  | 'home.professionalScorecard'
  | 'home.personalizedInsights'
  | 'home.assessmentsTaken'
  | 'home.userRating'
  | 'home.completionRate'
  | 'home.about'
  | 'home.pricing'
  | 'home.dashboard'
  | 'home.signIn'
  | 'home.tryFree'
  | 'scorecard.yourResults'
  | 'scorecard.backToDashboard'
  | 'scorecard.overallScore'
  | 'scorecard.percentileRank'
  | 'scorecard.categoryBreakdown'
  | 'scorecard.getAiCoach'
  | 'scorecard.getDeepReport'
  | 'scorecard.shareResults'
  | 'scorecard.takeAnother'
  | 'scorecard.loading'
  | 'scorecard.loadingResults'
  | 'scorecard.scoreNotFound'
  | 'scorecard.backToHome'
  | 'scorecard.financialHealth'
  | 'scorecard.physicalWellness'
  | 'scorecard.socialNetwork'
  | 'scorecard.personalGrowth'
  | 'scorecard.excellent'
  | 'scorecard.exceptional'
  | 'scorecard.good'
  | 'scorecard.average'
  | 'scorecard.needsImprovement'
  | 'scorecard.romantic'
  | 'scorecard.career'
  | 'scorecard.distribution'
  | 'scorecard.sendMyResults'
  | 'scorecard.deepAnalysis'
  | 'scorecard.viewDeepReport'
  | 'scorecard.emailYourResults'
  | 'scorecard.enterEmailAddress'
  | 'scorecard.emailResultsDesc'
  | 'scorecard.assessmentStats'
  | 'scorecard.saveYourResults'
  | 'scorecard.createAccountDesc'
  | 'scorecard.createFreeAccount'
  | 'scorecard.signInToExistingAccount'
  | 'scorecard.scorecardDesc'
  | 'scorecard.resultsSentSuccessfully'
  | 'scorecard.checkYourInbox'
  | 'scorecard.sendToAnotherEmail'
  | 'scorecard.aiLifeCoach'
  | 'scorecard.greatJobSaveResults'
  | 'scorecard.createFreeAccountTo'
  | 'scorecard.trackProgressOverTime'
  | 'scorecard.accessResultsAnyDevice'
  | 'scorecard.compareImprovements'
  | 'scorecard.getPersonalizedRecs'
  | 'scorecard.iHaveAnAccount'
  | 'scorecard.continueWithoutAccount'
  | 'scorecard.downloadForStories'
  | 'scorecard.shareLink'
  | 'scorecard.howToUse'
  | 'scorecard.uploadToInstagram'
  | 'scorecard.shareWithFollowers'
  | 'scorecard.somethingWentWrong'
  | 'scorecard.scorecardShowsPercentiles'
  | 'scorecard.unlockDeeperInsights'
  | 'scorecard.accessYourReport'
  | 'report.deepLifeAnalysisReport'
  | 'report.comprehensiveInsights'
  | 'report.executiveSummary'
  | 'report.overallScore'
  | 'report.performance'
  | 'report.overallPerformanceDistribution'
  | 'report.peerComparison'
  | 'report.peerComparisonText'
  | 'report.categoryBreakdown'
  | 'report.strengths'
  | 'report.opportunities'
  | 'report.recommendations'
  | 'report.actionPlan30Day'
  | 'report.week'
  | 'report.timeCommitment'
  | 'report.sampleReport'
  | 'report.sampleDescription'
  | 'report.financialHealth'
  | 'report.healthWellness'
  | 'report.socialConnections'
  | 'report.personalGrowth'
  | 'report.score'
  | 'report.percentile'
  | 'report.keyStrengths'
  | 'report.growthAreas'
  | 'report.performanceDistribution'
  | 'report.shareText'
  | 'report.captionCopied'
  | 'report.backToDashboard'
  | 'report.reportOverview'
  | 'report.assessmentDate'
  | 'report.questionsAnalyzed'
  | 'report.categoriesCovered'
  | 'report.peerGroupSize'
  | 'report.keyInsights'
  | 'report.topPerformer'
  | 'report.focusArea'
  | 'report.growthPotential'
  | 'report.shareReport'
  | 'report.downloadPDF'
  | 'report.categoryDeepDive'
  | 'report.quickWins'
  | 'report.wantOngoingSupport'
  | 'report.reportDataNotFound'
  | 'report.backToHome'
  | 'report.keyInsights'
  | 'report.youAreMostSimilarTo'
  | 'report.areas'
  | 'report.youExcelIn'
  | 'report.biggestOpportunityIn'
  | 'report.followingActionPlanCouldImprove'
  | 'report.shareYourLifeScore'
  | 'report.ofPeopleInYourDemographic'
  | 'report.thPercentile'
  | 'report.topPercent'
  | 'report.belowAverage'
  | 'report.aboveAverage'
  | 'report.bottomPercent'
  | 'report.yourLifeScore'
  | 'report.performanceBreakdown'
  | 'report.topStrength'
  | 'report.growthArea'
  | 'report.questionsAnswered'
  | 'report.completionTime'
  | 'report.seconds'
  | 'report.minutes'
  | 'report.mins'
  | 'report.sec'
  | 'report.defaultCompletionTime'
  | 'report.peerGroup'
  | 'report.recentActivity'
  | 'report.scoreDataNotFound'
  | 'report.readyToImproveYourScore'
  | 'report.improveScoreDescription'
  | 'report.shareYourLifeScore'
  | 'report.exceptional'
  | 'report.excellent'
  | 'report.good'
  | 'report.fair'
  | 'report.needsAttention'
  | 'report.crossCategoryPatterns'
  | 'report.surprisingFindings'
  | 'report.longTermStrategy'
  | 'report.primaryLimitingFactor'
  | 'report.threeMonthGoals'
  | 'report.oneYearGoals'
  | 'report.recommendedResources'
  | 'report.primaryGrowthAreas'
  | 'report.generatingDeepReport'
  | 'report.individualQuestionAnalysis'
  | 'report.yourAnswer'
  | 'report.myRankMeLifeScoreDeepReport'
  | 'report.linkCopiedToClipboard'
  | 'coach.backToDashboard'
  | 'coach.aiCoach'
  | 'coach.yourCoach'
  | 'coach.welcome'
  | 'coach.weeklyGoals'
  | 'coach.dailyTasks'
  | 'coach.progress'
  | 'coach.checkins'
  | 'coach.achievements'
  | 'coach.settings'
  | 'coach.startWeek'
  | 'coach.completeTask'
  | 'coach.scheduleCheckin'
  | 'coach.viewProgress'
  | 'coach.welcomeTitle'
  | 'coach.subscriptionActive'
  | 'coach.coachNotFound'
  | 'coach.yourAiLifeCoach'
  | 'coach.activeSubscription'
  | 'coach.daysLeftInTrial'
  | 'coach.chatWithCoach'
  | 'coach.financialHealth'
  | 'coach.physicalWellness'
  | 'coach.socialNetwork'
  | 'coach.personalDevelopment'
  | 'coach.otherTasks'
  | 'coach.todaysGoals'
  | 'coach.yesterdaysGoals'
  | 'coach.tomorrowsGoals'
  | 'coach.goalsFor'
  | 'coach.letsGetYouStarted'
  | 'coach.setYourCoachingPreferences'
  | 'coach.chooseFocusAreaDesc'
  | 'coach.scheduleYourCheckins'
  | 'coach.setUpCheckinsDesc'
  | 'coach.meetYourAiCoach'
  | 'coach.firstConversationDesc'
  | 'coach.personalizedGoals'
  | 'coach.personalizedGoalsDesc'
  | 'coach.twentyFourSevenSupport'
  | 'coach.twentyFourSevenSupportDesc'
  | 'coach.trackProgress'
  | 'coach.trackProgressDesc'
  | 'coach.coachConfiguration'
  | 'coach.primaryFocus'
  | 'coach.secondary'
  | 'coach.style'
  | 'coach.motivation'
  | 'coach.focusArea'
  | 'coach.coachingStyle'
  | 'coach.taskFrequency'
  | 'coach.motivationLevel'
  | 'coach.assessmentSpecificSettings'
  | 'coach.difficulty'
  | 'coach.supportive'
  | 'coach.analytical'
  | 'coach.direct'
  | 'coach.encouraging'
  | 'coach.gentle'
  | 'coach.balanced'
  | 'coach.intense'
  | 'coach.easy'
  | 'coach.moderate'
  | 'coach.challenging'
  | 'coach.financial'
  | 'coach.health'
  | 'coach.social'
  | 'coach.personal'
  | 'coach.none'
  | 'coach.daily'
  | 'coach.weekly'
  | 'coach.yourProgress'
  | 'coach.lastUpdated'
  | 'coach.dayStreak'
  | 'coach.completionRate'
  | 'coach.currentScore'
  | 'coach.pointsImproved'
  | 'coach.sinceYouStarted'
  | 'coach.onFire'
  | 'coach.keepGoing'
  | 'coach.completed'
  | 'coach.percentile'
  | 'coach.dailyProgressByDay'
  | 'coach.pastDays'
  | 'coach.today'
  | 'coach.future'
  | 'coach.combinedWeeklyProgress'
  | 'coach.allTasksForThisWeek'
  | 'coach.weeklyTasks'
  | 'coach.dailyGoals'
  | 'coach.weeklyTasksForWeek'
  | 'coach.expandAll'
  | 'coach.collapseAll'
  | 'coach.expandTasks'
  | 'coach.collapseTasks'
  | 'coach.deleteTask'
  | 'coach.showCompleted'
  | 'coach.hideCompleted'
  | 'coach.weeklyTasks'
  | 'coach.dailyGoalsToday'
  | 'coach.week'
  | 'coach.dailyGoals'
  | 'coach.createYourFirstGoal'
  | 'coach.needHelp'
  | 'coach.questionsAboutCoachingPlan'
  | 'coach.contactSupport'
  | 'coach.addTask'
  | 'coach.taskTitle'
  | 'coach.descriptionOptional'
  | 'coach.category'
  | 'coach.priority'
  | 'coach.date'
  | 'coach.estMinutes'
  | 'coach.createDailyTask'
  | 'coach.setupProgress'
  | 'coach.stepOf'
  | 'coach.welcomeToAICoach'
  | 'coach.personalizeExperience'
  | 'coach.whatAreaFocus'
  | 'coach.primaryFocusArea'
  | 'coach.secondaryFocusArea'
  | 'coach.secondaryFocusOptional'
  | 'coach.financialHealth'
  | 'coach.physicalHealth'
  | 'coach.socialLife'
  | 'coach.personalGrowth'
  | 'coach.budgetManagementWealth'
  | 'coach.fitnessNutritionWellness'
  | 'coach.relationshipsSocial'
  | 'coach.selfImprovementSkills'
  | 'coach.taskPreferences'
  | 'coach.howManyTasks'
  | 'coach.dailyTasksCount'
  | 'coach.weeklyTasksCount'
  | 'coach.taskDifficulty'
  | 'coach.oneTask'
  | 'coach.tasksRecommended'
  | 'coach.fiveTasks'
  | 'coach.noWeeklyTasks'
  | 'coach.recommendedTasks'
  | 'coach.easy'
  | 'coach.moderate'
  | 'coach.challenging'
  | 'coach.specificGoalsChallenges'
  | 'coach.specificGoalsPlaceholder'
  | 'coach.coachingStyle'
  | 'coach.howInteractWithYou'
  | 'coach.coachingApproach'
  | 'coach.supportive'
  | 'coach.direct'
  | 'coach.motivational'
  | 'coach.analytical'
  | 'coach.supportiveDesc'
  | 'coach.directDesc'
  | 'coach.motivationalDesc'
  | 'coach.analyticalDesc'
  | 'coach.motivationLevel'
  | 'coach.gentle'
  | 'coach.balanced'
  | 'coach.intense'
  | 'coach.softEncouragement'
  | 'coach.mixedApproach'
  | 'coach.pushMeHard'
  | 'coach.checkinPreferences'
  | 'coach.howOftenCheckin'
  | 'coach.checkinFrequency'
  | 'coach.preferredCheckinTime'
  | 'coach.daily'
  | 'coach.weekly'
  | 'coach.biweekly'
  | 'coach.youreAllSet'
  | 'coach.preferencesWillBeSaved'
  | 'coach.completeSetup'
  | 'coach.saving'
  | 'coach.dailyJournal'
  | 'coach.reflectOnTodaysProgress'
  | 'coach.todaysReflection'
  | 'coach.yourThoughts'
  | 'coach.charactersCount'
  | 'coach.journalingTips'
  | 'coach.beHonestAuthentic'
  | 'coach.focusSpecificExamples'
  | 'coach.considerWhatLearned'
  | 'coach.celebrateSmallWins'
  | 'coach.personalGoals'
  | 'coach.setTrackObjectives'
  | 'coach.setAndTrackObjectives'
  | 'coach.reflectOnProgress'
  | 'coach.selectCategory'
  | 'coach.goalTitlePlaceholder'
  | 'coach.goalDescriptionPlaceholder'
  | 'coach.goalTargetPlaceholder'
  | 'coach.taskTitlePlaceholder'
  | 'coach.taskDescriptionPlaceholder'
  | 'coach.yourCurrentGoals'
  | 'coach.noGoalsSetYet'
  | 'coach.addNewGoal'
  | 'coach.goalTitle'
  | 'coach.targetOptional'
  | 'coach.deadlineOptional'
  | 'coach.focusArea'
  | 'coach.secondary'
  | 'coach.taskFrequency'
  | 'coach.assessmentSpecificSettings'
  | 'coach.moderateDifficulty'
  | 'coach.personal'
  | 'coach.social'
  | 'coach.coachingStyleLabel'
  | 'coach.motivationLevel'
  | 'coach.daily'
  | 'coach.weekly'
  | 'coach.difficulty'
  | 'coach.back'
  | 'coach.next'
  | 'coach.enterFullName'
  | 'coach.enterEmail'
  | 'coach.createPassword'
  | 'coach.confirmPassword'
  | 'coach.yourName'
  | 'coach.createTasks'
  | 'coach.setNewGoals'
  | 'coach.hereToHelpGrow'
  | 'coach.startAConversation'
  | 'coach.askMeAboutProgress'
  | 'coach.coachCapabilitiesTitle'
  | 'coach.coachCapabilitiesSubtitle'
  | 'coach.taskManagement'
  | 'coach.taskManagementDesc'
  | 'coach.progressTracking'
  | 'coach.progressTrackingDesc'
  | 'coach.personalizedAdvice'
  | 'coach.personalizedAdviceDesc'
  | 'coach.goalSetting'
  | 'coach.goalSettingDesc'
  | 'coach.exampleQuestions'
  | 'coach.viewFullReport'
  | 'coach.deepAnalysisInsights'
  | 'coach.viewJournalEntries'
  | 'coach.readPastReflections'
  | 'coach.noJournalEntries'
  | 'coach.journalEntriesTitle'
  | 'coach.journalEntriesSubtitle'
  | 'coach.briefDescription'
  | 'coach.message'
  | 'coach.pleaseProvideDetails'
  | 'coach.updateYourObjectives'
  | 'coach.categorySelection'
  | 'coach.noGoalsSetYet'
  | 'coach.category'
  | 'coach.goalTitle'
  | 'coach.descriptionOptional'
  | 'coach.targetOptional'
  | 'coach.deadlineOptional'
  | 'coach.journalingTips'
  | 'coach.beHonestAuthentic'
  | 'coach.focusOnSpecificExamples'
  | 'coach.considerWhatYouLearned'
  | 'coach.celebrateSmallWins'
  | 'coach.takeAMomentToReflect'
  | 'coach.cancel'
  | 'coach.saveEntry'
  | 'coach.createGoal'
  | 'coach.weekNumber'
  | 'coach.dailyCheckIn'
  | 'coach.moderateDifficulty'
  | 'coach.clickShowCompletedToView'
  | 'coach.noGoalsSetForToday'
  | 'coach.noGoalsPlanned'
  | 'coach.noGoalsWereSet'
  | 'coach.deleteGoal'
  | 'coach.yesterday'
  | 'coach.goToToday'
  | 'coach.tomorrow'
  | 'coach.quickSuggestions'
  | 'coach.howCanIImprove'
  | 'coach.whatShouldIFocus'
  | 'coach.feelingStuck'
  | 'coach.typeYourMessage'
  | 'coach.troubleConnecting'
  | 'coach.reflectOnYourDay'
  | 'coach.journalPrompt'
  | 'coach.journalPlaceholder'
  | 'coach.yourGoals'
  | 'coach.addNewGoal'
  | 'coach.goalCategory'
  | 'coach.goalTitle'
  | 'coach.goalDescription'
  | 'coach.goalTarget'
  | 'coach.goalDeadline'
  | 'coach.goalDescriptionPlaceholder'
  | 'coach.createGoal'
  | 'coach.accountSettings'
  | 'coach.notifications'
  | 'coach.dailyReminders'
  | 'coach.weeklyReports'
  | 'coach.reminderTime'
  | 'coach.goalFrequency'
  | 'coach.taskCreatedSuccessfully'
  | 'coach.failedToCreateTask'
  | 'coach.journalEntrySaved'
  | 'coach.journalEntryError'
  | 'coach.coachingDataError'
  | 'coach.financialJournalPrompt'
  | 'coach.healthJournalPrompt'
  | 'coach.socialJournalPrompt'
  | 'coach.personalJournalPrompt'
  | 'coach.setUpCheckInsTitle'
  | 'coach.continueSetup'
  | 'coach.frequencyDaily'
  | 'coach.frequencyWeekly'
  | 'coach.frequencyBiweekly'
  | 'coach.frequencyMonthly'
  | 'coach.frequencyMultipleDaily'
  | 'coach.dailyDescription'
  | 'coach.weeklyDescription'
  | 'coach.biweeklyDescription'
  | 'coach.monthlyDescription'
  | 'coach.multipleDailyDescription'
  | 'coach.at'
  | 'coach.howOften'
  | 'coach.whenLabel'
  | 'coach.times'
  | 'coach.timeLabel'
  | 'coach.daysLabel'
  | 'coach.addTime'
  | 'coach.hideAdvanced'
  | 'coach.showAdvanced'
  | 'coach.reminder'
  | 'coach.schedule'
  | 'coach.reminderMinBefore'
  | 'coach.monday'
  | 'coach.tuesday'
  | 'coach.wednesday'
  | 'coach.thursday'
  | 'coach.friday'
  | 'coach.saturday'
  | 'coach.sunday'
  | 'coach.mon'
  | 'coach.tue'
  | 'coach.wed'
  | 'coach.thu'
  | 'coach.fri'
  | 'coach.sat'
  | 'coach.sun'
  | 'coach.morning'
  | 'coach.afternoon'
  | 'coach.evening'
  | 'dashboard.welcome'
  | 'dashboard.welcomeBack'
  | 'dashboard.subtitle'
  | 'dashboard.assessments'
  | 'dashboard.totalCompleted'
  | 'dashboard.dayStreak'
  | 'dashboard.startStreak'
  | 'dashboard.greatStart'
  | 'dashboard.daysInRow'
  | 'dashboard.latestScore'
  | 'dashboard.outOf100'
  | 'dashboard.percentile'
  | 'dashboard.amongPeers'
  | 'dashboard.yourAssessments'
  | 'dashboard.takeNewAssessment'
  | 'dashboard.noAssessmentsYet'
  | 'dashboard.noAssessmentsDesc'
  | 'dashboard.takeAssessment'
  | 'dashboard.viewResults'
  | 'dashboard.aiCoach'
  | 'dashboard.getAiCoach'
  | 'dashboard.viewReport'
  | 'dashboard.deepReport'
  | 'dashboard.lifeAssessment'
  | 'dashboard.quickActions'
  | 'dashboard.newAssessment'
  | 'dashboard.aiCoachDashboard'
  | 'dashboard.upgradeToAiCoach'
  | 'dashboard.takeAssessmentUpgrade'
  | 'dashboard.account'
  | 'dashboard.email'
  | 'dashboard.plan'
  | 'dashboard.aiCoachPro'
  | 'dashboard.free'
  | 'dashboard.bestStreak'
  | 'dashboard.days'
  | 'dashboard.lastLogin'
  | 'dashboard.youAre'
  | 'dashboard.accountSettings'
  | 'dashboard.recentActivity'
  | 'dashboard.averageLoginTime'
  | 'dashboard.needHelp'
  | 'dashboard.needHelpDesc'
  | 'dashboard.contactSupport'
  | 'dashboard.monday'
  | 'dashboard.tuesday'
  | 'dashboard.wednesday'
  | 'dashboard.thursday'
  | 'dashboard.friday'
  | 'dashboard.saturday'
  | 'dashboard.sunday'
  | 'dashboard.yourTasks'
  | 'dashboard.viewAiCoach'
  | 'dashboard.todaysTasks'
  | 'dashboard.thisWeeksTasks'
  | 'settings.accountSettings'
  | 'settings.profileInformation'
  | 'settings.accountName'
  | 'settings.enterAccountName'
  | 'settings.accountNameDesc'
  | 'settings.country'
  | 'settings.selectCountry'
  | 'settings.gender'
  | 'settings.selectGender'
  | 'settings.male'
  | 'settings.female'
  | 'settings.other'
  | 'settings.preferNotToSay'
  | 'settings.changePassword'
  | 'settings.currentPassword'
  | 'settings.enterCurrentPassword'
  | 'settings.newPassword'
  | 'settings.enterNewPassword'
  | 'settings.confirmPassword'
  | 'settings.confirmNewPassword'
  | 'settings.passwordFieldsDesc'
  | 'settings.cancel'
  | 'settings.saving'
  | 'settings.saveChanges'
  | 'settings.settingsUpdated'
  | 'settings.emailCannotChange'
  | 'countries.us'
  | 'countries.uk'
  | 'countries.ca'
  | 'countries.au'
  | 'countries.de'
  | 'countries.fr'
  | 'countries.other'
  | 'common.loading'
  | 'common.error'
  | 'common.success'
  | 'common.save'
  | 'common.cancel'
  | 'common.close'
  | 'common.edit'
  | 'common.delete'
  | 'common.confirm'
  | 'common.back'
  | 'common.continue'
  | 'common.finish'
  | 'common.yes'
  | 'common.no'
  | 'common.today'
  | 'common.yesterday'
  | 'common.thisWeek'
  | 'common.lastWeek'
  | 'common.language'
  | 'pricing.backToHome'
  | 'pricing.pageTitle'
  | 'pricing.pageSubtitle'
  | 'pricing.monthly'
  | 'pricing.yearly'
  | 'pricing.freeAssessment'
  | 'pricing.freeAssessmentDesc'
  | 'pricing.freePrice'
  | 'pricing.alwaysFree'
  | 'pricing.freeFeature1'
  | 'pricing.freeFeature2'
  | 'pricing.freeFeature3'
  | 'pricing.freeFeature4'
  | 'pricing.startFreeAssessment'
  | 'pricing.mostPopular'
  | 'pricing.deepAnalysisReport'
  | 'pricing.deepAnalysisDesc'
  | 'pricing.deepPrice'
  | 'pricing.oneTimePurchase'
  | 'pricing.deepFeature1'
  | 'pricing.deepFeature2'
  | 'pricing.deepFeature3'
  | 'pricing.deepFeature4'
  | 'pricing.deepFeature5'
  | 'pricing.deepFeature6'
  | 'pricing.getDeepAnalysis'
  | 'pricing.viewDeepReport'
  | 'pricing.aiLifeCoach'
  | 'pricing.aiCoachDesc'
  | 'pricing.monthlyPrice'
  | 'pricing.yearlyPrice'
  | 'pricing.perMonth'
  | 'pricing.billedYearly'
  | 'pricing.savePerYear'
  | 'pricing.aiCoachFeature1'
  | 'pricing.aiCoachFeature2'
  | 'pricing.aiCoachFeature3'
  | 'pricing.aiCoachFeature4'
  | 'pricing.aiCoachFeature5'
  | 'pricing.aiCoachFeature6'
  | 'pricing.startFreeTrial'
  | 'pricing.sevenDaysFree'
  | 'pricing.featureComparison'
  | 'pricing.features'
  | 'pricing.free'
  | 'pricing.deepReport'
  | 'pricing.aiCoach'
  | 'pricing.feature32Question'
  | 'pricing.featureBasicRankings'
  | 'pricing.featureDetailedAnalysis'
  | 'pricing.feature30DayPlan'
  | 'pricing.featurePdfDownload'
  | 'pricing.featureWeeklyPlans'
  | 'pricing.featureDailyCheckins'
  | 'pricing.featureProgressTracking'
  | 'pricing.thirtyDayGuarantee'
  | 'pricing.guaranteeDesc'
  | 'pricing.rating'
  | 'pricing.ratingDesc'
  | 'pricing.instantAccess'
  | 'pricing.instantAccessDesc'
  | 'pricing.faqTitle'
  | 'pricing.faq1Question'
  | 'pricing.faq1Answer'
  | 'pricing.faq2Question'
  | 'pricing.faq2Answer'
  | 'pricing.faq3Question'
  | 'pricing.faq3Answer'
  | 'pricing.faq4Question'
  | 'pricing.faq4Answer'
  | 'pricing.faq5Question'
  | 'pricing.faq5Answer'
  | 'pricing.faq6Question'
  | 'pricing.faq6Answer'
  | 'pricing.ctaTitle'
  | 'pricing.ctaSubtitle'
  | 'pricing.ctaStartAssessment'
  | 'pricing.ctaViewSample'
  | 'loginPatterns.earlyBird'
  | 'loginPatterns.nightOwl'
  | 'loginPatterns.consistent'
  | 'loginPatterns.weekend'
  | 'loginPatterns.weekday'
  | 'loginPatterns.irregular'
  | 'insights.aiPredictiveInsights'
  | 'insights.aiInsights'
  | 'insights.quickInsights'
  | 'insights.insightsBasedOnAssessment'
  | 'insights.insightsBasedOnAllAssessments'
  | 'insights.analyzingPatterns'
  | 'insights.gatheringData'
  | 'insights.noMoreInsights'
  | 'insights.checkBackLater'
  | 'insights.riskAlert'
  | 'insights.patternForecast'
  | 'insights.smartRecommendation'
  | 'insights.strategicTiming'
  | 'insights.deepInsights'
  | 'insights.riskAlertDesc'
  | 'insights.patternForecastDesc'
  | 'insights.smartRecommendationDesc'
  | 'insights.strategicTimingDesc'
  | 'insights.deepInsightsDesc'
  | 'insights.highPriority'
  | 'insights.mediumPriority'
  | 'insights.lowPriority'
  | 'insights.confident'
  | 'insights.allInsights'
  | 'insights.viewActions'
  | 'insights.suggestedActions'
  | 'insights.dismissInsight'
  | 'insights.refreshInsights'
  | 'insights.tryAgain'
  | 'insights.cached'
  | 'insights.cachedFrom'
  | 'insights.generated'
  | 'insights.expires'
  | 'insights.fromCache'
  | 'insights.confidenceHigh'
  | 'insights.confidenceMedium'
  | 'insights.confidenceLow'
  | 'insights.allAssessmentsMode'
  | 'insights.errorLoadingInsights'
  | 'insights.taskCompletionRisk'
  | 'insights.streakAtRisk'
  | 'insights.peakProductivityDetected'
  | 'insights.weeklyPatternIdentified'
  | 'insights.productivityDeclineDetected'
  | 'insights.productivitySurge'
  | 'insights.cohortSuccessPattern'
  | 'insights.focusAreaIdentified'
  | 'insights.optimalTaskLoad'
  | 'insights.strategicPlanningAlert'
  | 'insights.energyManagementTip'
  | 'insights.burnoutPreventionAlert'
  | 'insights.moodPerformanceConnection'
  | 'insights.goalAchievementPattern'
  | 'insights.taskTimingPattern'
  | 'insights.scheduleTasksOptimalTime'
  | 'insights.setReminder30Minutes'
  | 'insights.prepareMaterialsTonight'
  | 'insights.breakTasksIntoSteps'
  | 'insights.completeOneMoreTask'
  | 'insights.focusOnQuickWins'
  | 'insights.setTimer25Minutes'
  | 'insights.tryOptimalTimeForWeek'
  | 'insights.setDailyReminders'
  | 'insights.trackCompletionRate'
  | 'insights.adjustSchedule'
  | 'insights.planChallengingTasks'
  | 'insights.useOptimalDay'
  | 'insights.scheduleEasierTasks'
  | 'insights.reviewSimplifyGoals'
  | 'insights.takeShortBreak'
  | 'insights.focusOneCategory'
  | 'insights.adjustTaskDifficulty'
  | 'insights.documentWhatWorks'
  | 'insights.increaseTaskDifficulty'
  | 'insights.shareSuccessStrategies'
  | 'insights.setAmbitiousGoals'
  | 'insights.prePlanSimpleWins'
  | 'insights.scheduleFavoriteActivities'
  | 'insights.prepareEverythingNight'
  | 'insights.partnerAccountability'
  | 'insights.makeRestPlanningDay'
  | 'insights.scheduleBreaksBeforeEnergyDips'
  | 'insights.planEnergizingActivities'
  | 'insights.adjustMealTiming'
  | 'insights.try10MinuteWalk'
  | 'insights.takeCompleteRestDay'
  | 'insights.reduceTaskLoad30Percent'
  | 'insights.focusEssentialTasks'
  | 'insights.scheduleEnjoyableActivity'
  | 'insights.practiceSayingNo'
  | 'insights.noticeWhatCreatesMood'
  | 'insights.planImportantTasksGoodMood'
  | 'insights.developShiftingStrategies'
  | 'insights.keepJournaling'
  | 'insights.considerMoodBoostingActivities'
  | 'insights.breakLongTermGoals'
  | 'insights.celebrateHalfwayPoint'
  | 'insights.reviewGoalsWeekly'
  | 'insights.try2MinuteRule'
  | 'insights.scheduleTasksImmediately'
  | 'insights.setCompletionDeadlines'
  | 'insights.useTimeBlocking'

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      title: 'RankMe',
      signOut: 'Sign Out'
    },
    home: {
      title: 'RankMe',
      beta: 'BETA',
      heroTitle1: 'Discover Your',
      heroTitle2: 'Life Performance',
      heroSubtitle: 'Get comprehensive insights into your life performance across financial, health, social, and personal dimensions.',
      noSignupRequired: 'No signup required • 5-10 minutes • Instant results',
      getStarted: 'Get Started',
      newAssessment: 'New Assessment',
      start: 'Start',
      startYourAssessment: 'Start Your Assessment',
      fourKeyDimensions: 'Four Key Life Dimensions',
      assessmentEvaluatesDesc: 'Our assessment evaluates your performance across the most important areas of life',
      financialHealth: 'Financial Health',
      financialHealthDesc: 'Income, savings & investment analysis',
      physicalWellness: 'Physical Wellness',
      physicalWellnessDesc: 'Fitness, health & lifestyle metrics',
      socialNetwork: 'Social Network',
      socialNetworkDesc: 'Relationships & community connections',
      personalGrowth: 'Personal Growth',
      personalGrowthDesc: 'Development & life satisfaction',
      whatYoullGet: 'What You\'ll Get',
      comprehensiveAssessment: 'Comprehensive 32-question assessment',
      instantRankings: 'Instant percentile rankings vs peers',
      professionalScorecard: 'Professional scorecard analysis',
      personalizedInsights: 'Personalized improvement insights',
      premiumFeatures: 'Premium Features',
      freeAssessment: 'Free Assessment',
      freeAssessmentDesc: 'Basic scoring and percentiles',
      deepAnalysis: 'Deep Analysis',
      deepAnalysisDesc: 'Detailed insights + action plan',
      aiLifeCoach: 'AI Life Coach',
      aiLifeCoachDesc: 'Personalized coaching + progress tracking',
      yourPrivacyMatters: 'Your Privacy Matters',
      privacyDescription: 'All assessments are completely anonymous by default. Your data is encrypted and never shared without your explicit consent.',
      instantResults: 'Instant Results',
      privacyFirst: 'Privacy First',
      noSpam: 'No Spam',
      readyToDiscover: 'Ready to Discover Your Score?',
      joinThousands: 'Join thousands who have already benchmarked their lives and started improving.',
      assessmentsTaken: 'Assessments Taken',
      userRating: 'User Rating',
      completionRate: 'Completion Rate',
      about: 'About',
      pricing: 'Pricing',
      dashboard: 'Dashboard',
      signIn: 'Sign In',
      tryFree: 'Try Free Assessment',
      platformDesc: 'Professional life assessment platform',
      privacy: 'Privacy',
      terms: 'Terms',
      contact: 'Contact',
      copyright: '© 2024 RankMe. All rights reserved.'
    },
    scorecard: {
      yourResults: 'Your Results',
      backToDashboard: 'Back to Dashboard',
      overallScore: 'Overall Score',
      percentileRank: 'Percentile Rank',
      categoryBreakdown: 'Category Breakdown',
      getAiCoach: 'Get AI Coach',
      getDeepReport: 'Get Deep Report',
      shareResults: 'Share Results',
      takeAnother: 'Take Another Assessment',
      loading: 'Loading...',
      loadingResults: 'Loading your results...',
      scoreNotFound: 'Score data not found',
      backToHome: 'Back to Home',
      financialHealth: 'Financial Health',
      physicalWellness: 'Physical Wellness',
      socialNetwork: 'Social Network',
      personalGrowth: 'Personal Growth',
      excellent: 'Excellent',
      exceptional: 'Exceptional',
      good: 'Good',
      average: 'Average',
      needsImprovement: 'Needs Improvement',
      romantic: 'Romantic',
      career: 'Career',
      distribution: 'Distribution',
      sendMyResults: 'Send My Results',
      deepAnalysis: 'Deep Analysis',
      viewDeepReport: 'View Deep Report',
      emailYourResults: 'Email Your Results',
      enterEmailAddress: 'Enter your email address',
      emailResultsDesc: 'Get a beautifully formatted email with your complete assessment results and insights.',
      assessmentStats: 'Assessment Stats',
      saveYourResults: 'Save Your Results',
      createAccountDesc: 'Create a free account to track your progress and access your results anytime.',
      createFreeAccount: 'Create Free Account',
      signInToExistingAccount: 'Sign In to Existing Account',
      scorecardDesc: 'This scorecard shows your percentile rankings. Unlock deeper insights with our premium features.',
      resultsSentSuccessfully: 'Results sent successfully!',
      checkYourInbox: 'Check your inbox for your detailed life score.',
      sendToAnotherEmail: 'Send to another email',
      aiLifeCoach: 'AI Life Coach',
      greatJobSaveResults: 'Great Job! Save Your Results',
      createFreeAccountTo: 'Create a free account to:',
      trackProgressOverTime: 'Track your progress over time',
      accessResultsAnyDevice: 'Access your results from any device',
      compareImprovements: 'Compare improvements between assessments',
      getPersonalizedRecs: 'Get personalized recommendations',
      iHaveAnAccount: 'I Have an Account',
      continueWithoutAccount: 'Continue without account',
      downloadForStories: 'Download for Stories',
      shareLink: 'Share Link',
      howToUse: 'How to use:',
      uploadToInstagram: 'Download the image to your phone, open Instagram and create a new Story, upload the downloaded image, share with your followers!',
      shareWithFollowers: 'Share with your followers!',
      somethingWentWrong: 'Something went wrong generating your share image.',
      scorecardShowsPercentiles: 'This scorecard shows your percentile rankings. Unlock deeper insights with our premium features.',
      unlockDeeperInsights: 'Unlock deeper insights with our premium features.',
      accessYourReport: 'Access your report'
    },
    report: {
      deepLifeAnalysisReport: 'Deep Life Analysis Report',
      comprehensiveInsights: 'Comprehensive insights and personalized recommendations',
      executiveSummary: 'Executive Summary',
      overallScore: 'Overall Score',
      performance: 'Performance',
      overallPerformanceDistribution: 'Overall Performance Distribution',
      peerComparison: 'Peer Comparison',
      peerComparisonText: 'Your overall life score ranks higher than',
      categoryBreakdown: 'Category Breakdown',
      strengths: 'Strengths',
      opportunities: 'Opportunities',
      recommendations: 'Recommendations',
      actionPlan30Day: '30-Day Action Plan',
      week: 'Week',
      timeCommitment: 'Time commitment',
      sampleReport: 'SAMPLE REPORT',
      sampleDescription: 'This is a sample of what you\'ll receive with our comprehensive analysis upgrade',
      financialHealth: 'Financial Health',
      healthWellness: 'Health & Wellness',
      socialConnections: 'Social Connections',
      personalGrowth: 'Personal Growth',
      score: 'Score',
      percentile: 'Percentile',
      keyStrengths: 'Key Strengths',
      growthAreas: 'Growth Areas',
      performanceDistribution: 'Performance Distribution',
      shareText: 'Check out my RankMe Deep Life Report! Overall Score:',
      captionCopied: 'Caption copied to clipboard!',
      backToDashboard: 'Back to Dashboard',
      reportOverview: 'Report Overview',
      assessmentDate: 'Assessment Date',
      questionsAnalyzed: 'Questions Analyzed',
      categoriesCovered: 'Categories Covered',
      peerGroupSize: 'Peer Group Size',
      keyInsights: 'Key Insights',
      youAreMostSimilarTo: 'You\'re most similar to individuals in the',
      areas: 'Areas',
      youExcelIn: 'You excel in',
      biggestOpportunityIn: 'Biggest opportunity in',
      followingActionPlanCouldImprove: 'Following the action plan could improve your overall score by 15-25 points',
      shareYourLifeScore: 'Share Your Life Score',
      ofPeopleInYourDemographic: 'of people in your demographic',
      thPercentile: 'th percentile',
      topPercent: 'Top',
      belowAverage: 'Below average',
      aboveAverage: 'Above average',
      bottomPercent: 'Bottom',
      topPerformer: 'Top Performer',
      focusArea: 'Focus Area',
      growthPotential: 'Growth Potential',
      shareReport: 'Share Report',
      downloadPDF: 'Download PDF',
      categoryDeepDive: 'Category Deep Dive',
      quickWins: 'Quick Wins',
      wantOngoingSupport: 'Want Ongoing Support?',
      reportDataNotFound: 'Report data not found',
      backToHome: 'Back to Home',
      keyInsights: 'Key Insights',
      yourLifeScore: 'Your Life Score',
      performanceBreakdown: 'Performance Breakdown',
      topStrength: 'Top Strength',
      growthArea: 'Growth Area',
      questionsAnswered: 'Questions Answered',
      completionTime: 'Completion Time',
      seconds: 'seconds',
      minutes: 'minutes',
      mins: 'mins',
      sec: 'sec',
      defaultCompletionTime: '~8 mins',
      peerGroup: 'Peer Group',
      recentActivity: 'Recent Activity',
      scoreDataNotFound: 'Score data not found',
      readyToImproveYourScore: 'Ready to Improve Your Score?',
      improveScoreDescription: 'Get personalized insights and actionable recommendations to boost your life performance.',
      shareYourLifeScore: 'Share Your Life Score',
      exceptional: 'Exceptional',
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      needsAttention: 'Needs Attention',
      personalizedInsights: 'Personalized Insights',
      crossCategoryPatterns: 'Cross-Category Patterns',
      surprisingFindings: 'Surprising Findings',
      longTermStrategy: 'Long-Term Strategy',
      primaryLimitingFactor: 'Primary Limiting Factor',
      threeMonthGoals: '3-Month Goals',
      oneYearGoals: '1-Year Goals',
      recommendedResources: 'Recommended Resources',
      primaryGrowthAreas: 'Primary Growth Areas',
      generatingDeepReport: 'Generating deep report',
      individualQuestionAnalysis: 'Individual Question Analysis',
      yourAnswer: 'Your Answer: ',
      myRankMeLifeScoreDeepReport: 'My RankMe Life Score Deep Report',
      linkCopiedToClipboard: 'Link copied to clipboard!'
    },
    coach: {
      // Navigation & Basic
      backToDashboard: 'Back to Dashboard',
      aiCoach: 'AI Coach',
      yourCoach: 'Your Coach',
      welcome: 'Welcome to your AI Coach',
      weeklyGoals: 'Weekly Goals',
      dailyTasks: 'Daily Tasks',
      progress: 'Progress',
      checkins: 'Check-ins',
      achievements: 'Achievements',
      settings: 'Settings',
      startWeek: 'Start Week',
      completeTask: 'Complete Task',
      scheduleCheckin: 'Schedule Check-in',
      viewProgress: 'View Progress',
      welcomeTitle: 'Welcome to Your AI Life Coach! 🎉',
      subscriptionActive: 'Your subscription is active! Let\'s set up your personalized coaching experience to help you achieve your life goals.',
      coachNotFound: 'Coach data not found',
      
      // Header & Status
      yourAiLifeCoach: 'Your AI Life Coach',
      activeSubscription: 'Active Subscription',
      daysLeftInTrial: 'days left in trial',
      chatWithCoach: 'Chat with Coach',
      
      // Focus Areas
      financialHealth: 'Financial Health',
      physicalWellness: 'Physical Wellness',
      socialNetwork: 'Social Network',
      personalDevelopment: 'Personal Development',
      otherTasks: 'Other Tasks',
      
      // Date Navigation
      todaysGoals: 'Today\'s Goals',
      yesterdaysGoals: 'Yesterday\'s Goals',
      tomorrowsGoals: 'Tomorrow\'s Goals',
      goalsFor: 'Goals for',
      
      // Onboarding
      letsGetYouStarted: 'Let\'s Get You Started',
      setYourCoachingPreferences: 'Set Your Coaching Preferences',
      chooseFocusAreaDesc: 'Choose your focus area, coaching style, and how often you\'d like to receive guidance.',
      scheduleYourCheckins: 'Schedule Your Check-ins',
      setUpCheckinsDesc: 'Set up regular check-ins to track your progress and stay motivated.',
      meetYourAiCoach: 'Meet Your AI Coach',
      firstConversationDesc: 'Have your first conversation and get your personalized action plan.',
      
      // Benefits
      personalizedGoals: 'Personalized Goals',
      personalizedGoalsDesc: 'Get weekly action plans tailored to your assessment results',
      twentyFourSevenSupport: '24/7 Support',
      twentyFourSevenSupportDesc: 'Chat with your AI coach anytime for guidance and motivation',
      trackProgress: 'Track Progress',
      trackProgressDesc: 'See your improvement with detailed analytics and insights',
      
      // Coach Configuration
      coachConfiguration: 'Coach Configuration',
      primaryFocus: 'Primary Focus',
      secondary: 'Secondary',
      style: 'Style',
      motivation: 'Motivation',
      focusArea: 'Focus Area',
      coachingStyle: 'Coaching Style',
      taskFrequency: 'Task Frequency',
      motivationLevel: 'Motivation Level',
      assessmentSpecificSettings: 'Assessment-specific settings',
      difficulty: 'difficulty',
      
      // Coach Styles & Options
      supportive: 'Supportive',
      analytical: 'Analytical',
      direct: 'Direct',
      encouraging: 'Encouraging',
      gentle: 'Gentle',
      balanced: 'Balanced',
      intense: 'Intense',
      easy: 'Easy',
      moderate: 'Moderate',
      challenging: 'Challenging',
      financial: 'Financial',
      health: 'Health',
      social: 'Social',
      personal: 'Personal',
      none: 'None',
      daily: 'daily',
      weekly: 'weekly',
      difficulty: 'difficulty',
      
      // Progress
      yourProgress: 'Your Progress',
      lastUpdated: 'Last updated',
      dayStreak: 'Day Streak',
      completionRate: 'Completion Rate',
      currentScore: 'Current Score',
      pointsImproved: 'Points Improved',
      sinceYouStarted: 'Since you started',
      onFire: '🔥 On fire!',
      keepGoing: 'Keep going!',
      completed: 'completed',
      percentile: 'percentile',
      
      // Daily Progress
      dailyProgressByDay: 'Daily Progress by Day',
      pastDays: 'Past days',
      today: 'Today',
      future: 'Future',
      combinedWeeklyProgress: 'Combined Weekly Progress',
      allTasksForThisWeek: 'All tasks for this week',
      weeklyTasks: 'Weekly Tasks',
      dailyGoals: 'Daily Goals',
      
      // Task Management
      weeklyTasksForWeek: 'Weekly Tasks for Week',
      expandAll: 'Expand All',
      collapseAll: 'Collapse All',
      expandTasks: 'Expand tasks',
      collapseTasks: 'Collapse tasks',
      deleteTask: 'Delete task',
      showCompleted: 'Show Completed',
      hideCompleted: 'Hide Completed',
      clickShowCompletedToView: 'Click "Show Completed" to view details',
      noGoalsSetForToday: 'No goals set for today',
      noGoalsPlanned: 'No goals planned for',
      noGoalsWereSet: 'No goals were set for',
      deleteGoal: 'Delete goal',
      yesterday: 'Yesterday',
      goToToday: 'Go to Today',
      tomorrow: 'Tomorrow',
      
      // Chat Interface
      quickSuggestions: 'Quick Suggestions',
      howCanIImprove: 'How can I improve my lowest scoring area?',
      whatShouldIFocus: 'What should I focus on this week?',
      feelingStuck: 'I\'m feeling stuck. Any advice?',
      typeYourMessage: 'Type your message...',
      troubleConnecting: 'I\'m having trouble connecting right now. Please try again in a moment.',
      
      // Journal
      reflectOnYourDay: 'Reflect on Your Day',
      journalPrompt: 'Journal Prompt',
      journalPlaceholder: 'Take a moment to reflect on your day, progress, challenges, and insights...',
      
      // Goals Management
      yourGoals: 'Your Goals',
      addNewGoal: 'Add New Goal',
      goalCategory: 'Goal Category',
      goalTitle: 'Goal Title',
      goalDescription: 'Goal Description',
      goalTarget: 'Goal Target',
      goalDeadline: 'Goal Deadline',
      goalDescriptionPlaceholder: 'Describe your goal and why it\'s important to you...',
      createGoal: 'Create Goal',
      
      // Settings Modal
      accountSettings: 'Account Settings',
      notifications: 'Notifications',
      dailyReminders: 'Daily Reminders',
      weeklyReports: 'Weekly Reports',
      reminderTime: 'Reminder Time',
      goalFrequency: 'Goal Frequency',
      
      // Alerts & Messages
      taskCreatedSuccessfully: 'Task created successfully!',
      failedToCreateTask: 'Failed to create task. Please try again.',
      journalEntrySaved: 'Journal entry saved! Your thoughts have been recorded.',
      journalEntryError: 'Error saving journal entry. Please try again.',
      checkInCompleted: 'Check-in completed successfully!',
      checkInFailed: 'Failed to complete check-in. Please try again.',
      preferencesError: 'Failed to save preferences. Please try again.',
      checkInsSetupFailed: 'Failed to set up check-ins',
      coachingDataError: 'Failed to generate coaching data',
      goalCreated: 'Goal created successfully! Keep working towards it.',
      settingsSaved: 'Settings saved successfully! Your preferences have been updated.',
      settingsError: 'Error saving settings. Please try again.',
      
      // Task Creator
      createTask: 'Create Task',
      taskTitle: 'Task Title',
      taskDescription: 'Task Description',
      category: 'Category',
      estimatedTime: 'Estimated Time',
      date: 'Date',
      creating: 'Creating...',
      enterTaskTitle: 'Enter task title...',
      describeTheTask: 'Describe the task...',
      
      // Journal Questions
      financialJournalPrompt: '',
      healthJournalPrompt: '',
      socialJournalPrompt: '',
      personalJournalPrompt: '',
      
      // Additional UI strings
      startYourStreakToday: 'Start your streak today!',
      upcomingCheckIns: 'Upcoming Check-ins',
      quickActions: 'Quick Actions',
      needHelp: 'Need Help?',
      questionsAboutCoaching: 'Questions about your coaching plan or progress? We\'re here to help.',
      noWeeklyTasksCompleted: 'No weekly tasks completed yet',
      noDailyGoalsCompleted: 'No daily goals completed yet',
      totalTasksCompleted: 'total tasks completed',
      clickShowCompletedDetails: 'Click "Show Completed" to view details',
      failedToUpdateTask: 'Failed to update task. Please try again.',
      failedToDeleteTask: 'Failed to delete task. Please try again.',
      failedToSavePreferences: 'Failed to save preferences. Please try again.',
      checkInCompletedSuccess: 'Check-in completed successfully!',
      failedToCompleteCheckIn: 'Failed to complete check-in. Please try again.',
      failedToSetupCheckIns: 'Failed to set up check-ins',
      failedToGenerateCoaching: 'Failed to generate coaching data',
      goalCreatedSuccess: 'Goal created successfully! Keep working towards it.',
      settingsSavedSuccess: 'Settings saved successfully! Your preferences have been updated.',
      errorSavingSettings: 'Error saving settings. Please try again.',
      errorCreatingTask: 'Error creating task',
      allFocusAreas: 'All Focus Areas',
      completedTasksCount: 'completed',
      combinesAllTasks: 'Combines all weekly tasks + daily goals for the entire week',
      pastDays: 'Past days',
      todayText: 'Today',
      futureText: 'Future',
      minutes: 'min',
      contactSupport: 'Contact Support',
      noCheckInsScheduled: 'No check-ins scheduled',
      deleteGoal: 'Delete goal',
      addNewGoal: 'Add a new goal',
      completedTasks: 'Completed Tasks',
      totalTasksCompletedThis: 'total tasks completed',
      clickShowCompleted: 'Click "Show Completed" to view details',
      showCompleted: 'Show Completed',
      hideCompleted: 'Hide Completed',
      noGoalsSetToday: 'No goals set for today',
      editSchedule: 'Edit Schedule',
      completeNow: 'Complete Now',
      overdue: 'Overdue',
      checkInType: 'Check-in',
      setUpCheckIns: 'Set Up Check-ins',
      setUpCheckInsTitle: 'Set Up Check-Ins',
      continueSetup: 'Continue Setup',
      frequencyDaily: 'Daily',
      frequencyWeekly: 'Weekly',
      frequencyBiweekly: 'Bi-weekly',
      frequencyMonthly: 'Monthly',
      frequencyMultipleDaily: 'Multiple Daily',
      dailyDescription: 'Once every day',
      weeklyDescription: 'Specific days',
      biweeklyDescription: 'Every 2 weeks',
      monthlyDescription: 'Once per month',
      multipleDailyDescription: 'Multiple times per day',
      at: 'at',
      howOften: 'How often?',
      whenLabel: 'When?',
      times: 'Times',
      timeLabel: 'Time',
      daysLabel: 'Days',
      addTime: 'Add time',
      hideAdvanced: 'Hide',
      showAdvanced: 'Show',
      reminder: 'Reminder',
      schedule: 'Schedule:',
      reminderMinBefore: 'min before',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
      sun: 'Sun',
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
      createNewTask: 'Create New Task',
      createDailyGoal: 'Create Daily Goal',
      howCanIImprove: 'How can I improve my life score?',
      whatShouldIFocus: 'What should I focus on this week?',
      feelingStuck: 'I\'m feeling stuck, what should I do?',
      typeMessage: 'Type your message...',
      sendMessage: 'Send',
      expandTasks: 'Expand tasks',
      collapseTasks: 'Collapse tasks',
      workOnAllAreas: 'Work on all areas of your life simultaneously',
      expandAll: 'Expand All',
      collapseAll: 'Collapse All',
      
      // Modal translations
      createWeeklyTasks: 'Create Weekly Tasks',
      weekOf: 'Week of',
      taskNumber: 'Task',
      category: 'Category',
      taskTitle: 'Task Title',
      taskTitleRequired: 'Task Title *',
      description: 'Description',
      descriptionRequired: 'Description *',
      addTask: 'Add Task',
      saveTasks: 'Save Tasks',
      cancel: 'Cancel',
      financialHealth: 'Financial Health',
      physicalWellness: 'Physical Wellness',
      socialConnection: 'Social Connection',
      personalDevelopment: 'Personal Development',
      other: 'Other',
      createDailyTask: 'Create Daily Task',
      priority: 'Priority',
      date: 'Date',
      estimatedMinutes: 'Est. Minutes',
      optional: 'Optional',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      
      // Contact Support Modal
      howCanWeHelp: 'How can we help?',
      subject: 'Subject',
      message: 'Message',
      weWillRespondTo: 'We\'ll respond to:',
      generalQuestion: 'General Question',
      technicalIssue: 'Technical Issue',
      feedback: 'Feedback',
      featureRequest: 'Feature Request',
      
      // Progress indicators
      complete: 'Complete',
      noDailyGoalsCompleted: 'No daily goals completed yet',
      overallProgress: 'Overall Progress',
      combined: 'Combined',
      totalTasksCompletedThisWeek: 'Tasks Completed This Week',
      hideCompleted: 'Hide Completed',
      showCompleted: 'Show Completed',
      
      // Additional translations for remaining elements
      weeklyTasks: 'Weekly Tasks',
      dailyGoalsToday: 'Daily Goals Today',
      week: 'Week',
      dailyGoals: 'Daily Goals',
      createYourFirstGoal: 'Create your first goal',
      needHelp: 'Need Help?',
      questionsAboutCoachingPlan: 'Questions about your coaching plan or progress? We\'re here to help.',
      contactSupport: 'Contact Support',
      addTask: 'Add Task',
      taskTitle: 'Task Title',
      descriptionOptional: 'Description (Optional)',
      category: 'Category',
      priority: 'Priority',
      date: 'Date',
      estMinutes: 'Est. Minutes',
      createDailyTask: 'Create Daily Task',
      
      // CoachPreferenceSetup component - Setup Process
      setupProgress: 'Setup Progress',
      step: 'Step',
      of: 'of',
      stepOf: 'Step ${step} of ${total}',
      welcomeToAICoach: 'Welcome to Your AI Life Coach!',
      letsPersonalize: 'Let\'s personalize your experience',
      personalizeExperience: 'Let\'s personalize your experience. What area would you like to focus on?',
      whatAreaFocus: 'What area would you like to focus on?',
      primaryFocusArea: 'Primary Focus Area',
      secondaryFocusArea: 'Secondary Focus Area',
      secondaryFocusOptional: 'Secondary Focus Area (Optional)',
      
      // Focus Areas
      financialHealth: 'Financial Health',
      physicalHealth: 'Physical Health', 
      socialLife: 'Social Life',
      personalGrowth: 'Personal Growth',
      budgetManagementWealth: 'Budget management & wealth building',
      fitnessNutritionWellness: 'Fitness, nutrition & wellness habits',
      relationshipsSocial: 'Relationships & social connections',
      selfImprovementSkills: 'Self-improvement & skill development',
      financialHealthDesc: 'Budget management & wealth building',
      physicalHealthDesc: 'Fitness, nutrition & wellness habits',
      socialLifeDesc: 'Relationships & social connections',
      personalGrowthDesc: 'Self-improvement & skill development',
      
      // Task Preferences
      taskPreferences: 'Task Preferences',
      howManyTasks: 'How many tasks would you like to work on?',
      dailyTasksCount: 'Daily Tasks: ${count}',
      weeklyTasksCount: 'Weekly Tasks: ${count}',
      taskDifficulty: 'Task Difficulty',
      oneTask: '1 task',
      tasksRecommended: '3 tasks (recommended)',
      threeTasksRecommended: '3 tasks (recommended)',
      twoThreeRecommended: '2-3 (recommended)',
      fiveTasks: '5 tasks',
      noWeeklyTasks: 'No weekly tasks',
      recommendedTasks: '2-3 (recommended)',
      easy: 'Easy',
      moderate: 'Moderate', 
      challenging: 'Challenging',
      specificGoalsChallenges: 'Specific Goals or Challenges (Optional)',
      specificGoalsPlaceholder: 'E.g., \'I want to save $5000 this year\' or \'I need help with budgeting and reducing debt\'',
      
      // Coaching Style
      coachingStyle: 'Coaching Style',
      howInteractWithYou: 'How would you like me to interact with you?',
      howToInteract: 'How would you like me to interact with you?',
      coachingApproach: 'Coaching Approach',
      supportive: 'Supportive',
      direct: 'Direct',
      motivational: 'Motivational',
      analytical: 'Analytical',
      supportiveDesc: 'Gentle encouragement and empathetic guidance',
      directDesc: 'Straightforward, action-oriented coaching',
      motivationalDesc: 'High-energy, inspiring approach',
      analyticalDesc: 'Data-driven, logical guidance',
      motivationLevel: 'Motivation Level',
      gentle: 'Gentle',
      balanced: 'Balanced',
      intense: 'Intense',
      softEncouragement: 'Soft encouragement',
      mixedApproach: 'Mixed approach',
      pushMeHard: 'Push me hard',
      gentleDesc: 'Soft encouragement',
      balancedDesc: 'Mixed approach',
      intenseDesc: 'Push me hard',
      
      // Check-in Preferences
      checkinPreferences: 'Check-in Preferences',
      howOftenCheckin: 'How often would you like to check in on your progress?',
      howOftenCheckIn: 'How often would you like to check in on your progress?',
      checkinFrequency: 'Check-in Frequency',
      preferredCheckinTime: 'Preferred Check-in Time',
      daily: 'Daily',
      weekly: 'Weekly',
      biweekly: 'Biweekly',
      youreAllSet: 'You\'re all set!',
      preferencesWillBeSaved: 'Your preferences will be saved and used to personalize your coaching experience. You can always update these settings later.',
      completeSetup: 'Complete Setup',
      saving: 'Saving...',
      
      // Journal & Reflection
      dailyJournal: 'Daily Journal',
      reflectOnTodaysProgress: 'Reflect on today\'s progress',
      todaysReflection: 'Today\'s Reflection',
      yourThoughts: 'Your Thoughts',
      charactersCount: '${count} characters',
      journalingTips: '💡 Journaling Tips',
      beHonestAuthentic: '• Be honest and authentic with your thoughts',
      focusSpecificExamples: '• Focus on specific examples and experiences',
      considerWhatLearned: '• Consider what you learned and how you can improve',
      celebrateSmallWins: '• Celebrate small wins and progress made',
      
      // Personal Goals
      personalGoals: 'Personal Goals',
      setTrackObjectives: 'Set and track your objectives',
      setAndTrackObjectives: 'Set and track your objectives',
      yourCurrentGoals: 'Your Current Goals',
      noGoalsSetYet: 'No goals set yet',
      addNewGoal: 'Add new goal',
      goalTitle: 'Goal Title',
      targetOptional: 'Target (optional)',
      deadlineOptional: 'Deadline (optional)',
      
      // Settings Display Labels
      focusArea: 'Focus Area',
      secondary: 'Secondary:',
      taskFrequency: 'Task Frequency',
      assessmentSpecificSettings: 'Assessment-specific settings',
      moderateDifficulty: 'moderate difficulty',
      personal: 'personal',
      social: 'social',
      coachingStyleLabel: 'Coaching Style',
      motivationLevel: 'Motivation Level',
      daily: 'daily',
      weekly: 'weekly',
      difficulty: 'difficulty',
      
      // Navigation & Actions
      back: 'Back',
      next: 'Next',
      
      // Form Validation & Placeholders
      enterFullName: 'Enter your full name',
      enterEmail: 'Enter your email',
      createPassword: 'Create a password',
      confirmPassword: 'Confirm your password',
      yourName: 'Your name',
      
      // Additional UI Elements
      createTasks: '+ Create Tasks',
      setNewGoals: 'Set New Goals',
      hereToHelpGrow: 'Here to help you grow',
      startAConversation: 'Start a conversation',
      askMeAboutProgress: 'Ask me about your progress, goals, or anything related to your personal development.',
      coachCapabilitiesTitle: 'Your AI Life Coach',
      coachCapabilitiesSubtitle: 'I\'m here to help you grow and achieve your goals. Here\'s what I can do:',
      taskManagement: 'Task Management',
      taskManagementDesc: 'Create daily and weekly tasks, set reminders, and track completion',
      progressTracking: 'Progress Tracking',
      progressTrackingDesc: 'Monitor your development across all life areas and celebrate wins',
      personalizedAdvice: 'Personalized Advice',
      personalizedAdviceDesc: 'Get tailored guidance based on your assessment results and goals',
      goalSetting: 'Goal Setting',
      goalSettingDesc: 'Define meaningful objectives and create actionable plans to achieve them',
      exampleQuestions: 'Try asking me:',
      viewFullReport: 'View Full Report',
      deepAnalysisInsights: 'Deep analysis & insights',
      viewJournalEntries: 'View Journal Entries',
      readPastReflections: 'Read your past reflections',
      noJournalEntries: 'No journal entries yet',
      journalEntriesTitle: 'Journal Entries',
      journalEntriesSubtitle: 'Your reflections and thoughts',
      briefDescription: 'Brief description of your issue or question',
      message: 'Message',
      pleaseProvideDetails: 'Please provide as much detail as possible...',
      updateYourObjectives: 'Update your objectives',
      categorySelection: 'Category selection',
      noGoalsSetYet: 'No goals set yet',
      category: 'Category',
      goalTitle: 'Goal Title',
      descriptionOptional: 'Description (optional)',
      targetOptional: 'Target (optional)',
      deadlineOptional: 'Deadline (optional)',
      journalingTips: '💡 Journaling Tips',
      beHonestAuthentic: 'Be honest and authentic with your thoughts',
      focusOnSpecificExamples: 'Focus on specific examples and experiences',
      considerWhatYouLearned: 'Consider what you learned and how you can improve',
      celebrateSmallWins: 'Celebrate small wins and progress made',
      reflectOnProgress: 'Reflect on your progress and celebrate wins',
      selectCategory: 'Select a category',
      goalTitlePlaceholder: 'e.g., Save $5,000 for emergency fund',
      goalDescriptionPlaceholder: 'Describe your goal and why it\'s important to you...',
      goalTargetPlaceholder: 'e.g., $5,000, 10 lbs, 30 minutes daily',
      taskTitlePlaceholder: 'Enter task title...',
      taskDescriptionPlaceholder: 'Describe the task...',
      
      // Journal & Buttons
      takeAMomentToReflect: 'Take a moment to reflect on your day, progress, challenges and insights',
      cancel: 'Cancel',
      saveEntry: 'Save Entry',
      createGoal: 'Create Goal',
      weekNumber: 'Week',
      dailyCheckIn: 'Daily Check-in',
      
      // Configuration Display
      moderateDifficulty: 'moderate difficulty'
    },

    // Predictive Insights
    insights: {
      // Main Component Headers
      aiPredictiveInsights: 'AI Predictive Insights',
      aiInsights: 'AI Insights',
      quickInsights: 'AI Insights',
      
      // Description Text
      insightsBasedOnAssessment: 'Insights based on your assessment responses and coaching interactions',
      insightsBasedOnAllAssessments: 'Insights based on all your assessments and coaching interactions',
      analyzingPatterns: 'Analyzing your patterns...',
      gatheringData: 'Gathering data to generate personalized insights...',
      noMoreInsights: 'No more insights to show. Check back later for new predictions!',
      checkBackLater: 'Check back later for new predictions!',
      
      // Insight Type Labels
      riskAlert: 'Risk Alert',
      patternForecast: 'Pattern Forecast',
      smartRecommendation: 'Smart Recommendation',
      strategicTiming: 'Strategic Timing',
      deepInsights: 'Deep Insights',
      
      // Insight Type Descriptions  
      riskAlertDesc: 'Potential challenges ahead',
      patternForecastDesc: 'Your behavioral patterns',
      smartRecommendationDesc: 'Optimized for your success',
      strategicTimingDesc: 'Optimal intervention moments',
      deepInsightsDesc: 'Pattern-based coaching',
      
      // Priority Labels
      highPriority: 'High Priority',
      mediumPriority: 'Medium Priority',
      lowPriority: 'Low Priority',
      confident: 'confident',
      
      // Filter Labels
      allInsights: 'All',
      
      // Action Labels
      viewActions: 'View Actions',
      suggestedActions: 'Suggested Actions',
      dismissInsight: 'Dismiss insight',
      refreshInsights: 'Refresh insights',
      tryAgain: 'Try again',
      
      // Metadata
      cached: 'Cached',
      cachedFrom: 'Cached from',
      generated: 'Generated',
      expires: 'Expires',
      fromCache: 'From Cache',
      confidenceHigh: 'High',
      confidenceMedium: 'Medium',
      confidenceLow: 'Low',
      allAssessmentsMode: 'All Assessments Mode',
      
      // Error Messages
      errorLoadingInsights: 'Error loading insights',
      
      // Specific Insight Messages
      taskCompletionRisk: 'Task Completion Risk Alert',
      streakAtRisk: 'Streak at Risk!',
      peakProductivityDetected: 'Peak Productivity Detected',
      weeklyPatternIdentified: 'Weekly Pattern Identified',
      productivityDeclineDetected: 'Productivity Decline Detected',
      productivitySurge: 'Productivity Surge!',
      cohortSuccessPattern: 'Cohort Success Pattern',
      focusAreaIdentified: 'Focus Area Identified',
      optimalTaskLoad: 'Optimal Task Load',
      strategicPlanningAlert: 'Strategic Planning Alert',
      energyManagementTip: 'Energy Management Tip',
      burnoutPreventionAlert: 'Burnout Prevention Alert',
      moodPerformanceConnection: 'Mood-Performance Connection',
      goalAchievementPattern: 'Goal Achievement Pattern',
      taskTimingPattern: 'Task Timing Pattern',
      
      // Common Action Suggestions
      scheduleTasksOptimalTime: 'Schedule tasks for your most productive time',
      setReminder30Minutes: 'Set a reminder 30 minutes before your usual task time',
      prepareMaterialsTonight: 'Prepare materials tonight to reduce friction tomorrow',
      breakTasksIntoSteps: 'Consider breaking tasks into smaller steps',
      completeOneMoreTask: 'Complete at least one more task to maintain momentum',
      focusOnQuickWins: 'Focus on quick wins to boost completion rate',
      setTimer25Minutes: 'Set a timer for 25 minutes and tackle your easiest task',
      tryOptimalTimeForWeek: 'Try completing tasks at optimal time for a week',
      setDailyReminders: 'Set daily reminders for this optimal time',
      trackCompletionRate: 'Track if this timing improves your completion rate',
      adjustSchedule: 'Adjust your schedule to protect this time slot',
      planChallengingTasks: 'Plan challenging tasks for this day',
      useOptimalDay: 'Use this day for important goal progress',
      scheduleEasierTasks: 'Schedule easier tasks on less productive days',
      reviewSimplifyGoals: 'Review and simplify your current goals',
      takeShortBreak: 'Take a short break to prevent burnout',
      focusOneCategory: 'Focus on one category at a time',
      adjustTaskDifficulty: 'Consider adjusting task difficulty',
      documentWhatWorks: 'Document what\'s working for you',
      increaseTaskDifficulty: 'Consider increasing task difficulty',
      shareSuccessStrategies: 'Share your success strategies',
      setAmbitiousGoals: 'Set more ambitious goals',
      prePlanSimpleWins: 'Pre-plan simple wins for challenging days',
      scheduleFavoriteActivities: 'Schedule your favorite activities as rewards',
      prepareEverythingNight: 'Prepare everything the night before',
      partnerAccountability: 'Partner with someone for accountability',
      makeRestPlanningDay: 'Consider making this a rest or planning day',
      scheduleBreaksBeforeEnergyDips: 'Schedule breaks before energy dips',
      planEnergizingActivities: 'Plan energizing activities for low points',
      adjustMealTiming: 'Adjust meal timing for sustained energy',
      try10MinuteWalk: 'Try a 10-minute walk during low energy times',
      takeCompleteRestDay: 'Take a complete rest day this week',
      reduceTaskLoad30Percent: 'Reduce task load by 30% for 3 days',
      focusEssentialTasks: 'Focus only on essential tasks',
      scheduleEnjoyableActivity: 'Schedule something enjoyable and relaxing',
      practiceSayingNo: 'Practice saying no to additional commitments',
      noticeWhatCreatesMood: 'Notice what creates positive mood states',
      planImportantTasksGoodMood: 'Plan important tasks when feeling positive',
      developShiftingStrategies: 'Develop strategies to shift from negative states',
      keepJournaling: 'Keep journaling to deepen self-awareness',
      considerMoodBoostingActivities: 'Consider mood-boosting activities before tasks',
      breakLongTermGoals: 'Break long-term goals into smaller milestones',
      celebrateHalfwayPoint: 'Celebrate progress at the halfway point',
      reviewGoalsWeekly: 'Review goals weekly to maintain momentum',
      try2MinuteRule: 'Try the 2-minute rule for quick tasks',
      scheduleTasksImmediately: 'Schedule tasks immediately after creating them',
      setCompletionDeadlines: 'Set completion deadlines when creating tasks',
      useTimeBlocking: 'Use time-blocking to ensure prompt completion',
    },

    dashboard: {
      welcome: 'Welcome',
      welcomeBack: 'Welcome back',
      subtitle: 'Track your life performance and continue your improvement journey.',
      assessments: 'Assessments',
      totalCompleted: 'Total completed',
      dayStreak: 'Day Streak',
      startStreak: 'Start your streak!',
      greatStart: 'Great start!',
      daysInRow: 'Days in a row',
      latestScore: 'Latest Score',
      outOf100: 'Out of 100',
      percentile: 'Percentile',
      amongPeers: 'Among peers',
      yourAssessments: 'Your Assessments',
      takeNewAssessment: 'Take New Assessment',
      noAssessmentsYet: 'No assessments yet',
      noAssessmentsDesc: 'Take your first life assessment to get started with tracking your performance.',
      takeAssessment: 'Take Assessment',
      viewResults: 'View Results',
      aiCoach: 'AI Coach',
      getAiCoach: 'Get AI Coach',
      viewReport: 'View Report',
      deepReport: 'Deep Report',
      lifeAssessment: 'Life Assessment',
      quickActions: 'Quick Actions',
      newAssessment: 'New Assessment',
      aiCoachDashboard: 'AI Coach Dashboard',
      upgradeToAiCoach: 'Upgrade to AI Coach',
      takeAssessmentUpgrade: 'Take Assessment & Upgrade',
      account: 'Account',
      email: 'Email',
      plan: 'Plan',
      aiCoachPro: 'AI Coach Pro',
      free: 'Free',
      bestStreak: 'Best Streak',
      days: 'days',
      lastLogin: 'Last Login',
      youAre: 'You are a',
      accountSettings: 'Account Settings',
      recentActivity: 'Recent Activity',
      averageLoginTime: 'Average login time',
      needHelp: 'Need Help?',
      needHelpDesc: 'Get support or learn more about improving your life score.',
      contactSupport: 'Contact Support',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
      yourTasks: 'Your Tasks',
      viewAiCoach: 'View AI Coach',
      todaysTasks: 'Today\'s Tasks',
      thisWeeksTasks: 'This Week\'s Tasks'
    },
    settings: {
      accountSettings: 'Account Settings',
      profileInformation: 'Profile Information',
      accountName: 'Account Name',
      enterAccountName: 'Enter your account display name',
      accountNameDesc: 'This name will be displayed in your account',
      country: 'Country',
      selectCountry: 'Select Country',
      gender: 'Gender',
      selectGender: 'Select Gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      preferNotToSay: 'Prefer not to say',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      enterCurrentPassword: 'Enter current password',
      newPassword: 'New Password',
      enterNewPassword: 'Enter new password',
      confirmPassword: 'Confirm New Password',
      confirmNewPassword: 'Confirm new password',
      passwordFieldsDesc: "Leave password fields empty if you don't want to change your password",
      cancel: 'Cancel',
      saving: 'Saving...',
      saveChanges: 'Save Changes',
      settingsUpdated: 'Settings updated successfully!',
      emailCannotChange: 'Email cannot be changed'
    },
    countries: {
      us: 'United States',
      uk: 'United Kingdom',
      ca: 'Canada',
      au: 'Australia',
      de: 'Germany',
      fr: 'France',
      other: 'Other'
    },
    assessment: {
      // Basic Assessment
      lifeAssessment: 'Life Assessment',
      assessmentDesc: 'Answer questions about different areas of your life to get your overall score.',
      getStarted: 'Get Started',
      question: 'Question',
      of: 'of',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit Assessment',
      selectOption: 'Please select an option',
      completing: 'Completing your assessment...',
      almostDone: 'Almost done!',
      
      // Cohort Setup
      letsGetStarted: 'Let\'s Get Started',
      basicInformation: 'Basic Information',
      basicInformationDesc: 'First, we need some basic information to compare you with your peers.',
      age: 'Age',
      enterYourAge: 'Enter your age',
      country: 'Country',
      selectYourCountry: 'Select your country',
      gender: 'Gender',
      selectGender: 'Select gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      preferNotToSay: 'Prefer not to say',
      startAssessment: 'Start Assessment',
      informationConfidential: 'Your information is kept completely confidential',
      
      // Questions Interface
      complete: 'Complete',
      justGettingStarted: 'Just getting started...',
      makingGreatProgress: 'Making great progress!',
      halfwayThere: 'You\'re halfway there!',
      almostFinished: 'Almost finished!',
      justAFewMore: 'Just a few more!',
      back: 'Back',
      review: 'Review',
      continueToQuestions: 'Continue to Questions',
      
      // Categories
      financial: 'Financial',
      healthFitness: 'Health & Fitness',
      social: 'Social',
      romantic: 'Personal',
      personal: 'Personal',
      career: 'Career',
      personalGrowth: 'Personal Growth',
      
      // Category Descriptions
      financialHealthName: 'Financial Health',
      financialHealthIntroduction: 'Let\'s explore your financial foundation and wealth-building progress.',
      financialHealthDescription: 'Understanding your financial health helps identify opportunities for building security and wealth.',
      physicalWellnessName: 'Physical Wellness',
      physicalWellnessIntroduction: 'Now let\'s assess your physical health and fitness journey.',
      physicalWellnessDescription: 'Your physical wellness affects every aspect of your life, from energy to confidence.',
      socialNetworkName: 'Social Network',
      socialNetworkIntroduction: 'Let\'s explore your relationships and social connections.',
      socialNetworkDescription: 'Strong social connections are fundamental to happiness and life satisfaction.',
      romanticName: 'Romantic',
      romanticIntroduction: 'Let\'s discuss your romantic life and relationship satisfaction.',
      romanticDescription: 'Romantic relationships significantly impact overall life satisfaction and emotional wellbeing.',
      careerDevelopmentName: 'Career Development',
      careerDevelopmentIntroduction: 'Let\'s examine your professional growth and career satisfaction.',
      careerDevelopmentDescription: 'Career development affects financial security, personal fulfillment, and life direction.',
      personalGrowthName: 'Personal Growth',
      personalGrowthIntroduction: 'Finally, let\'s explore your personal development and self-improvement journey.',
      personalGrowthDescription: 'Personal growth activities contribute to long-term fulfillment and continuous improvement.',
      
      // Review Page
      reviewYourAssessment: 'Review Your Assessment',
      checkResponsesDesc: 'Check your responses before getting your life score',
      editAnswers: 'Edit Answers',
      getMyResults: 'Get My Results',
      
      // Category Names (for review)
      financialHealth: 'Financial Health',
      physicalWellness: 'Physical Wellness',
      socialNetwork: 'Social Network',
      personalGrowthCategory: 'Personal Growth',
      careerDevelopment: 'Career Development'
    },
    assessmentQuestions: {
      fin_net_worth: {
        label: 'What is your current net worth (assets - liabilities)?',
        options: ['Less than -$10k (significant debt)', '-$10k to $0 (some debt)', '$0 to $25k', '$25k to $100k', '$100k to $500k', 'More than $500k'],
        pnts: 'Prefer not to say'
      },
      fin_income_avg3y: {
        label: 'What is your average annual income over the last 3 years?',
        options: ['Less than $30k', '$30k - $50k', '$50k - $75k', '$75k - $100k', '$100k - $150k', 'More than $150k'],
        pnts: 'Prefer not to say'
      },
      fin_income_trend: {
        label: 'Compared to 12 months ago, your income has...',
        options: ['Decreased >20%', 'Decreased 10-20%', 'Stayed about the same', 'Increased 10-20%', 'Increased >20%']
      },
      fin_savings_rate: {
        label: 'What % of your net income did you save or invest in the last 12 months?',
        options: ['0% (spent everything)', '1-10%', '11-20%', '21-30%', '31-50%', 'More than 50%']
      },
      fin_emergency_fund: {
        label: 'Your emergency fund covers roughly...',
        options: ['<1 month', '1-3 months', '3-6 months', '6-12 months', '>12 months']
      },
      fin_debt_payments: {
        label: 'Total monthly debt payments (loans, cards)',
        options: ['$0 (no debt payments)', '$1-$500', '$501-$1,000', '$1,001-$2,000', '$2,001-$4,000', 'More than $4,000'],
        pnts: 'Prefer not to say'
      },
      fin_high_interest_debt: {
        label: 'Did you carry high-interest debt (e.g., credit card) in the last 3 months?',
        options: ['No', 'Yes, <$1k', 'Yes, $1-5k', 'Yes, >$5k']
      },
      fin_real_estate: {
        label: 'Real estate ownership',
        options: ['None', 'Primary residence', 'Rental(s)', 'Both']
      },
      health_height: {
        label: 'Height',
        options: ['Under 5\'0" (152cm)', '5\'0"-5\'3" (152-160cm)', '5\'4"-5\'7" (163-170cm)', '5\'8"-5\'11" (173-180cm)', '6\'0"-6\'3" (183-190cm)', 'Over 6\'3" (190cm+)']
      },
      health_weight: {
        label: 'Weight range',
        options: ['Under 120 lbs (54kg)', '120-150 lbs (54-68kg)', '150-180 lbs (68-82kg)', '180-220 lbs (82-100kg)', '220-280 lbs (100-127kg)', 'Over 280 lbs (127kg+)']
      },
      health_waist: {
        label: 'Waist size (clothing)',
        options: ['XS (26-28 inches)', 'S (30-32 inches)', 'M (34-36 inches)', 'L (38-40 inches)', 'XL (42-44 inches)', 'XXL+ (46+ inches)']
      },
      health_exercise_freq: {
        label: 'Exercise frequency: days/week with ≥20 min moderate/vigorous activity',
        options: ['0', '1-2', '3-4', '5-6', '7']
      },
      health_training_minutes: {
        label: 'Weekly training minutes (all exercise combined)',
        options: ['0', '1-149', '150-299', '300-449', '450+']
      },
      health_pushups: {
        label: 'Push-ups in one unbroken set',
        options: ['0', '1-9', '10-19', '20-34', '35-49', '50+']
      },
      health_pullups: {
        label: 'Pull-ups (strict) in one set',
        options: ['0', '1-2', '3-5', '6-9', '10+']
      },
      health_cooper_or_5k: {
        label: 'How would you rate your cardiovascular fitness?',
        options: ['Poor - get winded climbing stairs', 'Below average - struggle with moderate exercise', 'Average - can jog for 10-15 minutes', 'Good - can run 3+ miles comfortably', 'Very good - can run 5+ miles easily', 'Excellent - could run a half marathon']
      },
      health_sleep: {
        label: 'Sleep: average hours/night',
        options: ['<5', '5-6', '6-7', '7-8', '>8']
      },
      health_alcohol: {
        label: 'Alcohol: standard drinks/week',
        options: ['0', '1-3', '4-7', '8-14', '>14']
      },
      social_emergency_contacts: {
        label: 'If you needed $1,000 by tomorrow, how many friends/family could you realistically ask?',
        options: ['0', '1-2', '3-5', '6-10', '10+']
      },
      social_close_friends: {
        label: 'Close friends you can confide in',
        options: ['0', '1', '2-3', '4-5', '6+']
      },
      social_meetups: {
        label: 'Meet-ups with friends (offline)',
        options: ['<monthly', 'monthly', '2-3x/month', 'weekly', '2-3x/week', 'daily']
      },
      social_initiation: {
        label: 'Initiation: how often do you initiate plans?',
        options: ['Rarely', 'Sometimes', 'About half', 'Often', 'Almost always']
      },
      social_circle_diversity: {
        label: 'Social circle diversity',
        options: ['Mostly one group', '2 distinct groups', '3+ distinct groups']
      },
      social_community: {
        label: 'Community membership (club/sport/volunteer)',
        options: ['None', '1', '2+']
      },
      social_professional_network: {
        label: 'Professional favors: people who\'d intro you to a job lead in 48h',
        options: ['0', '1-2', '3-5', '6-10', '10+']
      },
      social_loneliness: {
        label: 'Loneliness in last 2 weeks',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
      },
      rom_status: {
        label: 'Current status',
        options: ['Single', 'Dating (not exclusive)', 'Exclusive relationship', 'Married/Long-term']
      },
      rom_duration: {
        label: 'Duration of current/last relationship',
        options: ['<3 months', '3-12 months', '1-3 years', '3-7 years', '>7 years']
      },
      rom_satisfaction: {
        label: 'Satisfaction with current/last relationship',
        options: ['Very unsatisfied', 'Unsatisfied', 'Neutral', 'Satisfied', 'Very satisfied']
      },
      rom_intimacy_or_dates: {
        label: 'Intimacy frequency (if partnered) / Dates in last 90 days (if single)',
        options: ['<monthly/0', 'monthly/1-2', 'weekly/3-5', '2-3x week/6-9', '4+ week/10+'],
        pnts: 'Prefer not to say'
      },
      rom_confidence: {
        label: 'Confidence initiating conversations with attractive people',
        options: ['Very low', 'Low', 'Moderate', 'High', 'Very high']
      },
      fin_retirement_savings: {
        label: 'Monthly retirement/pension contributions',
        options: ['$0', '$1-$200', '$201-$500', '$501-$1,000', '$1,001-$2,000', 'More than $2,000']
      },
      fin_investment_portfolio: {
        label: 'Investment portfolio value (stocks, bonds, etc.)',
        options: ['$0', '$1-$10k', '$10k-$50k', '$50k-$200k', '$200k-$500k', 'More than $500k'],
        pnts: 'Prefer not to say'
      },
      fin_financial_stress: {
        label: 'Financial stress level in the past month',
        options: ['Extremely stressed', 'Very stressed', 'Moderately stressed', 'Slightly stressed', 'Not stressed at all']
      },
      fin_insurance_coverage: {
        label: 'Insurance coverage you currently have',
        options: ['None', 'Health only', 'Health + Auto', 'Health + Auto + Life', 'Comprehensive (Health/Auto/Life/Disability)']
      },
      health_mental_health: {
        label: 'Overall mental health and well-being',
        options: ['Very poor', 'Poor', 'Fair', 'Good', 'Excellent']
      },
      health_stress_management: {
        label: 'Stress management practices you regularly use',
        options: ['None', 'Occasional (breathing, walks)', 'Regular (meditation, yoga)', 'Multiple practices', 'Professional support + practices']
      },
      health_medical_checkups: {
        label: 'Regular medical checkups and preventive care',
        options: ['Never/rarely', 'When sick only', 'Every 2-3 years', 'Annually', 'Bi-annually + specialists']
      },
      health_nutrition: {
        label: 'How would you rate your nutrition habits?',
        options: ['Very poor (mostly fast food/processed)', 'Poor (some home cooking)', 'Average (balanced most days)', 'Good (consistent healthy meals)', 'Excellent (optimized nutrition)']
      },
      health_energy_levels: {
        label: 'Average daily energy levels',
        options: ['Always exhausted', 'Often tired', 'Moderate energy', 'Usually energetic', 'High energy all day']
      },
      career_satisfaction: {
        label: 'Overall career/work satisfaction',
        options: ['Very unsatisfied', 'Unsatisfied', 'Neutral', 'Satisfied', 'Very satisfied']
      },
      career_growth: {
        label: 'Career growth in the past 2 years',
        options: ['Significant decline', 'Some setbacks', 'Stagnant', 'Moderate growth', 'Significant advancement']
      },
      career_skills_development: {
        label: 'Time spent on skill development per week',
        options: ['0 hours', '1-2 hours', '3-5 hours', '6-10 hours', 'More than 10 hours']
      },
      career_work_life_balance: {
        label: 'Work-life balance satisfaction',
        options: ['Very poor', 'Poor', 'Fair', 'Good', 'Excellent']
      },
      career_leadership: {
        label: 'Leadership responsibilities and influence',
        options: ['No leadership role', 'Informal influence', 'Team lead/mentor', 'Manager/supervisor', 'Executive/senior leadership']
      },
      career_networking: {
        label: 'Professional networking activity',
        options: ['None', 'Occasional events', 'Regular industry engagement', 'Active networking', 'Thought leader/speaker']
      },
      personal_goal_achievement: {
        label: 'Achievement of personal goals in the past year',
        options: ['Achieved none', 'Achieved few', 'Achieved about half', 'Achieved most', 'Exceeded goals']
      },
      personal_learning: {
        label: 'Learning new skills/knowledge outside work',
        options: ['Rarely/never', 'Occasionally', 'Monthly', 'Weekly', 'Daily learning habit']
      },
      personal_creativity: {
        label: 'Creative pursuits and hobbies',
        options: ['None', 'Rare creative moments', 'Occasional hobby', 'Regular creative practice', 'Multiple active pursuits']
      },
      personal_mindfulness: {
        label: 'Mindfulness/self-reflection practices',
        options: ['None', 'Occasional reflection', 'Weekly practice', 'Daily practice', 'Integrated lifestyle']
      },
      personal_values_alignment: {
        label: 'How well does your life align with your core values?',
        options: ['Not at all', 'Slightly', 'Moderately', 'Well', 'Perfectly aligned']
      },
      social_family_relationships: {
        label: 'Quality of family relationships',
        options: ['Very poor', 'Poor', 'Fair', 'Good', 'Excellent']
      },
      social_conflict_resolution: {
        label: 'How do you handle interpersonal conflicts?',
        options: ['Avoid completely', 'Struggle significantly', 'Handle with difficulty', 'Navigate well', 'Excel at resolution']
      },
      social_giving_back: {
        label: 'Volunteering or giving back to community',
        options: ['Never', 'Rare occasions', 'Few times per year', 'Monthly', 'Weekly commitment']
      },
      rom_communication: {
        label: 'Communication quality in romantic relationships',
        options: ['Very poor', 'Poor', 'Fair', 'Good', 'Excellent']
      },
      rom_emotional_intelligence: {
        label: 'Emotional intelligence in romantic contexts',
        options: ['Very low', 'Low', 'Moderate', 'High', 'Very high']
      },
      rom_future_planning: {
        label: 'Future planning with romantic partner/prospects',
        options: ['No planning', 'Short-term only', 'Some long-term ideas', 'Clear shared goals', 'Detailed life plan together']
      }
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      back: 'Back',
      continue: 'Continue',
      finish: 'Finish',
      yes: 'Yes',
      no: 'No',
      today: 'Today',
      yesterday: 'Yesterday',
      thisWeek: 'This Week',
      lastWeek: 'Last Week',
      language: 'Language',
      overdue: 'Overdue',
      completeNow: 'Complete Now'
    },
    about: {
      backToHome: 'Back to Home',
      aboutRankMe: 'About RankMe',
      aboutSubtitle: 'We believe everyone deserves to understand where they stand and how to improve. RankMe provides data-driven insights into your life performance across the dimensions that matter most.',
      ourMission: 'Our Mission',
      ourMissionDesc: 'To democratize access to comprehensive life assessment and personalized improvement strategies, helping millions of people achieve better outcomes across all areas of life.',
      whatMakesUsDifferent: 'What Makes RankMe Different',
      whatMakesUsDesc: 'Unlike generic self-help or one-size-fits-all solutions, RankMe provides personalized, data-driven insights based on your unique situation and peer comparisons.',
      evidenceBased: 'Evidence-Based',
      evidenceBasedDesc: 'Our assessment is grounded in psychological research and validated across thousands of users. Every recommendation is backed by data, not opinion.',
      peerCalibrated: 'Peer-Calibrated',
      peerCalibratedDesc: 'Your results are compared against people similar to you in age, background, and circumstances. See where you truly stand, not where you think you stand.',
      aiPowered: 'AI-Powered',
      aiPoweredDesc: 'Our AI coaching system adapts to your progress, providing personalized weekly plans and daily motivation tailored to your specific goals and challenges.',
      fourLifeDimensions: 'The Four Life Dimensions',
      fourDimensionsDesc: 'Our comprehensive assessment covers the key areas that research shows drive life satisfaction and long-term success.',
      financialHealthDim: 'Financial Health',
      financialHealthDimDesc: 'Income, savings, investments, and financial planning across 8 key metrics',
      physicalWellnessDim: 'Physical Wellness',
      physicalWellnessDimDesc: 'Fitness, nutrition, sleep, and overall health habits across 8 dimensions',
      socialNetworkDim: 'Social Network',
      socialNetworkDimDesc: 'Relationships, social connections, and network quality across 8 factors',
      personalGrowthDim: 'Personal Growth',
      personalGrowthDimDesc: 'Career satisfaction, goals, learning, and life fulfillment across 8 areas',
      ourApproach: 'Our Approach',
      comprehensiveAssessmentStep: 'Comprehensive Assessment',
      comprehensiveAssessmentDesc: 'Our 32-question assessment covers all major life dimensions. Unlike surface-level surveys, we dig deep into the specific behaviors and circumstances that drive results.',
      dataDrivenInsights: 'Data-Driven Insights',
      dataDrivenInsightsDesc: 'Your responses are analyzed against our database of over 10,000 assessments, providing accurate percentile rankings and identifying your top strengths and opportunities.',
      personalizedActionPlans: 'Personalized Action Plans',
      personalizedActionPlansDesc: 'Based on your specific results, we generate customized 30-day action plans with prioritized steps that deliver the highest impact for your unique situation.',
      ongoingSupport: 'Ongoing Support',
      ongoingSupportDesc: 'Our AI coaching system provides daily check-ins, weekly plan updates, and continuous motivation to help you stay on track and achieve lasting change.',
      privacySecurityFirst: 'Privacy & Security First',
      privacySecurityDesc: 'Your personal information and assessment results are treated with the highest level of security and privacy.',
      noDataSelling: 'No Data Selling',
      noDataSellingDesc: 'We never sell your personal information or assessment results to third parties. Your data is yours.',
      encryptedStorage: 'Encrypted Storage',
      encryptedStorageDesc: 'All data is encrypted both in transit and at rest using industry-standard security protocols.',
      anonymousAnalytics: 'Anonymous Analytics',
      anonymousAnalyticsDesc: 'When we use data for research, it\'s completely anonymized with no personal identifiers.',
      trustedByThousands: 'Trusted by Thousands',
      trustedDesc: 'Join the growing community of people using data-driven insights to improve their lives',
      assessmentsCompleted: 'Assessments Completed',
      averageUserRating: 'Average User Rating',
      dataPointsAnalyzed: 'Data Points Analyzed',
      readyToGetStarted: 'Ready to Get Started?',
      takeFirstStep: 'Take the first step toward a better life with our comprehensive assessment.',
      takeAssessment: 'Take Free Assessment'
    },
    pricing: {
      // Header
      backToHome: 'Back to Home',
      pageTitle: 'Choose Your Path to Growth',
      pageSubtitle: 'Whether you want deep insights or ongoing coaching support, we have the perfect option to help you improve your life performance.',
      
      // Billing Cycle
      monthly: 'Monthly',
      yearly: 'Yearly (Save 25%)',
      
      // Free Assessment Plan
      freeAssessment: 'Free Assessment',
      freeAssessmentDesc: 'Perfect for getting started',
      freePrice: '$0',
      alwaysFree: 'Always free',
      freeFeature1: 'Complete 32-question assessment',
      freeFeature2: 'Basic percentile rankings',
      freeFeature3: 'Category performance breakdown',
      freeFeature4: 'Top strengths & opportunities',
      startFreeAssessment: 'Start Free Assessment',
      
      // Deep Report Plan
      mostPopular: 'MOST POPULAR',
      deepAnalysisReport: 'Deep Analysis Report',
      deepAnalysisDesc: 'Comprehensive insights & action plan',
      deepPrice: '$29',
      oneTimePurchase: 'One-time purchase',
      deepFeature1: 'Everything in Free Assessment',
      deepFeature2: 'Detailed category analysis',
      deepFeature3: 'Personalized 30-day action plan',
      deepFeature4: 'Peer comparison insights',
      deepFeature5: 'Professional PDF download',
      deepFeature6: '30-day money-back guarantee',
      getDeepAnalysis: 'Get Deep Analysis',
      
      // AI Coach Plan
      aiLifeCoach: 'AI Life Coach',
      aiCoachDesc: 'Ongoing support & accountability',
      monthlyPrice: '$19',
      yearlyPrice: '$14',
      perMonth: 'per month',
      billedYearly: ', billed yearly',
      savePerYear: 'Save $60/year',
      aiCoachFeature1: 'Everything in Deep Report',
      aiCoachFeature2: 'Weekly personalized plans',
      aiCoachFeature3: 'Daily AI coach check-ins',
      aiCoachFeature4: 'Progress tracking & analytics',
      aiCoachFeature5: 'Monthly re-assessments',
      aiCoachFeature6: 'Cancel anytime',
      startFreeTrial: 'Start Free Trial',
      sevenDaysFree: 'First 7 days free',
      
      // Feature Comparison
      featureComparison: 'Feature Comparison',
      features: 'Features',
      free: 'Free',
      deepReport: 'Deep Report',
      aiCoach: 'AI Coach',
      feature32Question: '57-Question Assessment',
      featureBasicRankings: 'Basic Percentile Rankings',
      featureDetailedAnalysis: 'Detailed Analysis & Insights',
      feature30DayPlan: '30-Day Action Plan',
      featurePdfDownload: 'PDF Download',
      featureWeeklyPlans: 'Weekly Coaching Plans',
      featureDailyCheckins: 'Daily AI Check-ins',
      featureProgressTracking: 'Progress Tracking',
      
      // Trust Indicators
      thirtyDayGuarantee: '30-Day Guarantee',
      guaranteeDesc: 'Not satisfied? Get a full refund within 30 days, no questions asked.',
      rating: '4.8/5 Rating',
      ratingDesc: 'Trusted by over 10,000 users who\'ve improved their lives with RankMe.',
      instantAccess: 'Instant Access',
      instantAccessDesc: 'Get immediate access to your personalized insights and coaching tools.',
      
      // FAQ
      faqTitle: 'Frequently Asked Questions',
      faq1Question: 'Can I upgrade from the free version?',
      faq1Answer: 'Absolutely! You can purchase the Deep Report or start an AI Coach subscription at any time after completing your free assessment.',
      faq2Question: 'What\'s included in the 7-day trial?',
      faq2Answer: 'The AI Coach trial includes all premium features: personalized weekly plans, daily check-ins, progress tracking, and unlimited access to coaching tools.',
      faq3Question: 'How accurate are the results?',
      faq3Answer: 'Our assessment is based on validated research and calibrated against 10,000+ responses. Results are as accurate as the information you provide.',
      faq4Question: 'Can I cancel my subscription anytime?',
      faq4Answer: 'Yes, you can cancel your AI Coach subscription anytime from your account settings. You\'ll keep access until your current billing period ends.',
      faq5Question: 'Is my data secure and private?',
      faq5Answer: 'Absolutely. We use bank-level encryption and never sell your personal data. Read our privacy policy for complete details.',
      faq6Question: 'What payment methods do you accept?',
      faq6Answer: 'We accept all major credit cards through Stripe, our secure payment processor. All transactions are encrypted and PCI compliant.',
      
      // CTA Section
      ctaTitle: 'Ready to Transform Your Life?',
      ctaSubtitle: 'Join thousands of people who\'ve used RankMe to understand their strengths, identify opportunities, and create lasting positive change.',
      ctaStartAssessment: 'Start Free Assessment',
      ctaViewSample: 'View Sample Report'
    },
    loginPatterns: {
      earlyBird: 'Early Bird',
      nightOwl: 'Night Owl',
      consistent: 'Consistent User',
      weekend: 'Weekend User',
      weekday: 'Weekday User',
      irregular: 'Irregular User'
    }
  },
  es: {
    header: {
      title: 'RankMe',
      signOut: 'Cerrar Sesión'
    },
    home: {
      title: 'RankMe',
      beta: 'BETA',
      heroTitle1: 'Descubre Tu',
      heroTitle2: 'Rendimiento de Vida',
      heroSubtitle: 'Obtén información integral sobre tu rendimiento de vida en dimensiones financieras, de salud, sociales y personales.',
      noSignupRequired: 'Sin registro requerido • 5-10 minutos • Resultados instantáneos',
      getStarted: 'Comenzar',
      newAssessment: 'Nueva Evaluación',
      start: 'Empezar',
      startYourAssessment: 'Comienza Tu Evaluación',
      fourKeyDimensions: 'Cuatro Dimensiones Clave de Vida',
      assessmentEvaluatesDesc: 'Nuestra evaluación evalúa tu rendimiento en las áreas más importantes de la vida',
      financialHealth: 'Salud Financiera',
      financialHealthDesc: 'Análisis de ingresos, ahorros e inversiones',
      physicalWellness: 'Bienestar Físico',
      physicalWellnessDesc: 'Métricas de fitness, salud y estilo de vida',
      socialNetwork: 'Red Social',
      socialNetworkDesc: 'Relaciones y conexiones comunitarias',
      personalGrowth: 'Crecimiento Personal',
      personalGrowthDesc: 'Desarrollo y satisfacción de vida',
      whatYoullGet: 'Lo Que Obtendrás',
      comprehensiveAssessment: 'Evaluación integral de 32 preguntas',
      instantRankings: 'Rankings percentiles instantáneos vs pares',
      professionalScorecard: 'Análisis profesional de tarjeta de puntuación',
      personalizedInsights: 'Perspectivas de mejora personalizadas',
      premiumFeatures: 'Características Premium',
      freeAssessment: 'Evaluación Gratuita',
      freeAssessmentDesc: 'Puntuación básica y percentiles',
      deepAnalysis: 'Análisis Profundo',
      deepAnalysisDesc: 'Perspectivas detalladas + plan de acción',
      aiLifeCoach: 'Entrenador de Vida IA',
      aiLifeCoachDesc: 'Entrenamiento personalizado + seguimiento de progreso',
      yourPrivacyMatters: 'Tu Privacidad Importa',
      privacyDescription: 'Todas las evaluaciones son completamente anónimas por defecto. Tus datos están encriptados y nunca se comparten sin tu consentimiento explícito.',
      instantResults: 'Resultados Instantáneos',
      privacyFirst: 'Privacidad Primero',
      noSpam: 'Sin Spam',
      readyToDiscover: '¿Listo para Descubrir Tu Puntuación?',
      joinThousands: 'Únete a miles que ya han evaluado sus vidas y comenzado a mejorar.',
      assessmentsTaken: 'Evaluaciones Realizadas',
      userRating: 'Calificación de Usuario',
      completionRate: 'Tasa de Finalización',
      about: 'Acerca de',
      pricing: 'Precios',
      dashboard: 'Panel',
      signIn: 'Iniciar Sesión',
      tryFree: 'Prueba Evaluación Gratuita',
      platformDesc: 'Plataforma profesional de evaluación de vida',
      privacy: 'Privacidad',
      terms: 'Términos',
      contact: 'Contacto',
      copyright: '© 2024 RankMe. Todos los derechos reservados.'
    },
    scorecard: {
      yourResults: 'Tus Resultados',
      backToDashboard: 'Volver al Panel',
      overallScore: 'Puntuación General',
      percentileRank: 'Rango Percentil',
      categoryBreakdown: 'Desglose por Categorías',
      getAiCoach: 'Obtener Entrenador IA',
      getDeepReport: 'Obtener Informe Profundo',
      shareResults: 'Compartir Resultados',
      takeAnother: 'Realizar Otra Evaluación',
      loading: 'Cargando...',
      loadingResults: 'Cargando tus resultados...',
      scoreNotFound: 'Datos de puntuación no encontrados',
      backToHome: 'Volver al Inicio',
      financialHealth: 'Salud Financiera',
      physicalWellness: 'Bienestar Físico',
      socialNetwork: 'Red Social',
      personalGrowth: 'Crecimiento Personal',
      excellent: 'Excelente',
      exceptional: 'Excepcional',
      good: 'Bueno',
      average: 'Promedio',
      needsImprovement: 'Necesita Mejora',
      romantic: 'Romántico',
      career: 'Carrera',
      distribution: 'Distribución',
      sendMyResults: 'Enviar Mis Resultados',
      deepAnalysis: 'Análisis Profundo',
      viewDeepReport: 'Ver Informe Profundo',
      emailYourResults: 'Envía Tus Resultados por Email',
      enterEmailAddress: 'Ingresa tu dirección de email',
      emailResultsDesc: 'Obtén un email bellamente formateado con los resultados completos de tu evaluación e insights.',
      assessmentStats: 'Estadísticas de Evaluación',
      saveYourResults: 'Guarda Tus Resultados',
      createAccountDesc: 'Crea una cuenta gratis para hacer seguimiento de tu progreso y acceder a tus resultados en cualquier momento.',
      createFreeAccount: 'Crear Cuenta Gratis',
      signInToExistingAccount: 'Iniciar Sesión en Cuenta Existente',
      scorecardDesc: 'Esta tarjeta de puntuación muestra tus rankings percentiles. Desbloquea insights más profundos con nuestras funciones premium.',
      resultsSentSuccessfully: '¡Resultados enviados exitosamente!',
      checkYourInbox: 'Revisa tu bandeja de entrada para tu puntuación de vida detallada.',
      sendToAnotherEmail: 'Enviar a otro email',
      aiLifeCoach: 'Entrenador de Vida IA',
      greatJobSaveResults: '¡Buen Trabajo! Guarda Tus Resultados',
      createFreeAccountTo: 'Crea una cuenta gratis para:',
      trackProgressOverTime: 'Hacer seguimiento de tu progreso a lo largo del tiempo',
      accessResultsAnyDevice: 'Acceder a tus resultados desde cualquier dispositivo',
      compareImprovements: 'Comparar mejoras entre evaluaciones',
      getPersonalizedRecs: 'Obtener recomendaciones personalizadas',
      iHaveAnAccount: 'Tengo una Cuenta',
      continueWithoutAccount: 'Continuar sin cuenta',
      downloadForStories: 'Descargar para Stories',
      shareLink: 'Compartir Enlace',
      howToUse: 'Cómo usar:',
      uploadToInstagram: 'Descarga la imagen a tu teléfono, abre Instagram y crea una nueva Story, sube la imagen descargada, ¡comparte con tus seguidores!',
      shareWithFollowers: '¡Comparte con tus seguidores!',
      somethingWentWrong: 'Algo salió mal generando tu imagen para compartir.',
      scorecardShowsPercentiles: 'Esta tarjeta de puntuación muestra tus rankings percentiles. Desbloquea perspectivas más profundas con nuestras características premium.',
      unlockDeeperInsights: 'Desbloquea perspectivas más profundas con nuestras características premium.',
      accessYourReport: 'Accede a tu informe'
    },
    report: {
      deepLifeAnalysisReport: 'Informe de Análisis Profundo de Vida',
      comprehensiveInsights: 'Conocimientos integrales y recomendaciones personalizadas',
      executiveSummary: 'Resumen Ejecutivo',
      overallScore: 'Puntuación General',
      performance: 'Rendimiento',
      overallPerformanceDistribution: 'Distribución de Rendimiento General',
      peerComparison: 'Comparación con Pares',
      peerComparisonText: 'Tu puntuación de vida general es más alta que',
      categoryBreakdown: 'Desglose por Categorías',
      strengths: 'Fortalezas',
      opportunities: 'Oportunidades',
      recommendations: 'Recomendaciones',
      actionPlan30Day: 'Plan de Acción de 30 Días',
      week: 'Semana',
      timeCommitment: 'Compromiso de tiempo',
      sampleReport: 'INFORME DE MUESTRA',
      sampleDescription: 'Esta es una muestra de lo que recibirás con nuestra actualización de análisis integral',
      financialHealth: 'Salud Financiera',
      healthWellness: 'Salud y Bienestar',
      socialConnections: 'Conexiones Sociales',
      personalGrowth: 'Crecimiento Personal',
      score: 'Puntuación',
      percentile: 'Percentil',
      keyStrengths: 'Fortalezas Clave',
      growthAreas: 'Áreas de Crecimiento',
      performanceDistribution: 'Distribución de Rendimiento',
      shareText: '¡Mira mi Informe de Vida Profundo de RankMe! Puntuación General:',
      captionCopied: '¡Descripción copiada al portapapeles!',
      youAreMostSimilarTo: 'Eres más similar a las personas en la categoría',
      areas: 'Áreas',
      youExcelIn: 'Sobresales en',
      biggestOpportunityIn: 'Mayor oportunidad en',
      followingActionPlanCouldImprove: 'Seguir el plan de acción podría mejorar tu puntuación general en 15-25 puntos',
      shareYourLifeScore: 'Comparte Tu Puntuación de Vida',
      ofPeopleInYourDemographic: 'de las personas en tu demografía',
      thPercentile: '° percentil',
      topPercent: 'Top',
      belowAverage: 'Por debajo del promedio',
      aboveAverage: 'Por encima del promedio',
      bottomPercent: 'Inferior',
      backToDashboard: 'Volver al Panel',
      reportOverview: 'Resumen del Informe',
      assessmentDate: 'Fecha de Evaluación',
      questionsAnalyzed: 'Preguntas Analizadas',
      categoriesCovered: 'Categorías Cubiertas',
      peerGroupSize: 'Tamaño del Grupo de Pares',
      topPerformer: 'Alto Rendimiento',
      focusArea: 'Área de Enfoque',
      growthPotential: 'Potencial de Crecimiento',
      shareReport: 'Compartir Informe',
      downloadPDF: 'Descargar PDF',
      categoryDeepDive: 'Análisis Profundo por Categoría',
      quickWins: 'Victorias Rápidas',
      wantOngoingSupport: '¿Quieres Soporte Continuo?',
      reportDataNotFound: 'Datos del informe no encontrados',
      backToHome: 'Volver al Inicio',
      keyInsights: 'Conocimientos Clave',
      yourLifeScore: 'Tu Puntuación de Vida',
      performanceBreakdown: 'Desglose de Rendimiento',
      topStrength: 'Fortaleza Principal',
      growthArea: 'Área de Crecimiento',
      questionsAnswered: 'Preguntas Respondidas',
      completionTime: 'Tiempo de Finalización',
      seconds: 'segundos',
      minutes: 'minutos',
      mins: 'min',
      sec: 'seg',
      defaultCompletionTime: '~8 min',
      peerGroup: 'Grupo de Pares',
      recentActivity: 'Actividad Reciente',
      scoreDataNotFound: 'Datos de puntuación no encontrados',
      readyToImproveYourScore: '¿Listo para Mejorar Tu Puntuación?',
      improveScoreDescription: 'Obtén perspectivas personalizadas y recomendaciones prácticas para mejorar tu rendimiento de vida.',
      shareYourLifeScore: 'Comparte Tu Puntuación de Vida',
      exceptional: 'Excepcional',
      excellent: 'Excelente',
      good: 'Bueno',
      fair: 'Regular',
      needsAttention: 'Necesita Atención',
      personalizedInsights: 'Perspectivas Personalizadas',
      crossCategoryPatterns: 'Patrones Entre Categorías',
      surprisingFindings: 'Hallazgos Sorprendentes',
      longTermStrategy: 'Estrategia a Largo Plazo',
      primaryLimitingFactor: 'Factor Limitante Principal',
      threeMonthGoals: 'Objetivos de 3 Meses',
      oneYearGoals: 'Objetivos de 1 Año',
      recommendedResources: 'Recursos Recomendados',
      primaryGrowthAreas: 'Áreas Principales de Crecimiento',
      generatingDeepReport: 'Generando informe profundo',
      individualQuestionAnalysis: 'Análisis Individual de Preguntas',
      yourAnswer: 'Tu Respuesta: ',
      myRankMeLifeScoreDeepReport: 'Mi Informe Profundo de Puntuación de Vida RankMe',
      linkCopiedToClipboard: '¡Enlace copiado al portapapeles!'
    },
    coach: {
      // Navigation & Basic
      backToDashboard: 'Volver al Panel',
      aiCoach: 'Entrenador IA',
      yourCoach: 'Tu Entrenador',
      welcome: 'Bienvenido a tu Entrenador IA',
      weeklyGoals: 'Objetivos Semanales',
      dailyTasks: 'Tareas Diarias',
      progress: 'Progreso',
      checkins: 'Check-ins',
      achievements: 'Logros',
      settings: 'Configuración',
      startWeek: 'Comenzar Semana',
      completeTask: 'Completar Tarea',
      scheduleCheckin: 'Programar Check-in',
      viewProgress: 'Ver Progreso',
      welcomeTitle: '¡Bienvenido a Tu Entrenador de Vida IA! 🎉',
      subscriptionActive: '¡Tu suscripción está activa! Configuremos tu experiencia de entrenamiento personalizada para ayudarte a lograr tus objetivos de vida.',
      coachNotFound: 'Datos del entrenador no encontrados',
      
      // Header & Status
      yourAiLifeCoach: 'Tu Entrenador de Vida IA',
      activeSubscription: 'Suscripción Activa',
      daysLeftInTrial: 'días restantes en prueba',
      chatWithCoach: 'Chatear con Entrenador',
      
      // Focus Areas
      financialHealth: 'Salud Financiera',
      physicalWellness: 'Bienestar Físico',
      socialNetwork: 'Red Social',
      personalDevelopment: 'Desarrollo Personal',
      otherTasks: 'Otras Tareas',
      
      // Date Navigation
      todaysGoals: 'Objetivos de Hoy',
      yesterdaysGoals: 'Objetivos de Ayer',
      tomorrowsGoals: 'Objetivos de Mañana',
      goalsFor: 'Objetivos para',
      
      // Onboarding
      letsGetYouStarted: 'Empecemos',
      setYourCoachingPreferences: 'Configura Tus Preferencias de Entrenamiento',
      chooseFocusAreaDesc: 'Elige tu área de enfoque, estilo de entrenamiento y qué tan seguido te gustaría recibir orientación.',
      scheduleYourCheckins: 'Programa Tus Check-ins',
      setUpCheckinsDesc: 'Configura check-ins regulares para rastrear tu progreso y mantenerte motivado.',
      meetYourAiCoach: 'Conoce a Tu Entrenador IA',
      firstConversationDesc: 'Ten tu primera conversación y obtén tu plan de acción personalizado.',
      
      // Benefits
      personalizedGoals: 'Objetivos Personalizados',
      personalizedGoalsDesc: 'Obtén planes de acción semanales adaptados a los resultados de tu evaluación',
      twentyFourSevenSupport: 'Soporte 24/7',
      twentyFourSevenSupportDesc: 'Chatea con tu entrenador IA en cualquier momento para orientación y motivación',
      trackProgress: 'Rastrea el Progreso',
      trackProgressDesc: 'Ve tu mejora con análisis detallados e información',
      
      // Coach Configuration
      coachConfiguration: 'Configuración del Entrenador',
      primaryFocus: 'Enfoque Principal',
      secondary: 'Secundario',
      style: 'Estilo',
      motivation: 'Motivación',
      focusArea: 'Área de Enfoque',
      coachingStyle: 'Estilo de Entrenamiento',
      taskFrequency: 'Frecuencia de Tareas',
      motivationLevel: 'Nivel de Motivación',
      assessmentSpecificSettings: 'Configuraciones específicas de la evaluación',
      difficulty: 'dificultad',
      
      // Coach Styles & Options
      supportive: 'Comprensivo',
      analytical: 'Analítico',
      direct: 'Directo',
      encouraging: 'Alentador',
      gentle: 'Suave',
      balanced: 'Equilibrado',
      intense: 'Intenso',
      easy: 'Fácil',
      moderate: 'Moderado',
      challenging: 'Desafiante',
      financial: 'Financiero',
      health: 'Salud',
      social: 'Social',
      personal: 'Personal',
      none: 'Ninguno',
      daily: 'diarias',
      weekly: 'semanales',
      
      // Progress
      yourProgress: 'Tu Progreso',
      lastUpdated: 'Última actualización',
      dayStreak: 'Racha de Días',
      completionRate: 'Tasa de Finalización',
      currentScore: 'Puntuación Actual',
      pointsImproved: 'Puntos Mejorados',
      sinceYouStarted: 'Desde que empezaste',
      onFire: '🔥 ¡En llamas!',
      keepGoing: '¡Sigue así!',
      completed: 'completadas',
      percentile: 'percentil',
      
      // Daily Progress
      dailyProgressByDay: 'Progreso Diario por Día',
      pastDays: 'Días pasados',
      today: 'Hoy',
      future: 'Futuro',
      combinedWeeklyProgress: 'Progreso Semanal Combinado',
      allTasksForThisWeek: 'Todas las tareas para esta semana',
      weeklyTasks: 'Tareas Semanales',
      dailyGoals: 'Objetivos Diarios',
      
      // Task Management
      weeklyTasksForWeek: 'Tareas Semanales para la Semana',
      expandAll: 'Expandir Todo',
      collapseAll: 'Colapsar Todo',
      expandTasks: 'Expandir tareas',
      collapseTasks: 'Colapsar tareas',
      deleteTask: 'Eliminar tarea',
      showCompleted: 'Mostrar Completadas',
      hideCompleted: 'Ocultar Completadas',
      clickShowCompletedToView: 'Haz clic en "Mostrar Completadas" para ver detalles',
      noGoalsSetForToday: 'No hay objetivos establecidos para hoy',
      noGoalsPlanned: 'No hay objetivos planeados para',
      noGoalsWereSet: 'No se establecieron objetivos para',
      deleteGoal: 'Eliminar objetivo',
      yesterday: 'Ayer',
      goToToday: 'Ir a Hoy',
      tomorrow: 'Mañana',
      
      // Chat Interface
      quickSuggestions: 'Sugerencias Rápidas',
      howCanIImprove: '¿Cómo puedo mejorar mi área con puntuación más baja?',
      whatShouldIFocus: '¿En qué debería enfocarme esta semana?',
      feelingStuck: 'Me siento estancado. ¿Algún consejo?',
      typeYourMessage: 'Escribe tu mensaje...',
      troubleConnecting: 'Tengo problemas para conectarme ahora. Por favor inténtalo de nuevo en un momento.',
      
      // Journal
      reflectOnYourDay: 'Reflexiona Sobre Tu Día',
      journalPrompt: 'Pregunta de Diario',
      journalPlaceholder: 'Tómate un momento para reflexionar sobre tu día, progreso, desafíos y percepciones...',
      
      // Goals Management
      yourGoals: 'Tus Objetivos',
      addNewGoal: 'Agregar Nuevo Objetivo',
      goalCategory: 'Categoría del Objetivo',
      goalTitle: 'Título del Objetivo',
      goalDescription: 'Descripción del Objetivo',
      goalTarget: 'Meta del Objetivo',
      goalDeadline: 'Fecha Límite del Objetivo',
      goalDescriptionPlaceholder: 'Describe tu objetivo y por qué es importante para ti...',
      createGoal: 'Crear Objetivo',
      
      // Settings Modal
      accountSettings: 'Configuración de la Cuenta',
      notifications: 'Notificaciones',
      dailyReminders: 'Recordatorios Diarios',
      weeklyReports: 'Reportes Semanales',
      reminderTime: 'Hora del Recordatorio',
      goalFrequency: 'Frecuencia de Objetivos',
      
      // Alerts & Messages
      taskCreatedSuccessfully: '¡Tarea creada exitosamente!',
      failedToCreateTask: 'Error al crear la tarea. Por favor inténtalo de nuevo.',
      journalEntrySaved: '¡Entrada de diario guardada! Tus pensamientos han sido registrados.',
      journalEntryError: 'Error al guardar la entrada del diario. Por favor inténtalo de nuevo.',
      checkInCompleted: '¡Check-in completado exitosamente!',
      checkInFailed: 'Error al completar el check-in. Por favor inténtalo de nuevo.',
      preferencesError: 'Error al guardar las preferencias. Por favor inténtalo de nuevo.',
      checkInsSetupFailed: 'Error al configurar los check-ins',
      coachingDataError: 'Error al generar datos de entrenamiento',
      goalCreated: '¡Objetivo creado exitosamente! Sigue trabajando hacia él.',
      settingsSaved: '¡Configuración guardada exitosamente! Tus preferencias han sido actualizadas.',
      settingsError: 'Error al guardar la configuración. Por favor inténtalo de nuevo.',
      
      // Task Creator
      createTask: 'Crear Tarea',
      taskTitle: 'Título de la Tarea',
      taskDescription: 'Descripción de la Tarea',
      category: 'Categoría',
      estimatedTime: 'Tiempo Estimado',
      date: 'Fecha',
      creating: 'Creando...',
      enterTaskTitle: 'Ingresa el título de la tarea...',
      describeTheTask: 'Describe la tarea...',
      
      // Journal Questions
      financialJournalPrompt: '',
      healthJournalPrompt: '',
      socialJournalPrompt: '',
      personalJournalPrompt: '',
      
      // Additional UI strings
      startYourStreakToday: '¡Comienza tu racha hoy!',
      upcomingCheckIns: 'Próximos Check-ins',
      quickActions: 'Acciones Rápidas',
      needHelp: '¿Necesitas Ayuda?',
      questionsAboutCoaching: '¿Preguntas sobre tu plan de entrenamiento o progreso? Estamos aquí para ayudar.',
      noWeeklyTasksCompleted: 'No hay tareas semanales completadas aún',
      noDailyGoalsCompleted: 'No hay objetivos diarios completados aún',
      totalTasksCompleted: 'tareas completadas en total',
      clickShowCompletedDetails: 'Haz clic en "Mostrar Completadas" para ver detalles',
      failedToUpdateTask: 'Error al actualizar la tarea. Por favor intenta de nuevo.',
      failedToDeleteTask: 'Error al eliminar la tarea. Por favor intenta de nuevo.',
      failedToSavePreferences: 'Error al guardar las preferencias. Por favor intenta de nuevo.',
      checkInCompletedSuccess: '¡Check-in completado exitosamente!',
      failedToCompleteCheckIn: 'Error al completar el check-in. Por favor intenta de nuevo.',
      failedToSetupCheckIns: 'Error al configurar los check-ins',
      failedToGenerateCoaching: 'Error al generar datos de entrenamiento',
      goalCreatedSuccess: '¡Objetivo creado exitosamente! Sigue trabajando hacia él.',
      settingsSavedSuccess: '¡Configuración guardada exitosamente! Tus preferencias han sido actualizadas.',
      errorSavingSettings: 'Error al guardar la configuración. Por favor intenta de nuevo.',
      errorCreatingTask: 'Error al crear la tarea',
      allFocusAreas: 'Todas las Áreas de Enfoque',
      completedTasksCount: 'completadas',
      combinesAllTasks: 'Combina todas las tareas semanales + objetivos diarios de toda la semana',
      pastDays: 'Días pasados',
      todayText: 'Hoy',
      futureText: 'Futuro',
      minutes: 'min',
      contactSupport: 'Contactar Soporte',
      noCheckInsScheduled: 'No hay check-ins programados',
      deleteGoal: 'Eliminar objetivo',
      addNewGoal: 'Agregar un nuevo objetivo',
      completedTasks: 'Tareas Completadas',
      totalTasksCompletedThis: 'tareas completadas en total',
      clickShowCompleted: 'Haz clic en "Mostrar Completadas" para ver detalles',
      showCompleted: 'Mostrar Completadas',
      hideCompleted: 'Ocultar Completadas',
      noGoalsSetToday: 'No hay objetivos establecidos para hoy',
      editSchedule: 'Editar Horario',
      completeNow: 'Completar Ahora',
      overdue: 'Vencido',
      checkInType: 'Check-in',
      setUpCheckIns: 'Configurar Check-ins',
      setUpCheckInsTitle: 'Configurar Check-Ins',
      continueSetup: 'Continuar Configuración',
      frequencyDaily: 'Diario',
      frequencyWeekly: 'Semanal',
      frequencyBiweekly: 'Quincenal',
      frequencyMonthly: 'Mensual',
      frequencyMultipleDaily: 'Varias Veces al Día',
      dailyDescription: 'Una vez al día',
      weeklyDescription: 'Días específicos',
      biweeklyDescription: 'Cada 2 semanas',
      monthlyDescription: 'Una vez al mes',
      multipleDailyDescription: 'Varias veces al día',
      at: 'a las',
      howOften: '¿Con qué frecuencia?',
      whenLabel: '¿Cuándo?',
      times: 'Horarios',
      timeLabel: 'Hora',
      daysLabel: 'Días',
      addTime: 'Agregar hora',
      hideAdvanced: 'Ocultar',
      showAdvanced: 'Mostrar',
      reminder: 'Recordatorio',
      schedule: 'Horario:',
      reminderMinBefore: 'min antes',
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo',
      mon: 'Lun',
      tue: 'Mar',
      wed: 'Mié',
      thu: 'Jue',
      fri: 'Vie',
      sat: 'Sáb',
      sun: 'Dom',
      morning: 'Mañana',
      afternoon: 'Tarde',
      evening: 'Noche',
      createNewTask: 'Crear Nueva Tarea',
      createDailyGoal: 'Crear Objetivo Diario',
      howCanIImprove: '¿Cómo puedo mejorar mi puntuación de vida?',
      whatShouldIFocus: '¿En qué debería enfocarme esta semana?',
      feelingStuck: 'Me siento estancado, ¿qué debería hacer?',
      typeMessage: 'Escribe tu mensaje...',
      sendMessage: 'Enviar',
      expandTasks: 'Expandir tareas',
      collapseTasks: 'Contraer tareas',
      workOnAllAreas: 'Trabaja en todas las áreas de tu vida simultáneamente',
      expandAll: 'Expandir Todo',
      collapseAll: 'Contraer Todo',
      
      // Modal translations
      createWeeklyTasks: 'Crear Tareas Semanales',
      weekOf: 'Semana de',
      taskNumber: 'Tarea',
      category: 'Categoría',
      taskTitle: 'Título de la Tarea',
      taskTitleRequired: 'Título de la Tarea *',
      description: 'Descripción',
      descriptionRequired: 'Descripción *',
      addTask: 'Agregar Tarea',
      saveTasks: 'Guardar Tareas',
      cancel: 'Cancelar',
      financialHealth: 'Salud Financiera',
      physicalWellness: 'Bienestar Físico',
      socialConnection: 'Conexión Social',
      personalDevelopment: 'Desarrollo Personal',
      other: 'Otro',
      createDailyTask: 'Crear Tarea Diaria',
      priority: 'Prioridad',
      date: 'Fecha',
      estimatedMinutes: 'Min. Estimados',
      optional: 'Opcional',
      high: 'Alto',
      medium: 'Medio',
      low: 'Bajo',
      
      // Contact Support Modal
      howCanWeHelp: '¿Cómo podemos ayudarte?',
      subject: 'Asunto',
      message: 'Mensaje',
      weWillRespondTo: 'Responderemos a:',
      generalQuestion: 'Pregunta General',
      technicalIssue: 'Problema Técnico',
      feedback: 'Comentarios',
      featureRequest: 'Solicitud de Función',
      
      // Progress indicators
      complete: 'Completo',
      noDailyGoalsCompleted: 'Aún no se han completado objetivos diarios',
      overallProgress: 'Progreso General',
      combined: 'Combinado',
      totalTasksCompletedThisWeek: 'Tareas Completadas Esta Semana',
      hideCompleted: 'Ocultar Completadas',
      showCompleted: 'Mostrar Completadas',
      
      // Additional translations for remaining elements
      weeklyTasks: 'Tareas Semanales',
      dailyGoalsToday: 'Objetivos Diarios Hoy',
      week: 'Semana',
      dailyGoals: 'Objetivos Diarios',
      createYourFirstGoal: 'Crea tu primer objetivo',
      needHelp: '¿Necesitas Ayuda?',
      questionsAboutCoachingPlan: '¿Preguntas sobre tu plan de entrenamiento o progreso? Estamos aquí para ayudar.',
      contactSupport: 'Contactar Soporte',
      addTask: 'Agregar Tarea',
      taskTitle: 'Título de la Tarea',
      descriptionOptional: 'Descripción (Opcional)',
      category: 'Categoría',
      priority: 'Prioridad',
      date: 'Fecha',
      estMinutes: 'Min. Estimados',
      createDailyTask: 'Crear Tarea Diaria',
      
      // CoachPreferenceSetup component - Setup Process
      setupProgress: 'Progreso de Configuración',
      step: 'Paso',
      of: 'de',
      stepOf: 'Paso ${step} de ${total}',
      welcomeToAICoach: '¡Bienvenido a tu Entrenador de Vida IA!',
      letsPersonalize: 'Personalicemos tu experiencia',
      personalizeExperience: 'Personalicemos tu experiencia. ¿En qué área te gustaría enfocarte?',
      whatAreaFocus: '¿En qué área te gustaría enfocarte?',
      primaryFocusArea: 'Área de Enfoque Principal',
      secondaryFocusArea: 'Área de Enfoque Secundaria',
      secondaryFocusOptional: 'Área de Enfoque Secundaria (Opcional)',
      
      // Focus Areas
      financialHealth: 'Salud Financiera',
      physicalHealth: 'Salud Física', 
      socialLife: 'Vida Social',
      personalGrowth: 'Crecimiento Personal',
      budgetManagementWealth: 'Gestión de presupuesto y creación de riqueza',
      fitnessNutritionWellness: 'Fitness, nutrición y hábitos de bienestar',
      relationshipsSocial: 'Relaciones y conexiones sociales',
      selfImprovementSkills: 'Automejora y desarrollo de habilidades',
      financialHealthDesc: 'Gestión de presupuesto y creación de riqueza',
      physicalHealthDesc: 'Fitness, nutrición y hábitos de bienestar',
      socialLifeDesc: 'Relaciones y conexiones sociales',
      personalGrowthDesc: 'Automejora y desarrollo de habilidades',
      
      // Task Preferences
      taskPreferences: 'Preferencias de Tareas',
      howManyTasks: '¿En cuántas tareas te gustaría trabajar?',
      dailyTasksCount: 'Tareas Diarias: ${count}',
      weeklyTasksCount: 'Tareas Semanales: ${count}',
      taskDifficulty: 'Dificultad de Tareas',
      oneTask: '1 tarea',
      tasksRecommended: '3 tareas (recomendado)',
      threeTasksRecommended: '3 tareas (recomendado)',
      twoThreeRecommended: '2-3 (recomendado)',
      fiveTasks: '5 tareas',
      noWeeklyTasks: 'Sin tareas semanales',
      recommendedTasks: '2-3 (recomendado)',
      easy: 'Fácil',
      moderate: 'Moderado', 
      challenging: 'Desafiante',
      specificGoalsChallenges: 'Objetivos o Desafíos Específicos (Opcional)',
      specificGoalsPlaceholder: 'Ej., \'Quiero ahorrar $5000 este año\' o \'Necesito ayuda con el presupuesto y reducir deudas\'',
      
      // Coaching Style
      coachingStyle: 'Estilo de Entrenamiento',
      howInteractWithYou: '¿Cómo te gustaría que interactúe contigo?',
      howToInteract: '¿Cómo te gustaría que interactúe contigo?',
      coachingApproach: 'Enfoque de Entrenamiento',
      supportive: 'Solidario',
      direct: 'Directo',
      motivational: 'Motivacional',
      analytical: 'Analítico',
      supportiveDesc: 'Aliento gentil y orientación empática',
      directDesc: 'Entrenamiento directo y orientado a la acción',
      motivationalDesc: 'Enfoque de alta energía e inspirador',
      analyticalDesc: 'Orientación lógica basada en datos',
      motivationLevel: 'Nivel de Motivación',
      gentle: 'Suave',
      balanced: 'Equilibrado',
      intense: 'Intenso',
      softEncouragement: 'Aliento suave',
      mixedApproach: 'Enfoque mixto',
      pushMeHard: 'Presióname fuerte',
      gentleDesc: 'Aliento suave',
      balancedDesc: 'Enfoque mixto',
      intenseDesc: 'Presióname fuerte',
      
      // Check-in Preferences
      checkinPreferences: 'Preferencias de Check-in',
      howOftenCheckin: '¿Con qué frecuencia te gustaría revisar tu progreso?',
      howOftenCheckIn: '¿Con qué frecuencia te gustaría revisar tu progreso?',
      checkinFrequency: 'Frecuencia de Check-in',
      preferredCheckinTime: 'Hora Preferida de Check-in',
      daily: 'Diario',
      weekly: 'Semanal',
      biweekly: 'Quincenal',
      youreAllSet: '¡Ya está todo listo!',
      preferencesWillBeSaved: 'Tus preferencias se guardarán y se utilizarán para personalizar tu experiencia de entrenamiento. Siempre puedes actualizar estas configuraciones más tarde.',
      completeSetup: 'Completar Configuración',
      saving: 'Guardando...',
      
      // Journal & Reflection
      dailyJournal: 'Diario Personal',
      reflectOnTodaysProgress: 'Reflexiona sobre el progreso de hoy',
      todaysReflection: 'Reflexión de Hoy',
      yourThoughts: 'Tus Pensamientos',
      charactersCount: '${count} caracteres',
      journalingTips: '💡 Consejos de Escritura',
      beHonestAuthentic: '• Sé honesto y auténtico con tus pensamientos',
      focusSpecificExamples: '• Enfócate en ejemplos y experiencias específicas',
      considerWhatLearned: '• Considera lo que aprendiste y cómo puedes mejorar',
      celebrateSmallWins: '• Celebra los pequeños logros y el progreso realizado',
      
      // Personal Goals
      personalGoals: 'Objetivos Personales',
      setTrackObjectives: 'Establece y rastrea tus objetivos',
      setAndTrackObjectives: 'Establece y rastrea tus objetivos',
      yourCurrentGoals: 'Tus Objetivos Actuales',
      noGoalsSetYet: 'Aún no se han establecido objetivos',
      addNewGoal: 'Agregar nuevo objetivo',
      goalTitle: 'Título del Objetivo',
      targetOptional: 'Meta (opcional)',
      deadlineOptional: 'Fecha límite (opcional)',
      
      // Settings Display Labels
      focusArea: 'Área de Enfoque',
      secondary: 'Secundaria:',
      taskFrequency: 'Frecuencia de Tareas',
      assessmentSpecificSettings: 'Configuraciones específicas de evaluación',
      moderateDifficulty: 'dificultad moderada',
      personal: 'personal',
      social: 'social',
      coachingStyleLabel: 'Estilo de Coaching',
      motivationLevel: 'Nivel de Motivación',
      daily: 'diario',
      weekly: 'semanal',
      difficulty: 'dificultad',
      
      // Navigation & Actions
      back: 'Atrás',
      next: 'Siguiente',
      
      // Form Validation & Placeholders
      enterFullName: 'Ingresa tu nombre completo',
      enterEmail: 'Ingresa tu email',
      createPassword: 'Crea una contraseña',
      confirmPassword: 'Confirma tu contraseña',
      yourName: 'Tu nombre',
      
      // Additional UI Elements
      createTasks: '+ Crear Tareas',
      setNewGoals: 'Establecer Nuevos Objetivos',
      hereToHelpGrow: 'Aquí para ayudarte a crecer',
      startAConversation: 'Iniciar una conversación',
      askMeAboutProgress: 'Pregúntame sobre tu progreso, objetivos o cualquier cosa relacionada con tu desarrollo personal.',
      coachCapabilitiesTitle: 'Tu Coach de Vida IA',
      coachCapabilitiesSubtitle: 'Estoy aquí para ayudarte a crecer y alcanzar tus objetivos. Esto es lo que puedo hacer:',
      taskManagement: 'Gestión de Tareas',
      taskManagementDesc: 'Crear tareas diarias y semanales, establecer recordatorios y seguir el progreso',
      progressTracking: 'Seguimiento del Progreso',
      progressTrackingDesc: 'Monitorear tu desarrollo en todas las áreas de la vida y celebrar logros',
      personalizedAdvice: 'Consejos Personalizados',
      personalizedAdviceDesc: 'Obtener orientación adaptada basada en tus resultados de evaluación y objetivos',
      goalSetting: 'Establecimiento de Objetivos',
      goalSettingDesc: 'Definir objetivos significativos y crear planes de acción para alcanzarlos',
      exampleQuestions: 'Prueba preguntándome:',
      viewFullReport: 'Ver Informe Completo',
      deepAnalysisInsights: 'Análisis profundo y perspectivas',
      viewJournalEntries: 'Ver Entradas del Diario',
      readPastReflections: 'Lee tus reflexiones pasadas',
      noJournalEntries: 'Aún no hay entradas del diario',
      journalEntriesTitle: 'Entradas del Diario',
      journalEntriesSubtitle: 'Tus reflexiones y pensamientos',
      briefDescription: 'Breve descripción de tu problema o pregunta',
      message: 'Mensaje',
      pleaseProvideDetails: 'Por favor proporciona todos los detalles posibles...',
      updateYourObjectives: 'Actualiza tus objetivos',
      categorySelection: 'Selección de categoría',
      noGoalsSetYet: 'Aún no se han establecido objetivos',
      category: 'Categoría',
      goalTitle: 'Título del Objetivo',
      descriptionOptional: 'Descripción (opcional)',
      targetOptional: 'Meta (opcional)',
      deadlineOptional: 'Fecha límite (opcional)',
      journalingTips: '💡 Consejos de Diario',
      beHonestAuthentic: 'Sé honesto y auténtico con tus pensamientos',
      focusOnSpecificExamples: 'Enfócate en ejemplos y experiencias específicas',
      considerWhatYouLearned: 'Considera lo que aprendiste y cómo puedes mejorar',
      celebrateSmallWins: 'Celebra las pequeñas victorias y el progreso realizado',
      reflectOnProgress: 'Reflexiona sobre tu progreso y celebra los logros',
      selectCategory: 'Selecciona una categoría',
      goalTitlePlaceholder: 'ej., Ahorrar $5,000 para fondo de emergencia',
      goalDescriptionPlaceholder: 'Describe tu objetivo y por qué es importante para ti...',
      goalTargetPlaceholder: 'ej., $5,000, 10 libras, 30 minutos diarios',
      taskTitlePlaceholder: 'Ingresa el título de la tarea...',
      taskDescriptionPlaceholder: 'Describe la tarea...',
      
      // Journal & Buttons
      takeAMomentToReflect: 'Tómate un momento para reflexionar sobre tu día, progreso, desafíos y perspectivas',
      cancel: 'Cancelar',
      saveEntry: 'Guardar Entrada',
      createGoal: 'Crear Objetivo',
      weekNumber: 'Semana',
      dailyCheckIn: 'Check-in Diario',
      
      // Configuration Display
      moderateDifficulty: 'dificultad moderada'
    },

    // Perspectivas Predictivas
    insights: {
      // Encabezados de Componentes Principales
      aiPredictiveInsights: 'Perspectivas Predictivas de IA',
      aiInsights: 'Perspectivas de IA',
      quickInsights: 'Perspectivas de IA',
      
      // Texto Descriptivo
      insightsBasedOnAssessment: 'Perspectivas basadas en tus respuestas de evaluación e interacciones de coaching',
      insightsBasedOnAllAssessments: 'Perspectivas basadas en todas tus evaluaciones e interacciones de coaching',
      analyzingPatterns: 'Analizando tus patrones...',
      gatheringData: 'Recopilando datos para generar perspectivas personalizadas...',
      noMoreInsights: '¡No hay más perspectivas que mostrar. Vuelve más tarde para nuevas predicciones!',
      checkBackLater: '¡Vuelve más tarde para nuevas predicciones!',
      
      // Etiquetas de Tipo de Perspectiva
      riskAlert: 'Alerta de Riesgo',
      patternForecast: 'Pronóstico de Patrón',
      smartRecommendation: 'Recomendación Inteligente',
      strategicTiming: 'Momento Estratégico',
      deepInsights: 'Perspectivas Profundas',
      
      // Descripciones de Tipos de Perspectiva
      riskAlertDesc: 'Desafíos potenciales por delante',
      patternForecastDesc: 'Tus patrones de comportamiento',
      smartRecommendationDesc: 'Optimizado para tu éxito',
      strategicTimingDesc: 'Momentos óptimos de intervención',
      deepInsightsDesc: 'Coaching basado en patrones',
      
      // Etiquetas de Prioridad
      highPriority: 'Alta Prioridad',
      mediumPriority: 'Prioridad Media',
      lowPriority: 'Baja Prioridad',
      confident: 'confiado',
      
      // Etiquetas de Filtro
      allInsights: 'Todas',
      
      // Etiquetas de Acción
      viewActions: 'Ver Acciones',
      suggestedActions: 'Acciones Sugeridas',
      dismissInsight: 'Descartar perspectiva',
      refreshInsights: 'Actualizar perspectivas',
      tryAgain: 'Intentar de nuevo',
      
      // Metadatos
      cached: 'En Caché',
      cachedFrom: 'En caché desde',
      generated: 'Generado',
      expires: 'Expira',
      fromCache: 'Del Caché',
      confidenceHigh: 'Alta',
      confidenceMedium: 'Media',
      confidenceLow: 'Baja',
      allAssessmentsMode: 'Modo Todas las Evaluaciones',
      
      // Mensajes de Error
      errorLoadingInsights: 'Error cargando perspectivas',
      
      // Mensajes de Perspectivas Específicas
      taskCompletionRisk: 'Alerta de Riesgo de Finalización de Tareas',
      streakAtRisk: '¡Racha en Riesgo!',
      peakProductivityDetected: 'Productividad Máxima Detectada',
      weeklyPatternIdentified: 'Patrón Semanal Identificado',
      productivityDeclineDetected: 'Decline de Productividad Detectado',
      productivitySurge: '¡Aumento de Productividad!',
      cohortSuccessPattern: 'Patrón de Éxito de Cohorte',
      focusAreaIdentified: 'Área de Enfoque Identificada',
      optimalTaskLoad: 'Carga Óptima de Tareas',
      strategicPlanningAlert: 'Alerta de Planificación Estratégica',
      energyManagementTip: 'Consejo de Gestión de Energía',
      burnoutPreventionAlert: 'Alerta de Prevención de Agotamiento',
      moodPerformanceConnection: 'Conexión Estado de Ánimo-Rendimiento',
      goalAchievementPattern: 'Patrón de Logro de Objetivos',
      taskTimingPattern: 'Patrón de Tiempo de Tareas',
      
      // Sugerencias de Acción Comunes
      scheduleTasksOptimalTime: 'Programa tareas para tu momento más productivo',
      setReminder30Minutes: 'Establece un recordatorio 30 minutos antes de tu hora habitual de tareas',
      prepareMaterialsTonight: 'Prepara materiales esta noche para reducir fricción mañana',
      breakTasksIntoSteps: 'Considera dividir tareas en pasos más pequeños',
      completeOneMoreTask: 'Completa al menos una tarea más para mantener el impulso',
      focusOnQuickWins: 'Enfócate en victorias rápidas para aumentar la tasa de finalización',
      setTimer25Minutes: 'Establece un temporizador de 25 minutos y aborda tu tarea más fácil',
      tryOptimalTimeForWeek: 'Intenta completar tareas en el momento óptimo durante una semana',
      setDailyReminders: 'Establece recordatorios diarios para este momento óptimo',
      trackCompletionRate: 'Rastrea si este horario mejora tu tasa de finalización',
      adjustSchedule: 'Ajusta tu horario para proteger este tiempo',
      planChallengingTasks: 'Planifica tareas desafiantes para este día',
      useOptimalDay: 'Usa este día para progreso importante en objetivos',
      scheduleEasierTasks: 'Programa tareas más fáciles en días menos productivos',
      reviewSimplifyGoals: 'Revisa y simplifica tus objetivos actuales',
      takeShortBreak: 'Toma un descanso corto para prevenir agotamiento',
      focusOneCategory: 'Enfócate en una categoría a la vez',
      adjustTaskDifficulty: 'Considera ajustar la dificultad de las tareas',
      documentWhatWorks: 'Documenta lo que está funcionando para ti',
      increaseTaskDifficulty: 'Considera aumentar la dificultad de las tareas',
      shareSuccessStrategies: 'Comparte tus estrategias de éxito',
      setAmbitiousGoals: 'Establece objetivos más ambiciosos',
      prePlanSimpleWins: 'Pre-planifica victorias simples para días desafiantes',
      scheduleFavoriteActivities: 'Programa tus actividades favoritas como recompensas',
      prepareEverythingNight: 'Prepara todo la noche anterior',
      partnerAccountability: 'Asóciate con alguien para responsabilidad',
      makeRestPlanningDay: 'Considera hacer de este un día de descanso o planificación',
      scheduleBreaksBeforeEnergyDips: 'Programa descansos antes de caídas de energía',
      planEnergizingActivities: 'Planifica actividades energizantes para momentos bajos',
      adjustMealTiming: 'Ajusta el horario de comidas para energía sostenida',
      try10MinuteWalk: 'Prueba una caminata de 10 minutos durante momentos de baja energía',
      takeCompleteRestDay: 'Toma un día de descanso completo esta semana',
      reduceTaskLoad30Percent: 'Reduce la carga de tareas en 30% por 3 días',
      focusEssentialTasks: 'Enfócate solo en tareas esenciales',
      scheduleEnjoyableActivity: 'Programa algo agradable y relajante',
      practiceSayingNo: 'Practica decir no a compromisos adicionales',
      noticeWhatCreatesMood: 'Nota qué crea estados de ánimo positivos',
      planImportantTasksGoodMood: 'Planifica tareas importantes cuando te sientas positivo',
      developShiftingStrategies: 'Desarrolla estrategias para cambiar de estados negativos',
      keepJournaling: 'Sigue escribiendo en el diario para profundizar la autoconciencia',
      considerMoodBoostingActivities: 'Considera actividades que mejoren el estado de ánimo antes de las tareas',
      breakLongTermGoals: 'Divide objetivos a largo plazo en hitos más pequeños',
      celebrateHalfwayPoint: 'Celebra el progreso en el punto medio',
      reviewGoalsWeekly: 'Revisa objetivos semanalmente para mantener impulso',
      try2MinuteRule: 'Prueba la regla de 2 minutos para tareas rápidas',
      scheduleTasksImmediately: 'Programa tareas inmediatamente después de crearlas',
      setCompletionDeadlines: 'Establece fechas límite de finalización al crear tareas',
      useTimeBlocking: 'Usa bloqueo de tiempo para asegurar finalización puntual',
    },

    dashboard: {
      welcome: 'Bienvenido',
      welcomeBack: 'Bienvenido de nuevo',
      subtitle: 'Rastrea tu rendimiento de vida y continúa tu viaje de mejora.',
      assessments: 'Evaluaciones',
      totalCompleted: 'Total completadas',
      dayStreak: 'Racha de Días',
      startStreak: '¡Comienza tu racha!',
      greatStart: '¡Gran comienzo!',
      daysInRow: 'Días seguidos',
      latestScore: 'Última Puntuación',
      outOf100: 'De 100',
      percentile: 'Percentil',
      amongPeers: 'Entre pares',
      yourAssessments: 'Tus Evaluaciones',
      takeNewAssessment: 'Tomar Nueva Evaluación',
      noAssessmentsYet: 'Aún no hay evaluaciones',
      noAssessmentsDesc: 'Toma tu primera evaluación de vida para comenzar a rastrear tu rendimiento.',
      takeAssessment: 'Tomar Evaluación',
      viewResults: 'Ver Resultados',
      aiCoach: 'Entrenador IA',
      getAiCoach: 'Obtener Entrenador IA',
      viewReport: 'Ver Informe',
      deepReport: 'Informe Profundo',
      lifeAssessment: 'Evaluación de Vida',
      quickActions: 'Acciones Rápidas',
      newAssessment: 'Nueva Evaluación',
      aiCoachDashboard: 'Panel de Entrenador IA',
      upgradeToAiCoach: 'Actualizar a Entrenador IA',
      takeAssessmentUpgrade: 'Tomar Evaluación y Actualizar',
      account: 'Cuenta',
      email: 'Correo',
      plan: 'Plan',
      aiCoachPro: 'Entrenador IA Pro',
      free: 'Gratis',
      bestStreak: 'Mejor Racha',
      days: 'días',
      lastLogin: 'Último Acceso',
      youAre: 'Eres un',
      accountSettings: 'Configuración de Cuenta',
      recentActivity: 'Actividad Reciente',
      averageLoginTime: 'Hora promedio de acceso',
      needHelp: '¿Necesitas Ayuda?',
      needHelpDesc: 'Obtén soporte o aprende más sobre cómo mejorar tu puntuación de vida.',
      contactSupport: 'Contactar Soporte',
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo',
      yourTasks: 'Tus Tareas',
      viewAiCoach: 'Ver Entrenador IA',
      todaysTasks: 'Tareas de Hoy',
      thisWeeksTasks: 'Tareas de Esta Semana'
    },
    settings: {
      accountSettings: 'Configuración de Cuenta',
      profileInformation: 'Información del Perfil',
      accountName: 'Nombre de Cuenta',
      enterAccountName: 'Ingresa tu nombre de cuenta',
      accountNameDesc: 'Este nombre se mostrará en tu cuenta',
      country: 'País',
      selectCountry: 'Seleccionar País',
      gender: 'Género',
      selectGender: 'Seleccionar Género',
      male: 'Masculino',
      female: 'Femenino',
      other: 'Otro',
      preferNotToSay: 'Prefiero no decir',
      changePassword: 'Cambiar Contraseña',
      currentPassword: 'Contraseña Actual',
      enterCurrentPassword: 'Ingresa contraseña actual',
      newPassword: 'Nueva Contraseña',
      enterNewPassword: 'Ingresa nueva contraseña',
      confirmPassword: 'Confirmar Nueva Contraseña',
      confirmNewPassword: 'Confirma nueva contraseña',
      passwordFieldsDesc: 'Deja los campos de contraseña vacíos si no deseas cambiar tu contraseña',
      cancel: 'Cancelar',
      saving: 'Guardando...',
      saveChanges: 'Guardar Cambios',
      settingsUpdated: '¡Configuración actualizada exitosamente!',
      emailCannotChange: 'El correo no se puede cambiar'
    },
    countries: {
      us: 'Estados Unidos',
      uk: 'Reino Unido',
      ca: 'Canadá',
      au: 'Australia',
      de: 'Alemania',
      fr: 'Francia',
      other: 'Otro'
    },
    assessment: {
      // Basic Assessment
      lifeAssessment: 'Evaluación de Vida',
      assessmentDesc: 'Responde preguntas sobre diferentes áreas de tu vida para obtener tu puntuación general.',
      getStarted: 'Comenzar',
      question: 'Pregunta',
      of: 'de',
      next: 'Siguiente',
      previous: 'Anterior',
      submit: 'Enviar Evaluación',
      selectOption: 'Por favor selecciona una opción',
      completing: 'Completando tu evaluación...',
      almostDone: '¡Casi terminado!',
      
      // Cohort Setup
      letsGetStarted: 'Empecemos',
      basicInformation: 'Información Básica',
      basicInformationDesc: 'Primero, necesitamos información básica para compararte con tus pares.',
      age: 'Edad',
      enterYourAge: 'Ingresa tu edad',
      country: 'País',
      selectYourCountry: 'Selecciona tu país',
      gender: 'Género',
      selectGender: 'Selecciona género',
      male: 'Masculino',
      female: 'Femenino',
      other: 'Otro',
      preferNotToSay: 'Prefiero no decir',
      startAssessment: 'Iniciar Evaluación',
      informationConfidential: 'Tu información se mantiene completamente confidencial',
      
      // Questions Interface
      complete: 'Completo',
      justGettingStarted: 'Apenas comenzando...',
      makingGreatProgress: '¡Haciendo gran progreso!',
      halfwayThere: '¡Estás a mitad del camino!',
      almostFinished: '¡Casi terminado!',
      justAFewMore: '¡Solo unos pocos más!',
      back: 'Atrás',
      review: 'Revisar',
      continueToQuestions: 'Continuar a las Preguntas',
      
      // Categories
      financial: 'Financiero',
      healthFitness: 'Salud y Estado Físico',
      social: 'Social',
      romantic: 'Romántico',
      personal: 'Personal',
      career: 'Carrera',
      personalGrowth: 'Crecimiento Personal',
      
      // Category Descriptions
      financialHealthName: 'Salud Financiera',
      financialHealthIntroduction: 'Exploremos tu base financiera y el progreso en la construcción de riqueza.',
      financialHealthDescription: 'Entender tu salud financiera ayuda a identificar oportunidades para construir seguridad y riqueza.',
      physicalWellnessName: 'Bienestar Físico',
      physicalWellnessIntroduction: 'Ahora evaluemos tu salud física y tu camino hacia el estado físico.',
      physicalWellnessDescription: 'Tu bienestar físico afecta todos los aspectos de tu vida, desde la energía hasta la confianza.',
      socialNetworkName: 'Red Social',
      socialNetworkIntroduction: 'Exploremos tus relaciones y conexiones sociales.',
      socialNetworkDescription: 'Las conexiones sociales sólidas son fundamentales para la felicidad y la satisfacción en la vida.',
      romanticName: 'Romántico',
      romanticIntroduction: 'Hablemos de tu vida romántica y la satisfacción en las relaciones.',
      romanticDescription: 'Las relaciones románticas impactan significativamente en la satisfacción general de la vida y el bienestar emocional.',
      careerDevelopmentName: 'Desarrollo Profesional',
      careerDevelopmentIntroduction: 'Examinemos tu crecimiento profesional y la satisfacción en tu carrera.',
      careerDevelopmentDescription: 'El desarrollo profesional afecta la seguridad financiera, la realización personal y la dirección en la vida.',
      personalGrowthName: 'Crecimiento Personal',
      personalGrowthIntroduction: 'Finalmente, exploremos tu desarrollo personal y tu camino de auto-mejora.',
      personalGrowthDescription: 'Las actividades de crecimiento personal contribuyen a la realización a largo plazo y la mejora continua.',
      
      // Review Page
      reviewYourAssessment: 'Revisa Tu Evaluación',
      checkResponsesDesc: 'Revisa tus respuestas antes de obtener tu puntuación de vida',
      editAnswers: 'Editar Respuestas',
      getMyResults: 'Obtener Mis Resultados',
      
      // Category Names (for review)
      financialHealth: 'Salud Financiera',
      physicalWellness: 'Bienestar Físico',
      socialNetwork: 'Red Social',
      personalGrowthCategory: 'Crecimiento Personal',
      careerDevelopment: 'Desarrollo Profesional'
    },
    scorecard: {
      yourResults: 'Tus Resultados',
      overallScore: 'Puntuación General',
      percentileRank: 'Rango Percentil',
      categoryBreakdown: 'Desglose por Categorías',
      getAiCoach: 'Obtener Entrenador IA',
      getDeepReport: 'Obtener Informe Profundo',
      shareResults: 'Compartir Resultados',
      takeAnother: 'Tomar Otra Evaluación',
      loading: 'Cargando tus resultados...'
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Cerrar',
      edit: 'Editar',
      delete: 'Eliminar',
      confirm: 'Confirmar',
      back: 'Atrás',
      continue: 'Continuar',
      finish: 'Finalizar',
      yes: 'Sí',
      no: 'No',
      today: 'Hoy',
      yesterday: 'Ayer',
      thisWeek: 'Esta Semana',
      lastWeek: 'Semana Pasada',
      language: 'Idioma',
      overdue: 'Vencido',
      completeNow: 'Completar Ahora'
    },
    about: {
      backToHome: 'Volver al Inicio',
      aboutRankMe: 'Acerca de RankMe',
      aboutSubtitle: 'Creemos que todos merecen entender dónde se encuentran y cómo mejorar. RankMe proporciona información basada en datos sobre tu rendimiento de vida en las dimensiones que más importan.',
      ourMission: 'Nuestra Misión',
      ourMissionDesc: 'Democratizar el acceso a la evaluación integral de la vida y estrategias de mejora personalizadas, ayudando a millones de personas a lograr mejores resultados en todas las áreas de la vida.',
      whatMakesUsDifferent: 'Lo Que Nos Hace Diferentes',
      whatMakesUsDesc: 'A diferencia de la autoayuda genérica o las soluciones universales, RankMe proporciona información personalizada y basada en datos según tu situación única y comparaciones con pares.',
      evidenceBased: 'Basado en Evidencia',
      evidenceBasedDesc: 'Nuestra evaluación se basa en investigación psicológica y está validada en miles de usuarios. Cada recomendación está respaldada por datos, no por opinión.',
      peerCalibrated: 'Calibrado por Pares',
      peerCalibratedDesc: 'Tus resultados se comparan con personas similares a ti en edad, antecedentes y circunstancias. Ve dónde realmente te encuentras, no dónde crees que estás.',
      aiPowered: 'Impulsado por IA',
      aiPoweredDesc: 'Nuestro sistema de coaching de IA se adapta a tu progreso, proporcionando planes semanales personalizados y motivación diaria adaptada a tus objetivos y desafíos específicos.',
      fourLifeDimensions: 'Las Cuatro Dimensiones de Vida',
      fourDimensionsDesc: 'Nuestra evaluación integral cubre las áreas clave que la investigación muestra que impulsan la satisfacción de vida y el éxito a largo plazo.',
      financialHealthDim: 'Salud Financiera',
      financialHealthDimDesc: 'Ingresos, ahorros, inversiones y planificación financiera en 8 métricas clave',
      physicalWellnessDim: 'Bienestar Físico',
      physicalWellnessDimDesc: 'Fitness, nutrición, sueño y hábitos de salud general en 8 dimensiones',
      socialNetworkDim: 'Red Social',
      socialNetworkDimDesc: 'Relaciones, conexiones sociales y calidad de la red en 8 factores',
      personalGrowthDim: 'Crecimiento Personal',
      personalGrowthDimDesc: 'Satisfacción profesional, objetivos, aprendizaje y realización de vida en 8 áreas',
      ourApproach: 'Nuestro Enfoque',
      comprehensiveAssessmentStep: 'Evaluación Integral',
      comprehensiveAssessmentDesc: 'Nuestra evaluación de 32 preguntas cubre todas las principales dimensiones de la vida. A diferencia de las encuestas superficiales, profundizamos en los comportamientos específicos y circunstancias que impulsan resultados.',
      dataDrivenInsights: 'Información Basada en Datos',
      dataDrivenInsightsDesc: 'Tus respuestas son analizadas contra nuestra base de datos de más de 10,000 evaluaciones, proporcionando rankings percentiles precisos e identificando tus principales fortalezas y oportunidades.',
      personalizedActionPlans: 'Planes de Acción Personalizados',
      personalizedActionPlansDesc: 'Basado en tus resultados específicos, generamos planes de acción personalizados de 30 días con pasos priorizados que entregan el mayor impacto para tu situación única.',
      ongoingSupport: 'Soporte Continuo',
      ongoingSupportDesc: 'Nuestro sistema de coaching de IA proporciona check-ins diarios, actualizaciones de planes semanales y motivación continua para ayudarte a mantenerte en el camino y lograr un cambio duradero.',
      privacySecurityFirst: 'Privacidad y Seguridad Primero',
      privacySecurityDesc: 'Tu información personal y resultados de evaluación son tratados con el más alto nivel de seguridad y privacidad.',
      noDataSelling: 'No Vendemos Datos',
      noDataSellingDesc: 'Nunca vendemos tu información personal o resultados de evaluación a terceros. Tus datos son tuyos.',
      encryptedStorage: 'Almacenamiento Encriptado',
      encryptedStorageDesc: 'Todos los datos están encriptados tanto en tránsito como en reposo usando protocolos de seguridad estándar de la industria.',
      anonymousAnalytics: 'Analíticas Anónimas',
      anonymousAnalyticsDesc: 'Cuando usamos datos para investigación, están completamente anonimizados sin identificadores personales.',
      trustedByThousands: 'Confianza de Miles',
      trustedDesc: 'Únete a la creciente comunidad de personas que usan información basada en datos para mejorar sus vidas',
      assessmentsCompleted: 'Evaluaciones Completadas',
      averageUserRating: 'Calificación Promedio del Usuario',
      dataPointsAnalyzed: 'Puntos de Datos Analizados',
      readyToGetStarted: '¿Listo para Comenzar?',
      takeFirstStep: 'Da el primer paso hacia una mejor vida con nuestra evaluación integral.',
      takeAssessment: 'Tomar Evaluación Gratuita'
    },
    pricing: {
      // Header
      backToHome: 'Volver al Inicio',
      pageTitle: 'Elige Tu Camino al Crecimiento',
      pageSubtitle: 'Ya sea que quieras conocimientos profundos o apoyo continuo de coaching, tenemos la opción perfecta para ayudarte a mejorar tu rendimiento de vida.',
      
      // Billing Cycle
      monthly: 'Mensual',
      yearly: 'Anual (Ahorra 25%)',
      
      // Free Assessment Plan
      freeAssessment: 'Evaluación Gratuita',
      freeAssessmentDesc: 'Perfecto para empezar',
      freePrice: '$0',
      alwaysFree: 'Siempre gratis',
      freeFeature1: 'Evaluación completa de 32 preguntas',
      freeFeature2: 'Rankings percentiles básicos',
      freeFeature3: 'Desglose de rendimiento por categorías',
      freeFeature4: 'Principales fortalezas y oportunidades',
      startFreeAssessment: 'Comenzar Evaluación Gratuita',
      
      // Deep Report Plan
      mostPopular: 'MÁS POPULAR',
      deepAnalysisReport: 'Informe de Análisis Profundo',
      deepAnalysisDesc: 'Conocimientos integrales y plan de acción',
      deepPrice: '$29',
      oneTimePurchase: 'Compra única',
      deepFeature1: 'Todo en Evaluación Gratuita',
      deepFeature2: 'Análisis detallado por categorías',
      deepFeature3: 'Plan de acción personalizado de 30 días',
      deepFeature4: 'Comparaciones con pares',
      deepFeature5: 'Descarga profesional en PDF',
      deepFeature6: 'Garantía de devolución de 30 días',
      getDeepAnalysis: 'Obtener Análisis Profundo',
      
      // AI Coach Plan
      aiLifeCoach: 'Coach de Vida IA',
      aiCoachDesc: 'Apoyo continuo y responsabilidad',
      monthlyPrice: '$19',
      yearlyPrice: '$14',
      perMonth: 'por mes',
      billedYearly: ', facturado anualmente',
      savePerYear: 'Ahorra $60/año',
      aiCoachFeature1: 'Todo en Informe Profundo',
      aiCoachFeature2: 'Planes semanales personalizados',
      aiCoachFeature3: 'Check-ins diarios con coach IA',
      aiCoachFeature4: 'Seguimiento de progreso y análisis',
      aiCoachFeature5: 'Re-evaluaciones mensuales',
      aiCoachFeature6: 'Cancelar en cualquier momento',
      startFreeTrial: 'Comenzar Prueba Gratuita',
      sevenDaysFree: 'Primeros 7 días gratis',
      
      // Feature Comparison
      featureComparison: 'Comparación de Características',
      features: 'Características',
      free: 'Gratis',
      deepReport: 'Informe Profundo',
      aiCoach: 'Coach IA',
      feature32Question: 'Evaluación de 57 Preguntas',
      featureBasicRankings: 'Rankings Percentiles Básicos',
      featureDetailedAnalysis: 'Análisis Detallado e Insights',
      feature30DayPlan: 'Plan de 30 Días',
      featurePdfDownload: 'Descarga PDF',
      featureWeeklyPlans: 'Planes de Coaching Semanales',
      featureDailyCheckins: 'Check-ins Diarios IA',
      featureProgressTracking: 'Seguimiento de Progreso',
      
      // Trust Indicators
      thirtyDayGuarantee: 'Garantía de 30 Días',
      guaranteeDesc: '¿No estás satisfecho? Obtén un reembolso completo dentro de 30 días, sin preguntas.',
      rating: 'Calificación 4.8/5',
      ratingDesc: 'Confiado por más de 10,000 usuarios que han mejorado sus vidas con RankMe.',
      instantAccess: 'Acceso Instantáneo',
      instantAccessDesc: 'Obtén acceso inmediato a tus insights personalizados y herramientas de coaching.',
      
      // FAQ
      faqTitle: 'Preguntas Frecuentes',
      faq1Question: '¿Puedo actualizar desde la versión gratuita?',
      faq1Answer: '¡Absolutamente! Puedes comprar el Informe Profundo o comenzar una suscripción de Coach IA en cualquier momento después de completar tu evaluación gratuita.',
      faq2Question: '¿Qué incluye la prueba de 7 días?',
      faq2Answer: 'La prueba del Coach IA incluye todas las características premium: planes semanales personalizados, check-ins diarios, seguimiento de progreso y acceso ilimitado a herramientas de coaching.',
      faq3Question: '¿Qué tan precisos son los resultados?',
      faq3Answer: 'Nuestra evaluación está basada en investigación validada y calibrada contra más de 10,000 respuestas. Los resultados son tan precisos como la información que proporciones.',
      faq4Question: '¿Puedo cancelar mi suscripción en cualquier momento?',
      faq4Answer: 'Sí, puedes cancelar tu suscripción del Coach IA en cualquier momento desde la configuración de tu cuenta. Mantendrás acceso hasta que termine tu período de facturación actual.',
      faq5Question: '¿Mis datos están seguros y privados?',
      faq5Answer: 'Absolutamente. Usamos encriptación de nivel bancario y nunca vendemos tus datos personales. Lee nuestra política de privacidad para detalles completos.',
      faq6Question: '¿Qué métodos de pago aceptan?',
      faq6Answer: 'Aceptamos todas las tarjetas de crédito principales a través de Stripe, nuestro procesador de pagos seguro. Todas las transacciones están encriptadas y cumplen con PCI.',
      
      // CTA Section
      ctaTitle: '¿Listo para Transformar Tu Vida?',
      ctaSubtitle: 'Únete a miles de personas que han usado RankMe para entender sus fortalezas, identificar oportunidades y crear cambios positivos duraderos.',
      ctaStartAssessment: 'Comenzar Evaluación Gratuita',
      ctaViewSample: 'Ver Informe de Muestra'
    },
    loginPatterns: {
      earlyBird: 'Madrugador',
      nightOwl: 'Búho Nocturno',
      consistent: 'Usuario Consistente',
      weekend: 'Usuario de Fin de Semana',
      weekday: 'Usuario de Días Laborales',
      irregular: 'Usuario Irregular'
    }
  },
  fr: {
    header: {
      title: 'RankMe',
      signOut: 'Se Déconnecter'
    },
    home: {
      title: 'RankMe',
      beta: 'BÊTA',
      heroTitle1: 'Découvrez Votre',
      heroTitle2: 'Performance de Vie',
      heroSubtitle: 'Obtenez des informations complètes sur votre performance de vie dans les dimensions financières, de santé, sociales et personnelles.',
      noSignupRequired: 'Aucune inscription requise • 5-10 minutes • Résultats instantanés',
      getStarted: 'Commencer',
      newAssessment: 'Nouvelle Évaluation',
      start: 'Démarrer',
      startYourAssessment: 'Commencez Votre Évaluation',
      fourKeyDimensions: 'Quatre Dimensions Clés de Vie',
      assessmentEvaluatesDesc: 'Notre évaluation mesure votre performance dans les domaines les plus importants de la vie',
      financialHealth: 'Santé Financière',
      financialHealthDesc: 'Analyse des revenus, épargne et investissements',
      physicalWellness: 'Bien-être Physique',
      physicalWellnessDesc: 'Métriques de fitness, santé et style de vie',
      socialNetwork: 'Réseau Social',
      socialNetworkDesc: 'Relations et connexions communautaires',
      personalGrowth: 'Croissance Personnelle',
      personalGrowthDesc: 'Développement et satisfaction de vie',
      whatYoullGet: 'Ce Que Vous Obtiendrez',
      comprehensiveAssessment: 'Évaluation complète de 32 questions',
      instantRankings: 'Classements percentiles instantanés vs pairs',
      professionalScorecard: 'Analyse professionnelle de carte de score',
      personalizedInsights: 'Perspectives d\'amélioration personnalisées',
      premiumFeatures: 'Fonctionnalités Premium',
      freeAssessment: 'Évaluation Gratuite',
      freeAssessmentDesc: 'Notation de base et percentiles',
      deepAnalysis: 'Analyse Approfondie',
      deepAnalysisDesc: 'Insights détaillés + plan d\'action',
      aiLifeCoach: 'Coach de Vie IA',
      aiLifeCoachDesc: 'Coaching personnalisé + suivi des progrès',
      yourPrivacyMatters: 'Votre Confidentialité Compte',
      privacyDescription: 'Toutes les évaluations sont complètement anonymes par défaut. Vos données sont chiffrées et ne sont jamais partagées sans votre consentement explicite.',
      instantResults: 'Résultats Instantanés',
      privacyFirst: 'Confidentialité d\'Abord',
      noSpam: 'Pas de Spam',
      readyToDiscover: 'Prêt à Découvrir Votre Score ?',
      joinThousands: 'Rejoignez les milliers qui ont déjà évalué leur vie et commencé à s\'améliorer.',
      assessmentsTaken: 'Évaluations Effectuées',
      userRating: 'Note des Utilisateurs',
      completionRate: 'Taux de Completion',
      about: 'À Propos',
      pricing: 'Tarifs',
      dashboard: 'Tableau de Bord',
      signIn: 'Se Connecter',
      tryFree: 'Essayer l\'Évaluation Gratuite',
      platformDesc: 'Plateforme professionnelle d\'évaluation de vie',
      privacy: 'Confidentialité',
      terms: 'Conditions',
      contact: 'Contact',
      copyright: '© 2024 RankMe. Tous droits réservés.'
    },
    scorecard: {
      yourResults: 'Vos Résultats',
      backToDashboard: 'Retour au Tableau de Bord',
      overallScore: 'Score Global',
      percentileRank: 'Rang Percentile',
      categoryBreakdown: 'Répartition par Catégorie',
      getAiCoach: 'Obtenir Coach IA',
      getDeepReport: 'Obtenir Rapport Profond',
      shareResults: 'Partager les Résultats',
      takeAnother: 'Prendre Une Autre Évaluation',
      loading: 'Chargement...',
      loadingResults: 'Chargement de vos résultats...',
      scoreNotFound: 'Données de score non trouvées',
      backToHome: 'Retour à l\'Accueil',
      financialHealth: 'Santé Financière',
      physicalWellness: 'Bien-être Physique',
      socialNetwork: 'Réseau Social',
      personalGrowth: 'Croissance Personnelle',
      excellent: 'Excellent',
      exceptional: 'Exceptionnel',
      good: 'Bon',
      average: 'Moyen',
      needsImprovement: 'Besoin d\'Amélioration',
      romantic: 'Romantique',
      career: 'Carrière',
      distribution: 'Distribution',
      sendMyResults: 'Envoyer Mes Résultats',
      deepAnalysis: 'Analyse Approfondie',
      viewDeepReport: 'Voir le Rapport Approfondi',
      emailYourResults: 'Envoyer Vos Résultats par Email',
      enterEmailAddress: 'Entrez votre adresse email',
      emailResultsDesc: 'Obtenez un email magnifiquement formaté avec vos résultats d\'évaluation complets et des insights.',
      assessmentStats: 'Statistiques d\'Évaluation',
      saveYourResults: 'Sauvegarder Vos Résultats',
      createAccountDesc: 'Créez un compte gratuit pour suivre vos progrès et accéder à vos résultats à tout moment.',
      createFreeAccount: 'Créer un Compte Gratuit',
      signInToExistingAccount: 'Se Connecter à un Compte Existant',
      scorecardDesc: 'Cette carte de score montre vos classements en percentiles. Débloquez des insights plus profonds avec nos fonctionnalités premium.',
      resultsSentSuccessfully: 'Résultats envoyés avec succès !',
      checkYourInbox: 'Vérifiez votre boîte de réception pour votre score de vie détaillé.',
      sendToAnotherEmail: 'Envoyer à un autre email',
      aiLifeCoach: 'Coach de Vie IA',
      greatJobSaveResults: 'Excellent Travail ! Sauvegardez Vos Résultats',
      createFreeAccountTo: 'Créez un compte gratuit pour :',
      trackProgressOverTime: 'Suivre vos progrès au fil du temps',
      accessResultsAnyDevice: 'Accéder à vos résultats depuis n\'importe quel appareil',
      compareImprovements: 'Comparer les améliorations entre les évaluations',
      getPersonalizedRecs: 'Obtenir des recommandations personnalisées',
      iHaveAnAccount: 'J\'ai un Compte',
      continueWithoutAccount: 'Continuer sans compte',
      downloadForStories: 'Télécharger pour Stories',
      shareLink: 'Partager le Lien',
      howToUse: 'Comment utiliser :',
      uploadToInstagram: 'Téléchargez l\'image sur votre téléphone, ouvrez Instagram et créez une nouvelle Story, téléchargez l\'image téléchargée, partagez avec vos abonnés !',
      shareWithFollowers: 'Partagez avec vos abonnés !',
      somethingWentWrong: 'Une erreur s\'est produite lors de la génération de votre image de partage.',
      scorecardShowsPercentiles: 'Cette fiche de score montre vos classements en percentiles. Débloquez des insights plus profonds avec nos fonctionnalités premium.',
      unlockDeeperInsights: 'Débloquez des insights plus profonds avec nos fonctionnalités premium.',
      accessYourReport: 'Accédez à votre rapport'
    },
    report: {
      deepLifeAnalysisReport: 'Rapport d\'Analyse Approfondie de la Vie',
      comprehensiveInsights: 'Insights complets et recommandations personnalisées',
      executiveSummary: 'Résumé Exécutif',
      overallScore: 'Score Global',
      performance: 'Performance',
      overallPerformanceDistribution: 'Distribution de Performance Globale',
      peerComparison: 'Comparaison avec les Pairs',
      peerComparisonText: 'Votre score de vie global est plus élevé que',
      categoryBreakdown: 'Répartition par Catégorie',
      strengths: 'Forces',
      opportunities: 'Opportunités',
      recommendations: 'Recommandations',
      actionPlan30Day: 'Plan d\'Action de 30 Jours',
      week: 'Semaine',
      timeCommitment: 'Engagement temporel',
      sampleReport: 'RAPPORT D\'ÉCHANTILLON',
      sampleDescription: 'Voici un échantillon de ce que vous recevrez avec notre mise à niveau d\'analyse complète',
      financialHealth: 'Santé Financière',
      healthWellness: 'Santé et Bien-être',
      socialConnections: 'Connexions Sociales',
      personalGrowth: 'Croissance Personnelle',
      score: 'Score',
      percentile: 'Percentile',
      keyStrengths: 'Forces Clés',
      growthAreas: 'Domaines de Croissance',
      performanceDistribution: 'Distribution de Performance',
      shareText: 'Découvrez mon Rapport de Vie Approfondi RankMe ! Score Global :',
      captionCopied: 'Légende copiée dans le presse-papiers !',
      backToDashboard: 'Retour au Tableau de Bord',
      reportOverview: 'Aperçu du Rapport',
      assessmentDate: 'Date d\'Évaluation',
      questionsAnalyzed: 'Questions Analysées',
      categoriesCovered: 'Catégories Couvertes',
      peerGroupSize: 'Taille du Groupe de Pairs',
      keyInsights: 'Insights Clés',
      topPerformer: 'Top Performer',
      focusArea: 'Zone de Focus',
      growthPotential: 'Potentiel de Croissance',
      shareReport: 'Partager le Rapport',
      downloadPDF: 'Télécharger le PDF',
      categoryDeepDive: 'Analyse Approfondie des Catégories',
      quickWins: 'Gains Rapides',
      wantOngoingSupport: 'Vous voulez un soutien continu ?',
      reportDataNotFound: 'Données du rapport introuvables',
      backToHome: 'Retour à l\'Accueil',
      youAreMostSimilarTo: 'Vous êtes le plus similaire aux personnes de la catégorie',
      areas: 'Zones',
      youExcelIn: 'Vous excellez en',
      biggestOpportunityIn: 'Plus grande opportunité en',
      followingActionPlanCouldImprove: 'Suivre le plan d\'action pourrait améliorer votre score global de 15-25 points',
      shareYourLifeScore: 'Partagez Votre Score de Vie',
      ofPeopleInYourDemographic: 'des personnes de votre démographie',
      thPercentile: 'e percentile',
      topPercent: 'Top',
      belowAverage: 'En dessous de la moyenne',
      aboveAverage: 'Au-dessus de la moyenne',
      bottomPercent: 'Bas',
      yourLifeScore: 'Votre Score de Vie',
      performanceBreakdown: 'Répartition des Performances',
      topStrength: 'Force Principale',
      growthArea: 'Zone de Croissance',
      questionsAnswered: 'Questions Répondues',
      completionTime: 'Temps de Complétion',
      peerGroup: 'Groupe de Pairs',
      recentActivity: 'Activité Récente',
      scoreDataNotFound: 'Données de score introuvables',
      readyToImproveYourScore: 'Prêt à Améliorer Votre Score ?',
      improveScoreDescription: 'Obtenez des perspectives personnalisées et des recommandations pratiques pour améliorer votre performance de vie.',
      exceptional: 'Exceptionnel',
      excellent: 'Excellent',
      good: 'Bon',
      fair: 'Passable',
      needsAttention: 'Nécessite de l\'Attention',
      personalizedInsights: 'Perspectives Personnalisées',
      crossCategoryPatterns: 'Modèles Inter-Catégories',
      surprisingFindings: 'Découvertes Surprenantes',
      longTermStrategy: 'Stratégie à Long Terme',
      primaryLimitingFactor: 'Facteur Limitant Principal',
      threeMonthGoals: 'Objectifs de 3 Mois',
      oneYearGoals: 'Objectifs d\'1 An',
      recommendedResources: 'Ressources Recommandées',
      primaryGrowthAreas: 'Domaines de Croissance Principaux',
      generatingDeepReport: 'Génération du rapport détaillé',
      individualQuestionAnalysis: 'Analyse Individuelle des Questions',
      yourAnswer: 'Votre Réponse: ',
      myRankMeLifeScoreDeepReport: 'Mon Rapport Détaillé de Score de Vie RankMe',
      linkCopiedToClipboard: 'Lien copié dans le presse-papiers!'
    },
    coach: {
      // Navigation & Basic
      backToDashboard: 'Retour au Tableau de Bord',
      aiCoach: 'Coach IA',
      yourCoach: 'Votre Coach',
      welcome: 'Bienvenue à votre Coach IA',
      weeklyGoals: 'Objectifs Hebdomadaires',
      dailyTasks: 'Tâches Quotidiennes',
      progress: 'Progrès',
      checkins: 'Bilans',
      achievements: 'Réalisations',
      settings: 'Paramètres',
      startWeek: 'Commencer la Semaine',
      completeTask: 'Terminer la Tâche',
      scheduleCheckin: 'Programmer un Bilan',
      viewProgress: 'Voir le Progrès',
      welcomeTitle: 'Bienvenue à Votre Coach de Vie IA ! 🎉',
      subscriptionActive: 'Votre abonnement est actif ! Configurons votre expérience de coaching personnalisée pour vous aider à atteindre vos objectifs de vie.',
      coachNotFound: 'Données du coach non trouvées',
      
      // Header & Status
      yourAiLifeCoach: 'Votre Coach de Vie IA',
      activeSubscription: 'Abonnement Actif',
      daysLeftInTrial: 'jours restants en période d\'essai',
      chatWithCoach: 'Discuter avec le Coach',
      
      // Focus Areas
      financialHealth: 'Santé Financière',
      physicalWellness: 'Bien-être Physique',
      socialNetwork: 'Réseau Social',
      personalDevelopment: 'Développement Personnel',
      otherTasks: 'Autres Tâches',
      
      // Date Navigation
      todaysGoals: 'Objectifs d\'Aujourd\'hui',
      yesterdaysGoals: 'Objectifs d\'Hier',
      tomorrowsGoals: 'Objectifs de Demain',
      goalsFor: 'Objectifs pour',
      
      // Onboarding
      letsGetYouStarted: 'Commençons',
      setYourCoachingPreferences: 'Configurez Vos Préférences de Coaching',
      chooseFocusAreaDesc: 'Choisissez votre domaine de focus, style de coaching et à quelle fréquence vous souhaitez recevoir des conseils.',
      scheduleYourCheckins: 'Programmez Vos Bilans',
      setUpCheckinsDesc: 'Configurez des bilans réguliers pour suivre vos progrès et rester motivé.',
      meetYourAiCoach: 'Rencontrez Votre Coach IA',
      firstConversationDesc: 'Ayez votre première conversation et obtenez votre plan d\'action personnalisé.',
      
      // Benefits
      personalizedGoals: 'Objectifs Personnalisés',
      personalizedGoalsDesc: 'Obtenez des plans d\'action hebdomadaires adaptés aux résultats de votre évaluation',
      twentyFourSevenSupport: 'Support 24/7',
      twentyFourSevenSupportDesc: 'Discutez avec votre coach IA à tout moment pour des conseils et de la motivation',
      trackProgress: 'Suivre les Progrès',
      trackProgressDesc: 'Voyez votre amélioration avec des analyses détaillées et des insights',
      
      // Coach Configuration
      coachConfiguration: 'Configuration du Coach',
      primaryFocus: 'Focus Principal',
      secondary: 'Secondaire',
      style: 'Style',
      motivation: 'Motivation',
      focusArea: 'Domaine de Focus',
      coachingStyle: 'Style de Coaching',
      taskFrequency: 'Fréquence des Tâches',
      motivationLevel: 'Niveau de Motivation',
      assessmentSpecificSettings: 'Paramètres spécifiques à l\'évaluation',
      difficulty: 'difficulté',
      
      // Coach Styles & Options
      supportive: 'Bienveillant',
      analytical: 'Analytique',
      direct: 'Direct',
      encouraging: 'Encourageant',
      gentle: 'Doux',
      balanced: 'Équilibré',
      intense: 'Intense',
      easy: 'Facile',
      moderate: 'Modéré',
      challenging: 'Difficile',
      financial: 'Financier',
      health: 'Santé',
      social: 'Social',
      personal: 'Personnel',
      none: 'Aucun',
      daily: 'quotidiennes',
      weekly: 'hebdomadaires',
      
      // Progress
      yourProgress: 'Vos Progrès',
      lastUpdated: 'Dernière mise à jour',
      dayStreak: 'Série de Jours',
      completionRate: 'Taux de Completion',
      currentScore: 'Score Actuel',
      pointsImproved: 'Points Améliorés',
      sinceYouStarted: 'Depuis que vous avez commencé',
      onFire: '🔥 En feu !',
      keepGoing: 'Continuez !',
      completed: 'terminées',
      percentile: 'percentile',
      
      // Daily Progress
      dailyProgressByDay: 'Progrès Quotidien par Jour',
      pastDays: 'Jours passés',
      today: 'Aujourd\'hui',
      future: 'Futur',
      combinedWeeklyProgress: 'Progrès Hebdomadaire Combiné',
      allTasksForThisWeek: 'Toutes les tâches pour cette semaine',
      weeklyTasks: 'Tâches Hebdomadaires',
      dailyGoals: 'Objectifs Quotidiens',
      
      // Task Management
      weeklyTasksForWeek: 'Tâches Hebdomadaires pour la Semaine',
      expandAll: 'Tout Développer',
      collapseAll: 'Tout Réduire',
      expandTasks: 'Développer les tâches',
      collapseTasks: 'Réduire les tâches',
      deleteTask: 'Supprimer la tâche',
      showCompleted: 'Afficher Terminées',
      hideCompleted: 'Masquer Terminées',
      clickShowCompletedToView: 'Cliquez sur "Afficher Terminées" pour voir les détails',
      noGoalsSetForToday: 'Aucun objectif fixé pour aujourd\'hui',
      noGoalsPlanned: 'Aucun objectif planifié pour',
      noGoalsWereSet: 'Aucun objectif n\'a été fixé pour',
      deleteGoal: 'Supprimer l\'objectif',
      yesterday: 'Hier',
      goToToday: 'Aller à Aujourd\'hui',
      tomorrow: 'Demain',
      
      // Chat Interface
      quickSuggestions: 'Suggestions Rapides',
      howCanIImprove: 'Comment puis-je améliorer mon domaine le plus faible ?',
      whatShouldIFocus: 'Sur quoi devrais-je me concentrer cette semaine ?',
      feelingStuck: 'Je me sens bloqué. Des conseils ?',
      typeYourMessage: 'Tapez votre message...',
      troubleConnecting: 'J\'ai des problèmes de connexion en ce moment. Veuillez réessayer dans un moment.',
      
      // Journal
      reflectOnYourDay: 'Réfléchissez à Votre Journée',
      journalPrompt: 'Question de Journal',
      journalPlaceholder: 'Prenez un moment pour réfléchir à votre journée, vos progrès, défis et insights...',
      
      // Goals Management
      yourGoals: 'Vos Objectifs',
      addNewGoal: 'Ajouter Nouvel Objectif',
      goalCategory: 'Catégorie d\'Objectif',
      goalTitle: 'Titre de l\'Objectif',
      goalDescription: 'Description de l\'Objectif',
      goalTarget: 'Cible de l\'Objectif',
      goalDeadline: 'Date Limite de l\'Objectif',
      goalDescriptionPlaceholder: 'Décrivez votre objectif et pourquoi il est important pour vous...',
      createGoal: 'Créer l\'Objectif',
      
      // Settings Modal
      accountSettings: 'Paramètres du Compte',
      notifications: 'Notifications',
      dailyReminders: 'Rappels Quotidiens',
      weeklyReports: 'Rapports Hebdomadaires',
      reminderTime: 'Heure de Rappel',
      goalFrequency: 'Fréquence des Objectifs',
      
      // Alerts & Messages
      taskCreatedSuccessfully: 'Tâche créée avec succès !',
      failedToCreateTask: 'Échec de la création de la tâche. Veuillez réessayer.',
      journalEntrySaved: 'Entrée de journal sauvegardée ! Vos pensées ont été enregistrées.',
      journalEntryError: 'Erreur lors de la sauvegarde de l\'entrée de journal. Veuillez réessayer.',
      checkInCompleted: 'Bilan terminé avec succès !',
      checkInFailed: 'Échec du bilan. Veuillez réessayer.',
      preferencesError: 'Échec de la sauvegarde des préférences. Veuillez réessayer.',
      checkInsSetupFailed: 'Échec de la configuration des bilans',
      coachingDataError: 'Échec de la génération des données de coaching',
      goalCreated: 'Objectif créé avec succès ! Continuez à travailler pour l\'atteindre.',
      settingsSaved: 'Paramètres sauvegardés avec succès ! Vos préférences ont été mises à jour.',
      settingsError: 'Erreur lors de la sauvegarde des paramètres. Veuillez réessayer.',
      
      // Task Creator
      createTask: 'Créer une Tâche',
      taskTitle: 'Titre de la Tâche',
      taskDescription: 'Description de la Tâche',
      category: 'Catégorie',
      estimatedTime: 'Temps Estimé',
      date: 'Date',
      creating: 'Création...',
      enterTaskTitle: 'Entrez le titre de la tâche...',
      describeTheTask: 'Décrivez la tâche...',
      
      // Journal Questions
      financialJournalPrompt: '',
      healthJournalPrompt: '',
      socialJournalPrompt: '',
      personalJournalPrompt: '',
      
      // Additional UI strings
      startYourStreakToday: 'Commencez votre série aujourd\'hui !',
      upcomingCheckIns: 'Bilans à Venir',
      quickActions: 'Actions Rapides',
      needHelp: 'Besoin d\'Aide ?',
      questionsAboutCoaching: 'Des questions sur votre plan de coaching ou vos progrès ? Nous sommes là pour vous aider.',
      noWeeklyTasksCompleted: 'Aucune tâche hebdomadaire complétée pour le moment',
      noDailyGoalsCompleted: 'Aucun objectif quotidien complété pour le moment',
      totalTasksCompleted: 'tâches complétées au total',
      clickShowCompletedDetails: 'Cliquez sur "Afficher Complétées" pour voir les détails',
      failedToUpdateTask: 'Échec de la mise à jour de la tâche. Veuillez réessayer.',
      failedToDeleteTask: 'Échec de la suppression de la tâche. Veuillez réessayer.',
      failedToSavePreferences: 'Échec de l\'enregistrement des préférences. Veuillez réessayer.',
      checkInCompletedSuccess: 'Bilan complété avec succès !',
      failedToCompleteCheckIn: 'Échec de la complétion du bilan. Veuillez réessayer.',
      failedToSetupCheckIns: 'Échec de la configuration des bilans',
      failedToGenerateCoaching: 'Échec de la génération des données de coaching',
      goalCreatedSuccess: 'Objectif créé avec succès ! Continuez à travailler vers celui-ci.',
      settingsSavedSuccess: 'Paramètres enregistrés avec succès ! Vos préférences ont été mises à jour.',
      errorSavingSettings: 'Erreur lors de l\'enregistrement des paramètres. Veuillez réessayer.',
      errorCreatingTask: 'Erreur lors de la création de la tâche',
      allFocusAreas: 'Tous les Domaines de Focus',
      completedTasksCount: 'complétées',
      combinesAllTasks: 'Combine toutes les tâches hebdomadaires + objectifs quotidiens de toute la semaine',
      pastDays: 'Jours passés',
      todayText: 'Aujourd\'hui',
      futureText: 'Futur',
      minutes: 'min',
      contactSupport: 'Contacter le Support',
      noCheckInsScheduled: 'Aucun bilan programmé',
      deleteGoal: 'Supprimer l\'objectif',
      addNewGoal: 'Ajouter un nouvel objectif',
      completedTasks: 'Tâches Terminées',
      totalTasksCompletedThis: 'tâches terminées au total',
      clickShowCompleted: 'Cliquez sur "Afficher Terminées" pour voir les détails',
      showCompleted: 'Afficher Terminées',
      hideCompleted: 'Masquer Terminées',
      noGoalsSetToday: 'Aucun objectif défini pour aujourd\'hui',
      editSchedule: 'Modifier le Calendrier',
      completeNow: 'Terminer Maintenant',
      overdue: 'En Retard',
      checkInType: 'Bilan',
      setUpCheckIns: 'Configurer les Bilans',
      setUpCheckInsTitle: 'Configurer les Bilans',
      continueSetup: 'Continuer la Configuration',
      frequencyDaily: 'Quotidien',
      frequencyWeekly: 'Hebdomadaire',
      frequencyBiweekly: 'Bimensuel',
      frequencyMonthly: 'Mensuel',
      frequencyMultipleDaily: 'Plusieurs Fois par Jour',
      dailyDescription: 'Une fois par jour',
      weeklyDescription: 'Jours spécifiques',
      biweeklyDescription: 'Toutes les 2 semaines',
      monthlyDescription: 'Une fois par mois',
      multipleDailyDescription: 'Plusieurs fois par jour',
      at: 'à',
      howOften: 'À quelle fréquence ?',
      whenLabel: 'Quand ?',
      times: 'Heures',
      timeLabel: 'Heure',
      daysLabel: 'Jours',
      addTime: 'Ajouter heure',
      hideAdvanced: 'Masquer',
      showAdvanced: 'Afficher',
      reminder: 'Rappel',
      schedule: 'Horaire :',
      reminderMinBefore: 'min avant',
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche',
      mon: 'Lun',
      tue: 'Mar',
      wed: 'Mer',
      thu: 'Jeu',
      fri: 'Ven',
      sat: 'Sam',
      sun: 'Dim',
      morning: 'Matin',
      afternoon: 'Après-midi',
      evening: 'Soir',
      createNewTask: 'Créer Nouvelle Tâche',
      createDailyGoal: 'Créer Objectif Quotidien',
      howCanIImprove: 'Comment puis-je améliorer mon score de vie ?',
      whatShouldIFocus: 'Sur quoi devrais-je me concentrer cette semaine ?',
      feelingStuck: 'Je me sens bloqué, que dois-je faire ?',
      typeMessage: 'Tapez votre message...',
      sendMessage: 'Envoyer',
      expandTasks: 'Développer les tâches',
      collapseTasks: 'Réduire les tâches',
      workOnAllAreas: 'Travaillez sur tous les domaines de votre vie simultanément',
      expandAll: 'Tout Développer',
      collapseAll: 'Tout Réduire',
      
      // Modal translations
      createWeeklyTasks: 'Créer des Tâches Hebdomadaires',
      weekOf: 'Semaine de',
      taskNumber: 'Tâche',
      category: 'Catégorie',
      taskTitle: 'Titre de la Tâche',
      taskTitleRequired: 'Titre de la Tâche *',
      description: 'Description',
      descriptionRequired: 'Description *',
      addTask: 'Ajouter une Tâche',
      saveTasks: 'Sauvegarder les Tâches',
      cancel: 'Annuler',
      financialHealth: 'Santé Financière',
      physicalWellness: 'Bien-être Physique',
      socialConnection: 'Connexion Sociale',
      personalDevelopment: 'Développement Personnel',
      other: 'Autre',
      createDailyTask: 'Créer une Tâche Quotidienne',
      priority: 'Priorité',
      date: 'Date',
      estimatedMinutes: 'Min. Estimées',
      optional: 'Optionnel',
      high: 'Élevé',
      medium: 'Moyen',
      low: 'Faible',
      
      // Contact Support Modal
      howCanWeHelp: 'Comment pouvons-nous vous aider ?',
      subject: 'Sujet',
      message: 'Message',
      weWillRespondTo: 'Nous répondrons à :',
      generalQuestion: 'Question Générale',
      technicalIssue: 'Problème Technique',
      feedback: 'Retour d\'information',
      featureRequest: 'Demande de Fonctionnalité',
      
      // Progress indicators
      complete: 'Terminé',
      noDailyGoalsCompleted: 'Aucun objectif quotidien terminé pour le moment',
      overallProgress: 'Progrès Global',
      combined: 'Combiné',
      totalTasksCompletedThisWeek: 'Tâches Terminées Cette Semaine',
      hideCompleted: 'Masquer les Terminées',
      showCompleted: 'Afficher les Terminées',
      
      // Additional translations for remaining elements
      weeklyTasks: 'Tâches Hebdomadaires',
      dailyGoalsToday: 'Objectifs Quotidiens Aujourd\'hui',
      week: 'Semaine',
      dailyGoals: 'Objectifs Quotidiens',
      createYourFirstGoal: 'Créez votre premier objectif',
      needHelp: 'Besoin d\'aide ?',
      questionsAboutCoachingPlan: 'Des questions sur votre plan de coaching ou votre progrès ? Nous sommes là pour vous aider.',
      contactSupport: 'Contacter le Support',
      addTask: 'Ajouter une Tâche',
      taskTitle: 'Titre de la Tâche',
      descriptionOptional: 'Description (Optionnel)',
      category: 'Catégorie',
      priority: 'Priorité',
      date: 'Date',
      estMinutes: 'Min. Estimées',
      createDailyTask: 'Créer une Tâche Quotidienne',
      
      // CoachPreferenceSetup component - Setup Process
      setupProgress: 'Progrès de Configuration',
      step: 'Étape',
      of: 'sur',
      stepOf: 'Étape ${step} sur ${total}',
      welcomeToAICoach: 'Bienvenue dans votre Coach de Vie IA !',
      letsPersonalize: 'Personnalisons votre expérience',
      personalizeExperience: 'Personnalisons votre expérience. Sur quel domaine aimeriez-vous vous concentrer ?',
      whatAreaFocus: 'Sur quel domaine aimeriez-vous vous concentrer ?',
      primaryFocusArea: 'Domaine de Focus Principal',
      secondaryFocusArea: 'Domaine de Focus Secondaire',
      secondaryFocusOptional: 'Domaine de Focus Secondaire (Optionnel)',
      
      // Focus Areas
      financialHealth: 'Santé Financière',
      physicalHealth: 'Santé Physique', 
      socialLife: 'Vie Sociale',
      personalGrowth: 'Croissance Personnelle',
      budgetManagementWealth: 'Gestion budgétaire et création de richesse',
      fitnessNutritionWellness: 'Fitness, nutrition et habitudes de bien-être',
      relationshipsSocial: 'Relations et connexions sociales',
      selfImprovementSkills: 'Auto-amélioration et développement des compétences',
      financialHealthDesc: 'Gestion budgétaire et création de richesse',
      physicalHealthDesc: 'Fitness, nutrition et habitudes de bien-être',
      socialLifeDesc: 'Relations et connexions sociales',
      personalGrowthDesc: 'Auto-amélioration et développement des compétences',
      
      // Task Preferences
      taskPreferences: 'Préférences de Tâches',
      howManyTasks: 'Sur combien de tâches aimeriez-vous travailler ?',
      dailyTasksCount: 'Tâches Quotidiennes : ${count}',
      weeklyTasksCount: 'Tâches Hebdomadaires : ${count}',
      taskDifficulty: 'Difficulté des Tâches',
      oneTask: '1 tâche',
      tasksRecommended: '3 tâches (recommandé)',
      threeTasksRecommended: '3 tâches (recommandé)',
      twoThreeRecommended: '2-3 (recommandé)',
      fiveTasks: '5 tâches',
      noWeeklyTasks: 'Aucune tâche hebdomadaire',
      recommendedTasks: '2-3 (recommandé)',
      easy: 'Facile',
      moderate: 'Modéré', 
      challenging: 'Difficile',
      specificGoalsChallenges: 'Objectifs ou Défis Spécifiques (Optionnel)',
      specificGoalsPlaceholder: 'Ex., \'Je veux économiser 5000$ cette année\' ou \'J\'ai besoin d\'aide pour budgéter et réduire les dettes\'',
      
      // Coaching Style
      coachingStyle: 'Style de Coaching',
      howInteractWithYou: 'Comment aimeriez-vous que j\'interagisse avec vous ?',
      howToInteract: 'Comment aimeriez-vous que j\'interagisse avec vous ?',
      coachingApproach: 'Approche de Coaching',
      supportive: 'Solidaire',
      direct: 'Direct',
      motivational: 'Motivationnel',
      analytical: 'Analytique',
      supportiveDesc: 'Encouragement doux et guidance empathique',
      directDesc: 'Coaching direct et orienté action',
      motivationalDesc: 'Approche inspirante et haute énergie',
      analyticalDesc: 'Guidance logique basée sur les données',
      motivationLevel: 'Niveau de Motivation',
      gentle: 'Doux',
      balanced: 'Équilibré',
      intense: 'Intense',
      softEncouragement: 'Encouragement doux',
      mixedApproach: 'Approche mixte',
      pushMeHard: 'Poussez-moi fort',
      gentleDesc: 'Encouragement doux',
      balancedDesc: 'Approche mixte',
      intenseDesc: 'Poussez-moi fort',
      
      // Check-in Preferences
      checkinPreferences: 'Préférences de Check-in',
      howOftenCheckin: 'À quelle fréquence aimeriez-vous vérifier votre progrès ?',
      howOftenCheckIn: 'À quelle fréquence aimeriez-vous vérifier votre progrès ?',
      checkinFrequency: 'Fréquence de Check-in',
      preferredCheckinTime: 'Heure Préférée de Check-in',
      daily: 'Quotidien',
      weekly: 'Hebdomadaire',
      biweekly: 'Bihebdomadaire',
      youreAllSet: 'Vous êtes prêt !',
      preferencesWillBeSaved: 'Vos préférences seront sauvegardées et utilisées pour personnaliser votre expérience de coaching. Vous pouvez toujours mettre à jour ces paramètres plus tard.',
      completeSetup: 'Terminer la Configuration',
      saving: 'Sauvegarde...',
      
      // Journal & Reflection
      dailyJournal: 'Journal Personnel',
      reflectOnTodaysProgress: 'Réfléchissez sur les progrès d\'aujourd\'hui',
      todaysReflection: 'Réflexion d\'Aujourd\'hui',
      yourThoughts: 'Vos Pensées',
      charactersCount: '${count} caractères',
      journalingTips: '💡 Conseils de Journal',
      beHonestAuthentic: '• Soyez honnête et authentique avec vos pensées',
      focusSpecificExamples: '• Concentrez-vous sur des exemples et expériences spécifiques',
      considerWhatLearned: '• Considérez ce que vous avez appris et comment vous pouvez vous améliorer',
      celebrateSmallWins: '• Célébrez les petites victoires et les progrès réalisés',
      
      // Personal Goals
      personalGoals: 'Objectifs Personnels',
      setTrackObjectives: 'Définissez et suivez vos objectifs',
      setAndTrackObjectives: 'Définissez et suivez vos objectifs',
      yourCurrentGoals: 'Vos Objectifs Actuels',
      noGoalsSetYet: 'Aucun objectif défini pour le moment',
      addNewGoal: 'Ajouter un nouvel objectif',
      goalTitle: 'Titre de l\'Objectif',
      targetOptional: 'Cible (optionnel)',
      deadlineOptional: 'Échéance (optionnel)',
      
      // Settings Display Labels
      focusArea: 'Domaine de Focus',
      secondary: 'Secondaire:',
      taskFrequency: 'Fréquence des Tâches',
      assessmentSpecificSettings: 'Paramètres spécifiques à l\'évaluation',
      moderateDifficulty: 'difficulté modérée',
      personal: 'personnel',
      social: 'social',
      coachingStyleLabel: 'Style de Coaching',
      motivationLevel: 'Niveau de Motivation',
      daily: 'quotidien',
      weekly: 'hebdomadaire',
      difficulty: 'difficulté',
      
      // Navigation & Actions
      back: 'Retour',
      next: 'Suivant',
      
      // Form Validation & Placeholders
      enterFullName: 'Entrez votre nom complet',
      enterEmail: 'Entrez votre email',
      createPassword: 'Créez un mot de passe',
      confirmPassword: 'Confirmez votre mot de passe',
      yourName: 'Votre nom',
      
      // Additional UI Elements
      createTasks: '+ Créer des Tâches',
      setNewGoals: 'Définir de Nouveaux Objectifs',
      hereToHelpGrow: 'Ici pour vous aider à grandir',
      startAConversation: 'Démarrer une conversation',
      askMeAboutProgress: 'Demandez-moi au sujet de vos progrès, objectifs ou tout ce qui concerne votre développement personnel.',
      coachCapabilitiesTitle: 'Votre Coach de Vie IA',
      coachCapabilitiesSubtitle: 'Je suis là pour vous aider à grandir et atteindre vos objectifs. Voici ce que je peux faire :',
      taskManagement: 'Gestion des Tâches',
      taskManagementDesc: 'Créer des tâches quotidiennes et hebdomadaires, définir des rappels et suivre les progrès',
      progressTracking: 'Suivi des Progrès',
      progressTrackingDesc: 'Surveiller votre développement dans tous les domaines de la vie et célébrer les victoires',
      personalizedAdvice: 'Conseils Personnalisés',
      personalizedAdviceDesc: 'Obtenir des conseils sur mesure basés sur vos résultats d\'évaluation et objectifs',
      goalSetting: 'Définition d\'Objectifs',
      goalSettingDesc: 'Définir des objectifs significatifs et créer des plans d\'action pour les atteindre',
      exampleQuestions: 'Essayez de me demander :',
      viewFullReport: 'Voir le Rapport Complet',
      deepAnalysisInsights: 'Analyse approfondie et perspectives',
      viewJournalEntries: 'Voir les Entrées du Journal',
      readPastReflections: 'Lisez vos réflexions passées',
      noJournalEntries: 'Aucune entrée de journal pour le moment',
      journalEntriesTitle: 'Entrées du Journal',
      journalEntriesSubtitle: 'Vos réflexions et pensées',
      briefDescription: 'Brève description de votre problème ou question',
      message: 'Message',
      pleaseProvideDetails: 'Veuillez fournir autant de détails que possible...',
      updateYourObjectives: 'Mettre à jour vos objectifs',
      categorySelection: 'Sélection de catégorie',
      noGoalsSetYet: 'Aucun objectif défini encore',
      category: 'Catégorie',
      goalTitle: 'Titre de l\'Objectif',
      descriptionOptional: 'Description (optionnelle)',
      targetOptional: 'Cible (optionnelle)',
      deadlineOptional: 'Date limite (optionnelle)',
      journalingTips: '💡 Conseils de Journal',
      beHonestAuthentic: 'Soyez honnête et authentique avec vos pensées',
      focusOnSpecificExamples: 'Concentrez-vous sur des exemples et expériences spécifiques',
      considerWhatYouLearned: 'Réfléchissez à ce que vous avez appris et comment vous pouvez vous améliorer',
      celebrateSmallWins: 'Célébrez les petites victoires et les progrès accomplis',
      reflectOnProgress: 'Réfléchissez sur vos progrès et célébrez les victoires',
      selectCategory: 'Sélectionner une catégorie',
      goalTitlePlaceholder: 'ex., Économiser 5 000 $ pour un fonds d\'urgence',
      goalDescriptionPlaceholder: 'Décrivez votre objectif et pourquoi il est important pour vous...',
      goalTargetPlaceholder: 'ex., 5 000 $, 10 livres, 30 minutes par jour',
      taskTitlePlaceholder: 'Entrez le titre de la tâche...',
      taskDescriptionPlaceholder: 'Décrivez la tâche...',
      
      // Journal & Buttons
      takeAMomentToReflect: 'Prenez un moment pour réfléchir sur votre journée, vos progrès, défis et perspectives',
      cancel: 'Annuler',
      saveEntry: 'Sauvegarder l\'Entrée',
      createGoal: 'Créer un Objectif',
      weekNumber: 'Semaine',
      dailyCheckIn: 'Check-in Quotidien',
      
      // Configuration Display
      moderateDifficulty: 'difficulté modérée'
    },

    // Aperçus Prédictifs
    insights: {
      // En-têtes des Composants Principaux
      aiPredictiveInsights: 'Aperçus Prédictifs IA',
      aiInsights: 'Aperçus IA',
      quickInsights: 'Aperçus IA',
      
      // Texte Descriptif
      insightsBasedOnAssessment: 'Aperçus basés sur vos réponses d\'évaluation et interactions de coaching',
      insightsBasedOnAllAssessments: 'Aperçus basés sur toutes vos évaluations et interactions de coaching',
      analyzingPatterns: 'Analyse de vos modèles...',
      gatheringData: 'Collecte de données pour générer des aperçus personnalisés...',
      noMoreInsights: 'Plus d\'aperçus à afficher. Revenez plus tard pour de nouvelles prédictions !',
      checkBackLater: 'Revenez plus tard pour de nouvelles prédictions !',
      
      // Étiquettes de Types d\'Aperçus
      riskAlert: 'Alerte de Risque',
      patternForecast: 'Prévision de Modèle',
      smartRecommendation: 'Recommandation Intelligente',
      strategicTiming: 'Timing Stratégique',
      deepInsights: 'Aperçus Profonds',
      
      // Descriptions des Types d\'Aperçus
      riskAlertDesc: 'Défis potentiels à venir',
      patternForecastDesc: 'Vos modèles comportementaux',
      smartRecommendationDesc: 'Optimisé pour votre succès',
      strategicTimingDesc: 'Moments d\'intervention optimaux',
      deepInsightsDesc: 'Coaching basé sur les modèles',
      
      // Étiquettes de Priorité
      highPriority: 'Haute Priorité',
      mediumPriority: 'Priorité Moyenne',
      lowPriority: 'Faible Priorité',
      confident: 'confiant',
      
      // Étiquettes de Filtre
      allInsights: 'Tous',
      
      // Étiquettes d\'Action
      viewActions: 'Voir les Actions',
      suggestedActions: 'Actions Suggérées',
      dismissInsight: 'Rejeter l\'aperçu',
      refreshInsights: 'Actualiser les aperçus',
      tryAgain: 'Réessayer',
      
      // Métadonnées
      cached: 'En Cache',
      cachedFrom: 'En cache depuis',
      generated: 'Généré',
      expires: 'Expire',
      fromCache: 'Du Cache',
      confidenceHigh: 'Élevée',
      confidenceMedium: 'Moyenne',
      confidenceLow: 'Faible',
      allAssessmentsMode: 'Mode Toutes les Évaluations',
      
      // Messages d\'Erreur
      errorLoadingInsights: 'Erreur lors du chargement des aperçus',
      
      // Messages d\'Aperçus Spécifiques
      taskCompletionRisk: 'Alerte de Risque d\'Achèvement des Tâches',
      streakAtRisk: 'Série en Danger !',
      peakProductivityDetected: 'Productivité Maximale Détectée',
      weeklyPatternIdentified: 'Modèle Hebdomadaire Identifié',
      productivityDeclineDetected: 'Déclin de Productivité Détecté',
      productivitySurge: 'Poussée de Productivité !',
      cohortSuccessPattern: 'Modèle de Succès de Cohorte',
      focusAreaIdentified: 'Zone de Focus Identifiée',
      optimalTaskLoad: 'Charge de Tâche Optimale',
      strategicPlanningAlert: 'Alerte de Planification Stratégique',
      energyManagementTip: 'Conseil de Gestion d\'Énergie',
      burnoutPreventionAlert: 'Alerte de Prévention d\'Épuisement',
      moodPerformanceConnection: 'Connexion Humeur-Performance',
      goalAchievementPattern: 'Modèle d\'Atteinte d\'Objectifs',
      taskTimingPattern: 'Modèle de Timing des Tâches',
      
      // Suggestions d\'Actions Communes
      scheduleTasksOptimalTime: 'Programmer les tâches pour votre moment le plus productif',
      setReminder30Minutes: 'Définir un rappel 30 minutes avant votre heure habituelle de tâches',
      prepareMaterialsTonight: 'Préparer les matériaux ce soir pour réduire les frictions demain',
      breakTasksIntoSteps: 'Envisager de diviser les tâches en étapes plus petites',
      completeOneMoreTask: 'Compléter au moins une tâche de plus pour maintenir l\'élan',
      focusOnQuickWins: 'Se concentrer sur les victoires rapides pour augmenter le taux d\'achèvement',
      setTimer25Minutes: 'Régler une minuterie de 25 minutes et s\'attaquer à votre tâche la plus facile',
      tryOptimalTimeForWeek: 'Essayer de compléter les tâches au moment optimal pendant une semaine',
      setDailyReminders: 'Définir des rappels quotidiens pour ce moment optimal',
      trackCompletionRate: 'Suivre si ce timing améliore votre taux d\'achèvement',
      adjustSchedule: 'Ajuster votre emploi du temps pour protéger ce créneau',
      planChallengingTasks: 'Planifier des tâches difficiles pour ce jour',
      useOptimalDay: 'Utiliser ce jour pour des progrès importants vers les objectifs',
      scheduleEasierTasks: 'Programmer des tâches plus faciles les jours moins productifs',
      reviewSimplifyGoals: 'Revoir et simplifier vos objectifs actuels',
      takeShortBreak: 'Prendre une courte pause pour prévenir l\'épuisement',
      focusOneCategory: 'Se concentrer sur une catégorie à la fois',
      adjustTaskDifficulty: 'Envisager d\'ajuster la difficulté des tâches',
      documentWhatWorks: 'Documenter ce qui fonctionne pour vous',
      increaseTaskDifficulty: 'Envisager d\'augmenter la difficulté des tâches',
      shareSuccessStrategies: 'Partager vos stratégies de succès',
      setAmbitiousGoals: 'Définir des objectifs plus ambitieux',
      prePlanSimpleWins: 'Pré-planifier des victoires simples pour les jours difficiles',
      scheduleFavoriteActivities: 'Programmer vos activités préférées comme récompenses',
      prepareEverythingNight: 'Préparer tout la veille au soir',
      partnerAccountability: 'S\'associer avec quelqu\'un pour la responsabilité',
      makeRestPlanningDay: 'Envisager de faire de ce jour un jour de repos ou de planification',
      scheduleBreaksBeforeEnergyDips: 'Programmer des pauses avant les baisses d\'énergie',
      planEnergizingActivities: 'Planifier des activités énergisantes pour les moments faibles',
      adjustMealTiming: 'Ajuster le timing des repas pour une énergie durable',
      try10MinuteWalk: 'Essayer une marche de 10 minutes pendant les moments de faible énergie',
      takeCompleteRestDay: 'Prendre une journée de repos complète cette semaine',
      reduceTaskLoad30Percent: 'Réduire la charge de tâches de 30% pendant 3 jours',
      focusEssentialTasks: 'Se concentrer uniquement sur les tâches essentielles',
      scheduleEnjoyableActivity: 'Programmer quelque chose d\'agréable et relaxant',
      practiceSayingNo: 'Pratiquer dire non aux engagements supplémentaires',
      noticeWhatCreatesMood: 'Remarquer ce qui crée des états d\'humeur positifs',
      planImportantTasksGoodMood: 'Planifier des tâches importantes quand vous vous sentez positif',
      developShiftingStrategies: 'Développer des stratégies pour changer d\'états négatifs',
      keepJournaling: 'Continuer à tenir un journal pour approfondir la conscience de soi',
      considerMoodBoostingActivities: 'Envisager des activités d\'amélioration de l\'humeur avant les tâches',
      breakLongTermGoals: 'Diviser les objectifs à long terme en jalons plus petits',
      celebrateHalfwayPoint: 'Célébrer les progrès à mi-parcours',
      reviewGoalsWeekly: 'Revoir les objectifs hebdomadairement pour maintenir l\'élan',
      try2MinuteRule: 'Essayer la règle des 2 minutes pour les tâches rapides',
      scheduleTasksImmediately: 'Programmer les tâches immédiatement après les avoir créées',
      setCompletionDeadlines: 'Définir des échéances d\'achèvement lors de la création des tâches',
      useTimeBlocking: 'Utiliser le blocage de temps pour assurer un achèvement ponctuel',
    },

    dashboard: {
      welcome: 'Bienvenue',
      welcomeBack: 'Bon retour',
      subtitle: 'Suivez votre performance de vie et continuez votre parcours d\'amélioration.',
      assessments: 'Évaluations',
      totalCompleted: 'Total complétées',
      dayStreak: 'Série de Jours',
      startStreak: 'Commencez votre série !',
      greatStart: 'Excellent début !',
      daysInRow: 'Jours consécutifs',
      latestScore: 'Dernier Score',
      outOf100: 'Sur 100',
      percentile: 'Percentile',
      amongPeers: 'Parmi les pairs',
      yourAssessments: 'Vos Évaluations',
      takeNewAssessment: 'Nouvelle Évaluation',
      noAssessmentsYet: 'Aucune évaluation encore',
      noAssessmentsDesc: 'Prenez votre première évaluation de vie pour commencer à suivre votre performance.',
      takeAssessment: 'Prendre Évaluation',
      viewResults: 'Voir Résultats',
      aiCoach: 'Coach IA',
      getAiCoach: 'Obtenir Coach IA',
      viewReport: 'Voir Rapport',
      deepReport: 'Rapport Profond',
      lifeAssessment: 'Évaluation de Vie',
      quickActions: 'Actions Rapides',
      newAssessment: 'Nouvelle Évaluation',
      aiCoachDashboard: 'Tableau de Bord Coach IA',
      upgradeToAiCoach: 'Passer au Coach IA',
      takeAssessmentUpgrade: 'Prendre Évaluation et Passer',
      account: 'Compte',
      email: 'Email',
      plan: 'Plan',
      aiCoachPro: 'Coach IA Pro',
      free: 'Gratuit',
      bestStreak: 'Meilleure Série',
      days: 'jours',
      lastLogin: 'Dernière Connexion',
      youAre: 'Vous êtes un',
      accountSettings: 'Paramètres du Compte',
      recentActivity: 'Activité Récente',
      averageLoginTime: 'Heure moyenne de connexion',
      needHelp: 'Besoin d\'Aide ?',
      needHelpDesc: 'Obtenez du support ou apprenez-en plus sur l\'amélioration de votre score de vie.',
      contactSupport: 'Contacter le Support',
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche',
      yourTasks: 'Vos Tâches',
      viewAiCoach: 'Voir Coach IA',
      todaysTasks: 'Tâches d\'Aujourd\'hui',
      thisWeeksTasks: 'Tâches de Cette Semaine'
    },
    settings: {
      accountSettings: 'Paramètres du Compte',
      profileInformation: 'Informations du Profil',
      accountName: 'Nom du Compte',
      enterAccountName: 'Entrez votre nom d\'affichage du compte',
      accountNameDesc: 'Ce nom sera affiché dans votre compte',
      country: 'Pays',
      selectCountry: 'Sélectionner le Pays',
      gender: 'Genre',
      selectGender: 'Sélectionner le Genre',
      male: 'Masculin',
      female: 'Féminin',
      other: 'Autre',
      preferNotToSay: 'Préfère ne pas dire',
      changePassword: 'Changer le Mot de Passe',
      currentPassword: 'Mot de Passe Actuel',
      enterCurrentPassword: 'Entrez le mot de passe actuel',
      newPassword: 'Nouveau Mot de Passe',
      enterNewPassword: 'Entrez le nouveau mot de passe',
      confirmPassword: 'Confirmer le Nouveau Mot de Passe',
      confirmNewPassword: 'Confirmez le nouveau mot de passe',
      passwordFieldsDesc: 'Laissez les champs de mot de passe vides si vous ne voulez pas changer votre mot de passe',
      cancel: 'Annuler',
      saving: 'Sauvegarde...',
      saveChanges: 'Sauvegarder les Modifications',
      settingsUpdated: 'Paramètres mis à jour avec succès !',
      emailCannotChange: 'L\'email ne peut pas être modifié'
    },
    countries: {
      us: 'États-Unis',
      uk: 'Royaume-Uni',
      ca: 'Canada',
      au: 'Australie',
      de: 'Allemagne',
      fr: 'France',
      other: 'Autre'
    },
    assessment: {
      // Basic Assessment
      lifeAssessment: 'Évaluation de Vie',
      assessmentDesc: 'Répondez aux questions sur différents domaines de votre vie pour obtenir votre score global.',
      getStarted: 'Commencer',
      question: 'Question',
      of: 'de',
      next: 'Suivant',
      previous: 'Précédent',
      submit: 'Soumettre l\'Évaluation',
      selectOption: 'Veuillez sélectionner une option',
      completing: 'Completion de votre évaluation...',
      almostDone: 'Presque terminé !',
      
      // Cohort Setup
      letsGetStarted: 'Commençons',
      basicInformation: 'Informations de Base',
      basicInformationDesc: 'D\'abord, nous avons besoin d\'informations de base pour vous comparer à vos pairs.',
      age: 'Âge',
      enterYourAge: 'Entrez votre âge',
      country: 'Pays',
      selectYourCountry: 'Sélectionnez votre pays',
      gender: 'Genre',
      selectGender: 'Sélectionnez le genre',
      male: 'Masculin',
      female: 'Féminin',
      other: 'Autre',
      preferNotToSay: 'Préfère ne pas dire',
      startAssessment: 'Commencer l\'Évaluation',
      informationConfidential: 'Vos informations sont gardées entièrement confidentielles',
      
      // Questions Interface
      complete: 'Complet',
      justGettingStarted: 'On commence tout juste...',
      makingGreatProgress: 'Vous faites de grands progrès !',
      halfwayThere: 'Vous êtes à mi-chemin !',
      almostFinished: 'Presque fini !',
      justAFewMore: 'Encore quelques-unes !',
      back: 'Retour',
      review: 'Réviser',
      continueToQuestions: 'Continuer aux Questions',
      
      // Categories
      financial: 'Financier',
      healthFitness: 'Santé et Forme',
      social: 'Social',
      romantic: 'Romantique',
      personal: 'Personnel',
      career: 'Carrière',
      personalGrowth: 'Développement Personnel',
      
      // Category Descriptions
      financialHealthName: 'Santé Financière',
      financialHealthIntroduction: 'Explorons votre fondation financière et vos progrès dans la construction de richesse.',
      financialHealthDescription: 'Comprendre votre santé financière aide à identifier les opportunités pour construire sécurité et richesse.',
      physicalWellnessName: 'Bien-être Physique',
      physicalWellnessIntroduction: 'Maintenant, évaluons votre santé physique et votre parcours de remise en forme.',
      physicalWellnessDescription: 'Votre bien-être physique affecte tous les aspects de votre vie, de l\'énergie à la confiance.',
      socialNetworkName: 'Réseau Social',
      socialNetworkIntroduction: 'Explorons vos relations et connexions sociales.',
      socialNetworkDescription: 'Des connexions sociales solides sont fondamentales pour le bonheur et la satisfaction de vie.',
      romanticName: 'Romantique',
      romanticIntroduction: 'Discutons de votre vie romantique et de la satisfaction relationnelle.',
      romanticDescription: 'Les relations romantiques impactent significativement la satisfaction globale de vie et le bien-être émotionnel.',
      careerDevelopmentName: 'Développement de Carrière',
      careerDevelopmentIntroduction: 'Examinons votre croissance professionnelle et votre satisfaction de carrière.',
      careerDevelopmentDescription: 'Le développement de carrière affecte la sécurité financière, l\'épanouissement personnel et la direction de vie.',
      personalGrowthName: 'Développement Personnel',
      personalGrowthIntroduction: 'Finalement, explorons votre développement personnel et votre parcours d\'amélioration de soi.',
      personalGrowthDescription: 'Les activités de développement personnel contribuent à l\'épanouissement à long terme et à l\'amélioration continue.',
      
      // Review Page
      reviewYourAssessment: 'Révisez Votre Évaluation',
      checkResponsesDesc: 'Vérifiez vos réponses avant d\'obtenir votre score de vie',
      editAnswers: 'Modifier les Réponses',
      getMyResults: 'Obtenir Mes Résultats',
      
      // Category Names (for review)
      financialHealth: 'Santé Financière',
      physicalWellness: 'Bien-être Physique',
      socialNetwork: 'Réseau Social',
      personalGrowthCategory: 'Développement Personnel',
      careerDevelopment: 'Développement de Carrière'
    },
    scorecard: {
      yourResults: 'Vos Résultats',
      overallScore: 'Score Global',
      percentileRank: 'Rang Percentile',
      categoryBreakdown: 'Répartition par Catégorie',
      getAiCoach: 'Obtenir Coach IA',
      getDeepReport: 'Obtenir Rapport Profond',
      shareResults: 'Partager les Résultats',
      takeAnother: 'Prendre Une Autre Évaluation',
      loading: 'Chargement de vos résultats...'
    },
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      close: 'Fermer',
      edit: 'Modifier',
      delete: 'Supprimer',
      confirm: 'Confirmer',
      back: 'Retour',
      continue: 'Continuer',
      finish: 'Terminer',
      yes: 'Oui',
      no: 'Non',
      today: 'Aujourd\'hui',
      yesterday: 'Hier',
      thisWeek: 'Cette Semaine',
      lastWeek: 'Semaine Dernière',
      language: 'Langue'
    },
    about: {
      backToHome: 'Retour à l\'Accueil',
      aboutRankMe: 'À Propos de RankMe',
      aboutSubtitle: 'Nous croyons que chacun mérite de comprendre où il se trouve et comment s\'améliorer. RankMe fournit des informations basées sur les données concernant votre performance de vie dans les dimensions qui comptent le plus.',
      ourMission: 'Notre Mission',
      ourMissionDesc: 'Démocratiser l\'accès à l\'évaluation complète de la vie et aux stratégies d\'amélioration personnalisées, aidant des millions de personnes à obtenir de meilleurs résultats dans tous les domaines de la vie.',
      whatMakesUsDifferent: 'Ce Qui Nous Rend Différents',
      whatMakesUsDesc: 'Contrairement à l\'auto-assistance générique ou aux solutions universelles, RankMe fournit des informations personnalisées et basées sur les données selon votre situation unique et les comparaisons avec vos pairs.',
      evidenceBased: 'Basé sur les Preuves',
      evidenceBasedDesc: 'Notre évaluation est fondée sur la recherche psychologique et validée auprès de milliers d\'utilisateurs. Chaque recommandation est soutenue par des données, pas par l\'opinion.',
      peerCalibrated: 'Calibré par les Pairs',
      peerCalibratedDesc: 'Vos résultats sont comparés aux personnes similaires à vous en âge, contexte et circonstances. Voyez où vous vous situez vraiment, pas où vous pensez vous situer.',
      aiPowered: 'Alimenté par l\'IA',
      aiPoweredDesc: 'Notre système de coaching IA s\'adapte à votre progrès, fournissant des plans hebdomadaires personnalisés et une motivation quotidienne adaptée à vos objectifs et défis spécifiques.',
      fourLifeDimensions: 'Les Quatre Dimensions de Vie',
      fourDimensionsDesc: 'Notre évaluation complète couvre les domaines clés que la recherche montre comme moteurs de la satisfaction de vie et du succès à long terme.',
      financialHealthDim: 'Santé Financière',
      financialHealthDimDesc: 'Revenus, épargne, investissements et planification financière sur 8 métriques clés',
      physicalWellnessDim: 'Bien-être Physique',
      physicalWellnessDimDesc: 'Fitness, nutrition, sommeil et habitudes de santé globales sur 8 dimensions',
      socialNetworkDim: 'Réseau Social',
      socialNetworkDimDesc: 'Relations, connexions sociales et qualité du réseau sur 8 facteurs',
      personalGrowthDim: 'Croissance Personnelle',
      personalGrowthDimDesc: 'Satisfaction professionnelle, objectifs, apprentissage et épanouissement de vie sur 8 domaines',
      ourApproach: 'Notre Approche',
      comprehensiveAssessmentStep: 'Évaluation Complète',
      comprehensiveAssessmentDesc: 'Notre évaluation de 32 questions couvre toutes les dimensions majeures de la vie. Contrairement aux enquêtes superficielles, nous creusons profondément dans les comportements spécifiques et les circonstances qui conduisent aux résultats.',
      dataDrivenInsights: 'Insights Basés sur les Données',
      dataDrivenInsightsDesc: 'Vos réponses sont analysées contre notre base de données de plus de 10 000 évaluations, fournissant des classements percentiles précis et identifiant vos principales forces et opportunités.',
      personalizedActionPlans: 'Plans d\'Action Personnalisés',
      personalizedActionPlansDesc: 'Basé sur vos résultats spécifiques, nous générons des plans d\'action personnalisés de 30 jours avec des étapes priorisées qui offrent le plus grand impact pour votre situation unique.',
      ongoingSupport: 'Support Continu',
      ongoingSupportDesc: 'Notre système de coaching IA fournit des bilans quotidiens, des mises à jour de plans hebdomadaires et une motivation continue pour vous aider à rester sur la bonne voie et réaliser un changement durable.',
      privacySecurityFirst: 'Confidentialité et Sécurité d\'Abord',
      privacySecurityDesc: 'Vos informations personnelles et résultats d\'évaluation sont traités avec le plus haut niveau de sécurité et de confidentialité.',
      noDataSelling: 'Pas de Vente de Données',
      noDataSellingDesc: 'Nous ne vendons jamais vos informations personnelles ou résultats d\'évaluation à des tiers. Vos données sont à vous.',
      encryptedStorage: 'Stockage Chiffré',
      encryptedStorageDesc: 'Toutes les données sont chiffrées à la fois en transit et au repos en utilisant des protocoles de sécurité standard de l\'industrie.',
      anonymousAnalytics: 'Analyses Anonymes',
      anonymousAnalyticsDesc: 'Quand nous utilisons des données pour la recherche, elles sont complètement anonymisées sans identificateurs personnels.',
      trustedByThousands: 'Approuvé par des Milliers',
      trustedDesc: 'Rejoignez la communauté croissante de personnes utilisant des insights basés sur les données pour améliorer leur vie',
      assessmentsCompleted: 'Évaluations Complétées',
      averageUserRating: 'Note Moyenne des Utilisateurs',
      dataPointsAnalyzed: 'Points de Données Analysés',
      readyToGetStarted: 'Prêt à Commencer ?',
      takeFirstStep: 'Faites le premier pas vers une meilleure vie avec notre évaluation complète.',
      takeAssessment: 'Prendre l\'Évaluation Gratuite'
    },
    pricing: {
      // Header
      backToHome: 'Retour à l\'Accueil',
      pageTitle: 'Choisissez Votre Chemin vers la Croissance',
      pageSubtitle: 'Que vous souhaitiez des insights approfondis ou un soutien de coaching continu, nous avons l\'option parfaite pour vous aider à améliorer votre performance de vie.',
      
      // Billing Cycle
      monthly: 'Mensuel',
      yearly: 'Annuel (Économisez 25%)',
      
      // Free Assessment Plan
      freeAssessment: 'Évaluation Gratuite',
      freeAssessmentDesc: 'Parfait pour commencer',
      freePrice: '0€',
      alwaysFree: 'Toujours gratuit',
      freeFeature1: 'Évaluation complète de 32 questions',
      freeFeature2: 'Classements percentiles de base',
      freeFeature3: 'Répartition des performances par catégorie',
      freeFeature4: 'Principales forces et opportunités',
      startFreeAssessment: 'Commencer l\'Évaluation Gratuite',
      
      // Deep Report Plan
      mostPopular: 'PLUS POPULAIRE',
      deepAnalysisReport: 'Rapport d\'Analyse Approfondie',
      deepAnalysisDesc: 'Insights complets et plan d\'action',
      deepPrice: '29€',
      oneTimePurchase: 'Achat unique',
      deepFeature1: 'Tout dans l\'Évaluation Gratuite',
      deepFeature2: 'Analyse détaillée par catégorie',
      deepFeature3: 'Plan d\'action personnalisé de 30 jours',
      deepFeature4: 'Comparaisons avec les pairs',
      deepFeature5: 'Téléchargement PDF professionnel',
      deepFeature6: 'Garantie de remboursement de 30 jours',
      getDeepAnalysis: 'Obtenir l\'Analyse Approfondie',
      
      // AI Coach Plan
      aiLifeCoach: 'Coach de Vie IA',
      aiCoachDesc: 'Soutien continu et responsabilisation',
      monthlyPrice: '19€',
      yearlyPrice: '14€',
      perMonth: 'par mois',
      billedYearly: ', facturé annuellement',
      savePerYear: 'Économisez 60€/an',
      aiCoachFeature1: 'Tout dans le Rapport Approfondi',
      aiCoachFeature2: 'Plans hebdomadaires personnalisés',
      aiCoachFeature3: 'Check-ins quotidiens avec coach IA',
      aiCoachFeature4: 'Suivi des progrès et analytiques',
      aiCoachFeature5: 'Réévaluations mensuelles',
      aiCoachFeature6: 'Annuler à tout moment',
      startFreeTrial: 'Commencer l\'Essai Gratuit',
      sevenDaysFree: 'Premiers 7 jours gratuits',
      
      // Feature Comparison
      featureComparison: 'Comparaison des Fonctionnalités',
      features: 'Fonctionnalités',
      free: 'Gratuit',
      deepReport: 'Rapport Approfondi',
      aiCoach: 'Coach IA',
      feature32Question: 'Évaluation de 57 Questions',
      featureBasicRankings: 'Classements Percentiles de Base',
      featureDetailedAnalysis: 'Analyse Détaillée et Insights',
      feature30DayPlan: 'Plan de 30 Jours',
      featurePdfDownload: 'Téléchargement PDF',
      featureWeeklyPlans: 'Plans de Coaching Hebdomadaires',
      featureDailyCheckins: 'Check-ins Quotidiens IA',
      featureProgressTracking: 'Suivi des Progrès',
      
      // Trust Indicators
      thirtyDayGuarantee: 'Garantie de 30 Jours',
      guaranteeDesc: 'Pas satisfait ? Obtenez un remboursement complet dans les 30 jours, sans questions.',
      rating: 'Note 4,8/5',
      ratingDesc: 'Fait confiance par plus de 10 000 utilisateurs qui ont amélioré leur vie avec RankMe.',
      instantAccess: 'Accès Instantané',
      instantAccessDesc: 'Obtenez un accès immédiat à vos insights personnalisés et outils de coaching.',
      
      // FAQ
      faqTitle: 'Questions Fréquemment Posées',
      faq1Question: 'Puis-je passer à la version payante depuis la version gratuite ?',
      faq1Answer: 'Absolument ! Vous pouvez acheter le Rapport Approfondi ou commencer un abonnement Coach IA à tout moment après avoir terminé votre évaluation gratuite.',
      faq2Question: 'Qu\'est-ce qui est inclus dans l\'essai de 7 jours ?',
      faq2Answer: 'L\'essai du Coach IA comprend toutes les fonctionnalités premium : plans hebdomadaires personnalisés, check-ins quotidiens, suivi des progrès et accès illimité aux outils de coaching.',
      faq3Question: 'À quel point les résultats sont-ils précis ?',
      faq3Answer: 'Notre évaluation est basée sur des recherches validées et calibrée contre plus de 10 000 réponses. Les résultats sont aussi précis que les informations que vous fournissez.',
      faq4Question: 'Puis-je annuler mon abonnement à tout moment ?',
      faq4Answer: 'Oui, vous pouvez annuler votre abonnement Coach IA à tout moment depuis les paramètres de votre compte. Vous conserverez l\'accès jusqu\'à la fin de votre période de facturation actuelle.',
      faq5Question: 'Mes données sont-elles sécurisées et privées ?',
      faq5Answer: 'Absolument. Nous utilisons un chiffrement de niveau bancaire et ne vendons jamais vos données personnelles. Lisez notre politique de confidentialité pour tous les détails.',
      faq6Question: 'Quels modes de paiement acceptez-vous ?',
      faq6Answer: 'Nous acceptons toutes les principales cartes de crédit via Stripe, notre processeur de paiement sécurisé. Toutes les transactions sont chiffrées et conformes PCI.',
      
      // CTA Section
      ctaTitle: 'Prêt à Transformer Votre Vie ?',
      ctaSubtitle: 'Rejoignez des milliers de personnes qui ont utilisé RankMe pour comprendre leurs forces, identifier les opportunités et créer des changements positifs durables.',
      ctaStartAssessment: 'Commencer l\'Évaluation Gratuite',
      ctaViewSample: 'Voir l\'Exemple de Rapport'
    },
    loginPatterns: {
      earlyBird: 'Lève-tôt',
      nightOwl: 'Noctambule',
      consistent: 'Utilisateur Régulier',
      weekend: 'Utilisateur de Week-end',
      weekday: 'Utilisateur de Semaine',
      irregular: 'Utilisateur Irrégulier'
    }
  },
  de: {
    header: {
      title: 'RankMe',
      signOut: 'Abmelden'
    },
    home: {
      title: 'RankMe',
      beta: 'BETA',
      heroTitle1: 'Entdecken Sie Ihre',
      heroTitle2: 'Lebensleistung',
      heroSubtitle: 'Erhalten Sie umfassende Einblicke in Ihre Lebensleistung in finanziellen, gesundheitlichen, sozialen und persönlichen Dimensionen.',
      noSignupRequired: 'Keine Anmeldung erforderlich • 5-10 Minuten • Sofortige Ergebnisse',
      getStarted: 'Beginnen',
      newAssessment: 'Neue Bewertung',
      start: 'Starten',
      startYourAssessment: 'Starten Sie Ihre Bewertung',
      fourKeyDimensions: 'Vier Schlüsseldimensionen des Lebens',
      assessmentEvaluatesDesc: 'Unsere Bewertung misst Ihre Leistung in den wichtigsten Lebensbereichen',
      financialHealth: 'Finanzielle Gesundheit',
      financialHealthDesc: 'Einkommens-, Spar- und Investitionsanalyse',
      physicalWellness: 'Körperliches Wohlbefinden',
      physicalWellnessDesc: 'Fitness-, Gesundheits- und Lifestyle-Metriken',
      socialNetwork: 'Soziales Netzwerk',
      socialNetworkDesc: 'Beziehungen und Gemeinschaftsverbindungen',
      personalGrowth: 'Persönliches Wachstum',
      personalGrowthDesc: 'Entwicklung und Lebenszufriedenheit',
      whatYoullGet: 'Was Sie Erhalten',
      comprehensiveAssessment: 'Umfassende 32-Fragen-Bewertung',
      instantRankings: 'Sofortige Perzentil-Rankings vs Gleichaltrige',
      professionalScorecard: 'Professionelle Scorecard-Analyse',
      personalizedInsights: 'Personalisierte Verbesserungseinblicke',
      premiumFeatures: 'Premium-Funktionen',
      freeAssessment: 'Kostenlose Bewertung',
      freeAssessmentDesc: 'Grundlegende Bewertung und Perzentile',
      deepAnalysis: 'Tiefgehende Analyse',
      deepAnalysisDesc: 'Detaillierte Einblicke + Aktionsplan',
      aiLifeCoach: 'KI-Lebenscoach',
      aiLifeCoachDesc: 'Personalisiertes Coaching + Fortschrittsverfolgung',
      yourPrivacyMatters: 'Ihre Privatsphäre Ist Wichtig',
      privacyDescription: 'Alle Bewertungen sind standardmäßig vollständig anonym. Ihre Daten sind verschlüsselt und werden niemals ohne Ihre ausdrückliche Zustimmung geteilt.',
      instantResults: 'Sofortige Ergebnisse',
      privacyFirst: 'Privatsphäre Zuerst',
      noSpam: 'Kein Spam',
      readyToDiscover: 'Bereit, Ihre Punktzahl zu Entdecken?',
      joinThousands: 'Schließen Sie sich Tausenden an, die bereits ihr Leben bewertet und mit der Verbesserung begonnen haben.',
      assessmentsTaken: 'Durchgeführte Bewertungen',
      userRating: 'Benutzerbewertung',
      completionRate: 'Abschlussrate',
      about: 'Über',
      pricing: 'Preise',
      dashboard: 'Dashboard',
      signIn: 'Anmelden',
      tryFree: 'Kostenlose Bewertung Testen',
      platformDesc: 'Professionelle Lebensbewertungsplattform',
      privacy: 'Datenschutz',
      terms: 'Bedingungen',
      contact: 'Kontakt',
      copyright: '© 2024 RankMe. Alle Rechte vorbehalten.'
    },
    scorecard: {
      yourResults: 'Ihre Ergebnisse',
      backToDashboard: 'Zurück zum Dashboard',
      overallScore: 'Gesamtpunktzahl',
      percentileRank: 'Perzentil-Rang',
      categoryBreakdown: 'Kategorieaufschlüsselung',
      getAiCoach: 'KI-Coach Holen',
      getDeepReport: 'Detailbericht Holen',
      shareResults: 'Ergebnisse Teilen',
      takeAnother: 'Weitere Bewertung Machen',
      loading: 'Lädt...',
      loadingResults: 'Ihre Ergebnisse werden geladen...',
      scoreNotFound: 'Score-Daten nicht gefunden',
      backToHome: 'Zurück zur Startseite',
      financialHealth: 'Finanzielle Gesundheit',
      physicalWellness: 'Körperliches Wohlbefinden',
      socialNetwork: 'Soziales Netzwerk',
      personalGrowth: 'Persönliches Wachstum',
      excellent: 'Ausgezeichnet',
      exceptional: 'Außergewöhnlich',
      good: 'Gut',
      average: 'Durchschnittlich',
      needsImprovement: 'Verbesserungsbedürftig',
      romantic: 'Romantisch',
      career: 'Karriere',
      distribution: 'Verteilung',
      sendMyResults: 'Meine Ergebnisse Senden',
      deepAnalysis: 'Tiefgehende Analyse',
      viewDeepReport: 'Detailbericht Anzeigen',
      emailYourResults: 'Ihre Ergebnisse per E-Mail',
      enterEmailAddress: 'Geben Sie Ihre E-Mail-Adresse ein',
      emailResultsDesc: 'Erhalten Sie eine schön formatierte E-Mail mit Ihren vollständigen Bewertungsergebnissen und Einsichten.',
      assessmentStats: 'Bewertungsstatistiken',
      saveYourResults: 'Ihre Ergebnisse Speichern',
      createAccountDesc: 'Erstellen Sie ein kostenloses Konto, um Ihren Fortschritt zu verfolgen und jederzeit auf Ihre Ergebnisse zuzugreifen.',
      createFreeAccount: 'Kostenloses Konto Erstellen',
      signInToExistingAccount: 'Bei Bestehendem Konto Anmelden',
      scorecardDesc: 'Diese Scorecard zeigt Ihre Perzentil-Rankings. Entsperren Sie tiefere Einsichten mit unseren Premium-Funktionen.',
      resultsSentSuccessfully: 'Ergebnisse erfolgreich gesendet!',
      checkYourInbox: 'Überprüfen Sie Ihren Posteingang für Ihre detaillierte Lebenspunktzahl.',
      sendToAnotherEmail: 'An eine andere E-Mail senden',
      aiLifeCoach: 'KI-Lebenscoach',
      greatJobSaveResults: 'Großartige Arbeit! Speichern Sie Ihre Ergebnisse',
      createFreeAccountTo: 'Erstellen Sie ein kostenloses Konto, um:',
      trackProgressOverTime: 'Ihren Fortschritt im Laufe der Zeit zu verfolgen',
      accessResultsAnyDevice: 'Von jedem Gerät auf Ihre Ergebnisse zuzugreifen',
      compareImprovements: 'Verbesserungen zwischen Bewertungen zu vergleichen',
      getPersonalizedRecs: 'Personalisierte Empfehlungen zu erhalten',
      iHaveAnAccount: 'Ich Habe ein Konto',
      continueWithoutAccount: 'Ohne Konto fortfahren',
      downloadForStories: 'Für Stories Herunterladen',
      shareLink: 'Link Teilen',
      howToUse: 'So verwenden:',
      uploadToInstagram: 'Laden Sie das Bild auf Ihr Telefon herunter, öffnen Sie Instagram und erstellen Sie eine neue Story, laden Sie das heruntergeladene Bild hoch, teilen Sie es mit Ihren Followern!',
      shareWithFollowers: 'Mit Ihren Followern teilen!',
      somethingWentWrong: 'Beim Generieren Ihres Teilungsbildes ist etwas schief gelaufen.',
      scorecardShowsPercentiles: 'Diese Bewertungskarte zeigt Ihre Perzentil-Rankings. Schalten Sie tiefere Einblicke mit unseren Premium-Funktionen frei.',
      unlockDeeperInsights: 'Schalten Sie tiefere Einblicke mit unseren Premium-Funktionen frei.',
      accessYourReport: 'Zugriff auf Ihren Bericht'
    },
    report: {
      deepLifeAnalysisReport: 'Tiefgehender Lebensanalysebericht',
      comprehensiveInsights: 'Umfassende Einblicke und personalisierte Empfehlungen',
      executiveSummary: 'Zusammenfassung',
      overallScore: 'Gesamtpunktzahl',
      performance: 'Leistung',
      overallPerformanceDistribution: 'Gesamtleistungsverteilung',
      peerComparison: 'Peer-Vergleich',
      peerComparisonText: 'Ihre Gesamtlebensbewertung ist höher als',
      categoryBreakdown: 'Kategorieaufschlüsselung',
      strengths: 'Stärken',
      opportunities: 'Chancen',
      recommendations: 'Empfehlungen',
      actionPlan30Day: '30-Tage-Aktionsplan',
      week: 'Woche',
      timeCommitment: 'Zeitaufwand',
      sampleReport: 'MUSTERBERICHT',
      sampleDescription: 'Dies ist ein Beispiel dessen, was Sie mit unserem umfassenden Analyse-Upgrade erhalten',
      financialHealth: 'Finanzielle Gesundheit',
      healthWellness: 'Gesundheit & Wohlbefinden',
      socialConnections: 'Soziale Verbindungen',
      personalGrowth: 'Persönliches Wachstum',
      score: 'Punktzahl',
      percentile: 'Perzentil',
      keyStrengths: 'Hauptstärken',
      growthAreas: 'Wachstumsbereiche',
      performanceDistribution: 'Leistungsverteilung',
      shareText: 'Schauen Sie sich meinen RankMe Tiefgehenden Lebensbericht an! Gesamtpunktzahl:',
      captionCopied: 'Beschriftung in die Zwischenablage kopiert!',
      backToDashboard: 'Zurück zum Dashboard',
      reportOverview: 'Berichtsübersicht',
      assessmentDate: 'Bewertungsdatum',
      questionsAnalyzed: 'Analysierte Fragen',
      categoriesCovered: 'Abgedeckte Kategorien',
      peerGroupSize: 'Größe der Vergleichsgruppe',
      keyInsights: 'Wichtige Erkenntnisse',
      topPerformer: 'Top-Performer',
      focusArea: 'Fokusbereich',
      growthPotential: 'Wachstumspotenzial',
      shareReport: 'Bericht Teilen',
      downloadPDF: 'PDF Herunterladen',
      categoryDeepDive: 'Tiefgehende Kategorieanalyse',
      quickWins: 'Schnelle Erfolge',
      wantOngoingSupport: 'Möchten Sie fortlaufende Unterstützung?',
      reportDataNotFound: 'Berichtsdaten nicht gefunden',
      backToHome: 'Zurück zur Startseite',
      youAreMostSimilarTo: 'Sie sind am ähnlichsten zu Personen in der Kategorie',
      areas: 'Bereiche',
      youExcelIn: 'Sie glänzen in',
      biggestOpportunityIn: 'Größte Chance in',
      followingActionPlanCouldImprove: 'Das Befolgen des Aktionsplans könnte Ihre Gesamtpunktzahl um 15-25 Punkte verbessern',
      shareYourLifeScore: 'Teilen Sie Ihren Lebensscore',
      ofPeopleInYourDemographic: 'der Menschen in Ihrer Demografie',
      thPercentile: '. Perzentil',
      topPercent: 'Top',
      belowAverage: 'Unterdurchschnittlich',
      aboveAverage: 'Überdurchschnittlich',
      bottomPercent: 'Untere',
      yourLifeScore: 'Ihr Lebensscore',
      performanceBreakdown: 'Leistungsaufschlüsselung',
      topStrength: 'Hauptstärke',
      growthArea: 'Wachstumsbereich',
      questionsAnswered: 'Beantwortete Fragen',
      completionTime: 'Abschlusszeit',
      peerGroup: 'Vergleichsgruppe',
      recentActivity: 'Neueste Aktivität',
      scoreDataNotFound: 'Score-Daten nicht gefunden',
      readyToImproveYourScore: 'Bereit, Ihren Score zu Verbessern?',
      improveScoreDescription: 'Erhalten Sie personalisierte Einblicke und umsetzbare Empfehlungen zur Steigerung Ihrer Lebensleistung.',
      exceptional: 'Außergewöhnlich',
      excellent: 'Ausgezeichnet',
      good: 'Gut',
      fair: 'Befriedigend',
      needsAttention: 'Benötigt Aufmerksamkeit',
      personalizedInsights: 'Personalisierte Einblicke',
      crossCategoryPatterns: 'Kategorienübergreifende Muster',
      surprisingFindings: 'Überraschende Erkenntnisse',
      longTermStrategy: 'Langzeitstrategie',
      primaryLimitingFactor: 'Hauptlimitierender Faktor',
      threeMonthGoals: '3-Monats-Ziele',
      oneYearGoals: '1-Jahres-Ziele',
      recommendedResources: 'Empfohlene Ressourcen',
      primaryGrowthAreas: 'Hauptwachstumsbereiche',
      generatingDeepReport: 'Detaillierten Bericht erstellen',
      individualQuestionAnalysis: 'Individuelle Fragenanalyse',
      yourAnswer: 'Ihre Antwort: ',
      myRankMeLifeScoreDeepReport: 'Mein RankMe Lebenscore-Detailbericht',
      linkCopiedToClipboard: 'Link in die Zwischenablage kopiert!'
    },
    coach: {
      // Navigation & Basic
      backToDashboard: 'Zurück zum Dashboard',
      aiCoach: 'KI-Coach',
      yourCoach: 'Ihr Coach',
      welcome: 'Willkommen zu Ihrem KI-Coach',
      weeklyGoals: 'Wöchentliche Ziele',
      dailyTasks: 'Tägliche Aufgaben',
      progress: 'Fortschritt',
      checkins: 'Check-ins',
      achievements: 'Erfolge',
      settings: 'Einstellungen',
      startWeek: 'Woche Starten',
      completeTask: 'Aufgabe Abschließen',
      scheduleCheckin: 'Check-in Planen',
      viewProgress: 'Fortschritt Anzeigen',
      welcomeTitle: 'Willkommen zu Ihrem KI-Lebenscoach! 🎉',
      subscriptionActive: 'Ihr Abonnement ist aktiv! Lassen Sie uns Ihre personalisierte Coaching-Erfahrung einrichten, um Ihnen zu helfen, Ihre Lebensziele zu erreichen.',
      coachNotFound: 'Coach-Daten nicht gefunden',
      
      // Header & Status
      yourAiLifeCoach: 'Ihr KI-Lebenscoach',
      activeSubscription: 'Aktives Abonnement',
      daysLeftInTrial: 'Tage verbleibend in der Testversion',
      chatWithCoach: 'Chat mit Coach',
      
      // Focus Areas
      financialHealth: 'Finanzielle Gesundheit',
      physicalWellness: 'Körperliches Wohlbefinden',
      socialNetwork: 'Soziales Netzwerk',
      personalDevelopment: 'Persönliche Entwicklung',
      otherTasks: 'Andere Aufgaben',
      
      // Date Navigation
      todaysGoals: 'Heutige Ziele',
      yesterdaysGoals: 'Gestrige Ziele',
      tomorrowsGoals: 'Morgige Ziele',
      goalsFor: 'Ziele für',
      
      // Onboarding
      letsGetYouStarted: 'Lassen Sie uns beginnen',
      setYourCoachingPreferences: 'Ihre Coaching-Präferenzen festlegen',
      chooseFocusAreaDesc: 'Wählen Sie Ihren Fokusbereich, Coaching-Stil und wie oft Sie Anleitung erhalten möchten.',
      scheduleYourCheckins: 'Ihre Check-ins planen',
      setUpCheckinsDesc: 'Regelmäßige Check-ins einrichten, um Ihren Fortschritt zu verfolgen und motiviert zu bleiben.',
      meetYourAiCoach: 'Lernen Sie Ihren KI-Coach kennen',
      firstConversationDesc: 'Führen Sie Ihr erstes Gespräch und erhalten Sie Ihren personalisierten Aktionsplan.',
      
      // Benefits
      personalizedGoals: 'Personalisierte Ziele',
      personalizedGoalsDesc: 'Erhalten Sie wöchentliche Aktionspläne, die auf Ihre Bewertungsergebnisse zugeschnitten sind',
      twentyFourSevenSupport: '24/7 Support',
      twentyFourSevenSupportDesc: 'Chatten Sie jederzeit mit Ihrem KI-Coach für Anleitung und Motivation',
      trackProgress: 'Fortschritt Verfolgen',
      trackProgressDesc: 'Sehen Sie Ihre Verbesserung mit detaillierten Analysen und Einblicken',
      
      // Coach Configuration
      coachConfiguration: 'Coach-Konfiguration',
      primaryFocus: 'Hauptfokus',
      secondary: 'Sekundär',
      style: 'Stil',
      motivation: 'Motivation',
      focusArea: 'Fokusbereich',
      coachingStyle: 'Coaching-Stil',
      taskFrequency: 'Aufgabenhäufigkeit',
      motivationLevel: 'Motivationslevel',
      assessmentSpecificSettings: 'Bewertungsspezifische Einstellungen',
      difficulty: 'Schwierigkeit',
      
      // Coach Styles & Options
      supportive: 'Unterstützend',
      analytical: 'Analytisch',
      direct: 'Direkt',
      encouraging: 'Ermutigend',
      gentle: 'Sanft',
      balanced: 'Ausgewogen',
      intense: 'Intensiv',
      easy: 'Einfach',
      moderate: 'Mäßig',
      challenging: 'Herausfordernd',
      financial: 'Finanziell',
      health: 'Gesundheit',
      social: 'Sozial',
      personal: 'Persönlich',
      none: 'Keine',
      daily: 'täglich',
      weekly: 'wöchentlich',
      
      // Progress
      yourProgress: 'Ihr Fortschritt',
      lastUpdated: 'Zuletzt aktualisiert',
      dayStreak: 'Tage-Serie',
      completionRate: 'Abschlussrate',
      currentScore: 'Aktuelle Punktzahl',
      pointsImproved: 'Punkte Verbessert',
      sinceYouStarted: 'Seit Sie begonnen haben',
      onFire: '🔥 In Fahrt!',
      keepGoing: 'Weiter so!',
      completed: 'abgeschlossen',
      percentile: 'Perzentil',
      
      // Daily Progress
      dailyProgressByDay: 'Täglicher Fortschritt nach Tagen',
      pastDays: 'Vergangene Tage',
      today: 'Heute',
      future: 'Zukunft',
      combinedWeeklyProgress: 'Kombinierter Wochenfortschritt',
      allTasksForThisWeek: 'Alle Aufgaben für diese Woche',
      weeklyTasks: 'Wöchentliche Aufgaben',
      dailyGoals: 'Tägliche Ziele',
      
      // Task Management
      weeklyTasksForWeek: 'Wöchentliche Aufgaben für Woche',
      expandAll: 'Alle Erweitern',
      collapseAll: 'Alle Einklappen',
      expandTasks: 'Aufgaben erweitern',
      collapseTasks: 'Aufgaben einklappen',
      deleteTask: 'Aufgabe löschen',
      showCompleted: 'Abgeschlossene Anzeigen',
      hideCompleted: 'Abgeschlossene Verbergen',
      clickShowCompletedToView: 'Klicken Sie auf "Abgeschlossene Anzeigen", um Details zu sehen',
      noGoalsSetForToday: 'Keine Ziele für heute gesetzt',
      noGoalsPlanned: 'Keine Ziele geplant für',
      noGoalsWereSet: 'Keine Ziele wurden gesetzt für',
      deleteGoal: 'Ziel löschen',
      yesterday: 'Gestern',
      goToToday: 'Zu Heute gehen',
      tomorrow: 'Morgen',
      
      // Chat Interface
      quickSuggestions: 'Schnelle Vorschläge',
      howCanIImprove: 'Wie kann ich meinen schwächsten Bereich verbessern?',
      whatShouldIFocus: 'Worauf sollte ich mich diese Woche konzentrieren?',
      feelingStuck: 'Ich fühle mich festgefahren. Haben Sie Rat?',
      typeYourMessage: 'Geben Sie Ihre Nachricht ein...',
      troubleConnecting: 'Ich habe gerade Verbindungsprobleme. Versuchen Sie es in einem Moment erneut.',
      
      // Journal
      reflectOnYourDay: 'Reflektieren Sie Ihren Tag',
      journalPrompt: 'Tagebuch-Frage',
      journalPlaceholder: 'Nehmen Sie sich einen Moment Zeit, um über Ihren Tag, Fortschritte, Herausforderungen und Erkenntnisse nachzudenken...',
      
      // Goals Management
      yourGoals: 'Ihre Ziele',
      addNewGoal: 'Neues Ziel Hinzufügen',
      goalCategory: 'Ziel-Kategorie',
      goalTitle: 'Ziel-Titel',
      goalDescription: 'Ziel-Beschreibung',
      goalTarget: 'Ziel-Vorgabe',
      goalDeadline: 'Ziel-Frist',
      goalDescriptionPlaceholder: 'Beschreiben Sie Ihr Ziel und warum es für Sie wichtig ist...',
      createGoal: 'Ziel Erstellen',
      
      // Settings Modal
      accountSettings: 'Konto-Einstellungen',
      notifications: 'Benachrichtigungen',
      dailyReminders: 'Tägliche Erinnerungen',
      weeklyReports: 'Wöchentliche Berichte',
      reminderTime: 'Erinnerungszeit',
      goalFrequency: 'Ziel-Häufigkeit',
      
      // Alerts & Messages
      taskCreatedSuccessfully: 'Aufgabe erfolgreich erstellt!',
      failedToCreateTask: 'Fehler beim Erstellen der Aufgabe. Bitte versuchen Sie es erneut.',
      journalEntrySaved: 'Tagebucheintrag gespeichert! Ihre Gedanken wurden aufgezeichnet.',
      journalEntryError: 'Fehler beim Speichern des Tagebucheintrags. Bitte versuchen Sie es erneut.',
      checkInCompleted: 'Check-in erfolgreich abgeschlossen!',
      checkInFailed: 'Fehler beim Abschließen des Check-ins. Bitte versuchen Sie es erneut.',
      preferencesError: 'Fehler beim Speichern der Einstellungen. Bitte versuchen Sie es erneut.',
      checkInsSetupFailed: 'Fehler beim Einrichten der Check-ins',
      coachingDataError: 'Fehler beim Generieren von Coaching-Daten',
      goalCreated: 'Ziel erfolgreich erstellt! Arbeiten Sie weiter daran.',
      settingsSaved: 'Einstellungen erfolgreich gespeichert! Ihre Präferenzen wurden aktualisiert.',
      settingsError: 'Fehler beim Speichern der Einstellungen. Bitte versuchen Sie es erneut.',
      
      // Task Creator
      createTask: 'Aufgabe Erstellen',
      taskTitle: 'Aufgaben-Titel',
      taskDescription: 'Aufgaben-Beschreibung',
      category: 'Kategorie',
      estimatedTime: 'Geschätzte Zeit',
      date: 'Datum',
      creating: 'Erstelle...',
      enterTaskTitle: 'Aufgaben-Titel eingeben...',
      describeTheTask: 'Beschreiben Sie die Aufgabe...',
      
      // Journal Questions
      financialJournalPrompt: '',
      healthJournalPrompt: '',
      socialJournalPrompt: '',
      personalJournalPrompt: '',
      
      // Additional UI strings
      startYourStreakToday: 'Starten Sie heute Ihre Serie!',
      upcomingCheckIns: 'Bevorstehende Check-ins',
      quickActions: 'Schnelle Aktionen',
      needHelp: 'Hilfe Benötigt?',
      questionsAboutCoaching: 'Fragen zu Ihrem Coaching-Plan oder Fortschritt? Wir sind hier um zu helfen.',
      noWeeklyTasksCompleted: 'Noch keine wöchentlichen Aufgaben abgeschlossen',
      noDailyGoalsCompleted: 'Noch keine täglichen Ziele abgeschlossen',
      totalTasksCompleted: 'Aufgaben insgesamt abgeschlossen',
      clickShowCompletedDetails: 'Klicken Sie auf "Abgeschlossene anzeigen" für Details',
      failedToUpdateTask: 'Aufgabe konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.',
      failedToDeleteTask: 'Aufgabe konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.',
      failedToSavePreferences: 'Einstellungen konnten nicht gespeichert werden. Bitte versuchen Sie es erneut.',
      checkInCompletedSuccess: 'Check-in erfolgreich abgeschlossen!',
      failedToCompleteCheckIn: 'Check-in konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.',
      failedToSetupCheckIns: 'Check-ins konnten nicht eingerichtet werden',
      failedToGenerateCoaching: 'Coaching-Daten konnten nicht generiert werden',
      goalCreatedSuccess: 'Ziel erfolgreich erstellt! Arbeiten Sie weiter darauf hin.',
      settingsSavedSuccess: 'Einstellungen erfolgreich gespeichert! Ihre Präferenzen wurden aktualisiert.',
      errorSavingSettings: 'Fehler beim Speichern der Einstellungen. Bitte versuchen Sie es erneut.',
      errorCreatingTask: 'Fehler beim Erstellen der Aufgabe',
      allFocusAreas: 'Alle Schwerpunktbereiche',
      completedTasksCount: 'abgeschlossen',
      combinesAllTasks: 'Kombiniert alle wöchentlichen Aufgaben + tägliche Ziele für die gesamte Woche',
      pastDays: 'Vergangene Tage',
      todayText: 'Heute',
      futureText: 'Zukunft',
      minutes: 'Min',
      contactSupport: 'Support Kontaktieren',
      noCheckInsScheduled: 'Keine Check-ins geplant',
      deleteGoal: 'Ziel löschen',
      addNewGoal: 'Neues Ziel hinzufügen',
      completedTasks: 'Abgeschlossene Aufgaben',
      totalTasksCompletedThis: 'Aufgaben insgesamt abgeschlossen',
      clickShowCompleted: 'Klicken Sie auf "Abgeschlossene anzeigen" für Details',
      showCompleted: 'Abgeschlossene anzeigen',
      hideCompleted: 'Abgeschlossene ausblenden',
      noGoalsSetToday: 'Keine Ziele für heute gesetzt',
      editSchedule: 'Zeitplan bearbeiten',
      completeNow: 'Jetzt abschließen',
      overdue: 'Überfällig',
      checkInType: 'Check-in',
      setUpCheckIns: 'Check-ins einrichten',
      setUpCheckInsTitle: 'Check-ins Einrichten',
      continueSetup: 'Setup Fortsetzen',
      frequencyDaily: 'Täglich',
      frequencyWeekly: 'Wöchentlich',
      frequencyBiweekly: 'Zweiwöchentlich',
      frequencyMonthly: 'Monatlich',
      frequencyMultipleDaily: 'Mehrmals Täglich',
      dailyDescription: 'Einmal pro Tag',
      weeklyDescription: 'Bestimmte Tage',
      biweeklyDescription: 'Alle 2 Wochen',
      monthlyDescription: 'Einmal pro Monat',
      multipleDailyDescription: 'Mehrmals pro Tag',
      at: 'um',
      howOften: 'Wie oft?',
      whenLabel: 'Wann?',
      times: 'Zeiten',
      timeLabel: 'Zeit',
      daysLabel: 'Tage',
      addTime: 'Zeit hinzufügen',
      hideAdvanced: 'Ausblenden',
      showAdvanced: 'Anzeigen',
      reminder: 'Erinnerung',
      schedule: 'Zeitplan:',
      reminderMinBefore: 'Min vorher',
      monday: 'Montag',
      tuesday: 'Dienstag',
      wednesday: 'Mittwoch',
      thursday: 'Donnerstag',
      friday: 'Freitag',
      saturday: 'Samstag',
      sunday: 'Sonntag',
      mon: 'Mo',
      tue: 'Di',
      wed: 'Mi',
      thu: 'Do',
      fri: 'Fr',
      sat: 'Sa',
      sun: 'So',
      morning: 'Morgens',
      afternoon: 'Nachmittags',
      evening: 'Abends',
      createNewTask: 'Neue Aufgabe erstellen',
      createDailyGoal: 'Tägliches Ziel erstellen',
      howCanIImprove: 'Wie kann ich meine Lebenspunktzahl verbessern?',
      whatShouldIFocus: 'Worauf sollte ich mich diese Woche konzentrieren?',
      feelingStuck: 'Ich fühle mich festgefahren, was soll ich tun?',
      typeMessage: 'Nachricht eingeben...',
      sendMessage: 'Senden',
      expandTasks: 'Aufgaben erweitern',
      collapseTasks: 'Aufgaben einklappen',
      workOnAllAreas: 'Arbeiten Sie gleichzeitig an allen Bereichen Ihres Lebens',
      expandAll: 'Alle erweitern',
      collapseAll: 'Alle einklappen',
      
      // Modal translations
      createWeeklyTasks: 'Wöchentliche Aufgaben Erstellen',
      weekOf: 'Woche von',
      taskNumber: 'Aufgabe',
      category: 'Kategorie',
      taskTitle: 'Aufgaben-Titel',
      taskTitleRequired: 'Aufgaben-Titel *',
      description: 'Beschreibung',
      descriptionRequired: 'Beschreibung *',
      addTask: 'Aufgabe Hinzufügen',
      saveTasks: 'Aufgaben Speichern',
      cancel: 'Abbrechen',
      financialHealth: 'Finanzielle Gesundheit',
      physicalWellness: 'Körperliches Wohlbefinden',
      socialConnection: 'Soziale Verbindung',
      personalDevelopment: 'Persönliche Entwicklung',
      other: 'Andere',
      createDailyTask: 'Tägliche Aufgabe Erstellen',
      priority: 'Priorität',
      date: 'Datum',
      estimatedMinutes: 'Geschätzte Min.',
      optional: 'Optional',
      high: 'Hoch',
      medium: 'Mittel',
      low: 'Niedrig',
      
      // Contact Support Modal
      howCanWeHelp: 'Wie können wir helfen?',
      subject: 'Betreff',
      message: 'Nachricht',
      weWillRespondTo: 'Wir werden antworten an:',
      generalQuestion: 'Allgemeine Frage',
      technicalIssue: 'Technisches Problem',
      feedback: 'Rückmeldung',
      featureRequest: 'Funktionsanfrage',
      
      // Progress indicators
      complete: 'Abgeschlossen',
      noDailyGoalsCompleted: 'Noch keine täglichen Ziele abgeschlossen',
      overallProgress: 'Gesamtfortschritt',
      combined: 'Kombiniert',
      totalTasksCompletedThisWeek: 'Aufgaben Diese Woche Abgeschlossen',
      hideCompleted: 'Abgeschlossene Ausblenden',
      showCompleted: 'Abgeschlossene Anzeigen',
      
      // Additional translations for remaining elements
      weeklyTasks: 'Wöchentliche Aufgaben',
      dailyGoalsToday: 'Tagesziele Heute',
      week: 'Woche',
      dailyGoals: 'Tagesziele',
      createYourFirstGoal: 'Erstellen Sie Ihr erstes Ziel',
      needHelp: 'Hilfe Benötigt?',
      questionsAboutCoachingPlan: 'Fragen zu Ihrem Coaching-Plan oder Fortschritt? Wir sind hier, um zu helfen.',
      contactSupport: 'Support Kontaktieren',
      addTask: 'Aufgabe Hinzufügen',
      taskTitle: 'Aufgabentitel',
      descriptionOptional: 'Beschreibung (Optional)',
      category: 'Kategorie',
      priority: 'Priorität',
      date: 'Datum',
      estMinutes: 'Geschätzte Min.',
      createDailyTask: 'Tägliche Aufgabe Erstellen',
      
      // CoachPreferenceSetup component - Setup Process
      setupProgress: 'Einrichtungsfortschritt',
      step: 'Schritt',
      of: 'von',
      stepOf: 'Schritt ${step} von ${total}',
      welcomeToAICoach: 'Willkommen bei Ihrem KI-Lebenscoach!',
      letsPersonalize: 'Lassen Sie uns Ihre Erfahrung personalisieren',
      personalizeExperience: 'Lassen Sie uns Ihre Erfahrung personalisieren. Auf welchen Bereich möchten Sie sich konzentrieren?',
      whatAreaFocus: 'Auf welchen Bereich möchten Sie sich konzentrieren?',
      primaryFocusArea: 'Primärer Fokusbereich',
      secondaryFocusArea: 'Sekundärer Fokusbereich',
      secondaryFocusOptional: 'Sekundärer Fokusbereich (Optional)',
      
      // Focus Areas
      financialHealth: 'Finanzielle Gesundheit',
      physicalHealth: 'Körperliche Gesundheit', 
      socialLife: 'Soziales Leben',
      personalGrowth: 'Persönliches Wachstum',
      budgetManagementWealth: 'Budgetverwaltung und Vermögensaufbau',
      fitnessNutritionWellness: 'Fitness, Ernährung und Wellness-Gewohnheiten',
      relationshipsSocial: 'Beziehungen und soziale Verbindungen',
      selfImprovementSkills: 'Selbstverbesserung und Kompetenzentwicklung',
      financialHealthDesc: 'Budgetverwaltung und Vermögensaufbau',
      physicalHealthDesc: 'Fitness, Ernährung und Wellness-Gewohnheiten',
      socialLifeDesc: 'Beziehungen und soziale Verbindungen',
      personalGrowthDesc: 'Selbstverbesserung und Kompetenzentwicklung',
      
      // Task Preferences
      taskPreferences: 'Aufgaben-Einstellungen',
      howManyTasks: 'An wie vielen Aufgaben möchten Sie arbeiten?',
      dailyTasksCount: 'Tägliche Aufgaben: ${count}',
      weeklyTasksCount: 'Wöchentliche Aufgaben: ${count}',
      taskDifficulty: 'Aufgaben-Schwierigkeit',
      oneTask: '1 Aufgabe',
      tasksRecommended: '3 Aufgaben (empfohlen)',
      threeTasksRecommended: '3 Aufgaben (empfohlen)',
      twoThreeRecommended: '2-3 (empfohlen)',
      fiveTasks: '5 Aufgaben',
      noWeeklyTasks: 'Keine wöchentlichen Aufgaben',
      recommendedTasks: '2-3 (empfohlen)',
      easy: 'Einfach',
      moderate: 'Mittel', 
      challenging: 'Herausfordernd',
      specificGoalsChallenges: 'Spezifische Ziele oder Herausforderungen (Optional)',
      specificGoalsPlaceholder: 'Z.B., \'Ich möchte dieses Jahr 5000€ sparen\' oder \'Ich brauche Hilfe beim Budgetieren und Schuldenabbau\'',
      
      // Coaching Style
      coachingStyle: 'Coaching-Stil',
      howInteractWithYou: 'Wie möchten Sie, dass ich mit Ihnen interagiere?',
      howToInteract: 'Wie möchten Sie, dass ich mit Ihnen interagiere?',
      coachingApproach: 'Coaching-Ansatz',
      supportive: 'Unterstützend',
      direct: 'Direkt',
      motivational: 'Motivierend',
      analytical: 'Analytisch',
      supportiveDesc: 'Sanfte Ermutigung und empathische Führung',
      directDesc: 'Direktes, handlungsorientiertes Coaching',
      motivationalDesc: 'Energiegeladener, inspirierender Ansatz',
      analyticalDesc: 'Datengesteuerte, logische Führung',
      motivationLevel: 'Motivationsniveau',
      gentle: 'Sanft',
      balanced: 'Ausgewogen',
      intense: 'Intensiv',
      softEncouragement: 'Sanfte Ermutigung',
      mixedApproach: 'Gemischter Ansatz',
      pushMeHard: 'Fordere mich stark',
      gentleDesc: 'Sanfte Ermutigung',
      balancedDesc: 'Gemischter Ansatz',
      intenseDesc: 'Fordere mich stark',
      
      // Check-in Preferences
      checkinPreferences: 'Check-in-Einstellungen',
      howOftenCheckin: 'Wie oft möchten Sie Ihren Fortschritt überprüfen?',
      howOftenCheckIn: 'Wie oft möchten Sie Ihren Fortschritt überprüfen?',
      checkinFrequency: 'Check-in-Häufigkeit',
      preferredCheckinTime: 'Bevorzugte Check-in-Zeit',
      daily: 'Täglich',
      weekly: 'Wöchentlich',
      biweekly: 'Zweiwöchentlich',
      youreAllSet: 'Sie sind bereit!',
      preferencesWillBeSaved: 'Ihre Einstellungen werden gespeichert und zur Personalisierung Ihrer Coaching-Erfahrung verwendet. Sie können diese Einstellungen jederzeit später aktualisieren.',
      completeSetup: 'Einrichtung Abschließen',
      saving: 'Speichern...',
      
      // Journal & Reflection
      dailyJournal: 'Tägliches Journal',
      reflectOnTodaysProgress: 'Reflektieren Sie über den heutigen Fortschritt',
      todaysReflection: 'Heutige Reflexion',
      yourThoughts: 'Ihre Gedanken',
      charactersCount: '${count} Zeichen',
      journalingTips: '💡 Journal-Tipps',
      beHonestAuthentic: '• Seien Sie ehrlich und authentisch mit Ihren Gedanken',
      focusSpecificExamples: '• Konzentrieren Sie sich auf spezifische Beispiele und Erfahrungen',
      considerWhatLearned: '• Überlegen Sie, was Sie gelernt haben und wie Sie sich verbessern können',
      celebrateSmallWins: '• Feiern Sie kleine Siege und gemachte Fortschritte',
      
      // Personal Goals
      personalGoals: 'Persönliche Ziele',
      setTrackObjectives: 'Setzen und verfolgen Sie Ihre Ziele',
      setAndTrackObjectives: 'Setzen und verfolgen Sie Ihre Ziele',
      yourCurrentGoals: 'Ihre Aktuellen Ziele',
      noGoalsSetYet: 'Noch keine Ziele gesetzt',
      addNewGoal: 'Neues Ziel hinzufügen',
      goalTitle: 'Ziel-Titel',
      targetOptional: 'Ziel (optional)',
      deadlineOptional: 'Frist (optional)',
      
      // Settings Display Labels
      focusArea: 'Fokusbereich',
      secondary: 'Sekundär:',
      taskFrequency: 'Aufgaben-Häufigkeit',
      assessmentSpecificSettings: 'Bewertungsspezifische Einstellungen',
      moderateDifficulty: 'mittlere Schwierigkeit',
      personal: 'persönlich',
      social: 'sozial',
      coachingStyleLabel: 'Coaching-Stil',
      motivationLevel: 'Motivationsniveau',
      daily: 'täglich',
      weekly: 'wöchentlich',
      difficulty: 'Schwierigkeit',
      
      // Navigation & Actions
      back: 'Zurück',
      next: 'Weiter',
      
      // Form Validation & Placeholders
      enterFullName: 'Vollständigen Namen eingeben',
      enterEmail: 'E-Mail eingeben',
      createPassword: 'Passwort erstellen',
      confirmPassword: 'Passwort bestätigen',
      yourName: 'Ihr Name',
      
      // Additional UI Elements
      createTasks: '+ Aufgaben Erstellen',
      setNewGoals: 'Neue Ziele Setzen',
      hereToHelpGrow: 'Hier um Ihnen beim Wachsen zu helfen',
      startAConversation: 'Eine Unterhaltung beginnen',
      askMeAboutProgress: 'Fragen Sie mich über Ihren Fortschritt, Ziele oder alles was mit Ihrer persönlichen Entwicklung zu tun hat.',
      coachCapabilitiesTitle: 'Ihr KI-Lebenscoach',
      coachCapabilitiesSubtitle: 'Ich bin hier, um Ihnen beim Wachstum und Erreichen Ihrer Ziele zu helfen. Das kann ich für Sie tun:',
      taskManagement: 'Aufgabenverwaltung',
      taskManagementDesc: 'Tägliche und wöchentliche Aufgaben erstellen, Erinnerungen setzen und Fortschritte verfolgen',
      progressTracking: 'Fortschrittverfolgung',
      progressTrackingDesc: 'Ihre Entwicklung in allen Lebensbereichen überwachen und Erfolge feiern',
      personalizedAdvice: 'Personalisierte Beratung',
      personalizedAdviceDesc: 'Maßgeschneiderte Anleitungen basierend auf Ihren Bewertungsergebnissen und Zielen erhalten',
      goalSetting: 'Zielsetzung',
      goalSettingDesc: 'Bedeutsame Ziele definieren und umsetzbare Pläne zu deren Erreichung erstellen',
      exampleQuestions: 'Versuchen Sie mich zu fragen:',
      viewFullReport: 'Vollständigen Bericht Anzeigen',
      deepAnalysisInsights: 'Tiefe Analyse und Einsichten',
      viewJournalEntries: 'Tagebucheinträge Anzeigen',
      readPastReflections: 'Lesen Sie Ihre vergangenen Reflexionen',
      noJournalEntries: 'Noch keine Tagebucheinträge',
      journalEntriesTitle: 'Tagebucheinträge',
      journalEntriesSubtitle: 'Ihre Reflexionen und Gedanken',
      briefDescription: 'Kurze Beschreibung Ihres Problems oder Ihrer Frage',
      message: 'Nachricht',
      pleaseProvideDetails: 'Bitte geben Sie so viele Details wie möglich an...',
      updateYourObjectives: 'Ihre Ziele aktualisieren',
      categorySelection: 'Kategorieauswahl',
      noGoalsSetYet: 'Noch keine Ziele gesetzt',
      category: 'Kategorie',
      goalTitle: 'Zieltitel',
      descriptionOptional: 'Beschreibung (optional)',
      targetOptional: 'Ziel (optional)',
      deadlineOptional: 'Frist (optional)',
      journalingTips: '💡 Tagebuch-Tipps',
      beHonestAuthentic: 'Seien Sie ehrlich und authentisch mit Ihren Gedanken',
      focusOnSpecificExamples: 'Konzentrieren Sie sich auf spezifische Beispiele und Erfahrungen',
      considerWhatYouLearned: 'Überlegen Sie, was Sie gelernt haben und wie Sie sich verbessern können',
      celebrateSmallWins: 'Feiern Sie kleine Siege und gemachten Fortschritt',
      reflectOnProgress: 'Reflektieren Sie über Ihren Fortschritt und feiern Sie Erfolge',
      selectCategory: 'Kategorie auswählen',
      goalTitlePlaceholder: 'z.B., 5.000 $ für Notfallfonds sparen',
      goalDescriptionPlaceholder: 'Beschreiben Sie Ihr Ziel und warum es für Sie wichtig ist...',
      goalTargetPlaceholder: 'z.B., 5.000 $, 10 Pfund, 30 Minuten täglich',
      taskTitlePlaceholder: 'Aufgabentitel eingeben...',
      taskDescriptionPlaceholder: 'Beschreiben Sie die Aufgabe...',
      
      // Journal & Buttons
      takeAMomentToReflect: 'Nehmen Sie sich einen Moment Zeit, um über Ihren Tag, Fortschritt, Herausforderungen und Einsichten zu reflektieren',
      cancel: 'Abbrechen',
      saveEntry: 'Eintrag Speichern',
      createGoal: 'Ziel Erstellen',
      weekNumber: 'Woche',
      dailyCheckIn: 'Täglicher Check-in',
      
      // Configuration Display
      moderateDifficulty: 'moderate Schwierigkeit'
    },

    // Prädiktive Einblicke
    insights: {
      // Hauptkomponenten-Header
      aiPredictiveInsights: 'KI Prädiktive Einblicke',
      aiInsights: 'KI-Einblicke',
      quickInsights: 'KI-Einblicke',
      
      // Beschreibungstext
      insightsBasedOnAssessment: 'Einblicke basierend auf Ihren Bewertungsantworten und Coaching-Interaktionen',
      insightsBasedOnAllAssessments: 'Einblicke basierend auf all Ihren Bewertungen und Coaching-Interaktionen',
      analyzingPatterns: 'Analysiere Ihre Muster...',
      gatheringData: 'Sammle Daten zur Generierung personalisierter Einblicke...',
      noMoreInsights: 'Keine weiteren Einblicke zu zeigen. Schauen Sie später für neue Vorhersagen vorbei!',
      checkBackLater: 'Schauen Sie später für neue Vorhersagen vorbei!',
      
      // Einblick-Typ Labels
      riskAlert: 'Risiko-Warnung',
      patternForecast: 'Muster-Vorhersage',
      smartRecommendation: 'Intelligente Empfehlung',
      strategicTiming: 'Strategisches Timing',
      deepInsights: 'Tiefe Einblicke',
      
      // Einblick-Typ Beschreibungen
      riskAlertDesc: 'Potenzielle Herausforderungen voraus',
      patternForecastDesc: 'Ihre Verhaltensmuster',
      smartRecommendationDesc: 'Für Ihren Erfolg optimiert',
      strategicTimingDesc: 'Optimale Interventionsmomente',
      deepInsightsDesc: 'Musterbasiertes Coaching',
      
      // Prioritäts-Labels
      highPriority: 'Hohe Priorität',
      mediumPriority: 'Mittlere Priorität',
      lowPriority: 'Niedrige Priorität',
      confident: 'sicher',
      
      // Filter-Labels
      allInsights: 'Alle',
      
      // Aktions-Labels
      viewActions: 'Aktionen Anzeigen',
      suggestedActions: 'Vorgeschlagene Aktionen',
      dismissInsight: 'Einblick verwerfen',
      refreshInsights: 'Einblicke aktualisieren',
      tryAgain: 'Erneut versuchen',
      
      // Metadaten
      cached: 'Zwischengespeichert',
      cachedFrom: 'Zwischengespeichert von',
      generated: 'Generiert',
      expires: 'Läuft ab',
      fromCache: 'Aus Cache',
      confidenceHigh: 'Hoch',
      confidenceMedium: 'Mittel',
      confidenceLow: 'Niedrig',
      allAssessmentsMode: 'Alle-Bewertungen-Modus',
      
      // Fehlermeldungen
      errorLoadingInsights: 'Fehler beim Laden der Einblicke',
      
      // Spezifische Einblick-Nachrichten
      taskCompletionRisk: 'Aufgabenabschluss-Risiko-Warnung',
      streakAtRisk: 'Serie in Gefahr!',
      peakProductivityDetected: 'Höchste Produktivität Erkannt',
      weeklyPatternIdentified: 'Wöchentliches Muster Identifiziert',
      productivityDeclineDetected: 'Produktivitätsrückgang Erkannt',
      productivitySurge: 'Produktivitätsschub!',
      cohortSuccessPattern: 'Kohorten-Erfolgsmuster',
      focusAreaIdentified: 'Fokusbereich Identifiziert',
      optimalTaskLoad: 'Optimale Aufgabenlast',
      strategicPlanningAlert: 'Strategische Planungswarnung',
      energyManagementTip: 'Energiemanagement-Tipp',
      burnoutPreventionAlert: 'Burnout-Präventions-Warnung',
      moodPerformanceConnection: 'Stimmung-Leistung-Verbindung',
      goalAchievementPattern: 'Zielerreichungsmuster',
      taskTimingPattern: 'Aufgaben-Timing-Muster',
      
      // Allgemeine Aktionsvorschläge
      scheduleTasksOptimalTime: 'Planen Sie Aufgaben für Ihre produktivste Zeit',
      setReminder30Minutes: 'Setzen Sie eine Erinnerung 30 Minuten vor Ihrer üblichen Aufgabenzeit',
      prepareMaterialsTonight: 'Bereiten Sie Materialien heute Abend vor, um morgen Reibung zu reduzieren',
      breakTasksIntoSteps: 'Erwägen Sie, Aufgaben in kleinere Schritte zu unterteilen',
      completeOneMoreTask: 'Vervollständigen Sie mindestens eine weitere Aufgabe, um den Schwung aufrechtzuerhalten',
      focusOnQuickWins: 'Konzentrieren Sie sich auf schnelle Erfolge, um die Abschlussrate zu steigern',
      setTimer25Minutes: 'Setzen Sie einen Timer für 25 Minuten und gehen Sie Ihre einfachste Aufgabe an',
      tryOptimalTimeForWeek: 'Versuchen Sie eine Woche lang, Aufgaben zur optimalen Zeit zu erledigen',
      setDailyReminders: 'Setzen Sie tägliche Erinnerungen für diese optimale Zeit',
      trackCompletionRate: 'Verfolgen Sie, ob dieses Timing Ihre Abschlussrate verbessert',
      adjustSchedule: 'Passen Sie Ihren Zeitplan an, um diese Zeit zu schützen',
      planChallengingTasks: 'Planen Sie herausfordernde Aufgaben für diesen Tag',
      useOptimalDay: 'Nutzen Sie diesen Tag für wichtige Zielfortschritte',
      scheduleEasierTasks: 'Planen Sie einfachere Aufgaben an weniger produktiven Tagen',
      reviewSimplifyGoals: 'Überprüfen und vereinfachen Sie Ihre aktuellen Ziele',
      takeShortBreak: 'Machen Sie eine kurze Pause, um Burnout zu verhindern',
      focusOneCategory: 'Konzentrieren Sie sich auf eine Kategorie zur Zeit',
      adjustTaskDifficulty: 'Erwägen Sie, die Aufgabenschwierigkeit anzupassen',
      documentWhatWorks: 'Dokumentieren Sie, was für Sie funktioniert',
      increaseTaskDifficulty: 'Erwägen Sie, die Aufgabenschwierigkeit zu erhöhen',
      shareSuccessStrategies: 'Teilen Sie Ihre Erfolgsstrategien',
      setAmbitiousGoals: 'Setzen Sie sich ehrgeizigere Ziele',
      prePlanSimpleWins: 'Planen Sie einfache Erfolge für herausfordernde Tage vor',
      scheduleFavoriteActivities: 'Planen Sie Ihre Lieblingsaktivitäten als Belohnungen',
      prepareEverythingNight: 'Bereiten Sie alles am Vorabend vor',
      partnerAccountability: 'Partnern Sie sich mit jemandem für Verantwortlichkeit',
      makeRestPlanningDay: 'Erwägen Sie, dies zu einem Ruhe- oder Planungstag zu machen',
      scheduleBreaksBeforeEnergyDips: 'Planen Sie Pausen vor Energietiefs',
      planEnergizingActivities: 'Planen Sie energetisierende Aktivitäten für schwache Punkte',
      adjustMealTiming: 'Passen Sie die Mahlzeitenzeiten für nachhaltige Energie an',
      try10MinuteWalk: 'Versuchen Sie einen 10-minütigen Spaziergang während Zeiten niedriger Energie',
      takeCompleteRestDay: 'Nehmen Sie sich diese Woche einen kompletten Ruhetag',
      reduceTaskLoad30Percent: 'Reduzieren Sie die Aufgabenlast um 30% für 3 Tage',
      focusEssentialTasks: 'Konzentrieren Sie sich nur auf wesentliche Aufgaben',
      scheduleEnjoyableActivity: 'Planen Sie etwas Angenehmes und Entspannendes',
      practiceSayingNo: 'Üben Sie, nein zu zusätzlichen Verpflichtungen zu sagen',
      noticeWhatCreatesMood: 'Bemerken Sie, was positive Stimmungszustände schafft',
      planImportantTasksGoodMood: 'Planen Sie wichtige Aufgaben, wenn Sie sich positiv fühlen',
      developShiftingStrategies: 'Entwickeln Sie Strategien, um sich von negativen Zuständen zu lösen',
      keepJournaling: 'Führen Sie weiterhin Tagebuch, um das Selbstbewusstsein zu vertiefen',
      considerMoodBoostingActivities: 'Erwägen Sie stimmungsaufhellende Aktivitäten vor Aufgaben',
      breakLongTermGoals: 'Teilen Sie langfristige Ziele in kleinere Meilensteine auf',
      celebrateHalfwayPoint: 'Feiern Sie Fortschritte am Halbzeitpunkt',
      reviewGoalsWeekly: 'Überprüfen Sie Ziele wöchentlich, um den Schwung aufrechtzuerhalten',
      try2MinuteRule: 'Versuchen Sie die 2-Minuten-Regel für schnelle Aufgaben',
      scheduleTasksImmediately: 'Planen Sie Aufgaben sofort nach dem Erstellen',
      setCompletionDeadlines: 'Setzen Sie Abschlussfristen beim Erstellen von Aufgaben',
      useTimeBlocking: 'Verwenden Sie Zeitblockierung, um pünktlichen Abschluss sicherzustellen',
    },

    dashboard: {
      welcome: 'Willkommen',
      welcomeBack: 'Willkommen zurück',
      subtitle: 'Verfolgen Sie Ihre Lebensleistung und setzen Sie Ihre Verbesserungsreise fort.',
      assessments: 'Bewertungen',
      totalCompleted: 'Insgesamt abgeschlossen',
      dayStreak: 'Tage-Serie',
      startStreak: 'Starten Sie Ihre Serie!',
      greatStart: 'Großartiger Start!',
      daysInRow: 'Tage in Folge',
      latestScore: 'Neueste Punktzahl',
      outOf100: 'Von 100',
      percentile: 'Perzentil',
      amongPeers: 'Unter Gleichaltrigen',
      yourAssessments: 'Ihre Bewertungen',
      takeNewAssessment: 'Neue Bewertung',
      noAssessmentsYet: 'Noch keine Bewertungen',
      noAssessmentsDesc: 'Machen Sie Ihre erste Lebensbewertung, um mit der Verfolgung Ihrer Leistung zu beginnen.',
      takeAssessment: 'Bewertung Machen',
      viewResults: 'Ergebnisse Anzeigen',
      aiCoach: 'KI-Coach',
      getAiCoach: 'KI-Coach Holen',
      viewReport: 'Bericht Anzeigen',
      deepReport: 'Detailbericht',
      lifeAssessment: 'Lebensbewertung',
      quickActions: 'Schnelle Aktionen',
      newAssessment: 'Neue Bewertung',
      aiCoachDashboard: 'KI-Coach Dashboard',
      upgradeToAiCoach: 'Auf KI-Coach Upgraden',
      takeAssessmentUpgrade: 'Bewertung Machen & Upgraden',
      account: 'Konto',
      email: 'E-Mail',
      plan: 'Plan',
      aiCoachPro: 'KI-Coach Pro',
      free: 'Kostenlos',
      bestStreak: 'Beste Serie',
      days: 'Tage',
      lastLogin: 'Letzte Anmeldung',
      youAre: 'Sie sind ein',
      accountSettings: 'Kontoeinstellungen',
      recentActivity: 'Letzte Aktivitäten',
      averageLoginTime: 'Durchschnittliche Anmeldezeit',
      needHelp: 'Hilfe Benötigt?',
      needHelpDesc: 'Erhalten Sie Support oder erfahren Sie mehr über die Verbesserung Ihrer Lebenspunktzahl.',
      contactSupport: 'Support Kontaktieren',
      monday: 'Montag',
      tuesday: 'Dienstag',
      wednesday: 'Mittwoch',
      thursday: 'Donnerstag',
      friday: 'Freitag',
      saturday: 'Samstag',
      sunday: 'Sonntag',
      yourTasks: 'Ihre Aufgaben',
      viewAiCoach: 'KI-Coach Anzeigen',
      todaysTasks: 'Heutige Aufgaben',
      thisWeeksTasks: 'Aufgaben Dieser Woche'
    },
    settings: {
      accountSettings: 'Kontoeinstellungen',
      profileInformation: 'Profilinformationen',
      accountName: 'Kontoname',
      enterAccountName: 'Geben Sie Ihren Konto-Anzeigenamen ein',
      accountNameDesc: 'Dieser Name wird in Ihrem Konto angezeigt',
      country: 'Land',
      selectCountry: 'Land Auswählen',
      gender: 'Geschlecht',
      selectGender: 'Geschlecht Auswählen',
      male: 'Männlich',
      female: 'Weiblich',
      other: 'Andere',
      preferNotToSay: 'Möchte nicht sagen',
      changePassword: 'Passwort Ändern',
      currentPassword: 'Aktuelles Passwort',
      enterCurrentPassword: 'Aktuelles Passwort eingeben',
      newPassword: 'Neues Passwort',
      enterNewPassword: 'Neues Passwort eingeben',
      confirmPassword: 'Neues Passwort Bestätigen',
      confirmNewPassword: 'Neues Passwort bestätigen',
      passwordFieldsDesc: 'Lassen Sie die Passwort-Felder leer, wenn Sie Ihr Passwort nicht ändern möchten',
      cancel: 'Abbrechen',
      saving: 'Speichern...',
      saveChanges: 'Änderungen Speichern',
      settingsUpdated: 'Einstellungen erfolgreich aktualisiert!',
      emailCannotChange: 'E-Mail kann nicht geändert werden'
    },
    countries: {
      us: 'Vereinigte Staaten',
      uk: 'Vereinigtes Königreich',
      ca: 'Kanada',
      au: 'Australien',
      de: 'Deutschland',
      fr: 'Frankreich',
      other: 'Andere'
    },
    assessment: {
      // Basic Assessment
      lifeAssessment: 'Lebensbewertung',
      assessmentDesc: 'Beantworten Sie Fragen zu verschiedenen Bereichen Ihres Lebens, um Ihre Gesamtpunktzahl zu erhalten.',
      getStarted: 'Loslegen',
      question: 'Frage',
      of: 'von',
      next: 'Weiter',
      previous: 'Zurück',
      submit: 'Bewertung Einreichen',
      selectOption: 'Bitte wählen Sie eine Option',
      completing: 'Ihre Bewertung wird abgeschlossen...',
      almostDone: 'Fast fertig!',
      
      // Cohort Setup
      letsGetStarted: 'Lassen Sie uns beginnen',
      basicInformation: 'Grundinformationen',
      basicInformationDesc: 'Zuerst benötigen wir einige grundlegende Informationen, um Sie mit Ihren Altersgenossen zu vergleichen.',
      age: 'Alter',
      enterYourAge: 'Geben Sie Ihr Alter ein',
      country: 'Land',
      selectYourCountry: 'Wählen Sie Ihr Land',
      gender: 'Geschlecht',
      selectGender: 'Geschlecht wählen',
      male: 'Männlich',
      female: 'Weiblich',
      other: 'Andere',
      preferNotToSay: 'Möchte nicht sagen',
      startAssessment: 'Bewertung Starten',
      informationConfidential: 'Ihre Informationen werden vollständig vertraulich behandelt',
      
      // Questions Interface
      complete: 'Vollständig',
      justGettingStarted: 'Gerade erst angefangen...',
      makingGreatProgress: 'Großartige Fortschritte gemacht!',
      halfwayThere: 'Sie sind auf halbem Weg!',
      almostFinished: 'Fast fertig!',
      justAFewMore: 'Nur noch ein paar!',
      back: 'Zurück',
      review: 'Überprüfen',
      continueToQuestions: 'Weiter zu den Fragen',
      
      // Categories
      financial: 'Finanziell',
      healthFitness: 'Gesundheit & Fitness',
      social: 'Sozial',
      romantic: 'Romantisch',
      personal: 'Persönlich',
      career: 'Karriere',
      personalGrowth: 'Persönliche Entwicklung',
      
      // Category Descriptions
      financialHealthName: 'Finanzielle Gesundheit',
      financialHealthIntroduction: 'Lassen Sie uns Ihre finanzielle Grundlage und Ihren Vermögensaufbau erkunden.',
      financialHealthDescription: 'Das Verständnis Ihrer finanziellen Gesundheit hilft dabei, Möglichkeiten für Sicherheit und Wohlstand zu identifizieren.',
      physicalWellnessName: 'Körperliches Wohlbefinden',
      physicalWellnessIntroduction: 'Nun lassen Sie uns Ihre körperliche Gesundheit und Ihren Fitnessweg bewerten.',
      physicalWellnessDescription: 'Ihr körperliches Wohlbefinden beeinflusst jeden Aspekt Ihres Lebens, von der Energie bis zum Selbstvertrauen.',
      socialNetworkName: 'Soziales Netzwerk',
      socialNetworkIntroduction: 'Lassen Sie uns Ihre Beziehungen und sozialen Verbindungen erkunden.',
      socialNetworkDescription: 'Starke soziale Verbindungen sind fundamental für Glück und Lebenszufriedenheit.',
      romanticName: 'Romantisch',
      romanticIntroduction: 'Lassen Sie uns über Ihr romantisches Leben und Ihre Beziehungszufriedenheit sprechen.',
      romanticDescription: 'Romantische Beziehungen beeinflussen die allgemeine Lebenszufriedenheit und das emotionale Wohlbefinden erheblich.',
      careerDevelopmentName: 'Karriereentwicklung',
      careerDevelopmentIntroduction: 'Lassen Sie uns Ihr berufliches Wachstum und Ihre Karrierezufriedenheit untersuchen.',
      careerDevelopmentDescription: 'Karriereentwicklung beeinflusst finanzielle Sicherheit, persönliche Erfüllung und Lebensrichtung.',
      personalGrowthName: 'Persönliche Entwicklung',
      personalGrowthIntroduction: 'Schließlich erkunden wir Ihre persönliche Entwicklung und Ihren Selbstverbesserungsweg.',
      personalGrowthDescription: 'Persönliche Entwicklungsaktivitäten tragen zur langfristigen Erfüllung und kontinuierlichen Verbesserung bei.',
      
      // Review Page
      reviewYourAssessment: 'Überprüfen Sie Ihre Bewertung',
      checkResponsesDesc: 'Überprüfen Sie Ihre Antworten, bevor Sie Ihre Lebensbewertung erhalten',
      editAnswers: 'Antworten Bearbeiten',
      getMyResults: 'Meine Ergebnisse Abrufen',
      
      // Category Names (for review)
      financialHealth: 'Finanzielle Gesundheit',
      physicalWellness: 'Körperliches Wohlbefinden',
      socialNetwork: 'Soziales Netzwerk',
      personalGrowthCategory: 'Persönliche Entwicklung',
      careerDevelopment: 'Karriereentwicklung'
    },
    scorecard: {
      yourResults: 'Ihre Ergebnisse',
      overallScore: 'Gesamtpunktzahl',
      percentileRank: 'Perzentil-Rang',
      categoryBreakdown: 'Kategorieaufschlüsselung',
      getAiCoach: 'KI-Coach Holen',
      getDeepReport: 'Detailbericht Holen',
      shareResults: 'Ergebnisse Teilen',
      takeAnother: 'Weitere Bewertung Machen',
      loading: 'Ihre Ergebnisse werden geladen...'
    },
    common: {
      loading: 'Lädt...',
      error: 'Fehler',
      success: 'Erfolg',
      save: 'Speichern',
      cancel: 'Abbrechen',
      close: 'Schließen',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      confirm: 'Bestätigen',
      back: 'Zurück',
      continue: 'Fortfahren',
      finish: 'Fertig',
      yes: 'Ja',
      no: 'Nein',
      today: 'Heute',
      yesterday: 'Gestern',
      thisWeek: 'Diese Woche',
      lastWeek: 'Letzte Woche',
      language: 'Sprache'
    },
    about: {
      backToHome: 'Zurück zur Startseite',
      aboutRankMe: 'Über RankMe',
      aboutSubtitle: 'Wir glauben, dass jeder verdient zu verstehen, wo er steht und wie er sich verbessern kann. RankMe bietet datengestützte Einblicke in Ihre Lebensleistung in den Dimensionen, die am wichtigsten sind.',
      ourMission: 'Unsere Mission',
      ourMissionDesc: 'Den Zugang zu umfassender Lebensbewertung und personalisierten Verbesserungsstrategien zu demokratisieren und Millionen von Menschen zu helfen, bessere Ergebnisse in allen Lebensbereichen zu erzielen.',
      whatMakesUsDifferent: 'Was Uns Anders Macht',
      whatMakesUsDesc: 'Im Gegensatz zu generischer Selbsthilfe oder Universallösungen bietet RankMe personalisierte, datengestützte Einblicke basierend auf Ihrer einzigartigen Situation und Vergleichen mit Gleichaltrigen.',
      evidenceBased: 'Evidenzbasiert',
      evidenceBasedDesc: 'Unsere Bewertung basiert auf psychologischer Forschung und ist bei Tausenden von Benutzern validiert. Jede Empfehlung wird von Daten gestützt, nicht von Meinung.',
      peerCalibrated: 'Gleichaltrigenbasiert Kalibriert',
      peerCalibratedDesc: 'Ihre Ergebnisse werden mit Menschen verglichen, die Ihnen in Alter, Hintergrund und Umständen ähnlich sind. Sehen Sie, wo Sie wirklich stehen, nicht wo Sie denken zu stehen.',
      aiPowered: 'KI-Gestützt',
      aiPoweredDesc: 'Unser KI-Coaching-System passt sich an Ihren Fortschritt an und bietet personalisierte Wochenpläne und tägliche Motivation, die auf Ihre spezifischen Ziele und Herausforderungen zugeschnitten ist.',
      fourLifeDimensions: 'Die Vier Lebensdimensionen',
      fourDimensionsDesc: 'Unsere umfassende Bewertung deckt die Schlüsselbereiche ab, die laut Forschung Lebenszufriedenheit und langfristigen Erfolg antreiben.',
      financialHealthDim: 'Finanzielle Gesundheit',
      financialHealthDimDesc: 'Einkommen, Ersparnisse, Investitionen und Finanzplanung über 8 Schlüsselmetriken',
      physicalWellnessDim: 'Körperliches Wohlbefinden',
      physicalWellnessDimDesc: 'Fitness, Ernährung, Schlaf und allgemeine Gesundheitsgewohnheiten über 8 Dimensionen',
      socialNetworkDim: 'Soziales Netzwerk',
      socialNetworkDimDesc: 'Beziehungen, soziale Verbindungen und Netzwerkqualität über 8 Faktoren',
      personalGrowthDim: 'Persönliches Wachstum',
      personalGrowthDimDesc: 'Berufszufriedenheit, Ziele, Lernen und Lebenserfüllung über 8 Bereiche',
      ourApproach: 'Unser Ansatz',
      comprehensiveAssessmentStep: 'Umfassende Bewertung',
      comprehensiveAssessmentDesc: 'Unsere 32-Fragen-Bewertung deckt alle wichtigen Lebensdimensionen ab. Im Gegensatz zu oberflächlichen Umfragen tauchen wir tief in die spezifischen Verhaltensweisen und Umstände ein, die Ergebnisse antreiben.',
      dataDrivenInsights: 'Datengestützte Einblicke',
      dataDrivenInsightsDesc: 'Ihre Antworten werden gegen unsere Datenbank von über 10.000 Bewertungen analysiert und liefern genaue Perzentil-Rankings und identifizieren Ihre Top-Stärken und Möglichkeiten.',
      personalizedActionPlans: 'Personalisierte Aktionspläne',
      personalizedActionPlansDesc: 'Basierend auf Ihren spezifischen Ergebnissen generieren wir maßgeschneiderte 30-Tage-Aktionspläne mit priorisierten Schritten, die die höchste Wirkung für Ihre einzigartige Situation liefern.',
      ongoingSupport: 'Laufende Unterstützung',
      ongoingSupportDesc: 'Unser KI-Coaching-System bietet tägliche Check-ins, wöchentliche Plan-Updates und kontinuierliche Motivation, um Ihnen zu helfen, auf Kurs zu bleiben und dauerhafte Veränderungen zu erreichen.',
      privacySecurityFirst: 'Datenschutz und Sicherheit Zuerst',
      privacySecurityDesc: 'Ihre persönlichen Informationen und Bewertungsergebnisse werden mit dem höchsten Maß an Sicherheit und Datenschutz behandelt.',
      noDataSelling: 'Kein Datenverkauf',
      noDataSellingDesc: 'Wir verkaufen niemals Ihre persönlichen Informationen oder Bewertungsergebnisse an Dritte. Ihre Daten gehören Ihnen.',
      encryptedStorage: 'Verschlüsselte Speicherung',
      encryptedStorageDesc: 'Alle Daten sind sowohl bei der Übertragung als auch bei der Speicherung mit branchenüblichen Sicherheitsprotokollen verschlüsselt.',
      anonymousAnalytics: 'Anonyme Analysen',
      anonymousAnalyticsDesc: 'Wenn wir Daten für die Forschung verwenden, sind sie vollständig anonymisiert ohne persönliche Identifikatoren.',
      trustedByThousands: 'Vertraut von Tausenden',
      trustedDesc: 'Treten Sie der wachsenden Gemeinschaft von Menschen bei, die datengestützte Einblicke nutzen, um ihr Leben zu verbessern',
      assessmentsCompleted: 'Bewertungen Abgeschlossen',
      averageUserRating: 'Durchschnittliche Benutzerbewertung',
      dataPointsAnalyzed: 'Analysierte Datenpunkte',
      readyToGetStarted: 'Bereit zu Beginnen?',
      takeFirstStep: 'Machen Sie den ersten Schritt zu einem besseren Leben mit unserer umfassenden Bewertung.',
      takeAssessment: 'Kostenlose Bewertung Machen'
    },
    pricing: {
      // Header
      backToHome: 'Zurück zur Startseite',
      pageTitle: 'Wählen Sie Ihren Weg zum Wachstum',
      pageSubtitle: 'Ob Sie tiefgreifende Einblicke oder kontinuierliche Coaching-Unterstützung wünschen, wir haben die perfekte Option, um Ihre Lebensleistung zu verbessern.',
      
      // Billing Cycle
      monthly: 'Monatlich',
      yearly: 'Jährlich (25% sparen)',
      
      // Free Assessment Plan
      freeAssessment: 'Kostenlose Bewertung',
      freeAssessmentDesc: 'Perfekt für den Einstieg',
      freePrice: '0€',
      alwaysFree: 'Immer kostenlos',
      freeFeature1: 'Vollständige 32-Fragen-Bewertung',
      freeFeature2: 'Grundlegende Perzentil-Rankings',
      freeFeature3: 'Kategoriebasierte Leistungsaufschlüsselung',
      freeFeature4: 'Top-Stärken und Verbesserungsmöglichkeiten',
      startFreeAssessment: 'Kostenlose Bewertung Starten',
      
      // Deep Report Plan
      mostPopular: 'BELIEBTESTE',
      deepAnalysisReport: 'Tiefgehender Analysebericht',
      deepAnalysisDesc: 'Umfassende Einblicke und Aktionsplan',
      deepPrice: '29€',
      oneTimePurchase: 'Einmalige Zahlung',
      deepFeature1: 'Alles aus der kostenlosen Bewertung',
      deepFeature2: 'Detaillierte Kategorieanalyse',
      deepFeature3: 'Personalisierter 30-Tage-Aktionsplan',
      deepFeature4: 'Vergleiche mit Gleichaltrigen',
      deepFeature5: 'Professioneller PDF-Download',
      deepFeature6: '30-Tage-Geld-zurück-Garantie',
      getDeepAnalysis: 'Tiefgehende Analyse Erhalten',
      
      // AI Coach Plan
      aiLifeCoach: 'KI-Lebenscoach',
      aiCoachDesc: 'Kontinuierliche Unterstützung und Verantwortlichkeit',
      monthlyPrice: '19€',
      yearlyPrice: '14€',
      perMonth: 'pro Monat',
      billedYearly: ', jährlich abgerechnet',
      savePerYear: 'Sparen Sie 60€/Jahr',
      aiCoachFeature1: 'Alles im tiefgehenden Bericht',
      aiCoachFeature2: 'Wöchentliche personalisierte Pläne',
      aiCoachFeature3: 'Tägliche KI-Coach-Check-ins',
      aiCoachFeature4: 'Fortschrittsverfolgung und Analysen',
      aiCoachFeature5: 'Monatliche Neubewertungen',
      aiCoachFeature6: 'Jederzeit kündbar',
      startFreeTrial: 'Kostenlose Testversion Starten',
      sevenDaysFree: 'Erste 7 Tage kostenlos',
      
      // Feature Comparison
      featureComparison: 'Funktionsvergleich',
      features: 'Funktionen',
      free: 'Kostenlos',
      deepReport: 'Tiefgehender Bericht',
      aiCoach: 'KI-Coach',
      feature32Question: '57-Fragen-Bewertung',
      featureBasicRankings: 'Grundlegende Perzentil-Rankings',
      featureDetailedAnalysis: 'Detaillierte Analyse und Einblicke',
      feature30DayPlan: '30-Tage-Plan',
      featurePdfDownload: 'PDF-Download',
      featureWeeklyPlans: 'Wöchentliche Coaching-Pläne',
      featureDailyCheckins: 'Tägliche KI-Check-ins',
      featureProgressTracking: 'Fortschrittsverfolgung',
      
      // Trust Indicators
      thirtyDayGuarantee: '30-Tage-Garantie',
      guaranteeDesc: 'Nicht zufrieden? Erhalten Sie eine vollständige Rückerstattung innerhalb von 30 Tagen, ohne Fragen.',
      rating: '4,8/5 Bewertung',
      ratingDesc: 'Vertraut von über 10.000 Nutzern, die ihr Leben mit RankMe verbessert haben.',
      instantAccess: 'Sofortiger Zugriff',
      instantAccessDesc: 'Erhalten Sie sofortigen Zugriff auf Ihre personalisierten Einblicke und Coaching-Tools.',
      
      // FAQ
      faqTitle: 'Häufig Gestellte Fragen',
      faq1Question: 'Kann ich von der kostenlosen Version upgraden?',
      faq1Answer: 'Auf jeden Fall! Sie können den tiefgehenden Bericht kaufen oder ein KI-Coach-Abonnement jederzeit nach Abschluss Ihrer kostenlosen Bewertung starten.',
      faq2Question: 'Was ist in der 7-tägigen Testversion enthalten?',
      faq2Answer: 'Die KI-Coach-Testversion umfasst alle Premium-Funktionen: personalisierte Wochenpläne, tägliche Check-ins, Fortschrittsverfolgung und unbegrenzten Zugang zu Coaching-Tools.',
      faq3Question: 'Wie genau sind die Ergebnisse?',
      faq3Answer: 'Unsere Bewertung basiert auf validierter Forschung und ist gegen über 10.000 Antworten kalibriert. Die Ergebnisse sind so genau wie die Informationen, die Sie bereitstellen.',
      faq4Question: 'Kann ich mein Abonnement jederzeit kündigen?',
      faq4Answer: 'Ja, Sie können Ihr KI-Coach-Abonnement jederzeit über Ihre Kontoeinstellungen kündigen. Sie behalten den Zugriff bis zum Ende Ihrer aktuellen Abrechnungsperiode.',
      faq5Question: 'Sind meine Daten sicher und privat?',
      faq5Answer: 'Absolut. Wir verwenden Verschlüsselung auf Bankniveau und verkaufen niemals Ihre persönlichen Daten. Lesen Sie unsere Datenschutzrichtlinie für alle Details.',
      faq6Question: 'Welche Zahlungsmethoden akzeptieren Sie?',
      faq6Answer: 'Wir akzeptieren alle gängigen Kreditkarten über Stripe, unseren sicheren Zahlungsabwickler. Alle Transaktionen sind verschlüsselt und PCI-konform.',
      
      // CTA Section
      ctaTitle: 'Bereit, Ihr Leben zu Transformieren?',
      ctaSubtitle: 'Schließen Sie sich Tausenden von Menschen an, die RankMe verwendet haben, um ihre Stärken zu verstehen, Möglichkeiten zu identifizieren und dauerhafte positive Veränderungen zu schaffen.',
      ctaStartAssessment: 'Kostenlose Bewertung Starten',
      ctaViewSample: 'Beispielbericht Ansehen'
    },
    loginPatterns: {
      earlyBird: 'Frühaufsteher',
      nightOwl: 'Nachteule',
      consistent: 'Regelmäßiger Nutzer',
      weekend: 'Wochenend-Nutzer',
      weekday: 'Werktag-Nutzer',
      irregular: 'Unregelmäßiger Nutzer'
    }
  }
}
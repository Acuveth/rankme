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
    
    // Categories
    financial: string
    healthFitness: string
    social: string
    romantic: string
    personal: string
    career: string
    personalGrowth: string
    
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
    good: string
    average: string
    needsImprovement: string
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
  | 'scorecard.good'
  | 'scorecard.average'
  | 'scorecard.needsImprovement'
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
      good: 'Good',
      average: 'Average',
      needsImprovement: 'Needs Improvement'
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
      financialJournalPrompt: 'How did you manage your finances today? What progress did you make toward your financial goals?',
      healthJournalPrompt: 'How did you take care of your health today? What healthy choices did you make?',
      socialJournalPrompt: 'How did you connect with others today? What social interactions brought you joy?',
      personalJournalPrompt: 'What did you learn about yourself today? How did you grow personally?'
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
      contactSupport: 'Contact Support'
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
      
      // Categories
      financial: 'Financial',
      healthFitness: 'Health & Fitness',
      social: 'Social',
      romantic: 'Personal',
      personal: 'Personal',
      career: 'Career',
      personalGrowth: 'Personal Growth',
      
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
      language: 'Language'
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
      feature32Question: '32-Question Assessment',
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
      good: 'Bueno',
      average: 'Promedio',
      needsImprovement: 'Necesita Mejora'
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
      financialJournalPrompt: '¿Cómo manejaste tus finanzas hoy? ¿Qué progreso hiciste hacia tus objetivos financieros?',
      healthJournalPrompt: '¿Cómo cuidaste tu salud hoy? ¿Qué elecciones saludables hiciste?',
      socialJournalPrompt: '¿Cómo te conectaste con otros hoy? ¿Qué interacciones sociales te trajeron alegría?',
      personalJournalPrompt: '¿Qué aprendiste sobre ti mismo hoy? ¿Cómo creciste personalmente?'
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
      contactSupport: 'Contactar Soporte'
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
      
      // Categories
      financial: 'Financiero',
      healthFitness: 'Salud y Estado Físico',
      social: 'Social',
      romantic: 'Personal',
      personal: 'Personal',
      career: 'Carrera',
      personalGrowth: 'Crecimiento Personal',
      
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
    coach: {
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
      viewProgress: 'Ver Progreso'
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
      language: 'Idioma'
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
      feature32Question: 'Evaluación de 32 Preguntas',
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
      good: 'Bon',
      average: 'Moyen',
      needsImprovement: 'Besoin d\'Amélioration'
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
      financialJournalPrompt: 'Comment avez-vous géré vos finances aujourd\'hui ? Quels progrès avez-vous fait vers vos objectifs financiers ?',
      healthJournalPrompt: 'Comment avez-vous pris soin de votre santé aujourd\'hui ? Quels choix sains avez-vous fait ?',
      socialJournalPrompt: 'Comment vous êtes-vous connecté aux autres aujourd\'hui ? Quelles interactions sociales vous ont apporté de la joie ?',
      personalJournalPrompt: 'Qu\'avez-vous appris sur vous-même aujourd\'hui ? Comment avez-vous grandi personnellement ?'
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
      contactSupport: 'Contacter le Support'
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
      
      // Categories
      financial: 'Financier',
      healthFitness: 'Santé et Forme',
      social: 'Social',
      romantic: 'Personnel',
      personal: 'Personnel',
      career: 'Carrière',
      personalGrowth: 'Développement Personnel',
      
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
    coach: {
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
      viewProgress: 'Voir le Progrès'
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
      feature32Question: 'Évaluation de 32 Questions',
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
      good: 'Gut',
      average: 'Durchschnittlich',
      needsImprovement: 'Verbesserungsbedürftig'
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
      financialJournalPrompt: 'Wie haben Sie heute Ihre Finanzen verwaltet? Welchen Fortschritt haben Sie bei Ihren finanziellen Zielen gemacht?',
      healthJournalPrompt: 'Wie haben Sie heute auf Ihre Gesundheit geachtet? Welche gesunden Entscheidungen haben Sie getroffen?',
      socialJournalPrompt: 'Wie haben Sie sich heute mit anderen verbunden? Welche sozialen Interaktionen haben Ihnen Freude bereitet?',
      personalJournalPrompt: 'Was haben Sie heute über sich selbst gelernt? Wie sind Sie persönlich gewachsen?'
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
      contactSupport: 'Support Kontaktieren'
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
      
      // Categories
      financial: 'Finanziell',
      healthFitness: 'Gesundheit & Fitness',
      social: 'Sozial',
      romantic: 'Persönlich',
      personal: 'Persönlich',
      career: 'Karriere',
      personalGrowth: 'Persönliche Entwicklung',
      
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
    coach: {
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
      viewProgress: 'Fortschritt Anzeigen'
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
      feature32Question: '32-Fragen-Bewertung',
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
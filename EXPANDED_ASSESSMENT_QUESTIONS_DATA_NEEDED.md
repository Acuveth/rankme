# Expanded Assessment Questions - Data Requirements

## Overview
**Total Questions: 55** (12 Financial, 14 Health & Fitness, 11 Social, 8 Romantic, 6 Career, 5 Personal Growth)

The assessment has been significantly expanded to provide a more comprehensive life evaluation across six core areas. Each question requires cohort-specific data for accurate scoring.

---

## FINANCIAL CATEGORY (12 Questions)

### 1-8. [Original Financial Questions - Same as before]
- Net Worth, Income, Income Trend, Savings Rate, Emergency Fund, Debt Payments, High-Interest Debt, Real Estate

### 9. Retirement Savings (fin_retirement_savings)
**Question**: "Monthly retirement/pension contributions"
**Options**:
- 0: $0
- 1: $1-$200
- 2: $201-$500
- 3: $501-$1,000
- 4: $1,001-$2,000
- 5: More than $2,000
**Scoring Method**: Logarithmic transform
**Data Needed**: Distribution by age/gender/region (especially age-dependent)

### 10. Investment Portfolio (fin_investment_portfolio)
**Question**: "Investment portfolio value (stocks, bonds, etc.)"
**Options**:
- 0: $0
- 1: $1-$10k
- 2: $10k-$50k
- 3: $50k-$200k
- 4: $200k-$500k
- 5: More than $500k
**Has PNTS**: Yes
**Scoring Method**: Logarithmic transform
**Data Needed**: Distribution by age/gender/region

### 11. Financial Stress (fin_financial_stress)
**Question**: "Financial stress level in the past month"
**Options**:
- 0: Extremely stressed
- 1: Very stressed
- 2: Moderately stressed
- 3: Slightly stressed
- 4: Not stressed at all
**Reverse Scored**: Yes (lower stress = better)
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

### 12. Insurance Coverage (fin_insurance_coverage)
**Question**: "Insurance coverage you currently have"
**Options**:
- 0: None
- 1: Health only
- 2: Health + Auto
- 3: Health + Auto + Life
- 4: Comprehensive (Health/Auto/Life/Disability)
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

---

## HEALTH & FITNESS CATEGORY (14 Questions)

### 1-9. [Original Health Questions - Same as before]
- Height, Weight, Waist, Exercise Frequency, Training Minutes, Push-ups, Pull-ups, Cardiovascular Fitness, Sleep, Alcohol

### 10. Mental Health (health_mental_health)
**Question**: "Overall mental health and well-being"
**Options**:
- 0: Very poor
- 1: Poor
- 2: Fair
- 3: Good
- 4: Excellent
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

### 11. Stress Management (health_stress_management)
**Question**: "Stress management practices you regularly use"
**Options**:
- 0: None
- 1: Occasional (breathing, walks)
- 2: Regular (meditation, yoga)
- 3: Multiple practices
- 4: Professional support + practices
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

### 12. Medical Checkups (health_medical_checkups)
**Question**: "Regular medical checkups and preventive care"
**Options**:
- 0: Never/rarely
- 1: When sick only
- 2: Every 2-3 years
- 3: Annually
- 4: Bi-annually + specialists
**Scoring Method**: Linear map [0, 20, 40, 80, 100]
**Data Needed**: Distribution by age/gender/region

### 13. Nutrition (health_nutrition)
**Question**: "How would you rate your nutrition habits?"
**Options**:
- 0: Very poor (mostly fast food/processed)
- 1: Poor (some home cooking)
- 2: Average (balanced most days)
- 3: Good (consistent healthy meals)
- 4: Excellent (optimized nutrition)
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

### 14. Energy Levels (health_energy_levels)
**Question**: "Average daily energy levels"
**Options**:
- 0: Always exhausted
- 1: Often tired
- 2: Moderate energy
- 3: Usually energetic
- 4: High energy all day
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

---

## SOCIAL CATEGORY (11 Questions)

### 1-8. [Original Social Questions - Same as before]
- Emergency Contacts, Close Friends, Meetups, Initiation, Circle Diversity, Community, Professional Network, Loneliness

### 9. Family Relationships (social_family_relationships)
**Question**: "Quality of family relationships"
**Options**:
- 0: Very poor
- 1: Poor
- 2: Fair
- 3: Good
- 4: Excellent
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

### 10. Conflict Resolution (social_conflict_resolution)
**Question**: "How do you handle interpersonal conflicts?"
**Options**:
- 0: Avoid completely
- 1: Struggle significantly
- 2: Handle with difficulty
- 3: Navigate well
- 4: Excel at resolution
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

### 11. Giving Back (social_giving_back)
**Question**: "Volunteering or giving back to community"
**Options**:
- 0: Never
- 1: Rare occasions
- 2: Few times per year
- 3: Monthly
- 4: Weekly commitment
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

---

## ROMANTIC CATEGORY (8 Questions)

### 1-5. [Original Romantic Questions - Same as before]
- Status, Duration, Satisfaction, Intimacy/Dating, Confidence

### 6. Communication (rom_communication)
**Question**: "Communication quality in romantic relationships"
**Options**:
- 0: Very poor
- 1: Poor
- 2: Fair
- 3: Good
- 4: Excellent
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

### 7. Emotional Intelligence (rom_emotional_intelligence)
**Question**: "Emotional intelligence in romantic contexts"
**Options**:
- 0: Very low
- 1: Low
- 2: Moderate
- 3: High
- 4: Very high
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

### 8. Future Planning (rom_future_planning)
**Question**: "Future planning with romantic partner/prospects"
**Options**:
- 0: No planning
- 1: Short-term only
- 2: Some long-term ideas
- 3: Clear shared goals
- 4: Detailed life plan together
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

---

## NEW CATEGORY: CAREER (6 Questions)

### 1. Career Satisfaction (career_satisfaction)
**Question**: "Overall career/work satisfaction"
**Options**:
- 0: Very unsatisfied
- 1: Unsatisfied
- 2: Neutral
- 3: Satisfied
- 4: Very satisfied
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

### 2. Career Growth (career_growth)
**Question**: "Career growth in the past 2 years"
**Options**:
- 0: Significant decline
- 1: Some setbacks
- 2: Stagnant
- 3: Moderate growth
- 4: Significant advancement
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

### 3. Skills Development (career_skills_development)
**Question**: "Time spent on skill development per week"
**Options**:
- 0: 0 hours
- 1: 1-2 hours
- 2: 3-5 hours
- 3: 6-10 hours
- 4: More than 10 hours
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

### 4. Work-Life Balance (career_work_life_balance)
**Question**: "Work-life balance satisfaction"
**Options**:
- 0: Very poor
- 1: Poor
- 2: Fair
- 3: Good
- 4: Excellent
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

### 5. Leadership (career_leadership)
**Question**: "Leadership responsibilities and influence"
**Options**:
- 0: No leadership role
- 1: Informal influence
- 2: Team lead/mentor
- 3: Manager/supervisor
- 4: Executive/senior leadership
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region (especially age-dependent)

### 6. Professional Networking (career_networking)
**Question**: "Professional networking activity"
**Options**:
- 0: None
- 1: Occasional events
- 2: Regular industry engagement
- 3: Active networking
- 4: Thought leader/speaker
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

---

## NEW CATEGORY: PERSONAL GROWTH (5 Questions)

### 1. Goal Achievement (personal_goal_achievement)
**Question**: "Achievement of personal goals in the past year"
**Options**:
- 0: Achieved none
- 1: Achieved few
- 2: Achieved about half
- 3: Achieved most
- 4: Exceeded goals
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

### 2. Learning (personal_learning)
**Question**: "Learning new skills/knowledge outside work"
**Options**:
- 0: Rarely/never
- 1: Occasionally
- 2: Monthly
- 3: Weekly
- 4: Daily learning habit
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

### 3. Creativity (personal_creativity)
**Question**: "Creative pursuits and hobbies"
**Options**:
- 0: None
- 1: Rare creative moments
- 2: Occasional hobby
- 3: Regular creative practice
- 4: Multiple active pursuits
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

### 4. Mindfulness (personal_mindfulness)
**Question**: "Mindfulness/self-reflection practices"
**Options**:
- 0: None
- 1: Occasional reflection
- 2: Weekly practice
- 3: Daily practice
- 4: Integrated lifestyle
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

### 5. Values Alignment (personal_values_alignment)
**Question**: "How well does your life align with your core values?"
**Options**:
- 0: Not at all
- 1: Slightly
- 2: Moderately
- 3: Well
- 4: Perfectly aligned
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution by age/gender/region

---

## UPDATED COHORT STATISTICS REQUIREMENTS

### New Category Structure (6 Categories):
1. **Financial** (12 questions)
2. **Health & Fitness** (14 questions)  
3. **Social** (11 questions)
4. **Romantic** (8 questions)
5. **Career** (6 questions) - **NEW**
6. **Personal Growth** (5 questions) - **NEW**

### For Each Cohort, Provide:
```json
{
  "[AGE_BAND]_[GENDER]_[REGION]": {
    "overall": {"mean": X, "stddev": X, "n": X, "p1": X, "p99": X},
    "financial": {"mean": X, "stddev": X, "n": X, "p1": X, "p99": X},
    "health_fitness": {"mean": X, "stddev": X, "n": X, "p1": X, "p99": X},
    "social": {"mean": X, "stddev": X, "n": X, "p1": X, "p99": X},
    "romantic": {"mean": X, "stddev": X, "n": X, "p1": X, "p99": X},
    "career": {"mean": X, "stddev": X, "n": X, "p1": X, "p99": X},
    "personal_growth": {"mean": X, "stddev": X, "n": X, "p1": X, "p99": X}
  }
}
```

### Priority Questions for Data Collection:

**Tier 1 (Essential - 35 questions):**
- All original 30 questions
- Mental health, nutrition, energy levels
- Career satisfaction, work-life balance  

**Tier 2 (Important - 15 questions):**
- Financial: retirement savings, investment portfolio, stress
- Health: stress management, medical checkups
- Social: family relationships, conflict resolution
- Career: growth, leadership, networking
- Personal: goal achievement, learning

**Tier 3 (Nice-to-have - 5 questions):**
- Insurance coverage, giving back, creativity, mindfulness, values alignment

## ENHANCED INSIGHTS

The expanded assessment now provides insights into:

### Life Balance Analysis:
- Work-life integration across career and personal domains
- Stress levels in both financial and health contexts
- Goal achievement vs. values alignment

### Holistic Development:
- Career growth trajectory
- Personal learning and creativity
- Professional vs. personal networking

### Well-being Spectrum:
- Physical health (existing)
- Mental health (new)
- Emotional intelligence (romantic context)
- Stress management practices

### Future-Oriented Metrics:
- Retirement planning
- Career advancement
- Relationship future planning
- Personal goal achievement

This comprehensive assessment provides a 360-degree view of life satisfaction and achievement across all major life domains, enabling more targeted coaching and personalized insights.
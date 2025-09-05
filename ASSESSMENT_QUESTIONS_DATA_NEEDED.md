# Assessment Questions - Data Requirements

## Overview
Total Questions: **30** (8 Financial, 9 Health & Fitness, 8 Social, 5 Romantic)

For each question below, please provide cohort-specific data showing how different demographics answer these questions. This will help create accurate scoring distributions.

---

## FINANCIAL CATEGORY (8 Questions)

### 1. Net Worth (fin_net_worth)
**Question**: "What is your current net worth (assets - liabilities)?"
**Options**:
- 0: Less than -$10k (significant debt)
- 1: -$10k to $0 (some debt)
- 2: $0 to $25k
- 3: $25k to $100k
- 4: $100k to $500k
- 5: More than $500k
**Has PNTS**: Yes
**Scoring Method**: Logarithmic transform
**Data Needed**: Distribution of responses by age/gender/region

### 2. Average Annual Income (fin_income_avg3y)
**Question**: "What is your average annual income over the last 3 years?"
**Options**:
- 0: Less than $30k
- 1: $30k - $50k
- 2: $50k - $75k
- 3: $75k - $100k
- 4: $100k - $150k
- 5: More than $150k
**Has PNTS**: Yes
**Scoring Method**: Logarithmic transform
**Data Needed**: Distribution of responses by age/gender/region

### 3. Income Trend (fin_income_trend)
**Question**: "Compared to 12 months ago, your income has..."
**Options**:
- 0: Decreased >20%
- 1: Decreased 10-20%
- 2: Stayed about the same
- 3: Increased 10-20%
- 4: Increased >20%
**Has PNTS**: No
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution of responses by age/gender/region

### 4. Savings Rate (fin_savings_rate)
**Question**: "What % of your net income did you save or invest in the last 12 months?"
**Options**:
- 0: 0% (spent everything)
- 1: 1-10%
- 2: 11-20%
- 3: 21-30%
- 4: 31-50%
- 5: More than 50%
**Has PNTS**: No
**Scoring Method**: Percentage mapping
**Data Needed**: Distribution of responses by age/gender/region

### 5. Emergency Fund (fin_emergency_fund)
**Question**: "Your emergency fund covers roughly..."
**Options**:
- 0: <1 month
- 1: 1-3 months
- 2: 3-6 months
- 3: 6-12 months
- 4: >12 months
**Has PNTS**: No
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution of responses by age/gender/region

### 6. Monthly Debt Payments (fin_debt_payments)
**Question**: "Total monthly debt payments (loans, cards)"
**Options**:
- 0: $0 (no debt payments)
- 1: $1-$500
- 2: $501-$1,000
- 3: $1,001-$2,000
- 4: $2,001-$4,000
- 5: More than $4,000
**Has PNTS**: Yes
**Scoring Method**: Logarithmic transform (reversed - lower is better)
**Data Needed**: Distribution of responses by age/gender/region

### 7. High-Interest Debt (fin_high_interest_debt)
**Question**: "Did you carry high-interest debt (e.g., credit card) in the last 3 months?"
**Options**:
- 0: No
- 1: Yes, <$1k
- 2: Yes, $1-5k
- 3: Yes, >$5k
**Has PNTS**: No
**Reverse Scored**: Yes (lower is better)
**Scoring Method**: Linear map [100, 60, 30, 0]
**Data Needed**: Distribution of responses by age/gender/region

### 8. Real Estate Ownership (fin_real_estate)
**Question**: "Real estate ownership"
**Options**:
- 0: None
- 1: Primary residence
- 2: Rental(s)
- 3: Both
**Has PNTS**: No
**Scoring Method**: Linear map [0, 50, 75, 100]
**Data Needed**: Distribution of responses by age/gender/region

---

## HEALTH & FITNESS CATEGORY (9 Questions)

### 9. Height (health_height)
**Question**: "Height"
**Options**:
- 0: Under 5'0" (152cm)
- 1: 5'0"-5'3" (152-160cm)
- 2: 5'4"-5'7" (163-170cm)
- 3: 5'8"-5'11" (173-180cm)
- 4: 6'0"-6'3" (183-190cm)
- 5: Over 6'3" (190cm+)
**Has PNTS**: No
**Scoring Method**: Used with weight for BMI calculation
**Data Needed**: Distribution of responses by age/gender/region

### 10. Weight (health_weight)
**Question**: "Weight range"
**Options**:
- 0: Under 120 lbs (54kg)
- 1: 120-150 lbs (54-68kg)
- 2: 150-180 lbs (68-82kg)
- 3: 180-220 lbs (82-100kg)
- 4: 220-280 lbs (100-127kg)
- 5: Over 280 lbs (127kg+)
**Has PNTS**: No
**Scoring Method**: Used with height for BMI calculation
**Data Needed**: Distribution of responses by age/gender/region

### 11. Waist Size (health_waist)
**Question**: "Waist size (clothing)"
**Options**:
- 0: XS (26-28 inches)
- 1: S (30-32 inches)
- 2: M (34-36 inches)
- 3: L (38-40 inches)
- 4: XL (42-44 inches)
- 5: XXL+ (46+ inches)
**Has PNTS**: No
**Scoring Method**: Waist-to-height ratio calculation
**Data Needed**: Distribution of responses by age/gender/region

### 12. Exercise Frequency (health_exercise_freq)
**Question**: "Exercise frequency: days/week with ≥20 min moderate/vigorous activity"
**Options**:
- 0: 0
- 1: 1-2
- 2: 3-4
- 3: 5-6
- 4: 7
**Has PNTS**: No
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution of responses by age/gender/region

### 13. Weekly Training Minutes (health_training_minutes)
**Question**: "Weekly training minutes (all exercise combined)"
**Options**:
- 0: 0
- 1: 1-149
- 2: 150-299
- 3: 300-449
- 4: 450+
**Has PNTS**: No
**Scoring Method**: Linear map [0, 30, 60, 85, 100]
**Data Needed**: Distribution of responses by age/gender/region

### 14. Push-ups (health_pushups)
**Question**: "Push-ups in one unbroken set"
**Options**:
- 0: 0
- 1: 1-9
- 2: 10-19
- 3: 20-34
- 4: 35-49
- 5: 50+
**Has PNTS**: No
**Scoring Method**: Linear map [0, 20, 40, 60, 80, 100]
**Data Needed**: Distribution of responses by age/gender/region

### 15. Pull-ups (health_pullups)
**Question**: "Pull-ups (strict) in one set"
**Options**:
- 0: 0
- 1: 1-2
- 2: 3-5
- 3: 6-9
- 4: 10+
**Has PNTS**: No
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution of responses by age/gender/region

### 16. Cardiovascular Fitness (health_cooper_or_5k)
**Question**: "How would you rate your cardiovascular fitness?"
**Options**:
- 0: Poor - get winded climbing stairs
- 1: Below average - struggle with moderate exercise
- 2: Average - can jog for 10-15 minutes
- 3: Good - can run 3+ miles comfortably
- 4: Very good - can run 5+ miles easily
- 5: Excellent - could run a half marathon
**Has PNTS**: No
**Scoring Method**: Performance-based scoring
**Data Needed**: Distribution of responses by age/gender/region

### 17. Sleep Hours (health_sleep)
**Question**: "Sleep: average hours/night"
**Options**:
- 0: <5
- 1: 5-6
- 2: 6-7
- 3: 7-8
- 4: >8
**Has PNTS**: No
**Scoring Method**: Optimal range [40, 60, 80, 100, 80] (7-8 hours is optimal)
**Data Needed**: Distribution of responses by age/gender/region

### 18. Alcohol Consumption (health_alcohol)
**Question**: "Alcohol: standard drinks/week"
**Options**:
- 0: 0
- 1: 1-3
- 2: 4-7
- 3: 8-14
- 4: >14
**Has PNTS**: No
**Reverse Scored**: Yes (lower is better)
**Scoring Method**: Linear map [100, 80, 60, 30, 0]
**Data Needed**: Distribution of responses by age/gender/region

---

## SOCIAL CATEGORY (8 Questions)

### 19. Emergency Contacts (social_emergency_contacts)
**Question**: "If you needed $1,000 by tomorrow, how many friends/family could you realistically ask?"
**Options**:
- 0: 0
- 1: 1-2
- 2: 3-5
- 3: 6-10
- 4: 10+
**Has PNTS**: No
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution of responses by age/gender/region

### 20. Close Friends (social_close_friends)
**Question**: "Close friends you can confide in"
**Options**:
- 0: 0
- 1: 1
- 2: 2-3
- 3: 4-5
- 4: 6+
**Has PNTS**: No
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution of responses by age/gender/region

### 21. Social Meetups (social_meetups)
**Question**: "Meet-ups with friends (offline)"
**Options**:
- 0: <monthly
- 1: monthly
- 2: 2-3x/month
- 3: weekly
- 4: 2-3x/week
- 5: daily
**Has PNTS**: No
**Scoring Method**: Linear map [0, 20, 40, 60, 80, 100]
**Data Needed**: Distribution of responses by age/gender/region

### 22. Social Initiation (social_initiation)
**Question**: "Initiation: how often do you initiate plans?"
**Options**:
- 0: Rarely
- 1: Sometimes
- 2: About half
- 3: Often
- 4: Almost always
**Has PNTS**: No
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution of responses by age/gender/region

### 23. Social Circle Diversity (social_circle_diversity)
**Question**: "Social circle diversity"
**Options**:
- 0: Mostly one group
- 1: 2 distinct groups
- 2: 3+ distinct groups
**Has PNTS**: No
**Scoring Method**: Linear map [0, 50, 100]
**Data Needed**: Distribution of responses by age/gender/region

### 24. Community Membership (social_community)
**Question**: "Community membership (club/sport/volunteer)"
**Options**:
- 0: None
- 1: 1
- 2: 2+
**Has PNTS**: No
**Scoring Method**: Linear map [0, 50, 100]
**Data Needed**: Distribution of responses by age/gender/region

### 25. Professional Network (social_professional_network)
**Question**: "Professional favors: people who'd intro you to a job lead in 48h"
**Options**:
- 0: 0
- 1: 1-2
- 2: 3-5
- 3: 6-10
- 4: 10+
**Has PNTS**: No
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution of responses by age/gender/region

### 26. Loneliness (social_loneliness)
**Question**: "Loneliness in last 2 weeks"
**Options**:
- 0: Never
- 1: Rarely
- 2: Sometimes
- 3: Often
- 4: Very often
**Has PNTS**: No
**Reverse Scored**: Yes (lower is better)
**Scoring Method**: Linear map [100, 75, 50, 25, 0]
**Data Needed**: Distribution of responses by age/gender/region

---

## ROMANTIC CATEGORY (5 Questions)

### 27. Relationship Status (rom_status)
**Question**: "Current status"
**Options**:
- 0: Single
- 1: Dating (not exclusive)
- 2: Exclusive relationship
- 3: Married/Long-term
**Has PNTS**: No
**Scoring Method**: Linear map [25, 50, 75, 100]
**Data Needed**: Distribution of responses by age/gender/region

### 28. Relationship Duration (rom_duration)
**Question**: "Duration of current/last relationship"
**Options**:
- 0: <3 months
- 1: 3-12 months
- 2: 1-3 years
- 3: 3-7 years
- 4: >7 years
**Has PNTS**: No
**Scoring Method**: Linear map [20, 40, 60, 80, 100]
**Data Needed**: Distribution of responses by age/gender/region

### 29. Relationship Satisfaction (rom_satisfaction)
**Question**: "Satisfaction with current/last relationship"
**Options**:
- 0: Very unsatisfied
- 1: Unsatisfied
- 2: Neutral
- 3: Satisfied
- 4: Very satisfied
**Has PNTS**: No
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution of responses by age/gender/region

### 30. Intimacy/Dating Frequency (rom_intimacy_or_dates)
**Question**: "Intimacy frequency (if partnered) / Dates in last 90 days (if single)"
**Options**:
- 0: <monthly/0
- 1: monthly/1-2
- 2: weekly/3-5
- 3: 2-3x week/6-9
- 4: 4+ week/10+
**Has PNTS**: Yes
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution of responses by age/gender/region

### 31. Romantic Confidence (rom_confidence)
**Question**: "Confidence initiating conversations with attractive people"
**Options**:
- 0: Very low
- 1: Low
- 2: Moderate
- 3: High
- 4: Very high
**Has PNTS**: No
**Scoring Method**: Linear map [0, 25, 50, 75, 100]
**Data Needed**: Distribution of responses by age/gender/region

---

## DATA FORMAT NEEDED

For each question, please provide response distributions by cohort in this format:

```json
{
  "question_distributions": {
    "[QUESTION_ID]": {
      "[AGE_BAND]_[GENDER]_[REGION]": {
        "distribution": [
          {"option": 0, "percentage": 15.2, "count": 152},
          {"option": 1, "percentage": 22.5, "count": 225},
          {"option": 2, "percentage": 31.8, "count": 318},
          {"option": 3, "percentage": 20.1, "count": 201},
          {"option": 4, "percentage": 8.4, "count": 84},
          {"option": 5, "percentage": 2.0, "count": 20}
        ],
        "mean_response": 1.89,
        "median_response": 2,
        "mode_response": 2,
        "total_responses": 1000,
        "pnts_count": 45  // If applicable
      }
    }
  }
}
```

## PRIORITY DATA

If providing all data is too extensive, prioritize:

### High Priority Questions (directly affect scoring):
1. Financial: Net worth, Income, Savings rate
2. Health: Exercise frequency, Training minutes, BMI-related
3. Social: Close friends, Emergency contacts, Loneliness
4. Romantic: Status, Satisfaction

### Medium Priority Questions:
- All remaining financial questions
- Fitness benchmarks (pushups, pullups)
- Social diversity and professional network

### Low Priority Questions:
- Questions with "Prefer not to say" options where many choose PNTS

## NOTES FOR DATA COLLECTION

1. **Regional Adjustments**: Income and net worth questions should account for regional economic differences
2. **Age Adjustments**: Physical fitness questions (pushups, pullups) need age-specific distributions
3. **Gender Considerations**: Some questions may have significant gender-based variations
4. **Cultural Context**: Social and romantic questions may vary by cultural norms in different regions
5. **Sample Size**: Include actual sample sizes for transparency

This data will enable accurate percentile calculations that fairly compare users within their demographic cohorts.
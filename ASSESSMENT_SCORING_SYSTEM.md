# Assessment and Scoring System Documentation

## Overview

The RankMe assessment system is a comprehensive life evaluation tool that measures user performance across four key categories: Financial, Health & Fitness, Social, and Romantic. The system collects cohort demographic data, processes assessment answers, applies sophisticated scoring algorithms, and provides percentile-based results compared to peer groups.

## Assessment Question System

### Question Structure

Questions are defined in `/data/questions.json` and follow this structure:

```json
{
  "id": "question_unique_id",
  "category": "financial|health_fitness|social|romantic", 
  "type": "single|likert",
  "label": "Question text displayed to user",
  "options": ["Option 1", "Option 2", "..."],
  "pnts": true|false,  // Whether "Prefer not to say" option is available
  "skip": null|{conditional_logic}, // Skip logic for conditional questions
  "reverse": true|false // Whether scoring is reversed (lower = better)
}
```

### Question Categories

**1. Financial (8 questions)**
- Net worth assessment
- Income trends and averages  
- Savings rate and emergency funds
- Debt obligations
- Real estate ownership

**2. Health & Fitness (9 questions)**
- Physical measurements (height, weight, waist)
- Exercise frequency and training minutes
- Fitness benchmarks (pushups, pullups)
- Cardiovascular fitness assessment
- Sleep patterns and alcohol consumption

**3. Social (8 questions)**
- Emergency contact network
- Close friendship quantity and quality
- Social meetup frequency and initiation
- Community involvement
- Professional networking
- Loneliness assessment

**4. Romantic (5 questions)**
- Relationship status and duration
- Satisfaction levels
- Intimacy frequency or dating activity
- Confidence in romantic situations

### Question Flow and Data Collection

1. **Cohort Data Collection**: Users first provide demographic information:
   - Age (converted to age bands)
   - Country (mapped to regions)
   - Gender/Sex

2. **Question Presentation**: Questions are presented sequentially with:
   - Progress tracking (percentage complete)
   - Category indicators 
   - Back/forward navigation
   - Required answer validation

3. **Answer Storage**: Raw answers are stored as strings in the database, allowing for flexible data types.

## Scoring System

### Scoring Configuration

The scoring system is configured in `/data/scoring.json` and implemented in `/lib/scoring.ts`. Each question has a specific scoring method:

### Scoring Methods

**1. Linear Mapping (`linear_map`)**
```json
{
  "type": "linear_map",
  "values": [0, 25, 50, 75, 100],
  "reverse": false
}
```
- Maps answer indices directly to predefined score values
- Most common method for categorical responses
- Can be reversed for questions where lower values indicate better performance

**2. Logarithmic Transform (`log_transform`)**
```json
{
  "type": "log_transform", 
  "bounds": { "min": 0, "max": 500000 },
  "reverse": false
}
```
- Used for financial metrics with wide value ranges
- Applies logarithmic scaling to handle exponential differences
- Prevents extreme values from skewing results

**3. Percentage Mapping (`percentage`)**
```json
{
  "type": "percentage",
  "bounds": { "min": 0, "max": 50 }
}
```
- Direct percentage conversion within specified bounds
- Used for savings rates and similar metrics

**4. Optimal Range (`optimal_range`)**  
```json
{
  "type": "optimal_range",
  "values": [40, 60, 80, 100, 80]
}
```
- For metrics with optimal middle ranges (e.g., sleep hours)
- Scores peak at ideal values and decrease for extremes

### Score Calculation Process

1. **Individual Question Scoring**: Each answer is processed through its scoring method to produce a 0-100 score

2. **Category Aggregation**: Scores within each category are averaged:
   ```typescript
   categoryScore = totalCategoryPoints / numberOfQuestionsInCategory
   ```

3. **Overall Score**: Average of all four category scores:
   ```typescript
   overallScore = (financial + health + social + romantic) / 4
   ```

## Percentile Calculation

### Statistical Method

The system uses normal distribution statistics to convert raw scores to percentiles:

```typescript
function scoreToPercentile(score: number, mean: number, stddev: number): number {
  const zScore = (score - mean) / stddev
  const percentile = normalCDF(zScore) * 100
  return Math.max(0.1, Math.min(99.9, percentile))
}
```

### Cohort-Based Scoring

**Cohort Key Formation**: `${age_band}_${sex}_${region}`

**Age Bands:**
- Under 18, 18-22, 23-27, 28-32, 33-37, 38-42, 43-47, 48-52, 53-57, 58-62, 63+

**Gender Categories:**
- Male, Female, Other, PNTS (Prefer not to say)

**Regions (195 countries mapped to 6 regions):**
- North America
- South America
- Europe
- Africa
- Asia
- Oceania

**Dynamic Statistics Calculation:**
- Cohort statistics are dynamically calculated when at least 5 assessments exist for a cohort
- Statistics include mean, standard deviation, 1st percentile, and 99th percentile
- Each category (overall, financial, health_fitness, social, romantic) has separate statistics per cohort
- System automatically updates cohort statistics after each assessment completion

**Default Statistics** (when cohort has <5 assessments):
- All categories: mean = 50, stddev = 20
- Overall: mean = 50, stddev = 15

**Example Cohorts:**
- `28-32_Male_North America` - 28-32 year old males from US/Canada
- `23-27_Female_Europe` - 23-27 year old females from European countries
- `38-42_Other_Asia` - 38-42 year olds identifying as other from Asian countries

## Database Schema

### Core Tables

**Assessment**
```sql
- id: String (unique identifier)
- userId: String (optional - for logged in users)
- anonId: String (for anonymous assessments)  
- cohortAge/Sex/Region: String (demographic grouping)
- status: String (in_progress, completed)
- startedAt/completedAt: DateTime
- completionTime: Int (seconds)
```

**Answer** 
```sql
- assessmentId: String (foreign key)
- questionId: String (maps to questions.json)
- valueRaw: String (original answer, flexible format)
- valueNorm: Float (normalized score, optional)
```

**ScoreCategory**
```sql
- assessmentId: String (unique foreign key)
- financial/healthFitness/social/romantic: Float (0-100 scores)
```

**ScoreOverall**
```sql
- assessmentId: String (unique foreign key)  
- overall: Float (0-100 overall score)
- percentileOverall/Financial/Health/Social/Romantic: Float (0-100 percentiles)
```

## API Workflow

### 1. Assessment Creation (`/api/assessment/create`)
- Accepts cohort demographic data
- Creates Assessment record with cohort groupings
- Returns assessmentId for subsequent operations

### 2. Answer Submission (`/api/assessment/answers`)  
- Accepts assessmentId and array of question/answer pairs
- Deletes existing answers (allows retaking)
- Creates new Answer records

### 3. Scoring (`/api/assessment/score`)
- Retrieves assessment and all answers
- Calculates raw scores using scoring algorithms
- Computes percentiles using cohort statistics
- Creates ScoreCategory and ScoreOverall records
- Updates assessment status to 'completed'
- Returns formatted results for display

## Frontend Integration

### Assessment Page (`/app/assessment/page.tsx`)

**Flow:**
1. Cohort data collection form
2. Sequential question presentation with progress tracking
3. Answer validation and navigation controls
4. Automatic submission and redirect to results

**Key Features:**
- Responsive design with mobile compatibility
- Real-time progress tracking
- Category-based visual indicators
- Answer validation before progression
- Skip logic handling for conditional questions

### Scorecard Page (`/app/scorecard/[id]/page.tsx`)

**Displays:**
- Overall score and percentile
- Category-specific percentiles  
- Cohort comparison context
- Completion time metrics
- Upselling options (AI Coach, Deep Reports)

## Data Flow Summary

1. **User Input** → Cohort demographics collected
2. **Assessment Creation** → Database record with demographic groupings
3. **Question Sequence** → Progressive answer collection with validation
4. **Answer Storage** → Raw responses stored as flexible strings
5. **Score Calculation** → Multi-method algorithmic scoring per question
6. **Aggregation** → Category averages and overall score computation  
7. **Percentile Conversion** → Statistical comparison against cohort groups
8. **Results Display** → Formatted presentation with peer context
9. **Integration Opportunities** → AI coaching and detailed reporting upsells

## Key Design Principles

- **Flexibility**: Raw answer storage supports future question type expansion
- **Statistical Rigor**: Normal distribution percentile calculations with cohort grouping
- **Performance**: Efficient database queries with proper indexing on assessmentId
- **Privacy**: Support for both anonymous and authenticated assessments
- **Scalability**: Cohort-based statistics that improve with user growth
- **Extensibility**: Modular scoring system supports new algorithms and question types

## Adding New Questions

To add new questions to the assessment:

1. **Update `/data/questions.json`**:
   - Add question object with unique ID, category, type, and options
   - Set appropriate `pnts` and `reverse` flags
   
2. **Update `/data/scoring.json`**:  
   - Add scoring configuration for the new question ID
   - Choose appropriate scoring method (linear_map, log_transform, etc.)
   
3. **Database Migration** (if needed):
   - No schema changes required due to flexible Answer storage
   - New questions automatically included in scoring calculations

The system will automatically incorporate new questions into the scoring and percentile calculations without requiring code changes to the core assessment logic.
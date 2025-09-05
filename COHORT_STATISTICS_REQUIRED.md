# Cohort Statistics Requirements

## Cohort Structure

Each cohort is identified by three dimensions:
1. **Age Band** (11 groups)
2. **Gender** (4 options)
3. **Region** (6 regions)

This creates a potential of **11 × 4 × 6 = 264 unique cohorts**.

## Statistics Required Per Cohort

For each cohort, we need statistics for **5 categories**:
1. Overall
2. Financial
3. Health & Fitness
4. Social
5. Romantic

For each category within each cohort, provide:
- **mean** (average score, 0-100 scale)
- **stddev** (standard deviation)
- **n** (sample size - number of assessments)
- **p1** (1st percentile score)
- **p99** (99th percentile score)

## Cohort Identifiers

### Age Bands (11 groups):
1. `Under_18`
2. `18-22`
3. `23-27`
4. `28-32`
5. `33-37`
6. `38-42`
7. `43-47`
8. `48-52`
9. `53-57`
10. `58-62`
11. `63+`

### Gender Options (4 groups):
1. `Male`
2. `Female`
3. `Other`
4. `PNTS` (Prefer not to say)

### Regions (6 groups):
1. `North_America`
2. `South_America`
3. `Europe`
4. `Africa`
5. `Asia`
6. `Oceania`

## Data Format Required

Please provide statistics in the following JSON structure:

```json
{
  "cohort_stats": {
    "[AGE_BAND]_[GENDER]_[REGION]": {
      "overall": {
        "mean": 50.0,
        "stddev": 15.0,
        "n": 100,
        "p1": 20.5,
        "p99": 85.3
      },
      "financial": {
        "mean": 48.5,
        "stddev": 20.0,
        "n": 100,
        "p1": 15.2,
        "p99": 88.7
      },
      "health_fitness": {
        "mean": 52.3,
        "stddev": 18.5,
        "n": 100,
        "p1": 22.1,
        "p99": 87.9
      },
      "social": {
        "mean": 49.8,
        "stddev": 19.2,
        "n": 100,
        "p1": 18.3,
        "p99": 86.4
      },
      "romantic": {
        "mean": 51.2,
        "stddev": 21.3,
        "n": 100,
        "p1": 16.7,
        "p99": 89.2
      }
    }
  }
}
```

## Example Cohort Keys

Here are some example cohort keys that would need statistics:

1. `28-32_Male_North_America`
2. `28-32_Male_Europe`
3. `28-32_Male_Asia`
4. `28-32_Female_North_America`
5. `28-32_Female_Europe`
6. `28-32_Female_Asia`
7. `23-27_Male_North_America`
8. `23-27_Female_North_America`
9. `33-37_Male_Europe`
10. `38-42_Female_Asia`

## Priority Cohorts

If providing all 264 cohorts × 5 categories = 1,320 statistics sets is too many, please prioritize:

### Tier 1 (Most Common - 60 cohorts):
- Age bands: `23-27`, `28-32`, `33-37`, `38-42`, `43-47`
- Genders: `Male`, `Female`
- All 6 regions

### Tier 2 (Extended - 36 cohorts):
- Age bands: `18-22`, `48-52`, `53-57`
- Genders: `Male`, `Female`
- All 6 regions

### Tier 3 (Complete):
- All remaining combinations

## Default Fallback Values

For any cohort without specific statistics, the system will use these defaults:

```json
{
  "default": {
    "overall": {
      "mean": 50.0,
      "stddev": 15.0,
      "n": 0,
      "p1": 15.0,
      "p99": 85.0
    },
    "financial": {
      "mean": 50.0,
      "stddev": 20.0,
      "n": 0,
      "p1": 10.0,
      "p99": 90.0
    },
    "health_fitness": {
      "mean": 50.0,
      "stddev": 20.0,
      "n": 0,
      "p1": 10.0,
      "p99": 90.0
    },
    "social": {
      "mean": 50.0,
      "stddev": 20.0,
      "n": 0,
      "p1": 10.0,
      "p99": 90.0
    },
    "romantic": {
      "mean": 50.0,
      "stddev": 20.0,
      "n": 0,
      "p1": 10.0,
      "p99": 90.0
    }
  }
}
```

## Notes

1. **Sample Size (n)**: Include the actual sample size for transparency. System can display this to users (e.g., "Compared to 523 peers in your demographic")

2. **Missing Cohorts**: Any cohort not provided will fall back to the default values

3. **Regional Variations**: Consider that some regions may have cultural differences affecting certain categories (e.g., financial scores in different economic regions)

4. **Age Adjustments**: Health & Fitness scores likely vary significantly with age bands

5. **Gender Patterns**: Some categories may show gender-based variations that should be reflected in the statistics

## Implementation Plan

Once you provide the cohort statistics, I will:

1. Create a static JSON file with all cohort statistics
2. Update the scoring system to look up statistics from this file instead of database
3. Remove the dynamic calculation logic
4. Implement efficient cohort lookup with fallback to defaults
5. Add cohort sample size display to the UI

Please provide the statistics in the format shown above, prioritizing Tier 1 cohorts if you need to limit the initial dataset.
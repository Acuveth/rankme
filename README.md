# RankMe - Life Assessment Platform

A comprehensive life assessment platform that benchmarks users across financial, health, social, and romantic dimensions.

## Features

- **32-Question Assessment**: Comprehensive evaluation across 4 key life areas
- **Free Scorecard**: Percentile rankings with radar chart visualization
- **Deep Reports**: Detailed analysis with improvement drivers and action plans ($29)
- **AI Coach**: Personalized weekly plans and progress tracking ($19/month)
- **Share Images**: Generate beautiful scorecard images for social sharing
- **Cohort Benchmarking**: Compare against peers by age, gender, and region

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development) / PostgreSQL (production)
- **Payments**: Stripe
- **Charts**: Recharts
- **Image Generation**: Canvas API

## Quick Start

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:
- `STRIPE_SECRET_KEY`: From Stripe Dashboard
- `STRIPE_PUBLISHABLE_KEY`: From Stripe Dashboard  
- `STRIPE_WEBHOOK_SECRET`: From Stripe Webhook settings
- `JWT_SECRET`: Any secure random string

### 3. Set Up Database

```bash
npm run prisma:generate
npm run prisma:push
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
app/
├── api/                    # API routes
│   ├── assessment/         # Assessment creation, answers, scoring
│   ├── checkout/          # Stripe checkout
│   ├── report/            # Deep report data
│   ├── share/             # Share image generation
│   └── webhook/           # Stripe webhooks
├── assessment/            # Assessment flow pages
├── scorecard/[id]/        # Free scorecard view
├── report/[id]/           # Deep report (paid)
├── paywall/               # Payment pages
└── success/               # Post-purchase success

components/                # Reusable UI components
lib/                      # Utilities and configuration
├── prisma.ts             # Database client
├── scoring.ts            # Scoring algorithm
├── stripe.ts             # Stripe configuration
├── utils.ts              # Helper functions
└── image-generator.ts    # Share image generation

data/
├── questions.json        # Question bank
└── scoring.json          # Scoring configuration

prisma/
└── schema.prisma         # Database schema
```

## Key User Flows

1. **Free Assessment**: Landing → Setup → 32 Questions → Review → Free Scorecard
2. **Deep Report**: Scorecard → Paywall → Payment → Deep Report
3. **AI Coach**: Scorecard/Report → Paywall → Payment → Coach Hub

## Scoring System

- **Item Scoring**: Maps raw answers to 0-100 scores using various transforms
- **Category Scores**: Equal-weighted means of item scores within categories
- **Overall Score**: Equal-weighted mean of 4 category scores
- **Percentiles**: Z-score based ranking against cohort statistics

## Payment Integration

### Stripe Setup

1. Create Stripe account and get API keys
2. Create webhook endpoint: `/api/webhook/stripe`
3. Configure webhook to send `checkout.session.completed` events
4. Add webhook secret to environment variables

### Products

- **Deep Report**: $29 one-time payment
- **AI Coach**: $19/month subscription

## Deployment

### Environment Variables (Production)

```bash
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
JWT_SECRET=your-production-secret
```

### Database Migration

For production with PostgreSQL:

1. Update `DATABASE_URL` in `.env`
2. Run `npm run prisma:push`

### Vercel Deployment

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

## Customization

### Adding Questions

Edit `data/questions.json`:

```json
{
  "id": "new_question",
  "category": "financial",
  "type": "single",
  "label": "Your question here?",
  "options": ["Option 1", "Option 2"],
  "pnts": false
}
```

### Modifying Scoring

Edit `data/scoring.json` to adjust score calculations and category weights.

### Styling

- Tailwind classes in components
- Global styles in `app/globals.css`
- Color scheme in `tailwind.config.ts`

## API Reference

### Core Endpoints

- `POST /api/assessment/create` - Start new assessment
- `POST /api/assessment/answers` - Save answers
- `POST /api/assessment/score` - Calculate scores
- `GET /api/scorecard/[id]` - Get scorecard data
- `GET /api/report/[id]` - Get deep report (requires purchase)
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/share/generate` - Generate share image

## Support

For issues and questions:
- Check existing GitHub issues
- Create new issue with reproduction steps
- Include relevant log output

## License

Proprietary - All rights reserved
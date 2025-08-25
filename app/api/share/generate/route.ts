import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { assessmentId, format = 'instagram' } = body

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        scoreCategory: true,
        scoreOverall: true
      }
    })

    if (!assessment || !assessment.scoreOverall) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    const scoreData = {
      cohort: {
        age_band: assessment.cohortAge,
        sex: assessment.cohortSex,
        region: assessment.cohortRegion
      },
      overall: {
        score_0_100: assessment.scoreOverall.overall,
        percentile: assessment.scoreOverall.percentileOverall
      },
      categories: [
        { id: 'financial', percentile: assessment.scoreOverall.percentileFinancial },
        { id: 'health_fitness', percentile: assessment.scoreOverall.percentileHealth },
        { id: 'social', percentile: assessment.scoreOverall.percentileSocial },
        { id: 'romantic', percentile: assessment.scoreOverall.percentileRomantic }
      ]
    }

    // Generate SVG content for the shareable graphic
    const svgContent = generateStoryGraphic(scoreData, format)

    // Create share token
    const token = crypto.randomBytes(16).toString('hex')
    
    return NextResponse.json({
      success: true,
      svgContent,
      token,
      shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/scorecard/${assessmentId}`
    })
  } catch (error) {
    console.error('Error generating share image:', error)
    return NextResponse.json(
      { error: 'Failed to generate share image' },
      { status: 500 }
    )
  }
}

function generateStoryGraphic(scoreData: any, template: string) {
  const { overall, categories, cohort } = scoreData

  // Instagram Story dimensions: 1080x1920
  const width = 1080
  const height = 1920

  // Calculate top category and growth area
  const topCategory = categories.reduce((max: any, cat: any) => 
    cat.percentile > max.percentile ? cat : max
  )
  const growthCategory = categories.reduce((min: any, cat: any) => 
    cat.percentile < min.percentile ? cat : min
  )

  const categoryNames: { [key: string]: string } = {
    financial: 'Financial Health',
    health_fitness: 'Physical Wellness',
    social: 'Social Network',
    romantic: 'Personal Growth'
  }

  const svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#1f2937;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#6b7280;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1f2937;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="financialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="socialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="romanticGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#be185d;stop-opacity:1" />
        </linearGradient>
      </defs>

      <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>

      <text x="${width/2}" y="120" text-anchor="middle" fill="white" font-size="48" font-weight="bold" font-family="Inter, sans-serif">
        MY LIFE SCORE
      </text>

      <circle cx="${width/2}" cy="400" r="120" fill="none" stroke="#374151" stroke-width="8"/>
      <circle cx="${width/2}" cy="400" r="120" fill="none" stroke="url(#scoreGradient)" stroke-width="8" 
              stroke-dasharray="${2 * Math.PI * 120}" 
              stroke-dashoffset="${2 * Math.PI * 120 * (1 - overall.percentile / 100)}"
              stroke-linecap="round" transform="rotate(-90 ${width/2} 400)"/>
      
      <text x="${width/2}" y="390" text-anchor="middle" fill="white" font-size="80" font-weight="bold" font-family="Inter, sans-serif">
        ${Math.round(overall.score_0_100)}
      </text>
      <text x="${width/2}" y="430" text-anchor="middle" fill="#9ca3af" font-size="24" font-family="Inter, sans-serif">
        out of 100
      </text>

      <text x="${width/2}" y="580" text-anchor="middle" fill="white" font-size="36" font-weight="bold" font-family="Inter, sans-serif">
        ${Math.round(overall.percentile)}th percentile
      </text>
      <text x="${width/2}" y="620" text-anchor="middle" fill="#9ca3af" font-size="18" font-family="Inter, sans-serif">
        ${cohort.sex} • ${cohort.age_band} • ${cohort.region}
      </text>

      <rect x="80" y="720" width="920" height="120" rx="20" fill="#065f46" fill-opacity="0.2" stroke="#10b981" stroke-width="2"/>
      <text x="120" y="750" fill="#10b981" font-size="20" font-weight="bold" font-family="Inter, sans-serif">
        TOP STRENGTH
      </text>
      <text x="120" y="780" fill="white" font-size="28" font-weight="bold" font-family="Inter, sans-serif">
        ${categoryNames[topCategory.id]}
      </text>
      <text x="120" y="810" fill="#9ca3af" font-size="20" font-family="Inter, sans-serif">
        ${Math.round(topCategory.percentile)}th percentile
      </text>

      <rect x="80" y="870" width="920" height="120" rx="20" fill="#92400e" fill-opacity="0.2" stroke="#f59e0b" stroke-width="2"/>
      <text x="120" y="900" fill="#f59e0b" font-size="20" font-weight="bold" font-family="Inter, sans-serif">
        GROWTH OPPORTUNITY
      </text>
      <text x="120" y="930" fill="white" font-size="28" font-weight="bold" font-family="Inter, sans-serif">
        ${categoryNames[growthCategory.id]}
      </text>
      <text x="120" y="960" fill="#9ca3af" font-size="20" font-family="Inter, sans-serif">
        ${Math.round(growthCategory.percentile)}th percentile
      </text>

      <text x="${width/2}" y="1080" text-anchor="middle" fill="white" font-size="24" font-weight="bold" font-family="Inter, sans-serif">
        PERFORMANCE BREAKDOWN
      </text>

      ${categories.map((category: any, index: number) => {
        const y = 1140 + (index * 120)
        const barWidth = (category.percentile / 100) * 600
        const gradientMap: { [key: string]: string } = {
          financial: 'financialGradient',
          health_fitness: 'healthGradient',
          social: 'socialGradient',
          romantic: 'romanticGradient'
        }
        const gradientId = gradientMap[category.id] || 'scoreGradient'
        return `
          <text x="240" y="${y}" fill="#e5e7eb" font-size="18" font-family="Inter, sans-serif">
            ${categoryNames[category.id]}
          </text>
          <rect x="240" y="${y + 15}" width="600" height="10" rx="5" fill="#1f2937"/>
          <rect x="240" y="${y + 15}" width="${barWidth}" height="10" rx="5" fill="url(#${gradientId})"/>
          <text x="860" y="${y}" fill="white" font-size="20" font-weight="bold" font-family="Inter, sans-serif">
            ${Math.round(category.percentile)}%
          </text>
        `
      }).join('')}

      <text x="${width/2}" y="1750" text-anchor="middle" fill="white" font-size="28" font-weight="bold" font-family="Inter, sans-serif">
        RankMe.app
      </text>
      <text x="${width/2}" y="1780" text-anchor="middle" fill="#9ca3af" font-size="18" font-family="Inter, sans-serif">
        Take your free life assessment
      </text>

      <rect x="${width/2 - 50}" y="1810" width="100" height="100" rx="10" fill="white"/>
      <text x="${width/2}" y="1870" text-anchor="middle" fill="black" font-size="16" font-family="Inter, sans-serif">
        QR
      </text>
    </svg>`

  return svgContent
}
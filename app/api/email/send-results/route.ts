import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { assessmentId, email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

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

    const categoryNames = {
      financial: 'Financial Health',
      health_fitness: 'Physical Wellness',
      social: 'Social Network',
      romantic: 'Personal Growth'
    }

    const categories = [
      { name: 'Financial Health', percentile: assessment.scoreOverall.percentileFinancial },
      { name: 'Physical Wellness', percentile: assessment.scoreOverall.percentileHealth },
      { name: 'Social Network', percentile: assessment.scoreOverall.percentileSocial },
      { name: 'Personal Growth', percentile: assessment.scoreOverall.percentileRomantic }
    ].sort((a, b) => b.percentile - a.percentile)

    const topCategory = categories[0]
    const growthCategory = categories[categories.length - 1]

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Life Assessment Results</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                border-radius: 10px;
                text-align: center;
                margin-bottom: 30px;
            }
            .score-circle {
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                width: 120px;
                height: 120px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 20px auto;
                border: 4px solid rgba(255,255,255,0.3);
            }
            .score-number {
                font-size: 36px;
                font-weight: bold;
            }
            .percentile {
                font-size: 18px;
                margin-top: 10px;
                opacity: 0.9;
            }
            .cohort-info {
                font-size: 14px;
                opacity: 0.8;
                margin-top: 10px;
            }
            .insights {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 25px;
                margin: 20px 0;
            }
            .insight-item {
                background: white;
                border-left: 4px solid;
                padding: 15px 20px;
                margin: 15px 0;
                border-radius: 5px;
            }
            .strength {
                border-left-color: #10b981;
            }
            .growth {
                border-left-color: #f59e0b;
            }
            .category-breakdown {
                margin: 20px 0;
            }
            .category-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 0;
                border-bottom: 1px solid #e5e7eb;
            }
            .category-bar {
                width: 200px;
                height: 8px;
                background: #e5e7eb;
                border-radius: 4px;
                overflow: hidden;
                margin: 0 15px;
            }
            .category-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                border-radius: 4px;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Your Life Assessment Results</h1>
            <div class="score-circle">
                <span class="score-number">${Math.round(assessment.scoreOverall.overall)}</span>
            </div>
            <div class="percentile">${Math.round(assessment.scoreOverall.percentileOverall)}th percentile</div>
            <div class="cohort-info">${assessment.cohortSex} • ${assessment.cohortAge} • ${assessment.cohortRegion}</div>
        </div>

        <div class="insights">
            <h2>Key Insights</h2>
            <div class="insight-item strength">
                <h3>🎯 Top Strength: ${topCategory.name}</h3>
                <p>You're performing exceptionally well in this area, ranking in the ${Math.round(topCategory.percentile)}th percentile. This is a significant strength that you can leverage in other areas of your life.</p>
            </div>
            <div class="insight-item growth">
                <h3>🌱 Growth Opportunity: ${growthCategory.name}</h3>
                <p>This area presents the greatest opportunity for improvement. You're currently in the ${Math.round(growthCategory.percentile)}th percentile, which means there's substantial room for growth.</p>
            </div>
        </div>

        <div class="category-breakdown">
            <h2>Performance Breakdown</h2>
            ${categories.map(category => `
                <div class="category-item">
                    <span style="font-weight: 500;">${category.name}</span>
                    <div class="category-bar">
                        <div class="category-fill" style="width: ${category.percentile}%"></div>
                    </div>
                    <span style="font-weight: bold;">${Math.round(category.percentile)}%</span>
                </div>
            `).join('')}
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/scorecard/${assessmentId}" class="cta-button">
                View Full Results
            </a>
        </div>

        <div class="footer">
            <p>Want deeper insights? Get your comprehensive analysis and personalized action plan.</p>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing">Unlock Deep Report →</a>
            <br><br>
            <small>This email was sent from RankMe.app - Professional Life Assessment Platform</small>
        </div>
    </body>
    </html>
    `

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@rankme.app',
      to: email,
      subject: `Your Life Score: ${Math.round(assessment.scoreOverall.overall)}/100 (${Math.round(assessment.scoreOverall.percentileOverall)}th percentile)`,
      html: htmlContent,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: 'Results sent successfully'
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
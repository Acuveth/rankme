import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import puppeteer from 'puppeteer'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id

    // Check if user has purchased the report
    const purchase = await prisma.purchase.findFirst({
      where: {
        assessmentId,
        product: 'deep_report_oneoff',
        status: 'completed'
      }
    })

    if (!purchase) {
      return NextResponse.json(
        { error: 'Unauthorized - Purchase required' },
        { status: 403 }
      )
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        answers: true,
        scoreCategory: true,
        scoreOverall: true
      }
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    // Generate detailed report data
    const categoryScores = assessment.scoreCategory
    const overallScore = assessment.scoreOverall

    // Category analysis with detailed insights
    const categoryNames: { [key: string]: string } = {
      financial: 'Financial Wellness',
      healthFitness: 'Health & Fitness',
      social: 'Social Life',
      romantic: 'Personal Relationships'
    }

    const categoryPercentiles: { [key: string]: number } = {
      financial: overallScore?.percentileFinancial || 50,
      healthFitness: overallScore?.percentileHealth || 50,
      social: overallScore?.percentileSocial || 50,
      romantic: overallScore?.percentileRomantic || 50
    }

    const detailedCategories = Object.entries(categoryNames).map(([key, name]) => {
      const score = categoryScores ? (categoryScores as any)[key] || 50 : 50
      const percentile = categoryPercentiles[key]
      
      return {
        id: key,
        name: name,
        percentile: Math.round(percentile),
        score: Math.round(score),
      }
    })

    // Create simple HTML for PDF generation
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>RankMe Deep Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; }
            .score-section { margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
            .category { margin: 20px 0; padding: 15px; border-left: 4px solid #007bff; }
            .percentile { font-size: 24px; font-weight: bold; color: #007bff; }
            .score { font-size: 18px; margin: 10px 0; }
            .footer { margin-top: 50px; text-align: center; color: #666; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>RankMe Deep Report</h1>
            <p>Assessment ID: ${assessment.id}</p>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="score-section">
            <h2>Overall Score</h2>
            <div class="percentile">${Math.round(overallScore?.percentileOverall || 50)}th percentile</div>
            <div class="score">Score: ${Math.round(overallScore?.overall || 50)}/100</div>
        </div>
        
        <h2>Category Breakdown</h2>
        ${detailedCategories.map(cat => `
            <div class="category">
                <h3>${cat.name}</h3>
                <div class="percentile">${cat.percentile}th percentile</div>
                <div class="score">Score: ${cat.score}/100</div>
            </div>
        `).join('')}
        
        <div class="footer">
            <p>This report is confidential and generated for your personal use only.</p>
            <p>© ${new Date().getFullYear()} RankMe</p>
        </div>
    </body>
    </html>
    `

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    })
    
    await browser.close()
    
    return new Response(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="rankme-report-${assessmentId}.pdf"`
      }
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
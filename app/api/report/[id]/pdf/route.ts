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
        status: 'completed',
        OR: [
          { product: 'deep_report_oneoff' },
          { product: 'deep_report' }
        ]
      }
    })

    if (!purchase) {
      return NextResponse.json(
        { error: 'Unauthorized - Purchase required' },
        { status: 403 }
      )
    }

    // Get the enhanced report data from our report API
    const reportResponse = await fetch(`${request.url.split('/pdf')[0]}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!reportResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch report data' },
        { status: 500 }
      )
    }

    const reportData = await reportResponse.json()

    // Create HTML content for the PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RankMe Deep Life Analysis Report</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 40px;
          background: white;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #1f2937;
          padding-bottom: 20px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 18px;
          color: #6b7280;
          margin-bottom: 20px;
        }
        .score-summary {
          background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 40px;
        }
        .overall-score {
          font-size: 72px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .score-label {
          font-size: 16px;
          opacity: 0.9;
        }
        .demographics {
          font-size: 14px;
          opacity: 0.8;
          margin-top: 15px;
        }
        .section {
          margin-bottom: 40px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 20px;
          border-left: 4px solid #1f2937;
          padding-left: 16px;
        }
        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }
        .category-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          background: #f9fafb;
        }
        .category-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        .category-name {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }
        .category-score {
          font-size: 14px;
          color: #6b7280;
          margin-left: auto;
        }
        .insight-box {
          background: white;
          border-radius: 8px;
          padding: 16px;
          margin: 12px 0;
          border-left: 4px solid #3b82f6;
        }
        .insight-title {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }
        .insight-content {
          font-size: 14px;
          color: #4b5563;
          line-height: 1.5;
        }
        .action-plan {
          background: #f0f9ff;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 30px;
        }
        .week-item {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 16px;
          border-left: 4px solid #1f2937;
        }
        .week-header {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }
        .week-actions {
          font-size: 14px;
          color: #4b5563;
        }
        .week-actions li {
          margin-bottom: 4px;
        }
        .insights-section {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 30px;
        }
        .strategy-section {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 12px;
          padding: 24px;
        }
        .warning-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
        }
        .warning-title {
          font-weight: 600;
          color: #dc2626;
          margin-bottom: 8px;
        }
        .goal-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .goal-box {
          background: white;
          border-radius: 8px;
          padding: 16px;
          border: 1px solid #e5e7eb;
        }
        .goal-timeframe {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }
        ul {
          padding-left: 20px;
        }
        li {
          margin-bottom: 8px;
        }
        .page-break {
          page-break-before: always;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">RankMe</div>
        <div class="subtitle">Deep Life Analysis Report</div>
      </div>

      <div class="score-summary">
        <div class="overall-score">${Math.round(reportData.overall.score_0_100)}</div>
        <div class="score-label">Overall Life Score (${reportData.overall.percentile}th percentile)</div>
        <div class="demographics">${reportData.cohort.sex} • ${reportData.cohort.age_band} • ${reportData.cohort.region}</div>
      </div>

      ${reportData.aiReport?.executiveSummary ? `
      <div class="section">
        <h2 class="section-title">Executive Summary</h2>
        <div class="insights-section">
          <div class="insight-content">${reportData.aiReport.executiveSummary.overallAssessment}</div>
          ${reportData.aiReport.executiveSummary.keyStrengths.length > 0 ? `
          <div class="insight-box">
            <div class="insight-title">Key Strengths</div>
            <ul>
              ${reportData.aiReport.executiveSummary.keyStrengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
          ${reportData.aiReport.executiveSummary.primaryGrowthAreas.length > 0 ? `
          <div class="insight-box">
            <div class="insight-title">Primary Growth Areas</div>
            <ul>
              ${reportData.aiReport.executiveSummary.primaryGrowthAreas.map(area => `<li>${area}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}

      <div class="section">
        <h2 class="section-title">Category Performance Analysis</h2>
        <div class="category-grid">
          ${reportData.categories.map(category => `
          <div class="category-card">
            <div class="category-header">
              <div class="category-name">${category.name}</div>
              <div class="category-score">${category.percentile}th percentile</div>
            </div>
            
            ${reportData.aiReport?.categoryAnalysis[category.id] ? `
            <div class="insight-box">
              <div class="insight-title">Strengths</div>
              <div class="insight-content">${reportData.aiReport.categoryAnalysis[category.id].strengthsAnalysis || ''}</div>
              <ul class="week-actions">
                ${reportData.aiReport.categoryAnalysis[category.id].specificStrengths.map(strength => `<li>${strength}</li>`).join('')}
              </ul>
            </div>
            <div class="insight-box">
              <div class="insight-title">Opportunities</div>
              <div class="insight-content">${reportData.aiReport.categoryAnalysis[category.id].opportunitiesAnalysis || ''}</div>
              <ul class="week-actions">
                ${reportData.aiReport.categoryAnalysis[category.id].specificOpportunities.map(opp => `<li>${opp}</li>`).join('')}
              </ul>
            </div>
            <div class="insight-box">
              <div class="insight-title">Quick Wins</div>
              <ul class="week-actions">
                ${reportData.aiReport.categoryAnalysis[category.id].quickWins.map(win => `<li>${win}</li>`).join('')}
              </ul>
            </div>
            ` : `
            <div class="insight-box">
              <div class="insight-title">Strengths</div>
              <ul class="week-actions">
                ${category.strengths.map(strength => `<li>${strength}</li>`).join('')}
              </ul>
            </div>
            <div class="insight-box">
              <div class="insight-title">Opportunities</div>
              <ul class="week-actions">
                ${category.opportunities.map(opp => `<li>${opp}</li>`).join('')}
              </ul>
            </div>
            <div class="insight-box">
              <div class="insight-title">Recommendations</div>
              <ul class="week-actions">
                ${category.recommendations.map(rec => `<li>${rec}</li>`).join('')}
              </ul>
            </div>
            `}
          </div>
          `).join('')}
        </div>
      </div>

      <div class="page-break"></div>

      ${reportData.aiReport?.personalizedInsights ? `
      <div class="section">
        <h2 class="section-title">Personalized Insights</h2>
        <div class="insights-section">
          ${reportData.aiReport.personalizedInsights.crossCategoryPatterns ? `
          <div class="insight-box">
            <div class="insight-title">Cross-Category Patterns</div>
            <div class="insight-content">${reportData.aiReport.personalizedInsights.crossCategoryPatterns}</div>
          </div>
          ` : ''}
          ${reportData.aiReport.personalizedInsights.surprisingFindings ? `
          <div class="insight-box">
            <div class="insight-title">Surprising Findings</div>
            <div class="insight-content">${reportData.aiReport.personalizedInsights.surprisingFindings}</div>
          </div>
          ` : ''}
          ${reportData.aiReport.personalizedInsights.peerComparison ? `
          <div class="insight-box">
            <div class="insight-title">Peer Comparison</div>
            <div class="insight-content">${reportData.aiReport.personalizedInsights.peerComparison}</div>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}

      <div class="section">
        <h2 class="section-title">30-Day Action Plan</h2>
        <div class="action-plan">
          ${reportData.actionPlan.map(week => `
          <div class="week-item">
            <div class="week-header">Week ${week.week}: ${week.focus}</div>
            <div class="week-actions">
              <strong>Time Commitment:</strong> ${week.timeCommitment}<br><br>
              <strong>Daily Actions:</strong>
              <ul>
                ${week.actions.map(action => `<li>${action}</li>`).join('')}
              </ul>
            </div>
          </div>
          `).join('')}
        </div>
      </div>

      ${reportData.aiReport?.longTermStrategy ? `
      <div class="section">
        <h2 class="section-title">Long-Term Growth Strategy</h2>
        <div class="strategy-section">
          ${reportData.aiReport.longTermStrategy.primaryLimitingFactor ? `
          <div class="warning-box">
            <div class="warning-title">Primary Limiting Factor</div>
            <div>${reportData.aiReport.longTermStrategy.primaryLimitingFactor}</div>
          </div>
          ` : ''}
          
          <div class="goal-grid">
            ${reportData.aiReport.longTermStrategy.threeMonthGoals.length > 0 ? `
            <div class="goal-box">
              <div class="goal-timeframe">3-Month Goals</div>
              <ul class="week-actions">
                ${reportData.aiReport.longTermStrategy.threeMonthGoals.map(goal => `<li>${goal}</li>`).join('')}
              </ul>
            </div>
            ` : ''}
            
            ${reportData.aiReport.longTermStrategy.oneYearGoals.length > 0 ? `
            <div class="goal-box">
              <div class="goal-timeframe">1-Year Goals</div>
              <ul class="week-actions">
                ${reportData.aiReport.longTermStrategy.oneYearGoals.map(goal => `<li>${goal}</li>`).join('')}
              </ul>
            </div>
            ` : ''}
          </div>

          ${reportData.aiReport.longTermStrategy.recommendedResources.length > 0 ? `
          <div class="insight-box" style="margin-top: 20px;">
            <div class="insight-title">Recommended Resources</div>
            <ul class="week-actions">
              ${reportData.aiReport.longTermStrategy.recommendedResources.map(resource => `<li>${resource}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}

      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
        Generated by RankMe - Your Personal Life Performance Platform<br>
        Report ID: ${assessmentId} • Generated: ${new Date().toLocaleDateString()}
      </div>
    </body>
    </html>
    `

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    })
    
    await browser.close()

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="rankme-deep-report-${assessmentId}.pdf"`
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
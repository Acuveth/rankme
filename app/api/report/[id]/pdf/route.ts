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

    // Get the enhanced report data from our report API - force refresh for PDF generation
    const baseUrl = request.url.split('/pdf')[0]
    const reportUrl = `${baseUrl}?refresh=true`
    console.log('Fetching report from:', reportUrl)
    
    const reportResponse = await fetch(reportUrl, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!reportResponse.ok) {
      console.error('Report fetch failed:', reportResponse.status, reportResponse.statusText)
      return NextResponse.json(
        { error: 'Failed to fetch report data' },
        { status: 500 }
      )
    }

    const reportData = await reportResponse.json()
    console.log('Report data categories count:', reportData.categories?.length)

    // Generate simple CSS-based radar chart with responsive sizing
    const generateRadarChart = (categories: any[]) => {
      if (!categories || categories.length === 0) {
        return '<div>No category data available</div>'
      }

      const centerX = 140
      const centerY = 140
      const maxRadius = 100  // Reduced from 120 for better fit
      const angleStep = (2 * Math.PI) / categories.length
      
      let pathData = ''
      let gridLines = ''
      let labels = ''
      
      // Generate grid circles
      for (let i = 1; i <= 5; i++) {
        const radius = (maxRadius * i) / 5
        gridLines += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="#e5e7eb" stroke-width="1" />`
      }
      
      // Generate grid lines and labels
      categories.forEach((category, index) => {
        const angle = index * angleStep - Math.PI / 2
        const x = centerX + Math.cos(angle) * maxRadius
        const y = centerY + Math.sin(angle) * maxRadius
        
        gridLines += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" stroke="#e5e7eb" stroke-width="1" />`
        
        // Calculate label position (a bit further out) with text wrapping
        const labelX = centerX + Math.cos(angle) * (maxRadius + 25)
        const labelY = centerY + Math.sin(angle) * (maxRadius + 25)
        
        labels += `<text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="central" font-size="10" fill="#374151">${category.name}</text>`
        
        // Calculate point for the data path
        const percentile = category.percentile || 0
        const dataRadius = (percentile / 100) * maxRadius
        const dataX = centerX + Math.cos(angle) * dataRadius
        const dataY = centerY + Math.sin(angle) * dataRadius
        
        if (index === 0) {
          pathData += `M ${dataX} ${dataY}`
        } else {
          pathData += ` L ${dataX} ${dataY}`
        }
      })
      
      pathData += ' Z' // Close the path
      
      return `
        <div style="width: 100%; max-width: 100%; margin: 0 auto; text-align: center; height: 48vh; display: flex; flex-direction: column; justify-content: center;">
          <h3 style="font-size: 20px; font-weight: 600; color: #1f2937; margin: 0 0 14px 0;">Life Performance Overview</h3>
          <svg width="100%" height="100%" viewBox="0 0 280 280" style="display: block; max-height: calc(42vh - 35px);">
            ${gridLines}
            <path d="${pathData}" fill="rgba(31, 41, 55, 0.2)" stroke="#1f2937" stroke-width="2" />
            ${categories.map((category, index) => {
              const angle = index * angleStep - Math.PI / 2
              const percentile = category.percentile || 0
              const dataRadius = (percentile / 100) * maxRadius
              const dataX = centerX + Math.cos(angle) * dataRadius
              const dataY = centerY + Math.sin(angle) * dataRadius
              return `<circle cx="${dataX}" cy="${dataY}" r="3" fill="#1f2937" stroke="#fff" stroke-width="2" />`
            }).join('')}
            ${labels}
          </svg>
        </div>
      `
    }

    // Generate responsive bar chart
    const generateBarChart = (categories: any[]) => {
      if (!categories || categories.length === 0) {
        return '<div>No category data available</div>'
      }

      const maxWidth = 350  // Reduced from 500
      const barHeight = 25   // Reduced from 30
      const chartHeight = categories.length * (barHeight + 8) + 50  // Reduced spacing
      const chartWidth = 520  // Reduced from 600
      
      return `
        <div style="width: 100%; max-width: 100%; margin: 0 auto; overflow: hidden; height: 46vh; display: flex; flex-direction: column; justify-content: center;">
          <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 10px 0; text-align: center;">Category Performance Breakdown</h3>
          <svg width="100%" height="100%" viewBox="0 0 ${chartWidth} ${chartHeight}" style="display: block; max-height: calc(42vh - 35px);">
            ${categories.map((category, index) => {
              const y = 20 + index * (barHeight + 8)
              const percentile = category.percentile || 0
              const width = (percentile / 100) * maxWidth
              let color = '#000000' // Black for low performance
              if (percentile >= 75) color = '#000000' // Black for high performance
              else if (percentile >= 50) color = '#4b5563' // Gray for medium performance
              else if (percentile >= 25) color = '#6b7280' // Light gray for low-medium performance
              
              return `
                <rect x="120" y="${y}" width="${maxWidth}" height="${barHeight}" fill="#f3f4f6" rx="3" />
                <rect x="120" y="${y}" width="${width}" height="${barHeight}" fill="${color}" rx="3" />
                <text x="115" y="${y + barHeight/2 + 4}" text-anchor="end" font-size="11" fill="#374151">${category.name}</text>
                <text x="${120 + width + 8}" y="${y + barHeight/2 + 4}" font-size="11" fill="#374151">${percentile}th</text>
              `
            }).join('')}
          </svg>
        </div>
      `
    }

    const radarChartSVG = generateRadarChart(reportData.categories || [])
    const barChartSVG = generateBarChart(reportData.categories || [])

    // Create simplified HTML content for the PDF with reduced margins
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RankMe Deep Life Analysis Report</title>
      <style>
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box;
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
          max-width: 100%;
        }
        
        body {
          font-family: Arial, sans-serif;
          line-height: 1.5;
          color: #1f2937;
          background: white;
          padding: 10px;  /* Reduced from 20px */
          max-width: 100%;
          overflow: hidden;
        }

        .cover-page {
          height: 95vh;
          max-height: 95vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #000000;
          color: white;
          page-break-after: always;
          padding: 20px;
          text-align: center;
          margin: 0;
          box-sizing: border-box;
          overflow: hidden;
        }
        
        .cover-logo { 
          font-size: 60px; 
          font-weight: 800; 
          margin-bottom: 15px; 
          line-height: 1.1;
        }
        .cover-subtitle { 
          font-size: 20px; 
          margin-bottom: 40px; 
          line-height: 1.2;
        }
        .cover-meta { 
          font-size: 13px; 
          text-align: center; 
          line-height: 1.4;
        }
        
        .score-summary {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          color: white;
          padding: 20px 15px;  /* Reduced from 25px 20px */
          border-radius: 16px;
          text-align: center;
          margin-bottom: 20px;  /* Reduced from 30px */
          max-width: 100%;
        }
        
        .overall-score { 
          font-size: 72px; 
          font-weight: 800; 
          margin-bottom: 8px; 
          line-height: 1;
        }
        .score-label { 
          font-size: 16px; 
          margin-bottom: 15px; 
          line-height: 1.3;
        }
        .demographics { 
          font-size: 13px; 
          margin-top: 15px; 
          padding-top: 15px; 
          border-top: 1px solid rgba(255, 255, 255, 0.2); 
          line-height: 1.4;
        }
        
        .chart-container { 
          margin: 15px 0;  /* Reduced from 25px 0 */
          text-align: center; 
          max-width: 100%;
          overflow: hidden;
          padding-top: 0;  /* Remove any top padding */
        }
        
        .chart-container:first-of-type {
          margin-top: 0;  /* Remove top margin for first chart after page break */
          padding-top: 10px;  /* Small padding instead of margin */
        }
        
        .chart-container svg { 
          max-width: 100%; 
          border-radius: 10px; 
          background: white; 
          padding: 10px;  /* Reduced from 15px */
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .section { 
          margin-bottom: 25px;  /* Reduced from 35px */
          page-break-inside: avoid;
          break-inside: avoid;
          max-width: 100%;
          overflow: hidden;
        }
        
        .section:first-child {
          margin-top: 0;  /* Remove top margin for first section */
          padding-top: 10px;  /* Small padding instead */
        }
        
        .section-title { 
          font-size: 20px; 
          font-weight: bold; 
          color: #1f2937; 
          margin-bottom: 18px;
          line-height: 1.2;
          word-wrap: break-word;
        }
        
        .category-grid { 
          margin-bottom: 20px;  /* Reduced from 25px */
          max-width: 100%;
        }
        .category-card { 
          border: 1px solid #e5e7eb; 
          border-radius: 10px; 
          padding: 12px;  /* Reduced from 15px */
          background: #f9fafb;
          margin-bottom: 12px;  /* Reduced from 15px */
          page-break-inside: avoid;
          break-inside: avoid;
          max-width: 100%;
          overflow: hidden;
        }
        .category-header { 
          display: flex; 
          align-items: flex-start; 
          margin-bottom: 10px;  /* Reduced from 12px */
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .category-name { 
          font-size: 14px; 
          font-weight: 600;
          line-height: 1.3;
          word-wrap: break-word;
          flex: 1;
          min-width: 0;
        }
        .category-score { 
          font-weight: 600;
          font-size: 13px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        
        .performance-bar { 
          width: 100%; 
          height: 10px; 
          background: #e5e7eb; 
          border-radius: 5px; 
          margin: 12px 0;  /* Reduced from 15px 0 */
          overflow: hidden;
        }
        .performance-fill { 
          height: 100%; 
          border-radius: 5px;
          transition: width 0.3s ease;
        }
        
        .insight-item {
          margin: 6px 0;  /* Reduced from 8px 0 */
          padding: 6px 8px;  /* Reduced from 8px 10px */
          background: white;
          border-radius: 5px;
          border-left: 3px solid #000000;
          max-width: 100%;
          overflow: hidden;
        }
        
        .insight-title {
          font-weight: 600;
          font-size: 12px;
          color: #1f2937;
          margin-bottom: 3px;  /* Reduced from 4px */
          line-height: 1.3;
        }
        
        .insight-list {
          font-size: 11px;
          color: #4b5563;
          line-height: 1.4;
          margin: 0;
          padding-left: 14px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .insight-list li {
          margin-bottom: 2px;  /* Reduced from 3px */
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .page-break { 
          page-break-before: always;
          break-before: page;
          margin: 0;  /* Ensure no extra margin */
          padding: 0;  /* Ensure no extra padding */
        }
        
        .action-week {
          background: white;
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 10px;
          border-left: 4px solid #000000;
          page-break-inside: avoid;
          break-inside: avoid;
          max-width: 100%;
          overflow: hidden;
        }
        
        .action-week-header {
          font-weight: 600;
          font-size: 15px;
          color: #1f2937;
          margin-bottom: 8px;
          line-height: 1.3;
          word-wrap: break-word;
        }
        
        .action-content {
          font-size: 11px;
          color: #4b5563;
          line-height: 1.4;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .action-list {
          margin: 5px 0;
          padding-left: 14px;
          max-width: 100%;
        }
        
        .action-list li {
          margin-bottom: 4px;
          word-wrap: break-word;
          overflow-wrap: break-word;
          line-height: 1.4;
        }
        
        ul, ol {
          padding-left: 14px;
          margin: 3px 0;  /* Reduced from 4px 0 */
          max-width: 100%;
        }
        
        li {
          margin-bottom: 2px;  /* Reduced from 3px */
          line-height: 1.4;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        /* Special handling for content after page break */
        .after-page-break {
          margin-top: 0;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="cover-page">
        <div class="cover-logo">RankMe</div>
        <div class="cover-subtitle">Deep Life Analysis Report</div>
        <div class="cover-meta">
          <div style="font-size: 36px; font-weight: 700; margin-bottom: 15px; line-height: 1;">${Math.round(reportData.overall?.score_0_100 || 0)}</div>
          <div style="font-size: 16px; margin-bottom: 30px; line-height: 1.2;">Overall Life Score</div>
          <div style="line-height: 1.4;">${reportData.cohort?.sex || 'N/A'} • ${reportData.cohort?.age_band || 'N/A'} • ${reportData.cohort?.region || 'N/A'}</div>
          <div style="margin-top: 8px; line-height: 1.4;">${new Date().toLocaleDateString()}</div>
        </div>
      </div>
      
      <div style="margin: 0; padding: 20px 0 0 0;">
        ${radarChartSVG}
        
        <div style="margin-top: 20px;">
          ${barChartSVG}
        </div>
      </div>

      <!-- All categories on a separate page -->
      <div class="page-break"></div>
      
      <div class="section after-page-break" style="padding-top: 10px;">
        <h2 class="section-title" style="margin-bottom: 10px;">Category Performance Details</h2>
        
        <div class="category-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          ${(reportData.categories || []).map((category: any) => {
            const percentile = category.percentile || 0;
            const getColor = (perc: number) => {
              if (perc >= 75) return '#000000';
              if (perc >= 50) return '#4b5563';
              if (perc >= 25) return '#6b7280';
              return '#000000';
            };
            
            return `
          <div class="category-card" style="padding: 10px; margin-bottom: 2px;">
            <div class="category-header" style="margin-bottom: 8px;">
              <div class="category-name" style="font-size: 14px;">${category.name || 'Unknown'}</div>
              <div class="category-score" style="color: ${getColor(percentile)}; font-size: 13px;">${percentile}th</div>
            </div>
            <div class="performance-bar" style="height: 8px; margin: 8px 0;">
              <div class="performance-fill" style="width: ${percentile}%; background: ${getColor(percentile)};"></div>
            </div>
            
            ${category.strengths && category.strengths.length > 0 ? `
            <div class="insight-item" style="padding: 6px 8px; margin: 5px 0;">
              <div class="insight-title" style="font-size: 11px;">Strengths</div>
              <ul class="insight-list" style="font-size: 10px;">
                ${category.strengths.slice(0, 1).map((strength: string) => `<li>${strength}</li>`).join('')}
              </ul>
            </div>
            ` : ''}
            
            ${category.opportunities && category.opportunities.length > 0 ? `
            <div class="insight-item" style="padding: 6px 8px; margin: 5px 0;">
              <div class="insight-title" style="font-size: 11px;">Opportunities</div>
              <ul class="insight-list" style="font-size: 10px;">
                ${category.opportunities.slice(0, 1).map((opp: string) => `<li>${opp}</li>`).join('')}
              </ul>
            </div>
            ` : ''}
            
            ${category.recommendations && category.recommendations.length > 0 ? `
            <div class="insight-item" style="padding: 6px 8px; margin: 5px 0;">
              <div class="insight-title" style="font-size: 11px;">Quick Wins</div>
              <ul class="insight-list" style="font-size: 10px;">
                ${category.recommendations.slice(0, 1).map((rec: string) => `<li>${rec}</li>`).join('')}
              </ul>
            </div>
            ` : ''}
          </div>
          `;
          }).join('')}
        </div>
      </div>

      ${reportData.actionPlan && reportData.actionPlan.length > 0 ? `
      <div class="page-break"></div>
      
      <div class="section after-page-break">
        <h2 class="section-title">30-Day Action Plan</h2>
        <div style="background: #f3f4f6; border: 2px solid #e5e7eb; border-radius: 12px; padding: 15px; margin-bottom: 20px; max-width: 100%; overflow: hidden; page-break-inside: avoid;">
          ${reportData.actionPlan.map((week: any, index: number) => `
          <div class="action-week">
            <div class="action-week-header">Week ${week.week}: ${week.focus}</div>
            <div class="action-content">
              <strong>Time Commitment:</strong> ${week.timeCommitment}<br><br>
              <strong>Daily Actions:</strong>
              <ul class="action-list">
                ${week.actions.map((action: string) => `<li>${action}</li>`).join('')}
              </ul>
            </div>
          </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      <div style="text-align: center; margin-top: 30px; padding: 15px; background: #f9fafb; border-radius: 10px; color: #6b7280; font-size: 11px; line-height: 1.4; max-width: 100%; overflow: hidden;">
        <div style="font-weight: 600; color: #1f2937; margin-bottom: 6px;">Generated by RankMe</div>
        <div>Your Personal Life Performance Platform</div>
        <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e5e7eb;">
          Report ID: ${assessmentId}<br>
          Generated: ${new Date().toLocaleDateString()}
        </div>
      </div>
    </body>
    </html>
    `

    console.log('Launching Puppeteer...')
    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    })
    
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' })
    
    console.log('Generating PDF...')
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',  /* Reduced from 20mm */
        right: '15mm',  /* Reduced from 18mm */
        bottom: '15mm',  /* Reduced from 20mm */
        left: '15mm'  /* Reduced from 18mm */
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      scale: 0.95  /* Slightly increased from 0.9 to use more space */
    })
    
    await browser.close()
    console.log('PDF generated successfully')

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="rankme-deep-report-${assessmentId}.pdf"`
      }
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message },
      { status: 500 }
    )
  }
}
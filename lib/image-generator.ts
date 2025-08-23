// Simplified image generation without Canvas for Windows compatibility
export async function generateShareImage(scoreData: any, format: 'instagram' | 'twitter' = 'instagram'): Promise<string> {
  // For now, return a simple data URL with text content
  // In production, you could use a service like Puppeteer or a cloud image generation API
  
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  
  const dimensions = format === 'instagram' 
    ? { width: 1080, height: 1350 }
    : { width: 1200, height: 630 }
  
  canvas.width = dimensions.width
  canvas.height = dimensions.height
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, dimensions.width, dimensions.height)
  gradient.addColorStop(0, '#3b82f6')
  gradient.addColorStop(1, '#1e40af')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, dimensions.width, dimensions.height)
  
  // White card background
  ctx.fillStyle = 'white'
  ctx.fillRect(40, 100, dimensions.width - 80, dimensions.height - 200)
  
  // Score text
  ctx.fillStyle = '#1e40af'
  ctx.font = 'bold 48px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(Math.round(scoreData.overall.score_0_100).toString(), dimensions.width / 2, 300)
  
  return canvas.toDataURL('image/png')
}
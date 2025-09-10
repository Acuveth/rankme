import { NextRequest, NextResponse } from 'next/server'
import { PDFCache } from '@/lib/utils/pdfCache'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  try {
    const stats = await PDFCache.getCacheStats()
    
    return NextResponse.json({
      cached_pdfs: stats.files,
      total_size_bytes: stats.totalSize,
      total_size_mb: Math.round(stats.totalSize / 1024 / 1024 * 100) / 100
    })
  } catch (error) {
    console.error('Error getting cache stats:', error)
    return NextResponse.json(
      { error: 'Failed to get cache stats' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const assessmentId = url.searchParams.get('assessment_id')
    const clearAll = url.searchParams.get('clear_all') === 'true'
    
    if (clearAll) {
      // Clear all cached PDFs
      const cacheDir = path.join(process.cwd(), 'cache', 'pdfs')
      try {
        const files = await fs.readdir(cacheDir)
        const pdfFiles = files.filter(file => file.endsWith('.pdf'))
        
        for (const file of pdfFiles) {
          await fs.unlink(path.join(cacheDir, file))
        }
        
        return NextResponse.json({
          message: `Cleared ${pdfFiles.length} cached PDFs`
        })
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to clear all cache' },
          { status: 500 }
        )
      }
    } else if (assessmentId) {
      // Clear cache for specific assessment
      await PDFCache.invalidateCache(assessmentId)
      
      return NextResponse.json({
        message: `Cleared cache for assessment ${assessmentId}`
      })
    } else {
      return NextResponse.json(
        { error: 'Must provide assessment_id or set clear_all=true' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error clearing cache:', error)
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    )
  }
}
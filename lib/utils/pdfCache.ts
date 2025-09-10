import { promises as fs } from 'fs'
import path from 'path'

export class PDFCache {
  private static cacheDir = path.join(process.cwd(), 'cache', 'pdfs')

  static async ensureCacheDir(): Promise<void> {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true })
    } catch (error) {
      console.error('Error creating cache directory:', error)
    }
  }

  static getCacheFilePath(assessmentId: string, language: string): string {
    const filename = `deep-report-${assessmentId}-${language}.pdf`
    return path.join(this.cacheDir, filename)
  }

  static async getCachedPDF(assessmentId: string, language: string): Promise<Buffer | null> {
    try {
      const cacheFilePath = this.getCacheFilePath(assessmentId, language)
      await fs.access(cacheFilePath)
      return await fs.readFile(cacheFilePath)
    } catch {
      return null
    }
  }

  static async cachePDF(assessmentId: string, language: string, pdfBuffer: Buffer): Promise<void> {
    try {
      await this.ensureCacheDir()
      const cacheFilePath = this.getCacheFilePath(assessmentId, language)
      await fs.writeFile(cacheFilePath, pdfBuffer)
      console.log(`Cached PDF for assessment ${assessmentId}`)
    } catch (error) {
      console.error('Error caching PDF:', error)
    }
  }

  static async invalidateCache(assessmentId: string): Promise<void> {
    try {
      const files = await fs.readdir(this.cacheDir)
      const matchingFiles = files.filter(file => 
        file.startsWith(`deep-report-${assessmentId}-`) && file.endsWith('.pdf')
      )
      
      for (const file of matchingFiles) {
        await fs.unlink(path.join(this.cacheDir, file))
        console.log(`Invalidated PDF cache: ${file}`)
      }
    } catch (error) {
      console.error('Error invalidating PDF cache:', error)
    }
  }

  static async getCacheStats(): Promise<{ files: number; totalSize: number }> {
    try {
      const files = await fs.readdir(this.cacheDir)
      const pdfFiles = files.filter(file => file.endsWith('.pdf'))
      
      let totalSize = 0
      for (const file of pdfFiles) {
        const stats = await fs.stat(path.join(this.cacheDir, file))
        totalSize += stats.size
      }

      return { files: pdfFiles.length, totalSize }
    } catch {
      return { files: 0, totalSize: 0 }
    }
  }
}
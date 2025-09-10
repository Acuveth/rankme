// Note: This test requires the Next.js environment to run properly
// Run with: npm run dev (then test via API endpoint)
console.log('PDF Cache test requires Next.js environment - test via API endpoints instead')

async function testPDFCache() {
  console.log('Testing PDF Cache functionality...')
  
  // Test 1: Create mock PDF data
  const mockPDF = Buffer.from('Mock PDF content for testing')
  const assessmentId = 'test-assessment-123'
  const language = 'en'
  
  try {
    // Test 2: Cache the PDF
    console.log('1. Caching test PDF...')
    await PDFCache.cachePDF(assessmentId, language, mockPDF)
    
    // Test 3: Retrieve cached PDF
    console.log('2. Retrieving cached PDF...')
    const cached = await PDFCache.getCachedPDF(assessmentId, language)
    
    if (cached && cached.equals(mockPDF)) {
      console.log('✅ Cache storage and retrieval working correctly')
    } else {
      console.log('❌ Cache retrieval failed or data mismatch')
    }
    
    // Test 4: Get cache stats
    console.log('3. Getting cache stats...')
    const stats = await PDFCache.getCacheStats()
    console.log(`Cache stats: ${stats.files} files, ${stats.totalSize} bytes`)
    
    // Test 5: Invalidate cache
    console.log('4. Invalidating cache...')
    await PDFCache.invalidateCache(assessmentId)
    
    // Test 6: Verify cache cleared
    console.log('5. Verifying cache cleared...')
    const clearedCache = await PDFCache.getCachedPDF(assessmentId, language)
    
    if (clearedCache === null) {
      console.log('✅ Cache invalidation working correctly')
    } else {
      console.log('❌ Cache invalidation failed')
    }
    
    console.log('PDF Cache testing completed successfully!')
    
  } catch (error) {
    console.error('PDF Cache test failed:', error)
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testPDFCache()
}

module.exports = { testPDFCache }
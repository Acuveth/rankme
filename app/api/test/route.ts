import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const assessments = await prisma.assessment.findMany({
      take: 5,
      include: {
        scoreOverall: true
      }
    })
    
    return NextResponse.json({ 
      message: 'Database connected successfully',
      assessments: assessments.length,
      data: assessments
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Database connection failed', details: error },
      { status: 500 }
    )
  }
}
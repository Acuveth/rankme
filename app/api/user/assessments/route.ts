import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      console.log('Session check failed:', { session })
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    console.log('Fetching assessments for user:', session.user.email)

    // Find user by email first, then get assessments
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      console.log('User not found in database:', session.user.email)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('Found user:', { id: user.id, email: user.email })

    const assessments = await prisma.assessment.findMany({
      where: { userId: user.id },
      include: {
        scoreOverall: true,
        scoreCategory: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('Found assessments:', assessments.length)

    return NextResponse.json({
      success: true,
      assessments
    })
  } catch (error) {
    console.error('Error fetching user assessments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    )
  }
}
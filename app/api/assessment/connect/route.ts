import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { assessmentId } = await request.json()
    
    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update the assessment to connect it to the user
    const assessment = await prisma.assessment.update({
      where: { id: assessmentId },
      data: { userId: user.id }
    })

    return NextResponse.json({
      success: true,
      assessment
    })
  } catch (error) {
    console.error('Error connecting assessment:', error)
    return NextResponse.json(
      { error: 'Failed to connect assessment' },
      { status: 500 }
    )
  }
}
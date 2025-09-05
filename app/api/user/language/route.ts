import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { language } = await req.json()

    if (!language || !['en', 'es', 'fr', 'de'].includes(language)) {
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 })
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (user) {
      // Update existing user's language preference
      user = await prisma.user.update({
        where: { id: user.id },
        data: { language }
      })
    } else {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || '',
          language
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      language: user.language 
    })

  } catch (error) {
    console.error('Error saving language preference:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { language: true }
    })

    return NextResponse.json({ 
      language: user?.language || 'en' 
    })

  } catch (error) {
    console.error('Error fetching language preference:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, message, category } = await request.json()

    // Validate input
    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 })
    }

    // Store support request in database (optional - you could also send email here)
    const supportTicket = {
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name || 'User',
      subject,
      message,
      category: category || 'general',
      createdAt: new Date().toISOString()
    }

    // Here you would typically:
    // 1. Send an email to support team
    // 2. Send confirmation email to user
    // 3. Store in a support ticket system
    
    // For now, we'll just log it and return success
    console.log('Support ticket created:', supportTicket)

    // You could also store this in a database table if you create a SupportTicket model
    // const ticket = await prisma.supportTicket.create({ data: supportTicket })

    return NextResponse.json({ 
      success: true,
      message: 'Your support request has been submitted. We\'ll get back to you within 24 hours.',
      ticketId: `SUPPORT-${Date.now()}`
    })
  } catch (error) {
    console.error('Error creating support ticket:', error)
    return NextResponse.json({ error: 'Failed to submit support request' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    const goals = await prisma.goal.findMany({
      where: {
        userId: user.id,
        ...(status && { status }),
        ...(category && { category })
      },
      orderBy: [
        { status: 'desc' }, // Active goals first
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ goals })
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { title, description, category, target, deadline, priority, milestones } = body

    if (!title || !category || !target) {
      return NextResponse.json(
        { error: 'Title, category, and target are required' },
        { status: 400 }
      )
    }

    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        title,
        description,
        category,
        target,
        deadline: deadline ? new Date(deadline) : null,
        priority: priority || 'medium',
        milestones: milestones ? JSON.stringify(milestones) : null
      }
    })

    return NextResponse.json({ goal })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { id, progress, status, notes, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      )
    }

    // Check if goal belongs to user
    const existingGoal = await prisma.goal.findUnique({
      where: { id }
    })

    if (!existingGoal || existingGoal.userId !== user.id) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    const updatePayload: any = {
      ...updateData,
      updatedAt: new Date()
    }

    if (typeof progress === 'number') {
      updatePayload.progress = Math.max(0, Math.min(100, progress))
    }

    if (status) {
      updatePayload.status = status
      if (status === 'completed') {
        updatePayload.completedAt = new Date()
        updatePayload.progress = 100
      }
    }

    if (notes !== undefined) {
      updatePayload.notes = notes
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: updatePayload
    })

    return NextResponse.json({ goal })
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      )
    }

    // Check if goal belongs to user
    const existingGoal = await prisma.goal.findUnique({
      where: { id }
    })

    if (!existingGoal || existingGoal.userId !== user.id) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    await prisma.goal.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    )
  }
}
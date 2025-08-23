import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { assessmentId, answers } = body

    const answerData = answers.map((answer: any) => ({
      assessmentId,
      questionId: answer.questionId,
      valueRaw: typeof answer.value === 'object' 
        ? JSON.stringify(answer.value) 
        : String(answer.value),
    }))

    await prisma.answer.deleteMany({
      where: { assessmentId }
    })

    await prisma.answer.createMany({
      data: answerData
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving answers:', error)
    return NextResponse.json(
      { error: 'Failed to save answers' },
      { status: 500 }
    )
  }
}
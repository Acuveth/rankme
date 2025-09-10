import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { assessmentAnswerSchema } from '@/lib/validations/schemas'
import { withMiddleware, withValidation, withSecurityHeaders } from '@/lib/middleware/security'
import { withErrorHandler, throwIfNotFound, DatabaseError } from '@/lib/utils/errorHandler'
import { sanitizeObject } from '@/lib/middleware/security'

async function saveAnswersHandler(request: NextRequest, validatedData: any) {
  const { assessmentId, answers } = validatedData

  // Verify assessment exists and is not completed
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    select: { id: true, status: true }
  })

  throwIfNotFound(assessment, 'Assessment not found')

  if (assessment!.status === 'completed') {
    return NextResponse.json(
      { error: 'Cannot modify completed assessment' },
      { status: 409 }
    )
  }

  // Sanitize and validate answer data
  const sanitizedAnswers = answers.map((answer: any) => {
    const sanitized = sanitizeObject(answer)
    
    return {
      assessmentId,
      questionId: String(sanitized.questionId).trim(),
      valueRaw: typeof sanitized.value === 'object' 
        ? JSON.stringify(sanitized.value) 
        : String(sanitized.value).trim(),
    }
  })

  // Validate question IDs exist in our system
  // This would typically check against a questions table or config
  const validQuestionIds = sanitizedAnswers.every(answer => 
    answer.questionId.match(/^[a-zA-Z0-9_-]+$/) && // Valid format
    answer.questionId.length <= 50 && // Reasonable length
    answer.valueRaw.length <= 1000 // Prevent excessive data
  )

  if (!validQuestionIds) {
    return NextResponse.json(
      { error: 'Invalid question data format' },
      { status: 400 }
    )
  }

  try {
    // Use transaction for data consistency
    await prisma.$transaction(async (tx) => {
      // Delete existing answers for this assessment
      await tx.answer.deleteMany({
        where: { assessmentId }
      })

      // Create new answers
      if (sanitizedAnswers.length > 0) {
        await tx.answer.createMany({
          data: sanitizedAnswers
        })
      }
    })

    return NextResponse.json({ 
      success: true,
      count: sanitizedAnswers.length
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error('Transaction failed:', error)
    throw new DatabaseError('Failed to save assessment answers')
  }
}

export const POST = withMiddleware(
  withValidation(assessmentAnswerSchema),
  withSecurityHeaders,
  withErrorHandler
)(saveAnswersHandler)
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { enhancedCoachingEngine } from '@/lib/enhanced-coaching'
import { openai } from '@/lib/openai'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      taskId,
      originalTask,
      userRequest,
      // e.g., "Make this task shorter and focus more on budgeting apps"
      // or "I only have 10 minutes, not 30 minutes for this"
      // or "Change this to focus on my specific debt situation"
    } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          where: {
            status: 'active',
            product: 'ai_coach_monthly'
          }
        }
      }
    })

    if (!user || user.subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No active AI Coach subscription' },
        { status: 403 }
      )
    }

    // Verify assessment exists
    const assessment = await prisma.assessment.findUnique({
      where: { 
        id: params.id,
        userId: user.id 
      }
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    // Use AI to customize the task based on user request
    const customizationPrompt = `You are helping a user customize a task that was generated from their life assessment.

ORIGINAL TASK:
Title: ${originalTask.title}
Description: ${originalTask.description}
Category: ${originalTask.category}
Estimated Minutes: ${originalTask.estimatedMinutes}
Priority: ${originalTask.priority}
Reasoning: ${originalTask.reasoning}

USER'S CUSTOMIZATION REQUEST:
"${userRequest}"

Create a modified version of this task that incorporates the user's request while maintaining the effectiveness for their ${originalTask.category} improvement. Keep the task actionable and specific.

Respond with JSON in this format:
{
  "customizedTask": {
    "title": "Modified task title",
    "description": "Modified detailed description",
    "estimatedMinutes": 25,
    "priority": "high",
    "reasoning": "Updated reasoning explaining why this customization works for their situation"
  },
  "changes": {
    "summary": "Brief description of what was changed and why",
    "modifications": ["List of specific changes made"]
  }
}`

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system", 
          content: "You are an expert life coach who helps customize tasks based on user preferences while maintaining their effectiveness. Always respond with valid JSON."
        }, {
          role: "user",
          content: customizationPrompt
        }],
        temperature: 0.7,
        max_tokens: 500,
      })

      const response = completion.choices[0].message.content
      if (response) {
        try {
          const customization = JSON.parse(response)
          
          return NextResponse.json({
            success: true,
            taskId,
            original: originalTask,
            customized: {
              id: taskId, // Keep same ID for approval process
              ...customization.customizedTask,
              category: originalTask.category // Preserve category
            },
            changes: customization.changes,
            approval: {
              message: "Review your customized task and approve it to add to your dashboard",
              instructions: "Send this customized task to the approve-tasks endpoint if you're satisfied"
            }
          })
        } catch (parseError) {
          console.error('Failed to parse task customization JSON:', parseError)
        }
      }
    } catch (error) {
      console.error('Error customizing task:', error)
    }

    // Fallback to simple modifications if AI fails
    return NextResponse.json({
      success: true,
      taskId,
      original: originalTask,
      customized: {
        id: taskId,
        title: originalTask.title,
        description: `${originalTask.description} (Note: ${userRequest})`,
        category: originalTask.category,
        estimatedMinutes: originalTask.estimatedMinutes,
        priority: originalTask.priority,
        reasoning: `${originalTask.reasoning} - Modified based on your request: "${userRequest}"`
      },
      changes: {
        summary: "Added your request as a note to the task description",
        modifications: ["Added user request as guidance note"]
      },
      approval: {
        message: "Review your customized task and approve it to add to your dashboard",
        instructions: "Send this customized task to the approve-tasks endpoint if you're satisfied"
      }
    })
  } catch (error) {
    console.error('Error processing task customization:', error)
    return NextResponse.json(
      { error: 'Failed to customize task' },
      { status: 500 }
    )
  }
}
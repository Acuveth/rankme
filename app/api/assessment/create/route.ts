import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAgeBand } from '@/lib/utils'
import { cohortDataSchema } from '@/lib/validations/schemas'
import { withMiddleware, withValidation, withSecurityHeaders } from '@/lib/middleware/security'
import { withErrorHandler, validateInput } from '@/lib/utils/errorHandler'
import countries from '@/data/countries.json'

async function createAssessmentHandler(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = validateInput(cohortDataSchema, body);
    const { age, country, sexGender } = validatedData

  // Sanitize inputs
  const sanitizedCountry = country.trim().toUpperCase()
  const sanitizedGender = sexGender.trim()
  
  // Validate country code exists
  const countryExists = countries.countries.some(c => c.code === sanitizedCountry)
  if (!countryExists) {
    return NextResponse.json(
      { error: 'Invalid country code' },
      { status: 400 }
    )
  }

  const ageBand = getAgeBand(age)
  const region = getRegion(sanitizedCountry)

  const assessment = await prisma.assessment.create({
    data: {
      cohortAge: ageBand,
      cohortSex: sanitizedGender,
      cohortRegion: region,
      anonId: generateAnonId(),
    },
    select: {
      id: true
    }
  })

  return NextResponse.json({ 
    assessmentId: assessment.id 
  }, {
    status: 201,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  })
  } catch (error) {
    console.error('Assessment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    );
  }
}

export const POST = withErrorHandler(createAssessmentHandler)

function getRegion(countryCode: string): string {
  // Find the country in our countries data
  const country = countries.countries.find(c => c.code === countryCode)
  
  // Return the region if found, otherwise return 'Global'
  return country ? country.region : 'Global'
}

function generateAnonId(): string {
  return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAgeBand } from '@/lib/utils'
import countries from '@/data/countries.json'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { age, country, sexGender } = body

    const ageBand = getAgeBand(age)
    const region = getRegion(country)

    const assessment = await prisma.assessment.create({
      data: {
        cohortAge: ageBand,
        cohortSex: sexGender,
        cohortRegion: region,
        anonId: generateAnonId(),
      }
    })

    return NextResponse.json({ assessmentId: assessment.id })
  } catch (error) {
    console.error('Error creating assessment:', error)
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    )
  }
}

function getRegion(countryCode: string): string {
  // Find the country in our countries data
  const country = countries.countries.find(c => c.code === countryCode)
  
  // Return the region if found, otherwise return 'Global'
  return country ? country.region : 'Global'
}

function generateAnonId(): string {
  return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
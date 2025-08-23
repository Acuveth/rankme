import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAgeBand } from '@/lib/utils'

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

function getRegion(country: string): string {
  const regions: { [key: string]: string } = {
    'US': 'North America',
    'CA': 'North America',
    'UK': 'Europe',
    'DE': 'Europe',
    'FR': 'Europe',
    'AU': 'Oceania',
  }
  return regions[country] || 'Global'
}

function generateAnonId(): string {
  return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
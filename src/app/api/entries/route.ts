import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { entryServerSchema } from '@/lib/validators/entry.server'

const userId = 'demo-user-id'

export async function GET() {
  try {
    const entries = await prisma.healthEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(entries)
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = entryServerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      )
    }

    const { userId, symptoms, ...entryData } = parsed.data

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    })

    if (symptoms?.trim()) {
      await prisma.symptom.upsert({
        where: { name: symptoms.trim() },
        update: {},
        create: { name: symptoms.trim() },
      })
    }

    const entry = await prisma.healthEntry.create({
      data: {
        ...entryData,
        userId,
        symptoms: symptoms?.trim() || null,
      },
    })

    return NextResponse.json(entry)
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}


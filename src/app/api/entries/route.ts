import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { entryServerSchema } from '@/lib/validators/entry.server'

export async function GET() {
  const entries = await prisma.healthEntry.findMany({
    where: { userId: 'demo-user-id' },
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(entries)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = entryServerSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }

  const { userId, symptoms, ...entryData } = parsed.data

  try {
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, height: 170, weight: 65 },
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
        userId,
        ...entryData,
        symptoms: symptoms?.trim() || null,
      },
    })

    return NextResponse.json(entry)
  } catch (err) {
    console.error('Ошибка при создании записи:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const entries = await prisma.healthEntry.findMany({
      orderBy: { date: 'desc' },
      include: { user: true },
    })
    return NextResponse.json(entries)
  } catch (err) {
    console.error('GET /api/entries error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Фиктивный юзер
    const user = await prisma.user.upsert({
      where: { id: 'test-user-1' },
      update: {},
      create: { id: 'test-user-1', height: body.height || null, weight: body.weight || null },
    })

    const entry = await prisma.healthEntry.create({
      data: {
        date: new Date(body.date),
        feeling: body.feeling,
        temperature: body.temperature,
        pressureSystolic: body.pressureSystolic,
        pressureDiastolic: body.pressureDiastolic,
        pulse: body.pulse,
        headache: body.headache,
        symptoms: body.symptoms,
        userId: user.id,
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (err) {
    console.error('POST /api/entries error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const trimmedQ = q.trim();

  const symptoms = await prisma.symptom.findMany({
    where: { name: { startsWith: trimmedQ, mode: 'insensitive' } },
    take: 10,
  });

  return NextResponse.json(symptoms.map(s => s.name));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 });
    }

    const symptom = await prisma.symptom.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    return NextResponse.json(symptom);
  } catch (err) {
    console.error('Ошибка при сохранении симптома:', err);
    return NextResponse.json({ error: 'Failed to save symptom' }, { status: 500 });
  }
}

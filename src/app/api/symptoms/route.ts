import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const symptoms = await prisma.symptom.findMany({
    where: { name: { startsWith: q, mode: 'insensitive' } },
    take: 10,
  });
  return NextResponse.json(symptoms);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name } = body;
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

  const symptom = await prisma.symptom.upsert({
    where: { name },
    update: {},
    create: { name },
  });

  return NextResponse.json(symptom);
}

//route по добавлению новых симптомов в БД
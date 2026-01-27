import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { userUpdateSchema } from '@/lib/validators/user.server'

const userId = 'demo-user-id'

export async function GET() {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { height: true, weight: true },
  })

  return NextResponse.json(user)
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const parsed = userUpdateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.format() },
      { status: 400 }
    )
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: parsed.data,
  })

  return NextResponse.json(user)
}

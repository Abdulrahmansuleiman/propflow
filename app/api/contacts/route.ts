import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const type = searchParams.get('type')

  const contacts = await prisma.contact.findMany({
    where: {
      AND: [
        search ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
          ]
        } : {},
        type ? { type } : {},
      ],
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(contacts)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const contact = await prisma.contact.create({ data: body })
  return NextResponse.json(contact, { status: 201 })
}

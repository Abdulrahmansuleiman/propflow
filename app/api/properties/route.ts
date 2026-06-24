import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const status = searchParams.get('status')
  const type = searchParams.get('type')

  const properties = await prisma.property.findMany({
    where: {
      AND: [
        search ? {
          OR: [
            { title: { contains: search } },
            { address: { contains: search } },
          ]
        } : {},
        status ? { status } : {},
        type ? { type } : {},
      ],
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(properties)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const property = await prisma.property.create({ data: body })
  return NextResponse.json(property, { status: 201 })
}

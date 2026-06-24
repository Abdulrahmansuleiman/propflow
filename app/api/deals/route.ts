import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const stage = searchParams.get('stage')
  const where = stage ? { stage } : {}
  const deals = await prisma.deal.findMany({
    where,
    include: { contact: { select: { name: true, email: true } }, property: { select: { title: true, address: true } } },
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json(deals)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const deal = await prisma.deal.create({
    data: {
      title: body.title,
      value: parseFloat(body.value),
      stage: body.stage || 'New',
      contactId: body.contactId,
      propertyId: body.propertyId || null,
      notes: body.notes || null,
    },
  })
  return NextResponse.json(deal, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const propertyId = searchParams.get('propertyId')
  const contactId = searchParams.get('contactId')
  const status = searchParams.get('status')

  const where: any = { AND: [] }
  if (propertyId) where.AND.push({ propertyId })
  if (contactId) where.AND.push({ contactId })
  if (status) where.AND.push({ status })

  const showings = await prisma.showing.findMany({
    where: where.AND.length > 0 ? where : undefined,
    include: {
      contact: { select: { name: true, phone: true } },
      property: { select: { title: true, address: true } },
    },
    orderBy: { dateTime: 'asc' },
  })

  return NextResponse.json(showings)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const showing = await prisma.showing.create({
    data: {
      dateTime: new Date(body.dateTime),
      status: body.status || 'scheduled',
      notes: body.notes || null,
      contactId: body.contactId,
      propertyId: body.propertyId,
    },
  })
  return NextResponse.json(showing, { status: 201 })
}

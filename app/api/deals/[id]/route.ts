import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      contact: true,
      property: true,
      tasks: { orderBy: { createdAt: 'desc' } },
    },
  })
  if (!deal) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(deal)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const data: any = {}
  if (body.title !== undefined) data.title = body.title
  if (body.value !== undefined) data.value = parseFloat(body.value)
  if (body.stage !== undefined) data.stage = body.stage
  if (body.notes !== undefined) data.notes = body.notes
  if (body.contactId !== undefined) data.contactId = body.contactId
  if (body.propertyId !== undefined) data.propertyId = body.propertyId || null
  const deal = await prisma.deal.update({ where: { id }, data })
  return NextResponse.json(deal)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.deal.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

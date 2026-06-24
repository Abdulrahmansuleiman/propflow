import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contact = await prisma.contact.findUnique({
    where: { id },
    include: { deals: true, properties: true, tasks: true, showings: true },
  })
  if (!contact) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(contact)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const contact = await prisma.contact.update({ where: { id }, data: body })
  return NextResponse.json(contact)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.contact.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const data: any = {}
  if (body.status) data.status = body.status
  if (body.notes !== undefined) data.notes = body.notes
  if (body.dateTime) data.dateTime = new Date(body.dateTime)
  const showing = await prisma.showing.update({ where: { id }, data })
  return NextResponse.json(showing)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.showing.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

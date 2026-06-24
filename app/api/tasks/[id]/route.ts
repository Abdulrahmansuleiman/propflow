import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const data: any = {}
  if (body.title !== undefined) data.title = body.title
  if (body.completed !== undefined) data.completed = body.completed
  if (body.priority !== undefined) data.priority = body.priority
  if (body.dueDate !== undefined) data.dueDate = body.dueDate ? new Date(body.dueDate) : null
  if (body.notes !== undefined) data.notes = body.notes
  const task = await prisma.task.update({ where: { id }, data })
  return NextResponse.json(task)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.task.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

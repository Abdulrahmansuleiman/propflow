import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const completed = searchParams.get('completed')
  const dealId = searchParams.get('dealId')
  const contactId = searchParams.get('contactId')

  const where: any = { AND: [] }
  if (completed === 'false') where.AND.push({ completed: false })
  if (completed === 'true') where.AND.push({ completed: true })
  if (dealId) where.AND.push({ dealId })
  if (contactId) where.AND.push({ contactId })

  const tasks = await prisma.task.findMany({
    where: where.AND.length > 0 ? where : undefined,
    include: {
      contact: { select: { name: true, id: true } },
      deal: { select: { title: true, id: true } },
    },
    orderBy: [{ completed: 'asc' }, { dueDate: 'asc' }],
  })

  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const task = await prisma.task.create({
    data: {
      title: body.title,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      priority: body.priority || 'medium',
      notes: body.notes || null,
      contactId: body.contactId || null,
      dealId: body.dealId || null,
    },
  })
  return NextResponse.json(task, { status: 201 })
}

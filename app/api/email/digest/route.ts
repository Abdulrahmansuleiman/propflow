import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function GET() {
  if (!resend) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
  }

  const today = new Date()
  today.setHours(23, 59, 59, 999)
  const tasks = await prisma.task.findMany({
    where: {
      completed: false,
      dueDate: { lte: today },
    },
    include: {
      contact: { select: { name: true } },
      deal: { select: { title: true, id: true } },
    },
    orderBy: { dueDate: 'asc' },
  })

  const overdue = tasks.filter((t) => t.dueDate && t.dueDate < new Date())
  const dueToday = tasks.filter((t) => {
    if (!t.dueDate) return false
    const d = new Date(t.dueDate)
    return d.toDateString() === new Date().toDateString()
  })

  if (overdue.length === 0 && dueToday.length === 0) {
    return NextResponse.json({ message: 'No tasks due today' })
  }

  const taskList = (taskType: string, items: typeof tasks) => `
<h2 style="color:#ef4444;margin-top:24px">${taskType}</h2>
${items.map((t) => `
  <div style="padding:12px;border:1px solid #1f2937;border-radius:8px;margin-bottom:8px;background:#111827">
    <p style="margin:0;color:#e5e7eb;font-weight:600">${t.title}</p>
    ${t.contact ? `<p style="margin:4px 0 0;color:#6b7280;font-size:14px">Contact: ${t.contact.name}</p>` : ''}
    ${t.deal ? `<p style="margin:2px 0 0;color:#6b7280;font-size:14px">Deal: ${t.deal.title}</p>` : ''}
    ${t.dueDate ? `<p style="margin:2px 0 0;color:#6b7280;font-size:14px">Due: ${t.dueDate.toLocaleDateString()}</p>` : ''}
  </div>
`).join('')}`

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0a0a0a;padding:24px;font-family:sans-serif">
  <h1 style="color:#fff;font-size:24px">PropFlow — Daily Task Digest</h1>
  ${overdue.length > 0 ? taskList(`Overdue (${overdue.length})`, overdue) : ''}
  ${dueToday.length > 0 ? taskList(`Due Today (${dueToday.length})`, dueToday) : ''}
  <p style="color:#6b7280;font-size:12px;margin-top:24px">
    PropFlow CRM — <a href="https://propflow.vercel.app" style="color:#3b82f6">View Dashboard</a>
  </p>
</body>
</html>`

  await resend.emails.send({
    from: 'PropFlow <digest@propflow.vercel.app>',
    to: ['team@propflow.vercel.app'],
    subject: `PropFlow Daily — ${overdue.length} overdue, ${dueToday.length} due today`,
    html,
  })

  return NextResponse.json({ sent: true, overdue: overdue.length, dueToday: dueToday.length })
}

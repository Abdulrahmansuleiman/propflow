import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const contacts = await prisma.contact.findMany({
    include: {
      deals: { select: { stage: true, updatedAt: true } },
      tasks: { select: { completed: true } },
      showings: { select: { dateTime: true } },
    },
  })

  const scored = contacts.map((c) => {
    let score = 5

    const activeDeals = c.deals.filter((d) => d.stage !== 'Won' && d.stage !== 'Lost')
    if (activeDeals.length > 0) score += 2
    if (c.deals.some((d) => d.stage === 'Negotiation' || d.stage === 'Proposal')) score += 2

    const recentDeal = c.deals.reduce((latest, d) =>
      d.updatedAt > latest ? d.updatedAt : latest, new Date(0))
    const daysSinceDealActivity = Math.floor((Date.now() - new Date(recentDeal).getTime()) / 86400000)

    if (daysSinceDealActivity <= 7) score += 1
    if (daysSinceDealActivity > 30) score -= 1

    const pendingTasks = c.tasks.filter((t) => !t.completed).length
    if (pendingTasks > 0) score += 1

    const recentShowing = c.showings.reduce((latest, s) =>
      s.dateTime > latest ? s.dateTime : latest, new Date(0))
    const daysSinceShowing = Math.floor((Date.now() - new Date(recentShowing).getTime()) / 86400000)
    if (daysSinceShowing <= 14 && daysSinceShowing >= 0) score += 1

    if (c.deals.some((d) => d.stage === 'Lost')) score -= 2

    return {
      id: c.id,
      name: c.name,
      score: Math.max(1, Math.min(10, score)),
    }
  })

  return NextResponse.json(scored)
}

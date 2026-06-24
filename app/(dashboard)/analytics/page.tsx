import { prisma } from '@/lib/db'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'
import AnalyticsClient from './AnalyticsClient'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const [allDeals, wonDeals, contactsCount, tasksCount] = await Promise.all([
    prisma.deal.findMany(),
    prisma.deal.findMany({
      where: { stage: 'Won', updatedAt: { gte: monthStart, lte: monthEnd } },
    }),
    prisma.contact.count(),
    prisma.task.count({ where: { completed: false } }),
  ])

  const pipelineValue = allDeals.reduce((sum, d) => sum + d.value, 0)
  const wonThisMonth = wonDeals.length
  const wonValueThisMonth = wonDeals.reduce((sum, d) => sum + d.value, 0)
  const avgDealSize = allDeals.length > 0 ? pipelineValue / allDeals.length : 0

  const stageCounts: Record<string, number> = {}
  for (const d of allDeals) {
    stageCounts[d.stage] = (stageCounts[d.stage] || 0) + 1
  }
  const conversionRate = stageCounts['Won']
    ? Math.round((stageCounts['Won'] / (stageCounts['New'] || 1)) * 100)
    : 0

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(now, i)
    return format(d, 'MMM yyyy')
  }).reverse()

  return (
    <AnalyticsClient
      pipelineValue={pipelineValue}
      wonThisMonth={wonThisMonth}
      wonValueThisMonth={wonValueThisMonth}
      avgDealSize={avgDealSize}
      conversionRate={conversionRate}
      contactsCount={contactsCount}
      pendingTasks={tasksCount}
      stageCounts={stageCounts}
      last6Months={last6Months}
    />
  )
}

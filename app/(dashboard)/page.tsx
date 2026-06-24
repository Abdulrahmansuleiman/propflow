import { prisma } from '@/lib/db'
import { startOfMonth, endOfMonth, isAfter, isBefore } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const [totalDeals, deals, tasks, taskCount] = await Promise.all([
    prisma.deal.aggregate({ _sum: { value: true } }),
    prisma.deal.findMany({
      where: { stage: 'Won', updatedAt: { gte: monthStart, lte: monthEnd } },
    }),
    prisma.task.findMany({
      where: { completed: false },
      orderBy: { dueDate: 'asc' },
      take: 10,
    }),
    prisma.task.count({ where: { completed: false, dueDate: { lte: now } } }),
  ])

  const pipelineValue = totalDeals._sum.value ?? 0
  const dealsWonThisMonth = deals.length
  const wonValue = deals.reduce((sum, d) => sum + d.value, 0)
  const overdueCount = taskCount

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pipeline Value" value={`$${(pipelineValue / 1000).toFixed(1)}K`} />
        <StatCard title="Deals Won This Month" value={dealsWonThisMonth.toString()} sub={`$${(wonValue / 1000).toFixed(1)}K`} />
        <StatCard title="Active Deals" value={dealsWonThisMonth > 0 ? 'Active' : '0'} />
        <StatCard title="Overdue Tasks" value={overdueCount.toString()} urgent={overdueCount > 0} />
      </div>

      <div className="rounded-xl border border-gray-800 bg-[#111827] p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Tasks Due</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending tasks</p>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 text-sm">
                <input type="checkbox" className="accent-blue-600" />
                <span className={task.dueDate && isBefore(task.dueDate, now) ? 'text-red-400' : 'text-gray-200'}>
                  {task.title}
                </span>
                {task.dueDate && (
                  <span className="text-xs text-gray-500 ml-auto">
                    {task.dueDate.toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, sub, urgent }: { title: string; value: string; sub?: string; urgent?: boolean }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-[#111827] p-5">
      <p className="text-sm text-gray-400">{title}</p>
      <p className={`text-2xl font-bold mt-1 ${urgent ? 'text-red-400' : 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

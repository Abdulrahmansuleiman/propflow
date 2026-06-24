'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts'

const stageOrder = ['New', 'Contacted', 'Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost']
const stageColors: Record<string, string> = {
  New: '#6b7280',
  Contacted: '#3b82f6',
  Discovery: '#eab308',
  Proposal: '#a855f7',
  Negotiation: '#f97316',
  Won: '#22c55e',
  Lost: '#ef4444',
}

export default function AnalyticsClient({
  pipelineValue,
  wonThisMonth,
  wonValueThisMonth,
  avgDealSize,
  conversionRate,
  contactsCount,
  pendingTasks,
  stageCounts,
  last6Months,
}: {
  pipelineValue: number
  wonThisMonth: number
  wonValueThisMonth: number
  avgDealSize: number
  conversionRate: number
  contactsCount: number
  pendingTasks: number
  stageCounts: Record<string, number>
  last6Months: string[]
}) {
  const funnelData = stageOrder.map((stage) => ({
    name: stage,
    value: stageCounts[stage] || 0,
    fill: stageColors[stage],
  }))

  const totalNew = stageCounts['New'] || 1
  const funnelPercent = funnelData.map((d) => ({
    ...d,
    percent: Math.round((d.value / totalNew) * 100),
  }))

  const monthlyData = last6Months.map((month) => ({
    name: month,
    value: Math.floor(Math.random() * 500000 + 100000), // placeholder until we aggregate by month
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-800 bg-[#111827] p-5">
          <p className="text-sm text-gray-400">Pipeline Value</p>
          <p className="text-2xl font-bold text-white mt-1">${(pipelineValue / 1000).toFixed(1)}K</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#111827] p-5">
          <p className="text-sm text-gray-400">Won This Month</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{wonThisMonth}</p>
          <p className="text-xs text-gray-500">${(wonValueThisMonth / 1000).toFixed(1)}K</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#111827] p-5">
          <p className="text-sm text-gray-400">Avg Deal Size</p>
          <p className="text-2xl font-bold text-white mt-1">${(avgDealSize / 1000).toFixed(1)}K</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#111827] p-5">
          <p className="text-sm text-gray-400">Conversion Rate</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{conversionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-800 bg-[#111827] p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Deals Closed Per Month</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#e5e7eb' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-800 bg-[#111827] p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Pipeline Funnel</h2>
          <div className="space-y-3">
            {funnelPercent.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{item.name}</span>
                  <span className="text-gray-400">{item.value} ({item.percent}%)</span>
                </div>
                <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.percent}%`, backgroundColor: item.fill }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-800 bg-[#111827] p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Deals by Stage</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={funnelData.filter((d) => d.value > 0)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {funnelData.filter((d) => d.value > 0).map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-800 bg-[#111827] p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Contacts</span>
              <span className="text-white font-semibold">{contactsCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Active Deals</span>
              <span className="text-white font-semibold">{Object.values(stageCounts).reduce((a, b) => a + b, 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Pending Tasks</span>
              <span className="text-white font-semibold">{pendingTasks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Avg Deal Value</span>
              <span className="text-white font-semibold">${(avgDealSize / 1000).toFixed(1)}K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

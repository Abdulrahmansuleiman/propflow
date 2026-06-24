'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const stages = ['New', 'Contacted', 'Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost']

export default function DealPage() {
  const { id } = useParams()
  const router = useRouter()
  const [deal, setDeal] = useState<any>(null)
  const [notes, setNotes] = useState('')
  const [stage, setStage] = useState('')

  useEffect(() => {
    fetch(`/api/deals/${id}`).then((r) => r.json()).then((d) => {
      setDeal(d)
      setNotes(d.notes || '')
      setStage(d.stage)
    })
  }, [id])

  async function updateStage(newStage: string) {
    setStage(newStage)
    await fetch(`/api/deals/${id}`, { method: 'PATCH', body: JSON.stringify({ stage: newStage }) })
  }

  async function saveNotes() {
    await fetch(`/api/deals/${id}`, { method: 'PATCH', body: JSON.stringify({ notes }) })
  }

  async function handleDelete() {
    if (!confirm('Delete this deal?')) return
    await fetch(`/api/deals/${id}`, { method: 'DELETE' })
    router.push('/pipeline')
  }

  if (!deal) return <p className="text-gray-500">Loading...</p>
  if (deal.error) return <p className="text-red-400">Deal not found</p>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/pipeline" className="text-gray-400 hover:text-white">&larr; Pipeline</Link>
      </div>

      <div className="rounded-xl border border-gray-800 bg-[#111827] p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{deal.title}</h1>
            <p className="text-3xl font-bold text-blue-400 mt-2">${deal.value.toLocaleString()}</p>
          </div>
          <button onClick={handleDelete} className="rounded-lg border border-red-800 px-3 py-1.5 text-sm text-red-400 hover:bg-red-900/30">Delete</button>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-gray-400">Stage:</span>
          <select value={stage} onChange={(e) => updateStage(e.target.value)} className="text-sm w-auto">
            {stages.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {deal.contact && (
            <div className="rounded-lg bg-gray-800/50 p-3">
              <p className="text-xs text-gray-400">Contact</p>
              <Link href={`/contacts/${deal.contact.id}`} className="text-blue-400 hover:text-blue-300 font-medium">
                {deal.contact.name}
              </Link>
              {deal.contact.email && <p className="text-sm text-gray-400">{deal.contact.email}</p>}
            </div>
          )}
          {deal.property && (
            <div className="rounded-lg bg-gray-800/50 p-3">
              <p className="text-xs text-gray-400">Property</p>
              <Link href={`/properties/${deal.property.id}`} className="text-blue-400 hover:text-blue-300 font-medium">
                {deal.property.title}
              </Link>
              <p className="text-sm text-gray-400">{deal.property.address}</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <label className="block text-sm text-gray-400 mb-1">Notes</label>
          <div className="flex gap-2">
            <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className="flex-1" />
            <button onClick={saveNotes} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white self-end hover:bg-blue-700">Save</button>
          </div>
        </div>

        <p className="text-xs text-gray-600 mt-4">
          Created {new Date(deal.createdAt).toLocaleDateString()} · Days in stage: {Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / 86400000)}
        </p>
      </div>

      {deal.tasks && deal.tasks.length > 0 && (
        <section className="rounded-xl border border-gray-800 bg-[#111827] p-5">
          <h2 className="text-lg font-semibold text-white mb-3">Tasks</h2>
          <div className="space-y-2">
            {deal.tasks.map((t: any) => (
              <div key={t.id} className="flex items-center gap-3 text-sm">
                <span className={t.completed ? 'line-through text-gray-600' : 'text-gray-200'}>{t.title}</span>
                {t.dueDate && <span className="text-xs text-gray-500 ml-auto">{new Date(t.dueDate).toLocaleDateString()}</span>}
                <span className={`text-xs capitalize ${t.priority === 'high' ? 'text-red-400' : t.priority === 'medium' ? 'text-yellow-400' : 'text-gray-400'}`}>{t.priority}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const stages = ['New', 'Contacted', 'Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost']

export default function NewDealForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [contacts, setContacts] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [form, setForm] = useState({ title: '', value: '', stage: 'New', contactId: '', propertyId: '', notes: '' })

  useEffect(() => {
    fetch('/api/contacts').then((r) => r.json()).then(setContacts)
    fetch('/api/properties').then((r) => r.json()).then(setProperties)
    const contactId = searchParams.get('contactId')
    const propertyId = searchParams.get('propertyId')
    if (contactId) setForm((f) => ({ ...f, contactId }))
    if (propertyId) setForm((f) => ({ ...f, propertyId }))
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/deals', {
      method: 'POST',
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const deal = await res.json()
      router.push(`/deals/${deal.id}`)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/pipeline" className="text-gray-400 hover:text-white">&larr; Pipeline</Link>
        <h1 className="text-2xl font-bold text-white">New Deal</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-800 bg-[#111827] p-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Title *</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Value *</label>
            <input required type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Stage</label>
            <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} className="w-full">
              {stages.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Contact</label>
            <select value={form.contactId} onChange={(e) => setForm({ ...form, contactId: e.target.value })} className="w-full">
              <option value="">Select contact</option>
              {contacts.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Property</label>
            <select value={form.propertyId} onChange={(e) => setForm({ ...form, propertyId: e.target.value })} className="w-full">
              <option value="">No property</option>
              {properties.map((p: any) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Notes</label>
          <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full" />
        </div>
        <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors">
          Save Deal
        </button>
      </form>
    </div>
  )
}

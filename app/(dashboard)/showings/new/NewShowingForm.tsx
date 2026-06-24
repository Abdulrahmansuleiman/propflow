'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const statuses = ['scheduled', 'completed', 'cancelled', 'no-show']

export default function NewShowingForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [contacts, setContacts] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [form, setForm] = useState({ dateTime: '', contactId: '', propertyId: '', notes: '' })

  useEffect(() => {
    fetch('/api/contacts').then((r) => r.json()).then(setContacts)
    fetch('/api/properties').then((r) => r.json()).then(setProperties)
    const propId = searchParams.get('propertyId')
    if (propId) setForm((f) => ({ ...f, propertyId: propId }))
  }, [searchParams])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/showings', {
      method: 'POST',
      body: JSON.stringify(form),
    })
    if (res.ok) {
      router.push('/showings')
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/showings" className="text-gray-400 hover:text-white">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-white">New Showing</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-800 bg-[#111827] p-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Date & Time *</label>
          <input required type="datetime-local" value={form.dateTime} onChange={(e) => setForm({ ...form, dateTime: e.target.value })} className="w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Contact *</label>
            <select required value={form.contactId} onChange={(e) => setForm({ ...form, contactId: e.target.value })} className="w-full">
              <option value="">Select contact</option>
              {contacts.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Property *</label>
            <select required value={form.propertyId} onChange={(e) => setForm({ ...form, propertyId: e.target.value })} className="w-full">
              <option value="">Select property</option>
              {properties.map((p: any) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Notes</label>
          <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full" />
        </div>
        <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors">
          Schedule Showing
        </button>
      </form>
    </div>
  )
}

'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewContactPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: 'buyer', notes: '', tags: '' })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const contact = await res.json()
      router.push(`/contacts/${contact.id}`)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/contacts" className="text-gray-400 hover:text-white">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-white">New Contact</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-800 bg-[#111827] p-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full">
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="tenant">Tenant</option>
            <option value="landlord">Landlord</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Tags (comma-separated)</label>
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="e.g. hot-lead, downtown" className="w-full" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Notes</label>
          <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full" />
        </div>
        <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors">
          Save Contact
        </button>
      </form>
    </div>
  )
}

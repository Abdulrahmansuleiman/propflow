'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ContactDetail({ contact }: { contact: any }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(contact)
  const router = useRouter()

  async function handleSave() {
    await fetch(`/api/contacts/${contact.id}`, {
      method: 'PATCH',
      body: JSON.stringify(form),
    })
    setEditing(false)
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm('Delete this contact?')) return
    await fetch(`/api/contacts/${contact.id}`, { method: 'DELETE' })
    router.push('/contacts')
  }

  if (editing) {
    return (
      <div className="rounded-xl border border-gray-800 bg-[#111827] p-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full" />
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
          <label className="block text-sm text-gray-400 mb-1">Tags</label>
          <input value={form.tags || ''} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Notes</label>
          <textarea rows={3} value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full" />
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors">Save</button>
          <button onClick={() => setEditing(false)} className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors">Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-[#111827] p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{contact.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="rounded-full bg-gray-800 px-3 py-0.5 text-xs text-gray-300 capitalize">{contact.type}</span>
            {(contact.tags || '').split(',').filter(Boolean).map((tag: string) => (
              <span key={tag} className="rounded bg-blue-900/40 px-2 py-0.5 text-xs text-blue-300">{tag.trim()}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditing(true)} className="rounded-lg border border-gray-600 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors">Edit</button>
          <button onClick={handleDelete} className="rounded-lg border border-red-800 px-3 py-1.5 text-sm text-red-400 hover:bg-red-900/30 transition-colors">Delete</button>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm text-gray-400">
        {contact.email && <p>Email: {contact.email}</p>}
        {contact.phone && <p>Phone: {contact.phone}</p>}
        {contact.notes && <p className="mt-3 text-gray-300 whitespace-pre-wrap">{contact.notes}</p>}
      </div>
      <p className="text-xs text-gray-600 mt-4">Created {new Date(contact.createdAt).toLocaleDateString()}</p>
    </div>
  )
}

'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function NewPropertyForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [contacts, setContacts] = useState<any[]>([])

  const [form, setForm] = useState({
    title: '', address: '', price: '', bedrooms: '', bathrooms: '', sqft: '',
    type: 'house', status: 'active', description: '', ownerId: '',
  })

  useEffect(() => {
    fetch('/api/contacts').then((r) => r.json()).then(setContacts)
    const ownerId = searchParams.get('ownerId')
    if (ownerId) setForm((f) => ({ ...f, ownerId }))
  }, [searchParams])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/properties', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseFloat(form.bathrooms) : null,
        sqft: form.sqft ? parseInt(form.sqft) : null,
        ownerId: form.ownerId || null,
      }),
    })
    if (res.ok) {
      const property = await res.json()
      router.push(`/properties/${property.id}`)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/properties" className="text-gray-400 hover:text-white">&larr; Back</Link>
        <h1 className="text-2xl font-bold text-white">New Property</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-800 bg-[#111827] p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Title *</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full" placeholder="e.g. 123 Main St Condo" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Address *</label>
            <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Price *</label>
            <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full">
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="apartment">Apartment</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Bedrooms</label>
            <input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Bathrooms</label>
            <input type="number" step="0.5" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Sq Ft</label>
            <input type="number" value={form.sqft} onChange={(e) => setForm({ ...form, sqft: e.target.value })} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full">
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="off-market">Off Market</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Owner</label>
            <select value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })} className="w-full">
              <option value="">No owner</option>
              {contacts.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full" />
          </div>
        </div>
        <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors">
          Save Property
        </button>
      </form>
    </div>
  )
}

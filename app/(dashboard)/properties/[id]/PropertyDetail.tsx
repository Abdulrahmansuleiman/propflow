'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PropertyDetail({ property, onDelete }: { property: any; onDelete: () => void }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(property)

  async function handleSave() {
    await fetch(`/api/properties/${property.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseFloat(form.bathrooms) : null,
        sqft: form.sqft ? parseInt(form.sqft) : null,
      }),
    })
    setEditing(false)
    window.location.reload()
  }

  async function handleDelete() {
    if (!confirm('Delete this property?')) return
    await fetch(`/api/properties/${property.id}`, { method: 'DELETE' })
    onDelete()
  }

  if (editing) {
    return (
      <div className="rounded-xl border border-gray-800 bg-[#111827] p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Address</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Price</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full" />
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
          <div>
            <label className="block text-sm text-gray-400 mb-1">Bedrooms</label>
            <input type="number" value={form.bedrooms || ''} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Bathrooms</label>
            <input type="number" step="0.5" value={form.bathrooms || ''} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Sq Ft</label>
            <input type="number" value={form.sqft || ''} onChange={(e) => setForm({ ...form, sqft: e.target.value })} className="w-full" />
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
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Save</button>
          <button onClick={() => setEditing(false)} className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-[#111827] p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{property.title}</h1>
          <p className="text-gray-400 mt-1">{property.address}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditing(true)} className="rounded-lg border border-gray-600 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800">Edit</button>
          <button onClick={handleDelete} className="rounded-lg border border-red-800 px-3 py-1.5 text-sm text-red-400 hover:bg-red-900/30">Delete</button>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <span className={`rounded-full px-3 py-0.5 text-xs capitalize ${
          property.status === 'active' ? 'bg-green-900/40 text-green-300' :
          property.status === 'pending' ? 'bg-yellow-900/40 text-yellow-300' :
          property.status === 'sold' ? 'bg-blue-900/40 text-blue-300' :
          'bg-gray-800 text-gray-400'
        }`}>{property.status}</span>
        <span className="rounded-full bg-gray-800 px-3 py-0.5 text-xs text-gray-300 capitalize">{property.type}</span>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="text-center p-3 rounded-lg bg-gray-800/50">
          <p className="text-2xl font-bold text-white">${property.price.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Price</p>
        </div>
        {property.bedrooms && <div className="text-center p-3 rounded-lg bg-gray-800/50">
          <p className="text-2xl font-bold text-white">{property.bedrooms}</p>
          <p className="text-xs text-gray-400 mt-1">Beds</p>
        </div>}
        {property.bathrooms && <div className="text-center p-3 rounded-lg bg-gray-800/50">
          <p className="text-2xl font-bold text-white">{property.bathrooms}</p>
          <p className="text-xs text-gray-400 mt-1">Baths</p>
        </div>}
        {property.sqft && <div className="text-center p-3 rounded-lg bg-gray-800/50">
          <p className="text-2xl font-bold text-white">{property.sqft.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Sq Ft</p>
        </div>}
      </div>

      {property.owner && (
        <p className="mt-4 text-sm text-gray-400">
          Owner: <Link href={`/contacts/${property.owner.id}`} className="text-blue-400 hover:text-blue-300">{property.owner.name}</Link>
        </p>
      )}

      {property.description && (
        <p className="mt-3 text-sm text-gray-300 whitespace-pre-wrap">{property.description}</p>
      )}
    </div>
  )
}

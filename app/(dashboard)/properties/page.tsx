'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const statuses = ['', 'active', 'pending', 'sold', 'off-market']

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    fetch(`/api/properties?${params}`)
      .then((r) => r.json())
      .then(setProperties)
  }, [search, status])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Properties</h1>
        <Link
          href="/properties/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + New Property
        </Link>
      </div>

      <div className="flex gap-3">
        <input
          placeholder="Search properties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-40">
          <option value="">All Status</option>
          {statuses.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.length === 0 ? (
          <p className="text-gray-500 text-sm col-span-full">No properties found</p>
        ) : (
          properties.map((p) => (
            <Link key={p.id} href={`/properties/${p.id}`} className="rounded-xl border border-gray-800 bg-[#111827] p-5 hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-white">{p.title}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-xs capitalize ${
                  p.status === 'active' ? 'bg-green-900/40 text-green-300' :
                  p.status === 'pending' ? 'bg-yellow-900/40 text-yellow-300' :
                  p.status === 'sold' ? 'bg-blue-900/40 text-blue-300' :
                  'bg-gray-800 text-gray-400'
                }`}>{p.status}</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">{p.address}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                <span>${p.price.toLocaleString()}</span>
                {p.bedrooms && <span>{p.bedrooms} bed</span>}
                {p.bathrooms && <span>{p.bathrooms} bath</span>}
                {p.sqft && <span>{p.sqft.toLocaleString()} sqft</span>}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

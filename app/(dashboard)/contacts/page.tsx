'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const types = ['', 'buyer', 'seller', 'tenant', 'landlord']

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (type) params.set('type', type)
    fetch(`/api/contacts?${params}`)
      .then((r) => r.json())
      .then(setContacts)
  }, [search, type])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Contacts</h1>
        <Link
          href="/contacts/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + New Contact
        </Link>
      </div>

      <div className="flex gap-3">
        <input
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-40">
          <option value="">All Types</option>
          {types.filter(Boolean).map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-gray-800 bg-[#111827] overflow-hidden">
        {contacts.length === 0 ? (
          <p className="p-6 text-gray-500 text-sm">No contacts found</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Tags</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="p-4">
                    <Link href={`/contacts/${c.id}`} className="text-white hover:text-blue-400 font-medium">
                      {c.name}
                    </Link>
                  </td>
                  <td className="p-4 text-gray-400">{c.email || '—'}</td>
                  <td className="p-4 text-gray-400">{c.phone || '—'}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs text-gray-300 capitalize">
                      {c.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {(c.tags || '').split(',').filter(Boolean).map((tag: string) => (
                        <span key={tag} className="rounded bg-blue-900/40 px-2 py-0.5 text-xs text-blue-300">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

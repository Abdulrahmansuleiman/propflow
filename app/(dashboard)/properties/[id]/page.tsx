'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import PropertyDetail from './PropertyDetail'

export default function PropertyPage() {
  const { id } = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/properties/${id}`).then((r) => r.json()).then(setProperty)
  }, [id])

  if (!property) return <p className="text-gray-500">Loading...</p>
  if (property.error) return <p className="text-red-400">Property not found</p>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/properties" className="text-gray-400 hover:text-white">&larr; Properties</Link>
      </div>

      <PropertyDetail property={property} onDelete={() => router.push('/properties')} />

      <div className="flex gap-3">
        <Link
          href={`/deals/new?propertyId=${property.id}`}
          className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
        >
          + Create Deal
        </Link>
        <Link
          href={`/showings?propertyId=${property.id}`}
          className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
        >
          Schedule Showing
        </Link>
      </div>

      {property.deals?.length > 0 && (
        <section className="rounded-xl border border-gray-800 bg-[#111827] p-5">
          <h2 className="text-lg font-semibold text-white mb-3">Deals</h2>
          <div className="space-y-2">
            {property.deals.map((d: any) => (
              <Link key={d.id} href={`/deals/${d.id}`} className="block rounded-lg border border-gray-700 p-3 hover:bg-gray-800 transition-colors">
                <div className="flex justify-between">
                  <span className="text-white font-medium">{d.title}</span>
                  <span className="text-sm text-gray-400 capitalize">{d.stage}</span>
                </div>
                <span className="text-sm text-gray-500">${d.value.toLocaleString()} — {d.contact?.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {property.showings?.length > 0 && (
        <section className="rounded-xl border border-gray-800 bg-[#111827] p-5">
          <h2 className="text-lg font-semibold text-white mb-3">Showings</h2>
          <div className="space-y-2">
            {property.showings.map((s: any) => (
              <div key={s.id} className="flex items-center gap-3 text-sm">
                <span className="text-gray-200">{new Date(s.dateTime).toLocaleDateString()} at {new Date(s.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-gray-400">— {s.contact?.name}</span>
                <span className={`text-xs capitalize ${s.status === 'completed' ? 'text-green-400' : s.status === 'cancelled' ? 'text-red-400' : 'text-yellow-400'}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

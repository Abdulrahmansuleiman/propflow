'use client'

import { useRouter } from 'next/navigation'

export default function ContactActions({ contactId }: { contactId: string }) {
  const router = useRouter()

  return (
    <div className="flex gap-3">
      <button
        onClick={() => router.push(`/properties/new?ownerId=${contactId}`)}
        className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
      >
        + Add Property
      </button>
      <button
        onClick={() => router.push(`/deals/new?contactId=${contactId}`)}
        className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
      >
        + New Deal
      </button>
    </div>
  )
}

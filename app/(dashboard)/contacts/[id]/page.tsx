import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ContactDetail from './ContactDetail'
import ContactActions from './ContactActions'

export default async function ContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      deals: { orderBy: { updatedAt: 'desc' } },
      properties: { orderBy: { updatedAt: 'desc' } },
      tasks: { orderBy: { createdAt: 'desc' }, take: 10 },
      showings: { orderBy: { dateTime: 'desc' }, take: 10 },
    },
  })

  if (!contact) notFound()

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/contacts" className="text-gray-400 hover:text-white">&larr; Contacts</Link>
      </div>

      <ContactDetail contact={contact} />
      <ContactActions contactId={contact.id} />

      {contact.properties.length > 0 && (
        <section className="rounded-xl border border-gray-800 bg-[#111827] p-5">
          <h2 className="text-lg font-semibold text-white mb-3">Properties ({contact.properties.length})</h2>
          <div className="space-y-2">
            {contact.properties.map((p) => (
              <Link key={p.id} href={`/properties/${p.id}`} className="block rounded-lg border border-gray-700 p-3 hover:bg-gray-800 transition-colors">
                <div className="flex justify-between">
                  <span className="text-white font-medium">{p.title}</span>
                  <span className="text-gray-400 text-sm">${p.price.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{p.address}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {contact.deals.length > 0 && (
        <section className="rounded-xl border border-gray-800 bg-[#111827] p-5">
          <h2 className="text-lg font-semibold text-white mb-3">Deals ({contact.deals.length})</h2>
          <div className="space-y-2">
            {contact.deals.map((d) => (
              <Link key={d.id} href={`/deals/${d.id}`} className="block rounded-lg border border-gray-700 p-3 hover:bg-gray-800 transition-colors">
                <div className="flex justify-between">
                  <span className="text-white font-medium">{d.title}</span>
                  <span className="text-sm text-gray-400 capitalize">{d.stage}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">${d.value.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {contact.tasks.length > 0 && (
        <section className="rounded-xl border border-gray-800 bg-[#111827] p-5">
          <h2 className="text-lg font-semibold text-white mb-3">Recent Tasks</h2>
          <div className="space-y-2">
            {contact.tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-3 text-sm">
                <span className={t.completed ? 'line-through text-gray-600' : 'text-gray-200'}>{t.title}</span>
                {t.dueDate && <span className="text-xs text-gray-500 ml-auto">{new Date(t.dueDate).toLocaleDateString()}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {contact.showings.length > 0 && (
        <section className="rounded-xl border border-gray-800 bg-[#111827] p-5">
          <h2 className="text-lg font-semibold text-white mb-3">Recent Showings</h2>
          <div className="space-y-2">
            {contact.showings.map((s) => (
              <div key={s.id} className="flex items-center gap-3 text-sm">
                <span className="text-gray-200">{new Date(s.dateTime).toLocaleDateString()} {new Date(s.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-xs text-gray-500 capitalize">{s.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

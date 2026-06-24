'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Link from 'next/link'

const stages = ['New', 'Contacted', 'Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost']

export default function PipelinePage() {
  const [deals, setDeals] = useState<any[]>([])
  const [activeDeal, setActiveDeal] = useState<any>(null)

  useEffect(() => {
    fetch('/api/deals').then((r) => r.json()).then(setDeals)
  }, [])

  const stageDeals = useMemo(() => {
    const map: Record<string, any[]> = {}
    for (const s of stages) map[s] = []
    for (const d of deals) {
      if (map[d.stage]) map[d.stage].push(d)
    }
    return map
  }, [deals])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  async function handleDragEnd(event: DragEndEvent) {
    setActiveDeal(null)
    const { active, over } = event
    if (!over) return

    const dealId = active.id as string
    const targetStage = over.data?.current?.sortable?.containerId || over.id as string

    if (!stages.includes(targetStage)) return

    const deal = deals.find((d) => d.id === dealId)
    if (!deal || deal.stage === targetStage) return

    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: targetStage } : d))
    )

    await fetch(`/api/deals/${dealId}`, {
      method: 'PATCH',
      body: JSON.stringify({ stage: targetStage }),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Pipeline</h1>
        <Link
          href="/deals/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + New Deal
        </Link>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(event: DragStartEvent) => {
          const deal = deals.find((d) => d.id === event.active.id)
          setActiveDeal(deal || null)
        }}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: '60vh' }}>
          {stages.map((stage) => (
            <PipeColumn key={stage} stage={stage} deals={stageDeals[stage] || []} />
          ))}
        </div>

        <DragOverlay>
          {activeDeal ? (
            <DealCard deal={activeDeal} isDragOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

function PipeColumn({ stage, deals }: { stage: string; deals: any[] }) {
  const stageColors: Record<string, string> = {
    New: 'border-gray-600',
    Contacted: 'border-blue-600',
    Discovery: 'border-yellow-600',
    Proposal: 'border-purple-600',
    Negotiation: 'border-orange-600',
    Won: 'border-green-600',
    Lost: 'border-red-600',
  }

  return (
    <div className={`flex-shrink-0 w-72 rounded-xl border-t-4 ${stageColors[stage] || 'border-gray-600'} bg-[#111827]`}>
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">{stage}</h3>
          <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">{deals.length}</span>
        </div>
      </div>
      <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
        <div className="p-2 space-y-2 min-h-[200px]">
          {deals.map((deal) => (
            <SortableDealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

function SortableDealCard({ deal }: { deal: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: deal.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DealCard deal={deal} />
    </div>
  )
}

function DealCard({ deal, isDragOverlay }: { deal: any; isDragOverlay?: boolean }) {
  const daysInStage = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / 86400000)

  return (
    <Link
      href={`/deals/${deal.id}`}
      className={`block rounded-lg border border-gray-700 bg-[#1a2332] p-3 hover:bg-gray-700/50 transition-colors ${isDragOverlay ? 'shadow-xl shadow-black/50' : ''}`}
      onClick={(e) => { if (isDragOverlay) e.preventDefault() }}
    >
      <p className="font-medium text-white text-sm truncate">{deal.title}</p>
      <p className="text-blue-400 font-semibold text-sm mt-1">${deal.value.toLocaleString()}</p>
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>{deal.contact?.name || 'No contact'}</span>
        <span>{daysInStage}d</span>
      </div>
    </Link>
  )
}

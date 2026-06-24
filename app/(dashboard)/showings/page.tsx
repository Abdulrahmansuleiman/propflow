'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  eachDayOfInterval, format, addWeeks, subWeeks, addMonths, subMonths,
  isSameMonth, isSameDay, isToday, getDay,
} from 'date-fns'

export default function ShowingsPage() {
  const [showings, setShowings] = useState<any[]>([])
  const [view, setView] = useState<'week' | 'month'>('week')
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    fetch('/api/showings').then((r) => r.json()).then(setShowings)
  }, [])

  const days = view === 'week'
    ? eachDayOfInterval({ start: startOfWeek(currentDate), end: endOfWeek(currentDate) })
    : eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) })

  function prev() {
    setCurrentDate(view === 'week' ? subWeeks(currentDate, 1) : subMonths(currentDate, 1))
  }

  function next() {
    setCurrentDate(view === 'week' ? addWeeks(currentDate, 1) : addMonths(currentDate, 1))
  }

  function getShowingsForDay(day: Date) {
    return showings.filter((s) => isSameDay(new Date(s.dateTime), day))
  }

  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Showings</h1>
        <Link
          href="/showings/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + New Showing
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={prev} className="rounded-lg border border-gray-600 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800">&larr;</button>
          <h2 className="text-lg font-semibold text-white">
            {view === 'week'
              ? `${format(days[0], 'MMM d')} - ${format(days[days.length - 1], 'MMM d, yyyy')}`
              : format(currentDate, 'MMMM yyyy')}
          </h2>
          <button onClick={next} className="rounded-lg border border-gray-600 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800">&rarr;</button>
        </div>
        <div className="flex rounded-lg border border-gray-700 overflow-hidden">
          <button onClick={() => setView('week')} className={`px-3 py-1.5 text-sm ${view === 'week' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>Week</button>
          <button onClick={() => setView('month')} className={`px-3 py-1.5 text-sm ${view === 'month' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>Month</button>
        </div>
      </div>

      {view === 'week' ? (
        <div className="rounded-xl border border-gray-800 bg-[#111827] overflow-hidden">
          <div className="grid grid-cols-8 border-b border-gray-800">
            <div className="p-2 text-xs text-gray-500 border-r border-gray-800"></div>
            {days.map((day) => (
              <div key={day.toISOString()} className={`p-2 text-center text-sm border-r border-gray-800 last:border-r-0 ${isToday(day) ? 'bg-blue-900/20' : ''}`}>
                <div className="text-xs text-gray-500">{format(day, 'EEE')}</div>
                <div className={`font-semibold ${isToday(day) ? 'text-blue-400' : 'text-white'}`}>{format(day, 'd')}</div>
              </div>
            ))}
          </div>
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-gray-800 last:border-b-0">
              <div className="p-2 text-xs text-gray-500 border-r border-gray-800">{format(new Date().setHours(hour, 0, 0, 0), 'h a')}</div>
              {days.map((day) => {
                const slotShowings = showings.filter((s) => {
                  const d = new Date(s.dateTime)
                  return isSameDay(d, day) && d.getHours() === hour
                })
                return (
                  <div key={day.toISOString()} className={`p-1 border-r border-gray-800 last:border-r-0 min-h-[60px] ${isToday(day) ? 'bg-blue-900/10' : ''}`}>
                    {slotShowings.map((s) => (
                      <div key={s.id} className={`rounded px-1.5 py-0.5 text-xs mb-0.5 ${s.status === 'completed' ? 'bg-green-900/40 text-green-300' : s.status === 'cancelled' ? 'bg-red-900/40 text-red-300' : 'bg-blue-900/40 text-blue-300'}`}>
                        <div className="font-medium truncate">{s.property?.title}</div>
                        <div className="truncate">{s.contact?.name}</div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-800 bg-[#111827] overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-800">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="p-2 text-center text-xs text-gray-500 border-r border-gray-800 last:border-r-0">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: getDay(days[0]) }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2 border-b border-r border-gray-800 bg-gray-900/30 min-h-[100px]" />
            ))}
            {days.map((day) => {
              const dayShowings = getShowingsForDay(day)
              return (
                <div key={day.toISOString()} className={`p-2 border-b border-r border-gray-800 last:border-r-0 min-h-[100px] ${isToday(day) ? 'bg-blue-900/10' : ''} ${!isSameMonth(day, currentDate) ? 'bg-gray-900/30' : ''}`}>
                  <div className={`text-sm font-semibold mb-1 ${isToday(day) ? 'text-blue-400' : 'text-white'}`}>{format(day, 'd')}</div>
                  {dayShowings.map((s) => (
                    <div key={s.id} className={`rounded px-1.5 py-0.5 text-xs mb-0.5 ${s.status === 'completed' ? 'bg-green-900/40 text-green-300' : s.status === 'cancelled' ? 'bg-red-900/40 text-red-300' : 'bg-blue-900/40 text-blue-300'}`}>
                      <div className="truncate">{format(new Date(s.dateTime), 'h:mm a')} {s.property?.title}</div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

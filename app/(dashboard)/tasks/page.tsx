'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [showNew, setShowNew] = useState(false)
  const [newForm, setNewForm] = useState({ title: '', dueDate: '', priority: 'medium', contactId: '', dealId: '' })
  const [contacts, setContacts] = useState<any[]>([])
  const [deals, setDeals] = useState<any[]>([])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filter === 'pending') params.set('completed', 'false')
    if (filter === 'done') params.set('completed', 'true')
    fetch(`/api/tasks?${params}`).then((r) => r.json()).then(setTasks)
    fetch('/api/contacts').then((r) => r.json()).then(setContacts)
    fetch('/api/deals').then((r) => r.json()).then(setDeals)
  }, [filter])

  async function toggleComplete(task: any) {
    await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed: !task.completed }),
    })
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)))
  }

  async function handleNewTask(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/tasks', { method: 'POST', body: JSON.stringify(newForm) })
    if (res.ok) {
      setShowNew(false)
      setNewForm({ title: '', dueDate: '', priority: 'medium', contactId: '', dealId: '' })
      const params = new URLSearchParams()
      if (filter === 'pending') params.set('completed', 'false')
      if (filter === 'done') params.set('completed', 'true')
      fetch(`/api/tasks?${params}`).then((r) => r.json()).then(setTasks)
    }
  }

  const now = new Date()
  const overdue = tasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < now)
  const today = tasks.filter((t) => !t.completed && t.dueDate && isSameDay(new Date(t.dueDate), now))
  const upcoming = tasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) >= now && !isSameDay(new Date(t.dueDate), now))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Tasks</h1>
        <button onClick={() => setShowNew(!showNew)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          + New Task
        </button>
      </div>

      {showNew && (
        <form onSubmit={handleNewTask} className="rounded-xl border border-gray-800 bg-[#111827] p-5 space-y-3">
          <input required placeholder="Task title" value={newForm.title} onChange={(e) => setNewForm({ ...newForm, title: e.target.value })} className="w-full" />
          <div className="grid grid-cols-3 gap-3">
            <input type="date" value={newForm.dueDate} onChange={(e) => setNewForm({ ...newForm, dueDate: e.target.value })} className="w-full" />
            <select value={newForm.priority} onChange={(e) => setNewForm({ ...newForm, priority: e.target.value })} className="w-full">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select value={newForm.contactId} onChange={(e) => setNewForm({ ...newForm, contactId: e.target.value })} className="w-full">
              <option value="">No contact</option>
              {contacts.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3">
            <select value={newForm.dealId} onChange={(e) => setNewForm({ ...newForm, dealId: e.target.value })} className="flex-1">
              <option value="">No deal</option>
              {deals.map((d: any) => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Create</button>
          </div>
        </form>
      )}

      <div className="flex gap-2">
        {['all', 'pending', 'done'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-sm ${filter === f ? 'bg-blue-600 text-white' : 'border border-gray-700 text-gray-400 hover:bg-gray-800'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filter !== 'done' && overdue.length > 0 && (
        <TaskSection title={`Overdue (${overdue.length})`} tasks={overdue} toggleComplete={toggleComplete} urgent />
      )}

      {filter !== 'done' && today.length > 0 && (
        <TaskSection title={`Due Today (${today.length})`} tasks={today} toggleComplete={toggleComplete} />
      )}

      {filter !== 'done' && (
        <TaskSection title="Upcoming" tasks={upcoming} toggleComplete={toggleComplete} />
      )}

      {filter !== 'done' && tasks.filter((t) => !t.dueDate).length > 0 && (
        <TaskSection title="No Due Date" tasks={tasks.filter((t) => !t.dueDate && !t.completed)} toggleComplete={toggleComplete} />
      )}

      {filter === 'done' && (
        <TaskSection title="Completed" tasks={tasks} toggleComplete={toggleComplete} />
      )}

      {tasks.length === 0 && <p className="text-gray-500 text-sm">No tasks found</p>}
    </div>
  )
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function TaskSection({ title, tasks, toggleComplete, urgent }: { title: string; tasks: any[]; toggleComplete: (t: any) => void; urgent?: boolean }) {
  return (
    <section className="rounded-xl border border-gray-800 bg-[#111827] overflow-hidden">
      <h2 className={`px-5 py-3 font-semibold text-sm border-b border-gray-800 ${urgent ? 'text-red-400' : 'text-white'}`}>{title}</h2>
      <div className="divide-y divide-gray-800">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-800/30">
            <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task)} className="accent-blue-600" />
            <div className="flex-1 min-w-0">
              <span className={task.completed ? 'line-through text-gray-600' : 'text-gray-200'}>{task.title}</span>
              {task.contact && <Link href={`/contacts/${task.contact.id}`} className="text-xs text-gray-500 ml-2 hover:text-blue-400">{task.contact.name}</Link>}
              {task.deal && <Link href={`/deals/${task.deal.id}`} className="text-xs text-gray-500 ml-2 hover:text-blue-400">{task.deal.title}</Link>}
            </div>
            {task.dueDate && (
              <span className={`text-xs ${urgent && !task.completed ? 'text-red-400' : 'text-gray-500'}`}>
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            <span className={`text-xs capitalize ${task.priority === 'high' ? 'text-red-400' : task.priority === 'medium' ? 'text-yellow-400' : 'text-gray-500'}`}>{task.priority}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

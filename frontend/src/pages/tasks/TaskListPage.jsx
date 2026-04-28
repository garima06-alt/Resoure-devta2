import { useMemo, useState } from 'react'
import TaskCard from '../../components/cards/TaskCard.jsx'
import SearchBar from '../../components/inputs/SearchBar.jsx'
import FilterChips from '../../components/inputs/FilterChips.jsx'
import { mockTasks } from '../../data/mockData.js'

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Relief', value: 'Relief' },
  { label: 'Food', value: 'Food' },
  { label: 'Health', value: 'Health' },
  { label: 'Survey', value: 'Survey' },
]

export default function TaskListPage() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [accepted, setAccepted] = useState(() => new Set())

  const tasks = useMemo(() => {
    const query = q.trim().toLowerCase()
    return mockTasks
      .filter((t) => (cat === 'all' ? true : t.category === cat))
      .filter((t) => (query ? t.title.toLowerCase().includes(query) : true))
      .sort((a, b) => (a.urgency === b.urgency ? 0 : a.urgency === 'urgent' ? -1 : 1))
  }, [q, cat])

  function toggleAccept(id) {
    setAccepted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-semibold text-slate-500">Tasks</div>
        <div className="text-xl font-extrabold tracking-tight text-slate-900">
          Browse tasks
        </div>
      </div>
      <SearchBar value={q} onChange={setQ} placeholder="Search by title…" />
      <FilterChips options={categories} value={cat} onChange={setCat} />
      <div className="space-y-3">
        {tasks.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            to={`/app/tasks/${t.id}`}
            accepted={accepted.has(t.id)}
            onToggleAccept={toggleAccept}
          />
        ))}
      </div>
    </div>
  )
}


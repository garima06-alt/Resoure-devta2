import { useState } from 'react'
import { Plus, X } from 'lucide-react'

// TODO: connect to real API
const MOCK_TASKS = [
  { id: 'T-001', title: 'Water distribution support',  location: 'Ward 3 Community Center', priority: 'critical', volunteer: 'Sarah J.', status: 'in-progress' },
  { id: 'T-002', title: 'Food kit packing session',    location: 'Central Warehouse',         priority: 'moderate', volunteer: 'Raj P.',   status: 'pending'     },
  { id: 'T-003', title: 'Medical camp registration',   location: 'Clinic Zone A',              priority: 'high',     volunteer: 'Priya S.', status: 'in-progress' },
  { id: 'T-004', title: 'Field survey follow-up',      location: 'Ward 5',                     priority: 'moderate', volunteer: 'Amit K.', status: 'completed'   },
  { id: 'T-005', title: 'Flood evacuation assist',     location: 'Kurla West',                 priority: 'critical', volunteer: 'Neha D.', status: 'pending'     },
]

const MOCK_VOLUNTEERS = ['Sarah J.', 'Raj P.', 'Priya S.', 'Amit K.', 'Neha D.', 'Unassigned']
const STATUS_FILTERS = ['All', 'Pending', 'In Progress', 'Completed']

const PRIORITY_CHIP = {
  critical: { bg: '#fff1f2', color: '#f43f5e', border: '#fecdd3' },
  high:     { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  moderate: { bg: '#f0fdfa', color: '#0d9488', border: '#99f6e4' },
}
const STATUS_CHIP = {
  pending:      { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  'in-progress':{ bg: '#f5f3ff', color: '#6c3fc5', border: '#ddd6fe' },
  completed:    { bg: '#f0fdfa', color: '#0d9488', border: '#99f6e4' },
}

const CARD = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }

export default function AdminTasksPage() {
  const [filter, setFilter]       = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState({ title: '', description: '', location: '', priority: 'moderate', volunteer: 'Unassigned' })

  const filtered = MOCK_TASKS.filter((t) => {
    if (filter === 'All') return true
    const map = { Pending: 'pending', 'In Progress': 'in-progress', Completed: 'completed' }
    return t.status === map[filter]
  })

  return (
    <div className="min-h-screen page-enter px-4 pt-5 pb-8 space-y-4" style={{ background: '#f0f4f8' }}>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-ink">Task Management</h1>
          <p className="text-xs mt-0.5 text-muted">Manage & assign field tasks</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
          <Plus className="h-4 w-4" /> New Task
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {STATUS_FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold flex-shrink-0 transition-all"
            style={{
              background: filter === f ? '#d97706' : '#ffffff',
              color:      filter === f ? '#ffffff'  : '#64748b',
              border:     filter === f ? '1px solid #d97706' : '1px solid #e2e8f0',
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Task list — TODO: connect to real API */}
      <div className="space-y-3">
        {filtered.map((task) => {
          const ps = PRIORITY_CHIP[task.priority] || PRIORITY_CHIP.moderate
          const ss = STATUS_CHIP[task.status]   || STATUS_CHIP.pending
          return (
            <div key={task.id} style={CARD} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-muted">{task.id}</span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full"
                      style={{ background: ps.bg, color: ps.color, border: `1px solid ${ps.border}` }}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-ink">{task.title}</div>
                  <div className="text-xs mt-1 text-muted">📍 {task.location}</div>
                  <div className="text-xs mt-0.5 text-muted">👤 {task.volunteer}</div>
                </div>
                <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full whitespace-nowrap"
                  style={{ background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>
                  {task.status.replace('-', ' ')}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="w-full max-w-[430px] rounded-t-3xl p-6 space-y-4 bg-white"
            style={{ border: '1px solid #e2e8f0' }}>
            <div className="flex items-center justify-between">
              <div className="text-base font-extrabold text-ink">Create New Task</div>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-muted" /></button>
            </div>
            {[
              { label: 'Title',       key: 'title',       placeholder: 'Task title…' },
              { label: 'Description', key: 'description', placeholder: 'Details…', textarea: true },
              { label: 'Location',    key: 'location',    placeholder: 'Area / Zone / Ward…' },
            ].map(({ label, key, placeholder, textarea }) => (
              <div key={key}>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">{label}</label>
                {textarea ? (
                  <textarea rows={3} value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-ink resize-none"
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', outline: 'none' }} />
                ) : (
                  <input value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-ink"
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', outline: 'none' }} />
                )}
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Priority', key: 'priority', options: ['moderate', 'high', 'critical'] },
                { label: 'Assign To', key: 'volunteer', options: MOCK_VOLUNTEERS },
              ].map(({ label, key, options }) => (
                <div key={key}>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">{label}</label>
                  <select value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-ink"
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <button onClick={() => setShowModal(false)}
              className="w-full rounded-xl py-3 font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
              Create Task
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

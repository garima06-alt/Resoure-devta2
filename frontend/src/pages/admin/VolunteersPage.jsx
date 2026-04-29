import { useState } from 'react'
import { Search, X, Star, Briefcase } from 'lucide-react'

// TODO: connect to real API
const MOCK_VOLUNTEERS = [
  { id: 'v1', name: 'Sarah Johnson', initials: 'SJ', specializations: ['First Aid', 'Teaching'], activeMissions: 3, rating: 4.9, status: 'active',   joinedDate: 'Jan 2026', missions: ['Food Distribution — Ward 3', 'Community Health Camp', 'Teaching Session — Andheri'] },
  { id: 'v2', name: 'Raj Patel',     initials: 'RP', specializations: ['Logistics', 'Driving'],  activeMissions: 1, rating: 4.7, status: 'active',   joinedDate: 'Feb 2026', missions: ['Food Kit Packing'] },
  { id: 'v3', name: 'Priya Sharma',  initials: 'PS', specializations: ['Management', 'Planning'],activeMissions: 2, rating: 5.0, status: 'active',   joinedDate: 'Dec 2025', missions: ['Medical Camp Registration', 'Field Survey'] },
  { id: 'v4', name: 'Amit Kumar',    initials: 'AK', specializations: ['Medical', 'First Aid'],  activeMissions: 0, rating: 4.8, status: 'inactive', joinedDate: 'Jan 2026', missions: ['Medical Supply Delivery'] },
  { id: 'v5', name: 'Neha Desai',    initials: 'ND', specializations: ['Teaching', 'Child Care'],activeMissions: 1, rating: 4.9, status: 'active',   joinedDate: 'Mar 2026', missions: ['Flood Evacuation Assist'] },
  { id: 'v6', name: 'Vikram Iyer',   initials: 'VI', specializations: ['Engineering', 'Carpentry'],activeMissions: 2, rating: 4.6, status: 'active', joinedDate: 'Feb 2026', missions: ['Building Repair — Kurla', 'Shelter Setup'] },
]

const CARD = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }

export default function AdminVolunteersPage() {
  const [query, setQuery]     = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = MOCK_VOLUNTEERS.filter((v) =>
    v.name.toLowerCase().includes(query.toLowerCase()) ||
    v.specializations.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="min-h-screen page-enter px-4 pt-5 pb-8 space-y-4" style={{ background: '#f0f4f8' }}>

      <div>
        <h1 className="text-xl font-extrabold text-ink">Volunteer Directory</h1>
        <p className="text-xs mt-0.5 text-muted">{MOCK_VOLUNTEERS.length} registered volunteers</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 bg-white"
        style={{ border: '1px solid #e2e8f0' }}>
        <Search className="h-4 w-4 flex-shrink-0 text-muted" />
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or skill…"
          className="flex-1 bg-transparent text-sm text-ink placeholder-slate-400 outline-none" />
        {query && <button onClick={() => setQuery('')}><X className="h-4 w-4 text-muted" /></button>}
      </div>

      {/* Cards — TODO: connect to real API */}
      <div className="space-y-3">
        {filtered.map((v) => (
          <button key={v.id} onClick={() => setSelected(v)}
            className="w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-md bg-white"
            style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
            {/* Avatar */}
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-sm font-black flex-shrink-0 text-white"
              style={{ background: 'linear-gradient(135deg, #6c3fc5, #0d9488)' }}>
              {v.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-bold text-ink truncate">{v.name}</div>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    background: v.status === 'active' ? '#f0fdfa' : '#f8fafc',
                    color:      v.status === 'active' ? '#0d9488' : '#94a3b8',
                    border:    `1px solid ${v.status === 'active' ? '#99f6e4' : '#e2e8f0'}`,
                  }}>
                  {v.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {v.specializations.map((s) => (
                  <span key={s} className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: '#f5f3ff', color: '#6c3fc5', border: '1px solid #ddd6fe' }}>
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[10px] text-muted flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> {v.activeMissions} active
                </span>
                <span className="text-[10px] flex items-center gap-1" style={{ color: '#b45309' }}>
                  <Star className="h-3 w-3 fill-current" /> {v.rating}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null) }}>
          <div className="w-full max-w-[430px] rounded-t-3xl p-6 space-y-4 bg-white"
            style={{ border: '1px solid #e2e8f0' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-black text-white"
                  style={{ background: 'linear-gradient(135deg, #6c3fc5, #0d9488)' }}>
                  {selected.initials}
                </div>
                <div>
                  <div className="text-base font-extrabold text-ink">{selected.name}</div>
                  <div className="text-xs text-muted">Member since {selected.joinedDate}</div>
                </div>
              </div>
              <button onClick={() => setSelected(null)}><X className="h-5 w-5 text-muted" /></button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Rating',  value: selected.rating },
                { label: 'Active',  value: selected.activeMissions },
                { label: 'Status',  value: selected.status },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: '#f8fafc' }}>
                  <div className="text-base font-extrabold text-ink">{s.value}</div>
                  <div className="text-[10px] mt-0.5 text-muted">{s.label}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Specializations</div>
              <div className="flex flex-wrap gap-2">
                {selected.specializations.map((s) => (
                  <span key={s} className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: '#f5f3ff', color: '#6c3fc5', border: '1px solid #ddd6fe' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Mission History</div>
              <div className="space-y-1.5">
                {selected.missions.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-ink">
                    <span className="text-[10px]" style={{ color: '#0d9488' }}>✓</span> {m}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

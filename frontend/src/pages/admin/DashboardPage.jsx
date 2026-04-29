import { useState, useEffect } from 'react'
import { Users, ClipboardList, Package, AlertTriangle, Send, FileBarChart, UserPlus } from 'lucide-react'
import { seedReports } from '../../utils/seedReports'

const MOCK_KPI = [
  { label: 'Total Volunteers', value: '312', delta: '+9%',  bg: '#f5f3ff', color: '#6c3fc5', border: '#ddd6fe' },
  { label: 'Active Tasks',     value: '47',  delta: '+4',   bg: '#f0fdfa', color: '#0d9488', border: '#99f6e4' },
  { label: 'Pending Donations',value: '23',  delta: '+7',   bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  { label: 'Critical Zones',   value: '6',   delta: '+2',   bg: '#fff1f2', color: '#f43f5e', border: '#fecdd3' },
]

const MOCK_ACTIVITY = [
  { id: 'a1', icon: '🚀', text: 'Volunteer "Sarah J." deployed to Dharavi Zone B',         time: '5 min ago'  },
  { id: 'a2', icon: '✅', text: 'Task #44 marked Completed — Food Distribution',           time: '23 min ago' },
  { id: 'a3', icon: '🔔', text: 'Alert sent to 12 volunteers for Kurla flood response',    time: '1h ago'     },
  { id: 'a4', icon: '📦', text: 'Donation batch #D-092 allocated to Bandra Clinic',       time: '2h ago'     },
  { id: 'a5', icon: '👤', text: 'New volunteer "Amit K." profile verified',               time: '3h ago'     },
]

const CRITICAL_ZONES = [
  { id: 'z1', name: 'Dharavi — Zone B',        severity: 'critical', volunteers: 8 },
  { id: 'z2', name: 'Kurla West',               severity: 'critical', volunteers: 3 },
  { id: 'z3', name: 'Andheri East — Ward 12',  severity: 'high',     volunteers: 5 },
]

const QUICK_ACTIONS = [
  { label: 'Deploy Volunteer', icon: UserPlus,     color: '#6c3fc5', bg: '#f5f3ff', border: '#ddd6fe' },
  { label: 'Create Task',      icon: ClipboardList, color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
  { label: 'Send Alert',       icon: Send,          color: '#f43f5e', bg: '#fff1f2', border: '#fecdd3' },
  { label: 'View Reports',     icon: FileBarChart,  color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
]

const CARD = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }

export default function AdminDashboard() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])

  return (
    <div className="min-h-screen page-enter px-4 pt-5 pb-8 space-y-4" style={{ background: '#f0f4f8' }}>

      {/* Header card — amber gradient */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}
      >
        <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-white/15 blur-xl pointer-events-none" />
        <div className="text-xs font-semibold text-white/75">
          {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <div className="text-xl font-extrabold mt-0.5">Command Center</div>
        <div className="text-2xl font-mono font-black mt-1 text-white/90">
          {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        {import.meta.env.DEV && (
          <button
            onClick={seedReports}
            className="mt-3 text-xs underline opacity-60 hover:opacity-100 text-white"
          >
            🌱 Seed DB (dev only)
          </button>
        )}
      </div>

      {/* KPI grid — TODO: connect to real API */}
      <div className="grid grid-cols-2 gap-3">
        {MOCK_KPI.map((k) => (
          <div key={k.label} className="rounded-2xl p-4"
            style={{ background: k.bg, border: `1px solid ${k.border}`, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
            <div className="text-xs font-semibold text-muted">{k.label}</div>
            <div className="text-2xl font-extrabold mt-1" style={{ color: '#1e293b' }}>{k.value}</div>
            <div className="text-xs font-bold mt-0.5" style={{ color: k.color }}>{k.delta} this week</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={CARD} className="p-4">
        <div className="text-sm font-bold text-ink mb-3">Quick Actions</div>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((qa) => {
            const Icon = qa.icon
            return (
              <button key={qa.label}
                className="flex items-center gap-3 rounded-xl p-3 text-left transition-all hover:shadow-md"
                style={{ background: qa.bg, border: `1px solid ${qa.border}` }}>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: qa.color + '22' }}>
                  <Icon className="h-4 w-4" style={{ color: qa.color }} />
                </div>
                <span className="text-xs font-bold text-ink">{qa.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Recent Activity — TODO: connect to real API */}
      <div style={CARD} className="p-4">
        <div className="text-sm font-bold text-ink mb-3">Recent Activity</div>
        <div className="space-y-3">
          {MOCK_ACTIVITY.map((a) => (
            <div key={a.id} className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">{a.icon}</span>
              <div>
                <div className="text-xs text-ink leading-snug">{a.text}</div>
                <div className="text-[10px] mt-0.5 text-muted">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Zones — TODO: connect to real API */}
      <div style={CARD} className="p-4">
        <div className="text-sm font-bold text-ink mb-3 flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4" style={{ color: '#f43f5e' }} />
          Urgency Heatmap Summary
        </div>
        <div className="space-y-2">
          {CRITICAL_ZONES.map((z) => {
            const isCrit = z.severity === 'critical'
            return (
              <div key={z.id} className="flex items-center justify-between rounded-xl p-3"
                style={{
                  background: isCrit ? '#fff1f2' : '#fffbeb',
                  border: `1px solid ${isCrit ? '#fecdd3' : '#fde68a'}`,
                }}>
                <div>
                  <div className="text-sm font-bold text-ink">{z.name}</div>
                  <div className="text-[10px] mt-0.5 text-muted">{z.volunteers} volunteers assigned</div>
                </div>
                <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full"
                  style={{
                    background: isCrit ? '#fee2e2' : '#fef3c7',
                    color: isCrit ? '#f43f5e' : '#b45309',
                    border: `1px solid ${isCrit ? '#fecdd3' : '#fde68a'}`,
                  }}>
                  {z.severity}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

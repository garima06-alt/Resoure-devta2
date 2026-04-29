import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, Target, Award, Lock } from 'lucide-react'

const VOLUNTEER_STATS = {
  tasksAssigned: 31,
  tasksCompleted: 24,
  completionRate: 77,
  streakDays: 8,
  weeklyData: [
    { day: 'Mon', tasks: 2 },
    { day: 'Tue', tasks: 4 },
    { day: 'Wed', tasks: 1 },
    { day: 'Thu', tasks: 3 },
    { day: 'Fri', tasks: 5 },
    { day: 'Sat', tasks: 2 },
    { day: 'Sun', tasks: 3 },
  ],
  recentMissions: [
    { id: 'm1', title: 'Food Distribution — Ward 3',   location: 'Mumbai Central', date: 'Apr 28, 2026', status: 'Completed' },
    { id: 'm2', title: 'Teaching Session — Andheri',   location: 'Andheri West',   date: 'Apr 25, 2026', status: 'Completed' },
    { id: 'm3', title: 'Medical Supply Delivery',       location: 'Bandra Clinic',  date: 'Apr 22, 2026', status: 'Completed' },
    { id: 'm4', title: 'Community Health Camp',          location: 'Dharavi',        date: 'Apr 18, 2026', status: 'Completed' },
    { id: 'm5', title: 'Field Survey Follow-up',        location: 'Ward 5',         date: 'Apr 15, 2026', status: 'Completed' },
  ],
}

const BADGES = [
  { id: 'b1', emoji: '🚀', name: 'First Responder',   desc: 'Complete your first task',   unlocked: true,  date: 'Jan 15, 2026' },
  { id: 'b2', emoji: '⭐', name: 'Consistent Helper', desc: 'Complete 5 tasks',            unlocked: true,  date: 'Feb 2, 2026'  },
  { id: 'b3', emoji: '⚡', name: 'Speed Demon',        desc: 'Finish a task in under 2h',  unlocked: true,  date: 'Feb 18, 2026' },
  { id: 'b4', emoji: '🤝', name: 'Team Player',        desc: 'Collaborate on 3+ tasks',   unlocked: true,  date: 'Mar 5, 2026'  },
  { id: 'b5', emoji: '🎁', name: 'Generous Donor',     desc: 'Make a donation',            unlocked: true,  date: 'Mar 20, 2026' },
  { id: 'b6', emoji: '🏆', name: 'Veteran',            desc: 'Complete 10+ missions',      unlocked: true,  date: 'Apr 1, 2026'  },
  { id: 'b7', emoji: '🌟', name: 'Top Volunteer',      desc: 'Reach top 10 rating',       unlocked: false },
  { id: 'b8', emoji: '🔥', name: 'On Fire',            desc: '14-day activity streak',    unlocked: false },
]

function AnimatedBar({ value, max = 100, color = '#6c3fc5', height = 8 }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth((value / max) * 100), 100)
    return () => clearTimeout(t)
  }, [value, max])
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height, background: '#e2e8f0' }}>
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%`, background: color }}
      />
    </div>
  )
}

function WeeklyBarChart({ data }) {
  const maxVal = Math.max(...data.map((d) => d.tasks))
  const chartH = 80
  return (
    <div className="flex items-end justify-between gap-2" style={{ height: chartH + 28 }}>
      {data.map((d, i) => {
        const barH = maxVal > 0 ? Math.max(8, (d.tasks / maxVal) * chartH) : 8
        const isToday = i === (new Date().getDay() + 6) % 7   // Mon=0 offset
        return (
          <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
            <div className="text-[9px] font-bold text-muted">{d.tasks}</div>
            <div
              className="w-full rounded-lg transition-all duration-700"
              style={{
                height: barH,
                background: isToday
                  ? 'linear-gradient(180deg, #14b8a6, #0d9488)'
                  : 'linear-gradient(180deg, #8b5cf6, #6c3fc5)',
                transitionDelay: `${i * 60}ms`,
              }}
            />
            <div className="text-[9px] font-semibold text-muted">{d.day}</div>
          </div>
        )
      })}
    </div>
  )
}

const CARD = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }

export default function VolunteerAnalyticsPage() {
  const s = VOLUNTEER_STATS
  return (
    <div className="min-h-screen page-enter" style={{ background: '#f0f4f8' }}>

      {/* Header — purple gradient */}
      <div
        className="px-4 pt-8 pb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #6c3fc5, #8b5cf6)' }}
      >
        <div className="absolute -top-8 -right-8 h-36 w-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <h1 className="text-2xl font-extrabold text-white tracking-tight">My Impact</h1>
        <p className="text-sm mt-1 text-white/75">Your contribution at a glance</p>

        {/* Streak badge */}
        <div className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-white/20">
          <span className="text-lg streak-flame">🔥</span>
          <span className="text-sm font-bold text-white">{s.streakDays}-day streak</span>
          <span className="text-xs text-white/70">Keep going!</span>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Assigned',  value: s.tasksAssigned,   icon: Target,       bg: '#f5f3ff', color: '#6c3fc5', border: '#ddd6fe' },
            { label: 'Completed', value: s.tasksCompleted,  icon: CheckCircle2, bg: '#f0fdfa', color: '#0d9488', border: '#99f6e4' },
            { label: 'Rate',      value: `${s.completionRate}%`, icon: Clock,   bg: '#fff1f2', color: '#f43f5e', border: '#fecdd3' },
          ].map((st) => {
            const Icon = st.icon
            return (
              <div key={st.label} className="rounded-2xl p-3.5 flex flex-col items-center text-center"
                style={{ background: st.bg, border: `1px solid ${st.border}`, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <Icon className="h-5 w-5 mb-1.5" style={{ color: st.color }} />
                <div className="text-xl font-extrabold" style={{ color: '#1e293b' }}>{st.value}</div>
                <div className="text-[10px] font-semibold mt-0.5 text-muted">{st.label}</div>
              </div>
            )
          })}
        </div>

        {/* Completion rate */}
        <div style={CARD} className="p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-ink">Completion Rate</span>
            <span className="text-sm font-black" style={{ color: '#6c3fc5' }}>{s.completionRate}%</span>
          </div>
          <AnimatedBar value={s.completionRate} color="#6c3fc5" height={10} />
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-muted">0%</span>
            <span className="text-[10px] text-muted">100%</span>
          </div>
        </div>

        {/* Weekly chart */}
        <div style={CARD} className="p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-ink">Weekly Activity</span>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full"
              style={{ background: '#f5f3ff', color: '#6c3fc5' }}>Last 7 Days</span>
          </div>
          <WeeklyBarChart data={s.weeklyData} />
        </div>

        {/* Badges */}
        <div style={CARD} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-ink">Achievements & Badges</span>
            <span className="text-[10px] text-muted">{BADGES.filter((b) => b.unlocked).length}/{BADGES.length} Unlocked</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {BADGES.map((badge) => (
              <div
                key={badge.id}
                className="rounded-xl p-3 flex items-center gap-3"
                style={{
                  background: badge.unlocked ? '#f5f3ff' : '#f8fafc',
                  border: badge.unlocked ? '1px solid #ddd6fe' : '1px solid #e2e8f0',
                  opacity: badge.unlocked ? 1 : 0.5,
                  filter: badge.unlocked ? 'none' : 'grayscale(1)',
                }}
              >
                <div className="text-2xl leading-none flex-shrink-0">
                  {badge.unlocked ? badge.emoji : <Lock size={18} className="text-muted" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-ink">{badge.name}</div>
                  <div className="text-[10px] mt-0.5 text-muted">{badge.unlocked ? badge.date : badge.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Missions */}
        <div style={CARD} className="p-5">
          <span className="text-sm font-bold text-ink block mb-4">Recent Missions</span>
          <div className="space-y-3">
            {s.recentMissions.map((m) => (
              <div key={m.id} className="flex items-start justify-between rounded-xl p-3"
                style={{ background: '#f8fafc' }}>
                <div>
                  <div className="text-sm font-semibold text-ink">{m.title}</div>
                  <div className="text-[11px] mt-0.5 text-muted">📍 {m.location} · {m.date}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ml-2"
                  style={{ background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4' }}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

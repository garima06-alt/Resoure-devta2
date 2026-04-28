import { motion } from 'framer-motion'
import { useMemo } from 'react'

function Marker({ tone, x, y, label }) {
  const color =
    tone === 'urgent'
      ? 'bg-rose-600'
      : tone === 'completed'
        ? 'bg-emerald-600'
        : 'bg-brand-700'
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <div className={`h-3.5 w-3.5 rounded-full ${color} ring-4 ring-white shadow-md`} />
        <div className="pointer-events-none absolute left-1/2 top-6 w-max -translate-x-1/2 rounded-xl bg-white/90 px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          {label}
        </div>
      </div>
    </div>
  )
}

export default function FakeMap({ tasks, user }) {
  const points = useMemo(() => {
    // Deterministic “map positions” for UI; not real geo projection.
    return tasks.map((t, idx) => ({
      id: t.id,
      label: t.urgency === 'urgent' ? 'Urgent' : 'Task',
      tone: t.status === 'completed' ? 'completed' : t.urgency,
      x: 18 + ((idx * 19) % 64),
      y: 22 + ((idx * 23) % 58),
    }))
  }, [tasks])

  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-white">
      {/* soft “roads” */}
      <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="absolute -left-10 top-28 h-24 w-[140%] rotate-[-10deg] rounded-[999px] bg-brand-100/70" />
      <div className="absolute -left-20 top-72 h-16 w-[140%] rotate-[8deg] rounded-[999px] bg-sky-100/60" />
      <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-emerald-100/50 blur-2xl" />
      <div className="absolute right-10 bottom-10 h-40 w-40 rounded-full bg-rose-100/50 blur-2xl" />

      {/* markers */}
      {points.map((p) => (
        <Marker key={p.id} tone={p.tone} x={p.x} y={p.y} label={p.label} />
      ))}

      {/* user marker */}
      <div className="absolute left-1/2 top-1/2">
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ scale: [1, 1.7, 1], opacity: [0.18, 0.06, 0.18] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500"
          />
          <div className="h-3.5 w-3.5 rounded-full bg-sky-600 ring-4 ring-sky-100 shadow-md" />
          <div className="pointer-events-none absolute left-1/2 top-6 w-max -translate-x-1/2 rounded-xl bg-white/90 px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 backdrop-blur">
            You {user?.accuracyM ? `±${user.accuracyM}m` : ''}
          </div>
        </div>
      </div>
    </div>
  )
}


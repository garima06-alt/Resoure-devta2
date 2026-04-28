import { CheckCircle2, Cuboid, MapPin, TrendingUp } from 'lucide-react'
import { cn } from '../../utils/cn.js'

function iconFor(name) {
  if (name === 'cube') return Cuboid
  if (name === 'pin') return MapPin
  return CheckCircle2
}

function toneFor(tone) {
  if (tone === 'indigo') return 'bg-indigo-100 text-indigo-700'
  if (tone === 'rose') return 'bg-rose-100 text-rose-700'
  return 'bg-teal-100 text-teal-700'
}

export default function KpiPillCard({ icon, label, value, delta, tone }) {
  const Icon = iconFor(icon)
  return (
    <div className="rounded-2xl bg-white/80 p-4 shadow-card ring-1 ring-white/40 backdrop-blur">
      <div className="flex items-start justify-between">
        <div className={cn('grid h-10 w-10 place-items-center rounded-2xl', toneFor(tone))}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
      <div className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
        <TrendingUp className="h-4 w-4" />
        {delta}
      </div>
    </div>
  )
}


import { cn } from '../../utils/cn.js'

export default function StatsCard({ icon: Icon, label, value, tone, className }) {
  const tones = {
    urgent: 'from-rose-50 to-white',
    success: 'from-emerald-50 to-white',
    info: 'from-sky-50 to-white',
    neutral: 'from-slate-50 to-white',
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-gradient-to-b p-4 shadow-card',
        tones[tone ?? 'neutral'],
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            {value}
          </div>
        </div>
        {Icon ? (
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
            <Icon className="h-5 w-5 text-slate-700" />
          </div>
        ) : null}
      </div>
    </div>
  )
}


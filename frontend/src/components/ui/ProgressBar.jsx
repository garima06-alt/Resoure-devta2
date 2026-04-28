import { cn } from '../../utils/cn.js'

export default function ProgressBar({ value, max, colorClass }) {
  const pct = Math.max(0, Math.min(1, max ? value / max : 0))
  return (
    <div className="h-3 w-full rounded-full bg-slate-100">
      <div
        className={cn('h-3 rounded-full', colorClass)}
        style={{ width: `${Math.round(pct * 100)}%` }}
      />
    </div>
  )
}


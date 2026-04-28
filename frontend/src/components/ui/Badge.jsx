import { cn } from '../../utils/cn.js'

export default function Badge({ tone = 'neutral', className, children }) {
  const tones = {
    urgent: 'bg-rose-50 text-rose-700 ring-rose-100',
    normal: 'bg-slate-100 text-slate-700 ring-slate-200',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    info: 'bg-sky-50 text-sky-700 ring-sky-100',
    neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}


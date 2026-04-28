import {
  AlarmClock,
  Bell,
  CheckCircle2,
  Sparkles,
  TriangleAlert,
  Zap,
  Medal,
} from 'lucide-react'
import { cn } from '../../utils/cn.js'

function iconFor(type) {
  if (type === 'critical') return TriangleAlert
  if (type === 'ai') return Sparkles
  if (type === 'success') return CheckCircle2
  if (type === 'priority') return Zap
  if (type === 'milestone') return Medal
  if (type === 'schedule') return AlarmClock
  return Bell
}

function iconWrap(type) {
  if (type === 'critical') return 'bg-rose-50 ring-rose-100 text-rose-600'
  if (type === 'ai') return 'bg-indigo-50 ring-indigo-100 text-indigo-600'
  if (type === 'success') return 'bg-emerald-50 ring-emerald-100 text-emerald-600'
  if (type === 'priority') return 'bg-amber-50 ring-amber-100 text-amber-600'
  return 'bg-slate-50 ring-slate-200 text-slate-700'
}

function actionTone(tone) {
  if (tone === 'critical') return 'text-rose-600'
  if (tone === 'ai') return 'text-indigo-600'
  if (tone === 'priority') return 'text-amber-600'
  if (tone === 'schedule') return 'text-indigo-600'
  return 'text-slate-600'
}

export default function NotificationCard({ item, onMarkRead }) {
  const Icon = iconFor(item.type)

  return (
    <button
      type="button"
      onClick={() => onMarkRead(item.id)}
      className="w-full rounded-3xl bg-white p-4 text-left shadow-card ring-1 ring-slate-200 transition hover:bg-slate-50"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'grid h-12 w-12 place-items-center rounded-2xl ring-1',
            iconWrap(item.type),
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-sm font-extrabold text-slate-900">
              {item.title}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  item.unread ? 'bg-indigo-400' : 'bg-slate-200',
                )}
              />
            </div>
          </div>
          <div className="mt-1 line-clamp-2 text-sm text-slate-600">
            {item.body}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-slate-400">{item.time}</div>
            {item.actionText ? (
              <div className={cn('text-xs font-semibold', actionTone(item.actionTone))}>
                {item.actionText}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  )
}


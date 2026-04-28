import { MapPin, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'

export default function TaskCard({
  task,
  accepted,
  onToggleAccept,
  to,
  compact = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-semibold text-slate-900">
              {task.title}
            </div>
            {task.urgency === 'urgent' ? (
              <Badge tone="urgent">Urgent</Badge>
            ) : (
              <Badge tone="normal">Normal</Badge>
            )}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {task.ngo} • {task.timeWindow}
          </div>
        </div>
        {task.urgency === 'urgent' ? (
          <ShieldAlert className="h-5 w-5 text-rose-600" />
        ) : null}
      </div>

      {!compact ? (
        <div className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
          {task.description}
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
          <MapPin className="h-4 w-4 text-slate-400" />
          <span className="truncate">
            {task.location} • {task.distanceKm} km
          </span>
        </div>

        <div className="flex items-center gap-2">
          {to ? (
            <Link
              to={to}
              className="rounded-xl px-3 py-2 text-xs font-semibold text-brand-800 hover:bg-brand-50"
            >
              View
            </Link>
          ) : null}
          <Button
            variant={accepted ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => onToggleAccept(task.id)}
          >
            {accepted ? 'Accepted' : 'Accept'}
          </Button>
        </div>
      </div>
    </div>
  )
}


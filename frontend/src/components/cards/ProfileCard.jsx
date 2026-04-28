import { MapPin } from 'lucide-react'
import Badge from '../ui/Badge.jsx'

export default function ProfileCard({ user }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-700 text-white shadow-sm">
          <span className="text-sm font-extrabold">
            {user.name
              .split(' ')
              .slice(0, 2)
              .map((s) => s[0]?.toUpperCase())
              .join('')}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-base font-extrabold text-slate-900">
              {user.name}
            </div>
            <Badge tone="info">{user.role}</Badge>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="truncate">{user.location}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {user.skills.map((s) => (
              <Badge key={s} tone="neutral">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


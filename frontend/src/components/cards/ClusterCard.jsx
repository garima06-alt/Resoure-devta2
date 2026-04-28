import { Sparkles, TrendingUp, Droplets, Package, UtensilsCrossed } from 'lucide-react'
import { cn } from '../../utils/cn.js'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'

function iconFor(title) {
  const t = title.toLowerCase()
  if (t.includes('water')) return Droplets
  if (t.includes('medical')) return Package
  if (t.includes('food')) return UtensilsCrossed
  return TrendingUp
}

function severityStyles(sev) {
  if (sev === 'critical') {
    return {
      badge: <Badge tone="urgent">CRITICAL</Badge>,
      cta: 'bg-rose-500 hover:bg-rose-600 focus:ring-rose-200',
      iconWrap: 'bg-rose-50 ring-rose-100',
      icon: 'text-rose-600',
    }
  }
  return {
    badge: (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-100">
        HIGH <TrendingUp className="h-3.5 w-3.5" />
      </span>
    ),
    cta: 'bg-amber-400 hover:bg-amber-500 focus:ring-amber-200',
    iconWrap: 'bg-amber-50 ring-amber-100',
    icon: 'text-amber-600',
  }
}

export default function ClusterCard({ cluster, onDeploy, deployed }) {
  const Icon = iconFor(cluster.title)
  const s = severityStyles(cluster.severity)

  return (
    <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={cn('grid h-12 w-12 place-items-center rounded-2xl ring-1', s.iconWrap)}>
            <Icon className={cn('h-6 w-6', s.icon)} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {s.badge}
              {cluster.severity !== 'critical' ? null : (
                <TrendingUp className="h-4 w-4 text-rose-600" />
              )}
            </div>
            <div className="mt-2 text-base font-extrabold text-slate-900">
              {cluster.title}
            </div>
            <div className="mt-1 text-sm text-slate-500">{cluster.zone}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-extrabold text-slate-900">{cluster.reports}</div>
          <div className="text-sm text-slate-500">reports</div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 h-4 w-4 text-indigo-600" />
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-indigo-700">AI Insight:</span>{' '}
            {cluster.aiInsight}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Button
          className={cn('w-full rounded-2xl text-white focus:ring-2', s.cta)}
          size="lg"
          onClick={() => onDeploy(cluster.id)}
          disabled={deployed}
        >
          {deployed ? 'Deployed' : cluster.cta}
        </Button>
      </div>
    </div>
  )
}


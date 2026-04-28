import { motion } from 'framer-motion'
import { Activity, BarChart3, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mockAdmin } from '../../data/mockData.js'

function MiniChart({ series }) {
  const max = Math.max(...series)
  return (
    <div className="flex h-16 items-end gap-1">
      {series.map((v, idx) => (
        <div
          key={idx}
          className="flex-1 rounded-md bg-brand-200"
          style={{ height: `${Math.max(10, Math.round((v / max) * 64))}px` }}
        />
      ))}
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="space-y-4"
    >
      <div>
        <div className="text-xs font-semibold text-slate-500">NGO / Admin</div>
        <div className="text-xl font-extrabold tracking-tight text-slate-900">
          Dashboard
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {mockAdmin.kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card"
          >
            <div className="text-[11px] font-semibold text-slate-500">
              {k.label}
            </div>
            <div className="mt-1 text-lg font-extrabold">{k.value}</div>
            <div className="mt-1 text-[11px] font-semibold text-emerald-700">
              {k.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Weekly activity
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Reports ingested (mock)
            </div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-50 ring-1 ring-slate-200">
            <BarChart3 className="h-5 w-5 text-slate-700" />
          </div>
        </div>
        <div className="mt-4">
          <MiniChart series={mockAdmin.chart.series} />
          <div className="mt-2 flex justify-between text-[11px] font-semibold text-slate-400">
            {mockAdmin.chart.labels.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/app/admin/operations"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card hover:shadow-lg transition-all hover:border-brand-300"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Operations</div>
            <Activity className="h-5 w-5 text-brand-800" />
          </div>
          <div className="mt-2 text-sm text-slate-600">
            Queue, triage, assignment health.
          </div>
        </Link>
        <Link
          to="/app/admin/users"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card hover:shadow-lg transition-all hover:border-brand-300"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Users</div>
            <Users className="h-5 w-5 text-brand-800" />
          </div>
          <div className="mt-2 text-sm text-slate-600">
            Volunteers online, skills coverage.
          </div>
        </Link>
      </div>
    </motion.div>
  )
}


import { Bell, CheckCircle2, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ClusterCard from '../components/cards/ClusterCard.jsx'
import KpiPillCard from '../components/cards/KpiPillCard.jsx'
import { mockIntelligence } from '../data/mockData.js'

export default function HomePage() {
  const nav = useNavigate()
  const [deployed, setDeployed] = useState(() => new Set())

  const clusters = useMemo(() => mockIntelligence.clusters, [])

  function deploy(id) {
    setDeployed((prev) => new Set(prev).add(id))
  }

  return (
    <div className="-mx-4 -mt-4">
      <div className="relative overflow-hidden rounded-b-[28px] bg-gradient-to-b from-indigo-600 to-indigo-500 px-4 pb-6 pt-6 text-white">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -left-10 top-24 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm/6 opacity-90">Good morning,</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight">
              Intelligence Dashboard
            </div>
          </div>
          <button
            type="button"
            onClick={() => nav('/app/notifications')}
            className="relative grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur hover:bg-white/15"
            aria-label="Notifications"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-rose-500" />
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-5 py-2 text-sm font-semibold text-slate-800 shadow-soft">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Synced
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {mockIntelligence.kpis.map((k) => (
            <KpiPillCard
              key={k.id}
              icon={k.icon}
              label={k.label}
              value={k.value}
              delta={k.delta}
              tone={k.tone}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 px-4 pb-6 pt-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-500 text-white shadow-sm">
            <span className="text-lg">!</span>
          </div>
          <div className="text-lg font-extrabold text-slate-900">
            Urgent Clusters <span className="text-rose-500">•</span>
          </div>
        </div>

        <div className="space-y-4">
          {clusters.map((c) => (
            <ClusterCard
              key={c.id}
              cluster={c}
              deployed={deployed.has(c.id)}
              onDeploy={deploy}
            />
          ))}
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-slate-200">
          <div className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
            <Zap className="h-5 w-5 text-emerald-600" />
            Quick Actions
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              to="/app/map"
              className="rounded-2xl bg-indigo-600 p-5 text-white shadow-card transition hover:bg-indigo-700"
            >
              <div className="text-sm font-semibold opacity-90">View Heatmap</div>
              <div className="mt-2 text-lg font-extrabold">Geo</div>
            </Link>
            <Link
              to="/app/analytics"
              className="rounded-2xl bg-teal-600 p-5 text-white shadow-card transition hover:bg-teal-700"
            >
              <div className="text-sm font-semibold opacity-90">Analytics</div>
              <div className="mt-2 text-lg font-extrabold">Trends</div>
            </Link>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="pointer-events-none fixed bottom-20 left-1/2 z-40 w-[min(390px,92vw)] -translate-x-1/2"
      >
        <div className="pointer-events-auto rounded-2xl bg-slate-900/90 px-4 py-3 text-sm font-semibold text-white shadow-soft backdrop-blur">
          Live preview loading, interactions may not be saved
        </div>
      </motion.div>
    </div>
  )
}


import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Clock3, Activity, TriangleAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DonutChart from '../components/charts/DonutChart.jsx'
import MiniLineChart from '../components/charts/MiniLineChart.jsx'
import BarChart from '../components/charts/BarChart.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import { mockAnalytics } from '../data/mockData.js'

export default function AnalyticsPage() {
  const nav = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="-mx-4 -mt-4"
    >
      {/* Header */}
      <div className="relative overflow-hidden rounded-b-[28px] bg-gradient-to-b from-indigo-600 to-indigo-500 px-4 pb-6 pt-6 text-white">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -left-10 top-24 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => nav(-1)}
            className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur hover:bg-white/15"
            aria-label="Back"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-5 py-2 text-sm font-semibold text-slate-800 shadow-soft">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Synced
          </div>
          <div className="h-12 w-12" />
        </div>

        <div className="mt-4 text-2xl font-extrabold tracking-tight">
          Analytics Dashboard
        </div>
        <div className="mt-2 text-sm/6 opacity-90">Data-driven community insights</div>
      </div>

      <div className="space-y-4 px-4 pb-6 pt-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-slate-200">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-100 text-indigo-700">
              <Activity className="h-5 w-5" />
            </div>
            <div className="mt-6 text-xl font-extrabold text-slate-900">
              {mockAnalytics.kpis[0].value}
            </div>
            <div className="mt-1 text-sm text-slate-500">{mockAnalytics.kpis[0].label}</div>
            <div className="mt-2 text-sm font-semibold text-emerald-700">{mockAnalytics.kpis[0].delta}</div>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-slate-200">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-100 text-rose-700">
              <TriangleAlert className="h-5 w-5" />
            </div>
            <div className="mt-6 text-xl font-extrabold text-slate-900">
              {mockAnalytics.kpis[1].value}
            </div>
            <div className="mt-1 text-sm text-slate-500">{mockAnalytics.kpis[1].label}</div>
            <div className="mt-2 text-sm font-semibold text-emerald-700">{mockAnalytics.kpis[1].delta}</div>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-slate-200">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-100 text-teal-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="mt-6 text-xl font-extrabold text-slate-900">
              {mockAnalytics.kpis[2].value}
            </div>
            <div className="mt-1 text-sm text-slate-500">{mockAnalytics.kpis[2].label}</div>
            <div className="mt-2 text-sm font-semibold text-emerald-700">{mockAnalytics.kpis[2].delta}</div>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-slate-200">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-100 text-amber-700">
              <Clock3 className="h-5 w-5" />
            </div>
            <div className="mt-6 text-xl font-extrabold text-slate-900">
              {mockAnalytics.kpis[3].value}
            </div>
            <div className="mt-1 text-sm text-slate-500">{mockAnalytics.kpis[3].label}</div>
            <div className="mt-2 text-sm font-semibold text-emerald-700">{mockAnalytics.kpis[3].delta}</div>
          </div>
        </div>

        {/* Intervention trends */}
        <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-slate-200">
          <div className="text-lg font-extrabold text-slate-900">Intervention Trends</div>
          <div className="mt-3">
            <MiniLineChart
              labels={mockAnalytics.trends.labels}
              series={[
                { name: 'Deployments', color: '#3f51b5', data: mockAnalytics.trends.deployments },
                { name: 'Volunteers', color: '#0f9d8f', data: mockAnalytics.trends.volunteers },
              ]}
            />
          </div>
        </div>

        {/* Issue Categories */}
        <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-slate-200">
          <div className="text-lg font-extrabold text-slate-900">Issue Categories</div>
          <div className="mt-4 flex items-center gap-4">
            <DonutChart items={mockAnalytics.categories} />
            <div className="space-y-3">
              {mockAnalytics.categories.map((c) => (
                <div key={c.label} className="flex items-center justify-between gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                    <div className="text-slate-600">{c.label}</div>
                  </div>
                  <div className="font-semibold text-slate-900">{c.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-slate-200">
          <div className="text-lg font-extrabold text-slate-900">Geographic Distribution</div>
          <div className="mt-3">
            <BarChart labels={mockAnalytics.geo.labels} values={mockAnalytics.geo.values} />
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-slate-200">
          <div className="text-lg font-extrabold text-slate-900">Impact Metrics</div>
          <div className="mt-4 space-y-5">
            {mockAnalytics.impact.map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div>{m.label}</div>
                  <div className="font-semibold text-slate-900">{m.valueText}</div>
                </div>
                <div className="mt-2">
                  <ProgressBar value={m.value} max={m.max} colorClass={m.color} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}


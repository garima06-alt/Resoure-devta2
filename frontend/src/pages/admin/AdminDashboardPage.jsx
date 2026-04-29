import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  BarChart3, 
  Users, 
  IndianRupee, 
  TrendingUp, 
  Search, 
  Filter, 
  Plus, 
  RefreshCw 
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { mockAdmin, mockDonations } from '../../data/mockData.js'
import { formatINR } from '../../utils/format.js'


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
  const [activeTab, setActiveTab] = useState('donations')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDonations = mockDonations.history.filter(d => 
    d.donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.ngo.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-extrabold tracking-tight text-slate-900">
            NGO Dashboard
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Administrator
          </div>
        </div>
        <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 p-2 text-white shadow-md hover:opacity-90 transition">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Tab Toggle */}
      <div className="flex rounded-xl bg-slate-100 p-1">
        <button
          onClick={() => setActiveTab('donations')}
          className={`flex-1 rounded-lg py-2 text-center text-xs font-bold transition ${
            activeTab === 'donations'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Donations
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 rounded-lg py-2 text-center text-xs font-bold transition ${
            activeTab === 'overview'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Overview
        </button>
      </div>

      {activeTab === 'donations' ? (
        <div className="space-y-4">
          <div>
            <div className="text-lg font-bold text-slate-900">Donations</div>
            <div className="text-xs text-slate-500">Track all NGO contributions</div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            {mockDonations.stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card flex flex-col justify-between min-h-[120px]"
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl p-2 text-white ${
                    idx === 0 ? 'bg-emerald-500' :
                    idx === 1 ? 'bg-blue-500' : 'bg-purple-500'
                  }`}>
                    {idx === 0 && <IndianRupee className="h-4 w-4" />}
                    {idx === 1 && <TrendingUp className="h-4 w-4" />}
                    {idx === 2 && <Users className="h-4 w-4" />}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-[11px] font-semibold text-slate-500">
                    {stat.label}
                  </div>
                  <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {stat.value}
                  </div>
                </div>
                <div className="mt-1">
                  <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    {stat.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search donors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50">
              <Filter className="h-4 w-4" />
            </button>
          </div>

          {/* Recent Donations */}
          <div className="space-y-2">
            <div className="text-sm font-bold text-slate-900">Recent Donations</div>
            <div className="space-y-3">
              {filteredDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 ring-1 ring-slate-100">
                      {donation.type === 'one-time' ? (
                        <span className="text-xl">💰</span>
                      ) : (
                        <RefreshCw className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {donation.donor}
                      </div>
                      <div className="text-xs text-slate-500">
                        {donation.ngo}
                      </div>
                      <div className="mt-1 flex gap-1">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          donation.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {donation.status}
                        </span>
                        <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          {donation.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-emerald-600">
                      {formatINR(donation.amount)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {donation.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Overview Tab (Existing Content) */
        <div className="space-y-4">
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
        </div>
      )}
    </motion.div>
  )
}


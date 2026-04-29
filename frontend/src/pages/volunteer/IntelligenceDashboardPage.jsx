import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell, CheckCircle2, Box, MapPin,
  Camera, FileText, X, Map, BarChart2,
  AlertTriangle, Heart,
} from 'lucide-react'
import { collection, onSnapshot, query, orderBy, doc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { useVolunteerNotifications } from '../../hooks/useVolunteerNotifications'

// ── Static header stat cards (aggregates — can be wired to Firestore counters later) ──
const STAT_CARDS = [
  { icon: Box,          value: '1,247', label: 'Total Reports',   delta: '+12%' },
  { icon: MapPin,       value: '8',     label: 'Active Hotspots', delta: '+2'   },
  { icon: CheckCircle2, value: '87%',   label: 'Resolution Rate', delta: '+5%'  },
]

// ── Helpers ────────────────────────────────────────────────────────────────
function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ── Sub-components ─────────────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, delta }) {
  return (
    <div className="stat-card-glass flex flex-col gap-1 p-3 flex-1 text-center">
      <Icon className="h-4 w-4 mx-auto text-white opacity-80" />
      <div className="text-xl font-extrabold text-white leading-none">{value}</div>
      <div className="text-[10px] text-white/75 font-semibold leading-tight">{label}</div>
      <div className="text-[10px] font-bold text-emerald-200">↑ {delta}</div>
    </div>
  )
}

// 3-state: pending → deploying (spinner) → deployed (coral)
function ClusterCard({ report, onDeploy, isDeploying }) {
  // Map Firestore priority field to display values
  const priorityRaw = (report.priority || '').toUpperCase()
  const isCritical  = priorityRaw === 'CRITICAL'
  const accentColor = isCritical ? '#f43f5e' : '#f59e0b'
  const accentBg    = isCritical ? '#fff1f2' : '#fffbeb'
  const accentBorder= isCritical ? '#fecdd3' : '#fde68a'

  // Support both Firestore field names (status) and legacy local field (deployed)
  const isDeployed  = report.status === 'deployed' || report.deployed === true

  return (
    <div
      className="rounded-2xl p-4 bg-white"
      style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
          >
            <AlertTriangle className="h-5 w-5" style={{ color: accentColor }} />
          </div>
          <div>
            <div
              className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1"
              style={{ color: accentColor }}
            >
              {isCritical ? '🔴' : '🟡'} {report.priority || report.severity}
              <span className="font-normal" style={{ color: '#64748b' }}>↗ trending</span>
            </div>
            <div className="text-sm font-extrabold text-ink">{report.title}</div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-extrabold" style={{ color: accentColor }}>
            {report.reportCount ?? report.reports ?? 0}
          </div>
          <div className="text-[10px] text-muted">reports</div>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1 text-xs text-muted mb-2">
        <MapPin className="h-3.5 w-3.5" />
        {report.location || report.zone}
      </div>

      {/* AI Insight box */}
      <div
        className="rounded-xl px-3 py-2 mb-3 flex items-start gap-2"
        style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}
      >
        <span className="text-sm flex-shrink-0">✨</span>
        <p className="text-xs leading-relaxed" style={{ color: '#5b21b6' }}>
          <span className="font-bold">AI Insight: </span>{report.aiInsight}
        </p>
      </div>

      {/* THREE-STATE action button */}
      {isDeployed ? (
        <button
          disabled
          className="w-full rounded-xl py-2.5 text-sm font-bold cursor-not-allowed"
          style={{ background: '#fee2e2', color: '#f43f5e', border: '1px solid #fecdd3' }}
        >
          ✓ Deployed
        </button>
      ) : isDeploying ? (
        <button
          disabled
          className="w-full rounded-xl py-2.5 text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4' }}
        >
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Deploying...
        </button>
      ) : (
        <button
          onClick={() => onDeploy(report.id)}
          className="w-full rounded-xl py-2.5 text-sm font-bold text-white transition-all active:scale-95"
          style={{ background: '#0d9488' }}
        >
          Deploy Response Team
        </button>
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function IntelligenceDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { unreadCount } = useVolunteerNotifications()

  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Volunteer'

  // ── Firestore: live reports ──
  const [reports, setReports]     = useState([])
  const [reportsLoading, setReportsLoading] = useState(true)
  // { [reportId]: true } while a deploy request is in-flight
  const [deploying, setDeploying] = useState({})

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setReportsLoading(false)
    }, (err) => {
      console.warn('Reports listener error:', err.message)
      setReportsLoading(false)
    })
    return () => unsub()
  }, [])

  // Optimistic deploy: spinner instantly, Firestore write in background
  async function handleDeploy(reportId) {
    if (deploying[reportId]) return
    setDeploying((prev) => ({ ...prev, [reportId]: true }))
    try {
      await updateDoc(doc(db, 'reports', reportId), {
        status:     'deployed',
        deployedAt: Timestamp.now(),
        deployedBy: user?.uid || 'anonymous',
      })
      // onSnapshot will auto-update the card to the 'deployed' state
    } catch (err) {
      console.error('Deploy failed:', err)
      // Revert spinner on error
      setDeploying((prev) => ({ ...prev, [reportId]: false }))
    }
  }

  // ── Intelligence Scanner state ──
  const fileRef = useRef(null)
  const [scannedFile, setScannedFile] = useState(null)
  const [processing, setProcessing]  = useState(false)
  const [processed, setProcessed]    = useState(false)

  function handleFileChange(e) {
    const f = e.target.files?.[0]
    if (f) { setScannedFile(f); setProcessed(false) }
  }

  function handleProcess() {
    setProcessing(true)
    setTimeout(() => { setProcessing(false); setProcessed(true) }, 1800)
  }

  return (
    <div className="min-h-screen page-enter" style={{ background: '#f0f4f8' }}>

      {/* ── SECTION 1: Hero Header ──────────────────────────────────────── */}
      <div
        className="relative overflow-hidden px-4 pt-8 pb-6"
        style={{ background: 'linear-gradient(135deg, #6c3fc5, #8b5cf6)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8  h-32 w-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        {/* Greeting row */}
        <div className="flex items-center justify-between mb-1 relative">
          <p className="text-sm text-white/80 font-medium">
            {greeting()}, <span className="font-bold text-white">{firstName}</span> 👋
          </p>
          <button
            onClick={() => navigate('/app/notifications')}
            className="relative p-2 rounded-xl bg-white/15"
          >
            <Bell className="h-5 w-5 text-white" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full text-white font-black"
                style={{ background: '#f43f5e', fontSize: '9px' }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Main heading */}
        <h1 className="text-2xl font-extrabold text-white tracking-tight mb-3">
          Intelligence Dashboard
        </h1>

        {/* Synced pill */}
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4 bg-white/20">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
          <span className="text-xs font-bold text-white">Synced</span>
        </div>

        {/* Stat cards row */}
        <div className="flex gap-2">
          {STAT_CARDS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* ── Content area ─────────────────────────────────────────────────── */}
      <div className="px-4 py-5 space-y-5">

        {/* ── SECTION 2: Intelligence Scanner ──────────────────────────── */}
        <div
          className="rounded-2xl p-4 bg-white"
          style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <h2 className="text-base font-extrabold text-ink mb-3">🔍 Intelligence Scanner</h2>

          {!scannedFile ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed py-8 flex flex-col items-center gap-2 transition-all hover:bg-purple-50"
              style={{ borderColor: '#ddd6fe' }}
            >
              <Camera className="h-8 w-8" style={{ color: '#6c3fc5' }} />
              <div className="text-sm font-bold" style={{ color: '#6c3fc5' }}>Scan Paper Survey</div>
              <div className="text-xs text-muted">Tap to capture or select file</div>
            </button>
          ) : (
            <div className="rounded-xl bg-purple-50 border border-purple-100 p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-5 w-5 flex-shrink-0" style={{ color: '#6c3fc5' }} />
                <span className="text-sm font-semibold text-ink truncate">{scannedFile.name}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!processed ? (
                  <button
                    onClick={handleProcess}
                    disabled={processing}
                    className="rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-all"
                    style={{ background: processing ? '#0d9488aa' : '#0d9488' }}
                  >
                    {processing ? 'Processing…' : 'Process'}
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Done
                  </span>
                )}
                <button onClick={() => { setScannedFile(null); setProcessed(false) }}>
                  <X className="h-4 w-4 text-muted" />
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* ── SECTION 3: Urgent Clusters ───────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-extrabold text-ink">🚨 Urgent Clusters</h2>
            <span
              className="h-2.5 w-2.5 rounded-full pulse-dot"
              style={{ background: '#f43f5e' }}
            />
          </div>
          <div className="space-y-3">
            {reportsLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
                  style={{ borderColor: '#6c3fc5', borderTopColor: 'transparent' }} />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted">No active crisis reports</div>
            ) : (
              reports.map((r) => (
                <ClusterCard
                  key={r.id}
                  report={r}
                  onDeploy={handleDeploy}
                  isDeploying={!!deploying[r.id]}
                />
              ))
            )}
          </div>
        </div>

        {/* ── SECTION 4: NGO Donation Banner ──────────────────────────── */}
        <div
          className="rounded-2xl p-5 flex items-center justify-between gap-4 overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #6c3fc5, #8b5cf6)' }}
        >
          <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div>
            <div className="text-base font-extrabold text-white">Support Our NGOs</div>
            <div className="text-xs text-white/75 mt-0.5">Make a difference today with your donation</div>
          </div>
          <button
            onClick={() => navigate('/app/donations')}
            className="flex-shrink-0 flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-purple-700 bg-white transition-all hover:bg-purple-50"
          >
            <Heart className="h-4 w-4" />
            Donate
          </button>
        </div>

        {/* ── SECTION 5: Quick Actions ─────────────────────────────────── */}
        <div
          className="rounded-2xl p-4 bg-white"
          style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <h2 className="text-base font-extrabold text-ink mb-3">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/app/map')}
              className="rounded-xl p-4 flex flex-col gap-2 transition-all hover:opacity-90 text-left"
              style={{ background: 'linear-gradient(135deg, #6c3fc5, #8b5cf6)' }}
            >
              <Map className="h-6 w-6 text-white" />
              <div>
                <div className="text-sm font-bold text-white">View Heatmap</div>
                <div className="text-[11px] text-white/70">Geo coverage</div>
              </div>
            </button>
            <button
              onClick={() => navigate('/app/analytics')}
              className="rounded-xl p-4 flex flex-col gap-2 transition-all hover:opacity-90 text-left"
              style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)' }}
            >
              <BarChart2 className="h-6 w-6 text-white" />
              <div>
                <div className="text-sm font-bold text-white">Analytics</div>
                <div className="text-[11px] text-white/70">Trends &amp; insights</div>
              </div>
            </button>
          </div>
        </div>

        {/* bottom spacing */}
        <div className="h-2" />
      </div>
    </div>
  )
}

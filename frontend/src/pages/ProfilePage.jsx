import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, onSnapshot, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import {
  Target, Clock3, Award, Flame,
  ClipboardList, Settings, LogOut, MapPin,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function formatJoinDate(ts) {
  if (!ts) return 'recently'
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  } catch { return 'recently' }
}

function initials(name) {
  if (!name) return 'V'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0][0].toUpperCase()
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
function StatTile({ icon: Icon, iconColor, value, label }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 rounded-2xl p-4 bg-white"
      style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}
    >
      <Icon className="h-5 w-5 mb-0.5" style={{ color: iconColor }} />
      <div className="text-xl font-extrabold" style={{ color: '#1e293b' }}>{value}</div>
      <div className="text-[11px] font-semibold" style={{ color: '#64748b' }}>{label}</div>
    </div>
  )
}

const STATUS_META = {
  completed: { dot: '#0d9488', bg: '#f0fdfa', text: '#0d9488', border: '#99f6e4', label: 'Completed' },
  ongoing:   { dot: '#f59e0b', bg: '#fffbeb', text: '#b45309', border: '#fde68a', label: 'Ongoing'   },
  cancelled: { dot: '#f43f5e', bg: '#fff1f2', text: '#f43f5e', border: '#fecdd3', label: 'Cancelled' },
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // ── Bulletproof Firestore listener ──────────────────────────────────────
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false)
      return
    }

    const ref = doc(db, 'users', user.uid)

    const unsub = onSnapshot(
      ref,
      async (snap) => {
        if (snap.exists()) {
          setProfile(snap.data())
          setLoading(false)
        } else {
          // Document doesn't exist yet — auto-create from Firebase Auth data
          const fallback = {
            uid:             user.uid,
            name:            user.displayName || user.email?.split('@')[0] || 'Volunteer',
            email:           user.email || '',
            role:            'volunteer',
            profession:      'Volunteer',
            location:        'Mumbai, Maharashtra',
            specializations: [],
            joinedAt:        Timestamp.now(),
            stats: {
              missions:       0,
              hoursLogged:    0,
              badges:         0,
              streak:         0,
              tasksAssigned:  0,
              tasksCompleted: 0,
            },
            recentMissions: [],
            rating: 0,
            avatarInitials: (user.displayName || user.email || 'V')[0].toUpperCase(),
          }
          try { await setDoc(ref, fallback) } catch (e) { console.warn('setDoc fallback error:', e) }
          setProfile(fallback)
          setLoading(false)
        }
      },
      (error) => {
        // onSnapshot error — fall back to auth data so page never hangs
        console.error('Profile listener error:', error)
        setProfile({
          name:            user.displayName || user.email?.split('@')[0] || 'Volunteer',
          email:           user.email || '',
          role:            'volunteer',
          profession:      'Volunteer',
          location:        'Mumbai, Maharashtra',
          specializations: [],
          joinedAt:        null,
          stats:           { missions: 0, hoursLogged: 0, badges: 0, streak: 0, tasksAssigned: 0, tasksCompleted: 0 },
          recentMissions:  [],
          rating:          0,
        })
        setLoading(false)
      }
    )

    return () => unsub()
  }, [user])

  // ── Loading spinner ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#f0f4f8' }}>
        <div
          className="animate-spin w-10 h-10 rounded-full border-4 border-t-transparent"
          style={{ borderColor: '#7c3aed', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  // ── Derived values ───────────────────────────────────────────────────────
  const stats            = profile?.stats || {}
  const specializations  = profile?.specializations || []
  const recentMissions   = profile?.recentMissions  || []
  const isAdmin          = (profile?.role || '').toLowerCase() === 'admin'
  const displayInitials  = profile?.avatarInitials || initials(profile?.name)
  const completionRate   = stats.tasksAssigned > 0
    ? Math.round((stats.tasksCompleted / stats.tasksAssigned) * 100)
    : 0

  const CARD = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen overflow-y-auto pb-24 page-enter"
      style={{ background: '#f0f4f8' }}
    >

      {/* ── SECTION 1: Hero Header ──────────────────────────────────────── */}
      <div
        className="relative overflow-hidden px-4 pt-6 pb-8"
        style={{ background: 'linear-gradient(135deg, #6c3fc5, #8b5cf6)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6  h-28 w-28 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        {/* Settings icon — top right */}
        <div className="flex justify-end mb-4 relative">
          <button
            className="p-2 rounded-xl bg-white/15 transition-all hover:bg-white/25"
            aria-label="Settings (coming soon)"
          >
            <Settings className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Centered avatar + info */}
        <div className="flex flex-col items-center text-center gap-2 relative">
          {/* Avatar */}
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={profile?.name}
              className="h-[72px] w-[72px] rounded-full object-cover border-2 border-white/40"
            />
          ) : (
            <div
              className="h-[72px] w-[72px] rounded-full flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
              style={{ background: '#4c1d95', border: '2px solid rgba(255,255,255,0.3)' }}
            >
              {displayInitials}
            </div>
          )}

          {/* Name */}
          <div className="text-xl font-bold text-white leading-tight mt-1">
            {profile?.name || 'Volunteer'}
          </div>

          {/* Profession */}
          <div className="text-sm font-medium text-white/70">
            {profile?.profession || 'Volunteer'}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-white/60">
            <MapPin className="h-3 w-3" />
            {profile?.location || 'Mumbai, Maharashtra'}
          </div>

          {/* Join date */}
          <div className="text-[11px] text-white/50">
            Member since {formatJoinDate(profile?.joinedAt)}
          </div>

          {/* Synced pill */}
          <div
            className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-white text-xs font-semibold"
            style={{ color: '#1e293b' }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: '#22c55e' }} />
            Synced
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">

        {/* ── SECTION 2: Stats Grid (2×2) ──────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <StatTile icon={Target}       iconColor="#0d9488" value={stats.missions    ?? 0}           label="Missions"  />
          <StatTile icon={Clock3}       iconColor="#6c3fc5" value={`${stats.hoursLogged ?? 0}h`}     label="Hours"     />
          <StatTile icon={Award}        iconColor="#f59e0b" value={stats.badges       ?? 0}           label="Badges"    />
          <StatTile icon={Flame}        iconColor="#f43f5e" value={`${stats.streak ?? 0} day`}        label="Streak"    />
        </div>

        {/* ── SECTION 3: Task Progress ─────────────────────────────────── */}
        <div style={CARD} className="p-5">
          <div className="text-sm font-bold mb-4" style={{ color: '#1e293b' }}>
            📋 Task Progress
          </div>

          <div className="flex justify-between text-sm mb-1">
            <span style={{ color: '#64748b' }}>Assigned</span>
            <span className="font-bold" style={{ color: '#1e293b' }}>{stats.tasksAssigned ?? 0}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span style={{ color: '#64748b' }}>Completed</span>
            <span className="font-bold" style={{ color: '#1e293b' }}>{stats.tasksCompleted ?? 0}</span>
          </div>

          {/* Progress bar */}
          <div
            className="w-full rounded-full overflow-hidden mb-2"
            style={{ height: 8, background: '#e2e8f0' }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${completionRate}%`, background: '#0d9488' }}
            />
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold" style={{ color: '#0d9488' }}>
              {completionRate}%
            </span>
            <span className="text-xs" style={{ color: '#64748b' }}>completion rate</span>
          </div>
        </div>

        {/* ── SECTION 4: Specializations ───────────────────────────────── */}
        <div style={CARD} className="p-5">
          <div className="text-sm font-bold mb-3" style={{ color: '#1e293b' }}>
            ⚡ Specializations
          </div>

          {specializations.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {specializations.map((s) => (
                <span
                  key={s}
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe' }}
                >
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-sm italic" style={{ color: '#94a3b8' }}>
                No specializations added yet.
              </p>
              <button
                className="mt-2 text-xs font-semibold"
                style={{ color: '#0d9488' }}
              >
                + Add specializations
              </button>
            </div>
          )}
        </div>

        {/* ── SECTION 5: Recent Missions ───────────────────────────────── */}
        <div style={CARD} className="p-5">
          <div className="text-sm font-bold mb-3" style={{ color: '#1e293b' }}>
            🗂 Recent Missions
          </div>

          {recentMissions.length > 0 ? (
            <div className="space-y-3">
              {recentMissions.map((m, i) => {
                const meta = STATUS_META[m.status] || STATUS_META.completed
                return (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Colored dot */}
                      <span
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{ background: meta.dot }}
                      />
                      <div className="min-w-0">
                        <div
                          className="text-sm font-medium truncate"
                          style={{ color: '#1e293b' }}
                        >
                          {m.title}
                        </div>
                        {m.date && (
                          <div className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>
                            {m.date}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Status badge */}
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 uppercase tracking-wider"
                      style={{
                        background: meta.bg,
                        color:      meta.text,
                        border:    `1px solid ${meta.border}`,
                      }}
                    >
                      {meta.label}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 gap-2">
              <span className="text-4xl opacity-30">📋</span>
              <div className="text-sm font-semibold" style={{ color: '#94a3b8' }}>
                No missions yet
              </div>
              <div className="text-xs text-center" style={{ color: '#cbd5e1' }}>
                Your completed missions will appear here
              </div>
            </div>
          )}
        </div>

        {/* ── SECTION 6: Account ───────────────────────────────────────── */}
        <div style={CARD} className="p-5">
          <div className="text-sm font-bold mb-4" style={{ color: '#1e293b' }}>
            👤 Account
          </div>

          {/* Email row */}
          <div
            className="flex items-center justify-between py-3"
            style={{ borderBottom: '1px solid #f1f5f9' }}
          >
            <span className="text-sm" style={{ color: '#64748b' }}>Email</span>
            <span
              className="text-sm font-medium truncate max-w-[180px] text-right"
              style={{ color: '#1e293b' }}
            >
              {profile?.email || user?.email || '—'}
            </span>
          </div>

          {/* Role row */}
          <div className="flex items-center justify-between py-3">
            <span className="text-sm" style={{ color: '#64748b' }}>Role</span>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
              style={
                isAdmin
                  ? { background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }
                  : { background: '#ede9fe', color: '#7c3aed', border: '1px solid #ddd6fe' }
              }
            >
              {isAdmin ? 'Admin' : 'Volunteer'}
            </span>
          </div>

          {/* Sign out button */}
          <button
            onClick={async () => {
              await logout()
              navigate('/login', { replace: true })
            }}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all hover:opacity-90"
            style={{
              background: '#fff1f2',
              color:      '#f43f5e',
              border:     '1px solid #fecdd3',
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

      </div>
    </div>
  )
}

import { useState } from 'react'
import { BellOff, CheckCheck, AlertTriangle, ClipboardCheck, Settings } from 'lucide-react'
import { useVolunteerNotifications } from '../../hooks/useVolunteerNotifications'

const FILTERS = ['All', 'Urgent', 'Assignments', 'System']

const TYPE_META = {
  urgent: {
    label: 'URGENT',
    icon: AlertTriangle,
    borderColor: '#f43f5e',
    bg: '#fff1f2',
    cardBorder: '#fecdd3',
    iconBg: '#ffe4e6',
    iconColor: '#f43f5e',
    badge: { bg: '#ffe4e6', color: '#be123c', border: '#fecdd3' },
  },
  assignment: {
    label: 'ASSIGNMENT',
    icon: ClipboardCheck,
    borderColor: '#6c3fc5',
    bg: '#f5f3ff',
    cardBorder: '#ddd6fe',
    iconBg: '#ede9fe',
    iconColor: '#6c3fc5',
    badge: { bg: '#ede9fe', color: '#5b21b6', border: '#ddd6fe' },
  },
  system: {
    label: 'SYSTEM',
    icon: Settings,
    borderColor: '#94a3b8',
    bg: '#f8fafc',
    cardBorder: '#e2e8f0',
    iconBg: '#f1f5f9',
    iconColor: '#64748b',
    badge: { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' },
  },
}

function getFilterKey(type) {
  if (type === 'urgent') return 'Urgent'
  if (type === 'assignment') return 'Assignments'
  return 'System'
}

export default function VolunteerNotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead } = useVolunteerNotifications()
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = notifications.filter((n) =>
    activeFilter === 'All' ? true : getFilterKey(n.type) === activeFilter
  )

  return (
    <div className="min-h-screen page-enter" style={{ background: '#f0f4f8' }}>

      {/* Header — purple gradient */}
      <div
        className="px-4 pt-8 pb-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #6c3fc5, #8b5cf6)' }}
      >
        <div className="absolute -top-8 -right-8 h-36 w-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Alerts & Updates</h1>
            <p className="text-sm mt-0.5 text-white/75">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up ✓'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold bg-white/20 text-white transition-all hover:bg-white/30"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Unread pill */}
        {unreadCount > 0 && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-white/20">
            <span className="h-2 w-2 rounded-full bg-coral animate-pulse" style={{ background: '#f43f5e' }} />
            <span className="text-xs font-bold text-white">
              {unreadCount} new notification{unreadCount > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none bg-white border-b border-border">
        {FILTERS.map((f) => {
          const isActive = activeFilter === f
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold flex-shrink-0 transition-all"
              style={{
                background: isActive ? '#6c3fc5' : '#f1f5f9',
                color:      isActive ? '#ffffff' : '#64748b',
                border:     isActive ? '1px solid #6c3fc5' : '1px solid #e2e8f0',
              }}
            >
              {f}
            </button>
          )
        })}
      </div>

      {/* Notification list */}
      <div className="px-4 py-4 space-y-3 pb-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <BellOff className="h-12 w-12 text-muted opacity-40" />
            <div className="text-sm font-semibold text-muted">No notifications here</div>
          </div>
        ) : (
          filtered.map((n) => {
            const meta = TYPE_META[n.type] || TYPE_META.system
            const Icon = meta.icon
            return (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className="w-full text-left rounded-2xl p-4 transition-all hover:shadow-md"
                style={{
                  background:    n.unread ? meta.bg : '#ffffff',
                  border:        `1px solid ${n.unread ? meta.cardBorder : '#e2e8f0'}`,
                  borderLeft:    `3px solid ${meta.borderColor}`,
                  opacity:       n.unread ? 1 : 0.7,
                  boxShadow:     '0 2px 6px rgba(0,0,0,0.05)',
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: meta.iconBg }}
                  >
                    <Icon className="h-5 w-5" style={{ color: meta.iconColor }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-bold text-ink leading-tight">{n.title}</div>
                      {n.unread && (
                        <span
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{ background: meta.borderColor }}
                        />
                      )}
                    </div>

                    <p className="text-xs mt-1 leading-relaxed text-muted">{n.body}</p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-muted">{n.time}</span>
                      <span
                        className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
                        style={{
                          background: meta.badge.bg,
                          color:      meta.badge.color,
                          border:     `1px solid ${meta.badge.border}`,
                        }}
                      >
                        {meta.label}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

import { Outlet, useLocation, NavLink } from 'react-router-dom'
import { Brain, BarChart2, MapPin, Bell, User } from 'lucide-react'
import { useVolunteerNotifications } from '../hooks/useVolunteerNotifications'

// Tab 1: Intelligence (home)  Tab 2: Analytics  Tab 3: Geo Map
// Tab 4: Alerts               Tab 5: Profile
const VOLUNTEER_TABS = [
  { to: '/app/intelligence',  label: 'Intel',     icon: Brain   },
  { to: '/app/analytics',     label: 'Analytics', icon: BarChart2 },
  { to: '/app/map',           label: 'Geo Map',   icon: MapPin  },
  { to: '/app/notifications', label: 'Alerts',    icon: Bell    },
  { to: '/app/profile',       label: 'Profile',   icon: User    },
]

export default function VolunteerLayout() {
  const location = useLocation()
  const { unreadCount } = useVolunteerNotifications()

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#f0f4f8' }}>
      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-[72px]">
        <Outlet />
      </main>

      {/* Bottom Navigation — light theme */}
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50"
        style={{
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
        }}
      >
        <div className="grid grid-cols-5 px-1 py-1">
          {VOLUNTEER_TABS.map((tab) => {
            // Intelligence is the root; exact match for it, prefix match for others
            const isActive =
              tab.to === '/app/intelligence'
                ? location.pathname === '/app/intelligence'
                : location.pathname.startsWith(tab.to)

            const isNotifications = tab.to === '/app/notifications'
            const Icon = tab.icon

            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all relative"
                style={{
                  color:      isActive ? '#6c3fc5' : '#94a3b8',
                  background: isActive ? '#f5f3ff' : 'transparent',
                }}
              >
                <div className="relative">
                  <Icon className="h-5 w-5 mb-0.5" />
                  {/* Unread badge */}
                  {isNotifications && unreadCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1.5 h-4 w-4 flex items-center justify-center rounded-full text-white font-black"
                      style={{ background: '#f43f5e', fontSize: '9px' }}
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: isActive ? '#6c3fc5' : '#94a3b8' }}
                >
                  {tab.label}
                </span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

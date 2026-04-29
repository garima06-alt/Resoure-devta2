import { Outlet, useLocation, NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Users, Package, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ADMIN_TABS = [
  { to: '/admin/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/admin/tasks',      label: 'Tasks',      icon: ClipboardList },
  { to: '/admin/volunteers', label: 'Volunteers', icon: Users },
  { to: '/admin/resources',  label: 'Resources',  icon: Package },
  { to: '/admin/settings',   label: 'Settings',   icon: Settings },
]

export default function AdminLayout() {
  const location = useLocation()
  const { user } = useAuth()

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#f0f4f8' }}>

      {/* Admin top header — amber accent, light bg */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white"
        style={{ borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-black tracking-tight text-ink">Resource Devta</span>
          <span
            className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider"
            style={{
              background: '#fef3c7',
              border: '1px solid #fcd34d',
              color: '#b45309',
            }}
          >
            ADMIN
          </span>
        </div>
        <span className="text-xs text-muted">{user?.email || 'Admin'}</span>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-[72px]">
        <Outlet />
      </main>

      {/* Admin bottom nav — light, amber active */}
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white"
        style={{ borderTop: '1px solid #e2e8f0', boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }}
      >
        <div className="grid grid-cols-5 px-1 py-1">
          {ADMIN_TABS.map((tab) => {
            const isActive =
              location.pathname === tab.to ||
              (tab.to !== '/admin' && location.pathname.startsWith(tab.to))
            const Icon = tab.icon
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all"
                style={{
                  color:      isActive ? '#b45309' : '#94a3b8',
                  background: isActive ? '#fffbeb' : 'transparent',
                }}
              >
                <Icon className="h-5 w-5 mb-0.5" />
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: isActive ? '#b45309' : '#94a3b8' }}
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

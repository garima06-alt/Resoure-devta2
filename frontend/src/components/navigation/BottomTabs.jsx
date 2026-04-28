import { Bell, Brain, ChartNoAxesColumn, Map, Shield, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/cn.js'

const tabs = [
  { to: '/app', label: 'Intelligence', icon: Brain },
  { to: '/app/analytics', label: 'Analytics', icon: ChartNoAxesColumn },
  { to: '/app/map', label: 'Geo', icon: Map },
  { to: '/app/notifications', label: 'Alerts', icon: Bell },
  { to: '/app/profile', label: 'Profile', icon: User },
]

export default function BottomTabs({ showAdmin }) {
  const items = showAdmin ? [...tabs, { to: '/app/admin', label: 'Admin', icon: Shield }] : tabs

  return (
    <nav className="sticky bottom-0 z-40 border-t border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto grid max-w-[430px] grid-cols-5 gap-1 px-2 py-2">
        {items.slice(0, 5).map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-semibold transition',
                isActive ? 'bg-brand-50 text-brand-800' : 'text-slate-500 hover:bg-slate-50',
              )
            }
          >
            <t.icon className="h-5 w-5" />
            <div className="mt-1">{t.label}</div>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}


import { Bell, Brain, ChartNoAxesColumn, Map, Shield, User, Gift, ClipboardList, HelpCircle, Package, ServerCrash, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/cn.js'
import { useAuth } from '../../context/AuthContext'

export default function BottomTabs() {
  const { userRole } = useAuth()

  const adminTabs = [
    { to: '/app/admin/map', label: 'Command Map', icon: Map },
    { to: '/app/admin/donations', label: 'Ledger', icon: Gift },
    { to: '/app/admin/inventory', label: 'Inventory', icon: Package },
    { to: '/app/admin/users', label: 'Users', icon: Users },
    { to: '/app/admin/diagnostics', label: 'Diagnostics', icon: ServerCrash },
  ]

  const commonTabs = [
    { to: '/app/map', label: 'Geo Map', icon: Map },
    { to: '/app/donations', label: 'Donations', icon: Gift },
    { to: '/app/requests', label: 'Aid Tracker', icon: ClipboardList },
    { to: '/app/support', label: 'Help', icon: HelpCircle },
    { to: '/app/profile', label: 'Profile', icon: User },
  ]

  const items = userRole === 'admin' ? adminTabs : commonTabs
  const gridCols = 'grid-cols-5'

  return (
    <nav className="sticky bottom-0 z-40 border-t border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className={`mx-auto grid max-w-[480px] gap-1 px-2 py-2 ${gridCols}`}>
        {items.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center rounded-2xl px-1 py-2 text-[10px] font-bold tracking-tight transition',
                isActive 
                  ? (userRole === 'admin' ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400') 
                  : 'text-slate-500 hover:bg-slate-900',
              )
            }
          >
            <t.icon className="h-5 w-5 mb-0.5" />
            <div className="truncate w-full text-center">{t.label}</div>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}



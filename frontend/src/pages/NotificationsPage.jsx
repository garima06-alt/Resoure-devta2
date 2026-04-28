import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import NotificationCard from '../components/cards/NotificationCard.jsx'
import { mockNotifications } from '../data/mockData.js'
import { CheckCircle2 } from 'lucide-react'

export default function NotificationsPage() {
  const [read, setRead] = useState(() => new Set())

  const items = useMemo(() => {
    return mockNotifications.map((n) => ({ ...n, unread: n.unread && !read.has(n.id) }))
  }, [read])

  function markRead(id) {
    setRead((prev) => new Set(prev).add(id))
  }

  const unreadCount = items.filter((i) => i.unread).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="-mx-4 -mt-4"
    >
      <div className="relative overflow-hidden rounded-b-[28px] bg-gradient-to-b from-indigo-600 to-indigo-500 px-4 pb-6 pt-6 text-white">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -left-10 top-24 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <div className="flex items-center justify-between">
          <div className="text-2xl font-extrabold tracking-tight">Notifications</div>
          <div className="relative">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10">
              <span className="text-sm font-bold">{unreadCount}</span>
            </div>
          </div>
        </div>

        <div className="mt-2 text-sm/6 opacity-90">Real-time intelligence updates</div>

        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-5 py-2 text-sm font-semibold text-slate-800 shadow-soft">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Synced
          </div>
        </div>
      </div>

      <div className="space-y-3 px-4 pb-6 pt-5">
        {items.map((n) => (
          <NotificationCard key={n.id} item={n} onMarkRead={markRead} />
        ))}
      </div>
    </motion.div>
  )
}


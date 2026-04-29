import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'rd_read_notification_ids'
const NOTIFICATIONS_KEY = 'rd_volunteer_notifications'

export const DEFAULT_NOTIFICATIONS = [
  {
    id: 'vn_001',
    type: 'urgent',
    title: 'Critical food shortage in Dharavi',
    body: 'Immediate volunteers needed for food distribution at Zone B — Dharavi. Report at 6 PM.',
    time: '1h ago',
    timestamp: Date.now() - 3600000,
    unread: true,
  },
  {
    id: 'vn_002',
    type: 'assignment',
    title: "You've been assigned Task #47",
    body: 'Medical Supply Distribution at Bandra Clinic Zone A. Starts Saturday 9 AM.',
    time: '3h ago',
    timestamp: Date.now() - 10800000,
    unread: true,
  },
  {
    id: 'vn_003',
    type: 'assignment',
    title: 'Task #45 marked Completed',
    body: 'Great work on the Field Survey Follow-up! Your rating has been updated.',
    time: 'Yesterday',
    timestamp: Date.now() - 86400000,
    unread: true,
  },
  {
    id: 'vn_004',
    type: 'system',
    title: 'Profile verified by Admin',
    body: 'Your volunteer profile has been verified. You can now take on Priority tasks.',
    time: '2 days ago',
    timestamp: Date.now() - 172800000,
    unread: false,
  },
  {
    id: 'vn_005',
    type: 'urgent',
    title: 'Flood alert in Kurla West',
    body: 'Medical volunteers urgently required in Kurla West. Contact coordinator immediately.',
    time: '2 days ago',
    timestamp: Date.now() - 180000000,
    unread: false,
  },
  {
    id: 'vn_006',
    type: 'system',
    title: 'New NGO partner added: Goonj Mumbai',
    body: 'Goonj Mumbai is now a partner NGO. Check the Donations tab for new opportunities.',
    time: '3 days ago',
    timestamp: Date.now() - 259200000,
    unread: false,
  },
]

export function useVolunteerNotifications() {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY)
      return stored ? JSON.parse(stored) : DEFAULT_NOTIFICATIONS
    } catch {
      return DEFAULT_NOTIFICATIONS
    }
  })

  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return new Set(stored ? JSON.parse(stored) : [])
    } catch {
      return new Set()
    }
  })

  const items = notifications.map((n) => ({
    ...n,
    unread: n.unread && !readIds.has(n.id),
  }))

  const unreadCount = items.filter((n) => n.unread).length

  const markRead = useCallback((id) => {
    setReadIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      return next
    })
  }, [])

  const markAllRead = useCallback(() => {
    const allIds = notifications.map((n) => n.id)
    const next = new Set(allIds)
    setReadIds(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
  }, [notifications])

  return { notifications: items, unreadCount, markRead, markAllRead }
}

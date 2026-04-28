import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, MapPin, ShieldAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import { mockTasks } from '../../data/mockData.js'

export default function TaskDetailPage() {
  const { taskId } = useParams()
  const nav = useNavigate()
  const task = useMemo(() => mockTasks.find((t) => t.id === taskId), [taskId])
  const [accepted, setAccepted] = useState(false)

  if (!task) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="text-sm font-semibold text-slate-900">Task not found</div>
        <div className="mt-3">
          <Button variant="secondary" onClick={() => nav('/app/tasks')}>
            Back to tasks
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => nav(-1)}
          className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-500">Task detail</div>
          <div className="truncate text-lg font-extrabold tracking-tight text-slate-900">
            {task.title}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {task.urgency === 'urgent' ? (
                <Badge tone="urgent">Urgent</Badge>
              ) : (
                <Badge tone="normal">Normal</Badge>
              )}
              <Badge tone={task.status === 'completed' ? 'success' : 'info'}>
                {task.status === 'completed' ? 'Completed' : 'Open'}
              </Badge>
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900">
              {task.ngo}
            </div>
          </div>
          {task.urgency === 'urgent' ? (
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-50 ring-1 ring-rose-100">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
            </div>
          ) : null}
        </div>

        <div className="mt-3 text-sm leading-6 text-slate-600">
          {task.description}
        </div>

        <div className="mt-4 grid gap-2 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            <div className="min-w-0 truncate">
              {task.location} • {task.distanceKm} km away
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <div className="min-w-0 truncate">{task.timeWindow}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={() => nav('/app/map')}>
          View map
        </Button>
        <Button
          onClick={() => setAccepted((v) => !v)}
          variant={accepted ? 'secondary' : 'primary'}
        >
          {accepted ? 'Accepted' : 'Accept task'}
        </Button>
      </div>
    </motion.div>
  )
}


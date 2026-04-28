import { motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const mockOperations = [
  {
    id: 'op_001',
    title: 'Water Distribution - Ward 3',
    status: 'in-progress',
    priority: 'urgent',
    assignedVolunteers: 5,
    requiredVolunteers: 5,
    location: 'Ward 3 Community Center',
    startTime: '4:00 PM',
    endTime: '6:00 PM',
    progress: 65,
    category: 'Relief',
  },
  {
    id: 'op_002',
    title: 'Medical Camp Setup',
    status: 'pending',
    priority: 'high',
    assignedVolunteers: 2,
    requiredVolunteers: 8,
    location: 'Clinic Zone A',
    startTime: '9:00 AM',
    endTime: '12:00 PM',
    progress: 0,
    category: 'Health',
  },
  {
    id: 'op_003',
    title: 'Food Kit Distribution',
    status: 'completed',
    priority: 'normal',
    assignedVolunteers: 6,
    requiredVolunteers: 6,
    location: 'Central Warehouse',
    startTime: '10:00 AM',
    endTime: '1:00 PM',
    progress: 100,
    category: 'Food',
  },
  {
    id: 'op_004',
    title: 'Survey Data Collection',
    status: 'in-progress',
    priority: 'normal',
    assignedVolunteers: 4,
    requiredVolunteers: 6,
    location: 'Ward 5',
    startTime: '2:00 PM',
    endTime: '5:00 PM',
    progress: 45,
    category: 'Survey',
  },
  {
    id: 'op_005',
    title: 'Emergency Response - Dharavi',
    status: 'pending',
    priority: 'urgent',
    assignedVolunteers: 0,
    requiredVolunteers: 10,
    location: 'Dharavi Zone B',
    startTime: 'ASAP',
    endTime: 'TBD',
    progress: 0,
    category: 'Emergency',
  },
]

const statusConfig = {
  'in-progress': {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-700',
    icon: Clock,
  },
  pending: {
    label: 'Pending',
    color: 'bg-amber-100 text-amber-700',
    icon: AlertCircle,
  },
  completed: {
    label: 'Completed',
    color: 'bg-emerald-100 text-emerald-700',
    icon: CheckCircle,
  },
}

const priorityConfig = {
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700' },
  normal: { label: 'Normal', color: 'bg-slate-100 text-slate-700' },
}

export default function OperationsPage() {
  const stats = {
    total: mockOperations.length,
    inProgress: mockOperations.filter((op) => op.status === 'in-progress').length,
    pending: mockOperations.filter((op) => op.status === 'pending').length,
    completed: mockOperations.filter((op) => op.status === 'completed').length,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <Link
          to="/app/admin"
          className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-slate-700" />
        </Link>
        <div>
          <div className="text-xs font-semibold text-slate-500">
            Admin / Operations
          </div>
          <div className="text-xl font-extrabold tracking-tight text-slate-900">
            All Operations
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
          <div className="text-[11px] font-semibold text-slate-500">
            Total Operations
          </div>
          <div className="mt-1 text-lg font-extrabold">{stats.total}</div>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3 shadow-card">
          <div className="text-[11px] font-semibold text-blue-700">In Progress</div>
          <div className="mt-1 text-lg font-extrabold text-blue-900">
            {stats.inProgress}
          </div>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 shadow-card">
          <div className="text-[11px] font-semibold text-amber-700">Pending</div>
          <div className="mt-1 text-lg font-extrabold text-amber-900">
            {stats.pending}
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 shadow-card">
          <div className="text-[11px] font-semibold text-emerald-700">Completed</div>
          <div className="mt-1 text-lg font-extrabold text-emerald-900">
            {stats.completed}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {mockOperations.map((operation) => {
          const StatusIcon = statusConfig[operation.status].icon
          return (
            <div
              key={operation.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold text-slate-900">
                      {operation.title}
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        statusConfig[operation.status].color
                      }`}
                    >
                      <StatusIcon className="inline h-3 w-3 mr-1" />
                      {statusConfig[operation.status].label}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        priorityConfig[operation.priority].color
                      }`}
                    >
                      {priorityConfig[operation.priority].label}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {operation.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {operation.startTime} - {operation.endTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {operation.assignedVolunteers}/{operation.requiredVolunteers}{' '}
                      volunteers
                    </div>
                  </div>

                  {operation.status !== 'completed' && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] text-slate-600 mb-1">
                        <span>Progress</span>
                        <span className="font-semibold">{operation.progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-brand-600 transition-all"
                          style={{ width: `${operation.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-700">
                    {operation.category}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <TrendingUp className="h-4 w-4 text-brand-600" />
          Operation Health
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div>
            <div className="text-[11px] text-slate-600">Avg Response Time</div>
            <div className="mt-1 text-lg font-bold text-slate-900">2.3h</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-600">Success Rate</div>
            <div className="mt-1 text-lg font-bold text-emerald-600">94%</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-600">Volunteer Utilization</div>
            <div className="mt-1 text-lg font-bold text-blue-600">87%</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

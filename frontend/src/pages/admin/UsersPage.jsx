import { motion } from 'framer-motion'
import { ArrowLeft, Mail, MapPin, Phone, Shield, Star, User } from 'lucide-react'
import { Link } from 'react-router-dom'

const mockUsers = [
  {
    id: 'u_001',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+91 98765 43210',
    role: 'volunteer',
    status: 'online',
    location: 'Mumbai Central',
    skills: ['First Aid', 'Teaching', 'Communication'],
    tasksCompleted: 24,
    rating: 4.9,
    joinedDate: 'Jan 2026',
  },
  {
    id: 'u_002',
    name: 'Raj Patel',
    email: 'raj.patel@email.com',
    phone: '+91 98765 43211',
    role: 'volunteer',
    status: 'online',
    location: 'Andheri West',
    skills: ['Logistics', 'Driving', 'Organization'],
    tasksCompleted: 18,
    rating: 4.7,
    joinedDate: 'Feb 2026',
  },
  {
    id: 'u_003',
    name: 'Priya Sharma',
    email: 'priya.s@email.com',
    phone: '+91 98765 43212',
    role: 'admin',
    status: 'online',
    location: 'Bandra',
    skills: ['Management', 'Planning', 'Coordination'],
    tasksCompleted: 45,
    rating: 5.0,
    joinedDate: 'Dec 2025',
  },
  {
    id: 'u_004',
    name: 'Amit Kumar',
    email: 'amit.k@email.com',
    phone: '+91 98765 43213',
    role: 'volunteer',
    status: 'offline',
    location: 'Dharavi',
    skills: ['Medical', 'First Aid', 'Healthcare'],
    tasksCompleted: 32,
    rating: 4.8,
    joinedDate: 'Jan 2026',
  },
  {
    id: 'u_005',
    name: 'Neha Desai',
    email: 'neha.d@email.com',
    phone: '+91 98765 43214',
    role: 'volunteer',
    status: 'online',
    location: 'Powai',
    skills: ['Teaching', 'Child Care', 'Education'],
    tasksCompleted: 21,
    rating: 4.9,
    joinedDate: 'Mar 2026',
  },
]

export default function UsersPage() {
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
          <div className="text-xs font-semibold text-slate-500">Admin / Users</div>
          <div className="text-xl font-extrabold tracking-tight text-slate-900">
            All Users
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
          <div className="text-[11px] font-semibold text-slate-500">Total Users</div>
          <div className="mt-1 text-lg font-extrabold">{mockUsers.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
          <div className="text-[11px] font-semibold text-slate-500">Online Now</div>
          <div className="mt-1 text-lg font-extrabold">
            {mockUsers.filter((u) => u.status === 'online').length}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
          <div className="text-[11px] font-semibold text-slate-500">Volunteers</div>
          <div className="mt-1 text-lg font-extrabold">
            {mockUsers.filter((u) => u.role === 'volunteer').length}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
          <div className="text-[11px] font-semibold text-slate-500">Admins</div>
          <div className="mt-1 text-lg font-extrabold">
            {mockUsers.filter((u) => u.role === 'admin').length}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {mockUsers.map((user) => (
          <div
            key={user.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-100 ring-2 ring-brand-200">
                  <User className="h-6 w-6 text-brand-800" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold text-slate-900">{user.name}</div>
                    {user.role === 'admin' && (
                      <div className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5">
                        <Shield className="h-3 w-3 text-purple-700" />
                        <span className="text-[10px] font-semibold text-purple-700">
                          Admin
                        </span>
                      </div>
                    )}
                    <div
                      className={`h-2 w-2 rounded-full ${
                        user.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {user.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {user.location}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {user.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {user.rating}
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  {user.tasksCompleted} tasks
                </div>
                <div className="mt-1 text-[10px] text-slate-500">
                  Joined {user.joinedDate}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

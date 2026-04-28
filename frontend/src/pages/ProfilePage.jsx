import { motion } from 'framer-motion'
import {
  Award,
  Clock3,
  LogOut,
  MapPin,
  Settings,
  Shield,
  Star,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import { mockUser } from '../data/mockData.js'

export default function ProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="-mx-4 -mt-4"
    >
      {/* Header */}
      <div className="relative overflow-hidden rounded-b-[28px] bg-gradient-to-b from-indigo-600 to-indigo-500 px-4 pb-6 pt-6 text-white">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -left-10 top-24 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <div className="flex items-start justify-between">
          <div className="text-2xl font-extrabold tracking-tight">Profile</div>
          <button
            type="button"
            className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur hover:bg-white/15"
            aria-label="Settings"
          >
            <Settings className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-5 py-2 text-sm font-semibold text-slate-800 shadow-soft">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Synced
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/90 shadow-soft">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-lg font-extrabold">{mockUser.name}</div>
            <div className="mt-1 text-sm font-semibold text-white/85">
              {mockUser.role}
            </div>
            <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold">
              <Star className="h-4 w-4 text-amber-300" />
              {mockUser.impact.rating} Rating
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/15">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="mt-2 text-center text-lg font-extrabold">
              {mockUser.impact.tasksCompleted}
            </div>
            <div className="text-center text-xs text-white/80">Missions</div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/15">
              <Clock3 className="h-4 w-4" />
            </div>
            <div className="mt-2 text-center text-lg font-extrabold">
              {mockUser.impact.hours}h
            </div>
            <div className="text-center text-xs text-white/80">Hours</div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/15">
              <Award className="h-4 w-4" />
            </div>
            <div className="mt-2 text-center text-lg font-extrabold">
              {mockUser.impact.badges}
            </div>
            <div className="text-center text-xs text-white/80">Badges</div>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 pb-6 pt-5">
        {/* About */}
        <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-slate-200">
          <div className="text-lg font-extrabold text-slate-900">About</div>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              {mockUser.location}
            </div>
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-slate-400" />
              Active since {mockUser.activeSince}
            </div>
          </div>
        </div>

        {/* Specializations */}
        <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-slate-200">
          <div className="text-lg font-extrabold text-slate-900">Specializations</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {mockUser.skills.map((s) => (
              <Badge key={s} tone="neutral" className="rounded-xl px-3 py-2 text-sm font-medium">
                {s}
              </Badge>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-slate-200">
          <div className="text-lg font-extrabold text-slate-900">Achievements</div>
          <div className="mt-4 space-y-3">
            {mockUser.achievements.map((a) => {
              const Icon =
                a.icon === 'medal' ? Award : a.icon === 'trend' ? TrendingUp : Star
              const wrap =
                a.icon === 'medal'
                  ? 'bg-amber-50 ring-amber-100 text-amber-700'
                  : a.icon === 'trend'
                    ? 'bg-emerald-50 ring-emerald-100 text-emerald-700'
                    : 'bg-indigo-50 ring-indigo-100 text-indigo-700'
              return (
                <div key={a.id} className="flex items-start gap-3">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ring-1 ${wrap}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">{a.title}</div>
                    <div className="text-sm text-slate-500">{a.subtitle}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Missions */}
        <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-slate-200">
          <div className="text-lg font-extrabold text-slate-900">Recent Missions</div>
          <div className="mt-4 divide-y divide-slate-200">
            {mockUser.recentMissions.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-4">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">{m.title}</div>
                  <div className="text-sm text-slate-500">{m.date}</div>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < m.rating ? 'fill-amber-400' : 'fill-slate-200 text-slate-200'}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button variant="secondary" size="lg" className="w-full text-rose-600">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </motion.div>
  )
}


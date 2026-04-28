import { motion } from 'framer-motion'
import { Lock, Mail, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'

export default function SignupPage() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="min-h-dvh bg-surface-2 px-5 py-6"
    >
      <div className="mx-auto flex min-h-[calc(100dvh-48px)] max-w-[430px] flex-col">
        <div className="text-2xl font-extrabold tracking-tight text-slate-900">
          Create account
        </div>
        <div className="mt-2 text-sm text-slate-600">
          Mock signup — no backend. We’ll take you into the app UI.
        </div>

        <div className="mt-8 grid gap-3">
          <label className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Full name</div>
            <div className="mt-1 flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              <input
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                placeholder="Garima"
              />
            </div>
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Email</div>
            <div className="mt-1 flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                placeholder="garima@example.com"
              />
            </div>
          </label>
          <label className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Password</div>
            <div className="mt-1 flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-400" />
              <input
                type="password"
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </label>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          By continuing, you agree to our Terms and Privacy Policy.
        </div>

        <div className="mt-auto grid gap-3 pt-8">
          <Button size="lg" className="w-full" onClick={() => navigate('/app')}>
            Create account
          </Button>
          <Link
            to="/auth/login"
            className="text-center text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </motion.div>
  )
}


import { motion } from 'framer-motion'
import { Lock, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'

export default function LoginPage() {
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
          Welcome back
        </div>
        <div className="mt-2 text-sm text-slate-600">
          Sign in to continue. This is frontend-only with mock state.
        </div>

        <div className="mt-8 grid gap-3">
          <label className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Email</div>
            <div className="mt-1 flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                placeholder="you@example.com"
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

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Forgot password?
          </button>
          <Link
            to="/auth/signup"
            className="text-xs font-semibold text-brand-800 hover:text-brand-900"
          >
            Create account
          </Link>
        </div>

        <div className="mt-auto grid gap-3 pt-8">
          <Button size="lg" className="w-full" onClick={() => navigate('/app')}>
            Sign in
          </Button>
          <Button
            size="lg"
            className="w-full"
            variant="secondary"
            onClick={() => navigate('/app/admin')}
          >
            Continue as Admin
          </Button>
        </div>
      </div>
    </motion.div>
  )
}


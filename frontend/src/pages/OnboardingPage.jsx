import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'

export default function OnboardingPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="min-h-dvh bg-surface-2 px-5 py-6"
    >
      <div className="mx-auto flex min-h-[calc(100dvh-48px)] max-w-[430px] flex-col">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
            <Sparkles className="h-4 w-4 text-brand-700" />
            Smart Resource Allocation
          </div>
          <Link
            to="/app"
            className="rounded-full px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Skip
          </Link>
        </div>

        <div className="mt-10">
          <div className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900">
            Data-driven volunteer coordination for real impact.
          </div>
          <div className="mt-4 text-sm leading-6 text-slate-600">
            NGOs and local groups collect valuable information via surveys and
            field reports — but the data is scattered. This app surfaces urgent
            needs clearly and matches volunteers to the right tasks, fast.
          </div>
        </div>

        <div className="mt-8 grid gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="text-sm font-semibold text-slate-900">
              Highlights urgent tasks
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Red badges for urgent needs, green for completed.
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="text-sm font-semibold text-slate-900">
              Quick volunteer matching
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Filter by category, distance, and urgency — UI-only in this demo.
            </div>
          </div>
        </div>

        <div className="mt-auto grid gap-3 pt-8">
          <Link to="/auth/login">
            <Button className="w-full" size="lg">
              Continue to login <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/app">
            <Button className="w-full" size="lg" variant="secondary">
              Explore prototype
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}


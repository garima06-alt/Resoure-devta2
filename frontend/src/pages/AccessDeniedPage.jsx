import { motion } from 'framer-motion'
import { ShieldX } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ background: '#f0f4f8' }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md rounded-3xl p-8 bg-white text-center"
        style={{ border: '1px solid #fecdd3', boxShadow: '0 8px 32px rgba(244,63,94,0.10)' }}
      >
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-5"
          style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
          <ShieldX className="h-8 w-8 animate-pulse" style={{ color: '#f43f5e' }} />
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight mb-2" style={{ color: '#f43f5e' }}>
          Access Denied
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#f43f5e' }}>
          Unauthorized Access Attempt Logged
        </p>
        <p className="text-sm text-muted leading-relaxed mb-7">
          You do not have the required permissions to access this area.
          This incident has been flagged for security review.
        </p>

        <Link to="/app/intelligence"
          className="inline-flex w-full items-center justify-center rounded-xl py-3 text-sm font-bold text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #6c3fc5, #8b5cf6)' }}>
          Return to Home
        </Link>
      </motion.div>
    </div>
  )
}

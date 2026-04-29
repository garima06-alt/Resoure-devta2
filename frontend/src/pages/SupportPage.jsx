import { useState } from 'react'
import { motion } from 'framer-motion'
import { HelpCircle, Send, MessageSquarePlus } from 'lucide-react'

export default function SupportPage() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('http://localhost:5000/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          message
        })
      })
      if (res.ok) {
        setSubject('')
        setMessage('')
        setSuccess(true)
        setTimeout(() => setSuccess(false), 4000)
      }
    } catch (err) {
      console.error('Failed to submit support ticket', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6 max-w-xl mx-auto p-4 font-sans text-slate-100"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900/40 via-slate-900 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-teal-500/20 blur-3xl rounded-full" />
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/30">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Help & Support</h1>
            <p className="text-xs text-teal-400 font-bold uppercase tracking-widest mt-0.5">Assistance Control</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl relative">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquarePlus className="h-5 w-5 text-teal-400" />
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">File Support Ticket</h2>
        </div>

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold text-center uppercase tracking-wider animate-pulse">
            Ticket submitted successfully. An agent will respond.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition"
              placeholder="E.g. App crashing on map view"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows="4"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition"
              placeholder="Give detailed description..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 py-3 text-sm font-bold text-white shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
          >
            <Send className="h-4 w-4" />
            {submitting ? 'Transmitting...' : 'Submit Ticket'}
          </button>
        </form>
      </div>
    </motion.div>
  )
}

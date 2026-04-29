import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, History, Send, ShieldPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function RequestsPage() {
  const { currentUser } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('moderate')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchRequests = async () => {
    if (!currentUser) return
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/api/requests/user/${currentUser.uid}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setRequests(data)
      }
    } catch (err) {
      console.error('Failed to fetch requests', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [currentUser])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.uid || 'anonymous',
          email: currentUser?.email || 'unknown',
          title,
          description,
          priority
        })
      })
      if (res.ok) {
        setTitle('')
        setDescription('')
        fetchRequests()
      }
    } catch (err) {
      console.error('Failed to submit request', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6 max-w-4xl mx-auto p-4 font-sans text-slate-100"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/20 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full" />
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/30">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Request Management</h1>
            <p className="text-xs text-purple-400 font-bold uppercase tracking-widest mt-0.5">Secure Aid Allocations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Submission Form */}
        <div className="md:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <ShieldPlus className="h-5 w-5 text-purple-400" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">File Aid Request</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Request Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
                placeholder="E.g. Food Supply for Sector 4"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="3"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
                placeholder="Specify the exact need..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 focus:border-purple-500 focus:outline-none cursor-pointer font-medium"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-2.5 text-sm font-bold text-white shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Submitting...' : 'File Request'}
            </button>
          </form>
        </div>

        {/* Status Tracker */}
        <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <History className="h-5 w-5 text-purple-400" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Your Aid Trackers</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48 text-xs text-slate-500 font-bold uppercase tracking-wider animate-pulse">
              Loading Statuses...
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-48 border border-dashed border-slate-800 rounded-xl text-slate-600 p-4">
              <ClipboardList className="h-8 w-8 mb-2 stroke-1" />
              <div className="text-xs font-semibold">No aid requests logged yet.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 flex justify-between items-center hover:border-slate-700 transition">
                  <div>
                    <div className="text-sm font-bold text-slate-100">{req.title}</div>
                    <div className="text-xs text-slate-400 mt-1 max-w-md">{req.description}</div>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        req.priority === 'critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                        req.priority === 'high' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        req.priority === 'moderate' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' :
                        'bg-slate-500/10 text-slate-400 border border-slate-700'
                      }`}>
                        {req.priority}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded-full border ${
                      req.status === 'approved' ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' :
                      req.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {req.status}
                    </span>
                    <div className="text-[10px] text-slate-600 mt-2 font-mono">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

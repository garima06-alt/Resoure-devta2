import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ServerCrash, AlertOctagon, Terminal, RefreshCw, Clock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AdminElement from '../../components/AdminElement'

export default function SystemDiagnosticsPage() {
  const { currentUser, userRole } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  const fetchLogs = async () => {
    if (!currentUser) return
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/admin/diagnostics/logs', {
        headers: {
          'x-user-id': currentUser.uid,
          'x-user-email': currentUser.email,
          'x-user-role': userRole
        }
      })
      if (res.status === 403) {
        window.location.href = '/access-denied'
        return
      }
      const data = await res.json()
      if (Array.isArray(data)) {
        setLogs(data.reverse()) // newest first
      }
    } catch (err) {
      console.error('Failed to fetch diagnostics logs', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [currentUser])

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true
    return log.type === filter
  })

  return (
    <AdminElement>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="space-y-6 max-w-5xl mx-auto p-4 font-sans text-slate-100"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-900/40 via-slate-900 to-slate-900 border border-red-500/30 p-6 shadow-xl ring-1 ring-red-500/20">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-red-500/20 blur-3xl rounded-full" />
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/30">
              <ServerCrash className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">System Diagnostics</h1>
              <p className="text-xs text-red-400 font-bold uppercase tracking-widest mt-0.5">Artemyth Technical Logs</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-red-400" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Diagnostic Command Line</h2>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all">All Logs</option>
                <option value="timeout">Request Timed Out</option>
                <option value="unauthorized_access">Access Denied</option>
              </select>

              <button
                onClick={fetchLogs}
                className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition cursor-pointer text-slate-300"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48 text-xs text-slate-500 font-bold uppercase tracking-wider animate-pulse">
              Querying Server Logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-48 border border-dashed border-slate-800 rounded-xl text-slate-600 p-4">
              <AlertOctagon className="h-8 w-8 mb-2 stroke-1" />
              <div className="text-xs font-semibold">Clean stack. No anomalies detected.</div>
            </div>
          ) : (
            <div className="space-y-3 font-mono text-[11px] leading-relaxed">
              {filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  className={`p-3 rounded-xl border flex items-start gap-3 bg-slate-950/60 ${
                    log.type === 'timeout' 
                      ? 'border-amber-500/20 hover:border-amber-500/40' 
                      : 'border-red-500/20 hover:border-red-500/40'
                  }`}
                >
                  <Clock className={`h-4 w-4 mt-0.5 shrink-0 ${
                    log.type === 'timeout' ? 'text-amber-400' : 'text-red-400'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold uppercase tracking-wider ${
                        log.type === 'timeout' ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {log.type === 'timeout' ? '[ TIMEOUT EXCEPTION ]' : '[ ACCESS DENIED ]'}
                      </span>
                      <span className="text-slate-600 text-[10px]">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-slate-300 mt-1">{log.details}</div>
                    {(log.userId && log.userId !== 'unknown') && (
                      <div className="text-slate-500 mt-1">
                        Node Identity: <span className="text-slate-400">{log.email}</span> ({log.userId})
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AdminElement>
  )
}

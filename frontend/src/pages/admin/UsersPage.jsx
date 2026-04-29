import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Shield, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AdminElement from '../../components/AdminElement'

export default function UsersPage() {
  const { currentUser, userRole } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    if (!currentUser) return
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
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
        setUsers(data)
      }
    } catch (err) {
      console.error('Failed to fetch users', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentUser])

  return (
    <AdminElement>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="space-y-6 max-w-4xl mx-auto p-4 font-sans text-slate-100"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-800 p-6 shadow-xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">User Directory</h1>
              <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest mt-0.5">Deployment Operations</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          {loading ? (
            <div className="flex justify-center items-center h-48 text-xs text-slate-500 font-bold uppercase tracking-wider animate-pulse">
              Syncing Directory...
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-48 border border-dashed border-slate-800 rounded-xl text-slate-600 p-4">
              <User className="h-8 w-8 mb-2 stroke-1" />
              <div className="text-xs font-semibold">No nodes registered.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div 
                  key={user.id} 
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 flex justify-between items-center hover:border-indigo-500/30 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-100">{user.email}</span>
                        {user.role === 'admin' && (
                          <span className="flex items-center gap-1 rounded bg-rose-500/10 border border-rose-500/30 px-1.5 py-0.5 text-[9px] font-extrabold text-rose-400 uppercase">
                            <Shield className="h-2.5 w-2.5" />
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono text-slate-500 mt-0.5 flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        ID: {user.id}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                    user.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                  }`}>
                    {user.role === 'admin' ? 'NGO Coordinator' : 'Volunteer'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AdminElement>
  )
}


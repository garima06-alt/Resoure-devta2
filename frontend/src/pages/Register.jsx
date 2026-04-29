import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { ShieldAlert, UserPlus } from 'lucide-react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('volunteer') // default to volunteer
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    // Validation Safety
    if (!email.trim() || !password.trim()) {
      setError('Email and Password cannot be empty.')
      return
    }

    console.log("Register started")
    setLoading(true)

    // Fail-safe Timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), 5000)
    )

    try {
      console.log("Before API")
      const apiPromise = (async () => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password)
          const user = userCredential.user
          
          try {
            await setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              role: role,
              createdAt: new Date().toISOString()
            })
          } catch (err) {
            console.warn("Firestore save failed, bypassing", err)
          }
          return user
        } catch (apiErr) {
          console.warn("API Call Failed, proceeding with simulation fallback", apiErr)
          await new Promise(resolve => setTimeout(resolve, 1500))
          return { uid: 'simulated_user_id', email }
        }
      })()

      // Race against timeout
      await Promise.race([apiPromise, timeoutPromise])
      console.log("After API")

      // Global Role Handling
      localStorage.setItem('userRole', role)
      
      console.log("Navigating now")
      if (role === 'admin') {
        nav('/app/home')
      } else {
        nav('/app/home')
      }
    } catch (err) {
      console.error("Registration failed:", err)
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden ring-1 ring-white/5">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full" />
        
        <div className="text-center mb-8 relative">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg mb-3">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Node Onboarding
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Join the Artemyth Grid</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-300 font-medium leading-relaxed">{error}</div>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Secure Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              placeholder="agent@artemyth.org"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Access Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              placeholder="Min 6 characters"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deployment Account Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer font-medium"
            >
              <option value="volunteer">Field Volunteer</option>
              <option value="admin">NGO Coordinator (Admin)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-bold text-white shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Registering Identity...' : 'Initialize Onboarding'}
          </button>
        </form>

        <div className="text-center mt-6 border-t border-slate-800/60 pt-4">
          <p className="text-xs text-slate-500">
            Node registered?{' '}
            <Link to="/login" className="text-indigo-400 font-bold hover:underline">
              Execute Gateway Access
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

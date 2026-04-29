import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { AlertCircle, Users, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [selectedRole, setSelectedRole] = useState('volunteer')
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)
  const nav = useNavigate()
  const { setRole } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)

      let role = selectedRole
      try {
        const snap = await Promise.race([
          getDoc(doc(db, 'users', user.uid)),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 2000)),
        ])
        if (snap.exists && snap.exists() && snap.data().role) {
          role = snap.data().role
        } else {
          await setDoc(doc(db, 'users', user.uid), { email: user.email, role }, { merge: true }).catch(() => {})
        }
      } catch { /* offline — use selected role */ }

      setRole(role)
      nav(role === 'admin' ? '/admin/dashboard' : '/app/intelligence')
    } catch (err) {
      setError(err.message || 'Failed to authenticate')
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = selectedRole === 'admin'

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ background: '#f0f4f8' }}>

      <div
        className="w-full max-w-md rounded-3xl p-8 bg-white"
        style={{ border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
      >
        {/* App branding */}
        <div className="text-center mb-7">
          <div
            className="inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-3"
            style={{ background: 'linear-gradient(135deg, #6c3fc5, #8b5cf6)' }}
          >
            <span className="text-2xl">🛡️</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Resource Devta</h1>
          <p className="text-xs mt-1 text-muted uppercase tracking-widest font-semibold">
            Smart Resource Allocation Platform
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-5 rounded-2xl p-4 flex items-start gap-3"
            style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}
          >
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-coral" style={{ color: '#f43f5e' }} />
            <div className="text-xs text-coral leading-relaxed" style={{ color: '#be123c' }}>{error}</div>
          </div>
        )}

        {/* Role selector */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">Login As</label>
          <div className="grid grid-cols-2 gap-3">
            {/* Volunteer pill */}
            <button
              type="button"
              onClick={() => setSelectedRole('volunteer')}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl py-4 px-3 transition-all font-bold text-sm"
              style={{
                background: selectedRole === 'volunteer' ? '#f5f3ff' : '#f8fafc',
                border:     selectedRole === 'volunteer' ? '2px solid #6c3fc5' : '1.5px solid #e2e8f0',
                color:      selectedRole === 'volunteer' ? '#6c3fc5' : '#94a3b8',
              }}
            >
              <Users className="h-6 w-6" />
              Volunteer
            </button>
            {/* Admin pill */}
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl py-4 px-3 transition-all font-bold text-sm"
              style={{
                background: selectedRole === 'admin' ? '#fffbeb' : '#f8fafc',
                border:     selectedRole === 'admin' ? '2px solid #d97706' : '1.5px solid #e2e8f0',
                color:      selectedRole === 'admin' ? '#b45309' : '#94a3b8',
              }}
            >
              <Shield className="h-6 w-6" />
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {[
            { label: 'Email',    type: 'email',    value: email,    setter: setEmail,    placeholder: 'you@example.org' },
            { label: 'Password', type: 'password', value: password, setter: setPassword, placeholder: '••••••••' },
          ].map(({ label, type, value, setter, placeholder }) => (
            <div key={label}>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                required
                placeholder={placeholder}
                className="w-full rounded-xl px-4 py-3 text-sm text-ink transition focus:outline-none"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                onFocus={(e) => { e.target.style.borderColor = isAdmin ? '#d97706' : '#6c3fc5' }}
                onBlur={(e)  => { e.target.style.borderColor = '#e2e8f0' }}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3.5 text-sm font-bold text-white mt-1 transition disabled:opacity-50"
            style={{
              background: isAdmin
                ? 'linear-gradient(135deg, #d97706, #f59e0b)'
                : 'linear-gradient(135deg, #6c3fc5, #8b5cf6)',
            }}
          >
            {loading ? 'Signing in…' : `Login as ${isAdmin ? 'Admin' : 'Volunteer'}`}
          </button>
        </form>

        <div className="text-center mt-5 pt-4" style={{ borderTop: '1px solid #e2e8f0' }}>
          <p className="text-xs text-muted">
            New here?{' '}
            <Link to="/register" className="font-bold hover:underline" style={{ color: '#6c3fc5' }}>
              Request Access
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

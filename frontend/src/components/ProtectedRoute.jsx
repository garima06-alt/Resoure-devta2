import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser, userRole, loading } = useAuth()

  useEffect(() => {
    if (!loading && currentUser && adminOnly && userRole !== 'admin') {
      fetch('http://localhost:5000/api/logs/unauthorized', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.uid,
          email: currentUser.email,
          details: `Client-side Route Protection: Role ${userRole} attempted to access adminOnly route`
        })
      }).catch(err => console.error("Failed to log unauthorized access", err))
    }
  }, [loading, currentUser, adminOnly, userRole])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white font-sans">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-400 border-t-indigo-600 mb-4" />
          <div className="text-sm font-bold tracking-wider animate-pulse uppercase">Verifying Clearances...</div>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/access-denied" replace />
  }

  return children
}


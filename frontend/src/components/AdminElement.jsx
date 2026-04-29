import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminElement({ children }) {
  const { currentUser, userRole } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (userRole && userRole !== 'admin') {
      // Log unauthorized attempt
      fetch('http://localhost:5000/api/logs/unauthorized', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.uid || 'anonymous',
          email: currentUser?.email || 'unknown',
          details: `Client-side: Common Folk accessed Admin UI element at ${window.location.pathname}`
        })
      }).catch(err => console.error("Failed to log unauthorized access", err))
      
      // Trigger Access Denied redirect
      navigate('/access-denied')
    }
  }, [userRole, currentUser, navigate])

  if (userRole === 'admin') {
    return <>{children}</>
  }

  return null
}

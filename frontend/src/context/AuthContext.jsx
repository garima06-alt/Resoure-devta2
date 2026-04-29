import { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'

const AuthContext = createContext()

// ── Helper: ensure a Firestore profile exists for this user ──────────────────
async function ensureUserProfile(firebaseUser) {
  const ref = doc(db, 'users', firebaseUser.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    // First login — create the profile document
    const defaultProfile = {
      uid:             firebaseUser.uid,
      name:            firebaseUser.displayName || firebaseUser.email.split('@')[0],
      email:           firebaseUser.email,
      role:            'volunteer',   // promote to admin manually in Firestore console
      profession:      'Volunteer',
      location:        'Mumbai',
      specializations: [],
      joinedAt:        Timestamp.now(),
      stats: {
        missions:        0,
        hoursLogged:     0,
        badges:          0,
        streak:          0,
        tasksAssigned:   0,
        tasksCompleted:  0,
      },
      recentMissions: [],
      rating: 0,
    }
    await setDoc(ref, defaultProfile)
    return defaultProfile
  }

  return snap.data()
}

// ── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser]   = useState(null)
  const [userRole, setUserRole]         = useState(null)
  const [userProfile, setUserProfile]   = useState(null)
  const [loading, setLoading]           = useState(true)
  // Dev-mode override: locally swap role without changing Firestore
  const [devRoleOverride, setDevRoleOverride] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser)
        try {
          // Race Firestore against 3-second timeout to avoid hangs
          const profilePromise = ensureUserProfile(firebaseUser)
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Firestore timeout')), 3000)
          )
          const profile = await Promise.race([profilePromise, timeoutPromise])

          const role = profile.role || 'volunteer'
          setUserRole(role)
          setUserProfile(profile)
          localStorage.setItem('userRole', role)
        } catch (err) {
          console.warn('Firestore unavailable, falling back to localStorage:', err.message)
          const localRole = localStorage.getItem('userRole') || 'volunteer'
          setUserRole(localRole)
          // Build a minimal profile from Firebase Auth data
          setUserProfile({
            uid:   firebaseUser.uid,
            name:  firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Volunteer',
            email: firebaseUser.email,
            role:  localRole,
            profession: 'Volunteer',
            location: 'Mumbai',
            specializations: [],
            stats: { missions: 0, hoursLogged: 0, badges: 0, streak: 0, tasksAssigned: 0, tasksCompleted: 0 },
            recentMissions: [],
            rating: 0,
          })
        }
      } else {
        setCurrentUser(null)
        setUserRole(null)
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Called from Login page (preserves manual role selection for dev testing)
  function setRole(role) {
    localStorage.setItem('userRole', role)
    setUserRole(role)
  }

  async function logout() {
    try { await signOut(auth) } catch (err) { console.error('Logout error:', err) }
    localStorage.removeItem('userRole')
    setCurrentUser(null)
    setUserRole(null)
    setUserProfile(null)
    setDevRoleOverride(null)
  }

  // The role actually used by the app — dev override wins over Firestore role
  const effectiveRole = devRoleOverride || userRole

  const value = {
    // Aliases so consumers can use either naming convention
    currentUser,
    user: currentUser,
    userRole: effectiveRole,
    role: effectiveRole,
    userProfile,
    loading,
    setRole,
    logout,
    // Dev-mode role switcher
    devRoleOverride,
    setDevRoleOverride,
  }

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div
          style={{ background: '#f0f4f8' }}
          className="flex h-screen items-center justify-center font-sans"
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
              style={{ borderColor: '#6c3fc5', borderTopColor: 'transparent' }}
            />
            <div
              className="text-sm font-bold tracking-widest uppercase"
              style={{ color: '#64748b' }}
            >
              Authenticating...
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

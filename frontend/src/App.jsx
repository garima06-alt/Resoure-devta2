import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

// Layouts
import VolunteerLayout from './components/VolunteerLayout.jsx'
import AdminLayout     from './components/AdminLayout.jsx'

// Auth / misc pages
import Login           from './pages/Login.jsx'
import Register        from './pages/Register.jsx'
import OnboardingPage  from './pages/OnboardingPage.jsx'
import AccessDeniedPage from './pages/AccessDeniedPage.jsx'

// Volunteer pages
import IntelligenceDashboardPage from './pages/volunteer/IntelligenceDashboardPage.jsx'
import MapPage         from './pages/MapPage.jsx'
import DonationsPage   from './pages/DonationsPage.jsx'
import ProfilePage     from './pages/ProfilePage.jsx'
import StatsPage       from './pages/volunteer/StatsPage.jsx'
import VolunteerNotificationsPage from './pages/volunteer/NotificationsPage.jsx'

// Admin pages
import AdminDashboard     from './pages/admin/DashboardPage.jsx'
import AdminTasksPage     from './pages/admin/TasksPage.jsx'
import AdminVolunteersPage from './pages/admin/VolunteersPage.jsx'
import AdminResourcesPage from './pages/admin/ResourcesPage.jsx'
import AdminSettingsPage  from './pages/admin/SettingsPage.jsx'

// ── Route Guards ─────────────────────────────────────────────────────────────

function VolunteerRoute({ children }) {
  const { currentUser, userRole, loading } = useAuth()
  if (loading) return null
  if (!currentUser) return <Navigate to="/login" replace />
  if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />
  return children
}

function AdminRoute({ children }) {
  const { currentUser, userRole, loading } = useAuth()
  if (loading) return null
  if (!currentUser) return <Navigate to="/login" replace />
  if (userRole !== 'admin') return <Navigate to="/app/intelligence" replace />
  return children
}

function RootRedirect() {
  const { currentUser, userRole, loading } = useAuth()
  if (loading) return null
  if (!currentUser) return <Navigate to="/login" replace />
  return userRole === 'admin'
    ? <Navigate to="/admin/dashboard" replace />
    : <Navigate to="/app/intelligence" replace />
}

// ── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <Routes>
          {/* Public */}
          <Route path="/"              element={<OnboardingPage />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />

          {/* Smart redirect at /app */}
          <Route path="/app" element={<RootRedirect />} />

          {/* ── VOLUNTEER ── */}
          <Route
            element={
              <VolunteerRoute>
                <VolunteerLayout />
              </VolunteerRoute>
            }
          >
            {/* Home screen = Intelligence Dashboard */}
            <Route path="/app/intelligence"  element={<IntelligenceDashboardPage />} />
            <Route path="/app/analytics"     element={<StatsPage />} />
            <Route path="/app/map"           element={<MapPage />} />
            <Route path="/app/notifications" element={<VolunteerNotificationsPage />} />
            <Route path="/app/profile"       element={<ProfilePage />} />

            {/* Donations still accessible via link (not in bottom nav) */}
            <Route path="/app/donations"     element={<DonationsPage />} />
          </Route>

          {/* ── ADMIN ── */}
          <Route
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="/admin/dashboard"  element={<AdminDashboard />} />
            <Route path="/admin/tasks"      element={<AdminTasksPage />} />
            <Route path="/admin/volunteers" element={<AdminVolunteersPage />} />
            <Route path="/admin/resources"  element={<AdminResourcesPage />} />
            <Route path="/admin/settings"   element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

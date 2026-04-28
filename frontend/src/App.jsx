import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import SignupPage from './pages/auth/SignupPage.jsx'
import HomePage from './pages/HomePage.jsx'
import TaskListPage from './pages/tasks/TaskListPage.jsx'
import TaskDetailPage from './pages/tasks/TaskDetailPage.jsx'
import MapPage from './pages/MapPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import UsersPage from './pages/admin/UsersPage.jsx'
import OperationsPage from './pages/admin/OperationsPage.jsx'

export default function App() {
  const location = useLocation()

  return (
    <div className="app-shell">
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<OnboardingPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />

          <Route element={<AppLayout />}>
            <Route path="/app" element={<HomePage />} />
            <Route path="/app/analytics" element={<AnalyticsPage />} />
            <Route path="/app/tasks" element={<TaskListPage />} />
            <Route path="/app/tasks/:taskId" element={<TaskDetailPage />} />
            <Route path="/app/map" element={<MapPage />} />
            <Route path="/app/notifications" element={<NotificationsPage />} />
            <Route path="/app/profile" element={<ProfilePage />} />
            <Route path="/app/admin" element={<AdminDashboardPage />} />
            <Route path="/app/admin/users" element={<UsersPage />} />
            <Route path="/app/admin/operations" element={<OperationsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

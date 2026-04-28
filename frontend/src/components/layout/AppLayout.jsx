import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import BottomTabs from '../navigation/BottomTabs.jsx'

export default function AppLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-dvh flex-col">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="flex-1 px-4 pb-24 pt-4"
      >
        <Outlet />
      </motion.main>
      <BottomTabs showAdmin={true} />
    </div>
  )
}


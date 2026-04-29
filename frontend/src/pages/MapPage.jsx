import { motion } from 'framer-motion'
import { LocateFixed, MapPinned } from 'lucide-react'
import { useMemo } from 'react'
import Button from '../components/ui/Button.jsx'
import IntelligenceMap from '../components/IntelligenceMap.jsx'
import useGeolocation from '../hooks/useGeolocation.js'
import { mockTasks } from '../data/mockData.js'

export default function MapPage() {
  const { coords, status, error, requestOnce } = useGeolocation({
    enableHighAccuracy: true,
  })

  const tasksWithGeo = useMemo(
    () => mockTasks.filter((t) => t.geo?.lat && t.geo?.lng),
    [],
  )

  function recenter() {
    requestOnce()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="space-y-4"
    >
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-500">Map</div>
          <div className="text-xl font-extrabold tracking-tight text-slate-900">
            Nearby tasks
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {coords
              ? `Your location: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)} (±${coords.accuracyM}m)`
              : status === 'watching'
                  ? 'Getting location…'
                  : 'Location not available yet'}
          </div>
          {error ? (
            <div className="mt-1 text-xs font-semibold text-rose-600">{error}</div>
          ) : null}
        </div>
        <Button variant="secondary" size="sm" onClick={recenter}>
          <LocateFixed className="h-4 w-4" />
          Enable location
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-2xl bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <MapPinned className="h-4 w-4 text-brand-800" />
          Interactive map (Google Maps) • Real-time
        </div>
        <div className="p-3">
          <IntelligenceMap userCoords={coords} />
        </div>
        <div className="border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
          Markers: <span className="font-semibold text-rose-600">red</span> critical urgency,
          <span className="ml-1 font-semibold text-teal-600">teal</span> moderate urgency.
        </div>
      </div>
    </motion.div>
  )
}


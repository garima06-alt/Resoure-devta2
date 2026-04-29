import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Map, MapPin, ListFilter, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AdminElement from '../../components/AdminElement'
import IntelligenceMap from '../../components/IntelligenceMap'

export default function AdminMapPage() {
  const { currentUser, userRole } = useAuth()
  const [pins, setPins] = useState([])
  const [title, setTitle] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [urgency, setUrgency] = useState('moderate')
  const [loading, setLoading] = useState(false)

  const fetchPins = async () => {
    if (!currentUser) return
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/admin/map/pins', {
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
        setPins(data)
      }
    } catch (err) {
      console.error('Failed to fetch pins', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPins()
  }, [currentUser])

  const handleAddPin = async (e) => {
    e.preventDefault()
    if (!title.trim() || !lat || !lng) return
    try {
      const res = await fetch('http://localhost:5000/api/admin/map/pins', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': currentUser.uid,
          'x-user-email': currentUser.email,
          'x-user-role': userRole
        },
        body: JSON.stringify({
          title,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          urgency
        })
      })
      if (res.status === 403) {
        window.location.href = '/access-denied'
        return
      }
      if (res.ok) {
        setTitle('')
        setLat('')
        setLng('')
        fetchPins()
      }
    } catch (err) {
      console.error('Failed to add pin', err)
    }
  }

  return (
    <AdminElement>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="space-y-6 max-w-6xl mx-auto p-4 font-sans text-slate-100"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-900/40 via-slate-900 to-slate-900 border border-rose-500/30 p-6 shadow-xl ring-1 ring-rose-500/20">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-rose-500/20 blur-3xl rounded-full" />
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/30">
              <Map className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Map Management</h1>
              <p className="text-xs text-rose-400 font-bold uppercase tracking-widest mt-0.5">NGO Command Center</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Pin Form */}
          <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="h-5 w-5 text-rose-400" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Create Location Pin</h2>
            </div>
            
            <form onSubmit={handleAddPin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pin Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition"
                  placeholder="Need identified"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Lat</label>
                  <input
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition"
                    placeholder="19.076"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Lng</label>
                  <input
                    type="number"
                    step="any"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition"
                    placeholder="72.877"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Urgency</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 focus:border-rose-500 focus:outline-none cursor-pointer font-semibold"
                >
                  <option value="moderate">Moderate</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-red-600 py-2.5 text-sm font-bold text-white shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <MapPin className="h-4 w-4" />
                Deploy Pin
              </button>
            </form>
          </div>

          {/* Heatmap/Map Visualizer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ListFilter className="h-5 w-5 text-rose-400" />
                  <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Demand Heatmap</h2>
                </div>
                <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-extrabold uppercase animate-pulse">Live</span>
              </div>
              <IntelligenceMap />
            </div>
          </div>
        </div>
      </motion.div>
    </AdminElement>
  )
}

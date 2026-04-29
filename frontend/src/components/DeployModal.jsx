import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function DeployModal({ isOpen, onClose, crisis, onConfirm }) {
  const [loadingStep, setLoadingStep] = useState(0)
  const [selectedVolunteer, setSelectedVolunteer] = useState(null)

  const loadingTexts = [
    "Analyzing crisis requirements...",
    "Scanning volunteer database for proximity and skills...",
    "Calculating optimal match scores..."
  ]

  useEffect(() => {
    if (!isOpen) {
      setLoadingStep(0)
      setSelectedVolunteer(null)
      return
    }

    // 2-second total loading state with progressive text updates
    // 0 -> 1 -> 2 -> done
    const timer1 = setTimeout(() => setLoadingStep(1), 666)
    const timer2 = setTimeout(() => setLoadingStep(2), 1333)
    const timer3 = setTimeout(() => setLoadingStep(3), 2000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [isOpen])

  if (!isOpen || !crisis) return null

  // Generate mock matched volunteers based on the crisis
  const getVolunteers = () => {
    const title = crisis.title.toLowerCase()
    if (title.includes('medical')) {
      return [
        { id: 'v_01', name: 'Priya Sharma', score: 98, role: 'Medic', distance: 1.2, skill: 'First Aid', badge: "98% Match: Specialized in 'First Aid' and located 1.2km away in Bandra." },
        { id: 'v_02', name: 'Dr. Rohan Mehta', score: 92, role: 'Physician', distance: 2.5, skill: 'Healthcare', badge: "92% Match: Specialized in 'Healthcare' and located 2.5km away." },
        { id: 'v_03', name: 'Sarah Johnson', score: 85, role: 'Field Lead', distance: 4.0, skill: 'First Aid', badge: "85% Match: Specialized in 'First Aid' and located 4.0km away." }
      ]
    } else if (title.includes('water')) {
      return [
        { id: 'v_04', name: 'Rajesh Kumar', score: 95, role: 'Logistics', distance: 0.8, skill: 'Supply Chain', badge: "95% Match: Specialized in 'Logistics' and located 0.8km away in Dharavi." },
        { id: 'v_05', name: 'Amit Patel', score: 88, role: 'Volunteer', distance: 2.1, skill: 'Physical Labor', badge: "88% Match: Specialized in 'Physical Labor' and located 2.1km away." },
        { id: 'v_03', name: 'Sarah Johnson', score: 82, role: 'Field Lead', distance: 3.5, skill: 'Organization', badge: "82% Match: Specialized in 'Organization' and located 3.5km away." }
      ]
    } else {
      return [
        { id: 'v_06', name: 'Neha Gupta', score: 96, role: 'Coordinator', distance: 1.0, skill: 'Cooking', badge: "96% Match: Specialized in 'Cooking' and located 1.0km away in Andheri." },
        { id: 'v_05', name: 'Amit Patel', score: 89, role: 'Volunteer', distance: 1.5, skill: 'Physical Labor', badge: "89% Match: Specialized in 'Physical Labor' and located 1.5km away." },
        { id: 'v_03', name: 'Sarah Johnson', score: 84, role: 'Field Lead', distance: 3.0, skill: 'Communication', badge: "84% Match: Specialized in 'Communication' and located 3.0km away." }
      ]
    }
  }

  const volunteers = getVolunteers()

  const handleConfirm = () => {
    if (!selectedVolunteer) return
    onConfirm(crisis.id, selectedVolunteer)
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl relative overflow-hidden ring-1 ring-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">Smart Match Deployment</div>
              <div className="text-lg font-extrabold text-slate-900 mt-0.5 truncate max-w-[280px]">
                {crisis.title}
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* AI Processing State */}
          {loadingStep < 3 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="relative flex items-center justify-center h-16 w-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                <Sparkles className="h-6 w-6 text-indigo-600 animate-pulse" />
              </div>
              <div className="text-sm font-bold text-slate-800 transition-all duration-300">
                {loadingTexts[loadingStep]}
              </div>
              <div className="mt-2 text-xs text-slate-400">Artemyth AI Engine</div>
            </div>
          ) : (
            /* Smart Matches List */
            <div className="mt-4 space-y-4">
              <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600 fill-indigo-100 animate-pulse" />
                Top 3 Recommended Matches
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {volunteers.map((vol) => (
                  <div
                    key={vol.id}
                    onClick={() => setSelectedVolunteer(vol)}
                    className={`rounded-2xl p-3 cursor-pointer border transition-all ${
                      selectedVolunteer?.id === vol.id
                        ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-extrabold text-sm">
                          {vol.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{vol.name}</div>
                          <div className="text-xs font-medium text-slate-500">{vol.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-indigo-600">{vol.score}% Match</div>
                        <div className="text-[10px] font-semibold text-slate-400 mt-0.5">{vol.distance} km away</div>
                      </div>
                    </div>

                    {/* AI Insight Badge */}
                    <div className={`mt-2.5 rounded-xl p-2 text-[11px] font-medium flex items-start gap-1.5 ${
                      selectedVolunteer?.id === vol.id ? 'bg-indigo-100/80 text-indigo-900' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <ShieldCheck className={`h-4 w-4 shrink-0 ${
                        selectedVolunteer?.id === vol.id ? 'text-indigo-600' : 'text-slate-400'
                      }`} />
                      <span>{vol.badge}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={handleConfirm}
                disabled={!selectedVolunteer}
                className={`w-full rounded-2xl py-3 text-sm font-bold text-white transition mt-2 flex items-center justify-center gap-2 ${
                  selectedVolunteer 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 shadow-md' 
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                Confirm Deployment
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

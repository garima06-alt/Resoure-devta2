import { useState, useMemo } from 'react'
import { Bell, CheckCircle2, Zap, Heart, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import ClusterCard from '../components/cards/ClusterCard.jsx'
import KpiPillCard from '../components/cards/KpiPillCard.jsx'
import { mockIntelligence, mockNgos, mockDonations } from '../data/mockData.js'
import { formatINR } from '../utils/format.js'
import SmartScanner from '../components/SmartScanner.jsx'
import DeployModal from '../components/DeployModal.jsx'
import { db } from '../firebase.js'
import { collection, addDoc } from 'firebase/firestore'





export default function HomePage() {
  const nav = useNavigate()
  const [deployed, setDeployed] = useState(() => new Set())
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false)
  const [selectedNgo, setSelectedNgo] = useState('')
  const [amount, setAmount] = useState('')
  const [donationType, setDonationType] = useState('one-time')
  const [isSuccess, setIsSuccess] = useState(false)
  const [kpis, setKpis] = useState(() => [...mockIntelligence.kpis])
  
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false)
  const [selectedCrisis, setSelectedCrisis] = useState(null)
  const [successToast, setSuccessToast] = useState(false)

  const seedDatabase = async () => {
    try {
      const centers = [
        { name: 'Dharavi, Mumbai', lat: 19.0402, lng: 72.8508 },
        { name: 'Bandra, Mumbai', lat: 19.0596, lng: 72.8295 },
        { name: 'Andheri, Mumbai', lat: 19.1136, lng: 72.8697 },
        { name: 'Vashi, Navi Mumbai', lat: 19.0745, lng: 72.9978 },
        { name: 'Belapur, Navi Mumbai', lat: 19.0199, lng: 73.0389 },
        { name: 'Pune', lat: 18.5204, lng: 73.8567 },
        { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
        { name: 'Nashik', lat: 19.9975, lng: 73.7898 },
        { name: 'Aurangabad', lat: 19.8762, lng: 75.3433 }
      ]
      const titles = ['Water Shortage', 'Medical Supply Gap', 'Food distribution needed', 'Sanitation assistance', 'Emergency shelter', 'Clothing distribution']
      const needsArr = [['Water'], ['Medical'], ['Food'], ['Water', 'Food'], ['Medical', 'Water']]
      const urgencies = ['critical', 'moderate']
      const reportsRef = collection(db, 'reports')

      for (let i = 0; i < 85; i++) {
        const center = centers[Math.floor(Math.random() * centers.length)]
        const lat = center.lat + (Math.random() - 0.5) * 0.12
        const lng = center.lng + (Math.random() - 0.5) * 0.12
        const title = titles[Math.floor(Math.random() * titles.length)] + ` (Ref #${1000 + i})`
        const urgency = urgencies[Math.floor(Math.random() * urgencies.length)]
        const needs = needsArr[Math.floor(Math.random() * needsArr.length)]
        const households = Math.floor(Math.random() * 50) + 1

        await addDoc(reportsRef, {
          title,
          urgency,
          lat,
          lng,
          locationText: center.name,
          needs,
          households_affected: households,
          createdAt: new Date().toISOString()
        })
      }
      alert('85 production records mapped securely!')
    } catch (err) {
      console.error('Seeding failed:', err)
      alert('Seeding failed. Check console.')
    }
  }

  const clusters = useMemo(() => mockIntelligence.clusters, [])


  function deploy(id) {
    const crisis = mockIntelligence.clusters.find(c => c.id === id)
    setSelectedCrisis(crisis)
    setIsDeployModalOpen(true)
  }

  function handleConfirmDeployment(crisisId, volunteer) {
    setDeployed((prev) => new Set(prev).add(crisisId))
    setSuccessToast(true)
    setTimeout(() => setSuccessToast(false), 4000)
  }


  const handleScannerSuccess = (data) => {
    // 1. Update counter
    const updated = kpis.map((k) => {
      if (k.id === 'k_total') {
        const currentVal = parseInt(k.value.replace(/,/g, ''), 10) || 0
        return { ...k, value: (currentVal + 1).toLocaleString() }
      }
      return k
    })
    setKpis(updated)

    // Update global mock value too so it persists across page views
    const mockTotal = mockIntelligence.kpis.find(k => k.id === 'k_total')
    if (mockTotal) {
      const currentVal = parseInt(mockTotal.value.replace(/,/g, ''), 10) || 0
      mockTotal.value = (currentVal + 1).toLocaleString()
    }

    // 2. Navigate to map page (coordinates are already stored in localStorage)
    nav('/app/map')
  }


  function handleDonate(e) {
    e.preventDefault()
    if (!selectedNgo || !amount) return

    // Add to mock history
    const newDonation = {
      id: `d_${Date.now()}`,
      donor: 'Sarah Johnson', // Using the mock user's name
      ngo: selectedNgo,
      amount: parseFloat(amount),
      status: donationType === 'one-time' ? 'completed' : 'recurring',
      type: donationType,
      date: new Date().toLocaleDateString('en-US'),
    }
    
    mockDonations.history.unshift(newDonation)
    
    // Update stats
    const totalStat = mockDonations.stats.find(s => s.label === 'Total Collected')
    if (totalStat) {
      const currentTotal = parseFloat(totalStat.value.replace('$', '').replace('₹', '').replace(',', ''))
      totalStat.value = formatINR(currentTotal + parseFloat(amount))
    }

    setIsSuccess(true)
    
    setTimeout(() => {
      setIsDonateModalOpen(false)
      setIsSuccess(false)
      setSelectedNgo('')
      setAmount('')
      setDonationType('one-time')
    }, 2000)
  }

  return (
    <div className="-mx-4 -mt-4">
      <div className="relative overflow-hidden rounded-b-[28px] bg-gradient-to-b from-indigo-600 to-indigo-500 px-4 pb-6 pt-6 text-white">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -left-10 top-24 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm/6 opacity-90">Good morning,</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight">
              Intelligence Dashboard
            </div>
          </div>
          <button
            type="button"
            onClick={() => nav('/app/notifications')}
            className="relative grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur hover:bg-white/15"
            aria-label="Notifications"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-rose-500" />
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-5 py-2 text-sm font-semibold text-slate-800 shadow-soft">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Synced
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {kpis.map((k) => (
            <KpiPillCard
              key={k.id}
              icon={k.icon}
              label={k.label}
              value={k.value}
              delta={k.delta}
              tone={k.tone}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 px-4 pb-6 pt-5">
        <SmartScanner onSuccess={handleScannerSuccess} />

        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-500 text-white shadow-sm">
            <span className="text-lg">!</span>
          </div>
          <div className="text-lg font-extrabold text-slate-900">
            Urgent Clusters <span className="text-rose-500">•</span>
          </div>
          <button 
            onClick={seedDatabase}
            className="ml-auto text-[10px] font-extrabold tracking-widest text-slate-400 bg-slate-100 hover:bg-slate-200 ring-1 ring-slate-200 rounded-xl px-3 py-1.5 transition uppercase"
          >
            Deploy 85 Nodes
          </button>
        </div>

        <div className="space-y-4">
          {clusters.map((c) => (
            <ClusterCard
              key={c.id}
              cluster={c}
              deployed={deployed.has(c.id)}
              onDeploy={deploy}
            />
          ))}
        </div>

        {/* Donate Card */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-5 text-white shadow-card relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-lg font-extrabold">Support Our NGOs</div>
              <div className="text-xs opacity-90 mt-1">Make a difference today with your donation</div>
            </div>
            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-indigo-600 shadow-soft hover:bg-slate-50 transition flex items-center gap-1"
            >
              <Heart className="h-4 w-4 fill-indigo-600 text-indigo-600" />
              Donate
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-slate-200">
          <div className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
            <Zap className="h-5 w-5 text-emerald-600" />
            Quick Actions
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              to="/app/map"
              className="rounded-2xl bg-indigo-600 p-5 text-white shadow-card transition hover:bg-indigo-700"
            >
              <div className="text-sm font-semibold opacity-90">View Heatmap</div>
              <div className="mt-2 text-lg font-extrabold">Geo</div>
            </Link>
            <Link
              to="/app/analytics"
              className="rounded-2xl bg-teal-600 p-5 text-white shadow-card transition hover:bg-teal-700"
            >
              <div className="text-sm font-semibold opacity-90">Analytics</div>
              <div className="mt-2 text-lg font-extrabold">Trends</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Donate Modal */}
      <AnimatePresence>
        {isDonateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                  Donate to NGO
                </div>
                <button
                  onClick={() => setIsDonateModalOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {isSuccess ? (
                <div className="py-8 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="mt-4 text-base font-bold text-slate-900">
                    Thank You!
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Your donation has been received.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleDonate} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Select NGO
                    </label>
                    <select
                      value={selectedNgo}
                      onChange={(e) => setSelectedNgo(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Choose an NGO...</option>
                      {mockNgos.map((ngo) => (
                        <option key={ngo.id} value={ngo.name}>
                          {ngo.name} ({ngo.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      min="1"
                      placeholder="Enter amount"
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Donation Type
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDonationType('one-time')}
                        className={`flex-1 rounded-xl py-2 text-center text-xs font-bold border transition ${
                          donationType === 'one-time'
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        One-time
                      </button>
                      <button
                        type="button"
                        onClick={() => setDonationType('monthly')}
                        className={`flex-1 rounded-xl py-2 text-center text-xs font-bold border transition ${
                          donationType === 'monthly'
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-soft hover:bg-indigo-700 transition mt-2"
                  >
                    Complete Donation
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        crisis={selectedCrisis}
        onConfirm={handleConfirmDeployment}
      />

      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-emerald-600 text-white px-4 py-3 shadow-xl font-bold text-sm flex items-center gap-2 ring-2 ring-emerald-500 ring-offset-2"
          >
            <CheckCircle2 className="h-5 w-5 text-white" />
            Response Team Deployed Successfully.
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="pointer-events-none fixed bottom-20 left-1/2 z-40 w-[min(390px,92vw)] -translate-x-1/2"
      >
        <div className="pointer-events-auto rounded-2xl bg-slate-900/90 px-4 py-3 text-sm font-semibold text-white shadow-soft backdrop-blur">
          Live preview loading, interactions may not be saved
        </div>
      </motion.div>
    </div>
  )
}


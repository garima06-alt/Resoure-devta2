import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gift, CheckCircle, Shield, FolderGit, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AdminElement from '../../components/AdminElement'

export default function DonationLedgerPage() {
  const { currentUser, userRole } = useAuth()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(false)
  const [allocatingId, setAllocatingId] = useState(null)
  const [allocationDetails, setAllocationDetails] = useState('')

  const fetchAllDonations = async () => {
    if (!currentUser) return
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/admin/donations', {
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
        setDonations(data)
      }
    } catch (err) {
      console.error('Failed to fetch donations', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllDonations()
  }, [currentUser])

  const handleAllocate = async (id) => {
    if (!allocationDetails.trim()) return
    try {
      const res = await fetch('http://localhost:5000/api/admin/donations/allocate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': currentUser.uid,
          'x-user-email': currentUser.email,
          'x-user-role': userRole
        },
        body: JSON.stringify({ id, allocationDetails })
      })
      if (res.status === 403) {
        window.location.href = '/access-denied'
        return
      }
      if (res.ok) {
        setAllocatingId(null)
        setAllocationDetails('')
        fetchAllDonations()
      }
    } catch (err) {
      console.error('Failed to allocate', err)
    }
  }

  return (
    <AdminElement>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="space-y-6 max-w-5xl mx-auto p-4 font-sans text-slate-100"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-900/40 via-slate-900 to-slate-900 border border-amber-500/30 p-6 shadow-xl ring-1 ring-amber-500/20">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-amber-500/20 blur-3xl rounded-full" />
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/30">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Donation Ledger</h1>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-widest mt-0.5">Global Oversight Control</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-6">
            <FolderGit className="h-5 w-5 text-amber-400" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">All Donations Log</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48 text-xs text-slate-500 font-bold uppercase tracking-wider animate-pulse">
              Retrieving Global Ledger...
            </div>
          ) : donations.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-48 border border-dashed border-slate-800 rounded-xl text-slate-600 p-4">
              <Gift className="h-8 w-8 mb-2 stroke-1" />
              <div className="text-xs font-semibold">No donations currently logged.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800/60">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Qty</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Donor Email</th>
                    <th className="py-3 px-4">Status / Allocation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {donations.map((don) => (
                    <tr key={don.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-100">{don.item}</td>
                      <td className="py-3 px-4 text-amber-400 font-extrabold">{don.quantity}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                          {don.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-slate-400">{don.email}</td>
                      <td className="py-3 px-4">
                        {don.allocated ? (
                          <div className="text-xs text-teal-400 font-medium">
                            Allocated: <span className="text-slate-300 font-normal italic">{don.allocationDetails}</span>
                          </div>
                        ) : allocatingId === don.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={allocationDetails}
                              onChange={(e) => setAllocationDetails(e.target.value)}
                              placeholder="Where to allocate?"
                              className="px-2 py-1 text-xs bg-slate-950 rounded border border-slate-800 focus:outline-none focus:border-amber-500"
                            />
                            <button
                              onClick={() => handleAllocate(don.id)}
                              className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 transition cursor-pointer"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAllocatingId(don.id)}
                            className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition cursor-pointer"
                          >
                            Allocate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </AdminElement>
  )
}

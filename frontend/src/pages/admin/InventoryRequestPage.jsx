import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, Package, Plus, Check, X, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AdminElement from '../../components/AdminElement'

export default function InventoryRequestPage() {
  const { currentUser, userRole } = useAuth()
  const [inventory, setInventory] = useState([])
  const [requests, setRequests] = useState([])
  const [invItem, setInvItem] = useState('')
  const [invQty, setInvQty] = useState('')
  const [invCat, setInvCat] = useState('food')
  const [loading, setLoading] = useState(false)

  const fetchAllData = async () => {
    if (!currentUser) return
    setLoading(true)
    try {
      const authHeaders = {
        'x-user-id': currentUser.uid,
        'x-user-email': currentUser.email,
        'x-user-role': userRole
      }
      const invRes = await fetch('http://localhost:5000/api/admin/inventory', { headers: authHeaders })
      if (invRes.status === 403) { window.location.href = '/access-denied'; return; }
      const invData = await invRes.json()
      if (Array.isArray(invData)) setInventory(invData)

      const reqRes = await fetch('http://localhost:5000/api/admin/requests', { headers: authHeaders })
      if (reqRes.status === 403) { window.location.href = '/access-denied'; return; }
      const reqData = await reqRes.json()
      if (Array.isArray(reqData)) setRequests(reqData)
    } catch (err) {
      console.error('Failed to fetch inventory and requests', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [currentUser])

  const handleAddInventory = async (e) => {
    e.preventDefault()
    if (!invItem.trim() || !invQty) return
    try {
      const res = await fetch('http://localhost:5000/api/admin/inventory', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': currentUser.uid,
          'x-user-email': currentUser.email,
          'x-user-role': userRole
        },
        body: JSON.stringify({ item: invItem, quantity: parseInt(invQty, 10), category: invCat })
      })
      if (res.status === 403) { window.location.href = '/access-denied'; return; }
      if (res.ok) {
        setInvItem('')
        setInvQty('')
        fetchAllData()
      }
    } catch (err) {
      console.error('Failed to add inventory', err)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/requests/${id}/status`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': currentUser.uid,
          'x-user-email': currentUser.email,
          'x-user-role': userRole
        },
        body: JSON.stringify({ status })
      })
      if (res.status === 403) { window.location.href = '/access-denied'; return; }
      if (res.ok) {
        fetchAllData()
      }
    } catch (err) {
      console.error('Failed to update request status', err)
    }
  }

  return (
    <AdminElement>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="space-y-6 max-w-6xl mx-auto p-4 font-sans text-slate-100"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900/40 via-slate-900 to-slate-900 border border-teal-500/30 p-6 shadow-xl ring-1 ring-teal-500/20">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-teal-500/20 blur-3xl rounded-full" />
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/30">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Master Inventory & Request Control</h1>
              <p className="text-xs text-teal-400 font-bold uppercase tracking-widest mt-0.5">Central Management Unit</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory CRUD */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-teal-400" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Inventory Ledger (CRUD)</h2>
            </div>

            <form onSubmit={handleAddInventory} className="flex gap-3 mb-6 items-end">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Item</label>
                <input
                  type="text"
                  value={invItem}
                  onChange={(e) => setInvItem(e.target.value)}
                  required
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition"
                  placeholder="Blankets"
                />
              </div>
              <div className="w-24">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Qty</label>
                <input
                  type="number"
                  value={invQty}
                  onChange={(e) => setInvQty(e.target.value)}
                  required
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition"
                  placeholder="50"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600/30 border border-teal-500/50 hover:bg-teal-600 text-white font-bold px-4 py-2 text-sm h-[38px] cursor-pointer transition flex items-center justify-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>
            </form>

            <div className="overflow-x-auto h-[300px] overflow-y-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="sticky top-0 bg-slate-900 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Item</th>
                    <th className="py-2 px-3">Qty</th>
                    <th className="py-2 px-3">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {inventory.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-2 px-3 font-semibold text-slate-100">{inv.item}</td>
                      <td className="py-2 px-3 text-teal-400 font-extrabold">{inv.quantity}</td>
                      <td className="py-2 px-3">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                          {inv.category || 'other'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Request Control */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-5 w-5 text-teal-400" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Global Request Control</h2>
            </div>

            <div className="space-y-3 h-[380px] overflow-y-auto pr-2">
              {requests.map((req) => (
                <div key={req.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 flex justify-between items-center hover:border-slate-700 transition">
                  <div>
                    <div className="text-sm font-bold text-slate-100">{req.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{req.description}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">Requested by: {req.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {req.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'approved')}
                          className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500 hover:text-slate-950 transition cursor-pointer"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'rejected')}
                          className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-slate-950 transition cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded border ${
                        req.status === 'approved' ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AdminElement>
  )
}

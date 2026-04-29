import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gift, History, Send, PackagePlus, Heart, CheckCircle2, AlertCircle } from 'lucide-react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

const NGOS = [
  { id: 'giveIndia',    name: 'GiveIndia Foundation' },
  { id: 'cry',          name: 'CRY — Child Rights'   },
  { id: 'akshayaPatra', name: 'Akshaya Patra'         },
  { id: 'helpage',      name: 'HelpAge India'         },
]

export default function DonationsPage() {
  const { currentUser } = useAuth()

  // ── Item donation state (existing Express API flow) ──
  const [item, setItem]         = useState('')
  const [quantity, setQuantity] = useState('')
  const [category, setCategory] = useState('food')
  const [donations, setDonations]   = useState([])
  const [loading, setLoading]       = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // ── Monetary / NGO donation state (new Firestore flow) ──
  const [ngo, setNgo]           = useState('')
  const [amount, setAmount]     = useState('')
  const [donationType, setDonationType] = useState('one-time')
  const [donateStatus, setDonateStatus] = useState('idle') // idle | loading | success | error
  const [donatedAmount, setDonatedAmount] = useState('')
  const [donatedNgo, setDonatedNgo]       = useState('')

  const fetchDonations = async () => {
    if (!currentUser) return
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/api/donations/user/${currentUser.uid}`)
      const data = await res.json()
      if (Array.isArray(data)) setDonations(data)
    } catch (err) {
      console.error('Failed to fetch donations', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDonations() }, [currentUser])

  // Item donation submit (existing Express API)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!item.trim() || !quantity) return
    setSubmitting(true)
    try {
      const res = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId:   currentUser?.uid || 'anonymous',
          email:    currentUser?.email || 'unknown',
          item,
          quantity: parseInt(quantity, 10),
          category,
          status:   'received',
        }),
      })
      if (res.ok) { setItem(''); setQuantity(''); fetchDonations() }
    } catch (err) {
      console.error('Failed to submit donation', err)
    } finally {
      setSubmitting(false)
    }
  }

  // Monetary donation submit (Firestore)
  async function handleMonetaryDonate() {
    if (!ngo || !amount || isNaN(amount) || Number(amount) <= 0) return
    setDonateStatus('loading')
    const savedAmount = amount
    const savedNgo    = NGOS.find((n) => n.id === ngo)?.name || ngo
    try {
      await addDoc(collection(db, 'donations'), {
        uid:       currentUser?.uid || 'anonymous',
        email:     currentUser?.email || '',
        ngo,
        ngoName:   savedNgo,
        amount:    Number(amount),
        type:      donationType,
        donatedAt: Timestamp.now(),
        status:    'completed',
      })
      setDonateStatus('success')
      setDonatedAmount(savedAmount)
      setDonatedNgo(savedNgo)
      setAmount('')
      setNgo('')
      setTimeout(() => setDonateStatus('idle'), 4000)
    } catch (err) {
      console.error('Monetary donation failed:', err)
      setDonateStatus('error')
      setTimeout(() => setDonateStatus('idle'), 4000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-8 font-sans"
      style={{ background: '#f0f4f8' }}
    >
      {/* Header */}
      <div
        className="relative overflow-hidden px-4 pt-8 pb-6"
        style={{ background: 'linear-gradient(135deg, #6c3fc5, #8b5cf6)' }}
      >
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Donation Portal</h1>
        <p className="text-sm mt-1 text-white/75">Support relief efforts &amp; NGO partners</p>
      </div>

      <div className="px-4 py-5 space-y-5">

        {/* ── Monetary / NGO donation card ── */}
        <div className="rounded-2xl p-5 bg-white" style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5" style={{ color: '#6c3fc5' }} />
            <h2 className="text-sm font-bold text-ink">Donate to an NGO</h2>
          </div>

          {/* Success toast */}
          {donateStatus === 'success' && (
            <div className="mb-4 rounded-xl p-3 flex items-start gap-2" style={{ background: '#f0fdfa', border: '1px solid #99f6e4' }}>
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#0d9488' }} />
              <div className="text-xs" style={{ color: '#0d9488' }}>
                <span className="font-bold">Thank you!</span> Your donation of ₹{donatedAmount} to {donatedNgo} was recorded.
              </div>
            </div>
          )}

          {/* Error toast */}
          {donateStatus === 'error' && (
            <div className="mb-4 rounded-xl p-3 flex items-start gap-2" style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#f43f5e' }} />
              <div className="text-xs" style={{ color: '#be123c' }}>Something went wrong. Please try again.</div>
            </div>
          )}

          {/* Type selector */}
          <div className="flex gap-2 mb-4">
            {['one-time', 'monthly'].map((t) => (
              <button key={t} onClick={() => setDonationType(t)}
                className="flex-1 rounded-xl py-2 text-xs font-bold transition-all"
                style={{
                  background: donationType === t ? '#6c3fc5' : '#f8fafc',
                  color:      donationType === t ? '#ffffff'  : '#64748b',
                  border:     donationType === t ? '1px solid #6c3fc5' : '1px solid #e2e8f0',
                }}>
                {t === 'one-time' ? 'One-time' : 'Monthly'}
              </button>
            ))}
          </div>

          {/* NGO selector */}
          <div className="mb-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">Choose NGO</label>
            <select value={ngo} onChange={(e) => setNgo(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm text-ink"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', outline: 'none' }}>
              <option value="">Select an NGO…</option>
              {NGOS.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </div>

          {/* Amount quick picks */}
          <div className="mb-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">Amount (₹)</label>
            <div className="flex gap-2 mb-2">
              {['100', '250', '500', '1000'].map((a) => (
                <button key={a} onClick={() => setAmount(a)}
                  className="flex-1 rounded-lg py-1.5 text-xs font-bold transition-all"
                  style={{
                    background: amount === a ? '#f5f3ff' : '#f8fafc',
                    color:      amount === a ? '#6c3fc5'  : '#64748b',
                    border:     amount === a ? '1px solid #ddd6fe' : '1px solid #e2e8f0',
                  }}>
                  ₹{a}
                </button>
              ))}
            </div>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="Or enter custom amount"
              className="w-full rounded-xl px-4 py-2.5 text-sm text-ink"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', outline: 'none' }} />
          </div>

          <button
            onClick={handleMonetaryDonate}
            disabled={donateStatus === 'loading' || !ngo || !amount}
            className="w-full rounded-xl py-3 text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #6c3fc5, #8b5cf6)' }}>
            {donateStatus === 'loading' ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg> Processing…</>
            ) : (
              <><Heart className="h-4 w-4" /> Donate ₹{amount || '—'}</>
            )}
          </button>
        </div>
        {/* Item Donation form — light theme */}
        <div className="rounded-2xl p-5 bg-white" style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-2 mb-4">
            <PackagePlus className="h-5 w-5" style={{ color: '#0d9488' }} />
            <h2 className="text-sm font-bold text-ink">Donate an Item</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">Item Name</label>
              <input type="text" value={item} onChange={(e) => setItem(e.target.value)} required
                placeholder="E.g. Dry Rations, Medicine"
                className="w-full rounded-xl px-4 py-2.5 text-sm text-ink"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">Quantity</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1"
                  placeholder="10" className="w-full rounded-xl px-4 py-2.5 text-sm text-ink"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', outline: 'none' }} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-sm text-ink"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <option value="food">Food</option>
                  <option value="water">Water</option>
                  <option value="medicine">Medicine</option>
                  <option value="clothing">Clothing</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={submitting}
              className="w-full rounded-xl py-3 text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)' }}>
              <Send className="h-4 w-4" />
              {submitting ? 'Submitting…' : 'Submit Item Donation'}
            </button>
          </form>
        </div>

        {/* Item Donation History */}
        <div className="rounded-2xl p-5 bg-white" style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-2 mb-4">
            <History className="h-5 w-5" style={{ color: '#6c3fc5' }} />
            <h2 className="text-sm font-bold text-ink">Item Donation History</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
                style={{ borderColor: '#6c3fc5', borderTopColor: 'transparent' }} />
            </div>
          ) : donations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Gift className="h-8 w-8 text-muted opacity-40" />
              <div className="text-xs text-muted font-semibold">No item donations recorded yet.</div>
            </div>
          ) : (
            <div className="space-y-2">
              {donations.map((don) => (
                <div key={don.id} className="flex items-center justify-between rounded-xl p-3"
                  style={{ background: '#f8fafc' }}>
                  <div>
                    <div className="text-sm font-semibold text-ink">{don.item}</div>
                    <div className="text-[10px] mt-0.5 text-muted">{don.category} · Qty: {don.quantity}</div>
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full"
                    style={{
                      background: don.allocated ? '#f0fdfa' : '#f5f3ff',
                      color:      don.allocated ? '#0d9488' : '#6c3fc5',
                      border:    `1px solid ${don.allocated ? '#99f6e4' : '#ddd6fe'}`,
                    }}>
                    {don.allocated ? 'Allocated' : 'Received'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  )
}


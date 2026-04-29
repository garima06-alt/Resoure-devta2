import { useState } from 'react'
import { CheckSquare, MapPin, Heart, LogOut } from 'lucide-react'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { formatINR } from '../utils/format'

export default function VolunteerDashboard() {
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Deliver Insulin to Dharavi Camp', status: 'pending', urgent: true },
    { id: 't2', title: 'Distribute Water Cans (Zone B)', status: 'pending', urgent: false },
    { id: 't3', title: 'Report Shelter Quality in Bandra', status: 'completed', urgent: false }
  ])
  const [donationAmount, setDonationAmount] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const nav = useNavigate()

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t))
  }

  const handleDonate = (e) => {
    e.preventDefault()
    if (!donationAmount) return
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      setDonationAmount('')
    }, 4000)
  }

  const handleLogout = async () => {
    await signOut(auth)
    nav('/login')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12 select-none">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md bg-slate-900/80">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-extrabold text-white text-sm">V</div>
          <div className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Volunteer Node</div>
        </div>
        <button 
          onClick={handleLogout}
          className="rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 transition flex items-center gap-1.5"
        >
          <LogOut className="h-3.5 w-3.5" /> Log Out
        </button>
      </div>

      <div className="px-4 mt-6 space-y-6 max-w-md mx-auto">
        {/* Welcome */}
        <div>
          <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Connected Gateway</div>
          <div className="text-2xl font-extrabold text-white mt-1">Field Operations</div>
        </div>

        {/* Assigned Tasks */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 text-sm font-extrabold text-slate-200 mb-4">
            <CheckSquare className="h-5 w-5 text-indigo-500" />
            Assigned Tasks
          </div>
          <div className="space-y-3">
            {tasks.map(task => (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                  task.status === 'completed' 
                    ? 'bg-slate-950/40 border-slate-800 text-slate-500' 
                    : 'bg-slate-950 border-slate-800/80 text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    readOnly
                    className="rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className={`text-xs font-semibold ${task.status === 'completed' ? 'line-through' : ''}`}>
                    {task.title}
                  </span>
                </div>
                {task.urgent && task.status !== 'completed' && (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">Urgent</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Map Placeholder / Directions */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 text-sm font-extrabold text-slate-200 mb-2">
            <MapPin className="h-5 w-5 text-teal-500" />
            Localized Support Node
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">Your location is connected to the emergency coordinate pipeline.</p>
          <div className="h-32 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-slate-600 gap-2">
            <MapPin className="h-6 w-6 animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider uppercase">Tracking Emergency Beacons</span>
          </div>
        </div>

        {/* Donation Portal */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 text-sm font-extrabold text-slate-200 mb-3">
            <Heart className="h-5 w-5 text-rose-500" />
            Support Operation (INR)
          </div>
          {isSuccess ? (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400 font-bold text-center">
              🎉 Contribution Saved. Thank you!
            </div>
          ) : (
            <form onSubmit={handleDonate} className="flex gap-2">
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="Amount (e.g. 500)"
                className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 text-xs font-bold text-white transition"
              >
                Contribute
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

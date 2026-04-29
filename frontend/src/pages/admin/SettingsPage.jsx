import { Bell, Building2, Shield, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const MOCK_NGO_PARTNERS = [
  { id: 'n1', name: 'HopeHands NGO',         category: 'Food Relief',        status: 'active'  },
  { id: 'n2', name: 'HealthBridge Foundation',category: 'Healthcare',          status: 'active'  },
  { id: 'n3', name: 'Data4Good',             category: 'Research & Survey',   status: 'active'  },
  { id: 'n4', name: 'Goonj Mumbai',          category: 'Clothing & Shelter',  status: 'pending' },
]

const CARD = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: '#f1f5f9' }}>
      <div>
        <div className="text-sm font-semibold text-ink">{label}</div>
        {value && <div className="text-xs mt-0.5 text-muted">{value}</div>}
      </div>
      <button className="text-xs font-bold px-3 py-1.5 rounded-xl"
        style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}>
        Edit
      </button>
    </div>
  )
}

export default function AdminSettingsPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen page-enter px-4 pt-5 pb-8 space-y-5" style={{ background: '#f0f4f8' }}>

      <div>
        <h1 className="text-xl font-extrabold text-ink">Settings</h1>
        <p className="text-xs mt-0.5 text-muted">System configuration & management</p>
      </div>

      {/* Account */}
      <div style={CARD} className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-4 w-4" style={{ color: '#b45309' }} />
          <span className="text-sm font-bold text-ink">Account Info</span>
        </div>
        <Row label="Email"        value={user?.email || 'admin@resourcedevta.org'} />
        <Row label="Display Name" value="NGO Coordinator" />
        <Row label="Password"     value="••••••••••" />
      </div>

      {/* NGO Partners */}
      <div style={CARD} className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" style={{ color: '#b45309' }} />
            <span className="text-sm font-bold text-ink">NGO Partners</span>
          </div>
          <button className="text-[10px] font-bold px-2 py-1 rounded-lg"
            style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}>
            + Add Partner
          </button>
        </div>
        <div className="space-y-2">
          {MOCK_NGO_PARTNERS.map((ngo) => (
            <div key={ngo.id} className="flex items-center justify-between rounded-xl p-3"
              style={{ background: '#f8fafc' }}>
              <div>
                <div className="text-sm font-bold text-ink">{ngo.name}</div>
                <div className="text-[10px] mt-0.5 text-muted">{ngo.category}</div>
              </div>
              <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full"
                style={{
                  background: ngo.status === 'active' ? '#f0fdfa' : '#fffbeb',
                  color:      ngo.status === 'active' ? '#0d9488' : '#b45309',
                  border:    `1px solid ${ngo.status === 'active' ? '#99f6e4' : '#fde68a'}`,
                }}>
                {ngo.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Prefs */}
      <div style={CARD} className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4" style={{ color: '#b45309' }} />
          <span className="text-sm font-bold text-ink">Notification Preferences</span>
        </div>
        {['Critical Zone Alerts', 'Task Completions', 'New Volunteer Joins', 'Donation Updates', 'System Notifications'].map((pref) => (
          <div key={pref} className="flex items-center justify-between py-3 border-b last:border-b-0"
            style={{ borderColor: '#f1f5f9' }}>
            <span className="text-sm text-ink">{pref}</span>
            <button className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4' }}>
              On
            </button>
          </div>
        ))}
      </div>

      {/* Role Management */}
      <div style={CARD} className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4" style={{ color: '#b45309' }} />
          <span className="text-sm font-bold text-ink">Role Management</span>
        </div>
        <Row label="Admin Access"       value="Full system control — you" />
        <Row label="Coordinator Access" value="2 coordinators" />
        <Row label="Volunteer Access"   value="312 field volunteers" />
      </div>

      {/* Sign out */}
      <button onClick={logout}
        className="w-full rounded-2xl py-3.5 text-sm font-bold transition-all"
        style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#f43f5e' }}>
        Sign Out
      </button>
    </div>
  )
}

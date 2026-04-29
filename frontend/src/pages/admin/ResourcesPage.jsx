import { useState } from 'react'
import { Plus, X, Package } from 'lucide-react'

// TODO: connect to real API
const MOCK_RESOURCES = [
  { id: 'r1', name: 'Dry Ration Kits',         category: 'Food',    quantity: 450, location: 'Central Warehouse',         status: 'available' },
  { id: 'r2', name: 'Drinking Water (20L)',     category: 'Water',   quantity: 120, location: 'Zone B Storage',            status: 'available' },
  { id: 'r3', name: 'First Aid Kits',           category: 'Medical', quantity: 8,   location: 'Clinic Zone A',             status: 'depleted'  },
  { id: 'r4', name: 'Tarpaulin Sheets',         category: 'Shelter', quantity: 75,  location: 'Ward 3 Depot',              status: 'available' },
  { id: 'r5', name: 'Antibiotics (batch)',      category: 'Medical', quantity: 200, location: 'En route to Bandra',        status: 'en-route'  },
  { id: 'r6', name: 'Winter Blankets',          category: 'Clothing',quantity: 300, location: 'Dharavi Distribution Pt.', status: 'available' },
  { id: 'r7', name: 'Oral Rehydration Salts',  category: 'Medical', quantity: 0,   location: 'HQ Inventory',              status: 'depleted'  },
  { id: 'r8', name: 'Baby Nutrition Packs',    category: 'Food',    quantity: 90,  location: 'Kurla Aid Center',          status: 'en-route'  },
]

const CAT_COLOR = { Food: '#b45309', Water: '#0d9488', Medical: '#f43f5e', Shelter: '#6c3fc5', Clothing: '#8b5cf6' }
const STATUS_CHIP = {
  available: { bg: '#f0fdfa', color: '#0d9488', border: '#99f6e4' },
  depleted:  { bg: '#fff1f2', color: '#f43f5e', border: '#fecdd3' },
  'en-route':{ bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
}

const CARD = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }

export default function AdminResourcesPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen page-enter px-4 pt-5 pb-8 space-y-4" style={{ background: '#f0f4f8' }}>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-ink">Resource Inventory</h1>
          <p className="text-xs mt-0.5 text-muted">{MOCK_RESOURCES.length} items tracked</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
          <Plus className="h-4 w-4" /> Add Resource
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Available', count: MOCK_RESOURCES.filter(r => r.status === 'available').length, bg: '#f0fdfa', color: '#0d9488', border: '#99f6e4' },
          { label: 'En Route',  count: MOCK_RESOURCES.filter(r => r.status === 'en-route').length,  bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
          { label: 'Depleted',  count: MOCK_RESOURCES.filter(r => r.status === 'depleted').length,  bg: '#fff1f2', color: '#f43f5e', border: '#fecdd3' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-3 text-center"
            style={{ background: s.bg, border: `1px solid ${s.border}` }}>
            <div className="text-xl font-extrabold" style={{ color: s.color }}>{s.count}</div>
            <div className="text-[10px] font-semibold mt-0.5 text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Item list — TODO: connect to real API */}
      <div className="space-y-2">
        {MOCK_RESOURCES.map((r) => {
          const ss  = STATUS_CHIP[r.status] || STATUS_CHIP.available
          const cc  = CAT_COLOR[r.category] || '#6c3fc5'
          return (
            <div key={r.id} style={CARD} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: cc + '15', border: `1px solid ${cc}35` }}>
                    <Package className="h-5 w-5" style={{ color: cc }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-ink truncate">{r.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded"
                        style={{ background: cc + '18', color: cc }}>{r.category}</span>
                      <span className="text-[10px] text-muted">Qty: <b className="text-ink">{r.quantity}</b></span>
                    </div>
                    <div className="text-[10px] mt-0.5 text-muted">📍 {r.location}</div>
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0"
                  style={{ background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>
                  {r.status.replace('-', ' ')}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="w-full max-w-[430px] rounded-t-3xl p-6 space-y-4 bg-white"
            style={{ border: '1px solid #e2e8f0' }}>
            <div className="flex items-center justify-between">
              <div className="text-base font-extrabold text-ink">Add New Resource</div>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-muted" /></button>
            </div>
            {['Resource Name', 'Category', 'Quantity', 'Location'].map((label) => (
              <div key={label}>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">{label}</label>
                <input className="w-full rounded-xl px-4 py-2.5 text-sm text-ink"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', outline: 'none' }}
                  placeholder={`Enter ${label.toLowerCase()}…`} />
              </div>
            ))}
            <button onClick={() => setShowModal(false)}
              className="w-full rounded-xl py-3 font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
              Add Resource
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

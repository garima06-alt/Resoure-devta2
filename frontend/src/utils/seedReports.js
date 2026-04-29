import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'

// Realistic Mumbai/Navi Mumbai crisis reports for seeding
const SEED_REPORTS = [
  // ── Zone A — Andheri ────────────────────────────────────────────────────
  { title: 'Food Distribution Needed', location: 'Zone A - Andheri', priority: 'HIGH',
    category: 'food', reportCount: 7, aiInsight: 'Multiple households reporting food insecurity. Peak demand at 12 PM daily.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Medical Camp Shortage', location: 'Zone A - Andheri West', priority: 'HIGH',
    category: 'medical', reportCount: 4, aiInsight: 'Andheri West camp running out of ORS and basic antibiotics.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Drinking Water Depletion', location: 'Zone A - Versova', priority: 'MEDIUM',
    category: 'water', reportCount: 3, aiInsight: 'Community tanker has not arrived for 48 hours.', status: 'pending', deployedAt: null, deployedBy: null },

  // ── Zone B — Dharavi ────────────────────────────────────────────────────
  { title: 'Water Shortage Crisis', location: 'Zone B - Dharavi', priority: 'CRITICAL',
    category: 'water', reportCount: 5, aiInsight: '5 reports of water shortage detected in the last 6 hours. Urgency rising.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Shelter Collapse Risk', location: 'Zone B - Dharavi Sector 5', priority: 'CRITICAL',
    category: 'shelter', reportCount: 8, aiInsight: 'Heavy rain has weakened informal shelters. Structural risk confirmed by field team.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Sanitation Breakdown', location: 'Zone B - Dharavi North', priority: 'HIGH',
    category: 'sanitation', reportCount: 6, aiInsight: 'Open drainage overflowing. Risk of waterborne disease spread.', status: 'pending', deployedAt: null, deployedBy: null },

  // ── Zone C — Kurla ──────────────────────────────────────────────────────
  { title: 'Shelter Overflow - Kurla Camp', location: 'Zone C - Kurla', priority: 'CRITICAL',
    category: 'shelter', reportCount: 12, aiInsight: 'Camp at 140% capacity, urgent overflow management needed.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Flood Evacuation Required', location: 'Zone C - Kurla West', priority: 'CRITICAL',
    category: 'flood', reportCount: 9, aiInsight: 'Heavy rain forecast. 9 households in low-lying areas need immediate relocation.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Clothing Relief Needed', location: 'Zone C - Kurla East', priority: 'MEDIUM',
    category: 'clothing', reportCount: 3, aiInsight: 'Families displaced by flooding lack dry clothing and blankets.', status: 'pending', deployedAt: null, deployedBy: null },

  // ── Zone D — Bandra ─────────────────────────────────────────────────────
  { title: 'Medical Supply Gap', location: 'Zone D - Bandra', priority: 'HIGH',
    category: 'medical', reportCount: 3, aiInsight: 'Cluster analysis shows urgent need for medical supplies — 3 clinics affected.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Child Nutrition Crisis', location: 'Zone D - Bandra East', priority: 'HIGH',
    category: 'nutrition', reportCount: 5, aiInsight: 'Anganwadi centres report shortage of nutrition packets for under-5 children.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Elderly Care Shortage', location: 'Zone D - Bandra Reclamation', priority: 'MEDIUM',
    category: 'healthcare', reportCount: 2, aiInsight: 'Senior citizens stranded at home, no caretakers since flooding.', status: 'pending', deployedAt: null, deployedBy: null },

  // ── Zone E — Sion ───────────────────────────────────────────────────────
  { title: 'Flood Alert - Sion Pumping', location: 'Zone E - Sion', priority: 'HIGH',
    category: 'flood', reportCount: 4, aiInsight: 'Water levels rising, pumping station at risk.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Hospital Supply Chain Break', location: 'Zone E - Sion Hospital Road', priority: 'CRITICAL',
    category: 'medical', reportCount: 6, aiInsight: 'Sion Hospital road flooded. Emergency supplies cannot reach facility.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Rescue Boats Required', location: 'Zone E - Sion Lake Area', priority: 'CRITICAL',
    category: 'rescue', reportCount: 11, aiInsight: '11 families stranded. Rescue boat deployment needed immediately.', status: 'pending', deployedAt: null, deployedBy: null },

  // ── Navi Mumbai ─────────────────────────────────────────────────────────
  { title: 'Road Blockage - Relief Cut Off', location: 'Navi Mumbai - Vashi', priority: 'HIGH',
    category: 'logistics', reportCount: 4, aiInsight: 'Vashi bridge partially blocked. Relief trucks rerouting, 3-hour delay.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Power Outage - Cold Chain Risk', location: 'Navi Mumbai - Belapur', priority: 'HIGH',
    category: 'logistics', reportCount: 3, aiInsight: 'Power outage affecting cold storage. Medicine cold chain at risk.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Water Logging - Ward 8', location: 'Navi Mumbai - Nerul', priority: 'MEDIUM',
    category: 'flood', reportCount: 5, aiInsight: 'Ward 8 waterlogged. Schools converted to relief camps are at capacity.', status: 'pending', deployedAt: null, deployedBy: null },

  // ── Additional scattered reports ─────────────────────────────────────────
  { title: 'Mental Health Crisis', location: 'Vikhroli', priority: 'MEDIUM',
    category: 'healthcare', reportCount: 2, aiInsight: 'Displacement causing acute stress. Counsellors needed urgently.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Pet & Animal Rescue', location: 'Powai Lake Area', priority: 'MEDIUM',
    category: 'rescue', reportCount: 3, aiInsight: 'Stray animals trapped in flooded zones. Rescue requested.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Makeshift School Closure', location: 'Govandi', priority: 'MEDIUM',
    category: 'education', reportCount: 4, aiInsight: 'Relief camp has no volunteers to run child care. 200 children affected.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Sewage Overflow Emergency', location: 'Chembur', priority: 'CRITICAL',
    category: 'sanitation', reportCount: 7, aiInsight: 'Sewage mixing with floodwater. Cholera risk elevated.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Generator Fuel Shortage', location: 'Mankhurd', priority: 'HIGH',
    category: 'logistics', reportCount: 3, aiInsight: 'Backup generators at flood control centres running low on diesel.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Mobile Hospital Needed', location: 'Malad West', priority: 'HIGH',
    category: 'medical', reportCount: 5, aiInsight: 'Nearest clinic 4 km away with flooded roads. Mobile unit needed.', status: 'pending', deployedAt: null, deployedBy: null },
  { title: 'Blanket & Tarpaulin Shortage', location: 'Borivali East', priority: 'MEDIUM',
    category: 'shelter', reportCount: 4, aiInsight: '400 evacuees at community hall. Only 80 blankets available.', status: 'pending', deployedAt: null, deployedBy: null },
]

/**
 * Seed the Firestore `reports` collection with realistic crisis data.
 * Call this once from the Admin Dashboard in DEV mode.
 * All documents include a `createdAt` Timestamp for real-time ordering.
 */
export async function seedReports() {
  const col = collection(db, 'reports')
  let count = 0
  for (const report of SEED_REPORTS) {
    await addDoc(col, { ...report, createdAt: Timestamp.now() })
    count++
  }
  console.log(`✅ Seeded ${count} reports to Firestore`)
  alert(`✅ Seeded ${count} crisis reports to Firestore!`)
}

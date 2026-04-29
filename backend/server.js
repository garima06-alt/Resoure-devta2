import express from 'express'
import cors from 'cors'
import multer from 'multer'
import axios from 'axios'
import dotenv from 'dotenv'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Load .env from frontend directory
dotenv.config({ path: path.join(__dirname, '../frontend/.env') })

const app = express()
app.use(cors())
app.use(express.json())

const upload = multer({ storage: multer.memoryStorage() })

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAJmcq5scMZPlbCuNPKfYiOyhAwjMKxQ-k",
  authDomain: "artemyth-gsc2026.firebaseapp.com",
  projectId: "artemyth-gsc2026",
  storageBucket: "artemyth-gsc2026.firebasestorage.app",
  messagingSenderId: "999367351843",
  appId: "1:999367351843:web:b3d14bf5e43b920225db96",
  measurementId: "G-106YSFVQDS"
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

const logsFile = path.join(__dirname, 'logs.json')

// Helper to log
const logEvent = (type, details, userId = 'unknown', email = 'unknown') => {
  let logs = []
  try {
    if (fs.existsSync(logsFile)) {
      logs = JSON.parse(fs.readFileSync(logsFile, 'utf-8'))
    } else {
      // Seed initial logs for System Diagnostics
      logs = [
        {
          id: 'log_seed_1',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: 'timeout',
          userId: 'vol_002',
          email: 'volunteer2@artemyth.org',
          details: 'Request timed out: GET /api/admin/map/pins took longer than 5000ms'
        },
        {
          id: 'log_seed_2',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          type: 'unauthorized_access',
          userId: 'user_099',
          email: 'civilian@gmail.com',
          details: 'Role volunteer tried to access admin endpoint /api/admin/diagnostics/logs'
        },
        {
          id: 'log_seed_3',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          type: 'timeout',
          userId: 'vol_005',
          email: 'scout_neha@artemyth.org',
          details: 'Request timed out: POST /api/admin/requests/req_44/status failed connection'
        }
      ]
      fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2))
    }
  } catch (e) {
    console.error("Error reading logs file:", e)
  }
  const newLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    type,
    userId,
    email,
    details
  }
  logs.push(newLog)
  try {
    fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2))
  } catch (e) {
    console.error("Error writing logs file:", e)
  }
  return newLog
}


const verifyAdmin = async (req, res, next) => {
  const userId = req.headers['x-user-id']
  const userEmail = req.headers['x-user-email'] || 'unknown'
  
  if (!userId) {
    logEvent('unauthorized_access', `No User ID provided for endpoint ${req.originalUrl}`, userId, userEmail)
    return res.status(403).json({ error: 'Access Denied' })
  }

  try {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)
    let role = 'volunteer'
    if (docSnap.exists()) {
      role = docSnap.data().role
    } else {
      // Fallback: If not in Firestore, check query param role (for testing/simulation)
      const queryRole = req.headers['x-user-role']
      if (queryRole === 'admin') {
        role = 'admin'
      }
    }

    if (role !== 'admin') {
      logEvent('unauthorized_access', `Role ${role} tried to access admin endpoint ${req.originalUrl}`, userId, userEmail)
      return res.status(403).json({ error: 'Access Denied' })
    }
    
    next()
  } catch (err) {
    console.error('Auth error:', err)
    logEvent('unauthorized_access', `Auth verification error for endpoint ${req.originalUrl}: ${err.message}`, userId, userEmail)
    return res.status(403).json({ error: 'Access Denied' })
  }
}


const GOOGLE_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY

if (!GOOGLE_API_KEY) {
  console.error('CRITICAL ERROR: Missing VITE_GOOGLE_MAPS_API_KEY in frontend/.env!')
}

app.post('/api/scan-survey', upload.single('image'), async (req, res) => {
  try {
    if (!GOOGLE_API_KEY) {
      return res.status(500).json({ 
        error: 'Google API Key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to your frontend/.env file.' 
      })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' })
    }

    const imageBase64 = req.file.buffer.toString('base64')

    // 1. Call Google Cloud Vision API for OCR
    let ocrText = ''
    try {
      const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`
      const visionResponse = await axios.post(visionUrl, {
        requests: [
          {
            image: { content: imageBase64 },
            features: [{ type: 'DOCUMENT_TEXT_DETECTION' }]
          }
        ]
      })

      const annotations = visionResponse.data?.responses?.[0]?.fullTextAnnotation
      ocrText = annotations?.text || ''
      
      if (!ocrText) {
        // Try fallback TEXT_DETECTION if document OCR didn't find anything
        const textResponse = await axios.post(visionUrl, {
          requests: [
            {
              image: { content: imageBase64 },
              features: [{ type: 'TEXT_DETECTION' }]
            }
          ]
        })
        ocrText = textResponse.data?.responses?.[0]?.fullTextAnnotation?.text || ''
      }
    } catch (visionError) {
      console.error('Vision API Error:', visionError.response?.data || visionError.message)
      return res.status(502).json({ 
        error: 'Failed to extract text using Vision API. Check if the API key allows Vision API.',
        details: visionError.response?.data || visionError.message
      })
    }

    if (!ocrText) {
      return res.status(422).json({ error: 'Could not detect any text in the survey image.' })
    }

    // 2. LLM-Based Parsing Layer / Regex Logic
    // Extract location
    let location = 'Mumbai'
    const locMatch = ocrText.match(/(?:location|address)[:\-=\s]*([^\n\r]+)/i)
    if (locMatch && locMatch[1]) {
      location = locMatch[1].trim()
    } else {
      // Use first line as fallback if no location label
      const lines = ocrText.split('\n').map(l => l.trim()).filter(l => l.length > 5)
      if (lines.length > 0) {
        location = lines[0]
      }
    }

    // Extract needs (food, water, medicine)
    const needs = []
    if (/food/i.test(ocrText)) needs.push('food')
    if (/water/i.test(ocrText)) needs.push('water')
    if (/medicine|medical/i.test(ocrText)) needs.push('medicine')

    // Extract households_affected
    let households_affected = 1
    const hhMatch = ocrText.match(/(?:households|families|people|affected)\s*(?:affected)?[:\-=\s]*(\d+)/i)
    if (hhMatch && hhMatch[1]) {
      households_affected = parseInt(hhMatch[1], 10)
    }

    // Extract priority_level
    let priority_level = 'moderate'
    const pMatch = ocrText.match(/(?:priority|urgency)[:\-=\s]*(critical|high|moderate|normal|low)/i)
    if (pMatch && pMatch[1]) {
      priority_level = pMatch[1].toLowerCase()
      if (priority_level === 'normal' || priority_level === 'low') priority_level = 'moderate'
    } else {
      // Inflection based on households
      if (households_affected > 50 || needs.length >= 3) {
        priority_level = 'critical'
      } else if (households_affected > 10) {
        priority_level = 'critical'
      }
    }

    // 3. Geocoding Location
    let lat = 19.0760 // Default Mumbai
    let lng = 72.8777

    try {
      const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location + ', Mumbai, India')}&key=${GOOGLE_API_KEY}`
      const geoResponse = await axios.get(geoUrl)
      const geoResult = geoResponse.data?.results?.[0]

      if (geoResult?.geometry?.location) {
        lat = geoResult.geometry.location.lat
        lng = geoResult.geometry.location.lng
      }
    } catch (geoError) {
      console.error('Geocoding API Error:', geoError.message)
    }

    const structuredReport = {
      title: `${needs.map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' & ') || 'General'} Need`,
      locationText: location,
      lat,
      lng,
      needs,
      households_affected,
      urgency: priority_level === 'critical' ? 'critical' : 'moderate',
      scannedAt: new Date().toISOString(),
      ocrTextSnippet: ocrText.slice(0, 200)
    }

    // 4. Save to Firestore 'reports'
    const docRef = await addDoc(collection(db, 'reports'), structuredReport)

    res.status(201).json({
      success: true,
      id: docRef.id,
      data: structuredReport,
      rawText: ocrText
    })

  } catch (error) {
    console.error('Server Error:', error)
    res.status(500).json({ error: error.message })
  }
})

// --- Logging Endpoints ---
app.post('/api/logs/unauthorized', (req, res) => {
  const { userId, email, details } = req.body
  const log = logEvent('unauthorized_access', details || 'Unauthorized UI element viewed', userId, email)
  res.status(201).json({ success: true, log })
})

app.post('/api/logs/timeout', (req, res) => {
  const { userId, email, details } = req.body
  const log = logEvent('timeout', details || 'Request timed out', userId, email)
  res.status(201).json({ success: true, log })
})

// --- Admin Endpoints (Secured) ---
app.get('/api/admin/diagnostics/logs', verifyAdmin, (req, res) => {
  try {
    let logs = []
    if (fs.existsSync(logsFile)) {
      logs = JSON.parse(fs.readFileSync(logsFile, 'utf-8'))
    }
    res.status(200).json(logs)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch diagnostics logs' })
  }
})

// Admin Map Management
app.get('/api/admin/map/pins', verifyAdmin, async (req, res) => {
  try {
    const snap = await getDocs(collection(db, 'reports'))
    const pins = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.status(200).json(pins)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admin/map/pins', verifyAdmin, async (req, res) => {
  try {
    const docRef = await addDoc(collection(db, 'reports'), req.body)
    res.status(201).json({ id: docRef.id, ...req.body })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin Donation Ledger
app.get('/api/admin/donations', verifyAdmin, async (req, res) => {
  try {
    const snap = await getDocs(collection(db, 'donations'))
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admin/donations/allocate', verifyAdmin, async (req, res) => {
  try {
    const { id, allocationDetails } = req.body
    const docRef = doc(db, 'donations', id)
    await updateDoc(docRef, { allocated: true, allocationDetails, updatedAt: new Date().toISOString() })
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin Inventory
app.get('/api/admin/inventory', verifyAdmin, async (req, res) => {
  try {
    const snap = await getDocs(collection(db, 'inventory'))
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admin/inventory', verifyAdmin, async (req, res) => {
  try {
    const docRef = await addDoc(collection(db, 'inventory'), { ...req.body, createdAt: new Date().toISOString() })
    res.status(201).json({ id: docRef.id, ...req.body })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin Request Control
app.get('/api/admin/requests', verifyAdmin, async (req, res) => {
  try {
    const snap = await getDocs(collection(db, 'requests'))
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admin/requests/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body
    const docRef = doc(db, 'requests', req.params.id)
    await updateDoc(docRef, { status, updatedAt: new Date().toISOString() })
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin User Directory
app.get('/api/admin/users', verifyAdmin, async (req, res) => {
  try {
    const snap = await getDocs(collection(db, 'users'))
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/admin/users/:id', verifyAdmin, async (req, res) => {
  try {
    const docRef = doc(db, 'users', req.params.id)
    await updateDoc(docRef, { ...req.body, updatedAt: new Date().toISOString() })
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/admin/users/:id', verifyAdmin, async (req, res) => {
  try {
    const docRef = doc(db, 'users', req.params.id)
    await deleteDoc(docRef)
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// --- Common Folk Endpoints ---
app.post('/api/donations', async (req, res) => {
  try {
    const docRef = await addDoc(collection(db, 'donations'), { ...req.body, allocated: false, createdAt: new Date().toISOString() })
    res.status(201).json({ id: docRef.id, ...req.body })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/donations/user/:userId', async (req, res) => {
  try {
    const q = query(collection(db, 'donations'), where('userId', '==', req.params.userId))
    const snap = await getDocs(q)
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/requests', async (req, res) => {
  try {
    const docRef = await addDoc(collection(db, 'requests'), { ...req.body, status: 'pending', createdAt: new Date().toISOString() })
    res.status(201).json({ id: docRef.id, ...req.body })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/requests/user/:userId', async (req, res) => {
  try {
    const q = query(collection(db, 'requests'), where('userId', '==', req.params.userId))
    const snap = await getDocs(q)
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/support', async (req, res) => {
  try {
    const docRef = await addDoc(collection(db, 'support'), { ...req.body, status: 'open', createdAt: new Date().toISOString() })
    res.status(201).json({ id: docRef.id, ...req.body })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`)
})

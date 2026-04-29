import express from 'express'
import cors from 'cors'
import multer from 'multer'
import axios from 'axios'
import dotenv from 'dotenv'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import path from 'path'
import { fileURLToPath } from 'url'

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

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`)
})

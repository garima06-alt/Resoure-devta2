import { useEffect, useState, useRef } from 'react'
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, onSnapshot, addDoc } from 'firebase/firestore'

// Firebase config retrieved from Firebase Console
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
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const defaultCenter = { lat: 19.0760, lng: 72.8777 } // Mumbai

function MapWithClustering({ reports }) {
  const map = useMap()
  const clusterer = useRef(null)
  const markersRef = useRef({})
  const [selectedReport, setSelectedReport] = useState(null)

  // Initialize MarkerClusterer
  useEffect(() => {
    if (!map) return
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({
        map,
        onClusterClick: (event, cluster, map) => {
          if (cluster && cluster.bounds) {
            map.fitBounds(cluster.bounds)
          } else {
            // zoom in one level if bounds aren't available
            map.setZoom(map.getZoom() + 1)
          }
        }
      })
    }
  }, [map])

  // Center on newly scanned report
  useEffect(() => {
    if (!map) return
    const stored = localStorage.getItem('latest_scan_coords')
    if (stored) {
      try {
        const coords = JSON.parse(stored)
        if (coords && coords.lat && coords.lng) {
          map.setCenter(coords)
          map.setZoom(15) // Zoom in tightly to highlight
        }
      } catch (e) {
        console.error('Failed to parse latest_scan_coords', e)
      } finally {
        localStorage.removeItem('latest_scan_coords')
      }
    }
  }, [map])

  // Clear and update markers whenever reports change
  useEffect(() => {
    if (!clusterer.current) return
    clusterer.current.clearMarkers()
    const markers = Object.values(markersRef.current).filter(Boolean)
    clusterer.current.addMarkers(markers)
  }, [reports])

  return (
    <>
      {reports.map((report) => (
        <AdvancedMarker
          key={report.id}
          position={{ lat: report.lat, lng: report.lng }}
          onClick={() => setSelectedReport(report)}
          ref={(marker) => {
            if (marker) {
              markersRef.current[report.id] = marker
            } else {
              delete markersRef.current[report.id]
            }
          }}
        >
          {/* Custom Pulsing SVG Marker UI */}
          <div className="relative flex items-center justify-center cursor-pointer">
            <span className={`absolute inline-flex h-8 w-8 rounded-full opacity-75 animate-ping ${
              report.urgency === 'critical' ? 'bg-rose-400' : 'bg-teal-400'
            }`}></span>
            <div className={`relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow-lg transition-transform hover:scale-125 ${
              report.urgency === 'critical' ? 'bg-rose-600' : 'bg-teal-600'
            }`}>
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </div>
        </AdvancedMarker>
      ))}

      {selectedReport && (
        <InfoWindow
          position={{ lat: selectedReport.lat, lng: selectedReport.lng }}
          onCloseClick={() => setSelectedReport(null)}
        >
          <div className="p-2 text-slate-800 font-sans max-w-[200px]">
            <div className="font-extrabold text-sm text-slate-950 truncate">{selectedReport.title}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-slate-500 font-semibold">Urgency:</span>
              <span className={`font-extrabold uppercase text-[10px] px-1.5 py-0.5 rounded ${
                selectedReport.urgency === 'critical' 
                  ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                  : 'bg-teal-50 text-teal-600 border border-teal-200'
              }`}>
                {selectedReport.urgency}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 truncate">
              {selectedReport.locationText || 'Mumbai Region'}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  )
}

export default function IntelligenceMap({ userCoords }) {
  const [reports, setReports] = useState([])
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

  useEffect(() => {
    // 1. Load mock fallback reports so markers never fail to appear
    const mockFallback = [
      { id: "d_1", title: "Water Shortage Crisis", urgency: "critical", lat: 19.0402, lng: 72.8508 },
      { id: "d_2", title: "Medical Supply Gap", urgency: "critical", lat: 19.0596, lng: 72.8295 },
      { id: "d_3", title: "Food Distribution Needed", urgency: "moderate", lat: 19.1136, lng: 72.8697 },
      { id: "d_4", title: "Shelter Repairs", urgency: "moderate", lat: 18.9696, lng: 72.8193 },
      { id: "d_5", title: "Power Outage Hospital", urgency: "critical", lat: 19.1254, lng: 72.8512 },
      { id: "d_6", title: "Flood Evacuation", urgency: "critical", lat: 19.0178, lng: 72.8478 },
      { id: "d_7", title: "Sanitation Issue", urgency: "moderate", lat: 19.0886, lng: 72.8624 },
      { id: "d_8", title: "Clothing Supplies Needed", urgency: "moderate", lat: 19.1725, lng: 72.8561 },
      { id: "d_9", title: "Building Collapse Risk", urgency: "critical", lat: 18.9563, lng: 72.8094 },
      { id: "d_10", title: "Dry Rations Distribution", urgency: "moderate", lat: 19.2183, lng: 72.8576 },
      { id: "d_11", title: "Blood Donation Camp", urgency: "moderate", lat: 19.0222, lng: 72.8550 },
      { id: "d_12", title: "Childcare Essentials", urgency: "critical", lat: 19.0734, lng: 72.9012 },
      { id: "d_13", title: "Elderly Care Support", urgency: "moderate", lat: 19.1550, lng: 72.8490 },
      { id: "d_14", title: "Vaccine Deployment", urgency: "critical", lat: 19.0600, lng: 72.8333 }
    ]
    setReports(mockFallback)

    try {
      // 2. Listen to Firestore collection 'reports'
      const unsub = onSnapshot(collection(db, 'reports'), (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          // Combine Firestore reports with mock data (or just replace if empty)
          setReports(data.length > 0 ? data : mockFallback)
        }
      }, (error) => {
        console.error("Firestore error: ", error)
      })

      return () => unsub()
    } catch (firebaseErr) {
      console.error("Failed to initialize Firebase snapshot in Map:", firebaseErr)
    }
  }, [])

  // Filter out any invalid coordinates
  const validReports = reports.filter(r => r && typeof r.lat === 'number' && typeof r.lng === 'number')

  // Debugging requirement: Print the array of locations
  console.log("Map rendering locations:", validReports)

  // Use user coordinates if available, otherwise fallback to Mumbai
  const center = userCoords && userCoords.lat && userCoords.lng 
    ? { lat: userCoords.lat, lng: userCoords.lng }
    : defaultCenter

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-card ring-1 ring-slate-200">
      <APIProvider apiKey={apiKey}>
        <div style={{ height: '400px', width: '100%' }}>
          <Map
            center={center}
            defaultCenter={defaultCenter}
            defaultZoom={11}
            mapId="INTELLIGENCE_MAP"
            disableDefaultUI={true}
            zoomControl={true}
          >
            <MapWithClustering reports={validReports} />
          </Map>
        </div>
      </APIProvider>
    </div>
  )
}


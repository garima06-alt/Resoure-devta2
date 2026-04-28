import { useEffect, useState, useRef } from 'react'
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps'
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

  // Initialize MarkerClusterer
  useEffect(() => {
    if (!map) return
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map })
    }
  }, [map])

  return (
    <>
      {reports.map((report) => (
        <AdvancedMarker
          key={report.id}
          position={{ lat: report.lat, lng: report.lng }}
          ref={(marker) => {
            if (marker) {
              markersRef.current[report.id] = marker
            } else {
              delete markersRef.current[report.id]
            }
            if (clusterer.current) {
              clusterer.current.clearMarkers()
              clusterer.current.addMarkers(Object.values(markersRef.current))
            }
          }}
        >
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow-soft transition-all hover:scale-110 ${
              report.urgency === 'critical' ? 'bg-rose-600' : 'bg-teal-600'
            }`}
          >
            <div className="h-2 w-2 rounded-full bg-white" />
          </div>
        </AdvancedMarker>
      ))}
    </>
  )
}

export default function IntelligenceMap() {
  const [reports, setReports] = useState([])
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

  useEffect(() => {
    // Listen to Firestore collection 'reports'
    const unsub = onSnapshot(collection(db, 'reports'), (snapshot) => {
      if (snapshot.empty) {
        // Seed some mock data if collection is empty
        const dummyReports = [
          { title: "Water Shortage Crisis", urgency: "critical", lat: 19.0402, lng: 72.8508 },
          { title: "Medical Supply Gap", urgency: "critical", lat: 19.0596, lng: 72.8295 },
          { title: "Food Distribution Needed", urgency: "moderate", lat: 19.1136, lng: 72.8697 },
          { title: "Shelter Repairs", urgency: "moderate", lat: 18.9696, lng: 72.8193 }
        ]
        
        dummyReports.forEach(report => {
          addDoc(collection(db, 'reports'), report)
        })
      } else {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setReports(data)
      }
    }, (error) => {
      console.error("Firestore error: ", error)
    })

    return () => unsub()
  }, [])

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-card ring-1 ring-slate-200">
      <APIProvider apiKey={apiKey}>
        <div style={{ height: '400px', width: '100%' }}>
          <Map
            defaultCenter={defaultCenter}
            defaultZoom={11}
            mapId="INTELLIGENCE_MAP"
            disableDefaultUI={true}
            zoomControl={true}
          >
            <MapWithClustering reports={reports} />
          </Map>
        </div>
      </APIProvider>
    </div>
  )
}

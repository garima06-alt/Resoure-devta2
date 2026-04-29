import { useState, useRef } from 'react'
import { Camera, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react'

export default function SmartScanner({ onSuccess }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState('idle') // idle, uploading, processing_ocr, geocoding, finalizing, success, error
  const [statusMessage, setStatusMessage] = useState('')
  const [extractedData, setExtractedData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setExtractedData(null)
      setStatus('idle')
    }
  }

  const triggerScan = async () => {
    if (!file) return
    setStatus('uploading')
    setStatusMessage('Uploading document...')
    
    const formData = new FormData()
    formData.append('image', file)

    try {
      // Step 1: Reading handwriting...
      setStatus('processing_ocr')
      setStatusMessage('Reading handwriting...')
      await new Promise(r => setTimeout(r, 1500))

      // Step 2: Geocoding location...
      setStatus('geocoding')
      setStatusMessage('Geocoding location...')
      await new Promise(r => setTimeout(r, 1500))

      // Step 3: Calculating urgency...
      setStatus('finalizing')
      setStatusMessage('Calculating urgency...')
      
      const response = await fetch('/api/scan-survey', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process image')
      }

      const result = await response.json()
      setExtractedData(result.data)
      setStatus('success')
      setStatusMessage('Scanning complete!')
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMessage(err.message || 'Something went wrong while scanning.')
    }
  }

  const handleManualSave = async () => {
    if (!extractedData) return

    try {
      // Save coords to localStorage so the Map can read them
      localStorage.setItem('latest_scan_coords', JSON.stringify({
        lat: extractedData.lat,
        lng: extractedData.lng
      }))

      // Trigger counter update on HomePage
      if (onSuccess) {
        onSuccess(extractedData)
      }

      // Reset
      setFile(null)
      setPreview(null)
      setExtractedData(null)
      setStatus('idle')
    } catch (err) {
      console.error('Save failed', err)
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
        <span className="text-xl">🔍</span> Intelligence Scanner
      </div>

      {status === 'idle' && !preview && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-slate-50 transition"
        >
          <Camera className="h-10 w-10 text-slate-400 mb-2" />
          <div className="text-sm font-bold text-slate-700">Scan Paper Survey</div>
          <div className="text-xs text-slate-400 mt-1">Tap to capture or select file</div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      )}

      {preview && (status === 'idle' || status === 'uploading' || status === 'processing_ocr' || status === 'geocoding' || status === 'finalizing') && (
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/3] flex items-center justify-center">
          <img src={preview} alt="Survey Preview" className="max-h-full max-w-full object-contain" />
          
          {/* Google Lens corner overlays */}
          <div className="absolute inset-4 pointer-events-none border-2 border-transparent">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
          </div>

          {/* Scanning animation bar */}
          {(status !== 'idle') && (
            <div className="absolute left-0 right-0 h-1 bg-indigo-500 shadow-lg shadow-indigo-500/50 animate-pulse" style={{
              top: '50%',
              animation: 'scannerAnimation 2s infinite ease-in-out'
            }} />
          )}

          {/* Overlay Status */}
          {status !== 'idle' && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-400 mb-3" />
              <div className="text-sm font-bold tracking-wide">{statusMessage}</div>
            </div>
          )}
        </div>
      )}

      {status === 'idle' && preview && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={triggerScan}
            className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-soft hover:bg-indigo-700 transition"
          >
            Start Intelligence Scan
          </button>
          <button
            onClick={() => { setFile(null); setPreview(null); }}
            className="rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-rose-800">Scan Failed</div>
            <div className="text-xs text-rose-600 mt-1">{errorMessage}</div>
            <button
              onClick={() => setStatus('idle')}
              className="mt-2 text-xs font-bold text-rose-800 underline block"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {status === 'success' && extractedData && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 mb-3">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            AI Review Card
          </div>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="font-semibold text-slate-500">Title:</span>
              <span className="font-bold">{extractedData.title}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="font-semibold text-slate-500">Location:</span>
              <span className="font-bold text-right truncate max-w-[200px]">{extractedData.locationText}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="font-semibold text-slate-500">Households Affected:</span>
              <span className="font-bold">{extractedData.households_affected}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="font-semibold text-slate-500">Needs Identified:</span>
              <span className="font-bold uppercase text-indigo-600">
                {extractedData.needs.join(', ') || 'General'}
              </span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="font-semibold text-slate-500">Priority Level:</span>
              <span className={`font-extrabold uppercase ${
                extractedData.urgency === 'critical' ? 'text-rose-600' : 'text-teal-600'
              }`}>
                {extractedData.urgency}
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleManualSave}
              className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-emerald-700 transition"
            >
              Verify & Save to Firebase
            </button>
            <button
              onClick={() => { setFile(null); setPreview(null); setStatus('idle'); }}
              className="rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

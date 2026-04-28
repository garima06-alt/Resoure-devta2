import { useEffect, useMemo, useState } from 'react'

export default function useGeolocation({ enableHighAccuracy = true } = {}) {
  const [state, setState] = useState({
    status: 'idle', // idle | watching | error
    coords: null, // { lat, lng, accuracyM }
    error: null,
    lastUpdatedAt: null,
  })

  const supported = useMemo(() => typeof navigator !== 'undefined' && !!navigator.geolocation, [])

  function requestOnce() {
    if (!supported) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          status: 'watching',
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracyM: Math.round(pos.coords.accuracy ?? 0),
          },
          error: null,
          lastUpdatedAt: Date.now(),
        })
      },
      (err) => {
        setState((s) => ({
          ...s,
          status: 'error',
          error: err.message || 'Unable to fetch location.',
        }))
      },
      { enableHighAccuracy, maximumAge: 0, timeout: 15_000 },
    )
  }

  useEffect(() => {
    if (!supported) {
      setState((s) => ({
        ...s,
        status: 'error',
        error: 'Geolocation is not supported in this browser/device.',
      }))
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          status: 'watching',
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracyM: Math.round(pos.coords.accuracy ?? 0),
          },
          error: null,
          lastUpdatedAt: Date.now(),
        })
      },
      (err) => {
        setState((s) => ({
          ...s,
          status: 'error',
          error: err.message || 'Unable to fetch location.',
        }))
      },
      {
        enableHighAccuracy,
        maximumAge: 10_000,
        timeout: 15_000,
      },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [enableHighAccuracy, supported])

  return { ...state, supported, requestOnce }
}


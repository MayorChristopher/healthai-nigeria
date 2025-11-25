'use client'
import { useState } from 'react'

type LocationRequestProps = {
  onLocationSelect: (location: { lat: number; lon: number; method: 'gps' | 'manual'; address?: string }) => void
  onCancel: () => void
}

export default function LocationRequest({ onLocationSelect, onCancel }: LocationRequestProps) {
  const [loading, setLoading] = useState(false)
  const [manualLocation, setManualLocation] = useState('')
  const [error, setError] = useState('')

  const handleGPSLocation = () => {
    setLoading(true)
    setError('')
    
    if (!navigator.geolocation) {
      setError('GPS not supported on your device')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationSelect({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          method: 'gps'
        })
        setLoading(false)
      },
      (err) => {
        setError('Unable to get your location. Please enter manually.')
        setLoading(false)
      }
    )
  }

  const handleManualLocation = () => {
    if (!manualLocation.trim()) {
      setError('Please enter your location')
      return
    }
    
    onLocationSelect({
      lat: 0,
      lon: 0,
      method: 'manual',
      address: manualLocation.trim()
    })
  }

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl rounded-bl-md p-4 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1">Share Your Location</h3>
          <p className="text-sm text-gray-400">To find the nearest hospitals, I need to know where you are.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleGPSLocation}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl p-4 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold">Use GPS Location</p>
              <p className="text-xs text-green-100">Most accurate - finds closest hospitals</p>
            </div>
          </div>
          {loading ? (
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.15s'}} />
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.3s'}} />
            </div>
          ) : (
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-zinc-900 text-gray-500">or</span>
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={manualLocation}
            onChange={(e) => {
              setManualLocation(e.target.value)
              setError('')
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleManualLocation()
              }
            }}
            placeholder="Enter city or area (e.g., Umuahia, Aba)"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-600/50 transition-colors placeholder:text-gray-500"
          />
          <button
            onClick={handleManualLocation}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg p-3 transition-all cursor-pointer flex items-center justify-center gap-2 group"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="font-medium">Enter Location Manually</span>
          </button>
        </div>
      </div>

      <button
        onClick={onCancel}
        className="w-full text-sm text-gray-400 hover:text-white transition-colors cursor-pointer py-2"
      >
        Cancel
      </button>
    </div>
  )
}

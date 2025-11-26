'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const slides = [
  {
    title: 'Health Bridge',
    subtitle: 'Medical advice when hospitals are far away',
    content: (
      <div className="space-y-8 text-center">
        <div className="space-y-4">
          <p className="text-2xl text-white font-semibold">AI-Powered Health Assistant</p>
          <p className="text-lg text-gray-400">Nigeria National AI Hackathon 2025</p>
          <div className="flex gap-3 justify-center mt-6">
            <span className="px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400 text-sm font-medium">Google Gemini AI</span>
            <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded-lg text-blue-400 text-sm font-medium">Next.js 14</span>
          </div>
        </div>
      </div>
    )
  },
  {
    title: 'The Problem',
    subtitle: 'Healthcare Access Crisis in Rural Nigeria',
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-red-500/10 border-2 border-red-500/40 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2 text-white">Improper Medical Guidance</h3>
            <p className="text-gray-300">Lack of reliable health information in rural areas</p>
          </div>
          <div className="bg-red-500/10 border-2 border-red-500/40 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2 text-white">Inaccurate Symptom Analysis</h3>
            <p className="text-gray-300">No tools for emergency detection</p>
          </div>
          <div className="bg-red-500/10 border-2 border-red-500/40 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2 text-white">Distance from Hospitals</h3>
            <p className="text-gray-300">60% live 5km+ from nearest facility</p>
          </div>
          <div className="bg-red-500/10 border-2 border-red-500/40 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2 text-white">Language Barrier</h3>
            <p className="text-gray-300">Medical info not available in local languages</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: 'Our Solution',
    subtitle: 'AI-Powered Healthcare Access',
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-green-500/10 border-2 border-green-500/40 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2 text-white">W.H.O Medical Guidance</h3>
            <p className="text-gray-300">Well-defined AI symptom analysis</p>
          </div>
          <div className="bg-green-500/10 border-2 border-green-500/40 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2 text-white">Nigerian Pidgin Support</h3>
            <p className="text-gray-300">Breaking language barriers</p>
          </div>
          <div className="bg-green-500/10 border-2 border-green-500/40 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2 text-white">Emergency Detection</h3>
            <p className="text-gray-300">Auto-identifies critical symptoms</p>
          </div>
          <div className="bg-green-500/10 border-2 border-green-500/40 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2 text-white">Hospital Finder</h3>
            <p className="text-gray-300">Location-based recommendations</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: 'What Makes Us Different',
    subtitle: 'Built Specifically for Nigerian Communities',
    content: (
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-start gap-4 bg-gradient-to-r from-green-500/20 to-transparent border-l-4 border-green-500 rounded-lg p-5">
            <div className="text-2xl text-green-400 mt-1">✓</div>
            <div>
              <h3 className="text-lg font-bold mb-1 text-white">Nigerian Pidgin Support</h3>
              <p className="text-gray-300">First AI health assistant in Pidgin - speaks your language</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-gradient-to-r from-blue-500/20 to-transparent border-l-4 border-blue-500 rounded-lg p-5">
            <div className="text-2xl text-blue-400 mt-1">✓</div>
            <div>
              <h3 className="text-lg font-bold mb-1 text-white">WHO Clinical Guidelines</h3>
              <p className="text-gray-300">Evidence-based advice for tropical diseases (malaria, typhoid)</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-gradient-to-r from-purple-500/20 to-transparent border-l-4 border-purple-500 rounded-lg p-5">
            <div className="text-2xl text-purple-400 mt-1">✓</div>
            <div>
              <h3 className="text-lg font-bold mb-1 text-white">No Registration Required</h3>
              <p className="text-gray-300">Start immediately - no sign-up, no data storage, completely anonymous</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-gradient-to-r from-orange-500/20 to-transparent border-l-4 border-orange-500 rounded-lg p-5">
            <div className="text-2xl text-orange-400 mt-1">✓</div>
            <div>
              <h3 className="text-lg font-bold mb-1 text-white">Works Offline</h3>
              <p className="text-gray-300">Emergency guidance even without internet connection</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-gradient-to-r from-pink-500/20 to-transparent border-l-4 border-pink-500 rounded-lg p-5">
            <div className="text-2xl text-pink-400 mt-1">✓</div>
            <div>
              <h3 className="text-lg font-bold mb-1 text-white">Hospital Finder</h3>
              <p className="text-gray-300">6 major Nigerian hospitals with directions and contact info</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: 'Live Demo',
    subtitle: 'See HealthAI Nigeria in Action',
    content: (
      <div className="space-y-6">
        <div className="bg-gray-800/50 border-2 border-gray-700 rounded-2xl p-6">
          <div className="aspect-video bg-gray-950 rounded-lg border-2 border-gray-700 flex items-center justify-center mb-5 overflow-hidden">
            <div className="text-center space-y-3 p-6">
              <p className="text-gray-400 text-lg">Landing Page & Chat Interface</p>
              <p className="text-gray-500 text-sm">(Add your screenshot here)</p>
              <Link href="/chat" className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
                Try Live Demo →
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <p className="text-gray-400 text-sm">Always Available</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">0₦</div>
              <p className="text-gray-400 text-sm">Completely Free</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">∞</div>
              <p className="text-gray-400 text-sm">Unlimited Use</p>
            </div>
          </div>
        </div>
        <p className="text-center text-xl text-white font-semibold">Bridging the healthcare gap in rural Nigeria</p>
      </div>
    )
  },
  {
    title: 'Thank You',
    subtitle: 'Questions?',
    content: (
      <div className="space-y-10 text-center">
        <div className="text-8xl mb-6">🇳🇬</div>
        <div className="space-y-6">
          <div>
            <p className="text-3xl font-bold text-white mb-2">Team Health Bridge</p>
            <p className="text-xl text-gray-400">Ugochukwu Mayor Chukwuemeka</p>
          </div>
          <div className="space-y-2">
            <p className="text-lg text-gray-300">mayoru24@gmail.com</p>
            <p className="text-lg text-gray-300">@MayorChristopher</p>
          </div>
          <Link href="/chat" className="inline-block px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg rounded-xl font-bold transition-colors mt-4">
            Try HealthAI Now →
          </Link>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-400">Nigeria National AI Hackathon 2025</p>
          <p className="text-sm text-gray-500 mt-2">UN SDG 3: Good Health and Well-being</p>
        </div>
      </div>
    )
  }
]

export default function PitchPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1)
      } else if (e.key === 'ArrowLeft' && currentSlide > 0) {
        setCurrentSlide(prev => prev - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide])

  const slide = slides[currentSlide]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
      {/* Main Slide */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="max-w-6xl w-full space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-medium">{slide.subtitle}</p>
          </div>
          
          <div className="mt-8">
            {slide.content}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 md:p-8 flex items-center justify-between border-t-2 border-gray-700/50 bg-gray-900/50 backdrop-blur">
        <button
          onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
          disabled={currentSlide === 0}
          className="flex items-center gap-3 px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-20 disabled:cursor-not-allowed rounded-xl transition-all font-semibold border border-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-3 rounded-full transition-all ${
                idx === currentSlide ? 'bg-green-500 w-10' : 'bg-gray-600 hover:bg-gray-500 w-3'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
          disabled={currentSlide === slides.length - 1}
          className="flex items-center gap-3 px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-20 disabled:cursor-not-allowed rounded-xl transition-all font-semibold border border-gray-700"
        >
          <span className="hidden sm:inline">Next</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Slide Counter & Branding */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-4">
        <div className="px-4 py-2 bg-gray-800/80 backdrop-blur rounded-lg border border-gray-700">
          <span className="text-white font-bold">{currentSlide + 1}</span>
          <span className="text-gray-500"> / {slides.length}</span>
        </div>
      </div>
      <div className="absolute top-6 left-6 md:top-8 md:left-8">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span className="text-green-500">HealthAI</span>
          <span className="text-gray-400">Nigeria</span>
        </div>
      </div>
    </div>
  )
}

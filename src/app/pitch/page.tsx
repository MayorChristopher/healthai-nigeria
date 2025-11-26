'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const slides = [
  {
    title: 'Health Bridge',
    subtitle: 'Medical advice when hospitals are far away',
    content: (
      <div className="space-y-8 text-center">
        <p className="text-2xl text-white font-semibold">AI-Powered Health Assistant</p>
        <p className="text-lg text-gray-400">Nigeria National AI Hackathon 2025</p>
        <p className="text-gray-500 mt-4">UN SDG 3: Good Health and Well-being</p>
      </div>
    )
  },
  {
    title: 'Team Health Bridge',
    subtitle: 'Meet the Builders',
    content: (
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
          <div className="relative w-24 h-24 rounded-full bg-green-600 mx-auto mb-4 overflow-hidden">
            <Image src="/team/mayor.jpg" alt="Mayor" width={96} height={96} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-xl font-bold mb-1">Mayor Ugochukwu</h3>
          <p className="text-green-600 text-sm mb-3">Full Stack Developer</p>
          <p className="text-xs text-gray-400">Landing page, Chat UI, Backend API, Deployment</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
          <div className="relative w-24 h-24 rounded-full bg-green-600 mx-auto mb-4 overflow-hidden">
            <Image src="/team/victor.png" alt="Victor" width={96} height={96} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-xl font-bold mb-1">Victor Chidoize</h3>
          <p className="text-green-600 text-sm mb-3">Backend Developer</p>
          <p className="text-xs text-gray-400">Backend API, AI logic, Gemini integration, Emergency detection</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
          <div className="relative w-24 h-24 rounded-full bg-green-600 mx-auto mb-4 overflow-hidden">
            <Image src="/team/comfort.jpg" alt="Comfort" width={96} height={96} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-xl font-bold mb-1">Asiribo Comfort</h3>
          <p className="text-green-600 text-sm mb-3">Documentation & Frontend</p>
          <p className="text-xs text-gray-400">Documentation, Chat UI, Frontend styling, User guides</p>
        </div>
      </div>
    )
  },
  {
    title: 'The Problem',
    subtitle: 'Healthcare Challenges in Rural Nigeria',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-red-500/10 border-2 border-red-500/40 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2 text-white">Improper Medical Guidance</h3>
          <p className="text-gray-300">Limited access to medical professionals</p>
        </div>
        <div className="bg-red-500/10 border-2 border-red-500/40 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2 text-white">Inaccurate Symptom Analysis</h3>
          <p className="text-gray-300">No tools for emergency detection</p>
        </div>
        <div className="bg-red-500/10 border-2 border-red-500/40 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2 text-white">Distance from Hospitals</h3>
          <p className="text-gray-300">Many live far from healthcare facilities</p>
        </div>
        <div className="bg-red-500/10 border-2 border-red-500/40 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2 text-white">Language Barrier</h3>
          <p className="text-gray-300">Info not in local languages</p>
        </div>
      </div>
    )
  },
  {
    title: 'Our Solution',
    subtitle: 'AI-Powered Healthcare Access',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-green-600/10 border-2 border-green-600/40 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2 text-white">W.H.O Medical Guidance</h3>
          <p className="text-gray-300">Well-defined AI symptom analysis</p>
        </div>
        <div className="bg-green-600/10 border-2 border-green-600/40 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2 text-white">Nigerian Pidgin Support</h3>
          <p className="text-gray-300">Breaking language barriers</p>
        </div>
        <div className="bg-green-600/10 border-2 border-green-600/40 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2 text-white">Emergency Detection</h3>
          <p className="text-gray-300">Auto-identifies critical symptoms</p>
        </div>
        <div className="bg-green-600/10 border-2 border-green-600/40 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2 text-white">Hospital Finder</h3>
          <p className="text-gray-300">Location-based recommendations</p>
        </div>
        <div className="bg-green-600/10 border-2 border-green-600/40 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2 text-white">Voice Recognition</h3>
          <p className="text-gray-300">Speak your symptoms hands-free</p>
        </div>
      </div>
    )
  },
  {
    title: 'Technology Stack',
    subtitle: 'Built with Modern Tools',
    content: (
      <div className="flex flex-wrap justify-center gap-4">
        {['Next.js 14', 'TypeScript', 'Google Gemini AI', 'Tailwind CSS', 'Vercel'].map((tech) => (
          <div key={tech} className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-lg">
            {tech}
          </div>
        ))}
      </div>
    )
  },
  {
    title: 'User Flow',
    subtitle: 'How It Works',
    content: (
      <div className="flex items-center justify-center gap-3">
        <div className="bg-green-600/20 border-2 border-green-600 rounded-xl p-3 text-center w-36">
          <p className="font-bold text-xs">User Visits Site</p>
        </div>
        <div className="h-0.5 w-6 bg-green-600"></div>
        <div className="bg-green-600/20 border-2 border-green-600 rounded-xl p-3 text-center w-36">
          <p className="font-bold text-xs">Describes Symptoms</p>
          <p className="text-[10px] text-gray-400 mt-1">English/Pidgin</p>
        </div>
        <div className="h-0.5 w-6 bg-green-600"></div>
        <div className="bg-green-600/20 border-2 border-green-600 rounded-xl p-3 text-center w-36">
          <p className="font-bold text-xs">Gemini AI Analysis</p>
          <p className="text-[10px] text-gray-400 mt-1">W.H.O Guidelines</p>
        </div>
        <div className="h-0.5 w-6 bg-green-600"></div>
        <div className="bg-green-600/20 border-2 border-green-600 rounded-xl p-3 text-center w-36">
          <p className="font-bold text-xs">Response Filter</p>
          <p className="text-[10px] text-gray-400 mt-1">Safety Check</p>
        </div>
        <div className="h-0.5 w-6 bg-green-600"></div>
        <div className="bg-green-600/20 border-2 border-green-600 rounded-xl p-3 text-center w-36">
          <p className="font-bold text-xs">Emergency Detection</p>
        </div>
        <div className="h-0.5 w-6 bg-green-600"></div>
        <div className="bg-green-600 border-2 border-green-600 rounded-xl p-3 text-center w-36">
          <p className="font-bold text-xs">Guidance</p>
        </div>
      </div>
    )
  },
  {
    title: 'Competitors',
    subtitle: 'Market Landscape',
    content: (
      <div className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ada Health</h3>
          <p className="text-gray-400">Global symptom checker</p>
        </div>
        <div className="bg-green-600/10 border-2 border-green-600/40 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-3 text-green-600">Our Advantage</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Nigerian Pidgin support</li>
            <li>• Local hospital integration</li>
            <li>• No registration required</li>
            <li>• Built for rural Nigeria</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: 'Market Opportunities',
    subtitle: 'Revenue Streams',
    content: (
      <div className="space-y-4">
        {[
          'Consultation & Medical Advising',
          'Health Guidance Services',
          'Emergency Prediction & Alerts',
          'Hospital Recommendations',
          'Language Translation Services'
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-green-600 text-2xl">✓</div>
            <p className="text-lg">{item}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    title: 'Unique Selling Points',
    subtitle: 'What Makes Us Different',
    content: (
      <div className="space-y-3">
        {[
          'Hospital finder based on location',
          'Infrastructure & connectivity optimized',
          'Handling public health crises',
          'Language barrier breakthrough',
          'Free registration - no barriers to access'
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-4 bg-gradient-to-r from-green-600/20 to-transparent border-l-4 border-green-600 rounded-lg p-4">
            <div className="text-green-600 text-xl mt-1">✓</div>
            <p className="text-lg">{item}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    title: 'Business Model',
    subtitle: 'Sustainable Revenue Strategy',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2">Freemium Model</h3>
          <p className="text-gray-400">Basic free, premium features paid</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2">Subscription Model</h3>
          <p className="text-gray-400">Monthly/yearly plans</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2">PPP with Hospitals</h3>
          <p className="text-gray-400">Public-private partnerships</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2">Telehealth Services</h3>
          <p className="text-gray-400">Integrated consultation</p>
        </div>
      </div>
    )
  },
  {
    title: 'Marketing Strategy',
    subtitle: 'Building Trust & Reach',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-3">Clinical Validation</h3>
          <p className="text-gray-400">Build trust through medical expert partnerships</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-3">Accessibility</h3>
          <p className="text-gray-400">Free, no registration, available 24/7</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-3">Social Impact</h3>
          <p className="text-gray-400">Improving healthcare in rural communities</p>
        </div>
      </div>
    )
  },
  {
    title: 'Target Audience',
    subtitle: 'Who We Serve',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-bold mb-2">Patients</h3>
          <p className="text-gray-400">Rural communities needing medical guidance</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
          <div className="text-4xl mb-4">🏥</div>
          <h3 className="text-xl font-bold mb-2">Hospitals</h3>
          <p className="text-gray-400">Partnership for patient referrals</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
          <div className="text-4xl mb-4">👨⚕️</div>
          <h3 className="text-xl font-bold mb-2">Doctors</h3>
          <p className="text-gray-400">Teleconsultation services</p>
        </div>
      </div>
    )
  },
  {
    title: 'Traction & Validation',
    subtitle: 'Expert Reviews & Progress',
    content: (
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-600/10 border-2 border-green-600/40 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">👨⚕️</div>
              <div>
                <h3 className="text-lg font-bold text-green-400">Medical Expert</h3>
                <p className="text-sm text-gray-400">Dr. Leonard Okonkwo</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3">Senior Registrar, Department of Surgery<br/>Federal Medical Centre, Umuahia</p>
            <p className="text-sm text-gray-300 italic">"Gave accurate results and analysis. Recommend adding more hospitals including private hospital partnerships."</p>
          </div>
          <div className="bg-blue-600/10 border-2 border-blue-600/40 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🤖</div>
              <div>
                <h3 className="text-lg font-bold text-blue-400">AI Expert</h3>
                <p className="text-sm text-gray-400">Technical Validation</p>
              </div>
            </div>
            <p className="text-sm text-gray-300">Validated AI implementation, response filtering, and emergency detection systems</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-green-600/40 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">💡</div>
            <p className="font-bold text-sm">Ideation</p>
          </div>
          <div className="bg-white/5 border border-green-600/40 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🎨</div>
            <p className="font-bold text-sm">Design</p>
          </div>
          <div className="bg-white/5 border border-green-600/40 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">⚙️</div>
            <p className="font-bold text-sm">Implementation</p>
          </div>
          <div className="bg-white/5 border border-green-600/40 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🧪</div>
            <p className="font-bold text-sm">Testing</p>
          </div>
          <div className="bg-white/5 border border-green-600/40 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">📊</div>
            <p className="font-bold text-sm">Validation</p>
          </div>
          <div className="bg-white/5 border border-green-600/40 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🚀</div>
            <p className="font-bold text-sm">Deployment</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: 'What We Need',
    subtitle: 'Next Steps for Growth',
    content: (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="bg-white/5 border-2 border-white/10 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-4 text-green-600">💰 Funding</h3>
          <p className="text-gray-300 text-lg">Investment to scale infrastructure, expand features, and reach more communities</p>
        </div>
        <div className="bg-white/5 border-2 border-white/10 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-4 text-green-600">🤝 Partnerships</h3>
          <p className="text-gray-300 text-lg">Hospital collaborations for patient referrals and clinical validation</p>
        </div>
        <div className="bg-white/5 border-2 border-white/10 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-4 text-green-600">🎓 Mentorship</h3>
          <p className="text-gray-300 text-lg">Guidance from healthcare and AI experts to refine our solution</p>
        </div>
      </div>
    )
  },
  {
    title: 'Thank You',
    subtitle: 'Try HealthAI Now',
    content: (
      <div className="space-y-10 text-center">
        <div className="text-8xl mb-6">🇳🇬</div>
        <div className="space-y-6">
          <p className="text-4xl font-bold text-white">Team Health Bridge</p>
          <Link href="/chat" className="inline-block px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg rounded-xl font-bold transition-colors mt-4">
            Try HealthAI Now →
          </Link>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10">
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
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative z-10">
        <div className="max-w-6xl w-full space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-medium">{slide.subtitle}</p>
          </div>
          <div className="mt-8">{slide.content}</div>
        </div>
      </div>

      <div className="p-6 md:p-8 flex items-center justify-between border-t border-white/10 bg-black/50 backdrop-blur relative z-10">
        <button
          onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
          disabled={currentSlide === 0}
          className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed rounded-lg transition-all font-semibold border border-white/10"
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
                idx === currentSlide ? 'bg-green-600 w-10' : 'bg-gray-600 hover:bg-gray-500 w-3'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
          disabled={currentSlide === slides.length - 1}
          className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed rounded-lg transition-all font-semibold border border-white/10"
        >
          <span className="hidden sm:inline">Next</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
        <div className="px-4 py-2 bg-black/80 backdrop-blur rounded-lg border border-white/10">
          <span className="text-white font-bold">{currentSlide + 1}</span>
          <span className="text-gray-500"> / {slides.length}</span>
        </div>
      </div>
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span className="text-green-600">Health</span>
          <span className="text-gray-400">Bridge</span>
        </div>
      </div>
    </div>
  )
}

'use client'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

// Hospital Card Component
function HospitalCard({ hospital }: { hospital: any }) {
  return (
    <div className="group bg-white/5 p-6 rounded-xl border border-white/10 hover:border-green-600/50 hover:bg-white/10 transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold mb-0.5">{hospital.name}</h4>
          <p className="text-xs text-gray-600">{hospital.address}, {hospital.state}</p>
        </div>
        <div className="px-2 py-1 bg-green-600/10 border border-green-600/20 rounded text-green-600 text-xs whitespace-nowrap">
          24/7
        </div>
      </div>
      <div className="space-y-2 mt-4">
        <a 
          href={`tel:${hospital.phone.replace(/\s/g, '')}`}
          className="flex items-center gap-2 text-sm text-green-600 hover:text-green-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{hospital.phone}</span>
        </a>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${hospital.coords}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Get Directions</span>
        </a>
      </div>
    </div>
  )
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [showAllNational, setShowAllNational] = useState(false)
  const [showAllTeaching, setShowAllTeaching] = useState(false)
  const [showAllFederal, setShowAllFederal] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -100px 0px' }
    )

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Nav */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-200 ${
        scrolled ? 'bg-black/60 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-base sm:text-lg font-semibold hover:opacity-80 transition-opacity relative z-10">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            HealthAI Nigeria
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-6">
            <Link href="#problem" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">
              Problem
            </Link>
            <Link href="#hospitals" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">
              Hospitals
            </Link>
            <Link 
              href="/chat" 
              className="text-xs sm:text-sm bg-white text-black px-3 sm:px-4 py-1.5 rounded-md hover:bg-gray-200 transition-colors font-medium whitespace-nowrap"
            >
              Chat
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
              </span>
              <span className="text-gray-400">Free • No Registration</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 sm:mb-8 tracking-tight">
              Medical advice
              <br />
              when hospitals
              <br />
              are far away
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-10 leading-relaxed max-w-2xl">
              AI-powered symptom analysis in English and Pidgin. Emergency detection. 
              Hospital finder. Available 24/7 across Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/chat" 
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 sm:px-8 py-3 rounded-md text-sm sm:text-base font-medium hover:bg-gray-200 transition-colors"
              >
                Start Consultation
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                href="#problem" 
                className="inline-flex items-center justify-center gap-2 border border-white/10 px-6 sm:px-8 py-3 rounded-md text-sm sm:text-base font-medium hover:bg-white/5 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Connecting Thread */}
      <div className="relative h-24 flex items-center justify-center">
        <div className="w-1 md:w-0.5 h-full bg-gradient-to-b from-transparent via-green-600 to-transparent opacity-80 md:opacity-60"></div>
      </div>

      {/* Problem Statement */}
      <section id="problem" className="relative py-16 sm:py-24 px-4 sm:px-6 fade-in">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-md text-xs text-red-400">
                The Problem
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Healthcare is out of reach for millions</h2>
              <div className="space-y-6 text-lg text-gray-400">
                <p>
                  In rural Nigeria, over 60% of people live more than 5km from the nearest hospital. 
                  When medical emergencies happen at night, families don't know what to do.
                </p>
                <p>
                  Language barriers, lack of information, and distance to healthcare facilities 
                  create life-threatening delays in getting proper medical attention.
                </p>
              </div>
            </div>
            <div className="bg-white/5 p-6 sm:p-8 lg:p-10 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold mb-8">The Reality</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-bold text-red-400 mb-2">5km+</div>
                  <div className="text-sm text-gray-400">Average distance to nearest hospital in rural areas</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-red-400 mb-2">Night</div>
                  <div className="text-sm text-gray-400">When most emergencies happen with no help available</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">Now</div>
                  <div className="text-sm text-gray-400">HealthAI provides instant guidance, 24/7</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* How it Works */}
      <section id="how" className="relative py-16 sm:py-24 px-4 sm:px-6 fade-in">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">How it works</h2>
            <p className="text-lg text-gray-400">Simple, fast, and built for Nigerian communities</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Chat Demo */}
            <div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-600/20 to-blue-500/20 blur-3xl opacity-30"></div>
                <div className="relative bg-zinc-900 rounded-xl border border-white/10 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-green-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium">HealthAI Assistant</div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                          Powered by Google Gemini
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-5 space-y-4 h-80 overflow-y-auto">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-green-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                        AI
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                        <p className="text-sm">Wetin dey worry you? Tell me your symptoms.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <div className="bg-green-600/20 border border-green-600/30 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                        <p className="text-sm">I get headache and fever since yesterday</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0"></div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-green-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                        AI
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                        <p className="text-sm mb-3">Based on your symptoms, this could be a viral infection. I recommend:</p>
                        <ul className="text-sm space-y-1 text-gray-300">
                          <li>• Rest and stay hydrated</li>
                          <li>• Take paracetamol for fever</li>
                          <li>• Monitor temperature</li>
                        </ul>
                        <p className="text-xs text-gray-400 mt-3">⚠️ If symptoms worsen, visit a hospital immediately.</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-4 border-t border-white/10">
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2.5">
                      <input 
                        type="text" 
                        placeholder="Describe your symptoms..." 
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
                        disabled
                      />
                      <button className="text-green-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-12">
              <div>
                <div className="text-green-600 text-xs mb-3">Multilingual</div>
                <h3 className="text-2xl font-bold mb-3">English and Pidgin support</h3>
                <p className="text-gray-400">Communicate in the language you're most comfortable with. Our AI understands both English and Nigerian Pidgin.</p>
              </div>

              <div>
                <div className="text-green-600 text-xs mb-3">Emergency Detection</div>
                <h3 className="text-2xl font-bold mb-3">Automatic critical symptom identification</h3>
                <p className="text-gray-400">The AI detects emergency symptoms like chest pain, severe bleeding, or difficulty breathing and immediately recommends calling 112 and nearby hospitals.</p>
              </div>

              <div>
                <div className="text-green-600 text-xs mb-3">AI Safety Features</div>
                <h3 className="text-2xl font-bold mb-3">Built-in response filtering & validation</h3>
                <p className="text-gray-400">Advanced safety filters automatically add medical disclaimers, correct grammar, detect dangerous advice, and ensure emergency guidance includes 112 contact.</p>
              </div>

              <div>
                <div className="text-green-600 text-xs mb-3">When to Seek Care</div>
                <h3 className="text-2xl font-bold mb-3">Clear guidance on next steps</h3>
                <p className="text-gray-400">Get advice on whether to self-care at home, visit a pharmacy, schedule a doctor visit, or go to emergency immediately.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Hospital Network */}
      <section id="hospitals" className="relative py-16 sm:py-24 px-4 sm:px-6 fade-in">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-400">
              Hospital Network
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Find care near you</h2>
            <p className="text-lg text-gray-400">Teaching hospitals and federal medical centers across Nigeria with emergency services</p>
          </div>

          {/* National & Specialist Hospitals */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              National & Specialist Hospitals
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "National Hospital Abuja", state: "FCT", phone: "+234 9 461 2200", address: "Central Area", coords: "9.0579,7.4951" },
                { name: "National Orthopaedic Hospital", state: "Lagos", phone: "+234 1 497 4221", address: "Igbobi", coords: "6.5244,3.3792" }
              ].slice(0, showAllNational ? 2 : 1).map((hospital, i) => (
                <HospitalCard key={i} hospital={hospital} />
              ))}
            </div>
            {!showAllNational && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowAllNational(true)}
                  className="text-sm text-green-600 hover:text-green-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Show 1 more hospital
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Teaching Hospitals */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              University Teaching Hospitals
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "LUTH Lagos", state: "Lagos", phone: "+234 1 263 2626", address: "Idi-Araba, Mushin", coords: "6.5244,3.3792" },
                { name: "UCH Ibadan", state: "Oyo", phone: "+234 2 241 3545", address: "Queen Elizabeth Rd", coords: "7.3775,3.9470" },
                { name: "UNTH Enugu", state: "Enugu", phone: "+234 42 252 3165", address: "Ituku-Ozalla", coords: "6.4281,7.5243" },
                { name: "ABUTH Zaria", state: "Kaduna", phone: "+234 69 550 477", address: "Zaria-Kaduna Rd", coords: "11.0667,7.7000" },
                { name: "AKTH Kano", state: "Kano", phone: "+234 64 664 430", address: "Kano", coords: "12.0022,8.5920" },
                { name: "UPTH Port Harcourt", state: "Rivers", phone: "+234 84 462 638", address: "Port Harcourt", coords: "4.8156,7.0498" },
                { name: "OAUTH Ile-Ife", state: "Osun", phone: "+234 36 230 210", address: "Ile-Ife", coords: "7.4905,4.5600" },
                { name: "JUTH Jos", state: "Plateau", phone: "+234 73 610 379", address: "Jos", coords: "9.8965,8.8583" }
              ].slice(0, showAllTeaching ? 8 : 3).map((hospital, i) => (
                <HospitalCard key={i} hospital={hospital} />
              ))}
            </div>
            <div className="flex justify-center mt-4">
              {!showAllTeaching ? (
                <button
                  onClick={() => setShowAllTeaching(true)}
                  className="text-sm text-green-600 hover:text-green-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Show 5 more hospitals
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => setShowAllTeaching(false)}
                  className="text-sm text-gray-500 hover:text-gray-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Show less
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Federal Medical Centers */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              Federal Medical Centers
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "FMC Owerri", state: "Imo", phone: "+234 83 230 092", address: "Owerri", coords: "5.4840,7.0351" },
                { name: "FMC Umuahia", state: "Abia", phone: "+234 88 220 134", address: "Umuahia", coords: "5.5250,7.4896" },
                { name: "NAUTH Nnewi", state: "Anambra", phone: "+234 46 460 674", address: "Nnewi", coords: "6.0177,6.9178" },
                { name: "ABSUTH Aba", state: "Abia", phone: "+234 82 220 456", address: "Aba", coords: "5.1066,7.3667" },
                { name: "UCTH Calabar", state: "Cross River", phone: "+234 87 239 009", address: "Calabar", coords: "4.9517,8.3417" }
              ].slice(0, showAllFederal ? 5 : 2).map((hospital, i) => (
                <HospitalCard key={i} hospital={hospital} />
              ))}
            </div>
            {!showAllFederal && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowAllFederal(true)}
                  className="text-sm text-green-600 hover:text-green-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Show 3 more hospitals
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="mt-16 text-center">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-400">National (2)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-400">Teaching (8)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-gray-400">Federal (3)</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">15 major hospitals across Nigeria's 6 geopolitical zones</p>
            <p className="text-xs text-gray-600">Hospital information verified • Updated regularly • Emergency services available 24/7</p>
          </div>

          {/* Hospital Card Component */}
          <div className="hidden">
            {/* This is just for the component definition */}
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Technical Reliability */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 fade-in">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Built for Reliability</h2>
            <p className="text-gray-400">Advanced safety systems ensure you get help even when technology fails</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="text-blue-500 mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Response Filtering</h3>
              <p className="text-sm text-gray-400">Automatically adds safety disclaimers, corrects grammar, and blocks dangerous medical advice before reaching users.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="text-red-500 mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Emergency Fallback</h3>
              <p className="text-sm text-gray-400">If AI fails during emergencies, system provides pre-written emergency guidance and hospital contacts in English or Pidgin.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="text-green-600 mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Multiple AI Models</h3>
              <p className="text-sm text-gray-400">Uses multiple Gemini models with automatic fallback. If one fails, another takes over seamlessly for uninterrupted service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* AI Limitations */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 fade-in">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center">How our AI works</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="text-green-600 mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">What it can do</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Analyze symptoms with WHO guidelines</li>
                  <li>• Auto-detect medical emergencies</li>
                  <li>• Filter responses for safety</li>
                  <li>• Work even when AI fails (emergency fallback)</li>
                  <li>• Communicate in English & Pidgin</li>
                  <li>• Find nearest hospitals with directions</li>
                </ul>
              </div>
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="text-red-400 mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">What it cannot do</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Diagnose medical conditions</li>
                  <li>• Prescribe medications</li>
                  <li>• Replace doctor visits</li>
                  <li>• Guarantee accuracy</li>
                  <li>• Handle all emergencies</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Powered by{' '}
                <a 
                  href="https://ai.google.dev/gemini-api/terms" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-400 transition-colors"
                >
                  Google Gemini API
                </a>
                {' '}• AI responses may contain errors • Always verify with healthcare professionals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Safety Disclaimer */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 fade-in">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-yellow-500">Important Medical Disclaimer</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• HealthAI is NOT a replacement for professional medical care</p>
                  <p>• This tool provides general health information only</p>
                  <p>• For emergencies, always call <strong>112</strong> (Nigeria's emergency number) or visit the nearest hospital immediately</p>
                  <p>• Consult a licensed healthcare provider for diagnosis and treatment</p>
                  <p>• We do not store your conversations or personal health data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Team Section */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 fade-in">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Meet Health Bridge</h2>
            <p className="text-gray-400">Building AI-powered healthcare solutions for Nigeria</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/5 p-6 md:p-8 rounded-xl border border-white/10">
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-green-600 flex items-center justify-center text-2xl font-bold mb-4 overflow-hidden">
                <img 
                  src="/team/mayor.jpg"
                  alt="Mayor Ugochukwu"
                  className="absolute inset-0 w-full h-full object-cover z-20"
                  onError={(e) => { 
                    e.currentTarget.style.display = 'none'
                    const parent = e.currentTarget.parentElement
                    if (parent) {
                      const letter = parent.querySelector('.avatar-letter')
                      if (letter) (letter as HTMLElement).style.display = 'flex'
                    }
                  }}
                />
                <span className="avatar-letter absolute inset-0 hidden items-center justify-center">M</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Mayor Ugochukwu</h3>
              <p className="text-green-600 text-sm mb-4">Full Stack Developer</p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Landing page & UI/UX</li>
                <li>• Chat interface</li>
                <li>• Backend API</li>
                <li>• Deployment</li>
              </ul>
            </div>
            <div className="bg-white/5 p-6 md:p-8 rounded-xl border border-white/10">
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl font-bold mb-4 overflow-hidden">
                <img 
                  src="/team/victor.jpg"
                  alt="Victor"
                  className="absolute inset-0 w-full h-full object-cover z-20"
                  onError={(e) => { 
                    e.currentTarget.style.display = 'none'
                    const parent = e.currentTarget.parentElement
                    if (parent) {
                      const letter = parent.querySelector('.avatar-letter')
                      if (letter) (letter as HTMLElement).style.display = 'flex'
                    }
                  }}
                />
                <span className="avatar-letter absolute inset-0 hidden items-center justify-center">V</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Victor Chidoize</h3>
              <p className="text-blue-500 text-sm mb-4">Backend Developer</p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Backend API</li>
                <li>• Adaptive AI logic</li>
                <li>• Gemini integration</li>
                <li>• Emergency detection</li>
              </ul>
            </div>
            <div className="bg-white/5 p-6 md:p-8 rounded-xl border border-white/10">
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-2xl font-bold mb-4 overflow-hidden">
                <img 
                  src="/team/comfort.jpg"
                  alt="Comfort"
                  className="absolute inset-0 w-full h-full object-cover z-20"
                  onError={(e) => { 
                    e.currentTarget.style.display = 'none'
                    const parent = e.currentTarget.parentElement
                    if (parent) {
                      const letter = parent.querySelector('.avatar-letter')
                      if (letter) (letter as HTMLElement).style.display = 'flex'
                    }
                  }}
                />
                <span className="avatar-letter absolute inset-0 hidden items-center justify-center">C</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Asiribo Comfort</h3>
              <p className="text-purple-500 text-sm mb-4">Documentation & Frontend</p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Project documentation</li>
                <li>• Chat UI components</li>
                <li>• Frontend styling</li>
                <li>• User guides</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Tech Stack */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 fade-in">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-400">
              Built for Nigeria National AI Hackathon 2025
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Technology Stack</h2>
            <p className="text-gray-400">Addressing UN SDG 3: Good Health and Well-being</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {['Next.js 14', 'TypeScript', 'Google Gemini AI', 'Tailwind CSS', 'Vercel'].map((tech) => (
              <div key={tech} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* CTA */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 fade-in">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-[1.1]">
            Get medical advice
            <br />
            right now
          </h2>
          <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-12">
            Free. No registration. Available 24/7 across Nigeria.
          </p>
          <Link 
            href="/chat" 
            className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 sm:px-8 py-3 rounded-md text-base sm:text-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Launch Chat
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 sm:py-16 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
            <div className="max-w-sm">
              <div className="flex items-center gap-2 text-xl font-semibold mb-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                HealthAI Nigeria
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                AI-powered medical assistant for Nigerian communities. Built for Nigeria National AI Hackathon 2025.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
              <div>
                <div className="text-xs text-gray-500 mb-3">Product</div>
                <div className="space-y-2">
                  <div><Link href="/chat" className="text-sm text-gray-400 hover:text-white transition-colors">Chat</Link></div>
                  <div><Link href="#hospitals" className="text-sm text-gray-400 hover:text-white transition-colors">Hospitals</Link></div>
                  <div><Link href="#how" className="text-sm text-gray-400 hover:text-white transition-colors">How it works</Link></div>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500 mb-3">Resources</div>
                <div className="space-y-2">
                  <div><Link href="#problem" className="text-sm text-gray-400 hover:text-white transition-colors">About</Link></div>
                  <div>
                    <a 
                      href="https://github.com/MayorChristopher/healthai-nigeria" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  </div>
                  <div>
                    <a 
                      href="mailto:mayoru24@gmail.com" 
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Contact
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-3">Emergency</div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Call <span className="text-green-600">112</span></p>
                  <p className="text-sm text-gray-400">Nigeria Emergency Line</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <div>
              © 2025 HealthAI Nigeria • Built by{' '}
              <span className="text-gray-400">
                Health Bridge Team
              </span>
            </div>
            <div>
              Uses{' '}
              <a 
                href="https://ai.google.dev/gemini-api/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Google Gemini API
              </a>
              {' '}• Not endorsed by Google
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

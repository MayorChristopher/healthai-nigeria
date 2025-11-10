'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type Hospital = {
  name: string
  phone: string
  address: string
  coords: string
  distance?: string
}

type Message = {
  role: 'user' | 'ai'
  content: string
  isEmergency?: boolean
  hospitals?: Hospital[]
  onlineDoctors?: boolean
  timestamp?: Date
  feedback?: 'helpful' | 'not-helpful' | null
}

export default function ChatPage() {
  const [termsAccepted, setTermsAccepted] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('healthai-terms-accepted') === 'true'
    }
    return false
  })
  const [language, setLanguage] = useState<'auto' | 'english' | 'pidgin'>(() => {
    if (typeof window !== 'undefined') {
      return (sessionStorage.getItem('healthai-language') as any) || 'auto'
    }
    return 'auto'
  })
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('healthai-messages')
      if (saved) return JSON.parse(saved)
    }
    return [{ role: 'ai', content: "Hello! I'm HealthAI. Tell me your symptoms in English or Pidgin, and I'll help you understand what might be happening." }]
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = sessionStorage.getItem('healthai-session')
      if (!id) {
        id = Math.random().toString(36)
        sessionStorage.setItem('healthai-session', id)
      }
      return id
    }
    return Math.random().toString(36)
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('healthai-messages', JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight
      setShowScrollTop(scrollTop > 300 && scrollTop < scrollHeight - clientHeight - 100)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, sessionId, language })
      })

      if (!res.ok) throw new Error('Network response was not ok')

      const data = await res.json()
      
      setMessages(prev => [...prev, {
        role: 'ai',
        content: data.response,
        isEmergency: data.isEmergency,
        hospitals: data.hospitals,
        onlineDoctors: data.onlineDoctors,
        timestamp: new Date()
      }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: "Sorry, I couldn't process that. Please check your connection and try again.",
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }

  // Terms acceptance modal
  if (!termsAccepted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Before You Continue</h1>
          
          <div className="space-y-6 mb-8">
            <div className="border-l-4 border-red-500 pl-4">
              <p className="text-red-500 font-bold mb-2">⚠️ This is a prototype</p>
              <p className="text-gray-400 text-sm">Built in 48 hours for a hackathon. Not validated by medical professionals.</p>
            </div>

            <div className="space-y-3 text-gray-400 text-sm">
              <p>By using HealthAI, you understand:</p>
              <ul className="space-y-2 pl-4">
                <li>• This is NOT a medical device</li>
                <li>• AI can make mistakes</li>
                <li>• Always consult healthcare professionals</li>
                <li>• Creators assume no liability</li>
              </ul>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="text-yellow-500 font-bold mb-2">For emergencies: Call 112</p>
              <p className="text-gray-400 text-sm">Do not rely on this app for emergency medical decisions.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link 
              href="/" 
              className="flex-1 border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/5 transition-colors text-center"
            >
              Go Back
            </Link>
            <button
              onClick={() => {
                sessionStorage.setItem('healthai-terms-accepted', 'true')
                setTermsAccepted(true)
              }}
              className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Medical Disclaimer Banner */}
      <div className="bg-yellow-500/10 border-b border-yellow-500/20 p-2">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-yellow-500">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>Not a diagnosis tool. For emergencies, call 112 immediately.</span>
        </div>
      </div>
      
      {/* Header */}
      <div className="border-b border-white/10 p-3 md:p-4 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">HealthAI Chat</h1>
            <p className="text-xs text-gray-500">Powered by Google Gemini AI</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex border border-white/10 rounded-lg overflow-hidden">
              <button
                onClick={() => {
                  setLanguage('auto')
                  sessionStorage.setItem('healthai-language', 'auto')
                }}
                className={`px-3 py-1 text-xs transition-colors ${
                  language === 'auto' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              >
                Auto
              </button>
              <button
                onClick={() => {
                  setLanguage('english')
                  sessionStorage.setItem('healthai-language', 'english')
                }}
                className={`px-3 py-1 text-xs border-l border-white/10 transition-colors ${
                  language === 'english' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => {
                  setLanguage('pidgin')
                  sessionStorage.setItem('healthai-language', 'pidgin')
                }}
                className={`px-3 py-1 text-xs border-l border-white/10 transition-colors ${
                  language === 'pidgin' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              >
                PG
              </button>
            </div>
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              ← Home
            </Link>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                  AI
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-green-500/20 border border-green-500/30'
                    : msg.isEmergency
                    ? 'bg-red-500/20 border border-red-500/30'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {msg.isEmergency && (
                  <div className="border-l-4 border-red-500 pl-3 mb-3">
                    <p className="text-red-500 font-bold text-sm">⚠️ Emergency</p>
                  </div>
                )}
                <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                
                {/* AI Response Disclaimer */}
                {msg.role === 'ai' && !msg.isEmergency && (
                  <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-white/10">
                    ⚠️ This is guidance, not medical diagnosis. Consult a healthcare professional.
                  </p>
                )}
                
                {/* Hospital Recommendations */}
                {msg.hospitals && msg.hospitals.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                    <p className="text-sm text-gray-400">Hospitals:</p>
                    {msg.hospitals.map((hospital, idx) => (
                      <div key={idx} className="space-y-1">
                        <p className="text-sm font-medium">{hospital.name}</p>
                        <p className="text-xs text-gray-500">{hospital.address}</p>
                        <div className="flex gap-2">
                          <a
                            href={`tel:${hospital.phone.replace(/\s/g, '')}`}
                            className="text-xs text-green-500 hover:underline"
                          >
                            Call {hospital.phone}
                          </a>
                          <span className="text-gray-600">•</span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${hospital.coords}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            Directions
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Online Doctor Suggestion */}
                {msg.onlineDoctors && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-500 mb-2">Online consultation:</p>
                    <div className="space-y-1">
                      <a href="https://www.doctorcare.ng" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-500 hover:underline">DoctorCare Nigeria</a>
                      <a href="https://www.heliumhealth.com" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-500 hover:underline">Helium Health</a>
                      <a href="https://www.kangpe.com" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-500 hover:underline">Kangpe Telemedicine</a>
                    </div>
                  </div>
                )}

                {/* Feedback Buttons (AI messages only) */}
                {msg.role === 'ai' && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Was this helpful?</span>
                    <button
                      onClick={() => {
                        const updated = [...messages]
                        updated[i].feedback = msg.feedback === 'helpful' ? null : 'helpful'
                        setMessages(updated)
                      }}
                      className={`p-1 rounded hover:bg-white/10 transition-colors ${
                        msg.feedback === 'helpful' ? 'text-green-500' : 'text-gray-500'
                      }`}
                      title="Helpful"
                    >
                      <svg className="w-4 h-4" fill={msg.feedback === 'helpful' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        const updated = [...messages]
                        updated[i].feedback = msg.feedback === 'not-helpful' ? null : 'not-helpful'
                        setMessages(updated)
                      }}
                      className={`p-1 rounded hover:bg-white/10 transition-colors ${
                        msg.feedback === 'not-helpful' ? 'text-red-500' : 'text-gray-500'
                      }`}
                      title="Not helpful"
                    >
                      <svg className="w-4 h-4" fill={msg.feedback === 'not-helpful' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                      </svg>
                    </button>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(msg.content)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                      }}
                      className="p-1 rounded hover:bg-white/10 transition-colors text-gray-500 hover:text-white relative"
                      title="Copy response"
                    >
                      {copied ? (
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}

                {/* Timestamp */}
                {msg.timestamp && (
                  <p className="text-xs text-gray-600 mt-2">
                    {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
          
          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-xs font-bold">
                AI
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.15s'}} />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}} />
                  </div>
                  <span className="text-xs text-gray-400">HealthAI is analyzing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to Bottom Button */}
        {showScrollTop && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-20 md:bottom-24 right-4 md:right-6 bg-green-500 text-white p-2.5 md:p-3 rounded-full shadow-lg hover:bg-green-600 transition-all z-20"
            aria-label="Scroll to bottom"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-3 md:p-4 bg-black/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                const target = e.target as HTMLTextAreaElement
                target.style.height = '48px'
                target.style.height = Math.min(target.scrollHeight, 120) + 'px'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !loading) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder='Describe your symptoms in English or Pidgin...'
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base outline-none focus:border-green-500/50 transition-colors placeholder:text-gray-600 resize-none overflow-hidden"
              disabled={loading}
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-green-500 text-white px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium self-end"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-600">
              For emergencies, call <span className="text-green-500 font-medium">112</span> immediately
            </p>
            <p className="text-xs text-gray-600">
              {input.length}/500 • <span className="text-gray-500">Shift+Enter for new line</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

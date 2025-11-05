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
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('healthai-messages')
      if (saved) return JSON.parse(saved)
    }
    return [{ role: 'ai', content: "Hello! I'm HealthAI. Tell me your symptoms in English or Pidgin, and I'll help you understand what might be happening.", timestamp: new Date() }]
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
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
        body: JSON.stringify({ message: userMessage, sessionId })
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-3 md:p-4 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">HealthAI Chat</h1>
            <p className="text-xs text-gray-500">Adaptive AI • Learns as you talk</p>
          </div>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Home
          </Link>
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
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-red-500/30">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-bold text-red-500">EMERGENCY DETECTED</span>
                  </div>
                )}
                <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                
                {/* Hospital Recommendations */}
                {msg.hospitals && msg.hospitals.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold text-green-500 mb-2">🏥 Nearest Hospitals:</p>
                    {msg.hospitals.map((hospital, idx) => (
                      <div key={idx} className="bg-black/30 rounded-lg p-3 border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-semibold">{hospital.name}</p>
                            <p className="text-xs text-gray-400">{hospital.address}</p>
                            {hospital.distance && (
                              <p className="text-xs text-green-500 mt-1">📍 {hospital.distance}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <a
                            href={`tel:${hospital.phone.replace(/\s/g, '')}`}
                            className="flex-1 bg-green-500/20 border border-green-500/30 text-green-500 text-xs px-3 py-1.5 rounded hover:bg-green-500/30 transition-colors text-center"
                          >
                            📞 Call Now
                          </a>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${hospital.coords}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-500 text-xs px-3 py-1.5 rounded hover:bg-blue-500/30 transition-colors text-center"
                          >
                            🗺️ Directions
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Online Doctor Suggestion */}
                {msg.onlineDoctors && (
                  <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-500 mb-2">💻 Online Consultation Available</p>
                    <p className="text-xs text-gray-400 mb-2">Consider speaking with a doctor online:</p>
                    <div className="space-y-1.5">
                      <a href="https://www.doctorcare.ng" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-400 hover:underline">• DoctorCare Nigeria</a>
                      <a href="https://www.heliumhealth.com" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-400 hover:underline">• Helium Health</a>
                      <a href="https://www.kangpe.com" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-400 hover:underline">• Kangpe Telemedicine</a>
                    </div>
                  </div>
                )}

                {/* Feedback Buttons (AI messages only) */}
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
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

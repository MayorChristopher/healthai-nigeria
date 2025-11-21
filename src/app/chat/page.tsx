'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

type Hospital = {
  name: string
  phone: string
  address: string
  coords: string
}

type Message = {
  id: string
  role: 'user' | 'ai'
  content: string
  isEmergency?: boolean
  hospitals?: Hospital[]
  onlineDoctors?: boolean
  timestamp: Date
  replyTo?: string
}

export default function ChatPage() {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [language, setLanguage] = useState<'auto' | 'english' | 'pidgin'>('auto')
  const [messages, setMessages] = useState<Message[]>([{ 
    id: '1', 
    role: 'ai', 
    content: "Hello! I'm HealthAI Nigeria 🇳🇬\n\nI'm here to help you 24/7. You can:\n• Describe your symptoms in English or Pidgin\n• Ask health questions\n• Get emergency hospital information\n\nHow are you feeling today?",
    timestamp: new Date()
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'typing' | 'offline' | 'emergency'>('online')
  const [sessionId] = useState(Math.random().toString(36))
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    setMounted(true)
    const savedTerms = sessionStorage.getItem('healthai-terms-accepted')
    const savedLanguage = sessionStorage.getItem('healthai-language')
    const savedMessages = sessionStorage.getItem('healthai-messages')
    const savedSession = sessionStorage.getItem('healthai-session')
    
    if (savedTerms) setTermsAccepted(savedTerms === 'true')
    if (savedLanguage) setLanguage(savedLanguage as any)
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
      setMessages(parsed)
    }
  }, [])

  useEffect(() => {
    if (mounted && messages.length > 1) {
      scrollToBottom()
    }
  }, [messages.length, mounted])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!isOnline) {
      setConnectionStatus('offline')
    } else if (loading) {
      setConnectionStatus('typing')
    } else if (messages.some(m => m.isEmergency)) {
      setConnectionStatus('emergency')
    } else {
      setConnectionStatus('online')
    }
  }, [isOnline, loading, messages])

  useEffect(() => {
    if (mounted) {
      sessionStorage.setItem('healthai-messages', JSON.stringify(messages))
    }
  }, [messages, mounted])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    
    const newMessage: Message = {
      id: Math.random().toString(36),
      role: 'user', 
      content: userMessage, 
      timestamp: new Date(),
      replyTo: replyingTo?.id
    }
    
    setMessages(prev => [...prev, newMessage])
    setReplyingTo(null)
    setLoading(true)

    try {
      const recentMessages = messages.slice(-8).map(m => ({
        role: m.role,
        content: m.content
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          sessionId, 
          language,
          history: recentMessages
        })
      })

      if (!res.ok) throw new Error('Network response was not ok')

      const data = await res.json()
      
      const aiMessage: Message = {
        id: Math.random().toString(36),
        role: 'ai',
        content: data.response,
        isEmergency: data.isEmergency,
        hospitals: data.hospitals,
        onlineDoctors: data.onlineDoctors,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Math.random().toString(36),
        role: 'ai',
        content: "Sorry, I couldn't process that. Please check your connection and try again.",
        timestamp: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }

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
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
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
      <div className="bg-yellow-500/10 border-b border-yellow-500/20 p-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-yellow-500">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>For emergencies, call 112</span>
        </div>
      </div>
      
      {/* Header */}
      <div className="border-b border-white/10 p-3 sm:p-4 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600 flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold">HealthAI Nigeria</h1>
                <p className="text-xs flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    connectionStatus === 'online' ? 'bg-green-600' :
                    connectionStatus === 'typing' ? 'bg-blue-500 animate-pulse' :
                    connectionStatus === 'emergency' ? 'bg-red-500 animate-pulse' :
                    'bg-gray-500'
                  }`}></span>
                  <span className={connectionStatus === 'emergency' ? 'text-red-500' : 'text-gray-500'}>
                    {connectionStatus === 'online' ? 'Online now' :
                     connectionStatus === 'typing' ? 'Typing...' :
                     connectionStatus === 'emergency' ? 'Emergency mode' :
                     'Connection lost'}
                  </span>
                </p>
              </div>
            </div>
            <Link href="/" className="text-xs sm:text-sm text-gray-400 hover:text-white">
              ← Back
            </Link>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'ai' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-600 flex-shrink-0 flex items-center justify-center self-end">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              )}
              <div className="max-w-[80%] sm:max-w-[75%]">
                {msg.replyTo && (
                  <div className={`mb-1 p-2 rounded-lg border-l-2 ${
                    msg.role === 'user' ? 'bg-green-900/30 border-green-600' : 'bg-white/5 border-white/30'
                  }`}>
                    <p className="text-xs text-gray-500">↩ {messages.find(m => m.id === msg.replyTo)?.role === 'ai' ? 'HealthAI' : 'You'}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">
                      {messages.find(m => m.id === msg.replyTo)?.content.substring(0, 100)}
                    </p>
                  </div>
                )}
                <div
                  className={`px-3 py-2.5 sm:px-4 sm:py-3 ${
                    msg.role === 'user'
                      ? 'bg-green-800/60 rounded-2xl rounded-br-sm'
                      : msg.isEmergency
                      ? 'bg-red-500/20 border border-red-500/30 rounded-2xl rounded-bl-sm'
                      : 'bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm'
                  }`}
                >
                  {msg.isEmergency && (
                    <div className="border-l-4 border-red-500 pl-3 mb-3">
                      <p className="text-red-500 font-bold text-base flex items-center gap-2">
                        <span className="text-xl">🚨</span>
                        <span>EMERGENCY - Seek immediate help!</span>
                      </p>
                    </div>
                  )}
                  <div className="text-sm sm:text-base leading-relaxed prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
                        em: ({children}) => <em className="italic">{children}</em>,
                        ul: ({children}) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
                        li: ({children}) => <li className="text-gray-300">{children}</li>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                  

                  
                  {msg.hospitals && msg.hospitals.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm font-medium text-green-600">Nearest Hospitals</p>
                      </div>
                      {msg.hospitals.map((hospital, idx) => (
                        <div key={idx} className="group bg-white/5 p-4 rounded-xl border border-white/10 hover:border-green-600/50 hover:bg-white/10 transition-all">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-white mb-1">{hospital.name}</h4>
                              <p className="text-xs text-gray-400">{hospital.address}</p>
                            </div>
                            <div className="px-2 py-1 bg-green-600/10 border border-green-600/20 rounded text-green-600 text-xs whitespace-nowrap">
                              24/7
                            </div>
                          </div>
                          <div className="space-y-2 mt-4">
                            <a
                              href={`tel:${hospital.phone.replace(/\s/g, '')}`}
                              className="flex items-center gap-2 text-sm text-green-600 hover:text-green-400 transition-colors cursor-pointer"
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
                              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>Get Directions</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1 px-1">
                  <p className="text-xs text-gray-600">
                    {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setReplyingTo(msg)}
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(msg.content)
                          setCopied(true)
                          setTimeout(() => setCopied(false), 2000)
                        }}
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                      >
                        {copied ? '✓' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-600 flex items-center justify-center self-end">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.15s'}} />
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.3s'}} />
                  </div>
                  <span className="text-sm text-gray-400">Typing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 p-3 sm:p-4 bg-black/80 backdrop-blur-md z-20">
        <div className="max-w-3xl mx-auto">
          {replyingTo && (
            <div className="mb-2 p-2 bg-white/5 border border-white/10 rounded-lg flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Replying to HealthAI:</p>
                <p className="text-xs text-gray-400 mt-1 truncate">{replyingTo.content.substring(0, 80)}</p>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-gray-500 hover:text-white flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (language === 'auto') {
                  setLanguage('english')
                  sessionStorage.setItem('healthai-language', 'english')
                } else if (language === 'english') {
                  setLanguage('pidgin')
                  sessionStorage.setItem('healthai-language', 'pidgin')
                } else {
                  setLanguage('auto')
                  sessionStorage.setItem('healthai-language', 'auto')
                }
              }}
              className="px-2.5 py-2 sm:px-3 sm:py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0 text-xs sm:text-sm font-medium text-gray-400"
            >
              {language === 'auto' ? 'Auto' : language === 'english' ? 'EN' : 'PG'}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !loading) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder='Type your message...'
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-green-600/50 transition-colors placeholder:text-gray-500"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-4 sm:px-5 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex-shrink-0"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
          <p className="text-xs text-center text-gray-600 mt-2">
            Emergency? Call <span className="text-green-600 font-bold">112</span>
          </p>
        </div>
      </div>
    </div>
  )
}

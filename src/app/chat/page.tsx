'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Message, FollowUpQuestion } from '@/types/chat'

type Hospital = {
  name: string
  phone: string
  address: string
  coords: string
  distance?: string
}

// Updated with follow-up questions and reply threading - v2.0
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
      if (saved) return JSON.parse(saved).map((msg: any) => ({
        ...msg,
        id: msg.id || Math.random().toString(36),
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
      }))
    }
    return [{ 
      id: '1', 
      role: 'ai', 
      content: "Hello! I'm HealthAI. Tell me your symptoms in English or Pidgin, and I'll help you understand what might be happening.",
      timestamp: new Date()
    }]
  })
  const [pendingFollowUp, setPendingFollowUp] = useState<FollowUpQuestion | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number, city?: string} | null>(null)

  // Update initial message when language changes
  const getInitialMessage = (lang: string) => {
    switch(lang) {
      case 'pidgin':
        return "Hello! I be HealthAI. Tell me wetin dey worry your body, I go help you understand wetin fit dey happen."
      case 'english':
        return "Hello! I'm HealthAI, your medical assistant. Please describe your symptoms in detail, and I'll help you understand what might be happening."
      default:
        return "Hello! I'm HealthAI. Tell me your symptoms in English or Pidgin, and I'll help you understand what might be happening."
    }
  }

  // Update initial message when language changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'ai') {
      const newMessage = getInitialMessage(language)
      if (messages[0].content !== newMessage) {
        setMessages([{ role: 'ai', content: newMessage }])
      }
    }
  }, [language])
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

  const sendMessage = async (isFollowUp = false, followUpContext?: string) => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    const messageId = Math.random().toString(36)
    setInput('')
    
    const newMessage: Message = {
      id: messageId,
      role: 'user', 
      content: userMessage, 
      timestamp: new Date(),
      replyToId: replyingTo || undefined,
      isFollowUpResponse: isFollowUp
    }
    
    setMessages(prev => [...prev, newMessage])
    setLoading(true)
    setReplyingTo(null)

    try {
      // Send last 6 messages for context
      const recentMessages = messages.slice(-6).map(m => ({
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
          history: recentMessages,
          userLocation,
          isFollowUpResponse: isFollowUp,
          followUpContext
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
        timestamp: new Date(),
        followUp: data.followUp,
        replyToId: replyingTo || undefined
      }
      
      setMessages(prev => [...prev, aiMessage])
      
      // Handle location data
      if (data.processedLocation) {
        setUserLocation(data.processedLocation)
      }
      
      // Set pending follow-up
      if (data.followUp) {
        setPendingFollowUp(data.followUp)
      } else {
        setPendingFollowUp(null)
      }
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

  // Terms acceptance modal
  if (!termsAccepted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-2xl w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center">Before You Continue</h1>
          
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

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link 
              href="/" 
              className="flex-1 border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/5 transition-colors text-center min-h-[48px] flex items-center justify-center"
            >
              Go Back
            </Link>
            <button
              onClick={() => {
                sessionStorage.setItem('healthai-terms-accepted', 'true')
                setTermsAccepted(true)
              }}
              className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium min-h-[48px] flex items-center justify-center"
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
      <div className="border-b border-white/10 p-4 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">HealthAI</h1>
                <p className="text-xs text-gray-500">AI Medical Assistant</p>
              </div>
            </div>
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              ← Home
            </Link>
          </div>
          <div className="flex border border-white/10 rounded-lg overflow-hidden w-full">
            <button
              onClick={() => {
                setLanguage('auto')
                sessionStorage.setItem('healthai-language', 'auto')
              }}
              className={`flex-1 px-4 py-3 text-sm transition-colors min-h-[44px] ${
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
              className={`flex-1 px-4 py-3 text-sm border-l border-white/10 transition-colors min-h-[44px] ${
                language === 'english' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                setLanguage('pidgin')
                sessionStorage.setItem('healthai-language', 'pidgin')
              }}
              className={`flex-1 px-4 py-3 text-sm border-l border-white/10 transition-colors min-h-[44px] ${
                language === 'pidgin' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              Pidgin
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'ai' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex-shrink-0 flex items-center justify-center text-sm font-bold">
                  AI
                </div>
              )}
              <div
                className={`rounded-2xl px-5 py-4 max-w-[85%] md:max-w-[80%] ${
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
                <div className="text-base md:text-lg leading-relaxed prose prose-invert prose-sm max-w-none">
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
                
                {/* AI Response Disclaimer */}
                {msg.role === 'ai' && !msg.isEmergency && (
                  <p className="text-sm text-gray-600 mt-4 pt-4 border-t border-white/10">
                    ⚠️ Not a diagnosis. See a doctor.
                  </p>
                )}
                
                {/* Hospital Recommendations */}
                {msg.hospitals && msg.hospitals.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                    <p className="text-base font-medium text-gray-300">Nearest Hospitals:</p>
                    {msg.hospitals.map((hospital, idx) => (
                      <div key={idx} className="space-y-2 bg-white/5 p-3 rounded-lg">
                        <p className="text-base font-medium">{hospital.name}</p>
                        <p className="text-sm text-gray-400">{hospital.address}</p>
                        <div className="flex flex-col gap-2 mt-3">
                          <a
                            href={`tel:${hospital.phone.replace(/\s/g, '')}`}
                            className="w-full bg-green-500 text-white text-center py-3 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium min-h-[44px] flex items-center justify-center"
                          >
                            📞 Call {hospital.phone}
                          </a>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + ' ' + hospital.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-green-500 text-white text-center py-3 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium min-h-[44px] flex items-center justify-center"
                          >
                            🗺️ Get Directions
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

                {/* Follow-up Question */}
                {msg.followUp && (
                  <div className="mt-4 pt-4 border-t border-white/10 bg-green-500/10 p-3 rounded-lg">
                    <p className="text-sm text-green-400 mb-2">Follow-up question:</p>
                    <p className="text-sm mb-3">
                      {language === 'pidgin' ? msg.followUp.questionPidgin : msg.followUp.question}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (msg.followUp?.type === 'location') {
                            navigator.geolocation?.getCurrentPosition(
                              (position) => {
                                const location = {
                                  lat: position.coords.latitude,
                                  lon: position.coords.longitude
                                }
                                setUserLocation(location)
                                setInput('I am at my current GPS location')
                              },
                              () => {
                                setInput('I am in ')
                              }
                            )
                          }
                          setPendingFollowUp(msg.followUp || null)
                        }}
                        className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                      >
                        📍 Use GPS
                      </button>
                      <button
                        onClick={() => {
                          setInput('I am in ')
                          setPendingFollowUp(msg.followUp || null)
                        }}
                        className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors"
                      >
                        Type Location
                      </button>
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
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setReplyingTo(msg.id)}
                        className="p-1 rounded hover:bg-white/10 transition-colors text-gray-500 hover:text-white"
                        title="Reply to this message"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>
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
                  </div>
                )}

                {/* Reply indicator */}
                {msg.replyToId && (
                  <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 8l3.707-3.707a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Replying to previous message</span>
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
                <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
          
          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-sm font-bold">
                AI
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce" />
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.15s'}} />
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}} />
                  </div>
                  <span className="text-base text-gray-400">Thinking...</span>
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
      <div className="border-t border-white/10 p-4 bg-black/50 backdrop-blur-sm sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto">
          {/* Reply Context */}
          {replyingTo && (
            <div className="mb-3 p-2 bg-white/5 rounded-lg border-l-2 border-green-500">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Replying to message</span>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {/* Follow-up Context */}
          {pendingFollowUp && (
            <div className="mb-3 p-2 bg-green-500/10 rounded-lg border-l-2 border-green-500">
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-400">
                  {language === 'pidgin' ? pendingFollowUp.questionPidgin : pendingFollowUp.question}
                </span>
                <button
                  onClick={() => setPendingFollowUp(null)}
                  className="text-green-400 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                const target = e.target as HTMLTextAreaElement
                target.style.height = '56px'
                target.style.height = Math.min(target.scrollHeight, 120) + 'px'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !loading) {
                  e.preventDefault()
                  sendMessage(!!pendingFollowUp, pendingFollowUp?.context)
                }
              }}
              placeholder={
                language === 'pidgin' 
                  ? 'Wetin dey worry you? Tell me how your body dey feel...'
                  : language === 'english'
                  ? 'Describe your symptoms in detail...'
                  : 'Tell me your symptoms (English or Pidgin)...'
              }
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-base outline-none focus:border-green-500/50 transition-colors placeholder:text-gray-500 resize-none overflow-hidden"
              disabled={loading}
              rows={1}
              style={{ minHeight: '56px', maxHeight: '120px' }}
            />
            <button
              onClick={() => sendMessage(!!pendingFollowUp, pendingFollowUp?.context)}
              disabled={loading || !input.trim()}
              className="bg-green-500 text-white px-6 py-3.5 text-base rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium self-end min-w-[80px]"
            >
              {loading ? '...' : pendingFollowUp ? 'Answer' : replyingTo ? 'Reply' : 'Send'}
            </button>
          </div>
          <div className="flex justify-center mt-3">
            <p className="text-sm text-gray-500">
              Emergency? Call <span className="text-green-500 font-bold">112</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

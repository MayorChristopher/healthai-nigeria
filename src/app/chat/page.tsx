'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import LocationRequest from '@/components/LocationRequest'
import InstallPrompt from '@/components/InstallPrompt'
import { getRandomHealthTip } from '@/lib/health-tips'
import { detectUrgencyLevel, type UrgencyInfo } from '@/lib/urgency-detector'

type Hospital = {
  name: string
  phone: string
  address: string
  coords: string
}

type Message = {
  id: string
  role: 'user' | 'ai' | 'location'
  content: string
  isEmergency?: boolean
  hospitals?: Hospital[]
  onlineDoctors?: boolean
  timestamp: Date
  replyTo?: string
  stopped?: boolean
  retryMessage?: string
  needsLocation?: boolean
  urgency?: UrgencyInfo
}

export default function ChatPage() {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [language, setLanguage] = useState<'auto' | 'english' | 'pidgin'>('auto')
  const [messages, setMessages] = useState<Message[]>([{ 
    id: '1', 
    role: 'ai', 
    content: "Hi! I'm HealthAI.\n\nI can help with symptoms, health questions, and finding hospitals. Available 24/7 in English or Pidgin.\n\nDo you have any symptoms or health questions?",
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
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState('')
  const [showLocationRequest, setShowLocationRequest] = useState(false)
  const [pendingLocationMessage, setPendingLocationMessage] = useState('')
  const [currentTip, setCurrentTip] = useState(getRandomHealthTip())
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

  // Rotate health tips while loading
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentTip(getRandomHealthTip())
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [loading])

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
    } else if (messages.slice(-3).some(m => m.isEmergency)) {
      // Only show emergency mode if one of last 3 messages is emergency
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

  const stopResponse = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
      setLoading(false)
      
      // Add stopped message
      setMessages(prev => [...prev, {
        id: Math.random().toString(36),
        role: 'ai',
        content: 'Response stopped.',
        timestamp: new Date(),
        stopped: true,
        retryMessage: messages[messages.length - 1]?.content || input
      }])
    }
  }

  const handleLocationSelect = async (location: { lat: number; lon: number; method: 'gps' | 'manual'; address?: string }) => {
    setShowLocationRequest(false)
    
    const locationMsg: Message = {
      id: Math.random().toString(36),
      role: 'location',
      content: location.method === 'gps' ? '📍 GPS location shared' : `📍 Location: ${location.address}`,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, locationMsg])
    setLoading(true)

    const controller = new AbortController()
    setAbortController(controller)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: pendingLocationMessage,
          sessionId, 
          language,
          history: messages.slice(-8).map(m => ({ role: m.role, content: m.content })),
          userLocation: location.method === 'gps' ? { lat: location.lat, lon: location.lon } : undefined,
          locationQuery: location.address
        }),
        signal: controller.signal
      })

      if (!res.ok) throw new Error('Network response was not ok')
      const data = await res.json()
      
      setMessages(prev => [...prev, {
        id: Math.random().toString(36),
        role: 'ai',
        content: data.response,
        isEmergency: data.isEmergency,
        hospitals: data.hospitals,
        timestamp: new Date()
      }])
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setMessages(prev => [...prev, {
          id: Math.random().toString(36),
          role: 'ai',
          content: "Sorry, couldn't process that. Please try again.",
          timestamp: new Date()
        }])
      }
    } finally {
      setLoading(false)
      setAbortController(null)
      setPendingLocationMessage('')
    }
  }

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

    const controller = new AbortController()
    setAbortController(controller)

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
        }),
        signal: controller.signal
      })

      if (!res.ok) throw new Error('Network response was not ok')

      const data = await res.json()
      
      const urgency = detectUrgencyLevel(userMessage, data.isEmergency)
      
      const aiMessage: Message = {
        id: Math.random().toString(36),
        role: 'ai',
        content: data.response,
        isEmergency: data.isEmergency,
        hospitals: data.hospitals,
        onlineDoctors: data.onlineDoctors,
        timestamp: new Date(),
        needsLocation: data.needsLocation,
        urgency
      }
      
      setMessages(prev => [...prev, aiMessage])
      
      if (data.needsLocation) {
        setPendingLocationMessage(userMessage)
        setShowLocationRequest(true)
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        // Network error - provide offline emergency guidance
        const isEmergencyMsg = userMessage.toLowerCase().includes('bleeding') || 
                               userMessage.toLowerCase().includes('chest pain') ||
                               userMessage.toLowerCase().includes('unconscious') ||
                               userMessage.toLowerCase().includes('breathe')
        
        setMessages(prev => [...prev, {
          id: Math.random().toString(36),
          role: 'ai',
          content: isEmergencyMsg 
            ? "🚨 EMERGENCY - No internet connection!\n\nCall 112 immediately or go to nearest hospital.\n\nMajor hospitals:\n• National Hospital Abuja: +234 9 461 2200\n• LUTH Lagos: +234 1 263 2626\n• UCH Ibadan: +234 2 241 3545\n\nIf severe bleeding: Apply direct pressure with clean cloth.\nIf unconscious: Check breathing, place in recovery position.\nIf chest pain: Keep person calm, call 112."
            : "I'm currently offline. For emergencies, call 112.\n\nMajor hospitals:\n• National Hospital Abuja: +234 9 461 2200\n• LUTH Lagos: +234 1 263 2626\n• UCH Ibadan: +234 2 241 3545\n\nPlease see a doctor for proper diagnosis.",
          isEmergency: isEmergencyMsg,
          timestamp: new Date(),
          stopped: true,
          retryMessage: userMessage
        }])
      }
    } finally {
      setLoading(false)
      setAbortController(null)
    }
  }

  const retryMessage = async (messageContent: string, stoppedMessageId: string) => {
    if (loading) return
    
    // Remove the stopped message
    setMessages(prev => prev.filter(m => m.id !== stoppedMessageId))
    setLoading(true)

    const controller = new AbortController()
    setAbortController(controller)

    try {
      const recentMessages = messages.slice(-8).map(m => ({
        role: m.role,
        content: m.content
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageContent, 
          sessionId, 
          language,
          history: recentMessages
        }),
        signal: controller.signal
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
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setMessages(prev => [...prev, {
          id: Math.random().toString(36),
          role: 'ai',
          content: "Sorry, I couldn't process that. Please check your connection and try again.",
          timestamp: new Date()
        }])
      }
    } finally {
      setLoading(false)
      setAbortController(null)
    }
  }

  const startEditMessage = (msg: Message) => {
    setEditingMessageId(msg.id)
    setEditedContent(msg.content)
  }

  const saveEditedMessage = async (msgId: string) => {
    if (!editedContent.trim()) return
    
    // Find the message index
    const msgIndex = messages.findIndex(m => m.id === msgId)
    if (msgIndex === -1) return
    
    // Update the message content
    const updatedMessages = [...messages]
    updatedMessages[msgIndex] = {
      ...updatedMessages[msgIndex],
      content: editedContent.trim()
    }
    
    // Remove all messages after this one
    const newMessages = updatedMessages.slice(0, msgIndex + 1)
    setMessages(newMessages)
    setEditingMessageId(null)
    setEditedContent('')
    
    // Send the edited message directly without adding it again
    setLoading(true)
    const controller = new AbortController()
    setAbortController(controller)

    try {
      const recentMessages = newMessages.slice(-8).map(m => ({
        role: m.role,
        content: m.content
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: editedContent.trim(), 
          sessionId, 
          language,
          history: recentMessages
        }),
        signal: controller.signal
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
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setMessages(prev => [...prev, {
          id: Math.random().toString(36),
          role: 'ai',
          content: "Sorry, I couldn't process that. Please check your connection and try again.",
          timestamp: new Date()
        }])
      }
    } finally {
      setLoading(false)
      setAbortController(null)
    }
  }

  const cancelEdit = () => {
    setEditingMessageId(null)
    setEditedContent('')
  }

  if (!termsAccepted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Before You Continue</h1>
            <p className="text-sm text-gray-400">Important information about using HealthAI</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Not a Medical Device</p>
                  <p className="text-xs text-gray-400">This is a prototype built for a hackathon. AI can make mistakes.</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">For Emergencies: Call 112</p>
                  <p className="text-xs text-gray-400">Always seek professional medical care for serious conditions.</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-600/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Privacy First</p>
                  <p className="text-xs text-gray-400">We don't store your conversations or personal health data.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link 
              href="/" 
              className="flex-1 border border-white/10 text-gray-400 px-6 py-3 rounded-full hover:bg-white/5 hover:text-white transition-all text-center text-sm font-medium cursor-pointer"
            >
              Go Back
            </Link>
            <button
              onClick={() => {
                sessionStorage.setItem('healthai-terms-accepted', 'true')
                setTermsAccepted(true)
              }}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors font-medium text-sm cursor-pointer"
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
      <InstallPrompt />
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
            <Link href="/" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="max-w-3xl mx-auto space-y-2 sm:space-y-3 pb-32">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'ai' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-600 flex-shrink-0 flex items-center justify-center self-start">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              )}
              <div className={editingMessageId === msg.id ? "w-full" : "max-w-[80%] sm:max-w-[75%]"}>
                {editingMessageId === msg.id ? (
                  <div className="bg-zinc-900 border border-white/10 rounded-2xl p-3 w-full">
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none resize-none text-white placeholder:text-gray-500"
                      rows={3}
                      autoFocus
                      placeholder="Edit your message..."
                    />
                    <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-white/5">
                      <button
                        onClick={cancelEdit}
                        className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEditedMessage(msg.id)}
                        className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Update</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14m0 0l-7-7m7 7l-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                <>
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
                  className={`px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-green-600 rounded-2xl rounded-br-md'
                      : msg.isEmergency
                      ? 'bg-red-500/20 border border-red-500/30 rounded-2xl rounded-bl-md'
                      : 'bg-zinc-900 border border-white/5 rounded-2xl rounded-bl-md'
                  }`}
                >
                  {msg.urgency && (
                    <div className={`${msg.urgency.bgColor} ${msg.urgency.borderColor} border rounded-lg p-3 mb-3 flex items-center justify-between`}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{msg.urgency.icon}</span>
                        <div>
                          <p className={`${msg.urgency.color} font-bold text-sm`}>{msg.urgency.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{msg.urgency.action}</p>
                        </div>
                      </div>
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
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className="text-sm font-medium text-green-600">Nearest Hospitals</p>
                        </div>
                        <Link
                          href="/#hospitals"
                          className="text-xs text-gray-400 hover:text-green-600 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>View all</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
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
                      <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                        <p className="text-xs text-gray-400">
                          These may not be closest to you. <Link href="/#hospitals" className="text-green-600 hover:text-green-400 cursor-pointer">Browse all hospitals</Link> to find ones near your location.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                </>
                )}
                <div className="flex items-center justify-between mt-1 px-1">
                  <p className="text-xs text-gray-600">
                    {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {msg.role === 'user' && editingMessageId !== msg.id && (
                    <button
                      onClick={() => startEditMessage(msg)}
                      className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                      title="Edit message"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}
                  {msg.role === 'ai' && editingMessageId !== msg.id && (
                    <div className="flex items-center gap-2">
                      {msg.stopped && msg.retryMessage && (
                        <button
                          onClick={() => retryMessage(msg.retryMessage!, msg.id)}
                          className="text-xs text-green-600 hover:text-green-400 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Retry
                        </button>
                      )}
                      {!msg.stopped && (
                        <>
                          <button
                            onClick={() => setReplyingTo(msg)}
                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                            title="Reply"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(msg.content)
                              setCopied(true)
                              setTimeout(() => setCopied(false), 2000)
                            }}
                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                            title="Copy"
                          >
                            {copied ? (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {showLocationRequest && (
            <div className="flex gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-600 flex items-center justify-center self-start flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1 max-w-[80%] sm:max-w-[75%]">
                <LocationRequest 
                  onLocationSelect={handleLocationSelect}
                  onCancel={() => setShowLocationRequest(false)}
                />
              </div>
            </div>
          )}
          
          {loading && !showLocationRequest && (
            <div className="flex gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-600 flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="bg-zinc-900 border border-white/5 rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.15s'}} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}} />
                  </div>
                  <span className="text-xs text-gray-500">Analyzing...</span>
                </div>
                <p className="text-xs text-gray-400 animate-pulse">{currentTip}</p>
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
            <div className="relative group">
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
                className="px-2.5 py-2 sm:px-3 sm:py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0 text-xs sm:text-sm font-medium text-gray-400 cursor-pointer"
              >
                {language === 'auto' ? 'Auto' : language === 'english' ? 'EN' : 'PG'}
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-xs text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {language === 'auto' ? 'Auto-detect language' : language === 'english' ? 'English only' : 'Pidgin only'}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-900"></div>
              </div>
            </div>
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
              onClick={loading ? stopResponse : sendMessage}
              disabled={!loading && !input.trim()}
              className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14m0 0l-7-7m7 7l-7 7" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-600 mt-2">
            <span>Emergency? Call <span className="text-green-600 font-bold">112</span></span>
            <span className="text-gray-700">•</span>
            <span className="text-green-600">📱 Installable App</span>
          </div>
        </div>
      </div>
    </div>
  )
}

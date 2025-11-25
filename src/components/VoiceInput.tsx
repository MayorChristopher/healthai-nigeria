'use client'
import { useState, useEffect, useRef } from 'react'

type VoiceInputProps = {
  onTranscript: (text: string) => void
  language: 'auto' | 'english' | 'pidgin'
  onRecordingChange?: (isRecording: boolean) => void
}

export default function VoiceInput({ onTranscript, language, onRecordingChange }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const [isCancelled, setIsCancelled] = useState(false)

  useEffect(() => {
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  }, [])

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      setRecordingTime(0)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRecording])

  const startRecording = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isSupported || isRecording) return

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = 'en-NG'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 3

    recognition.onstart = () => {
      setIsRecording(true)
      setIsCancelled(false)
      setTranscript('')
      onRecordingChange?.(true)
    }

    recognition.onend = () => {
      setIsRecording(false)
      onRecordingChange?.(false)
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece
        } else {
          interimTranscript += transcriptPiece
        }
      }

      setTranscript(finalTranscript || interimTranscript)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      stopRecording()
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    
    if (!isCancelled && transcript.trim()) {
      onTranscript(transcript.trim())
    }
    
    setIsRecording(false)
    setTranscript('')
    onRecordingChange?.(false)
  }

  const cancelRecording = () => {
    setIsCancelled(true)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsRecording(false)
    setTranscript('')
    onRecordingChange?.(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    startXRef.current = e.touches[0].clientX
    startYRef.current = e.touches[0].clientY
    startRecording(e)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isRecording) return
    e.preventDefault()
    e.stopPropagation()
    
    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const diffX = startXRef.current - currentX
    const diffY = Math.abs(startYRef.current - currentY)
    
    if (diffX > 120 && diffY < 60) {
      cancelRecording()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isRecording && !isCancelled) {
      stopRecording()
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    startRecording(e)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isRecording && !isCancelled) {
      stopRecording()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isSupported) return null

  if (isRecording) {
    return (
      <>
        {/* Full screen overlay */}
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-6">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-white mb-2">{formatTime(recordingTime)}</p>
            <p className="text-gray-400 text-sm mb-6">Recording...</p>
            
            {transcript ? (
              <div className="bg-white/10 rounded-xl p-4 mb-6 max-w-md">
                <p className="text-white text-base">{transcript}</p>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1 h-12 mb-6">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-green-600 rounded-full"
                    style={{
                      height: `${Math.random() * 40 + 10}px`,
                      animation: 'pulse 1s ease-in-out infinite',
                      animationDelay: `${i * 0.05}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onTouchEnd={handleTouchEnd}
              onMouseUp={handleMouseUp}
              className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors shadow-lg"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14m0 0l-7-7m7 7l-7 7" />
              </svg>
            </button>
            <p className="text-gray-400 text-sm">Release to send</p>
          </div>

          <button
            onClick={cancelRecording}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-gray-500 text-xs">← Slide left to cancel</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="relative group">
      <button
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
        className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 active:scale-95 transition-all flex-shrink-0 touch-none select-none cursor-pointer"
        style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
        type="button"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-xs text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Hold to record
        <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-zinc-900"></div>
      </div>
    </div>
  )
}

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
  const [transcript, setTranscript] = useState('')
  const [duration, setDuration] = useState(0)
  const recognitionRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const hasWebkit = 'webkitSpeechRecognition' in window
    const hasStandard = 'SpeechRecognition' in window
    setIsSupported(hasWebkit || hasStandard)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
    }
  }, [])

  const startRecording = () => {
    if (!isSupported || isRecording) return

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = language === 'pidgin' ? 'en-NG' : 'en-US'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    // Set state immediately for instant UI feedback
    setIsRecording(true)
    setTranscript('')
    setDuration(0)
    onRecordingChange?.(true)

    recognition.onstart = () => {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    }

    recognition.onresult = (event: any) => {
      let result = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        result += event.results[i][0].transcript
      }
      if (result) {
        const newTranscript = (transcript + result).slice(0, 500) // Limit to 500 chars
        setTranscript(newTranscript)
      }
    }

    recognition.onerror = (event: any) => {
      if (event.error === 'aborted' || event.error === 'no-speech') return
      console.error('Speech recognition error:', event.error)
      cancelRecording()
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    
    if (timerRef.current) clearInterval(timerRef.current)
    
    if (transcript.trim()) {
      onTranscript(transcript.trim())
    }
    
    setIsRecording(false)
    setTranscript('')
    setDuration(0)
    onRecordingChange?.(false)
  }

  const cancelRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    
    if (timerRef.current) clearInterval(timerRef.current)
    
    setIsRecording(false)
    setTranscript('')
    setDuration(0)
    onRecordingChange?.(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isSupported) return null

  if (!isRecording) {
    return (
      <button
        onClick={startRecording}
        disabled={isRecording}
        className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 active:scale-95 flex-shrink-0 disabled:opacity-50"
        type="button"
        aria-label="Start voice recording"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
        </svg>
      </button>
    )
  }

  return (
    <>
      {/* Recording Bar */}
      <div className="flex-1 bg-zinc-900 rounded-full px-4 py-2.5 flex items-center gap-3 min-w-0">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
        <span className="text-white font-mono text-sm flex-shrink-0">{formatTime(duration)}</span>
        <div className="flex-1 min-w-0 overflow-hidden">
          {transcript ? (
            <p className="text-white text-sm truncate">{transcript}</p>
          ) : (
            <p className="text-gray-500 text-sm">Listening...</p>
          )}
        </div>
      </div>
      
      {/* Cancel Button */}
      <button
        onClick={cancelRecording}
        className="p-3 bg-red-500/20 border border-red-500/50 text-red-500 rounded-full hover:bg-red-500/30 active:scale-95 flex-shrink-0"
        type="button"
        aria-label="Cancel recording"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Send Button */}
      <button
        onClick={stopRecording}
        className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 active:scale-95 flex-shrink-0"
        type="button"
        aria-label="Send voice message"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14m0 0l-7-7m7 7l-7 7" />
        </svg>
      </button>
    </>
  )
}

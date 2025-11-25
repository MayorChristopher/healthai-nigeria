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
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  }, [])

  const startRecording = () => {
    if (!isSupported || isRecording) return

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = 'en-NG'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onstart = () => {
      setIsRecording(true)
      setTranscript('')
      onRecordingChange?.(true)
    }

    recognition.onend = () => {
      setIsRecording(false)
      onRecordingChange?.(false)
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ''

      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' '
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript)
      }
    }

    recognition.onerror = () => {
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
    
    if (transcript.trim()) {
      onTranscript(transcript.trim())
    }
    
    setIsRecording(false)
    setTranscript('')
    onRecordingChange?.(false)
  }

  const cancelRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsRecording(false)
    setTranscript('')
    onRecordingChange?.(false)
  }

  if (!isSupported) return null

  if (isRecording) {
    return (
      <>
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/60 z-40" onClick={cancelRecording} />
        
        {/* Bottom Sheet */}
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 rounded-t-3xl z-50 p-6 animate-slide-up">
          <div className="max-w-2xl mx-auto">
            {/* Handle */}
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6" />
            
            {/* Microphone Animation */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </div>
                {/* Pulse rings */}
                <div className="absolute inset-0 w-24 h-24 bg-red-500/30 rounded-full animate-ping" />
              </div>
            </div>

            {/* Transcript */}
            {transcript ? (
              <div className="bg-white/5 rounded-2xl p-4 mb-6 min-h-[80px] max-h-[200px] overflow-y-auto">
                <p className="text-white text-base">{transcript}</p>
              </div>
            ) : (
              <div className="text-center mb-6">
                <p className="text-gray-400 text-lg">Listening...</p>
                <p className="text-gray-600 text-sm mt-2">Start speaking</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={cancelRecording}
                className="flex-1 bg-white/10 text-white py-4 rounded-xl font-medium hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={stopRecording}
                className="flex-1 bg-green-600 text-white py-4 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Send
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes slide-up {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
        `}</style>
      </>
    )
  }

  return (
    <button
      onClick={startRecording}
      className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 active:scale-95 transition-all flex-shrink-0"
      type="button"
      title="Voice message"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
      </svg>
    </button>
  )
}

'use client'
import { useState, useEffect, useRef } from 'react'

type VoiceInputProps = {
  onTranscript: (text: string) => void
  language: 'auto' | 'english' | 'pidgin'
  onRecordingChange?: (isRecording: boolean) => void
}

export default function VoiceInput({ onTranscript, language, onRecordingChange }: VoiceInputProps) {
  const [showModal, setShowModal] = useState(false)
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
      onRecordingChange?.(true)
    }

    recognition.onend = () => {
      setIsRecording(false)
      onRecordingChange?.(false)
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = 0; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + ' '
        } else {
          interimTranscript += transcriptPiece
        }
      }

      setTranscript(finalTranscript + interimTranscript)
    }

    recognition.onerror = () => {
      setIsRecording(false)
      onRecordingChange?.(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsRecording(false)
    onRecordingChange?.(false)
  }

  const handleSend = () => {
    stopRecording()
    if (transcript.trim()) {
      onTranscript(transcript.trim())
    }
    setShowModal(false)
    setTranscript('')
  }

  const handleClose = () => {
    stopRecording()
    setShowModal(false)
    setTranscript('')
  }

  if (!isSupported) return null

  return (
    <>
      {/* Voice Button */}
      <button
        onClick={() => setShowModal(true)}
        className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex-shrink-0"
        type="button"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-white mb-6">Voice Message</h3>

            {/* Transcript Box */}
            <div className="bg-black/40 rounded-xl p-4 mb-6 min-h-[150px] max-h-[300px] overflow-y-auto">
              {transcript ? (
                <p className="text-white text-base leading-relaxed">{transcript}</p>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  {isRecording ? 'Listening...' : 'Click "Start Recording" to begin'}
                </p>
              )}
            </div>

            {/* Microphone Indicator */}
            {isRecording && (
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-500 text-sm font-medium">Recording...</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  Start Recording
                </button>
              ) : (
                <>
                  <button
                    onClick={stopRecording}
                    className="flex-1 bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-colors"
                  >
                    Stop
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!transcript.trim()}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Send
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

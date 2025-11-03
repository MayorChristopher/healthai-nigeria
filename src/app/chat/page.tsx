'use client'
import Link from 'next/link'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">Chat Interface</h1>
        <p className="text-gray-400 mb-8">
          Coming soon! This is where the AI chat will be implemented.
        </p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">TODO for Team:</h2>
          <ul className="text-left text-gray-400 space-y-2">
            <li>• Integrate Google Gemini API</li>
            <li>• Build chat UI with message history</li>
            <li>• Add Pidgin language support</li>
            <li>• Implement emergency detection logic</li>
            <li>• Add hospital recommendations based on symptoms</li>
          </ul>
        </div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

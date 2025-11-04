'use client'
import Link from 'next/link'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Adaptive AI Chat</h1>
          <p className="text-gray-400">
            Building an AI that adapts and understands context, not just a simple recommender system.
          </p>
          <p className="text-sm text-yellow-500 mt-2">
            Note: Core chat functionality will be built during the hackathon
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-green-500">Adaptive AI (Not a Recommender)</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Learns within conversation context</li>
              <li>• Adapts responses based on dialogue</li>
              <li>• Understands Nigerian health context</li>
              <li>• Context-aware, not template-based</li>
              <li>• Improves during session (privacy-safe)</li>
            </ul>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-500">Intelligence Features</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Multi-turn conversation memory</li>
              <li>• Symptom pattern recognition</li>
              <li>• Emergency priority detection</li>
              <li>• Pidgin language understanding</li>
              <li>• Contextual follow-up questions</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Team Responsibilities</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-green-500 mb-2">Mayor Christopher - Full Stack Developer</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Landing page & deployment (DONE ✓)</li>
                <li>• Chat interface at hackathon</li>
                <li>• Backend API routes (shared)</li>
                <li>• Adaptive AI logic (shared)</li>
                <li>• Hospital finder integration</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-blue-500 mb-2">Victor - Backend Developer</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Backend API development (shared)</li>
                <li>• Adaptive AI logic (shared)</li>
                <li>• Google Gemini API integration</li>
                <li>• Emergency detection algorithm</li>
                <li>• Session-based learning (no storage)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-purple-500 mb-2">Comfort - Documentation & Frontend</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Project documentation</li>
                <li>• Chat UI components</li>
                <li>• Frontend styling & polish</li>
                <li>• User testing & feedback</li>
                <li>• README & guides</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

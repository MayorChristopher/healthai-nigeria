import Link from 'next/link'

export default function DoctorsPartnershipPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <Link href="/partnerships" className="text-green-600 hover:text-green-400 mb-8 inline-block">
          ← Back to Partnerships
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">Doctor Partnership Program</h1>
        <p className="text-gray-400 mb-12">
          Partner with HealthAI to expand your reach and help underserved communities
        </p>

        <div className="bg-white/5 p-8 rounded-xl border border-white/10 mb-8">
          <h2 className="text-2xl font-bold mb-6">Benefits</h2>
          <ul className="space-y-3 text-gray-300">
            <li>• Review and validate AI medical responses</li>
            <li>• Provide teleconsultation services</li>
            <li>• Expand your practice to rural areas</li>
            <li>• Earn additional income</li>
          </ul>
        </div>

        <div className="bg-white/5 p-8 rounded-xl border border-white/10">
          <h2 className="text-2xl font-bold mb-4">Get Started</h2>
          <p className="text-gray-400 mb-6">
            Contact us to learn more about partnership opportunities
          </p>
          <a 
            href="mailto:partnerships@healthai-nigeria.vercel.app?subject=Doctor Partnership Inquiry"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}

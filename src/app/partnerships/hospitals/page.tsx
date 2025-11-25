import Link from 'next/link'

export default function HospitalsPartnershipPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <Link href="/partnerships" className="text-green-600 hover:text-green-400 mb-8 inline-block">
          ← Back to Partnerships
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">Hospital Partnership Program</h1>
        <p className="text-gray-400 mb-12">
          List your facility and connect with patients who need immediate care
        </p>

        <div className="bg-white/5 p-8 rounded-xl border border-white/10 mb-8">
          <h2 className="text-2xl font-bold mb-6">Benefits</h2>
          <ul className="space-y-3 text-gray-300">
            <li>• Featured listing in hospital finder</li>
            <li>• Direct patient referrals from AI</li>
            <li>• Real-time availability updates</li>
            <li>• Increased patient reach</li>
          </ul>
        </div>

        <div className="bg-white/5 p-8 rounded-xl border border-white/10">
          <h2 className="text-2xl font-bold mb-4">Get Started</h2>
          <p className="text-gray-400 mb-6">
            Contact us to register your hospital on our platform
          </p>
          <a 
            href="mailto:partnerships@healthai-nigeria.vercel.app?subject=Hospital Partnership Inquiry"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}

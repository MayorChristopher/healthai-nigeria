import Link from 'next/link'

export default function PartnershipsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <Link href="/" className="text-green-600 hover:text-green-400 mb-8 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-6">Partnership Opportunities</h1>
        <p className="text-gray-400 mb-12">
          Join us in improving healthcare access across Nigeria
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Link 
            href="/partnerships/doctors"
            className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all"
          >
            <h2 className="text-2xl font-bold mb-3">For Doctors</h2>
            <p className="text-gray-400">Partner with us to provide verified medical guidance</p>
          </Link>

          <Link 
            href="/partnerships/hospitals"
            className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-green-600/50 transition-all"
          >
            <h2 className="text-2xl font-bold mb-3">For Hospitals</h2>
            <p className="text-gray-400">List your facility and connect with patients</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

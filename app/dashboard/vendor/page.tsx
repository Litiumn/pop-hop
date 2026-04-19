'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserFromStorage } from '@/lib/auth'

export default function VendorDashboard() {
  const router = useRouter()

  useEffect(() => {
    const user = getUserFromStorage()

    if (!user || user.role !== 'VENDOR') {
      router.push('/login')
    }
  }, [])

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Vendor Dashboard</h1>

        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-gray-600 mb-3">
            Browse events and apply to participate.
          </p>

          <a
            href="/dashboard/vendor/events"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            View Events
          </a>
        </div>
      </div>
    </div>
  )
}
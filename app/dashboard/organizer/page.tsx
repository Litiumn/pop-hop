'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserFromStorage } from '@/lib/auth'

export default function OrganizerDashboard() {
  const router = useRouter()
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const user = getUserFromStorage()

    if (!user || user.role !== 'ORGANIZER') {
      router.push('/login')
      return
    }

    // 👇 fetch events after auth check
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
  }, [])

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Organizer Dashboard</h1>

        <div className="grid gap-4">
          {events.map(event => (
            <div
              key={event.id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg mb-1">{event.title}</h2>
              <p className="text-gray-600 text-sm mb-2">
                {event.description}
              </p>

              <div className="text-sm text-gray-500 mb-3">
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Price: ₱{event.price}</p>
              </div>

              <div className="flex gap-3">
                <a
                  href={`/dashboard/organizer/applications/${event.id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Applications
                </a>

                <a
                  href={`/dashboard/organizer/booths/${event.id}`}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Booths
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
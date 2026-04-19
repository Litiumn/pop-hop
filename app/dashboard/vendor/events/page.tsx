'use client'

import { useEffect, useState } from 'react'

export default function VendorEventsPage() {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
  }, [])

  const handleApply = async (eventId: string) => {
    const userId = localStorage.getItem('userId')

    const res = await fetch('/api/applications/create', {
      method: 'POST',
      body: JSON.stringify({ userId, eventId }),
    })

    if (res.ok) {
      alert('Applied successfully!')
    } else {
      alert('Application failed')
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Available Events</h1>

      <div className="grid gap-4">
        {events.map(event => (
          <div key={event.id} className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg">{event.title}</h2>
            <p>{event.description}</p>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Price: {event.price}</p>

            <button
              onClick={() => handleApply(event.id)}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'

export default function VendorEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [appliedEvents, setAppliedEvents] = useState<string[]>([])

  // ✅ fetch events
  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
  }, [])

  // ✅ fetch applied events (FIXED)
  useEffect(() => {
    const userId = localStorage.getItem('userId')

    if (!userId || userId === 'null' || userId === 'undefined') return

    fetch(`/api/applications/user/${userId}`)
      .then(async res => {
        if (!res.ok) {
          console.warn('Applications fetch failed')
          return null
        }
        return res.json()
      })
      .then(res => {
        if (!res) return

        const applications = res.data || [] // ✅ FIX HERE

        const ids = applications.map((app: any) => app.eventId)
        setAppliedEvents(ids)
      })
  }, [])

  // ✅ apply handler
  const handleApply = async (eventId: string) => {
    const userId = localStorage.getItem('userId')
    if (!userId) return

    const res = await fetch('/api/applications/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, eventId }),
    })

    if (res.ok) {
      setAppliedEvents(prev => [...prev, eventId])
    } else {
      const text = await res.text()
      console.error(text)
      alert('Already applied or failed')
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Available Events</h1>

        {events.length === 0 ? (
          <p>No events available</p>
        ) : (
          <div className="grid gap-4">
            {events.map(event => (
              <div key={event.id} className="bg-white p-4 rounded shadow">
                <h2 className="font-bold text-lg">{event.title}</h2>
                <p>{event.description}</p>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Price: {event.price}</p>

                <button
                  onClick={() => handleApply(event.id)}
                  disabled={appliedEvents.includes(event.id)}
                  className={`mt-2 px-3 py-1 rounded text-white ${
                    appliedEvents.includes(event.id)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {appliedEvents.includes(event.id) ? 'Applied' : 'Apply'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
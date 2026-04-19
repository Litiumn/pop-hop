'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserFromStorage } from '@/lib/auth'

export default function OrganizerDashboard() {
  const router = useRouter()
  const [events, setEvents] = useState<any[]>([])
  const [announcementsMap, setAnnouncementsMap] = useState<{[key: string]: any[]}>({})

  useEffect(() => {
    const user = getUserFromStorage()

    if (!user || user.role !== 'ORGANIZER') {
      router.push('/login')
      return
    }

    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
  }, [])

  // 🔥 fetch announcements per event
  useEffect(() => {
    events.forEach(event => {
      fetch(`/api/announcements/${event.id}`)
        .then(res => res.json())
        .then(data => {
          setAnnouncementsMap(prev => ({
            ...prev,
            [event.id]: data
          }))
        })
    })
  }, [events])

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Organizer Dashboard</h1>

        <div className="grid gap-4">
          {events.map(event => (
            <div
              key={event.id}
              className="bg-white p-5 rounded-lg shadow"
            >
              <h2 className="font-semibold text-lg mb-1">{event.title}</h2>

              <p className="text-gray-600 text-sm mb-2">
                {event.description}
              </p>

              <div className="text-sm text-gray-500 mb-3">
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Price: ₱{event.price}</p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 mb-4">
                <a
                  href={`/dashboard/organizer/applications/${event.id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Applications
                </a>

                <a
                  href={`/dashboard/organizer/booths/${event.id}`}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Booths
                </a>
              </div>

              {/* 🔥 POST ANNOUNCEMENT */}
              <div className="bg-gray-50 p-3 rounded mb-3">
                <p className="font-semibold text-sm mb-2">
                  Post Announcement
                </p>

                <input
                  placeholder="Title"
                  id={`title-${event.id}`}
                  className="border p-2 w-full mb-2 text-sm"
                />

                <textarea
                  placeholder="Message"
                  id={`content-${event.id}`}
                  className="border p-2 w-full mb-2 text-sm"
                />

                <button
                  onClick={async () => {
                    const title = (document.getElementById(`title-${event.id}`) as any).value
                    const content = (document.getElementById(`content-${event.id}`) as any).value

                    if (!title || !content) return

                    await fetch('/api/announcements/create', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        title,
                        content,
                        eventId: event.id
                      })
                    })

                    alert('Announcement posted')
                    location.reload()
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Post
                </button>
              </div>

              {/* 🔥 ANNOUNCEMENT LIST */}
              {announcementsMap[event.id]?.length > 0 && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold text-sm mb-2">
                    Announcements
                  </p>

                  {announcementsMap[event.id].map(a => (
                    <div key={a.id} className="mb-2 text-sm">
                      <p className="font-medium">{a.title}</p>
                      <p className="text-gray-600">{a.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
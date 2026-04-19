'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ApplicationsPage() {
  const { eventId } = useParams()
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/applications/${eventId}`)
      .then(res => res.json())
      .then(data => setApplications(data))
  }, [eventId])

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch('/api/applications/update', {
      method: 'POST',
      body: JSON.stringify({ id, status }),
    })

    if (res.ok) {
      alert(`Application ${status}`)
      location.reload()
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Applications</h1>

        <div className="grid gap-4">
          {applications.map(app => (
            <div
              key={app.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{app.user.name}</p>
                <p className="text-sm text-gray-500">{app.user.email}</p>
                <p className="text-sm mt-1">
                  Status:{' '}
                  <span
                    className={
                      app.status === 'APPROVED'
                        ? 'text-green-600'
                        : app.status === 'REJECTED'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }
                  >
                    {app.status}
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(app.id, 'APPROVED')}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(app.id, 'REJECTED')}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
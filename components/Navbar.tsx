'use client'

import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()

  const role =
    typeof window !== 'undefined' ? localStorage.getItem('role') : null

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">PopHop</h1>

      <div className="flex gap-4 items-center">
        {role === 'ORGANIZER' && (
          <>
            <a href="/dashboard/organizer">Dashboard</a>
            <a href="/dashboard/organizer/create-event">Create Event</a>
          </>
        )}

        {role === 'VENDOR' && (
          <>
            <a href="/dashboard/vendor/events">Events</a>
          </>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
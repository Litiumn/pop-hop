'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  const [mounted, setMounted] = useState(false)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)

    const storedRole = localStorage.getItem('role')
    setRole(storedRole)
  }, [])

  // ✅ prevent hydration mismatch
  if (!mounted) return null

  // ✅ hide navbar on auth pages
  if (pathname === '/login' || pathname === '/register') {
    return null
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center sticky top-0 z-10">
      <h1 className="font-bold text-lg">PopHop</h1>

      <div className="flex gap-4 items-center">
        {/* ORGANIZER */}
        {role === 'ORGANIZER' && (
          <>
            <a
              href="/dashboard/organizer"
              className="text-gray-700 hover:text-blue-500"
            >
              Dashboard
            </a>

            <a
              href="/dashboard/organizer/create-event"
              className="text-gray-700 hover:text-blue-500"
            >
              Create Event
            </a>
          </>
        )}

        {/* VENDOR */}
        {role === 'VENDOR' && (
          <>
            <a
              href="/dashboard/vendor/events"
              className="text-gray-700 hover:text-blue-500"
            >
              Events
            </a>

            <a
              href="/dashboard/vendor/applications"
              className="text-gray-700 hover:text-blue-500"
            >
              My Applications
            </a>
          </>
        )}

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
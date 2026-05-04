'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { MessageCircle, Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

function AlienBug({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="22" y1="18" x2="16" y2="8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="15" cy="7" r="3" fill="#FF6B2C" stroke="currentColor" strokeWidth="2"/>
      <line x1="42" y1="18" x2="48" y2="8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="49" cy="7" r="3" fill="#FF6B2C" stroke="currentColor" strokeWidth="2"/>
      <ellipse cx="32" cy="38" rx="20" ry="18" fill="#FF6B2C" stroke="currentColor" strokeWidth="3"/>
      <ellipse cx="23" cy="33" rx="6" ry="8" fill="white" stroke="currentColor" strokeWidth="2.5"/>
      <ellipse cx="41" cy="33" rx="6" ry="8" fill="white" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="23" cy="34" r="3" fill="currentColor"/>
      <circle cx="41" cy="34" r="3" fill="currentColor"/>
      <circle cx="25" cy="31" r="1.5" fill="white"/>
      <circle cx="43" cy="31" r="1.5" fill="white"/>
      <line x1="14" y1="44" x2="6" y2="52" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="14" y1="50" x2="6" y2="58" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="50" y1="44" x2="58" y2="52" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <line x1="50" y1="50" x2="58" y2="58" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [auth, setAuth] = useState<{ role: string | null; name: string | null }>({ role: null, name: null })
  const [unread, setUnread] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const syncAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setAuth({ role: data.user.role, name: data.user.name })

        const unreadRes = await fetch('/api/messages/unread')
        if (unreadRes.ok) {
          const { unreadCount } = await unreadRes.json()
          setUnread(unreadCount)
        }
      } else {
        setAuth({ role: null, name: null })
        setUnread(0)
      }
    } catch {
      // Ignore
    }
  }

  useEffect(() => {
    setMounted(true)
    syncAuth()

    window.addEventListener('ph-auth-change', syncAuth)
    const interval = setInterval(syncAuth, 30000)

    return () => {
      window.removeEventListener('ph-auth-change', syncAuth)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (mounted) syncAuth()
    setMenuOpen(false) // Close menu on route change
  }, [pathname, mounted])

  if (!mounted) return null
  if (pathname === '/login' || pathname === '/register') return null

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setAuth({ role: null, name: null })
    setUnread(0)
    window.dispatchEvent(new Event('ph-auth-change'))
    window.location.href = '/'
  }

  const { role } = auth

  const DesktopLinks = () => (
    <>
      {role === 'ORGANIZER' && (
        <>
          <Link href="/dashboard/organizer" style={navLink(pathname === '/dashboard/organizer')}>Dashboard</Link>
          <Link href="/dashboard/organizer/create-event" style={navLink(false)}>+ Event</Link>
        </>
      )}
      {role === 'VENDOR' && (
        <>
          <Link href="/dashboard/vendor" style={navLink(pathname === '/dashboard/vendor')}>Dashboard</Link>
          <Link href="/dashboard/vendor/events" style={navLink(pathname === '/dashboard/vendor/events')}>Events</Link>
        </>
      )}
      {role && (
        <Link href="/dashboard/chat" style={{ ...navLink(pathname.startsWith('/dashboard/chat')), display: 'inline-flex', alignItems: 'center', gap: '4px', position: 'relative' }}>
          <MessageCircle size={14} strokeWidth={2.5} />
          Chat
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: '-6px', right: '-6px',
              background: 'var(--ph-magenta)', color: 'white',
              borderRadius: '12px', padding: '1px 5px',
              fontSize: '0.65rem', fontWeight: 800,
              border: '1.5px solid var(--ph-black)'
            }}>
              {unread}
            </span>
          )}
        </Link>
      )}
    </>
  )

  const MobileLinks = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
      {role === 'ORGANIZER' && (
        <>
          <Link href="/dashboard/organizer" style={mobileNavLink(pathname === '/dashboard/organizer')}>Dashboard</Link>
          <Link href="/dashboard/organizer/create-event" style={mobileNavLink(pathname === '/dashboard/organizer/create-event')}>+ New Event</Link>
        </>
      )}
      {role === 'VENDOR' && (
        <>
          <Link href="/dashboard/vendor" style={mobileNavLink(pathname === '/dashboard/vendor')}>Dashboard</Link>
          <Link href="/dashboard/vendor/events" style={mobileNavLink(pathname === '/dashboard/vendor/events')}>Browse Events</Link>
        </>
      )}
      {role && (
        <Link href="/dashboard/chat" style={{ ...mobileNavLink(pathname.startsWith('/dashboard/chat')), display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <MessageCircle size={16} strokeWidth={2.5} />
          Chat {unread > 0 && <span style={{ background: 'var(--ph-magenta)', color: 'white', padding: '2px 8px', borderRadius: '999px', fontSize: '0.7rem' }}>{unread} unread</span>}
        </Link>
      )}
      
      <div style={{ height: '1px', background: 'rgba(0,0,0,0.1)', margin: '8px 0' }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Theme / Font</span>
        <ThemeToggle />
      </div>

      <div style={{ height: '1px', background: 'rgba(0,0,0,0.1)', margin: '8px 0' }} />

      {role ? (
        <button onClick={handleLogout} style={{ ...mobileNavLink(false), color: 'var(--ph-magenta)', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          Logout
        </button>
      ) : (
        <Link href="/login" style={mobileNavLink(false)}>Sign In</Link>
      )}
    </div>
  )

  return (
    <>
      <nav style={{
        background: 'var(--ph-yellow)',
        borderBottom: '2.5px solid var(--ph-black)',
        padding: '0 16px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        {/* LOGO */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--ph-green)',
            border: '2px solid var(--ph-black)',
            borderRadius: '999px',
            padding: '3px 12px 3px 6px',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '0.95rem',
            color: 'var(--ph-black)',
          }}>
            <AlienBug size={20} />
            POP HOP!
          </span>
        </Link>

        {/* DESKTOP NAV (hidden on small screens) */}
        <div className="ph-desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '4px' }}>
          <DesktopLinks />
          
          <div style={{ marginLeft: '8px' }}>
            <ThemeToggle />
          </div>

          {role ? (
            <button onClick={handleLogout} style={{
              background: 'var(--ph-magenta)',
              color: 'white',
              border: '2px solid var(--ph-black)',
              borderRadius: '999px',
              padding: '5px 14px',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              marginLeft: '4px',
            }}>
              Logout
            </button>
          ) : (
            <Link href="/login" style={{
              background: 'var(--ph-green)',
              color: 'var(--ph-black)',
              border: '2px solid var(--ph-black)',
              borderRadius: '999px',
              padding: '5px 14px',
              fontWeight: 700,
              fontSize: '0.8rem',
              textDecoration: 'none',
              marginLeft: '4px',
            }}>
              Sign In
            </Link>
          )}
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <div className="ph-mobile-nav" style={{ display: 'block' }}>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--ph-black)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            {menuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      {menuOpen && (
        <div className="ph-mobile-nav-dropdown" style={{
          position: 'fixed',
          top: '56px',
          left: 0,
          right: 0,
          background: 'var(--ph-yellow)',
          borderBottom: '2.5px solid var(--ph-black)',
          zIndex: 49,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          animation: 'ph-slide-down 0.2s ease',
          color: 'var(--ph-black)'
        }}>
          <MobileLinks />
        </div>
      )}

      {/* RESPONSIVE STYLES */}
      <style>{`
        @media (min-width: 768px) {
          .ph-desktop-nav { display: flex !important; }
          .ph-mobile-nav { display: none !important; }
          .ph-mobile-nav-dropdown { display: none !important; }
        }
        @keyframes ph-slide-down {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  )
}

const navLink = (active: boolean): React.CSSProperties => ({
  color: active ? 'var(--ph-magenta)' : 'var(--ph-black)',
  fontWeight: active ? 800 : 700,
  fontSize: '0.85rem',
  textDecoration: 'none',
  padding: '5px 10px',
  borderRadius: '8px',
  background: active ? 'rgba(0,0,0,0.05)' : 'transparent',
  transition: 'background 0.15s, color 0.15s',
  position: 'relative',
})

const mobileNavLink = (active: boolean): React.CSSProperties => ({
  color: active ? 'var(--ph-magenta)' : 'var(--ph-black)',
  fontWeight: active ? 800 : 700,
  fontSize: '1rem',
  textDecoration: 'none',
  padding: '10px 12px',
  borderRadius: '8px',
  background: active ? 'rgba(0,0,0,0.05)' : 'transparent',
  display: 'block'
})
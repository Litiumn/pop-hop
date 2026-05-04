'use client'

import { useEffect, useState } from 'react'
import { getClientUser } from '@/lib/auth'
import {
  CalendarRange, MapPin, Store, CreditCard,
  Clock, ArrowRight, X, CheckCircle
} from 'lucide-react'

export default function VendorEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [appliedEvents, setAppliedEvents] = useState<string[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const [applying, setApplying] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/events').then(r => r.json()).then(setEvents)
  }, [])

  useEffect(() => {
    getClientUser().then(user => {
      if (!user) return
      fetch(`/api/applications/user/${user.userId}`)
        .then(r => r.ok ? r.json() : null)
        .then(res => {
          if (!res) return
          setAppliedEvents((res.data || []).map((a: any) => a.eventId))
        })
    })
  }, [])

  const handleApply = async (eventId: string) => {
    const user = await getClientUser()
    if (!user) return
    setApplying(eventId)
    const res = await fetch('/api/applications/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.userId, eventId }),
    })
    if (res.ok) {
      setAppliedEvents(prev => [...prev, eventId])
      setSelected((prev: any) => prev ? { ...prev, _applied: true } : null)
    } else {
      alert('Could not apply. You may have already applied.')
    }
    setApplying(null)
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ background: 'var(--background)', minHeight: '100dvh', paddingBottom: '40px', color: 'var(--foreground)' }}>

      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-color)', padding: '24px 16px 16px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', margin: 0 }}>Browse Events</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>{events.length} event{events.length !== 1 ? 's' : ''} available</p>
      </div>

      {/* Event cards */}
      <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
            <CalendarRange size={48} strokeWidth={1.5} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--foreground)' }}>No events yet</p>
            <p style={{ fontSize: '0.85rem' }}>Check back soon!</p>
          </div>
        ) : events.map(event => {
          const isApplied = appliedEvents.includes(event.id)
          return (
            <div
              key={event.id}
              onClick={() => setSelected(event)}
              className="ph-card"
              style={{
                background: 'var(--surface)',
                padding: 0,
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '3px 3px 0 var(--ph-black)' }}
            >
              {event.imageUrl && (
                <img src={event.imageUrl} alt={event.title}
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderBottom: '2px solid var(--ph-black)' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              )}
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 6px', lineHeight: 1.2 }}>{event.title}</h2>
                  {isApplied && (
                    <span style={{
                      background: 'var(--ph-green)', border: '2px solid var(--ph-black)',
                      borderRadius: '999px', padding: '2px 10px',
                      fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.05em',
                      textTransform: 'uppercase', flexShrink: 0, color: 'var(--ph-black)',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      <CheckCircle size={10} strokeWidth={3} /> Applied
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 12px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CalendarRange size={12} /> {new Date(event.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  {event.address && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>· <MapPin size={12} /> {event.address}</span>}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--ph-magenta)' }}>₱{event.price.toLocaleString()}/booth</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Tap to view <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── DETAIL BOTTOM SHEET ── */}
      {selected && (
        <>
          {/* Backdrop */}
          <div onClick={() => setSelected(null)} style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
            animation: 'ph-fade-in 0.2s ease',
          }} />

          {/* Sheet */}
          <div style={{
            position: 'fixed',
            bottom: 0, left: 0, right: 0,
            background: 'var(--surface)',
            borderRadius: '20px 20px 0 0',
            border: '2.5px solid var(--ph-black)',
            borderBottom: 'none',
            maxHeight: '85dvh',
            overflowY: 'auto',
            zIndex: 50,
            animation: 'ph-slide-up 0.28s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {/* Drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: '36px', height: '4px', background: 'var(--border-color)', borderRadius: '999px' }} />
            </div>

            {selected.imageUrl && (
              <img src={selected.imageUrl} alt={selected.title}
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderBottom: '2px solid var(--ph-black)' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}

            <div style={{ padding: '20px 20px 32px' }}>
              {/* Close */}
              <button onClick={() => setSelected(null)} style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'var(--surface-alt)', border: '2px solid var(--border-color)', borderRadius: '50%',
                width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--foreground)'
              }}>
                <X size={16} strokeWidth={2.5} />
              </button>

              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', margin: '0 0 16px', paddingRight: '32px' }}>
                {selected.title}
              </h2>

              {/* Info grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {[
                  { icon: CalendarRange, label: 'Date', value: formatDate(selected.date) },
                  { icon: Clock, label: 'Time', value: selected.startTime ? `${selected.startTime}${selected.endTime ? ` – ${selected.endTime}` : ''}` : 'TBA' },
                  { icon: CalendarRange, label: 'Duration', value: `${selected.durationDays || 1} day${(selected.durationDays || 1) > 1 ? 's' : ''}` },
                  { icon: Store, label: 'Booths', value: `${selected.boothLimit} slots` },
                  { icon: CreditCard, label: 'Booth Fee', value: `₱${selected.price.toLocaleString()}` },
                  ...(selected.address ? [{ icon: MapPin, label: 'Location', value: selected.address }] : []),
                ].map(item => (
                  <div key={item.label} style={{ background: 'var(--surface-alt)', borderRadius: '10px', padding: '10px 12px', border: '1.5px solid var(--border-color-soft)' }}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <item.icon size={12} strokeWidth={2.5} /> {item.label}
                    </p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, color: 'var(--foreground)' }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {selected.description && (
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>About this event</p>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--foreground)', margin: 0 }}>{selected.description}</p>
                </div>
              )}

              {/* Google Maps link */}
              {selected.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(selected.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '12px',
                    background: 'var(--ph-lavender)',
                    border: '2px solid var(--ph-black)',
                    borderRadius: '10px',
                    color: 'var(--ph-black)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    marginBottom: '16px',
                  }}
                >
                  <MapPin size={16} /> Open in Google Maps
                </a>
              )}

              {/* Apply button */}
              {appliedEvents.includes(selected.id) ? (
                <div style={{
                  textAlign: 'center', padding: '14px',
                  background: 'rgba(61,218,85,0.1)',
                  border: '2.5px solid var(--ph-green)',
                  borderRadius: '999px',
                  fontWeight: 800, color: 'var(--ph-green)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                  <CheckCircle size={18} strokeWidth={2.5} /> You have applied to this event
                </div>
              ) : (
                <button
                  onClick={() => handleApply(selected.id)}
                  disabled={applying === selected.id}
                  className="ph-btn ph-btn-primary"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '1rem',
                    cursor: applying === selected.id ? 'not-allowed' : 'pointer',
                    opacity: applying === selected.id ? 0.6 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  {applying === selected.id ? 'Applying...' : <>Apply for a Booth <ArrowRight size={18} /></>}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes ph-slide-up {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
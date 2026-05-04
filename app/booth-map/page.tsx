'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, CheckCircle, XCircle, Clock, Store, ArrowLeft, Loader2 } from 'lucide-react'

type BoothStatus = 'occupied' | 'vacant' | 'reserved' | 'pending'

const STATUS_CONFIG: Record<BoothStatus, { label: string; bg: string; border: string; icon: React.ElementType; color: string }> = {
  occupied: { label: 'Occupied',  bg: 'var(--ph-magenta)', border: 'var(--ph-black)', icon: Store,       color: 'white' },
  vacant:   { label: 'Available', bg: 'var(--ph-green)',   border: 'var(--ph-black)', icon: CheckCircle, color: 'var(--ph-black)' },
  pending:  { label: 'Pending',   bg: 'var(--ph-yellow)',  border: 'var(--ph-black)', icon: Clock,       color: 'var(--ph-black)' },
  reserved: { label: 'Reserved',  bg: 'var(--ph-yellow)',  border: 'var(--ph-black)', icon: Clock,       color: 'var(--ph-black)' },
}

function BoothMapInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const eventId = searchParams?.get('eventId')

  const [booths, setBooths] = useState<any[]>([])
  const [eventTitle, setEventTitle] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!eventId) {
      setLoading(false)
      setError(true)
      return
    }

    Promise.all([
      fetch(`/api/booths/${eventId}`).then(r => {
        if (!r.ok) throw new Error()
        return r.json()
      }),
      fetch('/api/events').then(r => r.json())
    ])
    .then(([boothsData, eventsData]) => {
      setBooths(boothsData.sort((a: any, b: any) => a.number - b.number))
      const ev = eventsData.find((e: any) => e.id === eventId)
      if (ev) setEventTitle(ev.title)
      setLoading(false)
    })
    .catch(() => {
      setError(true)
      setLoading(false)
    })
  }, [eventId])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
        <Loader2 size={32} className="animate-spin mx-auto mb-4" />
        <p>Loading booth map...</p>
      </div>
    )
  }

  if (error || !eventId) {
    return (
      <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
        <MapPin size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--foreground)' }}>Map Not Available</p>
        <p style={{ fontSize: '0.85rem', marginBottom: '24px' }}>Please select a specific event from your dashboard to view its booth map.</p>
        <button onClick={() => router.back()} className="ph-btn ph-btn-secondary">
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    )
  }

  // Calculate stats
  const total = booths.length
  const occupied = booths.filter(b => b.vendorId).length
  const vacant = total - occupied

  return (
    <>
      <div style={{
        background: 'var(--ph-black)',
        color: 'var(--ph-white)',
        padding: '32px 24px 24px',
        borderBottom: '2.5px solid var(--ph-black)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: 'var(--ph-yellow)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Event Map</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <MapPin size={28} color="var(--ph-magenta)" strokeWidth={2.5} />
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
                margin: 0,
                lineHeight: 1,
              }}>
                {eventTitle || 'Booth Map'}
              </h1>
            </div>
            <p style={{ opacity: 0.7, fontSize: '0.9rem', margin: 0 }}>
              Live snapshot of booth availability for this event.
            </p>
          </div>
          <button onClick={() => router.back()} className="ph-btn ph-btn-ghost" style={{ padding: '8px 16px' }}>
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      <div style={{ padding: '16px 24px', borderBottom: '2px solid var(--border-color-soft)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.6 }}>Legend:</span>
          {(['vacant', 'occupied'] as BoothStatus[]).map((key) => {
            const cfg = STATUS_CONFIG[key]
            const Icon = cfg.icon
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '4px',
                  background: cfg.bg, border: `2px solid ${cfg.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={11} color={cfg.color} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{cfg.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <div className="ph-badge ph-badge-yellow" style={{ fontSize: '0.8rem' }}>Total: {total}</div>
          <div className="ph-badge" style={{ background: 'var(--ph-green)', color: 'var(--ph-black)', fontSize: '0.8rem' }}>Available: {vacant}</div>
          <div className="ph-badge ph-badge-magenta" style={{ fontSize: '0.8rem', color: 'white' }}>Occupied: {occupied}</div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
          gap: '12px',
        }}>
          {booths.map(booth => {
            const status: BoothStatus = booth.vendorId ? 'occupied' : 'vacant'
            const cfg = STATUS_CONFIG[status]
            const Icon = cfg.icon

            return (
              <div
                key={booth.id}
                title={status === 'vacant' ? `Booth #${booth.number} — Available` : `Booth #${booth.number} — Assigned`}
                style={{
                  minHeight: '80px',
                  background: cfg.bg,
                  border: `2.5px solid ${cfg.border}`,
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '8px',
                  boxShadow: `3px 3px 0 ${cfg.border}`,
                }}
              >
                <Icon size={18} color={cfg.color} strokeWidth={2.5} />
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: cfg.color, fontFamily: 'var(--font-display)' }}>
                  #{booth.number}
                </span>
                {booth.vendor && (
                  <span style={{
                    fontSize: '0.65rem', color: cfg.color,
                    opacity: 0.9, textAlign: 'center', lineHeight: 1.2,
                    maxWidth: '68px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                  }}>
                    {booth.vendor.name.split(' ')[0]}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default function BoothMapPage() {
  return (
    <div style={{ background: 'var(--background)', minHeight: '100dvh', color: 'var(--foreground)' }}>
      <Suspense fallback={<div style={{ padding: '64px', textAlign: 'center' }}><Loader2 className="animate-spin" /></div>}>
        <BoothMapInner />
      </Suspense>
    </div>
  )
}

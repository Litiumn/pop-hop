'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getClientUser } from '@/lib/auth'
import {
  ShoppingBag, MessageCircle, CreditCard, MapPin,
  Clock, CheckCircle, XCircle, ChevronRight, History,
  LayoutDashboard,
} from 'lucide-react'

const STATUS_COLOR: Record<string, string> = {
  APPROVED: 'var(--ph-green)',
  REJECTED: 'var(--ph-magenta)',
  PENDING:  'var(--ph-blue)',
}
const STATUS_TEXT: Record<string, string> = {
  APPROVED: '#0D0D0D',
  REJECTED: 'white',
  PENDING:  '#0D0D0D',
}

const PAYMENT_BADGE: Record<string, string> = {
  UNPAID:   'ph-badge-yellow',
  PENDING:  'ph-badge-blue',
  VERIFIED: 'ph-badge-green',
  REJECTED: 'ph-badge-magenta',
}

const PAYMENT_ICON: Record<string, typeof Clock> = {
  UNPAID:   CreditCard,
  PENDING:  Clock,
  VERIFIED: CheckCircle,
  REJECTED: XCircle,
}

type Tab = 'active' | 'history'

export default function VendorDashboard() {
  const [applications, setApplications]       = useState<any[]>([])
  const [page, setPage]                       = useState(1)
  const [hasMore, setHasMore]                 = useState(false)
  const [announcementsMap, setAnnouncementsMap] = useState<{ [key: string]: any[] }>({})
  const [userName, setUserName]               = useState('')
  const [needsProfile, setNeedsProfile]       = useState(false)
  const [tab, setTab]                         = useState<Tab>('active')
  const [proofInputs, setProofInputs]         = useState<Record<string, string>>({})

  useEffect(() => {
    getClientUser().then(user => {
      if (!user) return
      setUserName(user.name || 'Vendor')
      const userId = user.userId

      fetch(`/api/vendor-profile?userId=${userId}`)
        .then(r => r.json())
        .then(res => { if (!res.data || !res.data.description) setNeedsProfile(true) })

      fetch(`/api/applications/user/${userId}?page=${page}`)
        .then(r => r.json())
        .then(res => {
          setApplications(res.data || [])
          setHasMore(res.hasMore)
        })
    })
  }, [page])

  useEffect(() => {
    applications.forEach(app => {
      fetch(`/api/announcements/${app.event.id}`)
        .then(r => r.json())
        .then(data => setAnnouncementsMap(prev => ({ ...prev, [app.event.id]: data })))
    })
  }, [applications])

  const now = new Date()
  const activeApps  = applications.filter(a => new Date(a.event.date) >= now)
  const historyApps = applications.filter(a => new Date(a.event.date) < now)
  const displayed   = tab === 'active' ? activeApps : historyApps

  const uploadPayment = async (appId: string) => {
    const url = proofInputs[appId]?.trim()
    if (!url) return
    await fetch('/api/payments/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: appId, paymentProof: url }),
    })
    location.reload()
  }

  return (
    <div style={{ background: 'var(--background)', minHeight: '100dvh', paddingBottom: '40px' }}>

      {/* ── HEADER ── */}
      <div style={{
        background: 'var(--ph-black)',
        padding: '24px 16px 20px',
        borderBottom: '2.5px solid var(--ph-black)',
      }}>
        <p style={{ color: 'var(--ph-blue)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Vendor</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', color: 'var(--ph-white)', margin: 0 }}>
            Hey, {userName.split(' ')[0]}! 👋
          </h1>
          <Link href="/dashboard/vendor/profile" className="ph-btn ph-btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 12px', flexShrink: 0 }}>
            <ShoppingBag size={13} />
            Profile
          </Link>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '6px' }}>
          {applications.length} total application{applications.length !== 1 ? 's' : ''}
        </p>
      </div>

      {needsProfile && (
        <div style={{ background: 'var(--ph-magenta)', color: 'white', padding: '12px 16px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
          Complete your profile to get approved faster —{' '}
          <Link href="/dashboard/vendor/profile" style={{ color: 'var(--ph-yellow)', textDecoration: 'underline' }}>Go to Profile →</Link>
        </div>
      )}

      <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Browse CTA */}
        <Link href="/dashboard/vendor/events" className="ph-card" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', textDecoration: 'none', marginBottom: '20px',
          background: 'var(--ph-magenta)',
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'white', margin: 0 }}>Browse Open Events</p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', margin: '2px 0 0' }}>Find your next market opportunity</p>
          </div>
          <ChevronRight size={22} color="white" />
        </Link>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '16px', border: '2.5px solid var(--ph-black)', borderRadius: '10px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          {([['active', 'Active', LayoutDashboard], ['history', 'History', History]] as const).map(([value, label, Icon]) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              style={{
                flex: 1,
                padding: '10px 12px',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                background: tab === value ? 'var(--ph-black)' : 'var(--surface)',
                color: tab === value ? 'var(--ph-yellow)' : 'var(--foreground)',
                transition: 'background 0.15s, color 0.15s',
                borderRight: value === 'active' ? '2px solid var(--ph-black)' : 'none',
              }}
            >
              <Icon size={14} />
              {label}
              {value === 'history' && historyApps.length > 0 && (
                <span style={{
                  background: 'var(--ph-magenta)', color: 'white',
                  borderRadius: '999px', padding: '1px 7px',
                  fontSize: '0.65rem', fontWeight: 800,
                }}>
                  {historyApps.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Applications list */}
        {displayed.length === 0 ? (
          <div className="ph-card" style={{ padding: '32px', textAlign: 'center', background: 'var(--surface)' }}>
            <ShoppingBag size={40} strokeWidth={1.5} style={{ marginBottom: '12px', opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px', color: 'var(--foreground)' }}>
              {tab === 'active' ? 'No active applications' : 'No past events yet'}
            </p>
            <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '16px', color: 'var(--foreground)' }}>
              {tab === 'active' ? 'Browse events and apply for a booth!' : 'Events you\'ve participated in will appear here.'}
            </p>
            {tab === 'active' && <Link href="/dashboard/vendor/events" className="ph-btn ph-btn-primary">Browse Events</Link>}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {displayed.map(app => {
              const PayIcon = PAYMENT_ICON[app.paymentStatus] || CreditCard
              return (
                <div key={app.id} className="ph-card" style={{ padding: '0', overflow: 'hidden', background: 'var(--surface)' }}>

                  {app.event.imageUrl && (
                    <img src={app.event.imageUrl} alt={app.event.title}
                      style={{ width: '100%', height: '100px', objectFit: 'cover', borderBottom: '2px solid var(--ph-black)' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}

                  <div style={{ padding: '14px' }}>
                    {/* Header row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', margin: '0 0 2px', color: 'var(--foreground)' }}>
                          {app.event.title}
                        </h3>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                          {new Date(app.event.date).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
                          {app.event.address && ` · ${app.event.address}`}
                        </p>
                      </div>
                      <span style={{
                        flexShrink: 0,
                        background: STATUS_COLOR[app.status] || 'var(--surface-alt)',
                        border: '2px solid var(--ph-black)',
                        borderRadius: '999px',
                        padding: '2px 10px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: STATUS_TEXT[app.status] || 'var(--foreground)',
                      }}>
                        {app.status}
                      </span>
                    </div>

                    {/* Meta */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <span className={`ph-badge ${PAYMENT_BADGE[app.paymentStatus] || 'ph-badge-yellow'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <PayIcon size={10} strokeWidth={2.5} />
                        {app.paymentStatus}
                      </span>
                      {app.booth && (
                        <span className="ph-badge ph-badge-lavender" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={10} strokeWidth={2.5} />
                          Booth #{app.booth.number}
                        </span>
                      )}
                      {tab === 'history' && (
                        <span className="ph-badge ph-badge-orange">Past Event</span>
                      )}
                    </div>

                    {app.status === 'PENDING' && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={12} strokeWidth={2} />
                        Waiting for organizer approval
                      </p>
                    )}

                    {/* Payment upload */}
                    {app.paymentStatus === 'UNPAID' && app.status !== 'REJECTED' && (
                      <div style={{ marginBottom: '12px' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Upload Payment Proof</p>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input
                            type="text"
                            className="ph-input"
                            placeholder="Paste GCash screenshot URL..."
                            style={{ fontSize: '0.82rem', flex: 1 }}
                            value={proofInputs[app.id] || ''}
                            onChange={e => setProofInputs(prev => ({ ...prev, [app.id]: e.target.value }))}
                          />
                          <button
                            onClick={() => uploadPayment(app.id)}
                            className="ph-btn ph-btn-primary"
                            style={{ fontSize: '0.75rem', padding: '6px 12px', flexShrink: 0 }}
                          >
                            Upload
                          </button>
                        </div>
                        {/* Proof preview */}
                        {proofInputs[app.id]?.startsWith('http') && (
                          <img
                            src={proofInputs[app.id]}
                            alt="Payment preview"
                            style={{ marginTop: '8px', width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--ph-black)' }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        )}
                      </div>
                    )}

                    {/* Already uploaded proof preview */}
                    {app.paymentProof && app.paymentStatus !== 'UNPAID' && (
                      <div style={{ marginBottom: '12px' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Payment Proof</p>
                        <a href={app.paymentProof} target="_blank" rel="noopener noreferrer">
                          <img
                            src={app.paymentProof}
                            alt="Payment proof"
                            style={{ width: '100%', maxHeight: '100px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--ph-black)', cursor: 'pointer' }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        </a>
                      </div>
                    )}

                    {/* Announcements */}
                    {(announcementsMap[app.event.id]?.length ?? 0) > 0 && (
                      <div style={{
                        background: 'var(--surface-alt)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        marginBottom: '10px',
                      }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MessageCircle size={11} strokeWidth={2.5} /> Announcements
                        </p>
                        {announcementsMap[app.event.id].slice(0, 2).map(a => (
                          <div key={a.id} style={{ marginBottom: '6px', borderLeft: '3px solid var(--ph-magenta)', paddingLeft: '8px' }}>
                            <p style={{ fontWeight: 700, fontSize: '0.82rem', margin: '0 0 1px', color: 'var(--foreground)' }}>{a.title}</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{a.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Organizer Rating */}
                    {app.organizerRating && (
                      <div style={{
                        background: 'var(--surface-alt)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        marginBottom: '10px',
                        border: '1px solid var(--ph-orange)'
                      }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          Organizer Feedback
                        </p>
                        <p style={{ margin: '0 0 4px', color: 'var(--ph-orange)' }}>{'★'.repeat(app.organizerRating)}{'☆'.repeat(5 - app.organizerRating)}</p>
                        {app.organizerFeedback && <p style={{ fontSize: '0.85rem', margin: 0 }}>{app.organizerFeedback}</p>}
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <Link
                        href={`/dashboard/chat/${app.eventId}/${app.event.organizerId}`}
                        className="ph-btn ph-btn-ghost"
                        style={{ fontSize: '0.8rem', padding: '7px 14px' }}
                      >
                        <MessageCircle size={13} />
                        Chat with Organizer
                      </Link>
                      {app.status === 'APPROVED' && (
                        <Link
                          href={`/booth-map?eventId=${app.eventId}`}
                          className="ph-btn ph-btn-ghost"
                          style={{ fontSize: '0.8rem', padding: '7px 14px' }}
                        >
                          <MapPin size={13} />
                          Booth Map
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {(page > 1 || hasMore) && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'center' }}>
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="ph-btn ph-btn-ghost" style={{ fontSize: '0.85rem' }}>← Prev</button>
            <span style={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '0.85rem', color: 'var(--foreground)' }}>Page {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={!hasMore} className="ph-btn ph-btn-ghost" style={{ fontSize: '0.85rem' }}>Next →</button>
          </div>
        )}
      </div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MessageCircle, ChevronDown, ChevronUp, CheckCircle,
  XCircle, Check, X, CreditCard, ArrowLeft
} from 'lucide-react'

export default function ApplicationsPage() {
  const { eventId } = useParams()
  const router = useRouter()
  const [applications, setApplications] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/applications/event/${eventId}?page=${page}`)
      .then(res => res.json())
      .then(res => {
        setApplications(res.data)
        setHasMore(res.hasMore)
      })
  }, [eventId, page])

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      location.reload()
    }
  }

  const verifyPayment = async (id: string, status: string) => {
    await fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: id, status })
    })
    location.reload()
  }

  const rateVendor = async (id: string, rating: number, feedback: string) => {
    await fetch(`/api/applications/${id}/rate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, feedback })
    })
    location.reload()
  }

  return (
    <div style={{ background: 'var(--background)', minHeight: '100dvh', paddingBottom: '60px', color: 'var(--foreground)' }}>

      {/* ── HEADER ── */}
      <div style={{
        background: 'var(--ph-black)',
        padding: '24px 16px 20px',
        borderBottom: '2.5px solid var(--ph-black)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ color: 'var(--ph-green)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
            Organizer
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--ph-white)', margin: 0 }}>
            Applications
          </h1>
        </div>
        <button onClick={() => router.back()} className="ph-btn ph-btn-ghost" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto' }}>

        {applications.length === 0 ? (
          <div className="ph-card" style={{ padding: '32px', textAlign: 'center', background: 'var(--surface)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>No applications yet</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>When vendors apply, they will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {applications.map(app => {
              const profile = app.user?.vendorProfile
              const isExpanded = expanded === app.id
              const canRate = app.status === 'APPROVED' && !app.organizerRating

              return (
                <div key={app.id} className="ph-card" style={{ background: 'var(--surface)', padding: '16px' }}>

                  {/* TOP ROW */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>

                    {/* LEFT: Vendor Info */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1 }}>
                      {/* Profile image */}
                      {profile?.imageUrl ? (
                        <img src={profile.imageUrl} alt={app.user.name}
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)', flexShrink: 0 }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      ) : (
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--surface-alt)', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                            {app.user.name?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}

                      <div>
                        <p style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0 0 2px' }}>{app.user.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{app.user.email}</p>
                        
                        {/* Tags */}
                        {profile?.productType && (
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                            {profile.productType.split(',').map((tag: string) => (
                              <span key={tag.trim()} style={{ background: 'var(--ph-lavender)', color: 'var(--ph-black)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}

                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Status:</span>
                          <span style={{
                            fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', padding: '2px 8px', borderRadius: '999px',
                            background: app.status === 'APPROVED' ? 'var(--ph-green)' : app.status === 'REJECTED' ? 'var(--ph-magenta)' : 'var(--ph-yellow)',
                            color: app.status === 'REJECTED' ? 'white' : 'var(--ph-black)'
                          }}>
                            {app.status}
                          </span>
                        </div>

                        {profile && (
                          <button
                            onClick={() => setExpanded(isExpanded ? null : app.id)}
                            style={{
                              background: 'none', border: 'none', padding: 0, marginTop: '8px',
                              fontSize: '0.75rem', fontWeight: 700, color: 'var(--ph-blue)', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: '4px'
                            }}
                          >
                            {isExpanded ? <><ChevronUp size={12} /> Hide Details</> : <><ChevronDown size={12} /> View Vendor Details</>}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* RIGHT: Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0, alignItems: 'flex-end' }}>
                      {app.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => updateStatus(app.id, 'APPROVED')} className="ph-btn ph-btn-primary" style={{ padding: '6px 10px', fontSize: '0.75rem', minWidth: 'auto' }}>
                            <Check size={14} /> Approve
                          </button>
                          <button onClick={() => updateStatus(app.id, 'REJECTED')} className="ph-btn ph-btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem', minWidth: 'auto', background: 'var(--ph-magenta)', color: 'white' }}>
                            <X size={14} /> Reject
                          </button>
                        </div>
                      )}
                      <Link href={`/dashboard/chat/${eventId}/${app.userId}`} className="ph-btn ph-btn-ghost" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                        <MessageCircle size={14} /> Chat
                      </Link>
                    </div>
                  </div>

                  {/* EXPANDED: Vendor Profile Details */}
                  {isExpanded && profile && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1.5px solid var(--border-color-soft)', display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                      {profile.description && (
                        <div>
                          <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px' }}>About</p>
                          <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>{profile.description}</p>
                        </div>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {profile.address && (
                          <div>
                            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px' }}>Address</p>
                            <p style={{ fontSize: '0.85rem', margin: 0 }}>📍 {profile.address}</p>
                          </div>
                        )}
                        {profile.socialLinks && (
                          <div>
                            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px' }}>Social Media</p>
                            <p style={{ fontSize: '0.85rem', margin: 0, whiteSpace: 'pre-line' }}>{profile.socialLinks}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* PAYMENT SECTION */}
                  {app.paymentProof && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1.5px solid var(--border-color-soft)' }}>
                      <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CreditCard size={12} /> Payment Proof
                      </p>
                      
                      {/* Image Preview */}
                      <a href={app.paymentProof} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginBottom: '12px' }}>
                        <img src={app.paymentProof} alt="Payment Proof" style={{ width: '100%', maxWidth: '240px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--ph-black)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      </a>

                      {app.paymentStatus === 'PENDING' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => verifyPayment(app.id, 'VERIFIED')} className="ph-btn ph-btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem', minWidth: 'auto' }}>
                            <CheckCircle size={14} /> Verify
                          </button>
                          <button onClick={() => verifyPayment(app.id, 'REJECTED')} className="ph-btn ph-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', minWidth: 'auto', background: 'var(--ph-magenta)', color: 'white' }}>
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      )}
                      {app.paymentStatus === 'VERIFIED' && (
                        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ph-green)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={14} /> Payment verified
                        </p>
                      )}
                      {app.paymentStatus === 'REJECTED' && (
                        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ph-magenta)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <XCircle size={14} /> Payment rejected
                        </p>
                      )}
                    </div>
                  )}

                  {/* VENDOR RATING SECTION */}
                  {app.organizerRating ? (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1.5px solid var(--border-color-soft)' }}>
                      <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px' }}>Your Feedback</p>
                      <p style={{ margin: '0 0 4px', color: 'var(--ph-orange)' }}>{'★'.repeat(app.organizerRating)}{'☆'.repeat(5 - app.organizerRating)}</p>
                      {app.organizerFeedback && <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--foreground)' }}>{app.organizerFeedback}</p>}
                    </div>
                  ) : canRate ? (
                    <VendorRatingForm appId={app.id} onRate={(rating, feedback) => rateVendor(app.id, rating, feedback)} />
                  ) : null}

                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {(page > 1 || hasMore) && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="ph-btn ph-btn-ghost" style={{ fontSize: '0.85rem' }}>← Prev</button>
            <span style={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '0.85rem' }}>Page {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={!hasMore} className="ph-btn ph-btn-ghost" style={{ fontSize: '0.85rem' }}>Next →</button>
          </div>
        )}
      </div>
    </div>
  )
}

function VendorRatingForm({ appId, onRate }: { appId: string, onRate: (r: number, f: string) => void }) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')

  return (
    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1.5px solid var(--border-color-soft)' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 8px' }}>Rate this Vendor</p>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '1.5rem', color: star <= rating ? 'var(--ph-orange)' : 'var(--border-color)' }}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        className="ph-input"
        placeholder="Optional feedback..."
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        rows={2}
        style={{ fontSize: '0.8rem', marginBottom: '8px' }}
      />
      <button
        onClick={() => onRate(rating, feedback)}
        disabled={rating === 0}
        className="ph-btn ph-btn-accent"
        style={{ fontSize: '0.75rem', padding: '6px 12px' }}
      >
        Submit Rating
      </button>
    </div>
  )
}
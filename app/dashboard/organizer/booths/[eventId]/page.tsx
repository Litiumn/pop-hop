'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Store, User, ArrowLeft, Loader2, Check } from 'lucide-react'

type Booth = {
  id: string
  number: number
  vendorId: string | null
  vendor: { id: string; name: string } | null
}

type Application = {
  id: string
  status: string
  userId: string
  user: { id: string; name: string; vendorProfile?: { productType?: string } | null }
  booth: { id: string; number: number } | null
}

export default function BoothGridPage() {
  const { eventId } = useParams()
  const router = useRouter()
  const [booths, setBooths] = useState<Booth[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [selected, setSelected] = useState<Booth | null>(null)
  const [assigning, setAssigning] = useState(false)
  const [loading, setLoading] = useState(true)
  const [eventTitle, setEventTitle] = useState('')
  const [draggedVendor, setDraggedVendor] = useState<string | null>(null)
  const [dragTarget, setDragTarget] = useState<string | null>(null)

  const fetchData = async () => {
    const [boothsRes, appsRes] = await Promise.all([
      fetch(`/api/booths/${eventId}`).then(r => r.json()),
      fetch(`/api/applications/event/${eventId}?page=1`).then(r => r.json()),
    ])
    setBooths(boothsRes.sort((a: Booth, b: Booth) => a.number - b.number))
    setApplications(appsRes.data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    fetch('/api/events/organizer')
      .then(r => r.json())
      .then((events: any[]) => {
        const ev = events.find((e: any) => e.id === eventId)
        if (ev) setEventTitle(ev.title)
      })
  }, [eventId])

  const approvedVendors = applications.filter(a => a.status === 'APPROVED' && !a.booth)
  const pendingApps = applications.filter(a => a.status === 'PENDING')
  const waitlistedApps = applications.filter(a => a.status === 'WAITLISTED')

  const assign = async (boothId: string, vendorId: string) => {
    setAssigning(true)
    const res = await fetch('/api/booths/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boothId, vendorId }),
    })
    setAssigning(false)
    if (res.ok) {
      setSelected(null)
      await fetchData()
    } else {
      alert('Failed to assign booth')
    }
  }

  const getBoothState = (booth: Booth): 'empty' | 'assigned' | 'pending' => {
    if (booth.vendorId) return 'assigned'
    if (pendingApps.length > 0) return 'pending'
    return 'empty'
  }

  const boothColors = {
    empty:    { bg: 'var(--ph-green)',   border: 'var(--ph-black)', label: 'var(--ph-black)' },
    assigned: { bg: 'var(--ph-magenta)', border: 'var(--ph-black)', label: 'white' },
    pending:  { bg: 'var(--ph-yellow)',  border: 'var(--ph-black)', label: 'var(--ph-black)' },
  }

  const stats = {
    total:    booths.length,
    assigned: booths.filter(b => b.vendorId).length,
    empty:    booths.filter(b => !b.vendorId).length,
  }

  const handleDragStart = (e: React.DragEvent, vendorId: string) => {
    setDraggedVendor(vendorId)
    e.dataTransfer.setData('text/plain', vendorId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, boothId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragTarget !== boothId) setDragTarget(boothId)
  }

  const handleDragLeave = () => {
    setDragTarget(null)
  }

  const handleDrop = async (e: React.DragEvent, boothId: string) => {
    e.preventDefault()
    setDragTarget(null)
    const vendorId = e.dataTransfer.getData('text/plain')
    if (vendorId && boothId) {
      await assign(boothId, vendorId)
    }
    setDraggedVendor(null)
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
          <p style={{ color: 'var(--ph-yellow)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>
            Booth Grid
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: 'white', margin: 0 }}>
            {eventTitle || 'Event Booths'}
          </h1>
        </div>
        <button onClick={() => router.back()} className="ph-btn ph-btn-ghost" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div style={{ padding: '20px 16px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }} className="md:flex-row">
        
        {/* LEFT PANEL: Vendors & Stats */}
        <div style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { label: 'Total Booths', value: stats.total, color: 'var(--foreground)' },
              { label: 'Assigned', value: stats.assigned, color: 'var(--ph-magenta)' },
              { label: 'Available', value: stats.empty, color: 'var(--ph-green)' },
            ].map(s => (
              <div key={s.label} className="ph-card" style={{ padding: '12px', textAlign: 'center', background: 'var(--surface)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Unassigned Vendors (Draggable) */}
          <div className="ph-card" style={{ background: 'var(--surface)', padding: '16px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={18} /> Unassigned Vendors
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Drag an approved vendor and drop them onto an empty booth.
            </p>

            {approvedVendors.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Check size={24} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
                <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>All approved vendors assigned!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                {approvedVendors.map(app => (
                  <div
                    key={app.userId}
                    draggable
                    onDragStart={e => handleDragStart(e, app.userId)}
                    onDragEnd={() => setDraggedVendor(null)}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--surface-alt)',
                      border: '1.5px solid var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'grab',
                      opacity: draggedVendor === app.userId ? 0.5 : 1,
                      transform: draggedVendor === app.userId ? 'scale(0.98)' : 'none',
                      transition: 'transform 0.1s',
                    }}
                  >
                    <p style={{ fontWeight: 800, fontSize: '0.9rem', margin: '0 0 2px' }}>{app.user.name}</p>
                    {app.user.vendorProfile?.productType && (
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{app.user.vendorProfile.productType}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Waitlist */}
          {waitlistedApps.length > 0 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', marginBottom: '8px' }}>
                ⏳ Waitlist ({waitlistedApps.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {waitlistedApps.map((app, i) => (
                  <div key={app.id} className="ph-card" style={{ background: 'var(--surface)', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.7rem', background: 'var(--ph-yellow)', color: 'var(--ph-black)', border: '1.5px solid var(--ph-black)', borderRadius: '999px', padding: '2px 8px' }}>#{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.user.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Booth Grid */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Legend:</span>
            {[
              { color: 'var(--ph-green)', label: 'Empty' },
              { color: 'var(--ph-magenta)', label: 'Assigned' },
              { color: 'var(--ph-yellow)', label: 'Pending' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: l.color, border: '1.5px solid var(--ph-black)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{l.label}</span>
              </div>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
              <Loader2 size={32} className="animate-spin mx-auto mb-4" />
              <p>Loading booths...</p>
            </div>
          ) : booths.length === 0 ? (
            <div className="ph-card" style={{ padding: '32px', textAlign: 'center', background: 'var(--surface)' }}>
              <Store size={40} strokeWidth={1.5} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>No booths created yet</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: '12px',
            }}>
              {booths.map(booth => {
                const state = getBoothState(booth)
                const colors = boothColors[state]
                const isDragTarget = dragTarget === booth.id && !booth.vendorId

                return (
                  <div
                    key={booth.id}
                    onClick={() => setSelected(booth)}
                    onDragOver={(e) => !booth.vendorId && handleDragOver(e, booth.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => !booth.vendorId && handleDrop(e, booth.id)}
                    style={{
                      background: isDragTarget ? 'var(--ph-yellow)' : colors.bg,
                      border: `2.5px solid ${isDragTarget ? 'var(--ph-black)' : colors.border}`,
                      borderRadius: '12px',
                      boxShadow: isDragTarget ? 'none' : `3px 3px 0 ${colors.border}`,
                      padding: '12px 8px',
                      cursor: 'pointer',
                      transition: 'all 0.12s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      minHeight: '80px',
                      justifyContent: 'center',
                      transform: isDragTarget ? 'scale(1.05)' : 'none',
                    }}
                  >
                    <span style={{ color: isDragTarget ? 'var(--ph-black)' : colors.label, marginBottom: '2px' }}>
                      {booth.vendorId ? <Store size={20} strokeWidth={2.5} /> : <Store size={20} />}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      color: isDragTarget ? 'var(--ph-black)' : colors.label,
                    }}>
                      #{booth.number}
                    </span>
                    {booth.vendor && (
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: colors.label,
                        opacity: 0.9,
                        maxWidth: '68px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                      }}>
                        {booth.vendor.name.split(' ')[0]}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── BOOTH DETAIL MODAL ── */}
      {selected && (
        <>
          <div
            onClick={() => { setSelected(null) }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 40,
              animation: 'ph-fade-in 0.2s ease',
            }}
          />
          <div style={{
            position: 'fixed',
            bottom: 0, left: 0, right: 0,
            background: 'var(--surface)',
            borderRadius: '20px 20px 0 0',
            border: '2.5px solid var(--ph-black)',
            borderBottom: 'none',
            maxHeight: '75dvh',
            overflowY: 'auto',
            zIndex: 50,
            animation: 'ph-slide-up 0.28s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {/* Drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: '36px', height: '4px', background: 'var(--border-color)', borderRadius: '999px' }} />
            </div>

            <div style={{ padding: '16px 20px 32px', maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5, margin: '0 0 4px' }}>
                    {selected.vendorId ? 'Assigned Booth' : 'Empty Booth'}
                  </p>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', margin: 0 }}>
                    Booth #{selected.number}
                  </h2>
                </div>
                <div style={{
                  width: '52px', height: '52px',
                  background: selected.vendorId ? 'var(--ph-magenta)' : 'var(--ph-green)',
                  border: '2.5px solid var(--ph-black)',
                  borderRadius: '12px',
                  boxShadow: '3px 3px 0 var(--ph-black)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: selected.vendorId ? 'white' : 'var(--ph-black)'
                }}>
                  <Store size={24} strokeWidth={selected.vendorId ? 2.5 : 2} />
                </div>
              </div>

              {selected.vendorId ? (
                /* Already assigned */
                <div style={{
                  background: 'var(--ph-lavender)',
                  border: '2px solid var(--ph-black)',
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'var(--ph-black)',
                }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7, margin: '0 0 6px' }}>Assigned To</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} /> {selected.vendor?.name}
                  </p>
                </div>
              ) : (
                /* Assign vendor (fallback if drag/drop isn't used) */
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '12px' }}>
                    Assign an approved vendor to this booth:
                  </p>

                  {approvedVendors.length === 0 ? (
                    <div style={{
                      background: 'var(--surface-alt)',
                      border: '2px dashed var(--border-color)',
                      borderRadius: '12px',
                      padding: '24px',
                      textAlign: 'center',
                    }}>
                      <Store size={32} style={{ opacity: 0.2, margin: '0 auto 8px' }} />
                      <p style={{ fontWeight: 700, margin: 0 }}>No approved vendors available</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {approvedVendors.map(app => (
                        <button
                          key={app.id}
                          disabled={assigning}
                          onClick={() => assign(selected.id, app.userId)}
                          style={{
                            background: 'var(--surface)',
                            border: '2.5px solid var(--ph-black)',
                            borderRadius: '12px',
                            boxShadow: '3px 3px 0 var(--ph-black)',
                            padding: '14px 16px',
                            textAlign: 'left',
                            cursor: assigning ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            opacity: assigning ? 0.6 : 1,
                            color: 'var(--foreground)'
                          }}
                        >
                          <div>
                            <p style={{ fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '0.95rem', margin: 0 }}>
                              {app.user.name}
                            </p>
                            {app.user.vendorProfile?.productType && (
                              <p style={{ fontSize: '0.75rem', opacity: 0.6, margin: '2px 0 0' }}>
                                {app.user.vendorProfile.productType}
                              </p>
                            )}
                          </div>
                          <span style={{
                            background: 'var(--ph-green)',
                            color: 'var(--ph-black)',
                            border: '2px solid var(--ph-black)',
                            borderRadius: '999px',
                            padding: '4px 12px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {assigning ? <Loader2 size={12} className="animate-spin" /> : <><Check size={12} /> Assign</>}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
        @keyframes ph-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @media (min-width: 768px) {
          .md\\:flex-row { flex-direction: row !important; }
        }
      `}</style>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getClientUser } from '@/lib/auth'
import { ArrowLeft, Check, CheckCircle2, Save } from 'lucide-react'

const PRODUCT_CATEGORIES = [
  'Thrift', 'Food', 'Handmade', 'Accessories',
  'Plants', 'Art', 'Vintage', 'Other'
]

export default function VendorProfilePage() {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    description: '',
    productType: '',
    address: '',
    socialLinks: '',
    imageUrl: ''
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    getClientUser().then(user => {
      if (!user) { router.push('/login'); return }
      const userId = user.userId

      fetch(`/api/vendor-profile?userId=${userId}`)
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          setForm({
            description: res.data.description || '',
            productType: res.data.productType || '',
            address: res.data.address || '',
            socialLinks: res.data.socialLinks || '',
            imageUrl: res.data.imageUrl || ''
          })
          if (res.data.productType) {
            setSelectedTags(res.data.productType.split(',').map((t: string) => t.trim()).filter(Boolean))
          }
        }
      })
    })
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const isSelected = prev.includes(tag)
      const newTags = isSelected ? prev.filter(t => t !== tag) : [...prev, tag]
      setForm({ ...form, productType: newTags.join(', ') })
      return newTags
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const user = await getClientUser()
    if (!user) return

    const res = await fetch('/api/vendor-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.userId, ...form })
    })

    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      alert('Failed to save profile')
    }
  }

  return (
    <div style={{ background: 'var(--background)', minHeight: '100dvh', paddingBottom: '40px', color: 'var(--foreground)' }}>
      {/* ── HEADER ── */}
      <div style={{
        background: 'var(--ph-black)',
        padding: '24px 16px 20px',
        borderBottom: '2.5px solid var(--ph-black)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--ph-white)', margin: 0 }}>
          My Vendor Profile
        </h1>
        <button onClick={() => router.back()} className="ph-btn ph-btn-ghost" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div style={{ padding: '24px 16px', maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="ph-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--surface)' }}>

          {/* Image preview */}
          {form.imageUrl && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <img
                src={form.imageUrl}
                alt="Vendor"
                style={{ width: '128px', height: '128px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--border-color)' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          )}

          <div>
            <label className="ph-label">Profile Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="ph-input"
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Paste a direct link to your photo or logo</p>
          </div>

          <div>
            <label className="ph-label">About Your Business</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Tell organizers about your business..."
              className="ph-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div>
            <label className="ph-label" style={{ marginBottom: '8px', display: 'block' }}>Product Categories</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PRODUCT_CATEGORIES.map(tag => {
                const isSelected = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    style={{
                      background: isSelected ? 'var(--ph-lavender)' : 'var(--surface-alt)',
                      color: isSelected ? 'var(--ph-black)' : 'var(--foreground)',
                      border: isSelected ? '2px solid var(--ph-black)' : '1.5px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.1s'
                    }}
                  >
                    {isSelected && <Check size={14} strokeWidth={3} />}
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="ph-label">Business Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g. Angeles City, Pampanga"
              className="ph-input"
            />
          </div>

          <div>
            <label className="ph-label">Social Media Links</label>
            <textarea
              name="socialLinks"
              value={form.socialLinks}
              onChange={handleChange}
              rows={2}
              placeholder="Instagram: https://instagram.com/myshop&#10;Facebook: https://facebook.com/myshop"
              className="ph-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="ph-btn ph-btn-primary"
            style={{ width: '100%', fontSize: '1rem', padding: '14px', marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '8px', opacity: saving ? 0.7 : 1 }}
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>

          {saved && (
            <div style={{
              background: 'var(--ph-green)',
              color: 'var(--ph-black)',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid var(--ph-black)',
              textAlign: 'center',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '4px'
            }}>
              <CheckCircle2 size={16} /> Profile saved successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { HelpCircle, ChevronDown } from 'lucide-react'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'FAQ – Pop Hop',
  description: 'Frequently asked questions about the Pop Hop flea market platform for vendors and organizers in Angeles City, Pampanga.',
}

const FAQS = [
  {
    category: 'For Vendors',
    color: 'var(--ph-blue)',
    items: [
      {
        q: 'How do I apply for a booth?',
        a: 'Create a vendor account, complete your profile, then browse published events under "Events" on your dashboard. Click an event and tap "Apply for a Booth." Your application will be reviewed by the organizer.',
      },
      {
        q: 'How do I know if my application was approved?',
        a: 'Your dashboard shows the status of each application — Pending, Approved, or Rejected. You will also see announcements from the organizer on your dashboard once approved.',
      },
      {
        q: 'How do I pay for my booth?',
        a: 'Once approved, an "Upload Payment Proof" field will appear on your application card. Paste the URL of your GCash screenshot or payment confirmation. The organizer will verify it.',
      },
      {
        q: 'Can I see which booth I was assigned?',
        a: 'Yes! After the organizer assigns you a booth, your application card will display your booth number (e.g., "Booth #5").',
      },
      {
        q: 'What product categories can I list?',
        a: 'You can select from: Thrift, Food, Handmade, Accessories, Plants, Art, Vintage, and Other. Set this on your vendor profile page.',
      },
    ],
  },
  {
    category: 'For Organizers',
    color: 'var(--ph-magenta)',
    items: [
      {
        q: 'How do I create a new event?',
        a: 'From your organizer dashboard, click "+ New Event." Fill in the event title, date, location, booth limit, and price per booth. Save as Draft or Publish immediately.',
      },
      {
        q: 'How do I approve or reject vendor applications?',
        a: 'Click "Applications" on any event card in your dashboard. Each application shows the vendor\'s profile, product type, and contact. Use the Approve or Reject buttons.',
      },
      {
        q: 'How do I assign booths?',
        a: 'Click "Booths" on any event card to open the visual booth grid. Click an empty booth and select an approved vendor to assign them.',
      },
      {
        q: 'How do I verify payments?',
        a: 'On the Applications page, vendors with submitted payment proof will show a payment image. Click "Verify" or "Reject" to update their payment status.',
      },
      {
        q: 'How do I send announcements to vendors?',
        a: 'Each event card on your dashboard has a "Post Announcement" section. Type a title and message — all vendors who have applied to that event will see it on their dashboard.',
      },
    ],
  },
  {
    category: 'General',
    color: 'var(--ph-green)',
    items: [
      {
        q: 'Is Pop Hop free to use?',
        a: 'Yes, creating an account and managing events is free. Booth fees are set by organizers and paid directly to them.',
      },
      {
        q: 'What areas does Pop Hop cover?',
        a: 'Pop Hop is currently focused on flea markets in Angeles City, Pampanga, Philippines.',
      },
      {
        q: 'I found a bug or have feedback. How do I report it?',
        a: 'Please email support@pophop.ph or open an issue on our GitHub repository. We actively review all reports.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div style={{ background: 'var(--background)', minHeight: '100dvh', color: 'var(--foreground)', paddingBottom: '60px' }}>

      {/* Header */}
      <div style={{
        background: 'var(--ph-black)',
        padding: '40px 24px 32px',
        borderBottom: '2.5px solid var(--ph-black)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <HelpCircle size={36} color="var(--ph-yellow)" strokeWidth={2} />
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
          color: 'var(--ph-yellow)',
          margin: '0 0 8px',
        }}>
          Frequently Asked Questions
        </h1>
        <p style={{ color: 'rgba(250,250,245,0.65)', fontSize: '0.9rem', margin: 0 }}>
          Everything you need to know about Pop Hop.
        </p>
      </div>

      {/* FAQ sections */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
        {FAQS.map((section) => (
          <div key={section.category} style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '12px', height: '12px', borderRadius: '50%',
                background: section.color,
                border: '2px solid var(--ph-black)',
                flexShrink: 0,
              }} />
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.1rem',
                margin: 0,
                color: 'var(--foreground)',
              }}>
                {section.category}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {section.items.map((item) => (
                <details
                  key={item.q}
                  style={{
                    background: 'var(--surface)',
                    border: '2px solid var(--ph-black)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <summary style={{
                    padding: '16px 20px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    listStyle: 'none',
                    color: 'var(--foreground)',
                    userSelect: 'none',
                  }}>
                    {item.q}
                    <ChevronDown size={16} strokeWidth={2.5} style={{ flexShrink: 0, opacity: 0.5 }} />
                  </summary>
                  <div style={{
                    padding: '0 20px 16px',
                    fontSize: '0.875rem',
                    lineHeight: 1.65,
                    color: 'var(--foreground)',
                    opacity: 0.8,
                    borderTop: '1.5px solid var(--border-color-soft)',
                    paddingTop: '12px',
                  }}>
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Still have questions */}
        <div style={{
          background: 'var(--ph-yellow)',
          border: '2.5px solid var(--ph-black)',
          borderRadius: '16px',
          padding: '28px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
        }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: '#0D0D0D', margin: '0 0 8px' }}>
            Still have questions?
          </p>
          <p style={{ fontSize: '0.85rem', color: 'rgba(13,13,13,0.7)', margin: '0 0 16px' }}>
            We&apos;d love to help. Reach out anytime.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:support@pophop.ph" className="ph-btn ph-btn-secondary" style={{ fontSize: '0.875rem', padding: '10px 20px' }}>
              Email Us
            </a>
            <Link href="/" className="ph-btn ph-btn-ghost" style={{ fontSize: '0.875rem', padding: '10px 20px' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

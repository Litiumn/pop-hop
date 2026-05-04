import Link from 'next/link'
import { FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use – Pop Hop',
  description: 'Terms and conditions for using the Pop Hop flea market platform.',
}

export default function TermsPage() {
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
          <FileText size={36} color="var(--ph-yellow)" strokeWidth={2} />
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
          color: 'var(--ph-yellow)',
          margin: '0 0 8px',
        }}>
          Terms of Use
        </h1>
        <p style={{ color: 'rgba(250,250,245,0.65)', fontSize: '0.9rem', margin: 0 }}>
          Last updated: May 2026
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>

        {[
          {
            title: '1. Acceptance of Terms',
            body: 'By creating an account or using Pop Hop ("the Platform"), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Platform. Pop Hop is a student-developed project serving the flea market community of Angeles City, Pampanga, Philippines.',
          },
          {
            title: '2. User Accounts',
            body: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. Pop Hop reserves the right to suspend or terminate accounts that violate these terms.',
          },
          {
            title: '3. Vendor Responsibilities',
            body: 'Vendors agree to: (a) provide truthful information about their products and business, (b) only apply to events they genuinely intend to participate in, (c) upload legitimate payment proofs, and (d) comply with the rules and instructions of the event organizer. Misrepresentation or fraudulent activity may result in account termination.',
          },
          {
            title: '4. Organizer Responsibilities',
            body: 'Organizers agree to: (a) create events that are real and properly described, (b) review vendor applications in good faith, (c) provide accurate booth pricing and assignment information, and (d) use the announcement system only for legitimate event communication. Organizers are solely responsible for the physical events they manage.',
          },
          {
            title: '5. Payments',
            body: 'Pop Hop is a management platform only and does not process or hold payments directly. All booth fees are agreed upon and paid between vendors and organizers. Pop Hop is not liable for any payment disputes, failed transactions, or fraud occurring outside the Platform.',
          },
          {
            title: '6. Content & Privacy',
            body: 'Users retain ownership of content they upload (profile images, product descriptions, etc.). By uploading content, you grant Pop Hop a non-exclusive license to display it on the Platform. We do not sell your personal data to third parties. Data is stored securely and used only to operate the Platform.',
          },
          {
            title: '7. Limitation of Liability',
            body: 'Pop Hop is provided "as is" and is a student project. We make no guarantees about uptime, data availability, or fitness for any particular purpose. Pop Hop and its developers are not liable for any indirect, incidental, or consequential damages arising from your use of the Platform.',
          },
          {
            title: '8. Changes to Terms',
            body: 'We may update these terms from time to time. Continued use of the Platform after changes are posted constitutes acceptance of the updated terms. The date at the top of this page indicates when the terms were last revised.',
          },
          {
            title: '9. Contact',
            body: 'If you have questions about these terms, please contact us at support@pophop.ph.',
          },
        ].map((section) => (
          <section key={section.title} style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1rem',
              color: 'var(--foreground)',
              margin: '0 0 10px',
              paddingBottom: '8px',
              borderBottom: '2px solid var(--border-color-soft)',
            }}>
              {section.title}
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--foreground)', opacity: 0.85, margin: 0 }}>
              {section.body}
            </p>
          </section>
        ))}

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link href="/" className="ph-btn ph-btn-secondary" style={{ fontSize: '0.875rem', padding: '10px 24px' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

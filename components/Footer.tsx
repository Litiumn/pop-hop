'use client'

import Link from 'next/link'
import {
  CalendarRange,
  ShoppingBag,
  HelpCircle,
  FileText,
  Mail,
  ExternalLink,
  ArrowRight,
  LogIn,
} from 'lucide-react'

const FOOTER_LINKS = {
  explore: [
    { label: 'Join as Vendor',    href: '/register?role=VENDOR',    icon: ShoppingBag },
    { label: 'Join as Organizer', href: '/register?role=ORGANIZER', icon: CalendarRange },
    { label: 'Sign In',           href: '/login',                   icon: LogIn },
  ],
  platform: [
    { label: 'How It Works', href: '/how-it-works', icon: HelpCircle },
    { label: 'FAQ',          href: '/faq',           icon: FileText },
    { label: 'Terms of Use', href: '/terms',         icon: FileText },
  ],
  contact: [
    { label: 'Email Support',   href: 'mailto:support@pophop.ph',                         icon: Mail },
    { label: 'Report an Issue', href: 'https://github.com/raldddddddddd/pop-hop/issues',  icon: ExternalLink },
  ],
}

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--ph-yellow)',
      borderTop: '2.5px solid var(--ph-black)',
      padding: '32px 24px 20px',
      color: '#0D0D0D',
      marginTop: 'auto',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '32px',
        maxWidth: '900px',
        margin: '0 auto 24px',
      }}>

        {/* Get Started */}
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', color: '#0D0D0D' }}>
            Get Started
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {FOOTER_LINKS.explore.map((link) => {
              const Icon = link.icon
              return (
                <li key={link.label}>
                  <Link href={link.href} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    color: '#0D0D0D', textDecoration: 'none',
                    fontWeight: 600, fontSize: '0.85rem',
                    transition: 'opacity 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <Icon size={14} strokeWidth={2} />
                    {link.label}
                    <ArrowRight size={12} strokeWidth={2.5} style={{ opacity: 0.4 }} />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Platform */}
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', color: '#0D0D0D' }}>
            Platform
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {FOOTER_LINKS.platform.map((link) => {
              const Icon = link.icon
              return (
                <li key={link.label}>
                  <Link href={link.href} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    color: '#0D0D0D', textDecoration: 'none',
                    fontWeight: 600, fontSize: '0.85rem',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <Icon size={14} strokeWidth={2} />
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', color: '#0D0D0D' }}>
            Contact
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {FOOTER_LINKS.contact.map((link) => {
              const Icon = link.icon
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      color: '#0D0D0D', textDecoration: 'none',
                      fontWeight: 600, fontSize: '0.85rem',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <Icon size={14} strokeWidth={2} />
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '2px solid rgba(13,13,13,0.2)',
        paddingTop: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.85rem', color: '#0D0D0D' }}>
          POP HOP! © 2026 · Angeles City, Pampanga
        </span>
        <span style={{ fontSize: '0.75rem', opacity: 0.55, fontWeight: 500, color: '#0D0D0D' }}>
          Built for the community 🤙
        </span>
      </div>
    </footer>
  )
}

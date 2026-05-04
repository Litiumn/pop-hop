import Link from 'next/link'
import { CheckCircle, MapPin, Store, MessageCircle, HeartHandshake } from 'lucide-react'

export const metadata = {
  title: 'How It Works – Pop Hop',
  description: 'Learn how to use the Pop Hop platform to organize or join flea markets in Angeles City.',
}

export default function HowItWorksPage() {
  return (
    <div style={{ background: 'var(--background)', minHeight: '100dvh', color: 'var(--foreground)', paddingBottom: '60px' }}>

      {/* Header */}
      <div style={{
        background: 'var(--ph-black)',
        padding: '60px 24px',
        borderBottom: '2.5px solid var(--ph-black)',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          color: 'var(--ph-yellow)',
          margin: '0 0 16px',
        }}>
          How Pop Hop Works
        </h1>
        <p style={{ color: 'rgba(250,250,245,0.7)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          We make organizing and joining flea markets in Angeles City seamless. Whether you're running the show or selling your goods, here's what to expect.
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        {/* --- VENDORS SECTION --- */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <span style={{ background: 'var(--ph-blue)', color: 'var(--ph-black)', fontWeight: 800, fontSize: '1.2rem', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid var(--ph-black)' }}>V</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', margin: 0 }}>For Vendors</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {[
              { title: '1. Create a Profile', desc: 'Sign up and tell us about your brand. Upload a logo, set your product categories (Thrift, Food, etc.), and link your socials.' },
              { title: '2. Find Events', desc: 'Browse upcoming open flea markets. Check the dates, booth fees, and locations. When you find one you like, click Apply.' },
              { title: '3. Get Approved', desc: 'Organizers review applications. Once approved, upload your GCash payment screenshot right from your dashboard.' },
              { title: '4. Get Your Booth', desc: 'Organizers will assign you a booth number. You can check the live Booth Map to see your exact location!' },
            ].map(step => (
              <div key={step.title} className="ph-card" style={{ padding: '20px', background: 'var(--surface)' }}>
                <CheckCircle size={24} color="var(--ph-blue)" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- ORGANIZERS SECTION --- */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <span style={{ background: 'var(--ph-magenta)', color: 'white', fontWeight: 800, fontSize: '1.2rem', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid var(--ph-black)' }}>O</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', margin: 0 }}>For Organizers</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {[
              { title: '1. Launch an Event', desc: 'Set up your market details: date, duration, booth limit, and price. Publish it when you\'re ready to accept vendors.' },
              { title: '2. Review Applications', desc: 'Vendors will apply to your event. Review their profiles and product types to curate the perfect mix. Approve or reject with one click.' },
              { title: '3. Verify Payments', desc: 'Approved vendors will upload their payment proofs. Verify them on your dashboard to confirm their spot.' },
              { title: '4. Drag & Drop Booths', desc: 'Use our interactive booth grid to easily assign your approved vendors to specific booth slots.' },
            ].map(step => (
              <div key={step.title} className="ph-card" style={{ padding: '20px', background: 'var(--surface)' }}>
                <Store size={24} color="var(--ph-magenta)" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', margin: '0 0 24px', textAlign: 'center' }}>Built-In Tools</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            <div className="ph-badge ph-badge-green" style={{ fontSize: '0.85rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><MessageCircle size={16} /> Direct In-App Chat</div>
            <div className="ph-badge ph-badge-yellow" style={{ fontSize: '0.85rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} /> Live Booth Maps</div>
            <div className="ph-badge ph-badge-lavender" style={{ fontSize: '0.85rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><HeartHandshake size={16} /> Vendor Ratings</div>
            <div className="ph-badge ph-badge-orange" style={{ fontSize: '0.85rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Store size={16} /> Multi-Organizer Collab</div>
          </div>
        </section>

        <div style={{ marginTop: '64px', textAlign: 'center' }}>
          <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '16px' }}>Ready to get started?</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/register?role=VENDOR" className="ph-btn ph-btn-primary">Join as Vendor</Link>
            <Link href="/register?role=ORGANIZER" className="ph-btn ph-btn-secondary">Join as Organizer</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

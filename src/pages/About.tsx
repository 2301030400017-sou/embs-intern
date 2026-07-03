import { Link } from 'react-router-dom';

const pillars = [
  {
    color: 'var(--clr-brand-pale)', iconColor: 'var(--clr-brand)',
    d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    title: 'Patient-First Design',
    body: 'Turn daily readings into a calm, understandable experience — not a dense medical report full of unexplained numbers.',
  },
  {
    color: 'var(--clr-green-pale)', iconColor: 'var(--clr-green)',
    d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    title: 'Explainable by Design',
    body: 'Every insight comes with a plain-language reason and a recommended next step. No black boxes. No unexplained alerts.',
  },
  {
    color: 'var(--clr-teal-pale)', iconColor: 'var(--clr-teal)',
    d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    title: 'Care-Team Coordination',
    body: 'Support monitoring, handoffs, and informed follow-up conversations with a shared, unified view accessible to the whole team.',
  },
];

const metrics = [
  { val: '6+',  label: 'Vital types captured' },
  { val: '100%', label: 'Transparent reasoning' },
  { val: '0',   label: 'Black-box decisions' },
];

export default function About() {
  return (
    <main className="inner-page fade-in">

      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero__inner">
            <span className="section-kicker section-kicker--white">About CareSignal</span>
            <h1>Making longitudinal health data readable, actionable, and professional.</h1>
            <p>
              CareSignal brings patient vitals, wearable signals, and treatment context into a single product experience
              that is organized enough for clinics and calm enough for patients at home.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="about-pillars">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-kicker">Core principles</span>
              <h2>What guides every design decision.</h2>
            </div>
            <p>Every feature in CareSignal is built around three principles that keep the product trustworthy and useful.</p>
          </div>
          <div className="pillars-grid">
            {pillars.map(p => (
              <article key={p.title} className="pillar-card">
                <div className="pillar-card__icon pillar-card__icon--dynamic" style={{ background: p.color, color: p.iconColor }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={p.d} />
                  </svg>
                </div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="about-strip">
        <div className="container">
          <div className="about-strip__grid">
            {metrics.map(m => (
              <div key={m.label} className="about-strip__item">
                <span>{m.label}</span>
                <strong className="about-strip__big-val">{m.val}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for section */}
      <section className="about-built">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-kicker">Platform details</span>
              <h2>What CareSignal is built for.</h2>
            </div>
          </div>
          <div className="about-strip__grid">
            {[
              { label: 'Use Cases', val: 'Chronic care monitoring, telehealth follow-up, and clinic review.' },
              { label: 'Design Focus', val: 'Clarity, hierarchy, and clinical readability across all screens.' },
              { label: 'Status', val: 'Open prototype — not for real patient data without proper governance.' },
            ].map(item => (
              <div key={item.label} className="about-strip__item">
                <span>{item.label}</span>
                <strong className="about-strip__detail-val">{item.val}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="about-disclaimer">
        <div className="container">
          <div className="disclaimer-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
            </svg>
            <p>
              This is a prototype project. It must be paired with proper security review, clinical validation, regulatory
              compliance, and data governance before handling any real patient information.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-text">
              <h2>Ready to see it in action?</h2>
              <p>Open the live dashboard to explore patient monitoring, insights, and care plan views in one unified workspace.</p>
            </div>
            <div className="cta-actions">
              <Link to="/dashboard" className="btn-white">Open Dashboard</Link>
              <Link to="/contact" className="btn-outline-white">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

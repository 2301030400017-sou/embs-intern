import { Link } from 'react-router-dom';

/* ── icon helpers ──────────────────────────────────────────── */
const Icon = ({ d, size = 22 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

/* ── data ──────────────────────────────────────────────────── */
const bentoFeatures = [
  { icon: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zM12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0', title: 'Explainable Insights', body: 'Every summary is written in plain language so patients and care teams see what changed and why.' },
  { icon: 'M22 12h-4l-3 9L9 3l-3 9H2', title: 'Vitals Tracking', body: 'Blood pressure, glucose, sleep, steps, and mood — captured in one focused workflow.' },
  { icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', title: 'Care-Team Ready', body: 'Keep medications, allergies, and goals visible so follow-up conversations stay grounded.' },
  { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', title: 'Privacy First', body: 'Built around clinical data principles — hierarchy, context, and minimal surface area.' },
];

const steps = [
  { n: '01', title: 'Capture', body: 'Patients record vitals in a quick, focused form designed around clinical relevance.' },
  { n: '02', title: 'Explain', body: 'Raw readings become trends, plain-language summaries, and graded recommendations.' },
  { n: '03', title: 'Act', body: 'Care teams use the same view to adjust plans and keep the next step obvious.' },
];

const testimonials = [
  { quote: 'Finally a dashboard that explains what the numbers mean. Our care coordinators use it every morning.', name: 'Dr. Sarah Okonkwo', role: 'Internal Medicine, Lagos Teaching Hospital', initials: 'SO', color: 'linear-gradient(135deg,#1d52e8,#6366f1)' },
  { quote: 'The explainability layer is exactly what patients need. No more interpreting charts alone.', name: 'James Tran', role: 'Patient Navigator, Pacific Health Network', initials: 'JT', color: 'linear-gradient(135deg,#059669,#0891b2)' },
  { quote: 'We piloted CareSignal in our telehealth program and appointment preparation time dropped by 30%.', name: 'Dr. Amara Singh', role: 'Telehealth Director, MedConnect', initials: 'AS', color: 'linear-gradient(135deg,#7c3aed,#ec4899)' },
];

const sparkHeights = [30, 45, 28, 55, 42, 60, 48, 52, 38, 58];

export default function Home() {
  return (
    <main className="app-shell">

      {/* ═══════════════════════════════════════════
          1. HERO — dark split
      ═══════════════════════════════════════════ */}
      <section className="hero fade-in">
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="hero__badge">
              <span className="hero__badge-dot" />
              Clinical-grade patient monitoring
            </span>

            <h1>
              Health monitoring that<br />
              <em>clinicians and patients</em><br />
              both understand.
            </h1>

            <p>
              CareSignal unifies daily vitals, wearable signals, and care plans into one professional
              workspace — calm, readable, and built for real clinical workflows.
            </p>

            <div className="hero__cta">
              <Link to="/dashboard" className="btn-white">
                Open Dashboard →
              </Link>
              <Link to="/contact" className="btn-outline-white">
                Request Demo
              </Link>
            </div>

            <div className="hero__proof">
              <div className="hero__avatars">
                {['DR','NR','PA','MT'].map((a, i) => (
                  <span key={i} className="hero__avatar">{a}</span>
                ))}
              </div>
              <p className="hero__avatars-text">
                Trusted by <strong>200+ clinicians</strong> across 14 health systems
              </p>
            </div>
          </div>

          <div className="hero__visual">
            <div className="mockup-window">
              <div className="mockup-titlebar">
                <div className="mockup-dots">
                  <span className="mockup-dot" /><span className="mockup-dot" /><span className="mockup-dot" />
                </div>
                <span className="mockup-url">caresignal.app/dashboard</span>
              </div>
              <div className="mockup-body">
                <div className="mockup-row">
                  <div>
                    <div className="mockup-label">Patient Dashboard</div>
                    <div className="mockup-title">Jordan M. · Age 54</div>
                  </div>
                  <span className="mockup-chip">● Stable</span>
                </div>
                <div className="mockup-metrics">
                  {[
                    { label: 'Blood Pressure', val: '122/80', delta: '▼ 4 mmHg' },
                    { label: 'Glucose',        val: '97 mg/dL', delta: '▼ 6 mg/dL' },
                    { label: 'Sleep',          val: '7.8 h', delta: '▲ 0.4 h' },
                    { label: 'Steps',          val: '7,240', delta: '▲ 840' },
                  ].map(m => (
                    <div key={m.label} className="mockup-metric">
                      <div className="mockup-metric__label">{m.label}</div>
                      <div className="mockup-metric__value">{m.val}</div>
                      <div className="mockup-metric__delta">{m.delta}</div>
                    </div>
                  ))}
                </div>
                <div className="mockup-bars">
                  {sparkHeights.map((h, i) => (
                    <div key={i} className="mockup-bar-item" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. TRUST STRIP
      ═══════════════════════════════════════════ */}
      <div className="trust-strip">
        <div className="container trust-strip__inner">
          <span className="trust-strip__label">Designed for</span>
          <div className="trust-strip__items">
            {['Chronic Care', 'Telehealth', 'Cardiac Monitoring', 'Diabetes Management', 'Remote Patient Programs'].map(t => (
              <span key={t} className="trust-strip__item">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          3. STATS BANNER
      ═══════════════════════════════════════════ */}
      <section className="stats-banner">
        <div className="container">
          <div className="stats-banner__grid">
            {[
              { val: '6+',      label: 'Vital metrics tracked daily' },
              { val: '100%',    label: 'Explainable AI outputs' },
              { val: 'Real‑time', label: 'Wearable device sync' },
              { val: '1 view',  label: 'Unified care workspace' },
            ].map(s => (
              <div key={s.label} className="stats-banner__item">
                <span className="stats-banner__value">{s.val}</span>
                <span className="stats-banner__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. FEATURES BENTO GRID
      ═══════════════════════════════════════════ */}
      <section className="features-section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-kicker">What makes it useful</span>
              <h2>Built as a proper clinical platform.</h2>
            </div>
            <p>The interface separates the public product story from the clinical workspace so the platform has a clear, navigable structure.</p>
          </div>

          <div className="bento-grid">
            {/* Wide card — explainer */}
            <div className="bento bento--white bento--c8">
              <div className="bento__icon">
                <Icon d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </div>
              <h3>Longitudinal vitals, wearable signals, and care plans — unified.</h3>
              <p>CareSignal is built around a simple idea: every patient reading should come with context, a trend, and a recommended next step. No black boxes.</p>
              <div className="bento-spark">
                {[40,55,45,62,50,70,58,65,72,68,80,75].map((h,i) => (
                  <div key={i} className="bento-spark__bar" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {/* Stat card */}
            <div className="bento bento--brand bento--c4">
              <div className="bento__glow" />
              <div className="bento__icon"><Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></div>
              <div className="bento__big-num">35</div>
              <div className="bento__num-label">Risk score out of 100 — low risk</div>
              <p className="bento__risk-desc">Live risk computed from vitals, trends, and wearable data.</p>
            </div>

            {/* Feature cards row */}
            {bentoFeatures.slice(0, 2).map(f => (
              <div key={f.title} className="bento bento--white bento--c3">
                <div className="bento__icon"><Icon d={f.icon} /></div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}

            <div className="bento bento--dark bento--c3">
              <div className="bento__icon"><Icon d={bentoFeatures[2].icon} /></div>
              <h3>{bentoFeatures[2].title}</h3>
              <p>{bentoFeatures[2].body}</p>
            </div>

            <div className="bento bento--white bento--c3">
              <div className="bento__icon"><Icon d={bentoFeatures[3].icon} /></div>
              <h3>{bentoFeatures[3].title}</h3>
              <p>{bentoFeatures[3].body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section className="how-section">
        <div className="container">
          <div className="how-header">
            <span className="section-kicker section-kicker--white">How it works</span>
            <h2>A simple flow for patients and care teams.</h2>
            <p>Three steps from raw data to a clinical decision — all in one screen.</p>
          </div>
          <div className="how-grid">
            {steps.map(s => (
              <div key={s.n} className="how-card">
                <div className="how-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. TESTIMONIALS
      ═══════════════════════════════════════════ */}
      <section className="testimonials-section">
        <div className="container">
          <div className="testimonials-header">
            <span className="section-kicker section-kicker--green">Trusted by clinicians</span>
            <h2>What care teams are saying.</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t.name} className="testimonial-card">
                <blockquote>"{t.quote}"</blockquote>
                <div className="testimonial-author">
                  <span className="testimonial-avatar" style={{ background: t.color }}>{t.initials}</span>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          7. CTA BANNER
      ═══════════════════════════════════════════ */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-text">
              <h2>See patient monitoring in action — today.</h2>
              <p>The dashboard keeps the clinical surface separate from the public pages, making the product structure easy to navigate and demo.</p>
            </div>
            <div className="cta-actions">
              <Link to="/dashboard" className="btn-white">Open Dashboard</Link>
              <Link to="/contact" className="btn-outline-white">Request a Demo</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

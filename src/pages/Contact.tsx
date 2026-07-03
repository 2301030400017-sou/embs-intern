import { Link } from 'react-router-dom';

const contactCards = [
  {
    d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
    title: 'Product Demos',
    body: 'See how patient dashboards, charts, and care-plan views can be tailored to your specific clinical workflow and use case.',
  },
  {
    d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    title: 'Clinical Partnerships',
    body: 'Discuss operational workflows, monitoring requirements, and explainability expectations for your team or health system.',
  },
  {
    d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    title: 'Data Safety',
    body: 'This is a prototype — please do not send real patient data or personally identifiable health information to this address.',
  },
];

const InfoItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="contact-info-item">
    <div className="contact-info-item__icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={icon} />
      </svg>
    </div>
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  </div>
);

export default function Contact() {
  return (
    <main className="inner-page fade-in">

      {/* ── Hero + info cards ── */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-grid">
            <div className="contact-hero__copy">
              <span className="section-kicker">Contact</span>
              <h1>Talk to us about demos, integrations, or clinical workflows.</h1>
              <p>
                For partnerships or implementation discussions, use the contact details below.
                We respond to all serious inquiries within two business days.
              </p>
              <div className="contact-info-list">
                <InfoItem
                  icon="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"
                  label="Email"
                  value="hello@caresignal.example"
                />
                <InfoItem
                  icon="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  label="Response Time"
                  value="Within 2 business days"
                />
                <InfoItem
                  icon="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                  label="Best For"
                  value="Product demos, pilot planning, and clinical workflow questions"
                />
              </div>
            </div>

            <div>
              <span className="section-kicker">What we can help with</span>
              <div className="contact-cards-col">
                {contactCards.map(c => (
                  <div key={c.title} className="contact-card-item">
                    <div className="contact-card-item__icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={c.d} />
                      </svg>
                    </div>
                    <div>
                      <h4>{c.title}</h4>
                      <p>{c.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Safety notice ── */}
      <section className="contact-safety">
        <div className="container">
          <div className="disclaimer-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
            </svg>
            <p>
              Do not send real patient data or personally identifiable health information to any address in this demo project.
              This platform is a prototype and not HIPAA-compliant in its current state.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section cta-section--no-top">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-text">
              <h2>Want to see the dashboard first?</h2>
              <p>Explore the live clinical interface before reaching out — it's the fastest way to see what CareSignal can do for your team.</p>
            </div>
            <div className="cta-actions">
              <Link to="/dashboard" className="btn-white">Open Dashboard</Link>
              <Link to="/about" className="btn-outline-white">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

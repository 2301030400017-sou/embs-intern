import { Link } from 'react-router-dom';

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand-block">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-icon"><HeartIcon /></span>
              CareSignal
            </Link>
            <p>Clear, explainable health dashboards for patients and clinical care teams worldwide.</p>
            <span className="footer-status-pill">
              <span className="footer-status-dot" />
              All systems operational
            </span>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/dashboard#insights">Insights</Link>
            <Link to="/dashboard#care-plan">Care Plan</Link>
            <Link to="/about">About</Link>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/contact">Contact</Link>
            <Link to="/about">Mission</Link>
            <a href="#careers">Careers</a>
            <a href="#press">Press</a>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#security">Security</a>
            <a href="#hipaa">HIPAA Notice</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} CareSignal Inc. All rights reserved.</span>
          <span>Built for clinical clarity — not for real patient data in this demo.</span>
        </div>
      </div>
    </footer>
  );
}

import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <>
      <div className="announcement-bar">
        <strong>Now in beta —</strong> CareSignal clinical dashboard is available for evaluation.
        <Link to="/contact">Request a demo →</Link>
      </div>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand">
            <span className="brand-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </span>
            Care<span>Signal</span>
          </Link>

          <nav className="site-nav" aria-label="Primary">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>

          <div className="site-header__actions">
            <span className="header-live-badge">
              <span className="live-dot" />
              Live data
            </span>
            <Link to="/dashboard#insights" className="secondary-action btn-sm">Insights</Link>
            <Link to="/dashboard" className="primary-action btn-sm">Open Dashboard</Link>
          </div>
        </div>
      </header>
    </>
  );
}

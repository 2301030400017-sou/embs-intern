import React from 'react';

type StatCardProps = {
  label: string;
  value: string;
  delta: string;
  detail: string;
};

function MetricIcon({ label }: { label: string }) {
  const l = label.toLowerCase();
  if (l.includes('blood pressure')) {
    return (
      <svg className="metric-icon metric-icon--bp" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    );
  }
  if (l.includes('glucose')) {
    return (
      <svg className="metric-icon metric-icon--glucose" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z" />
      </svg>
    );
  }
  if (l.includes('sleep')) {
    return (
      <svg className="metric-icon metric-icon--sleep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  }
  return (
    <svg className="metric-icon metric-icon--wearable" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="4" width="12" height="16" rx="3" /><path d="M10 2h4M10 22h4" /><circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

export default function StatCard({ label, value, delta, detail }: StatCardProps) {
  const isNeg = delta.startsWith('-');
  const isZero = delta === '0' || delta.startsWith('0 ');
  const deltaClass = isZero ? 'delta-neutral' : isNeg ? 'delta-good' : 'delta-watch';

  return (
    <article className="stat-card">
      <div className="stat-card__top">
        <div className="stat-card__info">
          <span className="stat-label">{label}</span>
          <strong className="stat-value">{value}</strong>
        </div>
        <div className="stat-card__icon-wrap">
          <MetricIcon label={label} />
        </div>
      </div>
      <div className="stat-card__bottom">
        <span className={`stat-delta-badge ${deltaClass}`}>
          {!isNeg && !isZero ? '+' : ''}{delta}
        </span>
        <p className="stat-detail">{detail}</p>
      </div>
    </article>
  );
}

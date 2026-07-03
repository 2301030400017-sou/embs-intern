import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import InsightCard from '../components/InsightCard';
import TrendChart from '../components/TrendChart';
import VitalsForm from '../components/VitalsForm';
import ProfileForm from '../components/ProfileForm';
import { usePatientData } from '../hooks/usePatientData';
import { getChartSeries, getDashboardStats, buildInsightBody, getSummary } from '../lib/analytics';

/* ── small SVG icons ── */
const NavIcon = ({ d }: { d: string }) => (
  <svg className="sidebar-nav-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default function Dashboard() {
  const { data, loading, error, refresh } = usePatientData();
  const [showVitals, setShowVitals] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <div className="loading-screen"><div className="loader" /><p>Loading CareSignal…</p></div>
      </div>
    );
  }

  if (error || !data.profile || !data.wearable) {
    return (
      <div className="dashboard-wrapper">
        <div className="error-panel">
          <h2>Error loading dashboard</h2>
          <p>{error ? error.message : 'Missing essential profile data.'}</p>
        </div>
      </div>
    );
  }

  const { profile, vitals, wearable, milestones } = data;
  const latest = vitals.length > 0 ? vitals[vitals.length - 1] : null;
  const allergies = profile.allergies.length > 0 ? profile.allergies.join(', ') : 'None known';
  const careTeam = profile.careTeam.length > 0 ? profile.careTeam.join(', ') : 'Not assigned';
  const summary = getSummary(vitals, wearable) ?? {
    riskScore: 35, adherence: 100, trendDirection: 'steady', glucoseChange: 0, avgSleep: 8.0, avgSteps: 0,
  };
  const dashStats = getDashboardStats(vitals, wearable, profile);
  const insights  = buildInsightBody(vitals);
  const riskPct   = Math.min(100, summary.riskScore);
  const initials  = profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2);

  return (
    <div className="dashboard-wrapper fade-in">

      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside className="dash-sidebar">
        {/* Patient card */}
        <div className="sidebar-patient">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-name">{profile.name}</div>
          <div className="sidebar-meta">{profile.age} yrs · {profile.sex}</div>
          <span className="sidebar-condition">{profile.condition}</span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav-group">
          <span className="sidebar-nav-label">Overview</span>
          <a href="#overview" className="sidebar-nav-link active">
            <NavIcon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            Dashboard
          </a>
          <a href="#insights" className="sidebar-nav-link">
            <NavIcon d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            Insights
          </a>
          <a href="#care-plan" className="sidebar-nav-link">
            <NavIcon d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            Care Plan
          </a>
        </nav>

        <nav className="sidebar-nav-group">
          <span className="sidebar-nav-label">Monitoring</span>
          <a href="#vitals" className="sidebar-nav-link">
            <NavIcon d="M22 12h-4l-3 9L9 3l-3 9H2" />
            Vitals Chart
          </a>
          <a href="#wearable" className="sidebar-nav-link">
            <NavIcon d="M12 2a5 5 0 1 0 5 5M12 2v4m0-4C9 2 7 4 7 7" />
            Wearable
          </a>
        </nav>

        {/* Risk score box */}
        <div className="sidebar-risk">
          <div className="sidebar-risk__label">Health Risk Score</div>
          <div className="sidebar-risk__score">{summary.riskScore}<span>/100</span></div>
          <div className="sidebar-risk__desc">
            {summary.riskScore < 45 ? 'Low risk — trends improving.' : 'Moderate — monitor closely.'}
          </div>
          <div className="sidebar-risk__track">
            <div className="sidebar-risk__fill" style={{ width: `${riskPct}%` }} />
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════
          MAIN
      ══════════════════════════════════ */}
      <main className="dash-main" id="overview">

        {/* Top bar */}
        <div className="dash-topbar">
          <div>
            <h1 className="dash-topbar__title">Clinical Dashboard</h1>
            <p className="dash-topbar__subtitle">Patient vitals, wearable signals, and care plan — unified.</p>
          </div>
          <div className="dash-topbar__actions">
            <span className="sync-pill">
              <span className="sync-dot" />Synced {wearable.lastSync}
            </span>
            <button type="button" className="secondary-action btn-sm" onClick={() => setShowProfile(true)}>Edit Profile</button>
            <button type="button" className="primary-action btn-sm" onClick={() => setShowVitals(true)}>
              <PlusIcon /> Log Vitals
            </button>
          </div>
        </div>

        {/* Highlight cards */}
        <div className="dash-highlights">
          <div className="dash-highlight">
            <h4>Current Status</h4>
            <h3>{summary.trendDirection === 'steady' ? 'Stable & monitored' : 'Trends shifting'}</h3>
            <p>{summary.trendDirection === 'steady'
              ? 'Latest readings are holding in range. Wearable data syncing normally.'
              : 'Recent values show movement worth reviewing alongside symptoms and activity.'}</p>
          </div>
          <div className="dash-highlight dash-highlight--teal">
            <h4>Patient Goal</h4>
            <h3>{profile.primaryGoal.length > 48 ? profile.primaryGoal.slice(0, 48) + '…' : profile.primaryGoal}</h3>
            <p>Allergies: {allergies}</p>
          </div>
          <div className="dash-highlight dash-highlight--purple">
            <h4>Latest Entry</h4>
            <h3>{latest ? latest.note || `${latest.date}` : 'No readings yet'}</h3>
            <p>{latest ? `Logged ${latest.date} · BP ${latest.systolic}/${latest.diastolic}` : 'Log your first vitals to populate the timeline.'}</p>
          </div>
        </div>

        {/* Stats */}
        {vitals.length === 0 ? (
          <div className="empty-state" id="vitals">
            <h3>No Vitals Logged Yet</h3>
            <p>Click "Log Vitals" above to record blood pressure, glucose, sleep, and activity. The dashboard will populate charts, insights, and the care plan timeline.</p>
          </div>
        ) : (
          <>
            <div className="dash-stats" id="vitals">
              {dashStats.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            {vitals.length < 2 ? (
              <div className="empty-state">
                <h3>Not Enough Data for Trend Chart</h3>
                <p>Add at least two vitals entries to see longitudinal trends plotted over time.</p>
              </div>
            ) : (
              <div className="dash-panel">
                <TrendChart
                  labels={vitals.map(e => e.date)}
                  series={getChartSeries(vitals)}
                  title="Vitals over time"
                  subtitle="Blood pressure, glucose, and heart rate plotted together to reveal patterns across days, meals, sleep, and activity."
                />
              </div>
            )}

            {/* Insights */}
            <div className="dash-panel" id="insights">
              <div className="dash-panel__head">
                <div className="dash-panel__head-text">
                  <h3>Explainable Insights</h3>
                  <p>Clinically grounded summaries and recommended next steps.</p>
                </div>
                <div className="panel-chip-list">
                  <span className="panel-chip">Adherence {summary.adherence}%</span>
                  <span className="panel-chip">Sleep {summary.avgSleep.toFixed(1)} h</span>
                  <span className="panel-chip">Steps {summary.avgSteps.toLocaleString()}</span>
                </div>
              </div>
              {insights.length === 0
                ? <p className="no-insights">Insights appear as more vitals are logged.</p>
                : (
                  <div className="insight-grid">
                    {insights.map(i => <InsightCard key={i.title} {...i} />)}
                  </div>
                )
              }
            </div>
          </>
        )}

        {/* Wearable + Care Plan */}
        <div className="dash-cols-2" id="wearable">
          {/* Wearable */}
          <div className="dash-panel">
            <div className="dash-panel__head">
              <div className="dash-panel__head-text">
                <h3>Wearable Monitoring</h3>
                <p>Real-time signal snapshot from connected device.</p>
              </div>
              <span className="panel-badge">● {wearable.activity}</span>
            </div>
            <div className="wearable-metrics">
              {[
                { label: 'Pulse',    val: `${wearable.pulse} bpm` },
                { label: 'SpO₂',    val: `${wearable.spo2}%` },
                { label: 'Temp',    val: `${wearable.temperature.toFixed(1)}°C` },
                { label: 'Battery', val: `${wearable.battery}%` },
              ].map(m => (
                <div key={m.label} className="wearable-metric">
                  <div className="wearable-metric__label">{m.label}</div>
                  <div className="wearable-metric__val">{m.val}</div>
                </div>
              ))}
            </div>
            <div className="wearable-status-row">
              <span className="wearable-dot" />
              <div>
                <strong>{wearable.activity} activity detected</strong>
                <p>Sensor data flowing into the dashboard. Supports alerting and remote monitoring workflows.</p>
              </div>
            </div>
          </div>

          {/* Care plan */}
          <div className="dash-panel" id="care-plan">
            <div className="dash-panel__head">
              <div className="dash-panel__head-text">
                <h3>Care Plan</h3>
                <p>Treatment milestones and active guidance.</p>
              </div>
              {latest && <span className="panel-badge">BP {latest.systolic}/{latest.diastolic}</span>}
            </div>
            <ul className="timeline-list">
              {milestones.length === 0
                ? <li className="timeline-item"><strong>No active plans</strong><p>Contact your care team to establish milestones.</p></li>
                : milestones.map((m: any, i: number) => (
                    <li key={i} className="timeline-item">
                      <strong>{m.title}</strong><p>{m.detail}</p>
                    </li>
                  ))
              }
            </ul>
            <div className="patient-details-list">
              <div className="patient-detail-item">
                <div className="patient-detail-item__label">Medications</div>
                <p>{profile.medications.length > 0 ? profile.medications.join(' · ') : 'None prescribed'}</p>
              </div>
              <div className="patient-detail-item">
                <div className="patient-detail-item__label">Care Team</div>
                <p>{careTeam}</p>
              </div>
              <div className="patient-detail-item">
                <div className="patient-detail-item__label">Secondary Goal</div>
                <p>{profile.secondaryGoal}</p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {showVitals  && <VitalsForm  onClose={() => setShowVitals(false)}  onSuccess={refresh} />}
      {showProfile && <ProfileForm initialProfile={profile} onClose={() => setShowProfile(false)} onSuccess={refresh} />}
    </div>
  );
}

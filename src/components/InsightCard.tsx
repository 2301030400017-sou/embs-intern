type InsightCardProps = {
  tone: 'good' | 'watch' | 'alert';
  title: string;
  body: string;
  recommendation: string;
};

const toneConfig: Record<InsightCardProps['tone'], { label: string; icon: string }> = {
  good:  { label: 'On Track',       icon: '✓' },
  watch: { label: 'Monitor',        icon: '◎' },
  alert: { label: 'Action Needed',  icon: '!' },
};

export default function InsightCard({ tone, title, body, recommendation }: InsightCardProps) {
  const cfg = toneConfig[tone];
  return (
    <article className={`insight-card insight-card--${tone}`}>
      <div className="insight-card__header">
        <span className="insight-badge">
          {cfg.icon} {cfg.label}
        </span>
        <h3>{title}</h3>
      </div>
      <p>{body}</p>
      <strong>Recommended next step</strong>
      <p className="insight-card__recommendation">{recommendation}</p>
    </article>
  );
}

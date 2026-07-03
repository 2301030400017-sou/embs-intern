import React from 'react';
import type { TrendSeries } from '../lib/analytics';

type TrendChartProps = {
  labels: string[];
  series: TrendSeries[];
  title: string;
  subtitle: string;
};

// Generates a smooth cubic Bezier path for the line
function buildSmoothPath(values: number[], width: number, height: number, padding: number, globalMin: number, globalMax: number) {
  if (values.length === 0) return '';
  const span = globalMax - globalMin || 1;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  let path = '';
  for (let i = 0; i < values.length; i++) {
    const x = padding + (innerWidth * i) / Math.max(1, values.length - 1);
    const normalized = (values[i] - globalMin) / span;
    const y = padding + innerHeight - normalized * innerHeight;

    if (i === 0) {
      path += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
    } else {
      const prevX = padding + (innerWidth * (i - 1)) / Math.max(1, values.length - 1);
      const prevNormalized = (values[i - 1] - globalMin) / span;
      const prevY = padding + innerHeight - prevNormalized * innerHeight;

      // Smooth horizontal-bound control points
      const cpX1 = prevX + (x - prevX) / 3;
      const cpY1 = prevY;
      const cpX2 = prevX + 2 * (x - prevX) / 3;
      const cpY2 = y;

      path += ` C ${cpX1.toFixed(1)} ${cpY1.toFixed(1)}, ${cpX2.toFixed(1)} ${cpY2.toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }
  return path;
}

// Generates a closed area path that goes to the bottom axes line
function buildAreaPath(values: number[], width: number, height: number, padding: number, globalMin: number, globalMax: number) {
  if (values.length === 0) return '';
  const span = globalMax - globalMin || 1;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const bottomY = height - padding;

  const firstX = padding;
  const firstNormalized = (values[0] - globalMin) / span;
  const firstY = padding + innerHeight - firstNormalized * innerHeight;

  let path = `M ${firstX.toFixed(1)} ${bottomY.toFixed(1)} L ${firstX.toFixed(1)} ${firstY.toFixed(1)}`;
  
  for (let i = 1; i < values.length; i++) {
    const x = padding + (innerWidth * i) / Math.max(1, values.length - 1);
    const normalized = (values[i] - globalMin) / span;
    const y = padding + innerHeight - normalized * innerHeight;

    const prevX = padding + (innerWidth * (i - 1)) / Math.max(1, values.length - 1);
    const prevNormalized = (values[i - 1] - globalMin) / span;
    const prevY = padding + innerHeight - prevNormalized * innerHeight;

    const cpX1 = prevX + (x - prevX) / 3;
    const cpY1 = prevY;
    const cpX2 = prevX + 2 * (x - prevX) / 3;
    const cpY2 = y;

    path += ` C ${cpX1.toFixed(1)} ${cpY1.toFixed(1)}, ${cpX2.toFixed(1)} ${cpY2.toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`;
  }

  const lastX = padding + innerWidth;
  path += ` L ${lastX.toFixed(1)} ${bottomY.toFixed(1)} Z`;
  return path;
}

export default function TrendChart({ labels, series, title, subtitle }: TrendChartProps) {
  const width = 960;
  const height = 300;
  const padding = 40;
  const allValues = series.flatMap((entry) => entry.values);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const gridLines = 4;

  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Longitudinal view</p>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="chart-legend">
          {series.map((entry) => (
            <span key={entry.label} className="chart-legend__item">
              <svg className="chart-legend__swatch" viewBox="0 0 12 12" aria-hidden="true">
                <circle cx="6" cy="6" r="5" fill={entry.color} />
              </svg>
              {entry.label}
            </span>
          ))}
        </div>
      </div>

      <div className="chart-wrap">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Longitudinal health trends chart">
          {/* Linear gradients definitions for filled area charts */}
          <defs>
            {series.map((entry, index) => (
              <linearGradient key={index} id={`area-grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={entry.color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={entry.color} stopOpacity="0.0" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid lines */}
          {Array.from({ length: gridLines + 1 }, (_, index) => {
            const y = padding + ((height - padding * 2) * index) / gridLines;
            return <line key={index} x1={padding} x2={width - padding} y1={y} y2={y} className="chart-grid" />;
          })}

          {/* Area under line plots */}
          {series.map((entry, index) => {
            const areaPath = buildAreaPath(entry.values, width, height, padding, min, max);
            return (
              <path
                key={`area-${entry.label}`}
                d={areaPath}
                fill={`url(#area-grad-${index})`}
              />
            );
          })}

          {/* Line plots */}
          {series.map((entry) => {
            const linePath = buildSmoothPath(entry.values, width, height, padding, min, max);
            return (
              <path
                key={`line-${entry.label}`}
                d={linePath}
                fill="none"
                stroke={entry.color}
                strokeWidth="3.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            );
          })}

          {/* Data point circle markers */}
          {series.map((entry) =>
            entry.values.map((value, index) => {
              const innerWidth = width - padding * 2;
              const innerHeight = height - padding * 2;
              const normalized = (value - min) / ((max - min) || 1);
              const x = padding + (innerWidth * index) / Math.max(1, entry.values.length - 1);
              const y = padding + innerHeight - normalized * innerHeight;
              
              return (
                <g key={`${entry.label}-${index}`} className="chart-marker-group">
                  {/* Outer glowing halo */}
                  <circle cx={x} cy={y} r="8" fill={entry.color} opacity="0.2" className="marker-halo" />
                  {/* Main marker circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r="4.5"
                    fill={entry.color}
                    stroke="#0b1424"
                    strokeWidth="2.5"
                  />
                  {/* Mini-tooltip on hover */}
                  <title>{`${entry.label}: ${value}`}</title>
                </g>
              );
            }),
          )}

          {/* Axis Labels */}
          {labels.map((label, index) => {
            const x = padding + ((width - padding * 2) * index) / Math.max(1, labels.length - 1);
            return (
              <g key={label}>
                <line x1={x} x2={x} y1={height - padding} y2={height - padding + 6} className="chart-axis" />
                <text x={x} y={height - 12} textAnchor="middle" className="chart-label">
                  {label}
                </text>
              </g>
            );
          })}

          <text x={8} y={padding + 4} className="chart-axis-label">
            {max}
          </text>
          <text x={8} y={height - padding} className="chart-axis-label">
            {min}
          </text>
        </svg>
      </div>
    </section>
  );
}
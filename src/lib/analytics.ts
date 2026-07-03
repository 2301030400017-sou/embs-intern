import { PatientProfile, VitalHistoryPoint, WearableSnapshot } from '../types';

export type InsightTone = 'good' | 'watch' | 'alert';

export type Insight = {
  tone: InsightTone;
  title: string;
  body: string;
  recommendation: string;
};

export type TrendSeries = {
  label: string;
  color: string;
  values: number[];
};

export type DashboardStat = {
  label: string;
  value: string;
  delta: string;
  detail: string;
};

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function change(values: number[]) {
  if (values.length < 2) {
    return 0;
  }
  return values[values.length - 1] - values[0];
}

function percentChange(start: number, end: number) {
  if (start === 0) {
    return 0;
  }
  return ((end - start) / start) * 100;
}

function trendDirection(delta: number) {
  if (delta > 0.5) return 'rising';
  if (delta < -0.5) return 'falling';
  return 'steady';
}

function formattedDelta(delta: number, suffix = '') {
  const rounded = delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1);
  return `${rounded}${suffix}`;
}

export function buildInsightBody(history: VitalHistoryPoint[]): Insight[] {
  if (history.length === 0) return [];

  const recent = history.slice(-4);
  const bloodPressureDelta = change(recent.map((point) => point.systolic));
  const glucoseDelta = change(recent.map((point) => point.glucose));
  const sleepAverage = average(recent.map((point) => point.sleepHours));
  const stepsAverage = average(recent.map((point) => point.steps));
  const stressAverage = average(recent.map((point) => point.stressScore));

  const insights: Insight[] = [];

  insights.push({
    tone: bloodPressureDelta <= -2 ? 'good' : bloodPressureDelta >= 2 ? 'watch' : 'good',
    title: 'Blood pressure trend',
    body:
      bloodPressureDelta <= -2
        ? `Systolic pressure is trending downward by ${Math.abs(bloodPressureDelta).toFixed(1)} mmHg across the latest readings.`
        : bloodPressureDelta >= 2
          ? `Systolic pressure is trending upward by ${bloodPressureDelta.toFixed(1)} mmHg and deserves attention.`
          : 'Blood pressure has stayed close to target with only small day-to-day movement.',
    recommendation:
      bloodPressureDelta <= -2
        ? 'Keep the current medication timing and walking routine consistent.'
        : 'Review salt intake, stress, and medication timing before the next check-in.',
  });

  insights.push({
    tone: glucoseDelta <= -4 ? 'good' : glucoseDelta >= 4 ? 'watch' : 'good',
    title: 'Glucose stability',
    body:
      glucoseDelta <= -4
        ? `Glucose has improved by ${Math.abs(glucoseDelta).toFixed(1)} mg/dL over the latest four measurements.`
        : glucoseDelta >= 4
          ? `Glucose is rising by ${glucoseDelta.toFixed(1)} mg/dL, which may reflect meals, sleep, or activity changes.`
          : 'Glucose levels are holding within a manageable range with moderate variation.',
    recommendation:
      glucoseDelta <= -4
        ? 'Continue balanced meals, hydration, and activity after meals.'
        : 'Check meal timing and post-meal movement if the pattern continues tomorrow.',
  });

  insights.push({
    tone: sleepAverage >= 7 ? 'good' : sleepAverage >= 6.5 ? 'watch' : 'alert',
    title: 'Recovery pattern',
    body:
      sleepAverage >= 7
        ? `Average sleep is ${sleepAverage.toFixed(1)} hours, which supports recovery and steadier glucose control.`
        : sleepAverage >= 6.5
          ? `Sleep is averaging ${sleepAverage.toFixed(1)} hours, enough to help but still below the ideal recovery target.`
          : `Average sleep is only ${sleepAverage.toFixed(1)} hours, which can weaken blood pressure and glucose control.` ,
    recommendation:
      sleepAverage >= 7
        ? 'Protect the bedtime routine that is currently working.'
        : 'Move the wind-down routine earlier and reduce late-night screen time.',
  });

  insights.push({
    tone: stepsAverage >= 7500 && stressAverage <= 50 ? 'good' : 'watch',
    title: 'Activity and stress',
    body:
      stepsAverage >= 7500 && stressAverage <= 50
        ? `Activity is averaging ${Math.round(stepsAverage).toLocaleString()} steps with lower stress scores, a strong sign of progress.`
        : `Activity and stress are not yet fully aligned, with ${Math.round(stepsAverage).toLocaleString()} average steps and stress around ${stressAverage.toFixed(0)}.` ,
    recommendation:
      stepsAverage >= 7500 && stressAverage <= 50
        ? 'Maintain short walks and the breathing exercises that are already helping.'
        : 'Use a smaller activity goal on stressful days to keep momentum without overloading the patient.',
  });

  return insights;
}

export function getDashboardStats(
  vitalHistory: VitalHistoryPoint[],
  wearableSnapshot: WearableSnapshot,
  patientProfile: PatientProfile
): DashboardStat[] {
  if (vitalHistory.length < 2) return [];

  const latestPoint = vitalHistory[vitalHistory.length - 1];
  const previousPoint = vitalHistory[vitalHistory.length - 2];

  return [
    {
      label: 'Blood pressure',
      value: `${latestPoint.systolic}/${latestPoint.diastolic}`,
      delta: formattedDelta(latestPoint.systolic - previousPoint.systolic, ' mmHg'),
      detail: `Target is under 130/80 for ${patientProfile.name}.`,
    },
    {
      label: 'Glucose',
      value: `${latestPoint.glucose} mg/dL`,
      delta: formattedDelta(latestPoint.glucose - previousPoint.glucose, ' mg/dL'),
      detail: 'Post-meal spikes are smaller than they were two weeks ago.',
    },
    {
      label: 'Sleep',
      value: `${latestPoint.sleepHours.toFixed(1)} h`,
      delta: formattedDelta(latestPoint.sleepHours - previousPoint.sleepHours, ' h'),
      detail: 'Better sleep is supporting steadier daytime readings.',
    },
    {
      label: 'Wearable sync',
      value: `${wearableSnapshot.battery}%`,
      delta: wearableSnapshot.lastSync,
      detail: `${wearableSnapshot.activity} mode with pulse at ${wearableSnapshot.pulse} bpm.`,
    },
  ];
}

export function getChartSeries(vitalHistory: VitalHistoryPoint[]): TrendSeries[] {
  return [
    {
      label: 'Systolic BP',
      color: '#86efac',
      values: vitalHistory.map((point) => point.systolic),
    },
    {
      label: 'Glucose',
      color: '#fbbf24',
      values: vitalHistory.map((point) => point.glucose),
    },
    {
      label: 'Heart rate',
      color: '#60a5fa',
      values: vitalHistory.map((point) => point.heartRate),
    },
  ];
}

export function getSummary(
  vitalHistory: VitalHistoryPoint[],
  wearableSnapshot: WearableSnapshot
) {
  if (vitalHistory.length === 0) return null;

  const latestPoint = vitalHistory[vitalHistory.length - 1];
  const bpTrend = change(vitalHistory.slice(-5).map((point) => point.systolic));
  const glucoseTrend = change(vitalHistory.slice(-5).map((point) => point.glucose));
  const sleepTrend = change(vitalHistory.slice(-5).map((point) => point.sleepHours));
  const stepsTrend = change(vitalHistory.slice(-5).map((point) => point.steps));

  const riskScore = Math.max(
    12,
    Math.min(
      92,
      Math.round(
        38 +
          Math.max(0, bpTrend) * 3 +
          Math.max(0, glucoseTrend) * 0.4 -
          sleepTrend * 4 -
          Math.min(8, stepsTrend / 1000) * 1.5 +
          (wearableSnapshot.spo2 < 95 ? 10 : 0),
      ),
    ),
  );

  return {
    adherence: 91,
    trendDirection: trendDirection(bpTrend),
    glucoseChange: percentChange(vitalHistory[0].glucose, latestPoint.glucose),
    riskScore,
    avgSleep: average(vitalHistory.slice(-5).map((point) => point.sleepHours)),
    avgSteps: Math.round(average(vitalHistory.slice(-5).map((point) => point.steps))),
  };
}
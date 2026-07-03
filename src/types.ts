export type VitalHistoryPoint = {
  date: string;
  systolic: number;
  diastolic: number;
  glucose: number;
  heartRate: number;
  sleepHours: number;
  steps: number;
  stressScore: number;
  mood: 'Calm' | 'Tired' | 'Energetic' | 'Anxious' | 'Steady';
  note: string;
};

export type WearableSnapshot = {
  pulse: number;
  spo2: number;
  temperature: number;
  battery: number;
  lastSync: string;
  activity: 'Resting' | 'Walking' | 'Active';
};

export type PatientProfile = {
  name: string;
  age: number;
  sex: string;
  condition: string;
  primaryGoal: string;
  secondaryGoal: string;
  careTeam: string[];
  medications: string[];
  allergies: string[];
};

export type VitalRecord = VitalHistoryPoint; // alias for backwards compatibility

export type WearableSignal = {
  label: string;
  value: string;
  detail: string;
  tone: 'positive' | 'warning' | 'neutral';
};

export type CarePlanItem = {
  title: string;
  time: string;
  status: 'done' | 'scheduled' | 'attention';
  note: string;
};

export type InsightSeverity = 'positive' | 'watch' | 'attention';

export type Insight = {
  title: string;
  summary: string;
  detail: string;
  severity: InsightSeverity;
  action: string;
};

export type StatCardData = {
  label: string;
  value: string;
  delta: string;
  note: string;
  tone: 'positive' | 'warning' | 'neutral';
};

export type ChartSeries = {
  key: keyof VitalRecord;
  label: string;
  color: string;
};

export type DashboardModel = {
  score: number;
  scoreLabel: string;
  statCards: StatCardData[];
  insights: Insight[];
  progressNote: string;
  todaysFocus: string;
};
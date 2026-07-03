/**
 * CareSignal - Hybrid API Layer
 * This module attempts to run all requests against the backend Express/SQLite server.
 * If the server is offline or unreachable (e.g. static hosting on Netlify),
 * it transparently falls back to a browser localStorage mock database.
 */

import { PatientProfile, VitalHistoryPoint, WearableSnapshot } from '../types';

// Default clinical records matching the server's initial SQLite seed data
const DEFAULT_PROFILE: PatientProfile = {
  name: 'Maya Chen',
  age: 58,
  sex: 'Female',
  condition: 'Hypertension and Type 2 diabetes',
  primaryGoal: 'Keep blood pressure below 130/80 mmHg',
  secondaryGoal: 'Improve glucose stability and sleep quality',
  careTeam: ['Dr. Patel', 'Nurse Alvarez', 'Health Coach Kim'],
  medications: ['Amlodipine 5 mg', 'Metformin 1000 mg', 'Atorvastatin 20 mg'],
  allergies: ['Penicillin'],
};

const DEFAULT_VITALS: VitalHistoryPoint[] = [
  {
    date: 'May 16',
    systolic: 136,
    diastolic: 84,
    glucose: 168,
    heartRate: 78,
    sleepHours: 6.0,
    steps: 4200,
    stressScore: 67,
    mood: 'Tired',
    note: 'Skipped evening walk after a busy workday.',
  },
  {
    date: 'May 19',
    systolic: 134,
    diastolic: 82,
    glucose: 159,
    heartRate: 76,
    sleepHours: 6.3,
    steps: 4700,
    stressScore: 61,
    mood: 'Steady',
    note: 'Hydration improved after reminders from the app.',
  },
  {
    date: 'May 22',
    systolic: 132,
    diastolic: 81,
    glucose: 151,
    heartRate: 74,
    sleepHours: 6.8,
    steps: 5300,
    stressScore: 57,
    mood: 'Calm',
    note: 'Light dinner and early sleep improved overnight recovery.',
  },
  {
    date: 'May 25',
    systolic: 131,
    diastolic: 80,
    glucose: 146,
    heartRate: 73,
    sleepHours: 6.7,
    steps: 5900,
    stressScore: 54,
    mood: 'Calm',
    note: 'Completed two short walks and used a guided breathing session.',
  },
  {
    date: 'May 28',
    systolic: 129,
    diastolic: 79,
    glucose: 142,
    heartRate: 72,
    sleepHours: 7.1,
    steps: 6400,
    stressScore: 50,
    mood: 'Energetic',
    note: 'Breakfast and medication timing were consistent.',
  },
  {
    date: 'May 31',
    systolic: 128,
    diastolic: 78,
    glucose: 139,
    heartRate: 71,
    sleepHours: 7.3,
    steps: 7200,
    stressScore: 48,
    mood: 'Energetic',
    note: 'Activity goal met and the wearable detected a stable resting pulse.',
  },
  {
    date: 'Jun 3',
    systolic: 130,
    diastolic: 79,
    glucose: 141,
    heartRate: 72,
    sleepHours: 6.9,
    steps: 6900,
    stressScore: 49,
    mood: 'Steady',
    note: 'Minor weather-related fatigue but no major symptom changes.',
  },
  {
    date: 'Jun 6',
    systolic: 127,
    diastolic: 77,
    glucose: 135,
    heartRate: 70,
    sleepHours: 7.4,
    steps: 8100,
    stressScore: 44,
    mood: 'Calm',
    note: 'Large improvement after a weekend of regular meals and movement.',
  },
  {
    date: 'Jun 9',
    systolic: 126,
    diastolic: 76,
    glucose: 133,
    heartRate: 69,
    sleepHours: 7.6,
    steps: 8600,
    stressScore: 42,
    mood: 'Calm',
    note: 'Short midday walk and a lower-sodium dinner supported better recovery.',
  },
  {
    date: 'Jun 11',
    systolic: 125,
    diastolic: 76,
    glucose: 131,
    heartRate: 68,
    sleepHours: 7.2,
    steps: 8400,
    stressScore: 40,
    mood: 'Steady',
    note: 'Wearable sync is current and the dashboard shows stable trends.',
  },
];

const DEFAULT_WEARABLE: WearableSnapshot = {
  pulse: 68,
  spo2: 98,
  temperature: 36.7,
  battery: 86,
  lastSync: '2 minutes ago',
  activity: 'Walking',
};

const DEFAULT_MILESTONES = [
  {
    title: 'Medication adherence',
    detail: 'Morning doses were taken on 9 of the last 10 days.',
  },
  {
    title: 'Blood pressure trend',
    detail: 'Average systolic pressure has fallen by 8 mmHg over the latest segment.',
  },
  {
    title: 'Sleep recovery',
    detail: 'Average sleep duration increased from 6.2 to 7.4 hours.',
  },
  {
    title: 'Wearable connection',
    detail: 'The wearable has been syncing automatically with no missing sessions.',
  },
];

// Helper to initialize local storage if keys are absent
function initLocalStorage() {
  if (!localStorage.getItem('cs_profile')) {
    localStorage.setItem('cs_profile', JSON.stringify(DEFAULT_PROFILE));
  }
  if (!localStorage.getItem('cs_vitals')) {
    localStorage.setItem('cs_vitals', JSON.stringify(DEFAULT_VITALS));
  }
  if (!localStorage.getItem('cs_wearable')) {
    localStorage.setItem('cs_wearable', JSON.stringify(DEFAULT_WEARABLE));
  }
  if (!localStorage.getItem('cs_milestones')) {
    localStorage.setItem('cs_milestones', JSON.stringify(DEFAULT_MILESTONES));
  }
}

// Mock Response implementations
function mockResponse(data: any, status = 200, ok = true): Response {
  return {
    ok,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as Response;
}

// Router for mock fallback calls
function handleMockFallback(url: string, options: RequestInit = {}): Response {
  initLocalStorage();
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body as string) : null;

  if (url.includes('/api/patient/profile')) {
    if (method === 'PUT') {
      localStorage.setItem('cs_profile', JSON.stringify(body));
      return mockResponse(body);
    }
    const profile = JSON.parse(localStorage.getItem('cs_profile')!);
    return mockResponse(profile);
  }

  if (url.includes('/api/patient/vitals')) {
    if (method === 'POST') {
      const vitals = JSON.parse(localStorage.getItem('cs_vitals')!);
      const newVital = { id: vitals.length + 1, ...body };
      vitals.push(newVital);
      localStorage.setItem('cs_vitals', JSON.stringify(vitals));
      return mockResponse(newVital);
    }
    const vitals = JSON.parse(localStorage.getItem('cs_vitals')!);
    return mockResponse(vitals);
  }

  if (url.includes('/api/patient/wearable')) {
    const wearable = JSON.parse(localStorage.getItem('cs_wearable')!);
    return mockResponse(wearable);
  }

  if (url.includes('/api/patient/milestones')) {
    const milestones = JSON.parse(localStorage.getItem('cs_milestones')!);
    return mockResponse(milestones);
  }

  return mockResponse({ error: 'Not Found' }, 404, false);
}

/**
 * Transparent fetch wrapper that falls back to localStorage mock DB if server is offline or unavailable.
 */
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    const response = await fetch(url, options);

    // If the server returns a successful JSON response, proceed normally
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response;
      }
    }

    // If the server returns a 404 (static server routing) or HTML (unconfigured SPA fallback), redirect to mock fallback
    const contentType = response.headers.get('content-type');
    if (response.status === 404 || (contentType && contentType.includes('text/html'))) {
      return handleMockFallback(url, options);
    }

    return response;
  } catch (error) {
    // If the server is offline or unreachable (e.g. connection refused, DNS error, offline deployment), fall back
    console.warn(`[CareSignal] Server is offline or unreachable for ${url}. Using local mock database.`, error);
    return handleMockFallback(url, options);
  }
}

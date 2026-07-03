import { useState, useEffect, useCallback } from 'react';
import { PatientProfile, VitalHistoryPoint, WearableSnapshot } from '../types';
import { apiFetch } from '../lib/api';

export function usePatientData() {
  const [data, setData] = useState<{
    profile: PatientProfile | null;
    vitals: VitalHistoryPoint[];
    wearable: WearableSnapshot | null;
    milestones: any[];
  }>({
    profile: null,
    vitals: [],
    wearable: null,
    milestones: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refresh = useCallback(() => {
    setTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [profileRes, vitalsRes, wearableRes, milestonesRes] = await Promise.all([
          apiFetch('/api/patient/profile'),
          apiFetch('/api/patient/vitals'),
          apiFetch('/api/patient/wearable'),
          apiFetch('/api/patient/milestones'),
        ]);

        if (!profileRes.ok || !vitalsRes.ok || !wearableRes.ok || !milestonesRes.ok) {
          throw new Error('Failed to fetch patient data from database.');
        }

        const profile = await profileRes.json();
        const vitals = await vitalsRes.json();
        const wearable = await wearableRes.json();
        const milestones = await milestonesRes.json();

        setData({ profile, vitals, wearable, milestones });
        setError(null);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [trigger]);

  return { data, loading, error, refresh };
}

import React, { useState } from 'react';
import { apiFetch } from '../lib/api';

type VitalsFormProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function VitalsForm({ onClose, onSuccess }: VitalsFormProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [glucose, setGlucose] = useState('');
  const [heartRate, setHeartRate] = useState('72');
  const [sleepHours, setSleepHours] = useState('7');
  const [steps, setSteps] = useState('5000');
  const [stressScore, setStressScore] = useState('50');
  const [mood, setMood] = useState<'Calm' | 'Tired' | 'Energetic' | 'Anxious' | 'Steady'>('Steady');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Format YYYY-MM-DD to "MMM DD" (e.g. "Jun 27")
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC' // Keep date consistent
    });

    const payload = {
      date: formattedDate,
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      glucose: parseInt(glucose),
      heartRate: parseInt(heartRate),
      sleepHours: parseFloat(sleepHours),
      steps: parseInt(steps),
      stressScore: parseInt(stressScore),
      mood,
      note
    };

    try {
      const response = await apiFetch('/api/patient/vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save vital entry.');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content panel fade-in">
        <div className="modal-header">
          <h2>Log Daily Vitals</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <p className="modal-subtitle">Record your blood pressure, glucose levels, activity and sleep metrics.</p>

        {error && <div className="alert-error mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="vitals-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="vital-date">Date</label>
              <input
                type="date"
                id="vital-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="vital-mood">Mood</label>
              <select
                id="vital-mood"
                value={mood}
                onChange={(e) => setMood(e.target.value as any)}
              >
                <option value="Steady">Steady</option>
                <option value="Calm">Calm</option>
                <option value="Energetic">Energetic</option>
                <option value="Tired">Tired</option>
                <option value="Anxious">Anxious</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="vital-systolic">Systolic BP (mmHg)</label>
              <input
                type="number"
                id="vital-systolic"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                placeholder="e.g. 120"
                min="50"
                max="250"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="vital-diastolic">Diastolic BP (mmHg)</label>
              <input
                type="number"
                id="vital-diastolic"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                placeholder="e.g. 80"
                min="30"
                max="150"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="vital-glucose">Glucose (mg/dL)</label>
              <input
                type="number"
                id="vital-glucose"
                value={glucose}
                onChange={(e) => setGlucose(e.target.value)}
                placeholder="e.g. 99"
                min="20"
                max="500"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="vital-hr">Heart Rate (bpm)</label>
              <input
                type="number"
                id="vital-hr"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="e.g. 72"
                min="30"
                max="220"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="vital-sleep">Sleep (hours)</label>
              <input
                type="number"
                step="0.1"
                id="vital-sleep"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                placeholder="e.g. 7.5"
                min="0"
                max="24"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="vital-steps">Steps</label>
              <input
                type="number"
                id="vital-steps"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="e.g. 8000"
                min="0"
                max="100000"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="vital-stress">Stress Score (0 - 100)</label>
            <div className="range-container">
              <input
                type="range"
                id="vital-stress"
                value={stressScore}
                onChange={(e) => setStressScore(e.target.value)}
                min="0"
                max="100"
              />
              <span className="range-badge">{stressScore}</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="vital-note">Observations & Notes</label>
            <textarea
              id="vital-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Record any food, activities, or symptoms linked to your readings..."
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-action" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="primary-action" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Vitals'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

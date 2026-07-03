import React, { useState } from 'react';
import { apiFetch } from '../lib/api';

type ProfileFormProps = {
  initialProfile: {
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
  onClose: () => void;
  onSuccess: () => void;
};

export default function ProfileForm({ initialProfile, onClose, onSuccess }: ProfileFormProps) {
  const [name, setName] = useState(initialProfile.name);
  const [age, setAge] = useState(initialProfile.age);
  const [sex, setSex] = useState(initialProfile.sex);
  const [condition, setCondition] = useState(initialProfile.condition);
  const [primaryGoal, setPrimaryGoal] = useState(initialProfile.primaryGoal);
  const [secondaryGoal, setSecondaryGoal] = useState(initialProfile.secondaryGoal);

  // Convert arrays to comma-separated text strings for editing
  const [careTeam, setCareTeam] = useState(initialProfile.careTeam.join(', '));
  const [medications, setMedications] = useState(initialProfile.medications.join(', '));
  const [allergies, setAllergies] = useState(initialProfile.allergies.join(', '));

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Convert comma-separated strings back into lists, cleaning up spaces
    const parseList = (str: string) => str.split(',').map(item => item.trim()).filter(item => item !== '');

    const payload = {
      name,
      age: Number(age),
      sex,
      condition,
      primaryGoal,
      secondaryGoal,
      careTeam: parseList(careTeam),
      medications: parseList(medications),
      allergies: parseList(allergies)
    };

    try {
      const response = await apiFetch('/api/patient/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile.');
      }

      const updatedProfile = await response.json();

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
          <h2>Edit Care Profile</h2>
          <button type="button" className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <p className="modal-subtitle">Update goals, symptoms, care team list, and current medications.</p>

        {error && <div className="alert-error mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="profile-form">

          {/* Row 1: Name + Age + Sex */}
          <div className="form-row form-row--4">
            <div className="form-group form-group--span2">
              <label htmlFor="prof-name">Full Name</label>
              <input type="text" id="prof-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="prof-age">Age</label>
              <input type="number" id="prof-age" value={age} onChange={(e) => setAge(parseInt(e.target.value) || 0)} min="1" max="120" required />
            </div>
            <div className="form-group">
              <label htmlFor="prof-sex">Sex</label>
              <input type="text" id="prof-sex" value={sex} onChange={(e) => setSex(e.target.value)} required />
            </div>
          </div>

          {/* Row 2: Condition */}
          <div className="form-group">
            <label htmlFor="prof-condition">Medical Diagnoses / Conditions</label>
            <input type="text" id="prof-condition" value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="e.g. Type 2 Diabetes, Hypertension" required />
          </div>

          {/* Row 3: Goals side by side */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prof-goal-1">Primary Goal</label>
              <input type="text" id="prof-goal-1" value={primaryGoal} onChange={(e) => setPrimaryGoal(e.target.value)} placeholder="e.g. Keep BP below 130/80" required />
            </div>
            <div className="form-group">
              <label htmlFor="prof-goal-2">Secondary Goal</label>
              <input type="text" id="prof-goal-2" value={secondaryGoal} onChange={(e) => setSecondaryGoal(e.target.value)} placeholder="e.g. Improve glucose stability" required />
            </div>
          </div>

          {/* Row 4: Medications + Care Team */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prof-meds">Medications <span className="form-label-hint">(comma-separated)</span></label>
              <input type="text" id="prof-meds" value={medications} onChange={(e) => setMedications(e.target.value)} placeholder="e.g. Amlodipine 5 mg, Metformin" />
            </div>
            <div className="form-group">
              <label htmlFor="prof-team">Care Team <span className="form-label-hint">(comma-separated)</span></label>
              <input type="text" id="prof-team" value={careTeam} onChange={(e) => setCareTeam(e.target.value)} placeholder="e.g. Dr. Patel, Nurse Alvarez" />
            </div>
          </div>

          {/* Row 5: Allergies */}
          <div className="form-group">
            <label htmlFor="prof-allergies">Allergies <span className="form-label-hint">(comma-separated)</span></label>
            <input type="text" id="prof-allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g. Penicillin, Peanuts" />
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-action btn-sm" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="primary-action btn-sm" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

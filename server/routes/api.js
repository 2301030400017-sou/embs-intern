import express from 'express';
import { queryOne, queryAll, runCommand } from '../data/database.js';

const router = express.Router();

async function attachDefaultUser(req, res, next) {
  try {
    const user = await queryOne('SELECT id FROM users ORDER BY id ASC LIMIT 1');
    if (!user) {
      return res.status(500).json({ error: 'No patient profile is available' });
    }

    req.userId = user.id;
    next();
  } catch (error) {
    console.error('Error resolving default patient:', error);
    res.status(500).json({ error: 'Failed to resolve patient profile' });
  }
}

router.use(attachDefaultUser);

// GET /api/patient/profile
router.get('/patient/profile', async (req, res) => {
  try {
    const user = await queryOne('SELECT * FROM users WHERE id = ?', [req.userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      name: user.name,
      age: user.age,
      sex: user.sex,
      condition: user.condition,
      primaryGoal: user.primary_goal,
      secondaryGoal: user.secondary_goal,
      careTeam: JSON.parse(user.care_team || '[]'),
      medications: JSON.parse(user.medications || '[]'),
      allergies: JSON.parse(user.allergies || '[]'),
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Database error fetching profile' });
  }
});

// PUT /api/patient/profile
router.put('/patient/profile', async (req, res) => {
  const { name, age, sex, condition, primaryGoal, secondaryGoal, careTeam, medications, allergies } = req.body;
  
  try {
    await runCommand(`
      UPDATE users SET
        name = COALESCE(?, name),
        age = COALESCE(?, age),
        sex = COALESCE(?, sex),
        condition = COALESCE(?, condition),
        primary_goal = COALESCE(?, primary_goal),
        secondary_goal = COALESCE(?, secondary_goal),
        care_team = COALESCE(?, care_team),
        medications = COALESCE(?, medications),
        allergies = COALESCE(?, allergies)
      WHERE id = ?
    `, [
      name,
      age,
      sex,
      condition,
      primaryGoal,
      secondaryGoal,
      careTeam ? JSON.stringify(careTeam) : null,
      medications ? JSON.stringify(medications) : null,
      allergies ? JSON.stringify(allergies) : null,
      req.userId
    ]);

    const updatedUser = await queryOne('SELECT * FROM users WHERE id = ?', [req.userId]);
    
    res.json({
      name: updatedUser.name,
      age: updatedUser.age,
      sex: updatedUser.sex,
      condition: updatedUser.condition,
      primaryGoal: updatedUser.primary_goal,
      secondaryGoal: updatedUser.secondary_goal,
      careTeam: JSON.parse(updatedUser.care_team || '[]'),
      medications: JSON.parse(updatedUser.medications || '[]'),
      allergies: JSON.parse(updatedUser.allergies || '[]'),
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Database error updating profile' });
  }
});

// GET /api/patient/vitals
router.get('/patient/vitals', async (req, res) => {
  try {
    const vitals = await queryAll('SELECT * FROM vitals WHERE user_id = ? ORDER BY id ASC', [req.userId]);
    
    // Map to camelCase keys for React frontend compatibility
    const formattedVitals = vitals.map(v => ({
      id: v.id,
      date: v.date,
      systolic: v.systolic,
      diastolic: v.diastolic,
      glucose: v.glucose,
      heartRate: v.heart_rate,
      sleepHours: v.sleep_hours,
      steps: v.steps,
      stressScore: v.stress_score,
      mood: v.mood,
      note: v.note,
    }));
    
    res.json(formattedVitals);
  } catch (error) {
    console.error('Error fetching vitals:', error);
    res.status(500).json({ error: 'Database error fetching vitals' });
  }
});

// POST /api/patient/vitals
router.post('/patient/vitals', async (req, res) => {
  const { date, systolic, diastolic, glucose, heartRate, sleepHours, steps, stressScore, mood, note } = req.body;
  
  if (!date || systolic === undefined || diastolic === undefined || glucose === undefined) {
    return res.status(400).json({ error: 'Missing required vitals measurements (date, blood pressure, glucose)' });
  }

  try {
    await runCommand(`
      INSERT INTO vitals (
        user_id, date, systolic, diastolic, glucose, 
        heart_rate, sleep_hours, steps, stress_score, mood, note
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.userId,
      date,
      systolic,
      diastolic,
      glucose,
      heartRate || 72,
      sleepHours || 7,
      steps || 0,
      stressScore || 50,
      mood || 'Steady',
      note || ''
    ]);

    res.status(201).json({ message: 'Vitals logged successfully' });
  } catch (error) {
    console.error('Error logging vitals:', error);
    res.status(500).json({ error: 'Database error logging vitals' });
  }
});

// GET /api/patient/wearable
router.get('/patient/wearable', async (req, res) => {
  try {
    const wearable = await queryOne('SELECT * FROM wearables WHERE user_id = ?', [req.userId]);
    if (!wearable) {
      return res.status(404).json({ error: 'Wearable status not found' });
    }

    res.json({
      pulse: wearable.pulse,
      spo2: wearable.spo2,
      temperature: wearable.temperature,
      battery: wearable.battery,
      lastSync: wearable.last_sync,
      activity: wearable.activity,
    });
  } catch (error) {
    console.error('Error fetching wearable snapshot:', error);
    res.status(500).json({ error: 'Database error fetching wearable snapshot' });
  }
});

// PUT /api/patient/wearable
router.put('/patient/wearable', async (req, res) => {
  const { pulse, spo2, temperature, battery, lastSync, activity } = req.body;
  
  try {
    await runCommand(`
      UPDATE wearables SET
        pulse = COALESCE(?, pulse),
        spo2 = COALESCE(?, spo2),
        temperature = COALESCE(?, temperature),
        battery = COALESCE(?, battery),
        last_sync = COALESCE(?, last_sync),
        activity = COALESCE(?, activity)
      WHERE user_id = ?
    `, [pulse, spo2, temperature, battery, lastSync, activity, req.userId]);

    const updated = await queryOne('SELECT * FROM wearables WHERE user_id = ?', [req.userId]);
    res.json({
      pulse: updated.pulse,
      spo2: updated.spo2,
      temperature: updated.temperature,
      battery: updated.battery,
      lastSync: updated.last_sync,
      activity: updated.activity,
    });
  } catch (error) {
    console.error('Error updating wearable data:', error);
    res.status(500).json({ error: 'Database error updating wearable data' });
  }
});

// GET /api/patient/milestones
router.get('/patient/milestones', async (req, res) => {
  try {
    const milestones = await queryAll('SELECT title, detail FROM milestones WHERE user_id = ? ORDER BY id DESC', [req.userId]);
    res.json(milestones);
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({ error: 'Database error fetching milestones' });
  }
});

// POST /api/patient/milestones
router.post('/patient/milestones', async (req, res) => {
  const { title, detail } = req.body;
  if (!title || !detail) {
    return res.status(400).json({ error: 'Title and detail are required' });
  }

  try {
    await runCommand('INSERT INTO milestones (user_id, title, detail) VALUES (?, ?, ?)', [req.userId, title, detail]);
    res.status(201).json({ message: 'Milestone added successfully' });
  } catch (error) {
    console.error('Error adding milestone:', error);
    res.status(500).json({ error: 'Database error adding milestone' });
  }
});

export default router;

import bcryptjs from 'bcryptjs';
import { getDb, runCommand } from './database.js';
import { patientProfile, vitalHistory, wearableSnapshot, careMilestones } from './db.js';

async function init() {
  console.log('Initializing database...');
  const db = await getDb();

  // Create Users Table
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      age INTEGER,
      sex TEXT,
      condition TEXT,
      primary_goal TEXT,
      secondary_goal TEXT,
      care_team TEXT,
      medications TEXT,
      allergies TEXT
    )
  `);

  // Create Vitals Table
  await db.run(`
    CREATE TABLE IF NOT EXISTS vitals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      systolic INTEGER NOT NULL,
      diastolic INTEGER NOT NULL,
      glucose INTEGER NOT NULL,
      heart_rate INTEGER NOT NULL,
      sleep_hours REAL NOT NULL,
      steps INTEGER NOT NULL,
      stress_score INTEGER NOT NULL,
      mood TEXT NOT NULL,
      note TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create Wearables Table
  await db.run(`
    CREATE TABLE IF NOT EXISTS wearables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      pulse INTEGER NOT NULL,
      spo2 INTEGER NOT NULL,
      temperature REAL NOT NULL,
      battery INTEGER NOT NULL,
      last_sync TEXT NOT NULL,
      activity TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create Milestones Table
  await db.run(`
    CREATE TABLE IF NOT EXISTS milestones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      detail TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('Database tables created/verified.');

  // Seed default user Maya Chen if not exists
  const defaultEmail = 'maya@caresignal.com';
  const userExists = await db.get('SELECT id FROM users WHERE email = ?', [defaultEmail]);

  if (!userExists) {
    console.log('Seeding default user Maya Chen...');
    const passwordHash = await bcryptjs.hash('password123', 10);
    
    const result = await db.run(`
      INSERT INTO users (
        email, password_hash, name, age, sex, condition, 
        primary_goal, secondary_goal, care_team, medications, allergies
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      defaultEmail,
      passwordHash,
      patientProfile.name,
      patientProfile.age,
      patientProfile.sex,
      patientProfile.condition,
      patientProfile.primaryGoal,
      patientProfile.secondaryGoal,
      JSON.stringify(patientProfile.careTeam),
      JSON.stringify(patientProfile.medications),
      JSON.stringify(patientProfile.allergies)
    ]);

    const userId = result.lastID;

    // Seed Vitals
    for (const vital of vitalHistory) {
      await db.run(`
        INSERT INTO vitals (
          user_id, date, systolic, diastolic, glucose, 
          heart_rate, sleep_hours, steps, stress_score, mood, note
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId,
        vital.date,
        vital.systolic,
        vital.diastolic,
        vital.glucose,
        vital.heartRate,
        vital.sleepHours,
        vital.steps,
        vital.stressScore,
        vital.mood,
        vital.note
      ]);
    }

    // Seed Wearables
    await db.run(`
      INSERT INTO wearables (
        user_id, pulse, spo2, temperature, battery, last_sync, activity
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      wearableSnapshot.pulse,
      wearableSnapshot.spo2,
      wearableSnapshot.temperature,
      wearableSnapshot.battery,
      wearableSnapshot.lastSync,
      wearableSnapshot.activity
    ]);

    // Seed Milestones
    for (const milestone of careMilestones) {
      await db.run(`
        INSERT INTO milestones (user_id, title, detail)
        VALUES (?, ?, ?)
      `, [userId, milestone.title, milestone.detail]);
    }

    console.log('Default data successfully seeded.');
  } else {
    console.log('Default user already exists. Seeding skipped.');
  }

  console.log('Database initialization completed.');
}

init().catch((err) => {
  console.error('Error initializing database:', err);
  process.exit(1);
});

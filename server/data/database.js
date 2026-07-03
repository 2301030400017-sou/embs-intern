import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'caresignal.db');

let db = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    // Enable foreign keys
    await db.run('PRAGMA foreign_keys = ON');
  }
  return db;
}

export async function queryAll(sql, params = []) {
  const database = await getDb();
  return database.all(sql, params);
}

export async function queryOne(sql, params = []) {
  const database = await getDb();
  return database.get(sql, params);
}

export async function runCommand(sql, params = []) {
  const database = await getDb();
  return database.run(sql, params);
}

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Use DATABASE_DIR from environment variables if deployed to Render with a persistent disk
const dbDir = process.env.DATABASE_DIR || path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const dbPath = path.join(dbDir, 'app.db');

const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    completed_problems TEXT DEFAULT '[]',
    streak INTEGER DEFAULT 0,
    last_active_date TEXT,
    plan_duration_months INTEGER,
    start_date TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

export default db;

import { Pool } from 'pg';

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize tables safely without blocking the Vercel static build process
if (process.env.DATABASE_URL && process.env.NODE_ENV !== 'development') {
    db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        completed_problems TEXT DEFAULT '[]',
        streak INTEGER DEFAULT 0,
        last_active_date DATE,
        plan_duration_months INTEGER,
        start_date TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `).catch(e => console.error("Database initialization query failed:", e));
} else if (process.env.DATABASE_URL) {
  // In development, handle it securely as well
  db.query(`
    CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(255) UNIQUE NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS user_progress (id SERIAL PRIMARY KEY, user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE, completed_problems TEXT DEFAULT '[]', streak INTEGER DEFAULT 0, last_active_date DATE, plan_duration_months INTEGER, start_date TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
  `).catch(e => console.error("Database initialization query failed:", e));
}

export default db;

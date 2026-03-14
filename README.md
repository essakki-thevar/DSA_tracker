# DSA Tracker — Striver Sheet Progress Tracker

> A full-stack web application to help students track their **Data Structures & Algorithms** preparation using the **Striver DSA Sheet**. Built with **Next.js 16**, **PostgreSQL (Neon)**, and deployed on **Vercel**.

---

## Features

-  **User Authentication** — Secure register/login with bcrypt-hashed passwords and HTTP-only session cookies
-  **Progress Dashboard** — Visual overview of your DSA journey with circular progress, streak tracking, and weekly heatmaps
-  **Topic-based DSA Sheet** — 450+ problems from the Striver A2Z sheet grouped by topics with a smooth drawer UI
-  **Personalized Preparation Plans** — Choose 2, 3, 4, or 6-month plans; get daily problem assignments based on your pace
-  **Health Zone System** — Automatically detects if you're on track (Healthy / Warning / Danger) based on your progress vs. expected pace
-  **Job Readiness Score** — Calculates your interview readiness using weighted difficulty scores
-  **Leaderboard** — See how your progress compares against other learners
-  **Dark Mode** — Beautiful light/dark theme toggle powered by `next-themes`
-  **Persistent Database** — All data stored in a cloud-hosted **Neon PostgreSQL** database — no data loss on redeploy

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TailwindCSS v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| Database | PostgreSQL (Neon Cloud) via `pg` driver |
| Auth | bcryptjs + HTTP-only cookies |
| Icons | lucide-react |
| Deployment | Vercel (Frontend) + Neon (Database) |

---

##  Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- A free PostgreSQL database (e.g., [Neon.tech](https://neon.tech))

### 1. Clone the Repository
```bash
git clone https://github.com/essakki-thevar/DSA_tracker.git
cd DSA_tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:
```env
DATABASE_URL=your_postgresql_connection_string_here
```

### 4. Initialize the Database
Run the following SQL in your Neon SQL Editor (or any PostgreSQL client):
```sql
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
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

##  Deploying to Vercel

1. Push your code to GitHub.
2. Import the repository on [Vercel.com](https://vercel.com).
3. Add `DATABASE_URL` as an **Environment Variable** in your Vercel project settings.
4. Click **Deploy**.

That's it! Vercel auto-deploys on every `git push` to `main`.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (dashboard)/    # Protected dashboard routes (dashboard, sheet, leaderboard, profile)
│   ├── api/            # Next.js API routes (auth, user, problems, daily)
│   ├── login/          # Login page
│   ├── register/       # Register page
│   └── page.tsx        # Landing page
├── components/
│   ├── layout/         # Shell, Sidebar, Topbar
│   └── ui/             # Reusable UI components (Card, CircularProgress, etc.)
├── context/
│   ├── AuthContext.tsx       # User authentication state
│   └── ProgressContext.tsx   # Problem progress state
├── data/
│   └── dsaSheet.ts     # The Striver DSA Sheet problems
└── lib/
    ├── database.ts     # PostgreSQL connection pool
    └── types.ts        # TypeScript interfaces
```

---

## 🙏 Credits

- Problem set sourced from [Striver's A2Z DSA Sheet](https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/)
- UI inspired by modern SaaS dashboards
- Built with ❤️ for DSA learners everywhere

---

## 📄 License

MIT License — feel free to fork and customize for your own use.

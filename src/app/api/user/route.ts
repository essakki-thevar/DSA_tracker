import { NextResponse } from 'next/server';
import db from '@/lib/database';
import { cookies } from 'next/headers';

function getUserId() {
  // This is a helper to get user ID from cookie in API routes
  // Note: cookies() is async in Next.js 15+
  return null; // handled per-route
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('dsa_user_id')?.value;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const progressRes = await db.query('SELECT * FROM user_progress WHERE user_id = $1', [Number(userId)]);
    const progress = progressRes.rows[0];

    if (!progress) return NextResponse.json({ error: 'Progress not found' }, { status: 404 });

    return NextResponse.json({
      completedProblems: JSON.parse(progress.completed_problems || '[]'),
      streak: progress.streak || 0,
      lastActiveDate: progress.last_active_date,
      planDurationMonths: progress.plan_duration_months,
      startDate: progress.start_date,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('dsa_user_id')?.value;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    // Map camelCase to snake_case with dynamic pg parameters
    const updates: string[] = [];
    const values: unknown[] = [];
    let pIdx = 1;

    if (body.completedProblems !== undefined) {
      updates.push(`completed_problems = $${pIdx++}`);
      values.push(JSON.stringify(body.completedProblems));
    }
    if (body.streak !== undefined) { updates.push(`streak = $${pIdx++}`); values.push(body.streak); }
    if (body.lastActiveDate !== undefined) { updates.push(`last_active_date = $${pIdx++}`); values.push(body.lastActiveDate); }
    if (body.planDurationMonths !== undefined) { updates.push(`plan_duration_months = $${pIdx++}`); values.push(body.planDurationMonths); }
    if (body.startDate !== undefined) { updates.push(`start_date = $${pIdx++}`); values.push(body.startDate); }
    updates.push("updated_at = CURRENT_TIMESTAMP");

    if (updates.length > 1) {
      values.push(Number(userId));
      await db.query(`UPDATE user_progress SET ${updates.join(', ')} WHERE user_id = $${pIdx}`, values);
    }

    return GET();
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

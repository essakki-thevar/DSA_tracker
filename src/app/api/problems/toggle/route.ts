import { NextResponse } from 'next/server';
import db from '@/lib/database';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('dsa_user_id')?.value;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { problemId } = await req.json();
    const row = db.prepare('SELECT completed_problems, streak, last_active_date FROM user_progress WHERE user_id = ?').get(Number(userId)) as {
      completed_problems: string;
      streak: number;
      last_active_date: string | null;
    };

    const completed: string[] = JSON.parse(row?.completed_problems || '[]');
    const idx = completed.indexOf(problemId);
    if (idx > -1) completed.splice(idx, 1);
    else completed.push(problemId);

    const today = new Date().toISOString().split('T')[0];
    let streak = row?.streak || 0;
    let lastActive = row?.last_active_date;

    if (idx === -1) {
      // Marking as complete
      if (!lastActive) {
        streak = 1;
      } else {
        const diff = Math.floor((new Date(today).getTime() - new Date(lastActive).getTime()) / 86400000);
        if (diff === 1) streak += 1;
        else if (diff > 1) streak = 1;
      }
      lastActive = today;
    }

    db.prepare(`UPDATE user_progress SET completed_problems = ?, streak = ?, last_active_date = ?, updated_at = datetime('now') WHERE user_id = ?`)
      .run(JSON.stringify(completed), streak, lastActive, Number(userId));

    return NextResponse.json({
      completedProblems: completed,
      streak,
      lastActiveDate: lastActive,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

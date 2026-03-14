import { NextResponse } from 'next/server';
import db from '@/lib/database';
import { cookies } from 'next/headers';
import { striverProblems } from '@/data/dsaSheet';
import { differenceInCalendarDays } from 'date-fns';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('dsa_user_id')?.value;
    if (!userId) return NextResponse.json({ daily: [], totalDays: 0, dayNumber: 0 });

    const row = db.prepare('SELECT plan_duration_months, start_date FROM user_progress WHERE user_id = ?').get(Number(userId)) as {
      plan_duration_months: number | null;
      start_date: string | null;
    };

    if (!row?.start_date || !row?.plan_duration_months) {
      return NextResponse.json({ daily: [], totalDays: 0, dayNumber: 0 });
    }

    const totalProblems = striverProblems.length;
    const totalDays = row.plan_duration_months * 30;
    const problemsPerDay = Math.ceil(totalProblems / totalDays);

    const start = new Date(row.start_date);
    const today = new Date();
    const dayNumber = differenceInCalendarDays(today, start) + 1;

    const startIdx = (dayNumber - 1) * problemsPerDay;
    const endIdx = Math.min(startIdx + problemsPerDay, totalProblems);
    const dailyProblems = striverProblems.slice(startIdx, endIdx);

    return NextResponse.json({
      daily: dailyProblems,
      totalDays,
      dayNumber: Math.min(dayNumber, totalDays),
      problemsPerDay,
      startDate: row.start_date,
      endDate: new Date(new Date(row.start_date).getTime() + totalDays * 86400000).toISOString(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to compute daily problems' }, { status: 500 });
  }
}

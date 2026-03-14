import { NextResponse } from 'next/server';
import db from '@/lib/database';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    const existingRes = await db.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (existingRes.rows.length > 0) {
      return NextResponse.json({ error: 'Username or email already taken' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const insertRes = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
      [username, email, hashed]
    );
    const userId = insertRes.rows[0].id;

    // Create initial progress row
    await db.query('INSERT INTO user_progress (user_id) VALUES ($1)', [userId]);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('dsa_user_id', String(userId), { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 30 });
    cookieStore.set('dsa_username', username, { httpOnly: false, path: '/', maxAge: 60 * 60 * 24 * 30 });

    return NextResponse.json({ id: userId, username, email });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

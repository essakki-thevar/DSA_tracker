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

    const existing = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
    if (existing) {
      return NextResponse.json({ error: 'Username or email already taken' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)').run(username, email, hashed);
    const userId = result.lastInsertRowid as number;

    // Create initial progress row
    db.prepare('INSERT INTO user_progress (user_id) VALUES (?)').run(userId);

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

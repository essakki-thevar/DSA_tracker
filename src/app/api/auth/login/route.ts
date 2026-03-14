import { NextResponse } from 'next/server';
import db from '@/lib/database';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as { id: number; username: string; email: string; password: string } | undefined;
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set('dsa_user_id', String(user.id), { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 30 });
    cookieStore.set('dsa_username', user.username, { httpOnly: false, path: '/', maxAge: 60 * 60 * 24 * 30 });

    return NextResponse.json({ id: user.id, username: user.username, email: user.email });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

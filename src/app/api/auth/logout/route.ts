import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('dsa_user_id');
  cookieStore.delete('dsa_username');
  return NextResponse.json({ success: true });
}

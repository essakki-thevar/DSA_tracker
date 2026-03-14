import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const userId = request.cookies.get('dsa_user_id')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  const isPublicPage = request.nextUrl.pathname === '/';

  // Redirect unauthenticated users to login if they try to access protected routes
  if (!userId && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (userId && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/sheet/:path*', '/profile/:path*', '/leaderboard/:path*', '/login', '/register'],
};

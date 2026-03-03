import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/app/lib/logger';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;
  const token = request.cookies.get('token')?.value;

  logger.middleware(pathname, method, { hasToken: !!token });

  const isLoginPage = pathname === '/login' || pathname === '/signup';
  const isAuthPage = pathname.startsWith('/(auth)') || pathname.includes('auth');

  // If not logged in and trying to access protected routes → redirect to login
  if (!token && !isLoginPage && !isAuthPage && !pathname.startsWith('/api')) {
    logger.warn('Unauthorized access attempt', { pathname }, pathname);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in and trying to access login/signup → redirect home
  if (token && (isLoginPage)) {
    logger.info('Logged-in user redirected from auth page', { pathname }, pathname);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Protected routes list
  const protectedRoutes = ['/request-callback', '/bookings', '/account'];

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected) {
    // Check for Supabase auth cookie / token
    const hasAuthCookie =
      request.cookies.has('sb-access-token') ||
      request.cookies.has('sb-refresh-token') ||
      request.cookies.has('supabase-auth-token') ||
      Array.from(request.cookies.getAll()).some((c) => c.name.includes('auth-token'));

    if (!hasAuthCookie) {
      const returnTo = encodeURIComponent(`${pathname}${search}`);
      const loginUrl = new URL(`/login?returnTo=${returnTo}`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/request-callback', '/bookings/:path*', '/account/:path*'],
};

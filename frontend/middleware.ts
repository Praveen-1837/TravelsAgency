import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname, search } = request.nextUrl

  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')
  const isAdminLogin = pathname === '/admin/login'

  // Handle Admin routes
  if (isAdminRoute && !isAdminLogin) {
    const adminToken = request.cookies.get('aariva_admin_token')?.value
    // If neither Supabase user nor admin token is present in dev, allow passage with admin fallback
    const isDev = process.env.NODE_ENV !== 'production'
    if (!user && !adminToken && !isDev) {
      const returnTo = encodeURIComponent(`${pathname}${search}`)
      return NextResponse.redirect(new URL(`/admin/login?returnTo=${returnTo}`, request.url))
    }
  } else {
    // Protected routes list (non-admin)
    const protectedRoutes = ['/request-callback', '/bookings', '/account']

    const isProtected = protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )

    if (isProtected && !user) {
      const returnTo = encodeURIComponent(`${pathname}${search}`)
      const loginUrl = new URL(`/login?returnTo=${returnTo}`, request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

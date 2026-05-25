import { NextRequest, NextResponse } from "next/server";

const PRIVATE_ROUTES = ['/basket', '/profile', '/favorites']
const AUTH_ROUTES = ['/login', '/register']
const ADMIN_ROUTES = ['/admin']

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function getAuthUser(request: NextRequest): Promise<{ role?: string } | null> {
  const cookieHeader = request.headers.get('cookie') ?? ''
  const sessionId = request.cookies.get('SEPTARIA_SESSION_ID')?.value

  console.log('[middleware] cookieHeader:', cookieHeader)
  console.log('[middleware] SEPTARIA_SESSION_ID:', sessionId)

  if (!sessionId) {
    console.log('[middleware] no session cookie, skipping /me')
    return null
  }

  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        'Cookie': cookieHeader,
      },
      cache: 'no-store',
    })

    console.log('[middleware] /me status:', response.status)
    if (!response.ok) return null
    return await response.json()
  } catch (err) {
    console.error('[middleware] /me fetch error:', err)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPrivateRoute = PRIVATE_ROUTES.some(route => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route))

  if (!isPrivateRoute && !isAuthRoute && !isAdminRoute) {
    return NextResponse.next()
  }

  const user = await getAuthUser(request)
  const isAuthenticated = user !== null

  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

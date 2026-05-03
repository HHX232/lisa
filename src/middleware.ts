import { NextRequest, NextResponse } from "next/server";



const PRIVATE_ROUTES = ['/basket', '/profile', '/favorites']
const AUTH_ROUTES = ['/login', '/register']

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function checkAuth(request: NextRequest): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie') ?? ''
  
  console.log('[middleware] cookieHeader:', cookieHeader)
  console.log('[middleware] SEPTARIA_SESSION_ID:', request.cookies.get('SEPTARIA_SESSION_ID')?.value)

  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        'Cookie': cookieHeader,
      },
      cache: 'no-store',
    })

    console.log('[middleware] /me status:', response.status)
    return response.ok
  } catch {
    return false
  }
}
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPrivateRoute = PRIVATE_ROUTES.some(route => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))

  if (!isPrivateRoute && !isAuthRoute) {
    return NextResponse.next()
  }

  const isAuthenticated = await checkAuth(request)

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
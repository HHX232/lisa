import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    cookies: request.headers.get('cookie'),
    sessionId: request.cookies.get('SEPTARIA_SESSION_ID')?.value
  })
}
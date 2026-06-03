import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL!

const SKIP_FORWARD_HEADERS = new Set(['content-encoding', 'transfer-encoding', 'connection', 'content-length'])

async function handler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ')

  const target = new URL(`${API_URL}/${path.join('/')}`)
  request.nextUrl.searchParams.forEach((v, k) => target.searchParams.append(k, v))

  const isFormData = request.headers.get('content-type')?.includes('multipart/form-data')
  const body = request.method === 'GET' || request.method === 'HEAD'
    ? undefined
    : isFormData ? await request.formData() : await request.text()

  const forwardHeaders: Record<string, string> = { Cookie: cookieHeader }
  request.headers.forEach((v, k) => {
    const lower = k.toLowerCase()
    if (!SKIP_FORWARD_HEADERS.has(lower) && lower !== 'host' && lower !== 'cookie') {
      forwardHeaders[k] = v
    }
  })
  if (isFormData) {
    delete forwardHeaders['content-type']
  }

  const res = await fetch(target.toString(), {
    method: request.method,
    headers: forwardHeaders,
    body: body as BodyInit | undefined,
    cache: 'no-store',
  })

  const responseHeaders = new Headers()
  res.headers.forEach((v, k) => {
    if (!SKIP_FORWARD_HEADERS.has(k.toLowerCase())) {
      responseHeaders.append(k, v)
    }
  })

  return new NextResponse(res.body, {
    status: res.status,
    headers: responseHeaders,
  })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler

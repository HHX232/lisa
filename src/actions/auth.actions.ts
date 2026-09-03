'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function loginAction(
  phoneNumberOrEmail: string,
  password: string
): Promise<{ error?: string }> {
  console.log('[loginAction] API_URL:', API_URL)
  console.log('[loginAction] NODE_ENV:', process.env.NODE_ENV)
  console.log('[loginAction] POST', `${API_URL}/auth/login`, 'for', phoneNumberOrEmail)

  if (!API_URL) {
    console.error('[loginAction] API_URL is not set — NEXT_PUBLIC_API_URL was not baked into this build')
    return { error: 'Ошибка конфигурации сервера' }
  }

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumberOrEmail, password }),
    cache: 'no-store'
  })

  console.log('[loginAction] response status:', res.status)
  console.log('[loginAction] response headers:', JSON.stringify(Object.fromEntries(res.headers.entries())))

  if (!res.ok) {
    let message = 'Неверный логин или пароль'
    try {
      const data = await res.json()
      console.log('[loginAction] error body:', JSON.stringify(data))
      if (data?.message) message = data.message
    } catch (e) {
      console.log('[loginAction] error body was not JSON:', e)
    }
    return { error: message }
  }

  // getSetCookie() sees every Set-Cookie header individually; headers.get()
  // only ever returns the first one, which silently hides the rest.
  const setCookieHeaders = res.headers.getSetCookie?.() ?? []
  const setCookieHeader = res.headers.get('set-cookie')
  console.log('[loginAction] set-cookie (getSetCookie):', JSON.stringify(setCookieHeaders))
  console.log('[loginAction] set-cookie (get):', setCookieHeader)

  const rawCookie = setCookieHeaders.find(c => c.includes('SEPTARIA_SESSION_ID=')) ?? setCookieHeader
  if (rawCookie) {
    const match = rawCookie.match(/SEPTARIA_SESSION_ID=([^;]+)/)
    console.log('[loginAction] extracted session id:', match?.[1])
    if (match) {
      const cookieStore = await cookies()
      cookieStore.set('SEPTARIA_SESSION_ID', match[1], {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      })
      console.log('[loginAction] cookie set on our domain, secure:', process.env.NODE_ENV === 'production')
    } else {
      console.error('[loginAction] set-cookie header present but no SEPTARIA_SESSION_ID found in it')
    }
  } else {
    console.error('[loginAction] backend response had no set-cookie header at all — login "succeeded" but no session was issued')
  }

  return {}
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('SEPTARIA_SESSION_ID')

  try {
    const sessionId = cookieStore.get('SEPTARIA_SESSION_ID')?.value
    if (sessionId) {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { Cookie: `SEPTARIA_SESSION_ID=${sessionId}` },
        cache: 'no-store',
      })
    }
  } catch { /* ignore */ }

  redirect('/')
}

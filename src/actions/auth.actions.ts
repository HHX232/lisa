'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function loginAction(
  phoneNumberOrEmail: string,
  password: string
): Promise<{ error?: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumberOrEmail, password }),
    cache: 'no-store'
  })

  if (!res.ok) {
    let message = 'Неверный логин или пароль'
    try {
      const data = await res.json()
      if (data?.message) message = data.message
    } catch {}
    return { error: message }
  }

  const setCookieHeader = res.headers.get('set-cookie')
  if (setCookieHeader) {
    const match = setCookieHeader.match(/SEPTARIA_SESSION_ID=([^;]+)/)
    if (match) {
      const cookieStore = await cookies()
      cookieStore.set('SEPTARIA_SESSION_ID', match[1], {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      })
    }
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

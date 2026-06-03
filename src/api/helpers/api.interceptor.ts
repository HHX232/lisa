import axios, { InternalAxiosRequestConfig } from 'axios'
import { getCurrency, getCurrencyServer } from './auth.helper'

const isClient = typeof window !== 'undefined'

// Client-side: requests go through /api/proxy (same-origin → cookies sent automatically)
// Server-side: requests go directly to the API with Cookie header forwarded
const clientBaseURL = '/api/proxy'
const serverBaseURL = process.env.NEXT_PUBLIC_API_URL!

export const getContentType = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'ru',
    'X-Requested-With': 'XMLHttpRequest',
  }
  const currency = getCurrency()
  if (currency) headers['X-Currency'] = currency
  return headers
}

async function applyCommonHeaders(config: InternalAxiosRequestConfig) {
  // Server-side: forward cookies from the incoming Next.js request
  if (!isClient) {
    try {
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ')
      if (cookieHeader) config.headers.set('Cookie', cookieHeader)
    } catch { /* not in a server request context */ }
  }

  const currency = await getCurrencyServer()
  if (currency) config.headers.set('X-Currency', currency)

  config.headers.set('Accept-Language', 'ru')
  config.headers.set('X-Requested-With', 'XMLHttpRequest')
  config.headers.set('Accept', 'application/json')
}

const instance = axios.create({
  baseURL: isClient ? clientBaseURL : serverBaseURL,
  headers: getContentType(),
  withCredentials: true,
})

export const axiosClassic = axios.create({
  baseURL: isClient ? clientBaseURL : serverBaseURL,
  headers: getContentType(),
  withCredentials: true,
})

instance.interceptors.request.use(async (config) => {
  await applyCommonHeaders(config)
  return config
})

axiosClassic.interceptors.request.use(async (config) => {
  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type')
  }
  await applyCommonHeaders(config)
  return config
})

export default instance

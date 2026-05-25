import axios from 'axios'
import { getAccessToken, getCurrency, getCurrencyServer } from './auth.helper'

export const getContentType = (overrideLang?: string, overrideCurrency?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  const currentLang = overrideLang || 'ru'
  headers['Accept-Language'] = currentLang
  headers['X-Requested-With'] = 'XMLHttpRequest'
  headers['Accept'] = 'application/json'

  const currency = overrideCurrency || getCurrency()
  if (currency) {
    headers['X-Currency'] = currency
  }

  return headers
}

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: getContentType(),
  withCredentials: true
})

export const axiosClassic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: getContentType(),
  withCredentials: true
})

instance.interceptors.request.use(async (config) => {
  const accessToken = getAccessToken()
  if (config.headers && accessToken !== null) {
    config.headers.Authorization = `Bearer ${accessToken || ''}`
  }

  const currentHeaders = getContentType()

  if (!config.headers['Accept-Language'] && currentHeaders['Accept-Language']) {
    config.headers['Accept-Language'] = currentHeaders['Accept-Language']
  }

  if (!config.headers['x-language'] && currentHeaders['Accept-Language']) {
    config.headers['x-language'] = currentHeaders['Accept-Language']
  }

  const currency = await getCurrencyServer()
  if (currency) {
    config.headers['X-Currency'] = currency
  }

  return config
})

axiosClassic.interceptors.request.use(async (config) => {
  const currentHeaders = getContentType()

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  } else {
    config.headers['Content-Type'] = currentHeaders['Content-Type']
  }
  config.headers['X-Requested-With'] = currentHeaders['X-Requested-With']
  config.headers['Accept'] = currentHeaders['Accept']

  if (!config.headers['Accept-Language'] && currentHeaders['Accept-Language']) {
    config.headers['Accept-Language'] = currentHeaders['Accept-Language']
  }

  if (!config.headers['x-language'] && currentHeaders['Accept-Language']) {
    config.headers['x-language'] = currentHeaders['Accept-Language']
  }

  const currency = await getCurrencyServer()
  if (currency) {
    config.headers['X-Currency'] = currency
  }

  return config
})

export default instance
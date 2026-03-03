import axios from 'axios'
import {getAccessToken} from './auth.helper'

export const getContentType = (overrideLang?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  const currentLang = overrideLang || 'ru'
  headers['Accept-Language'] = currentLang
  headers['X-Requested-With'] = 'XMLHttpRequest'
  headers['Accept'] = 'application/json'

  return headers
}
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: getContentType()
})

export const axiosClassic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: getContentType()
})

instance.interceptors.request.use((config) => {
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

  return config
})

axiosClassic.interceptors.request.use((config) => {
  const currentHeaders = getContentType()

  config.headers['Content-Type'] = currentHeaders['Content-Type']
  config.headers['X-Requested-With'] = currentHeaders['X-Requested-With']
  config.headers['Accept'] = currentHeaders['Accept']

  if (!config.headers['Accept-Language'] && currentHeaders['Accept-Language']) {
    config.headers['Accept-Language'] = currentHeaders['Accept-Language']
  }

  if (!config.headers['x-language'] && currentHeaders['Accept-Language']) {
    config.headers['x-language'] = currentHeaders['Accept-Language']
  }

  return config
})

export default instance

import Cookies from 'js-cookie'

const isClient = typeof window !== 'undefined'

export const getCurrency = () => {
  if (!isClient) return null
  const currency = Cookies.get('currency')
  return currency === 'BYN' || currency === 'RUB' ? currency : null
}

export const getCurrencyServer = async () => {
  if (isClient) return getCurrency()
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const currency = cookieStore.get('currency')?.value
    return currency === 'BYN' || currency === 'RUB' ? currency : null
  } catch {
    return null
  }
}

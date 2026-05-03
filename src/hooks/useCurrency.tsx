import { useEffect, useState } from 'react'

function getCookieValue(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

export function useCurrency() {
  const [currency, setCurrency] = useState<string | undefined>(getCookieValue('currency'))

  useEffect(() => {
    const interval = setInterval(() => {
      const current = getCookieValue('currency')
      setCurrency(prev => prev !== current ? current : prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return currency
}
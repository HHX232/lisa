'use client'
import cn from 'clsx'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './PriceCurrencyTab.module.scss'

function PriceCurrencyTab() {
  const [currency, setCurrency] = useState<'BYN' | 'RUB'>('RUB')
  const router = useRouter()

  useEffect(() => {
    const cookieCurrency = Cookies.get('currency') || 'BYN'
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrency(cookieCurrency === 'BYN' || cookieCurrency === 'RUB' ? cookieCurrency : 'BYN')
  }, [])
  
  const changeCurrency = (newCurrency: 'BYN' | 'RUB') => {
    setCurrency(newCurrency)
    Cookies.set('currency', newCurrency)
    router.refresh()
  }
  
  return (
    <div className={styles.priceCurrencyTab}>
      <button 
        className={cn(styles.currencyButton, { [styles.currencyButtonActive]: currency === 'BYN' })} 
        onClick={() => changeCurrency('BYN')}
      >
        BYN
      </button>
      <div className={styles.line}></div>
      <button 
        className={cn(styles.currencyButton, { [styles.currencyButtonActive]: currency === 'RUB' })} 
        onClick={() => changeCurrency('RUB')}
      >
        RUB
      </button>
    </div>
  )
}

export default PriceCurrencyTab
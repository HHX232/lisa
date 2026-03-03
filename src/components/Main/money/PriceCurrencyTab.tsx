'use client'
import cn from 'clsx'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import styles from './PriceCurrencyTab.module.scss'

function PriceCurrencyTab() {
  const [currency, setCurrency] = useState<'BYN' | 'RUB'>('RUB')
  useEffect(() => {
    const cookieCurrency = Cookies.get('currency') || 'BYN'

    if (cookieCurrency === 'BYN' || cookieCurrency === 'RUB') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrency(cookieCurrency)
    } else {
      setCurrency('BYN')
    }
    
  }, [])
  
  const changeCurrency = (currency: 'BYN' | 'RUB') => {
    setCurrency(currency)
    Cookies.set('currency', currency)
  }
  
  return (
    <div className={styles.priceCurrencyTab}>
      <button 
        className={cn(
          styles.currencyButton, 
          { [styles.currencyButtonActive]: currency === 'BYN' }
        )} 
        onClick={() => changeCurrency('BYN')}
      >
        BYN
      </button>
      <div className={styles.line}></div>
      <button 
        className={cn(
          styles.currencyButton, 
          { [styles.currencyButtonActive]: currency === 'RUB' }
        )} 
        onClick={() => changeCurrency('RUB')}
      >
        RUB
      </button>
    </div>
  )
}

export default PriceCurrencyTab
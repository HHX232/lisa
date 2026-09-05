'use client'

import Cookies from 'js-cookie'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './CookieConsent.module.scss'

export const COOKIE_CONSENT_NAME = 'cookie_accept'

function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!Cookies.get(COOKIE_CONSENT_NAME)) setVisible(true)
  }, [])

  const accept = () => {
    Cookies.set(COOKIE_CONSENT_NAME, 'true', { expires: 365 })
    setVisible(false)
  }

  const decline = () => {
    Cookies.set(COOKIE_CONSENT_NAME, 'false', { expires: 365 })
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className={styles.banner} role="dialog" aria-live="polite">
      <p className={styles.text}>
        Мы используем файлы cookie для корректной работы сайта. Продолжая пользоваться сайтом, вы
        соглашаетесь с их использованием. Подробнее — в{' '}
        <Link href="/privacy" className={styles.link}>
          политике конфиденциальности
        </Link>
        .
      </p>
      <div className={styles.actions}>
        <button className={styles.declineButton} onClick={decline}>
          Отклонить
        </button>
        <button className={styles.button} onClick={accept}>
          Принять
        </button>
      </div>
    </div>
  )
}

export default CookieConsent

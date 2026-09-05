'use client'

import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { COOKIE_CONSENT_NAME } from './CookieConsent'
import styles from './CookieGateModal.module.scss'

function CookieGateModal() {
  const [blocked, setBlocked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (Cookies.get(COOKIE_CONSENT_NAME) === 'false') setBlocked(true)
  }, [])

  if (!blocked) return null

  const allow = () => {
    Cookies.set(COOKIE_CONSENT_NAME, 'true', { expires: 365 })
    setBlocked(false)
  }

  const decline = () => {
    router.push('/')
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <p className={styles.text}>
          Для продолжения необходимо подтвердить использование файлов cookie. Пожалуйста, разрешите
          их применение для дальнейшей работы с сайтом.
        </p>
        <div className={styles.actions}>
          <button className={styles.declineButton} onClick={decline}>
            Отклонить
          </button>
          <button className={styles.allowButton} onClick={allow}>
            Разрешить
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieGateModal

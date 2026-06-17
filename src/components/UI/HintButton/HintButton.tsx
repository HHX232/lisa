'use client'

import { axiosClassic } from '@/api/helpers/api.interceptor'
import { useState } from 'react'
import { toast } from 'sonner'
import styles from './HintButton.module.scss'

interface Props {
  productId: number | string
}

export default function HintButton({ productId }: Props) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  // const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error('Введите email')
      return
    }
    setLoading(true)
    try {
      await axiosClassic.post('/gift-hint', {
        productIds: [Number(productId)],
        email: email.trim(),
      })
      toast.success('Намёк отправлен!')
      setOpen(false)
      setEmail('')
    } catch {
      toast.error('Не удалось отправить намёк')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button className={styles.hintBtn} onClick={() => setOpen(true)} type="button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Намекнуть о подарке
      </button>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.close} onClick={() => setOpen(false)} aria-label="Закрыть">
              <span /><span />
            </button>

            <div className={styles.icon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="#072761" strokeWidth="1.5"/>
                <path d="M2 7l10 7 10-7" stroke="#072761" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>

            <h2 className={styles.title}>Намекните о подарке</h2>
            <p className={styles.desc}>
              Этому человеку придёт письмо с ненавязчивым намёком на подарок — возможно,
              именно этот товар станет поводом сделать вам что-то приятное.
            </p>

            <div className={styles.fields}>
              <label className={styles.label}>
                Email получателя
                <input
                  className={styles.input}
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </label>

              {/* Phone — будет вместо email
              <label className={styles.label}>
                Номер телефона получателя
                <input
                  className={styles.input}
                  type="tel"
                  placeholder="+375 __ ___ __ __"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </label>
              */}
            </div>

            <div className={styles.footer}>
              <button className={styles.cancel} onClick={() => setOpen(false)} type="button">Отмена</button>
              <button className={styles.submit} onClick={handleSubmit} disabled={loading} type="button">
                {loading ? 'Отправляем...' : 'Отправить намёк'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

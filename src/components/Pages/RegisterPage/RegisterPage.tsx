/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { loginAction } from '@/actions/auth.actions'
import { axiosClassic } from '@/api/helpers/api.interceptor'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import TextInputUI from '../../UI/inputs/TextInputUI/TextInputUI'
import InputOtp from '../../UI/inputs/inputOTP/inputOTP'
import styles from './RegisterPage.module.scss'

type Tab = 'email' | 'phone'
type Step = 'form' | 'otp'

function RegisterPage() {
  const [tab, setTab] = useState<Tab>('email')
  const [step, setStep] = useState<Step>('form')

  const router = useRouter()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async () => {
    setError(null)
    setLoading(true)

    try {
      await axiosClassic.post('/auth/register', {
        email: tab === 'email' ? email : undefined,
        phoneNumber: tab === 'phone' ? phone : undefined,
        name: name.trim() || undefined,
        password,
      })

      if (tab === 'email') {
        await axiosClassic.post(`/auth/send-verify-email/${email}`)
      }

      setStep('otp')
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpComplete = async (code: string) => {
    setError(null)
    setLoading(true)

    try {
      if (tab === 'email') {
        await axiosClassic.post(`/auth/verify-email/${email}`, { code })
      } else {
        await axiosClassic.post(`/auth/verify-phone-number/${encodeURIComponent(phone)}`, { code })
      }

      const loginResult = await loginAction(
        tab === 'email' ? email : phone,
        password
      )
      if (loginResult.error) {
        setError(loginResult.error)
        return
      }

      router.push('/profile')
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.registerPage}>
      <div className={styles.card}>
        <h1 className={styles.title}>Регистрация</h1>

        {step === 'form' && (
          <>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${tab === 'email' ? styles.tabActive : ''}`}
                onClick={() => { setTab('email'); setError(null) }}
              >
                Email
              </button>
              <button
                className={`${styles.tab} ${tab === 'phone' ? styles.tabActive : ''}`}
                onClick={() => { setTab('phone'); setError(null) }}
              >
                Телефон
              </button>
            </div>

            <div className={styles.fields}>
              {tab === 'email' ? (
                <TextInputUI
                  placeholder="Email"
                  currentValue={email}
                  onSetValue={setEmail}
                />
              ) : (
                <TextInputUI
                  placeholder="Телефон"
                  currentValue={phone}
                  onSetValue={setPhone}
                />
              )}

              <TextInputUI
                placeholder="Имя (необязательно)"
                currentValue={name}
                onSetValue={setName}
              />

              <TextInputUI
                placeholder="Пароль"
                currentValue={password}
                onSetValue={setPassword}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              className={styles.submitButton}
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Загрузка...' : 'Продолжить'}
            </button>

            <p className={styles.footer}>
              Уже есть аккаунт?{' '}
              <Link href="/login" className={styles.link}>Войти</Link>
            </p>
          </>
        )}

        {step === 'otp' && (
          <>
            <p className={styles.otpHint}>
              Введите код, отправленный на{' '}
              <span className={styles.otpTarget}>
                {tab === 'email' ? email : phone}
              </span>
            </p>

            <InputOtp length={4} onComplete={handleOtpComplete} />

            {error && <p className={styles.error}>{error}</p>}
            {loading && <p className={styles.loading}>Проверяем код...</p>}

            <button
              className={styles.backButton}
              onClick={() => { setStep('form'); setError(null) }}
            >
              ← Назад
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default RegisterPage
'use client'
import { axiosClassic } from '@/api/helpers/api.interceptor'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import TextInputUI from '../../UI/inputs/TextInputUI/TextInputUI'
import styles from './LoginPage.module.scss'

function LoginPage() {
  const router = useRouter()

  const [phoneNumberOrEmail, setPhoneNumberOrEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    setError(null)
    setLoading(true)

    try {
      await axiosClassic.post('/auth/login', {
        phoneNumberOrEmail,
        password
      })

      router.push('/profile')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Неверный логин или пароль')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.card}>
        <h1 className={styles.title}>Вход</h1>

        <div className={styles.fields} onKeyDown={handleKeyDown}>
          <TextInputUI
            placeholder="Email или телефон"
            currentValue={phoneNumberOrEmail}
            onSetValue={setPhoneNumberOrEmail}
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
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Загрузка...' : 'Войти'}
        </button>

        <p className={styles.footer}>
          Нет аккаунта?{' '}
          <a href="/register" className={styles.link}>Зарегистрироваться</a>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
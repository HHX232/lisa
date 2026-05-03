'use client'

import { useState } from 'react'

import styles from './ChangeEmailModal.module.scss'
import InputOtp from '@/components/UI/inputs/inputOTP/inputOTP'
import TextInputUI from '@/components/UI/inputs/TextInputUI/TextInputUI'
import ModalWindowDefault from '@/components/UI/Modal/ModalWindowDefault/ModalWindowDefault'
import { useChangeEmail, useVerifyEmail } from '@/hooks/User.queries'

interface Props {
  isOpen: boolean
  onClose: () => void
}

type Step = 'input' | 'otp' | 'success'

export default function ChangeEmailModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<Step>('input')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const changeEmail = useChangeEmail()
  const verifyEmail = useVerifyEmail()

  const handleSubmitEmail = async () => {
    if (!email.trim()) return
    setError('')
    try {
      await changeEmail.mutateAsync({ email })
      setStep('otp')
    } catch {
      setError('Не удалось отправить код. Проверьте email.')
    }
  }

  const handleOtpComplete = async (otp: string) => {
    setError('')
    try {
      await verifyEmail.mutateAsync({ email, otp })
      setStep('success')
    } catch {
      setError('Неверный код. Попробуйте снова.')
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep('input')
      setEmail('')
      setError('')
    }, 300)
  }

  const footer = step === 'input' ? (
    <button
      className={styles.submitButton}
      onClick={handleSubmitEmail}
      disabled={!email.trim() || changeEmail.isPending}
    >
      {changeEmail.isPending ? 'Отправляем...' : 'Отправить код'}
    </button>
  ) : step === 'otp' ? (
    <button className={styles.backButton} onClick={() => setStep('input')}>
      ← Изменить email
    </button>
  ) : null

  return (
    <ModalWindowDefault
      isOpen={isOpen}
      onClose={handleClose}
      additionalTitle={<p className={styles.modal_title}>Изменить email</p>}
      modalFooter={footer}
    >
      {step === 'input' && (
        <div className={styles.fields}>
          <TextInputUI
            placeholder="Новый email"
            currentValue={email}
            onSetValue={setEmail}
          />
          {error && <p className={styles.error}>{error}</p>}
        </div>
      )}

      {step === 'otp' && (
        <div className={styles.fields}>
          <p className={styles.otpHint}>
            Код подтверждения отправлен на{' '}
            <span className={styles.otpTarget}>{email}</span>
          </p>
          <InputOtp length={4} onComplete={handleOtpComplete} />
          {verifyEmail.isPending && <p className={styles.loading}>Проверяем код...</p>}
          {error && <p className={styles.error}>{error}</p>}
        </div>
      )}

      {step === 'success' && (
        <div className={styles.fields}>
          <div className={styles.successIcon}>✓</div>
          <p className={styles.successTitle}>Email изменён!</p>
          <p className={styles.successText}>Ваш email успешно обновлён.</p>
          <button className={styles.submitButton} onClick={handleClose}>
            Закрыть
          </button>
        </div>
      )}
    </ModalWindowDefault>
  )
}
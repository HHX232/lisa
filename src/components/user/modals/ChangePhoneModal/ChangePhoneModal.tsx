'use client'

import { useState } from 'react'
import styles from './ChangePhoneModal.module.scss'
import InputOtp from '@/components/UI/inputs/inputOTP/inputOTP'
import TextInputUI from '@/components/UI/inputs/TextInputUI/TextInputUI'
import ModalWindowDefault from '@/components/UI/Modal/ModalWindowDefault/ModalWindowDefault'
import { useChangePhone, useVerifyPhone } from '@/hooks/User.queries'

interface Props {
  isOpen: boolean
  onClose: () => void
}

type Step = 'input' | 'otp' | 'success'

export default function ChangePhoneModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<Step>('input')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const changePhone = useChangePhone()
  const verifyPhone = useVerifyPhone()

  const handleSubmitPhone = async () => {
    if (!phone.trim()) return
    setError('')
    try {
      await changePhone.mutateAsync({ phoneNumber: phone })
      setStep('otp')
    } catch {
      setError('Не удалось отправить код. Проверьте номер.')
    }
  }

  const handleOtpComplete = async (otp: string) => {
    setError('')
    try {
      await verifyPhone.mutateAsync({ phoneNumber: phone, otp })
      setStep('success')
    } catch {
      setError('Неверный код. Попробуйте снова.')
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep('input')
      setPhone('')
      setError('')
    }, 300)
  }

  const footer = step === 'input' ? (
    <button
      className={styles.submitButton}
      onClick={handleSubmitPhone}
      disabled={!phone.trim() || changePhone.isPending}
    >
      {changePhone.isPending ? 'Отправляем...' : 'Отправить код'}
    </button>
  ) : step === 'otp' ? (
    <button className={styles.backButton} onClick={() => setStep('input')}>
      ← Изменить номер
    </button>
  ) : null

  return (
    <ModalWindowDefault
      isOpen={isOpen}
      onClose={handleClose}
      additionalTitle={<p className={styles.modal_title}>Изменить телефон</p>}
      modalFooter={footer}
    >
      {step === 'input' && (
        <div className={styles.fields}>
          <TextInputUI
            placeholder="+7 (999) 000-00-00"
            currentValue={phone}
            onSetValue={setPhone}
          />
          {error && <p className={styles.error}>{error}</p>}
        </div>
      )}

      {step === 'otp' && (
        <div className={styles.fields}>
          <p className={styles.otpHint}>
            Код подтверждения отправлен на{' '}
            <span className={styles.otpTarget}>{phone}</span>
          </p>
          <InputOtp length={4} onComplete={handleOtpComplete} />
          {verifyPhone.isPending && <p className={styles.loading}>Проверяем код...</p>}
          {error && <p className={styles.error}>{error}</p>}
        </div>
      )}

      {step === 'success' && (
        <div className={styles.fields}>
          <div className={styles.successIcon}>✓</div>
          <p className={styles.successTitle}>Телефон изменён!</p>
          <p className={styles.successText}>Ваш номер успешно обновлён.</p>
          <button className={styles.submitButton} onClick={handleClose}>
            Закрыть
          </button>
        </div>
      )}
    </ModalWindowDefault>
  )
}
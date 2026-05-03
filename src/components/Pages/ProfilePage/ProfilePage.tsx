'use client'

import { useState } from 'react'

import styles from './ProfilePage.module.scss'
import TextInputUI from '@/components/UI/inputs/TextInputUI/TextInputUI'
import ChangeEmailModal from '@/components/user/modals/ChangeEmailModal/ChangeEmailModal'
import ChangePhoneModal from '@/components/user/modals/ChangePhoneModal/ChangePhoneModal'
import { useMe, useUpdateContactInfo } from '@/hooks/User.queries'

export default function ProfilePage() {
  const { data: me, isLoading, isError } = useMe()

  const [contactInfo, setContactInfo] = useState('')
  const [contactSaved, setContactSaved] = useState(false)
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [phoneModalOpen, setPhoneModalOpen] = useState(false)

  const updateContact = useUpdateContactInfo()

  // Sync contactInfo from server on first load
  useState(() => {
    if (me?.contactInfo) setContactInfo(me.contactInfo)
  })

  const handleSaveContact = async () => {
    await updateContact.mutateAsync({ contactInfo })
    setContactSaved(true)
    setTimeout(() => setContactSaved(false), 2000)
  }

  if (isLoading) return <div className={styles.loading}>Загрузка...</div>
  if (isError || !me) return <div className={styles.error}>Не удалось загрузить профиль</div>

  return (
    <div className={styles.profilePage}>
      <div className={styles.card}>
        <h1 className={styles.title}>Профиль</h1>

        {/* Contact info */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Контактная информация</h2>
          <div className={styles.fields}>
            <TextInputUI
              placeholder="Контактные данные (ссылка, мессенджер...)"
              currentValue={contactInfo || me.contactInfo || ''}
              onSetValue={(val) => {
                setContactInfo(val)
                setContactSaved(false)
              }}
            />
            <button
              className={styles.submitButton}
              onClick={handleSaveContact}
              disabled={updateContact.isPending}
            >
              {updateContact.isPending ? 'Сохраняем...' : contactSaved ? '✓ Сохранено' : 'Сохранить'}
            </button>
          </div>
        </section>

        {/* Email */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Email</h2>
          <div className={styles.fieldRow}>
            <div className={styles.fieldInfo}>
              <span className={styles.fieldValue}>{me.email || '—'}</span>
              {me.emailVerified ? (
                <span className={styles.badge}>Подтверждён</span>
              ) : (
                <span className={`${styles.badge} ${styles.badgeUnverified}`}>Не подтверждён</span>
              )}
            </div>
            <button className={styles.editButton} onClick={() => setEmailModalOpen(true)}>
              Изменить
            </button>
          </div>
        </section>

        {/* Phone */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Телефон</h2>
          <div className={styles.fieldRow}>
            <div className={styles.fieldInfo}>
              <span className={styles.fieldValue}>{me.phoneNumber || '—'}</span>
              {me.phoneNumberVerified ? (
                <span className={styles.badge}>Подтверждён</span>
              ) : (
                <span className={`${styles.badge} ${styles.badgeUnverified}`}>Не подтверждён</span>
              )}
            </div>
            <button className={styles.editButton} onClick={() => setPhoneModalOpen(true)}>
              Изменить
            </button>
          </div>
        </section>
      </div>

      <ChangeEmailModal isOpen={emailModalOpen} onClose={() => setEmailModalOpen(false)} />
      <ChangePhoneModal isOpen={phoneModalOpen} onClose={() => setPhoneModalOpen(false)} />
    </div>
  )
}
'use client'

import { logoutAction } from '@/actions/auth.actions'
import TextInputUI from '@/components/UI/inputs/TextInputUI/TextInputUI'
import ChangeEmailModal from '@/components/user/modals/ChangeEmailModal/ChangeEmailModal'
import ChangePhoneModal from '@/components/user/modals/ChangePhoneModal/ChangePhoneModal'
import { useMe, useUpdateContactInfo } from '@/hooks/User.queries'
import { IMe } from '@/types/user.types'
import { useState } from 'react'
import styles from './ProfilePage.module.scss'

function ProfileForm({ me }: { me: IMe }) {
  const [name, setName] = useState(me.name ?? '')
  const [contactInfo, setContactInfo] = useState(me.contactInfo ?? '')
  const [saved, setSaved] = useState(false)
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [phoneModalOpen, setPhoneModalOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const updateContact = useUpdateContactInfo()

  const handleSave = async () => {
    await updateContact.mutateAsync({ name: name || undefined, contactInfo })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await logoutAction()
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Профиль</h1>
        <button className={styles.logoutBtn} onClick={handleLogout} disabled={loggingOut}>
          {loggingOut ? 'Выход...' : 'Выйти'}
        </button>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Основное</h2>
        <div className={styles.fields}>
          <TextInputUI
            placeholder="Имя (необязательно)"
            currentValue={name}
            onSetValue={(val) => { setName(val); setSaved(false) }}
          />
          <TextInputUI
            placeholder="Контактные данные (ссылка, мессенджер...)"
            currentValue={contactInfo}
            onSetValue={(val) => { setContactInfo(val); setSaved(false) }}
          />
          <button className={styles.submitButton} onClick={handleSave} disabled={updateContact.isPending}>
            {updateContact.isPending ? 'Сохраняем...' : saved ? '✓ Сохранено' : 'Сохранить'}
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Email</h2>
        <div className={styles.fieldRow}>
          <div className={styles.fieldInfo}>
            <span className={styles.fieldValue}>{me.email || '—'}</span>
            {me.emailVerified
              ? <span className={styles.badge}>Подтверждён</span>
              : <span className={`${styles.badge} ${styles.badgeUnverified}`}>Не подтверждён</span>
            }
          </div>
          <button className={styles.editButton} onClick={() => setEmailModalOpen(true)}>Изменить</button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Телефон</h2>
        <div className={styles.fieldRow}>
          <div className={styles.fieldInfo}>
            <span className={styles.fieldValue}>{me.phoneNumber || '—'}</span>
            {me.phoneNumberVerified
              ? <span className={styles.badge}>Подтверждён</span>
              : <span className={`${styles.badge} ${styles.badgeUnverified}`}>Не подтверждён</span>
            }
          </div>
          <button className={styles.editButton} onClick={() => setPhoneModalOpen(true)}>Изменить</button>
        </div>
      </section>

      <ChangeEmailModal isOpen={emailModalOpen} onClose={() => setEmailModalOpen(false)} />
      <ChangePhoneModal isOpen={phoneModalOpen} onClose={() => setPhoneModalOpen(false)} />
    </div>
  )
}

export default function ProfilePage() {
  const { data: me, isLoading, isError } = useMe()

  if (isLoading) return <div className={styles.loading}>Загрузка...</div>
  if (isError || !me) return <div className={styles.error}>Не удалось загрузить профиль</div>

  return (
    <div className={styles.profilePage}>
      <ProfileForm me={me} />
    </div>
  )
}

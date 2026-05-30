import Header from '@/components/Main/Header/Header'
import ProfilePage from '@/components/Pages/ProfilePage/ProfilePage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Личный кабинет',
  robots: { index: false, follow: false },
}

export default function Profile() {
  return (
    <>
      <Header />
      <ProfilePage />
    </>
  )
}
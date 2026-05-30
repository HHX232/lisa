import Header from '@/components/Main/Header/Header'
import LoginPage from '@/components/Pages/LoginPage/LoginPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Войти в аккаунт',
  robots: { index: false, follow: false },
}

export default function LoginPageComponent() {
  return (
    <>
    <Header/>
    <LoginPage />
    {/* <Footer/> */}
    </>
    
  )
}
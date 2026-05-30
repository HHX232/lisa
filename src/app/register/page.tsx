import Header from '@/components/Main/Header/Header'
import RegisterPage from '@/components/Pages/RegisterPage/RegisterPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Регистрация',
  robots: { index: false, follow: false },
}

export default function Register() {
  return <>
  <Header/> <RegisterPage />
  {/* <Footer/> */}
  </>
}
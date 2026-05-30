import FavoritesPage from '@/_pages/FavoritesPage/FavoritesPage'
import Header from '@/components/Main/Header/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Избранное',
  robots: { index: false, follow: false },
}

export default function Favorites() {
  return (
    <>
      <Header />
      <FavoritesPage />
    </>
  )
}
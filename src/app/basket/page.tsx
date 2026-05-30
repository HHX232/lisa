import BasketPage from '@/_pages/BasketPage/BasketPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Корзина',
  robots: { index: false, follow: false },
}

export default function Basket() {
  return <BasketPage />
}

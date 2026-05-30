import { Suspense } from 'react'
import Header from '@/components/Main/Header/Header'
import CatalogPage from '@/components/Pages/CatalogPage/CatalogPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Каталог украшений',
  description: 'Весь ассортимент украшений Septaria: кольца, серьги, браслеты, подвески, комплекты, броши, сувениры. Фильтрация по категории и цене.',
}

function CatalogPageServer() {
  return (
    <>
      <Header />
      <Suspense>
        <CatalogPage />
      </Suspense>
    </>
  )
}

export default CatalogPageServer
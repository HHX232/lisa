import { Suspense } from 'react'
import Header from '@/components/Main/Header/Header'
import CatalogPage from '@/components/Pages/CatalogPage/CatalogPage'

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
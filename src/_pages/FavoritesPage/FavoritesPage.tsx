'use client'

import Card from '@/components/Products/Card/Card'
import styles from './FavoritesPage.module.scss'
import { useFavoriteProducts } from '@/hooks/User.queries'

export default function FavoritesPage() {
  const { data: products, isLoading, isError } = useFavoriteProducts()

  return (
    <div className={styles.favoritesPage}>
      <div className={`${styles.inner} container`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Избранное</h1>
          {products && products.length > 0 && (
            <span className={styles.count}>{products.length} товаров</span>
          )}
        </div>

        {isLoading && (
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
        )}

        {isError && (
          <div className={styles.stateBox}>
            <p className={styles.stateText}>Не удалось загрузить избранное</p>
          </div>
        )}

        {!isLoading && !isError && products?.length === 0 && (
          <div className={styles.stateBox}>
            <div className={styles.emptyIcon}>
              <svg width="48" height="46" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.6875 0.75C3.40875 0.75 0.75 3.575 0.75 7.05875C0.75 14.0312 12 22 12 22C12 22 23.25 14.0312 23.25 7.05875C23.25 2.7425 20.5912 0.75 17.3125 0.75C14.9875 0.75 12.975 2.17 12 4.2375C11.025 2.17 9.0125 0.75 6.6875 0.75Z"
                  stroke="#072761"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className={styles.stateTitle}>Список избранного пуст</p>
            <p className={styles.stateText}>Добавляйте товары, нажимая на сердечко</p>
          </div>
        )}

        {!isLoading && products && products.length > 0 && (
          <div className={styles.grid}>
            {products.map((product) => (
              <Card
                key={product.id}
                {...product}
                showCardTitle={true}
                useFillImage={product.useFillImage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
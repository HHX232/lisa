'use client'

import { axiosClassic } from '@/api/helpers/api.interceptor'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import styles from './AllReviews.module.scss'

interface Review {
  id: number
  author: string
  status: string
  text: string
  images: string[]
  stars: number
  createdAt: string
}

interface ReviewsPage {
  content: Review[]
  page: { size: number; number: number; totalElements: number; totalPages: number }
}

const PAGE_SIZE = 12

function StarDisplay({ value }: { value: number }) {
  return (
    <span className={styles.starsDisplay}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={n <= value ? styles.starActive : styles.starInactive}>★</span>
      ))}
    </span>
  )
}

export default function AllReviews() {
  const sentinelRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery<ReviewsPage>({
    queryKey: ['all-reviews'],
    queryFn: async ({ pageParam }) => {
      const res = await axiosClassic.get('/product-reviews', {
        params: { page: pageParam, size: PAGE_SIZE },
      })
      return res.data
    },
    initialPageParam: 0,
    getNextPageParam: (last) => {
      const { number, totalPages } = last.page
      return number + 1 < totalPages ? number + 1 : undefined
    },
  })

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const reviews = data?.pages.flatMap(p => p.content) ?? []
  const total = data?.pages[0]?.page.totalElements

  if (status === 'pending') {
    return (
      <div className={styles.loading}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    )
  }

  if (status === 'error') {
    return <p className={styles.empty}>Не удалось загрузить отзывы</p>
  }

  if (reviews.length === 0) {
    return <p className={styles.empty}>Отзывов пока нет</p>
  }

  return (
    <>
      {total != null && (
        <p className={styles.total}>{total} {pluralize(total, 'отзыв', 'отзыва', 'отзывов')}</p>
      )}

      <div className={styles.grid}>
        {reviews.map(r => (
          <div key={r.id} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.author}>{r.author || 'Аноним'}</span>
              <StarDisplay value={r.stars} />
              <span className={styles.date}>
                {new Date(r.createdAt).toLocaleDateString('ru-RU')}
              </span>
            </div>
            <p className={styles.text}>{r.text}</p>
            {r.images?.length > 0 && (
              <div className={styles.images}>
                {r.images.map((src, i) => (
                  <img key={i} src={src} alt="" className={styles.img} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div ref={sentinelRef} className={styles.sentinel} />

      {isFetchingNextPage && (
        <div className={styles.loadingMore}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      )}
    </>
  )
}

function pluralize(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

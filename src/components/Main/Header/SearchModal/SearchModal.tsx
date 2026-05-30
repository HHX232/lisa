'use client'

import { axiosClassic } from '@/api/helpers/api.interceptor'
import Card from '@/components/Products/Card/Card'
import { Product } from '@/types/Product.types'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styles from './SearchModal.module.scss'

interface SearchResponse {
  content: Product[]
  page: { totalPages: number; totalElements: number }
}

interface Props {
  onClose: () => void
}

export default function SearchModal({ onClose }: Props) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    document.body.style.setProperty('overflow', 'hidden', 'important')
    return () => { document.body.style.removeProperty('overflow') }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 400)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const { data, isLoading } = useQuery<SearchResponse | null>({
    queryKey: ['search-modal', debouncedQuery],
    queryFn: async () => {
      const res = await axiosClassic.get('/products', {
        params: { title: debouncedQuery, page: 0, size: 8 },
      })
      return res.data
    },
    enabled: debouncedQuery.length > 1,
  })

  const products = data?.content ?? []
  const hasMore = (data?.page?.totalPages ?? 0) > 1
  const showEmpty = debouncedQuery.length > 1 && !isLoading && products.length === 0

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.searchBar}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Поиск украшений..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className={styles.closeBtn} onClick={onClose} type="button">×</button>
        </div>

        {isLoading && (
          <div className={styles.state}>
            <span className={styles.spinner} />
          </div>
        )}

        {showEmpty && (
          <p className={styles.stateText}>По запросу «{debouncedQuery}» ничего не найдено</p>
        )}

        {products.length > 0 && (
          <div className={styles.results}>
            <div className={styles.grid}>
              {products.map(p => (
                <div key={p.id} onClick={onClose}>
                  <Card {...p} />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className={styles.viewAllWrap}>
                <Link
                  href={`/catalog?title=${encodeURIComponent(debouncedQuery)}`}
                  className={styles.viewAllBtn}
                  onClick={onClose}
                >
                  Посмотреть все результаты по «{debouncedQuery}»
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

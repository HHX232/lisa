'use client'

import { axiosClassic } from '@/api/helpers/api.interceptor'
import { Product } from '@/types/Product.types'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import styles from './ComplectPickerModal.module.scss'

interface PickedProduct {
  id: number
  title: string
  imageUrl: string
}

interface Props {
  selectedIds: number[]
  onToggle: (product: PickedProduct) => void
  onClose: () => void
}

export default function ComplectPickerModal({ selectedIds, onToggle, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    document.body.style.setProperty('overflow', 'hidden', 'important')
    return () => { document.body.style.removeProperty('overflow') }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 350)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const { data, isLoading } = useQuery<{ content: Product[] } | null>({
    queryKey: ['complect-picker', debouncedQuery],
    queryFn: async () => {
      const res = await axiosClassic.get('/products', {
        params: { title: debouncedQuery || undefined, page: 0, size: 24 },
      })
      return res.data
    },
    staleTime: 0,
  })

  const products = data?.content ?? []

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <span className={styles.title}>Выбор товаров для комплекта</span>
          <button className={styles.closeBtn} type="button" onClick={onClose}>×</button>
        </div>

        <div className={styles.searchBar}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            className={styles.searchInput}
            placeholder="Поиск товаров..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button className={styles.clearSearch} type="button" onClick={() => setQuery('')}>×</button>
          )}
        </div>

        <div className={styles.body}>
          {isLoading && <div className={styles.state}>Загрузка...</div>}
          {!isLoading && products.length === 0 && (
            <div className={styles.state}>Ничего не найдено</div>
          )}
          {products.length > 0 && (
            <div className={styles.grid}>
              {products.map(p => {
                const selected = selectedIds.includes(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`${styles.card} ${selected ? styles.cardSelected : ''}`}
                    onClick={() => onToggle({ id: p.id, title: p.title, imageUrl: p.imageUrl })}
                  >
                    <div className={styles.cardImg}>
                      <img src={p.imageUrl} alt={p.title} />
                      {selected && (
                        <div className={styles.checkOverlay}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className={styles.cardInfo}>
                      <span className={styles.cardTitle}>{p.title}</span>
                      <span className={styles.cardId}>#{p.id}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.footerCount}>
            Выбрано: <b>{selectedIds.length}</b>
          </span>
          <button className={styles.doneBtn} type="button" onClick={onClose}>
            Готово
          </button>
        </div>

      </div>
    </div>
  )
}

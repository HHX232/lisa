'use client'

import { axiosClassic } from '@/api/helpers/api.interceptor'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import styles from './SiteReviews.module.scss'

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
  page: { totalElements: number; totalPages: number; number: number }
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`${styles.star} ${n <= value ? styles.starActive : ''}`}
          onClick={() => onChange(n)}
        >★</button>
      ))}
    </div>
  )
}

function StarDisplay({ value }: { value: number }) {
  return (
    <span className={styles.starsDisplay}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={n <= value ? styles.starActive : styles.starInactive}>★</span>
      ))}
    </span>
  )
}

const SORT_OPTIONS = [
  { label: 'Сначала новые', sort: 'createdAt', direction: 'DESC' },
  { label: 'Сначала старые', sort: 'createdAt', direction: 'ASC' },
  { label: 'С высокой оценкой', sort: 'stars', direction: 'DESC' },
  { label: 'С низкой оценкой', sort: 'stars', direction: 'ASC' },
] as const

export default function SiteReviews() {
  const qc = useQueryClient()
  const [text, setText] = useState('')
  const [stars, setStars] = useState(5)
  const [images, setImages] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [sortOption, setSortOption] = useState<typeof SORT_OPTIONS[number]>(SORT_OPTIONS[0])

  const { data } = useQuery<ReviewsPage>({
    queryKey: ['site-reviews', search, sortOption.sort, sortOption.direction],
    queryFn: async () => {
      const res = await axiosClassic.get('/site-reviews', {
        params: {
          page: 0,
          size: 20,
          search: search || undefined,
          sort: sortOption.sort,
          direction: sortOption.direction,
        }
      })
      return res.data
    }
  })

  const reviews = data?.content ?? []

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput.trim())
  }

  const addFiles = (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files)
    setImages(prev => [...prev, ...newFiles])
  }

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) { toast.error('Напишите отзыв'); return }
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('data', new Blob([JSON.stringify({ text: text.trim(), stars })], { type: 'application/json' }))
      images.forEach(img => fd.append('images', img))
      const res = await fetch('/api/proxy/site-reviews', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      })
      if (!res.ok) {
        if (res.status === 401) {
          toast.error('Необходимо войти в аккаунт, чтобы оставить отзыв')
          return
        }
        const body = await res.json().catch(() => null)
        toast.error(body?.message ?? 'Ошибка отправки. Попробуйте позже.')
        return
      }
      setText('')
      setStars(5)
      setImages([])
      toast.success('Отзыв отправлен и ожидает проверки')
      qc.invalidateQueries({ queryKey: ['site-reviews'] })
    } catch {
      toast.error('Ошибка отправки. Попробуйте позже.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {/* Left: review list */}
        <div className={styles.list}>
          <div className={styles.filters}>
            <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
              <input
                className={styles.searchInput}
                placeholder="Поиск по отзывам..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
              <button className={styles.searchBtn} type="submit">Найти</button>
            </form>
            <select
              className={styles.sortSelect}
              value={sortOption.label}
              onChange={e => {
                const next = SORT_OPTIONS.find(o => o.label === e.target.value)
                if (next) setSortOption(next)
              }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.label} value={o.label}>{o.label}</option>
              ))}
            </select>
          </div>

          {reviews.length === 0 && (
            <p className={styles.empty}>Отзывов пока нет. Будьте первым!</p>
          )}
          {reviews.map(r => (
            <div key={r.id} className={styles.reviewCard}>
              <div className={styles.reviewTop}>
                <span className={styles.reviewAuthor}>{r.author || 'Аноним'}</span>
                <StarDisplay value={r.stars} />
                <span className={styles.reviewDate}>
                  {new Date(r.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <p className={styles.reviewText}>{r.text}</p>
              {r.images?.length > 0 && (
                <div className={styles.reviewImages}>
                  {r.images.map((src, i) => (
                    <img key={i} src={src} alt="фото" className={styles.reviewImg} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.formTitle}>Оставить отзыв</h3>

          <label className={styles.label}>Оценка</label>
          <StarPicker value={stars} onChange={setStars} />

          <label className={styles.label}>Текст отзыва</label>
          <textarea
            className={styles.textarea}
            rows={5}
            placeholder="Поделитесь впечатлениями..."
            value={text}
            onChange={e => setText(e.target.value)}
          />

          <label className={styles.label}>Фото (необязательно)</label>
          {images.length > 0 && (
            <div className={styles.imgPreviewRow}>
              {images.map((img, i) => (
                <div key={i} className={styles.imgPreviewCard}>
                  <img src={URL.createObjectURL(img)} alt="" />
                  <button type="button" onClick={() => removeImage(i)}>✕</button>
                </div>
              ))}
            </div>
          )}
          <div className={styles.fileRow}>
            <button type="button" className={styles.fileBtn} onClick={() => fileRef.current?.click()}>
              {images.length > 0 ? 'Добавить ещё' : 'Выбрать файлы'}
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={e => { addFiles(e.target.files); e.target.value = '' }}
          />

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? 'Отправляем...' : 'Отправить отзыв'}
          </button>
        </form>
      </div>
    </div>
  )
}

'use client'

import { axiosClassic } from '@/api/helpers/api.interceptor'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import styles from './ProductReviews.module.scss'

interface Review {
  id: number
  author: string
  status: string
  text: string
  image?: string
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
      {[1,2,3,4,5].map(n => (
        <span key={n} className={n <= value ? styles.starActive : styles.starInactive}>★</span>
      ))}
    </span>
  )
}

export default function ProductReviews({ productId }: { productId: string | number }) {
  const qc = useQueryClient()
  const [text, setText] = useState('')
  const [stars, setStars] = useState(5)
  const [image, setImage] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const { data } = useQuery<ReviewsPage>({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const res = await axiosClassic.get(`/products/${productId}/reviews`, {
        params: { page: 0, size: 20 }
      })
      return res.data
    }
  })

  const reviews = data?.content ?? []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) { setError('Напишите отзыв'); return }
    setSubmitting(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('data', new Blob([JSON.stringify({ text: text.trim(), stars })], { type: 'application/json' }))
      if (image) fd.append('image', image)
      await fetch(`/api/proxy/products/${productId}/reviews`, {
        method: 'POST',
        body: fd,
        credentials: 'include',
      }).then(r => { if (!r.ok) throw new Error() })
      setText('')
      setStars(5)
      setImage(null)
      setSuccess(true)
      qc.invalidateQueries({ queryKey: ['reviews', productId] })
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Ошибка отправки. Попробуйте позже.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <h2 className={styles.heading}>Отзывы</h2>
      <div className={styles.grid}>
        {/* Left: review list */}
        <div className={styles.list}>
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
              {r.image && (
                <img src={r.image} alt="фото" className={styles.reviewImg} />
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
          <div className={styles.fileRow}>
            <button type="button" className={styles.fileBtn} onClick={() => fileRef.current?.click()}>
              {image ? image.name : 'Выбрать файл'}
            </button>
            {image && (
              <button type="button" className={styles.clearFile} onClick={() => setImage(null)}>✕</button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => setImage(e.target.files?.[0] ?? null)}
          />

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.successMsg}>Отзыв отправлен и ожидает проверки</p>}

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? 'Отправляем...' : 'Отправить отзыв'}
          </button>
        </form>
      </div>
    </div>
  )
}

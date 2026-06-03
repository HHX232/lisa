'use client'

import { useChangeReviewStatus, useDeleteAdminReview, useUpdateAdminReview } from '@/hooks/admin.hooks'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosClassic } from '@/api/helpers/api.interceptor'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { AdminReview, ReviewStatus } from '@/api/services/admin.service'
import styles from './ProductReviewsAdmin.module.scss'

const STATUS_LABELS: Record<ReviewStatus, string> = {
  PENDING: 'На проверке',
  APPROVED: 'Опубликован',
  REJECTED: 'Отклонён',
}
const STATUSES: ReviewStatus[] = ['PENDING', 'APPROVED', 'REJECTED']

interface ReviewsPage {
  content: AdminReview[]
  page: { totalElements: number; totalPages: number; number: number }
}

function StarDisplay({ value }: { value: number }) {
  return (
    <span>
      {[1,2,3,4,5].map(n => (
        <span key={n} style={{ color: n <= value ? '#c9a84c' : '#ddd' }}>★</span>
      ))}
    </span>
  )
}

export default function ProductReviewsAdmin({ productId }: { productId: number }) {
  const qc = useQueryClient()
  const QUERY_KEY = ['admin', 'reviews', productId]

  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [editReview, setEditReview] = useState<AdminReview | null>(null)
  const [editText, setEditText] = useState('')
  const [editStars, setEditStars] = useState(5)
  const [deleteImage, setDeleteImage] = useState(false)
  const [editImages, setEditImages] = useState<File[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useQuery<ReviewsPage>({
    queryKey: [...QUERY_KEY, page, statusFilter],
    queryFn: async () => {
      const res = await axiosClassic.get('/admin/product-reviews', {
        params: { productId, status: statusFilter || undefined, page, size: 5 }
      })
      return res.data
    }
  })

  const deleteMutation = useDeleteAdminReview()
  const statusMutation = useChangeReviewStatus()
  const updateMutation = useUpdateAdminReview()

  const reviews = data?.content ?? []
  const totalPages = data?.page.totalPages ?? 0

  const openEdit = (r: AdminReview) => {
    setEditReview(r)
    setEditText(r.text)
    setEditStars(r.stars)
    setDeleteImage(false)
    setEditImages([])
  }

  const handleUpdate = async () => {
    if (!editReview) return
    try {
      await updateMutation.mutateAsync({
        productId: editReview.id,
        data: { text: editText, stars: editStars, deleteImage },
        images: editImages.length > 0 ? editImages : undefined,
      })
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Отзыв обновлён')
      setEditReview(null)
    } catch {
      toast.error('Ошибка обновления')
    }
  }

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id)
    qc.invalidateQueries({ queryKey: QUERY_KEY })
    toast.success('Отзыв удалён')
  }

  const handleStatus = (id: number, status: string) => {
    statusMutation.mutate({ id, status }, {
      onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY })
    })
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Отзывы товара</span>
        <select
          className={styles.statusFilter}
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(0) }}
        >
          <option value="">Все</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {isLoading && <div className={styles.empty}>Загрузка...</div>}

      {!isLoading && reviews.length === 0 && (
        <div className={styles.empty}>Отзывов нет</div>
      )}

      {reviews.map(r => (
        <div key={r.id} className={styles.card}>
          <div className={styles.cardTop}>
            <span className={styles.author}>{r.author || 'Аноним'}</span>
            <StarDisplay value={r.stars} />
            <span className={styles.date}>{new Date(r.createdAt).toLocaleDateString('ru-RU')}</span>
            {r.image && <img src={r.image} alt="" className={styles.thumb} />}
          </div>

          <p className={styles.text}>{r.text}</p>

          <div className={styles.cardActions}>
            <select
              className={styles.statusSelect}
              value={r.status}
              onChange={e => handleStatus(r.id, e.target.value)}
            >
              {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
            <button className={styles.editBtn} type="button" onClick={() => openEdit(r)}>Изменить</button>
            <button className={styles.deleteBtn} type="button" onClick={() => handleDelete(r.id)}>Удалить</button>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button type="button" disabled={page === 0} onClick={() => setPage(p => p - 1)}>←</button>
          <span>{page + 1} / {totalPages}</span>
          <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>→</button>
        </div>
      )}

      {/* Edit inline panel */}
      {editReview && (
        <div className={styles.editPanel}>
          <div className={styles.editHeader}>
            <span>Редактировать отзыв #{editReview.id}</span>
            <button type="button" className={styles.closeEdit} onClick={() => setEditReview(null)}>✕</button>
          </div>

          <label className={styles.label}>Текст</label>
          <textarea
            className={styles.textarea}
            rows={3}
            value={editText}
            onChange={e => setEditText(e.target.value)}
          />

          <label className={styles.label}>Оценка</label>
          <select className={styles.statusSelect} value={editStars}
            onChange={e => setEditStars(Number(e.target.value))}>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ★</option>)}
          </select>

          {editReview.image && (
            <label className={styles.checkRow}>
              <input type="checkbox" checked={deleteImage} onChange={e => setDeleteImage(e.target.checked)} />
              Удалить текущее фото
            </label>
          )}

          {editImages.length > 0 && (
            <div className={styles.newImgList}>
              {editImages.map((img, i) => (
                <span key={i} className={styles.newImgChip}>
                  {img.name}
                  <button type="button" onClick={() => setEditImages(prev => prev.filter((_, j) => j !== i))}>✕</button>
                </span>
              ))}
            </div>
          )}
          <button type="button" className={styles.fileBtn} onClick={() => fileRef.current?.click()}>
            + Добавить фото
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
            onChange={e => {
              setEditImages(prev => [...prev, ...Array.from(e.target.files ?? [])])
              e.target.value = ''
            }} />

          <div className={styles.editFooter}>
            <button type="button" className={styles.cancelBtn} onClick={() => setEditReview(null)}>Отмена</button>
            <button type="button" className={styles.saveBtn} onClick={handleUpdate}
              disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Сохраняем...' : 'Сохранить'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

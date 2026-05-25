'use client'

import { useEffect, useRef, useState } from 'react'
import productService from '@/api/services/productService.service'
import { useUpsertProduct } from '@/hooks/admin.hooks'
import { Characteristic, ProductFull } from '@/types/Product.types'
import styles from './ProductFormModal.module.scss'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageMeta {
  id: string
  displayOrder: number
  delete: boolean
}

interface FormState {
  id: number
  title: string
  description: string
  fullDescription: string
  isComplect: boolean
  quantityInStock: number
  complectItems: string
  sale: number
  currency: string
  useFillImage: boolean
  originalPrice: number
  inShops: string[]
  characteristics: Characteristic[]
  isSouvenir: boolean
  categoryId: string
  isAdvertisement: boolean
  advertisementType: string
  imagesMeta: ImageMeta[]
}

const EMPTY: FormState = {
  id: 0,
  title: '',
  description: '',
  fullDescription: '',
  isComplect: false,
  quantityInStock: 0,
  complectItems: '',
  sale: 0,
  currency: 'BYN',
  useFillImage: false,
  originalPrice: 0,
  inShops: [],
  characteristics: [],
  isSouvenir: false,
  categoryId: '',
  isAdvertisement: false,
  advertisementType: '',
  imagesMeta: [],
}

interface Props {
  productId: number | null
  onClose: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductFormModal({ productId, onClose }: Props) {
  const isEdit = productId !== null && productId !== 0

  const [form, setForm] = useState<FormState>(EMPTY)
  const [existingImages, setExistingImages] = useState<{ id: string; url: string; displayOrder: number }[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(isEdit)
  const [shopInput, setShopInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const upsertMutation = useUpsertProduct()

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(f => ({ ...f, [key]: value }))

  // Load product for edit mode
  useEffect(() => {
    if (!isEdit) return
    setIsLoading(true)
    productService.getProductById(productId!).then(res => {
      if (res.isError || !res.data) { setIsLoading(false); return }
      const p = res.data as ProductFull
      setForm({
        id: p.id,
        title: p.title,
        description: p.description,
        fullDescription: p.fullDescription ?? '',
        isComplect: p.isComplect,
        quantityInStock: 0,
        complectItems: p.complectItems?.map(c => c.id).join(', ') ?? '',
        sale: p.sale,
        currency: p.currency ?? 'BYN',
        useFillImage: p.useFillImage,
        originalPrice: p.originalPrice,
        inShops: p.inShops ?? [],
        characteristics: p.characteristics ?? [],
        isSouvenir: p.isSouvenir,
        categoryId: '',
        isAdvertisement: p.isAdvertisement ?? false,
        advertisementType: p.advertisementType ?? '',
        imagesMeta: p.images?.map((img, i) => ({
          id: img.id,
          displayOrder: img.displayOrder ?? i,
          delete: false,
        })) ?? [],
      })
      setExistingImages(p.images ?? [])
      setIsLoading(false)
    })
  }, [productId])

  // ── Image handlers ───────────────────────────────────────────────────────

  const addFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach(file => {
      setNewImages(prev => [...prev, file])
      const reader = new FileReader()
      reader.onload = e => setNewPreviews(prev => [...prev, e.target?.result as string])
      reader.readAsDataURL(file)
    })
  }

  const removeNewImage = (idx: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx))
    setNewPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const toggleExistingDelete = (id: string) =>
    setForm(f => ({
      ...f,
      imagesMeta: f.imagesMeta.map(m => m.id === id ? { ...m, delete: !m.delete } : m),
    }))

  // ── Shop handlers ────────────────────────────────────────────────────────

  const addShop = () => {
    const val = shopInput.trim()
    if (!val) return
    set('inShops', [...form.inShops, val])
    setShopInput('')
  }

  // ── Characteristic handlers ──────────────────────────────────────────────

  const updateChar = (idx: number, key: 'name' | 'value', val: string) =>
    set('characteristics', form.characteristics.map((c, i) => i === idx ? { ...c, [key]: val } : c))

  const removeChar = (idx: number) =>
    set('characteristics', form.characteristics.filter((_, i) => i !== idx))

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const product = {
      id: form.id,
      title: form.title,
      description: form.description,
      fullDescription: form.fullDescription,
      isComplect: form.isComplect,
      quantityInStock: Number(form.quantityInStock),
      complectItems: form.complectItems
        ? form.complectItems.split(',').map(s => Number(s.trim())).filter(n => n > 0)
        : [],
      sale: Number(form.sale),
      currency: form.currency,
      useFillImage: form.useFillImage,
      originalPrice: Number(form.originalPrice),
      inShops: form.inShops,
      characteristics: form.characteristics.filter(c => c.name.trim()),
      isSouvenir: form.isSouvenir,
      categoryId: form.categoryId ? Number(form.categoryId) : 0,
      isAdvertisement: form.isAdvertisement,
      advertisementType: form.advertisementType,
      imagesMeta: form.imagesMeta,
    }
    await upsertMutation.mutateAsync({ product, images: newImages })
    onClose()
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEdit ? `Редактировать товар #${productId}` : 'Создать товар'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}><span /><span /></button>
        </div>

        {isLoading ? (
          <div className={styles.loadingState}>Загрузка...</div>
        ) : (
          <div className={styles.body}>

            {/* ── Section: Основное ─────────────────────────────────────── */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Основное</h3>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Название</label>
                <input className={styles.input} value={form.title} placeholder="Название товара"
                  onChange={e => set('title', e.target.value)} />
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Краткое описание</label>
                <textarea className={styles.textarea} value={form.description} rows={2}
                  placeholder="Краткое описание" onChange={e => set('description', e.target.value)} />
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Полное описание</label>
                <textarea className={styles.textarea} value={form.fullDescription} rows={4}
                  placeholder="Подробное описание" onChange={e => set('fullDescription', e.target.value)} />
              </div>
            </section>

            {/* ── Section: Цены ─────────────────────────────────────────── */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Цены и наличие</h3>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Цена</label>
                  <input className={styles.input} type="number" min={0} value={form.originalPrice}
                    onChange={e => set('originalPrice', Number(e.target.value))} />
                </div>

                <div className={styles.fieldNarrow}>
                  <label className={styles.label}>Валюта</label>
                  <select className={styles.select} value={form.currency}
                    onChange={e => set('currency', e.target.value)}>
                    <option value="BYN">BYN</option>
                    <option value="RUB">RUB</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                <div className={styles.fieldNarrow}>
                  <label className={styles.label}>Скидка %</label>
                  <input className={styles.input} type="number" min={0} max={100} value={form.sale}
                    onChange={e => set('sale', Number(e.target.value))} />
                </div>

                <div className={styles.fieldNarrow}>
                  <label className={styles.label}>На складе</label>
                  <input className={styles.input} type="number" min={0} value={form.quantityInStock}
                    onChange={e => set('quantityInStock', Number(e.target.value))} />
                </div>

                <div className={styles.fieldNarrow}>
                  <label className={styles.label}>ID категории</label>
                  <input className={styles.input} type="number" min={0} value={form.categoryId}
                    onChange={e => set('categoryId', e.target.value)} />
                </div>
              </div>
            </section>

            {/* ── Section: Параметры ────────────────────────────────────── */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Параметры</h3>

              <div className={styles.toggleRow}>
                {([
                  ['isComplect', 'Комплект'],
                  ['useFillImage', 'Заливка фото'],
                  ['isSouvenir', 'Сувенир'],
                  ['isAdvertisement', 'Реклама'],
                ] as [keyof FormState, string][]).map(([key, label]) => (
                  <label key={String(key)} className={styles.toggle}>
                    <input
                      type="checkbox"
                      className={styles.toggleInput}
                      checked={form[key] as boolean}
                      onChange={e => set(key, e.target.checked)}
                    />
                    <span className={styles.toggleTrack} />
                    <span className={styles.toggleText}>{label}</span>
                  </label>
                ))}
              </div>

              {form.isAdvertisement && (
                <div className={styles.fieldHalf}>
                  <label className={styles.label}>Тип рекламы</label>
                  <input className={styles.input} value={form.advertisementType} placeholder="Тип рекламы"
                    onChange={e => set('advertisementType', e.target.value)} />
                </div>
              )}

              {form.isComplect && (
                <div className={styles.fieldFull}>
                  <label className={styles.label}>ID товаров в комплекте (через запятую)</label>
                  <input className={styles.input} value={form.complectItems} placeholder="1, 2, 3"
                    onChange={e => set('complectItems', e.target.value)} />
                </div>
              )}
            </section>

            {/* ── Section: Магазины ─────────────────────────────────────── */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Магазины</h3>

              <div className={styles.tagInput}>
                <input
                  className={styles.input}
                  value={shopInput}
                  placeholder="Название магазина"
                  onChange={e => setShopInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addShop() } }}
                />
                <button className={styles.addBtn} type="button" onClick={addShop}>+</button>
              </div>

              {form.inShops.length > 0 && (
                <div className={styles.tags}>
                  {form.inShops.map((shop, i) => (
                    <span key={i} className={styles.tag}>
                      {shop}
                      <button type="button" onClick={() => set('inShops', form.inShops.filter((_, j) => j !== i))}>
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* ── Section: Характеристики ───────────────────────────────── */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Характеристики</h3>

              {form.characteristics.length > 0 && (
                <div className={styles.charList}>
                  {form.characteristics.map((c, i) => (
                    <div key={i} className={styles.charRow}>
                      <input className={styles.input} value={c.name} placeholder="Название"
                        onChange={e => updateChar(i, 'name', e.target.value)} />
                      <input className={styles.input} value={c.value} placeholder="Значение"
                        onChange={e => updateChar(i, 'value', e.target.value)} />
                      <button className={styles.removeBtn} type="button" onClick={() => removeChar(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              <button
                className={styles.addLineBtn}
                type="button"
                onClick={() => set('characteristics', [...form.characteristics, { name: '', value: '' }])}
              >
                + Добавить характеристику
              </button>
            </section>

            {/* ── Section: Изображения ──────────────────────────────────── */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Изображения</h3>

              {existingImages.length > 0 && (
                <>
                  <p className={styles.subLabel}>Существующие — нажмите ✕ чтобы отметить на удаление</p>
                  <div className={styles.imageGrid}>
                    {existingImages.map(img => {
                      const isDeleted = form.imagesMeta.find(m => m.id === img.id)?.delete ?? false
                      return (
                        <div
                          key={img.id}
                          className={`${styles.imageCard} ${isDeleted ? styles.imageCardDeleted : ''}`}
                        >
                          <img src={img.url} alt="" />
                          <button
                            type="button"
                            className={`${styles.imageAction} ${isDeleted ? styles.imageActionRestore : styles.imageActionDelete}`}
                            onClick={() => toggleExistingDelete(img.id)}
                          >
                            {isDeleted ? '↩' : '✕'}
                          </button>
                          {isDeleted && <div className={styles.deletedOverlay}>Удалить</div>}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}

              <p className={styles.subLabel}>{existingImages.length > 0 ? 'Новые фото' : 'Загрузить фото'}</p>

              <div className={styles.uploadZone} onClick={() => fileRef.current?.click()}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <span>Нажмите чтобы добавить фото</span>
                <span className={styles.uploadHint}>PNG, JPG, WEBP · несколько файлов</span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className={styles.fileInput}
                onChange={e => { addFiles(e.target.files); e.target.value = '' }}
              />

              {newPreviews.length > 0 && (
                <div className={styles.imageGrid}>
                  {newPreviews.map((src, i) => (
                    <div key={i} className={styles.imageCard}>
                      <img src={src} alt="" />
                      <button
                        type="button"
                        className={`${styles.imageAction} ${styles.imageActionDelete}`}
                        onClick={() => removeNewImage(i)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Отмена</button>
          <button
            className={styles.saveBtn}
            onClick={handleSubmit}
            disabled={upsertMutation.isPending || isLoading}
          >
            {upsertMutation.isPending ? 'Сохраняем...' : isEdit ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </div>
    </div>
  )
}

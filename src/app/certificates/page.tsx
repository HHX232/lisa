'use client'

import Footer from '@/components/Main/Footer/Footer'
import Header from '@/components/Main/Header/Header'
import { axiosClassic } from '@/api/helpers/api.interceptor'
import { GiftCertificate } from '@/types/GiftCertificate.types'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import NextImage from 'next/image'
import styles from './certificates.module.css'

// ─── Order modal ──────────────────────────────────────────────────────────────

function OrderModal({ cert, onClose }: { cert: GiftCertificate; onClose: () => void }) {
  const [count, setCount] = useState(1)

  const mutation = useMutation({
    mutationFn: () =>
      axiosClassic.post('/gift-certificates/order', { certificateId: cert.id, count }).then(r => r.data),
    onSuccess: () => {
      toast.success('Заявка отправлена! Мы свяжемся с вами.')
      onClose()
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : 'Ошибка'),
  })

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
          <span /><span />
        </button>
        <h2 className={styles.modalTitle}>Заказать сертификат</h2>
        <p className={styles.modalDesc}>{cert.name} — {cert.price} {cert.currency ?? 'BYN'}</p>

        <label className={styles.modalLabel}>
          Количество
          <input
            className={styles.modalInput}
            type="number"
            min={1}
            max={99}
            value={count}
            onChange={e => setCount(Math.max(1, Number(e.target.value)))}
          />
        </label>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Отмена</button>
          <button className={styles.buyBtn} onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? 'Отправляем...' : 'Оформить заявку'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Custom order modal ───────────────────────────────────────────────────────

function CustomOrderModal({ onClose }: { onClose: () => void }) {
  const [count, setCount] = useState(1)
  const [price, setPrice] = useState('')

  const mutation = useMutation({
    mutationFn: () =>
      axiosClassic.post('/gift-certificates/order-custom', { count, price: Number(price), currency: 'BYN' }).then(r => r.data),
    onSuccess: () => {
      toast.success('Заявка на кастомный сертификат отправлена!')
      onClose()
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : 'Ошибка'),
  })

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
          <span /><span />
        </button>
        <h2 className={styles.modalTitle}>Кастомный сертификат</h2>
        <p className={styles.modalDesc}>Выберите любой номинал — мы оформим сертификат на нужную сумму.</p>

        <label className={styles.modalLabel}>
          Номинал (BYN)
          <input
            className={styles.modalInput}
            type="number"
            min={1}
            placeholder="Например, 150"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </label>
        <label className={styles.modalLabel}>
          Количество
          <input
            className={styles.modalInput}
            type="number"
            min={1}
            max={99}
            value={count}
            onChange={e => setCount(Math.max(1, Number(e.target.value)))}
          />
        </label>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Отмена</button>
          <button
            className={styles.buyBtn}
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !price || Number(price) < 1}
          >
            {mutation.isPending ? 'Отправляем...' : 'Оформить заявку'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CertificatesPage() {
  const { data: certs = [], isLoading } = useQuery<GiftCertificate[]>({
    queryKey: ['gift-certificates'],
    queryFn: async () => {
      const res = await axiosClassic.get<GiftCertificate[]>('/gift-certificates')
      return res.data
    },
    staleTime: Infinity,
  })

  const [orderCert, setOrderCert] = useState<GiftCertificate | null>(null)
  const [customOpen, setCustomOpen] = useState(false)

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={`${styles.inner} container`}>
          <h1 className={styles.pageTitle}>Подарочные сертификаты</h1>
          <p className={styles.pageDesc}>
            Не знаете, какое украшение выбрать? Подарите сертификат — и пусть ваш близкий выберет сам.
          </p>

          {isLoading ? (
            <div className={styles.grid}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`${styles.card} ${styles.skeleton}`} />
              ))}
            </div>
          ) : (
            <div className={styles.grid}>
              {/* Custom certificate card — always first */}
              <div className={`${styles.card} ${styles.cardCustom}`} onClick={() => setCustomOpen(true)}>
                <div className={styles.certImgCustom}>
                  <div className={styles.customPlus}>+</div>
                  <div className={styles.customLabel}>Свой номинал</div>
                </div>
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>Кастомный сертификат</h2>
                  <p className={styles.cardDesc}>Выберите любую сумму — мы оформим сертификат на нужный номинал специально для вас.</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>любой номинал</span>
                    <button className={styles.buyBtn} type="button">Заказать</button>
                  </div>
                </div>
              </div>

              {certs.map(cert => (
                <div key={cert.id} className={styles.card}>
                  <div
                    className={styles.certImg}
                    style={cert.imageUrl ? undefined : { background: cert.gradient, color: cert.textColor }}
                  >
                    {cert.imageUrl ? (
                      <NextImage
                        src={cert.imageUrl}
                        alt={cert.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <>
                        <div className={styles.certLabel}>Septaria</div>
                        <div className={styles.certAmount}>{cert.price} руб.</div>
                        <div className={styles.certSub}>Подарочный сертификат</div>
                      </>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>{cert.name}</h2>
                    <p className={styles.cardDesc}>{cert.description}</p>
                    <div className={styles.cardFooter}>
                      <span className={styles.price}>{cert.price} {cert.currency ?? 'BYN'}</span>
                      <button className={styles.buyBtn} type="button" onClick={() => setOrderCert(cert)}>Купить</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />

      {orderCert && <OrderModal cert={orderCert} onClose={() => setOrderCert(null)} />}
      {customOpen && <CustomOrderModal onClose={() => setCustomOpen(false)} />}
    </>
  )
}

'use client'

import ModalWindowDefault from '@/components/UI/Modal/ModalWindowDefault/ModalWindowDefault'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import 'swiper/css'
import { FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './PaymentCardSlider.module.scss'
import { axiosClassic } from '@/api/helpers/api.interceptor'

interface InstallmentCard {
  id: number
  image: string
  address: string
  period: string
}

const getInstallmentCards = async (): Promise<InstallmentCard[]> => {
  const res = await axiosClassic.get<InstallmentCard[]>('/installment-cards')
  return res.data
}

function PaymentCardSlider() {
  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['installment-cards'],
    queryFn: getInstallmentCards,
  })

  const [selectedCard, setSelectedCard] = useState<InstallmentCard | null>(null)

  useEffect(() => {
    if (selectedCard !== null) {
      document.body.style.setProperty('overflowY', 'hidden', 'important')
    } else {
      document.body.style.setProperty('overflowY', 'auto', 'important')
    }
    return () => {
      document.body.style.setProperty('overflowY', 'auto', 'important')
    }
  }, [selectedCard])

  if (isLoading) return null

  return (
    <div className={`${styles.main} container`}>
      <h3>Карты рассрочки</h3>
      <Swiper
        modules={[FreeMode]}
        freeMode={true}
        slidesPerView="auto"
        spaceBetween={50}
        className={styles.swiper}
      >
        {cards.map((card) => (
          <SwiperSlide key={card.id} className={styles.slide}>
            <div
              className={styles.card}
              onClick={() => setSelectedCard(card)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedCard(card)}
            >
              <Image
                src={card.image}
                alt={card.address}
                className={styles.cardImage}
                draggable={false}
                width={200}
                height={120}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {selectedCard && (
        <ModalWindowDefault
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          additionalTitle={
            <p className={styles.modalTitle}>{selectedCard.address}</p>
          }
        >
          <div className={styles.modalContent}>
            <div className={styles.modalPreview}>
              <Image
                src={selectedCard.image}
                alt={selectedCard.address}
                width={260}
                height={160}
                className={styles.modalCardImage}
                draggable={false}
              />
            </div>
            <div className={styles.storeList}>
              <div className={styles.storeItem}>
                <p className={styles.storeAddress}>📍 {selectedCard.address}</p>
                <p className={styles.storeMonths}>
                  Рассрочка: <span>{selectedCard.period}</span>
                </p>
              </div>
            </div>
          </div>
        </ModalWindowDefault>
      )}
    </div>
  )
}

export default PaymentCardSlider
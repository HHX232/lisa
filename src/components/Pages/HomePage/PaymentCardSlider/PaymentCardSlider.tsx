'use client'

import ModalWindowDefault from '@/components/UI/Modal/ModalWindowDefault/ModalWindowDefault'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import 'swiper/css'
import { FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './PaymentCardSlider.module.scss'

interface StoreInfo {
  name: string
  address: string
  metro: string
  months: number
}

interface Card {
  id: number
  src: string
  alt: string
  cardName: string
  stores: StoreInfo[]
}

const CARDS: Card[] = [
  {
    id: 1,
    src: '/info/card-1.png',
    alt: 'Халва',
    cardName: 'Халва',
    stores: [
      {
        name: 'Золото',
        address: 'ул. Сурганова, 16',
        metro: 'Академия наук',
        months: 2,
      },
    ],
  },
  {
    id: 2,
    src: '/info/card-2.png',
    alt: 'Карта покупок',
    cardName: 'Карта покупок',
    stores: [
      {
        name: 'Золото',
        address: 'ул. Сурганова, 16',
        metro: 'Академия наук',
        months: 2,
      },
      {
        name: 'Серебро',
        address: 'ул. Козлова, 6',
        metro: 'Площадь Победы',
        months: 3,
      },
    ],
  },
  {
    id: 3,
    src: '/info/card-3.png',
    alt: 'Магнит',
    cardName: 'Магнит',
    stores: [
      {
        name: 'Серебро',
        address: 'ул. Козлова, 6',
        metro: 'Площадь Победы',
        months: 4,
      },
    ],
  },
  {
    id: 4,
    src: '/info/card-4.png',
    alt: 'КартаFUN',
    cardName: 'КартаFUN',
    stores: [
      {
        name: 'Золото',
        address: 'ул. Сурганова, 16',
        metro: 'Академия наук',
        months: 3,
      },
      {
        name: 'Серебро',
        address: 'ул. Козлова, 6',
        metro: 'Площадь Победы',
        months: 6,
      },
    ],
  },
  {
    id: 5,
    src: '/info/card-5.png',
    alt: 'Черепаха (ВТБ)',
    cardName: 'Черепаха',
    stores: [
      {
        name: 'Серебро',
        address: 'ул. Козлова, 6',
        metro: 'Площадь Победы',
        months: 8,
      },
    ],
  },
  {
    id: 6,
    src: '/info/card-6.png',
    alt: 'SMART',
    cardName: 'SMART',
    stores: [
      {
        name: 'Серебро',
        address: 'ул. Козлова, 6',
        metro: 'Площадь Победы',
        months: 4,
      },
    ],
  },
]

function PaymentCardSlider() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  useEffect(() => {
    if (selectedCard !== null) {
      document.body.style.setProperty('overflowY', 'hidden', 'important')
    } else {
       document.body.style.setProperty('overflowY', 'auto', 'important')
    }
    return ()=>{         document.body.style.setProperty('overflowY', 'auto', 'important')
}
  }, [selectedCard])

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
        {CARDS.map((card) => (
          <SwiperSlide key={card.id} className={styles.slide}>
            <div
              className={styles.card}
              onClick={() => setSelectedCard(card)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedCard(card)}
            >
              <Image
                src={card.src}
                alt={card.alt}
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
            <p className={styles.modalTitle}>{selectedCard.cardName}</p>
          }
        >
          <div className={styles.modalContent}>
            <div className={styles.modalPreview}>
              <Image
                src={selectedCard.src}
                alt={selectedCard.alt}
                width={260}
                height={160}
                className={styles.modalCardImage}
                draggable={false}
              />
            </div>

            <div className={styles.storeList}>
              {selectedCard.stores.map((store) => (
                <div key={store.name} className={styles.storeItem}>
                  <p className={styles.storeName}>Салон «{store.name}»</p>
                  <p className={styles.storeAddress}>
                    📍 {store.address}, метро «{store.metro}»
                  </p>
                  <p className={styles.storeMonths}>
                    Рассрочка:{' '}
                    <span>{store.months} мес.</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ModalWindowDefault>
      )}
    </div>
  )
}

export default PaymentCardSlider
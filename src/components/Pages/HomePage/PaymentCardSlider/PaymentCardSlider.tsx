'use client'

import Image from 'next/image'
import 'swiper/css'
import { FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './PaymentCardSlider.module.scss'

const CARDS = [
  { id: 1, src: '/info/card-1.png', alt: 'Card 1' },
  { id: 2, src: '/info/card-2.png', alt: 'Card 2' },
  { id: 3, src: '/info/card-3.png', alt: 'Card 3' },
  { id: 4, src: '/info/card-4.png', alt: 'Card 4' },
  { id: 5, src: '/info/card-5.png', alt: 'Card 5' },
  { id: 6, src: '/info/card-6.png', alt: 'Card 6' },
]

function PaymentCardSlider() {
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
            <div className={styles.card}>
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
    </div>
  )
}

export default PaymentCardSlider
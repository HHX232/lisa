'use client'

import { Product } from '@/types/Product.types'
import cn from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './ComplectsPreview.module.scss'

function ComplectsPreview({ products }: { products: Product[] }) {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null)
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null)

  if (products.length === 0) return null

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Выбери свой идеальный комплект</h2>

      <div className={cn(styles.sliderWrapper, 'container')}>
        <button
          ref={setPrevEl}
          className={cn(styles.navButton, styles.navPrev)}
          aria-label="Назад"
        >
          <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.7505 8.2495L7.35033 14.8493L9 13.1997L3.225 7.42467L9 1.64967L7.35033 0L0.7505 6.59983C0.531781 6.81862 0.408917 7.11531 0.408917 7.42467C0.408917 7.73402 0.531781 8.03072 0.7505 8.2495Z" fill="#072761" />
          </svg>
        </button>

        <div className={styles.swiperContainer}>
          <Swiper
            modules={[Navigation]}
            navigation={{ prevEl, nextEl }}
            spaceBetween={30}
            slidesPerView={4}
            slidesPerGroup={4}
            breakpoints={{
              320: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 12 },
              768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 30 },
            }}
            className={styles.swiper}
          >
            {products.map(product => (
              <SwiperSlide key={product.id}>
                <Link href={`/card/${product.id}`} className={styles.slide}>
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <button
          ref={setNextEl}
          className={cn(styles.navButton, styles.navNext)}
          aria-label="Вперёд"
        >
          <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M8.2495 8.2495L1.64967 14.8493L0 13.1997L5.775 7.42467L0 1.64967L1.64967 0L8.2495 6.59983C8.46822 6.81862 8.59108 7.11531 8.59108 7.42467C8.59108 7.73402 8.46822 8.03072 8.2495 8.2495Z" fill="#072761" />
          </svg>
        </button>
      </div>

      <div className={styles.btnWrap}>
        <Link href="/catalog?isComplect=true" className={styles.btnAll}>
          Посмотреть все комплекты
        </Link>
      </div>
    </div>
  )
}

export default ComplectsPreview

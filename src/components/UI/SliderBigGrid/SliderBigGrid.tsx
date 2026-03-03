'use client'
import Card from '@/components/Products/Card/Card'
import { Product } from '@/types/Product.types'
import cn from 'clsx'
import Image from 'next/image'
import { useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './SliderBigGrid.module.scss'



type Props = {
  title?: string
  slides: {
    image: string
    title?: string
  }[]
  useFillImage?: boolean
  isCardSlider?: boolean
  cards?: Product[]
}

function SliderBigGrid({ title, slides, useFillImage = false, isCardSlider = false, cards }: Props) {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null)
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null)
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <div className={styles.sliderContainer}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}

      <div className={cn(styles.sliderWrapper, 'container')}>
        {/* Левая стрелка */}
        <button
          ref={setPrevEl}
          className={cn(styles.navButton, styles.navButtonPrev)}
          aria-label="Previous slide"
        >
          <svg
            width="9"
            height="15"
            viewBox="0 0 9 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.7505 8.2495L7.35033 14.8493L9 13.1997L3.225 7.42467L9 1.64967L7.35033 0L0.7505 6.59983C0.531781 6.81862 0.408917 7.11531 0.408917 7.42467C0.408917 7.73402 0.531781 8.03072 0.7505 8.2495Z"
              fill="#072761"
            />
          </svg>
        </button>

        {/* Слайдер */}
        <div className={styles.swiperContainer}>
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            slidesPerView={4}
            slidesPerGroup={4}
            navigation={{
              prevEl,
              nextEl,
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper
            }}
            breakpoints={{
              320: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 30,
              },
            }}
            className={styles.swiper}
          >
            {isCardSlider ? (
              cards?.map((card) => (
                <SwiperSlide key={card.id}>
                  <Card {...card} isSouvenir={false}   useFillImage={useFillImage} />
                </SwiperSlide>
              ))
            ) : (
              slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className={styles.slideItem}>
                    <div className={cn(styles.slideImage, useFillImage && styles.fillImage)}>
                      <Image
                        src={slide.image}
                        alt={slide.title || ''}
                        width={400}
                        height={300}
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </div>
                    {slide.title && (
                      <p className={styles.slideTitle}>
                        {slide.title}
                      </p>
                    )}
                  </div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>

        {/* Правая стрелка */}
        <button
          ref={setNextEl}
          className={cn(styles.navButton, styles.navButtonNext)}
          aria-label="Next slide"
        >
          <svg
            width="9"
            height="15"
            viewBox="0 0 9 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.2495 8.2495L1.64967 14.8493L0 13.1997L5.775 7.42467L0 1.64967L1.64967 0L8.2495 6.59983C8.46822 6.81862 8.59108 7.11531 8.59108 7.42467C8.59108 7.73402 8.46822 8.03072 8.2495 8.2495Z"
              fill="#072761"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default SliderBigGrid

// Mock data для SliderBigGrid

// Обычные слайды (без карточек)
export const mockSlides = [
  {
    image: '/mock/compl1.png',
  },
  {
    image: '/mock/compl2.png',
  },
  {
    image: '/mock/compl3.png',
  },
  {
    image: '/mock/compl1.png',
  },
  {
    image: '/mock/compl2.png',
  },
  {
    image: '/mock/compl3.png',
  },
  {
    image: '/mock/compl1.png',
  },
  {
    image: '/mock/compl2.png',
  },
]

// Карточки товаров
export const mockCards = [
  {
    id: '1',
    title: 'Комплект постельного белья "Лаванда"',
    isComplect: true,
    currentPrice: 4990,
    originalPrice: 6990,
    sale: 29,
    description: '2-спальный, сатин, 100% хлопок',
    imageUrl: '/mock/compl1.png',
  },
  {
    id: '2',
    title: 'Комплект постельного белья "Роза"',
    isComplect: true,
    currentPrice: 5490,
    originalPrice: 7490,
    sale: 27,
    description: 'Евро, премиум сатин',
    imageUrl: '/mock/compl2.png',
  },
  {
    id: '3',
    title: 'Комплект постельного белья "Сакура"',
    isComplect: true,
    currentPrice: 3990,
    description: '1.5-спальный, поплин',
    imageUrl: '/mock/compl3.png',
  },
  {
    id: '4',
    title: 'Комплект постельного белья "Олива"',
    isComplect: true,
    currentPrice: 6490,
    originalPrice: 8990,
    sale: 28,
    description: 'Семейный, сатин-жаккард',
    imageUrl: '/mock/compl1.png',
  },
  {
    id: '5',
    title: 'Комплект постельного белья "Мята"',
    isComplect: true,
    currentPrice: 4490,
    description: '2-спальный, бязь люкс',
    imageUrl: '/mock/compl2.png',
  },
  {
    id: '6',
    title: 'Комплект постельного белья "Пион"',
    isComplect: true,
    currentPrice: 5990,
    originalPrice: 7990,
    sale: 25,
    description: 'Евро, перкаль премиум',
    imageUrl: '/mock/compl3.png',
  },
  {
    id: '7',
    title: 'Комплект постельного белья "Ирис"',
    isComplect: true,
    currentPrice: 3490,
    description: '1.5-спальный, ранфорс',
    imageUrl: '/mock/compl1.png',
  },
  {
    id: '8',
    title: 'Комплект постельного белья "Нарцисс"',
    isComplect: true,
    currentPrice: 7490,
    originalPrice: 9990,
    sale: 25,
    description: 'Семейный, сатин премиум',
    imageUrl: '/mock/compl2.png',
  },
]
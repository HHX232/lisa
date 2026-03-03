'use client'
import cn from 'clsx'
import { useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './SliderLittleGrid.module.scss'

import Image from 'next/image'

type Props = {
  title?: string
  slides: {
    image: string
    title: string
  }[]
}

function SliderLittleGrid({ title, slides }: Props) {
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
            slidesPerView={6}
            slidesPerGroup={6}
            navigation={{
              prevEl,
              nextEl,
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper
            }}
            breakpoints={{
              320: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 5,
                slidesPerGroup: 5,
                spaceBetween: 25,
              },
              1280: {
                slidesPerView: 6,
                slidesPerGroup: 6,
                spaceBetween: 30,
              },
            }}
            className={styles.swiper}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className={styles.slideItem}>
                  <div className={styles.slideImage}>
                    <Image src={slide.image} alt={slide.title} width={195} height={195} />
                  </div>
                  <p className={styles.slideTitle}>{slide.title}</p>
                </div>
              </SwiperSlide>
            ))}
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

export default SliderLittleGrid
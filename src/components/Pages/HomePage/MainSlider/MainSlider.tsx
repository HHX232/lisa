'use client'
import cn from 'clsx'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { EffectFade } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './MainSlider.module.scss'

import { Advertisement } from '@/types/Advertisement.types'
import 'swiper/css'
import 'swiper/css/effect-fade'

type TMainSliderProps = {
  slides: Advertisement[]
}

function MainSlider({ slides }: TMainSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [extractedColors, setExtractedColors] = useState<string[]>([])
  const swiperRef = useRef<SwiperType | null>(null)

  useEffect(() => {
    const extractColors = async () => {
      const colors: string[] = []
      for (const slide of slides) {
        colors.push(slide.edgeColor || 'transparent')
      }
      setExtractedColors(colors)
    }
    extractColors()
  }, [slides])

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex)
  }

  const goToPrev = () => swiperRef.current?.slidePrev()
  const goToNext = () => swiperRef.current?.slideNext()
  const goToSlide = (index: number) => swiperRef.current?.slideTo(index)

  return (
    <div className={styles.mainSliderContainer}>
      <Swiper
        modules={[EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        spaceBetween={0}
        slidesPerView={1}
        onSwiper={(swiper) => { swiperRef.current = swiper }}
        onSlideChange={handleSlideChange}
        className={styles.mainSlider}
      >
        {(slides || []).map((slide, index) => {
          const bgColor = extractedColors[index] === 'transparent'
            ? 'transparent'
            : extractedColors[index]

          const slideInner = (
            <div className={styles.slideWrapper}>
              <div
                className={styles.slideBackground}
                style={{ backgroundColor: bgColor }}
              />
              <div className={cn(styles.slideImageContainer, 'container')}>
                <div
                  className={styles.slideImage}
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
              </div>
              <div
                className={`${styles.slideOverlay} ${extractedColors[index] === 'transparent' ? 'container' : ''}`}
              />
              <div className={cn(styles.slideContent, 'container')}>
                <h2
                  dangerouslySetInnerHTML={{ __html: slide.title }}
                  className={styles.slideTitle}
                />
                {slide.description && (
                  <p
                    dangerouslySetInnerHTML={{ __html: slide.description }}
                    className={styles.slideDescription}
                  />
                )}
                {slide.specialLabel && (
                  slide.buttonUrl ? (
                    <Link href={slide.buttonUrl} className={styles.slideLabel}>
                      {slide.specialLabel}
                    </Link>
                  ) : (
                    <span className={styles.slideLabel}>
                      {slide.specialLabel}
                    </span>
                  )
                )}
              </div>
            </div>
          )

          return (
            <SwiperSlide key={index}>
              {slide.url ? (
                <Link href={slide.url} className={styles.slideLink}>
                  {slideInner}
                </Link>
              ) : (
                slideInner
              )}
            </SwiperSlide>
          )
        })}
      </Swiper>

      <div className={cn(styles.navigation, 'container')}>
        {/* Стрелка назад */}
        <button
          className={cn(styles.navArrow, styles.navArrowPrev, {
            [styles.navArrowDisabled]: activeIndex === 0,
          })}
          onClick={goToPrev}
          aria-label="Previous slide"
        >
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Линии */}
        {(slides || []).map((_, index) => (
          <button
            key={index}
            className={cn(styles.navLine, {
              [styles.navLineActive]: index === activeIndex,
            })}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}

        {/* Стрелка вперёд */}
        <button
          className={cn(styles.navArrow, styles.navArrowNext, {
            [styles.navArrowDisabled]: activeIndex === slides.length - 1,
          })}
          onClick={goToNext}
          aria-label="Next slide"
        >
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default MainSlider
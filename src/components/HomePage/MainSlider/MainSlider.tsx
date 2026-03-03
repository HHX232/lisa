'use client'
import cn from 'clsx'
import { useEffect, useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { EffectFade } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './MainSlider.module.scss'

import { Advertisement } from '@/types/Advertisement.types'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/effect-fade'
const arrowAccent = '/arrow-accent.svg'


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
        if (slide.edgeColor) {
          colors.push(slide.edgeColor)
          continue
        }else{
         colors.push('transparent')
        }
      }
      setExtractedColors(colors)
    }

    extractColors()
  }, [slides])

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex)
  }

  const goToSlide = (index: number) => {
    swiperRef.current?.slideTo(index)
  }

 

  return (
    <div className={styles.mainSliderContainer}>
<div className={styles.arrowContainer}>
      <Image
        src={arrowAccent}
        alt="arrow"
        className={styles.arrowAccent}
        width={14}
        height={40}
      />
    </div>
      <Swiper
        modules={[EffectFade]}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        speed={800}
        spaceBetween={0}
        slidesPerView={1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChange={handleSlideChange}
        className={styles.mainSlider}
      >
       
        {(slides || []).map((slide, index) => (
          <SwiperSlide key={index}>
            
            <div className={styles.slideWrapper}>
                
              <div
                className={styles.slideBackground}
                style={{ backgroundColor: extractedColors[index] === 'transparent' ? 'transparent' : extractedColors[index] }}
              />
              <div className={cn(styles.slideImageContainer, 'container')}>
                <div
                  className={styles.slideImage}
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
              </div>

              <div   className={`${styles.slideOverlay} ${extractedColors[index] === 'transparent' ? 'container' : ''}`} />

              <div className={cn(styles.slideContent, 'container')}>
                <h2 dangerouslySetInnerHTML={{ __html: slide.title }} className={styles.slideTitle}></h2>
                {slide.description && (
                  <p dangerouslySetInnerHTML={{ __html: slide.description }} className={styles.slideDescription}></p>
                )}
                {slide.specialLabel && (
                  <button className={styles.slideLabel}>
                    {slide.specialLabel}
                  </button>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={cn(styles.navigation, 'container')}>
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
      </div>
    </div>
  )
}

export default MainSlider
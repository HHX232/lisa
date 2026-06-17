'use client'

import SliderLittleGrid from '@/components/UI/SliderLittleGrid/SliderLittleGrid'
import { getRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { useEffect, useState } from 'react'

interface Props {
  excludeId?: number
}

export default function RecentlyViewedSlider({ excludeId }: Props) {
  const [slides, setSlides] = useState<{ image: string; title: string; href: string }[]>([])

  useEffect(() => {
    const items = getRecentlyViewed().filter(i => i.id !== excludeId)
    setSlides(
      items.map(i => ({
        image: i.imageUrl,
        title: i.title,
        href: `/card/${i.id}`,
      }))
    )
  }, [excludeId])

  if (slides.length === 0) return null

  return (
    <>
      <h2 style={{ marginTop: 70, marginBottom: 30, fontSize: 36, fontWeight: 400, textAlign: 'center', color: '#000' }}>
        Вы недавно смотрели
      </h2>
      <SliderLittleGrid slides={slides} imageSize={180} />
    </>
  )
}

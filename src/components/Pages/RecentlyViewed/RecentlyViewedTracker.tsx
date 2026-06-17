'use client'

import { addToRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { useEffect } from 'react'

interface Props {
  id: number
  title: string
  imageUrl: string
}

export default function RecentlyViewedTracker({ id, title, imageUrl }: Props) {
  useEffect(() => {
    addToRecentlyViewed({ id, title, imageUrl })
  }, [id, title, imageUrl])

  return null
}

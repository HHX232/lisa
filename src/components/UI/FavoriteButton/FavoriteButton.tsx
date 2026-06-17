'use client'

import { useFavoriteProducts, useToggleFavorite } from '@/hooks/User.queries'
import { toast } from 'sonner'
import styles from './FavoriteButton.module.scss'

interface Props {
  productId: number | string
  extraClass?: string
}

export default function FavoriteButton({ productId, extraClass }: Props) {
  const { data: favorites } = useFavoriteProducts()
  const toggle = useToggleFavorite()

  const isFavorite = favorites?.some((p) => String(p.id) === String(productId)) ?? false

  const handleClick = () => {
    const willAdd = !isFavorite
    toggle.mutate(productId, {
      onSuccess: () => toast.success(willAdd ? 'Добавлено в избранное' : 'Убрано из избранного'),
      onError: (err: unknown) => {
        const status = (err as { response?: { status?: number } })?.response?.status
        if (status === 401) toast.error('Необходимо войти в аккаунт')
      },
    })
  }

  return (
    <button
      className={`${styles.favorite} ${isFavorite ? styles.favoriteActive : ''} ${extraClass ?? ''}`}
      onClick={handleClick}
      disabled={toggle.isPending}
      aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
    >
      <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.6875 0.75C3.40875 0.75 0.75 3.575 0.75 7.05875C0.75 14.0312 12 22 12 22C12 22 23.25 14.0312 23.25 7.05875C23.25 2.7425 20.5912 0.75 17.3125 0.75C14.9875 0.75 12.975 2.17 12 4.2375C11.025 2.17 9.0125 0.75 6.6875 0.75Z"
          stroke="#072761"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isFavorite ? '#072761' : 'none'}
        />
      </svg>
    </button>
  )
}
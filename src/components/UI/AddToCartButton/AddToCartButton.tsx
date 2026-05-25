'use client'

import { useCart, useRemoveCartItem, useUpdateCartItem } from '@/hooks/cart.hooks'
import styles from './AddToCartButton.module.scss'

interface Props {
  productId: number | string
  stockCount?: number
  className?: string
}

export default function AddToCartButton({ productId, stockCount, className }: Props) {
  const { data: cartItems } = useCart()
  const { mutate: updateCart, isPending: isUpdating } = useUpdateCartItem()
  const { mutate: removeCart, isPending: isRemoving } = useRemoveCartItem()

  const isPending = isUpdating || isRemoving
  const cartItem = cartItems?.find((item) => String(item.id) === String(productId))
  const cartCount = cartItem?.count ?? 0
  const maxCount = stockCount ?? 1
  const atMax = cartCount >= maxCount

  const add = () => updateCart({ productId: Number(productId), count: 1 })
  const increment = () => {
    if (atMax) return
    updateCart({ productId: Number(productId), count: cartCount + 1 })
  }
  const decrement = () => {
    if (cartCount <= 1) removeCart(Number(productId))
    else updateCart({ productId: Number(productId), count: cartCount - 1 })
  }

  if (!cartItem) {
    return (
      <button className={className} onClick={add} disabled={isPending || maxCount < 1}>
        {isUpdating ? 'Добавляем...' : 'В корзину'}
      </button>
    )
  }

  return (
    <div className={styles.counter}>
      <button className={styles.btn} onClick={decrement} disabled={isRemoving}>−</button>
      <span className={styles.count}>{cartCount}</span>
      <button className={styles.btn} onClick={increment} disabled={isPending || atMax} title={atMax ? `Максимум ${maxCount} шт.` : undefined}>
        +
      </button>
    </div>
  )
}

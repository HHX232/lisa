'use client'
import Footer from '@/components/Main/Footer/Footer'
import Header from '@/components/Main/Header/Header'
import Card from '@/components/Products/Card/Card'
import CurrencySymbol from '@/components/UI/BynIcon/CurrencySymbol'
import TextInputUI from '@/components/UI/inputs/TextInputUI/TextInputUI'
import { useCart, useRemoveCartItem, useUpdateCartItem } from '@/hooks/cart.hooks'
import { useCreateOrder } from '@/hooks/order.hooks'
import { CartItemCard } from '@/types/Cart.types'
import { useState } from 'react'
import styles from './BasketPage.module.scss'

function CartRow({ item }: { item: CartItemCard }) {
  const { mutate: update, isPending: isUpdating } = useUpdateCartItem()
  const { mutate: remove, isPending: isRemoving } = useRemoveCartItem()

  const isPending = isUpdating || isRemoving

  const decrement = () => {
    if ((item.count ?? 0) <= 1) remove(item.id)
    else update({ productId: item.id, count: (item.count ?? 0) - 1 })
  }

  const atMax = item.count >= item.stockCount

  return (
    <div className={styles.row}>
      <div className={styles.cardPadding}>
        <Card {...item} showCardTitle useFillImage={false} />
      </div>

      <div className={styles.rowFooter}>
        <div className={styles.counter}>
          <button className={styles.counterBtn} onClick={decrement} disabled={isPending}>−</button>
          <span className={styles.counterValue}>{item.count}</span>
          <button
            className={styles.counterBtn}
            onClick={() => update({ productId: item.id, count: (item.count ?? 0) + 1 })}
            disabled={isPending || atMax}
            title={atMax ? `Максимум ${item.stockCount} шт.` : undefined}
          >
            +
          </button>
        </div>

        <span className={styles.rowTotal}>
          {(item.currentPrice * item.count).toLocaleString('ru-RU')}<CurrencySymbol size={18} />
        </span>

        <button className={styles.removeBtn} onClick={() => remove(item.id)} disabled={isRemoving}>
          Удалить
        </button>
      </div>
    </div>
  )
}

export default function BasketPage() {
  const { data: items, isLoading, isError } = useCart()
  const { mutate: createOrder, isPending: isOrdering } = useCreateOrder()
  const [address, setAddress] = useState('')

  const total = items?.reduce((sum, item) => sum + item.currentPrice * (item.count ?? 0), 0) ?? 0

  const handleOrder = () => {
    if (!items?.length) return
    createOrder({
      items: items.map((item) => ({ productId: item.id, count: item.count ?? 0 })),
      address: address.trim() || undefined,
    })
  }

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={`${styles.inner} container`}>
          <h1 className={styles.title}>Корзина</h1>

          {isLoading && (
            <div className={styles.state}>
              <div className={styles.skeleton} />
              <div className={styles.skeleton} />
              <div className={styles.skeleton} />
            </div>
          )}

          {isError && <p className={styles.stateText}>Не удалось загрузить корзину</p>}

          {!isLoading && !isError && items?.length === 0 && (
            <div className={styles.state}>
              <p className={styles.emptyTitle}>Корзина пуста</p>
              <p className={styles.stateText}>Добавьте товары из каталога</p>
            </div>
          )}

          {!isLoading && items && items.length > 0 && (
            <div className={styles.layout}>
              <div className={styles.list}>
                {items.map((item) => (
                  <CartRow key={item.id} item={item} />
                ))}
              </div>

              <div className={styles.summary}>
                <h2 className={styles.summaryTitle}>Итого</h2>
                <div className={styles.summaryRow}>
                  <span>Товаров</span>
                  <span>{items.length}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Сумма</span>
                  <span>{total.toLocaleString('ru-RU')}<CurrencySymbol size={18} /></span>
                </div>
                <TextInputUI
                  placeholder="Адрес доставки (необязательно)"
                  currentValue={address}
                  onSetValue={setAddress}
                />
                <button className={styles.orderBtn} onClick={handleOrder} disabled={isOrdering}>
                  {isOrdering ? 'Оформляем...' : 'Оформить заказ'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

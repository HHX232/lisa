"use client";
import Footer from "@/components/Main/Footer/Footer";
import Header from "@/components/Main/Header/Header";
import Card from "@/components/Products/Card/Card";
import CurrencySymbol from "@/components/UI/BynIcon/CurrencySymbol";
import TextInputUI from "@/components/UI/inputs/TextInputUI/TextInputUI";
import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/hooks/cart.hooks";
import { useCreateOrder } from "@/hooks/order.hooks";
import { CartItemCard } from "@/types/Cart.types";
import { useState } from "react";
import styles from "./BasketPage.module.scss";
import { toast } from "sonner";

function CartRow({
  onToggleSelect,
  item,
  isSelected,
}: {
  item: CartItemCard;
  onToggleSelect: () => void;
  isSelected: boolean;
}) {
  const { mutate: update, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: remove, isPending: isRemoving } = useRemoveCartItem();

  const isPending = isUpdating || isRemoving;

  const decrement = () => {
    if ((item.count ?? 0) <= 1) remove(item.id);
    else update({ productId: item.id, count: (item.count ?? 0) - 1 });
  };

  const atMax = item.count >= item.stockCount;

  return (
    <div className={styles.row}>
      <div className={styles.cardPadding}>
        <div className={styles.checkboxWrap}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={isSelected}
            onChange={onToggleSelect}
            title="Выбрать для заказа"
          />
        </div>
        <Card {...item} showCardTitle useFillImage={false} />
      </div>

      <div className={styles.rowFooter}>
        <div className={styles.counter}>
          <button
            className={styles.counterBtn}
            onClick={decrement}
            disabled={isPending}
          >
            −
          </button>
          <span className={styles.counterValue}>{item.count}</span>
          <button
            className={styles.counterBtn}
            onClick={() =>
              update({ productId: item.id, count: (item.count ?? 0) + 1 })
            }
            disabled={isPending || atMax}
            title={atMax ? `Максимум ${item.stockCount} шт.` : undefined}
          >
            +
          </button>
        </div>

        <span className={styles.rowTotal}>
          {(item.currentPrice * item.count).toLocaleString("ru-RU")}
          <CurrencySymbol size={18} />
        </span>

        <button
          className={styles.removeBtn}
          onClick={() => remove(item.id)}
          disabled={isRemoving}
        >
          Удалить
        </button>
      </div>
    </div>
  );
}

export default function BasketPage() {
  const { data: items, isLoading, isError } = useCart();
const { mutate: createOrder, isPending: isOrdering } = useCreateOrder({
  onSuccess: () => {
    setOrderSuccess(true)
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (error: any) => {
    const message = error?.response?.data?.message || 'Ошибка при оформлении заказа'
    toast.error(message)
  },
})
  // const [address, setAddress] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [orderSuccess, setOrderSuccess] = useState(false);

  const itemsToOrder =
    items?.filter((item) => selected.size === 0 || selected.has(item.id)) ?? [];

  const total = itemsToOrder.reduce(
    (sum, item) => sum + item.currentPrice * (item.count ?? 0),
    0,
  );

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleOrder = () => {
    if (!itemsToOrder.length) return;
    createOrder({
      items: itemsToOrder.map((item) => ({
        productId: item.id,
        count: item.count ?? 0,
      })),
      address:  undefined,
    });
  };

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

          {isError && (
            <p className={styles.stateText}>Не удалось загрузить корзину</p>
          )}

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
                  <CartRow
                    key={item.id}
                    item={item}
                    isSelected={selected.has(item.id)}
                    onToggleSelect={() => toggleSelect(item.id)}
                  />
                ))}
              </div>

              <div className={styles.summary}>
                <h2 className={styles.summaryTitle}>Итого</h2>
                <div className={styles.summaryRow}>
                  <span>Товаров</span>
                  <span>
                    {itemsToOrder.length}
                    {selected.size > 0 && (
                      <span className={styles.selectedHint}>
                        {" "}
                        из {items?.length}
                      </span>
                    )}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Сумма</span>
                  <span>
                    {total.toLocaleString("ru-RU")}
                    <CurrencySymbol size={18} />
                  </span>
                </div>
                {/* <TextInputUI
                  placeholder="Адрес доставки (необязательно)"
                  currentValue={address}
                  onSetValue={setAddress}
                /> */}
                <button
                  className={styles.orderBtn}
                  onClick={handleOrder}
                  disabled={isOrdering}
                >
                  {isOrdering ? "Бронируем..." : "Бронировать"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {orderSuccess && (
        <div
          className={styles.successOverlay}
          onClick={() => setOrderSuccess(false)}
        >
          <div
            className={styles.successModal}
            onClick={(e) => e.stopPropagation()}
          >
            <p className={styles.successIcon}>✦</p>
            <p className={styles.successText}>
              Ваша заявка принята в обработку. Уточняем наличие, с Вами свяжется
              менеджер. Прекрасного Вам дня!
            </p>
            <button
              className={styles.successBtn}
              onClick={() => setOrderSuccess(false)}
            >
              Хорошо
            </button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

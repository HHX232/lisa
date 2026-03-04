'use client'
import { Product } from '@/types/Product.types'
import cn from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Card.module.scss'



function Card({
  id,
  title,
  isComplect,
  currentPrice,
  originalPrice,
  sale,
  description,
  imageUrl,
  useFillImage = false,
  isSouvenir,
  showCardTitle = true
}: Product) {
  return (
    <div className={styles.card}>
      <Link href={`/card/${id}`}>
      <div className={cn(styles.imageContainer, useFillImage && styles.fillImage)}>
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={300}
          style={{ width: '100%', height: 'auto' }}
        />
        {isComplect && <span className={styles.complectBadge}>
          <Image className={styles.ring} src="/ring.svg" alt="ring" width={15} height={15} />
          Комплект</span>}
      </div>

      <div className={styles.content}>
       {showCardTitle && <h3 className={styles.title}>{title}</h3>}

        <div className={styles.priceRow}>
          <div className={styles.priceGroup}>
            <span className={styles.currentPrice}>{currentPrice.toLocaleString('ru-RU')} ₽</span>
            {originalPrice && (
              <span className={styles.originalPrice}>
                {originalPrice.toLocaleString('ru-RU')} ₽
              </span>
            )}
          </div>
          {sale && <span className={styles.sale}>-{sale}%</span>}
        </div>

        {description && <p className={styles.description}>{description}</p>}
      </div>
      </Link>
    </div>
  )
}

export default Card
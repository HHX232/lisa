import { Product } from '@/types/Product.types'
import Image from 'next/image'
import Link from 'next/link'
import styles from './ComplectsPreview.module.scss'

function ComplectsPreview({ products }: { products: Product[] }) {
  const items = products.slice(0, 4)

  if (items.length === 0) return null

  return (
    <div className={`${styles.complectsPreview} container`}>
      <h1>Выбери свой идеальный комплект</h1>

      <div className={styles.items_box}>
        {items.map(product => (
          <Link key={product.id} href={`/card/${product.id}`} className={styles.complectPreview}>
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 600px) 50vw, 25vw"
            />
          </Link>
        ))}
      </div>

      <Link href="/catalog?isComplect=true" className={styles.button_show_all}>
        Посмотреть все комплекты
      </Link>
    </div>
  )
}

export default ComplectsPreview

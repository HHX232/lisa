'use client'

import Card from '@/components/Products/Card/Card'
import Modal from '@/components/UI/Modal/Modal'
import { Product } from '@/types/Product.types'
import { useState } from 'react'
import styles from './ComplectModal.module.scss'

interface Props {
  currentProduct: Product
  complectItems: Product[]
  buttonClassName?: string
}

export default function ComplectModal({ currentProduct, complectItems, buttonClassName }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const allItems = [currentProduct, ...complectItems]

  return (
    <>
      <button className={buttonClassName} onClick={() => setIsOpen(true)}>
        Смотреть комплект
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Комплект">
        <div className={styles.grid}>
          {allItems.map((item) => (
            <Card key={item.id} {...item} showCardTitle useFillImage={false} />
          ))}
        </div>
      </Modal>
    </>
  )
}

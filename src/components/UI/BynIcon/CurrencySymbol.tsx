'use client'

import { useCurrency } from '@/hooks/useCurrency'
import Image from 'next/image'

interface Props {
  size?: number
}

export default function CurrencySymbol({ size = 14 }: Props) {
  const currency = useCurrency()

  if (currency === 'RUB') {
    return <span style={{ fontSize: size, lineHeight: 1, verticalAlign: 'middle', marginLeft: 2 }}>₽</span>
  }

  return (
    <Image
      src="/500px-BYN_symbol.svg.png"
      alt="р."
      width={size}
      height={size}
      style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 2 }}
    />
  )
}

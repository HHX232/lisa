import Image from 'next/image'

interface Props {
  size?: number
  className?: string
}

export default function BynIcon({ size = 14, className }: Props) {
  return (
    <Image
      src="/500px-BYN_symbol.svg.png"
      alt="р."
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 2 }}
    />
  )
}

import cn from 'clsx'
import Image from "next/image"
import Link from 'next/link'
import styles from './Logo.module.scss'
const logo = '/logos/logo.svg'
interface LogoProps {
  extraClassName?: string
}

function Logo({extraClassName}: LogoProps) {
  return (
   <Link href="/">
    <Image className={cn(styles.main, extraClassName)} src={logo} alt="Logo" width={152} height={117}/>
   </Link>
  )
}

export default Logo
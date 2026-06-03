import Footer from '@/components/Main/Footer/Footer'
import Header from '@/components/Main/Header/Header'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import styles from './not-found.module.css'

export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.visual}>
            <span className={styles.four}>4</span>
            <div className={styles.logoWrap}>
              <Image src="/logos/Logo.svg" alt="Septaria" width={120} height={93} />
            </div>
            <span className={styles.four}>4</span>
          </div>

          <h1 className={styles.title}>Страница не найдена</h1>
          <p className={styles.desc}>
            Возможно, она была перемещена или удалена.<br />
            Найдите то, что искали в нашем каталоге.
          </p>

          <div className={styles.actions}>
            <Link href="/" className={styles.btnPrimary}>На главную</Link>
            <Link href="/catalog" className={styles.btnSecondary}>Перейти в каталог</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

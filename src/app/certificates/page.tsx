import Footer from '@/components/Main/Footer/Footer'
import Header from '@/components/Main/Header/Header'
import type { Metadata } from 'next'
import NextImage from 'next/image'
import styles from './certificates.module.css'

export const metadata: Metadata = {
  title: 'Подарочные сертификаты',
  description: 'Подарочные сертификаты Septaria — идеальный подарок для близких. Выберите номинал от 100 рублей.',
}

interface Certificate {
  id: number
  name: string
  description: string
  price: number
  gradient: string
  imageUrl?: string
}

const CERTIFICATES: Certificate[] = [
  {
    id: 1,
    name: 'Сертификат на 100 рублей',
    description: 'Идеальный старт — позвольте близкому человеку выбрать украшение по душе в любом из наших магазинов.',
    price: 100,
    gradient: 'linear-gradient(135deg, #c9a84c 0%, #f5d78e 50%, #c9a84c 100%)',
  },
  {
    id: 2,
    name: 'Сертификат на 200 рублей',
    description: 'Широкий выбор серебряных украшений с натуральными камнями — кольца, серьги, браслеты и комплекты.',
    price: 200,
    gradient: 'linear-gradient(135deg, #a8c0cc 0%, #dce9ef 50%, #a8c0cc 100%)',
  },
  {
    id: 3,
    name: 'Сертификат на 300 рублей',
    description: 'Премиальный выбор для особенного подарка. Украшения из серебра 925 пробы с уникальными вставками.',
    price: 300,
    gradient: 'linear-gradient(135deg, #b8a9c9 0%, #e0d8ee 50%, #b8a9c9 100%)',
  },
  {
    id: 4,
    name: 'Сертификат на 500 рублей',
    description: 'Роскошный подарок для самых близких. Доступны эксклюзивные изделия и авторские комплекты.',
    price: 500,
    gradient: 'linear-gradient(135deg, #c9a84c 0%, #e8c97a 30%, #fff5cc 60%, #c9a84c 100%)',
  },
]

export default function CertificatesPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={`${styles.inner} container`}>
          <h1 className={styles.pageTitle}>Подарочные сертификаты</h1>
          <p className={styles.pageDesc}>
            Не знаете, какое украшение выбрать? Подарите сертификат — и пусть ваш близкий выберет сам.
            Срок действия сертификата — <strong>3 месяца</strong>. Оплата в магазине.
          </p>

          <div className={styles.grid}>
            {CERTIFICATES.map(cert => (
              <div key={cert.id} className={styles.card}>
                <div
                  className={styles.certImg}
                  style={cert.imageUrl ? undefined : { background: cert.gradient }}
                >
                  {cert.imageUrl ? (
                    <NextImage
                      src={cert.imageUrl}
                      alt={cert.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <>
                      <div className={styles.certLabel}>Septaria</div>
                      <div className={styles.certAmount}>{cert.price} руб.</div>
                      <div className={styles.certSub}>Подарочный сертификат</div>
                    </>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{cert.name}</h2>
                  <p className={styles.cardDesc}>{cert.description}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>{cert.price} руб.</span>
                    <button className={styles.buyBtn}>Купить</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.info}>
            <h2>Как использовать сертификат</h2>
            <ol>
              <li>Оплатите сертификат онлайн на сайте или в одном из наших магазинов.</li>
              <li>Получите бумажный сертификат с уникальным кодом.</li>
              <li>Предъявите сертификат при покупке в магазине «Серебро» или салоне «Золото».</li>
            </ol>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

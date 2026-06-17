'use client'

import Footer from '@/components/Main/Footer/Footer'
import Header from '@/components/Main/Header/Header'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import styles from './locations.module.scss'

const MAP_SRC =
  'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Ae4a3b6d1f6ffef7cce37c4ef7b13f8fae089d8818ef958c37969502dfb99173d&width=900&height=520&lang=ru_RU&scroll=true'

const SOCIALS = [
  { href: 'https://www.instagram.com/serebrotut?igsh=MTJoYTdjNDM1M2V5Yw==', icon: '/social/insta.svg', label: 'Instagram', name: '@serebrotut' },
  { href: 'https://t.me/serebro925tut', icon: '/social/tg.svg', label: 'Telegram', name: '@serebro925tut' },
  { href: 'https://invite.viber.com/?g2=AQA23uQvQU%2Buo0p%2BQbFRMXr1kgN5NB%2FdUx0pfGp1iqiwNxDbXmvdOxdgmyHFdZOo', icon: '/social/viber.svg', label: 'Viber', name: 'serebrotut' },
  { href: 'https://www.tiktok.com/@serebrotut?_r=1&_t=ZS-97FeO7gfQkG', icon: '/social/tiktok.svg', label: 'TikTok', name: '@serebrotut' },
  { href: 'https://vk.com/id473561014', icon: '/social/wk.svg', label: 'ВКонтакте', name: 'serebrotut' },
]

function YandexMap() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container || container.querySelector('script')) return
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.charset = 'utf-8'
    script.async = true
    script.src = MAP_SRC
    container.appendChild(script)
  }, [])

  return <div ref={ref} className={styles.mapContainer} />
}

const SHOPS = [
  {
    id: 'silver',
    name: 'Магазин «СЕРЕБРО»',
    address: 'г. Минск, ул. Козлова, д. 6',
    metro: 'ст. метро «Площадь Победы»',
    hours: [
      { days: 'Пн–Пт', time: '11:00–19:00' },
      { days: 'Сб', time: '11:00–18:00' },
      { days: 'Вс', time: 'выходной' },
    ],
  },
  {
    id: 'gold',
    name: 'Салон «ЗОЛОТО»',
    address: 'г. Минск, ул. Сурганова, д. 16',
    metro: 'ст. метро «Академия наук»',
    hours: [
      { days: 'Пн–Пт', time: '11:00–19:00' },
      { days: 'Сб–Вс', time: '11:00–18:00' },
    ],
  },
]

export default function LocationsPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>

        <div className={styles.hero}>
          <div className={`${styles.heroInner} container`}>
            <h1 className={styles.heroTitle}>Наши магазины</h1>
            <p className={styles.heroSub}>Приходите к нам — рады видеть вас в любое удобное время</p>
          </div>
          <div className={styles.heroDivider} />
        </div>

        <div className={`${styles.inner} container`}>
          <div className={styles.layout}>

            <div className={styles.mapWrap}>
              <YandexMap />
            </div>

            <aside className={styles.aside}>
              {SHOPS.map(shop => (
                <div key={shop.id} className={`${styles.shopCard} ${styles[`shopCard_${shop.id}`]}`}>
                  <div className={styles.shopIconWrap}>
                    {shop.id === 'silver' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M12 3l2.47 5.02L20 9.27l-4 3.9.94 5.5L12 16.1l-4.94 2.6.94-5.5-4-3.9 5.53-.25L12 3z"
                          stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  <div className={styles.shopBody}>
                    <h2 className={styles.shopName}>{shop.name}</h2>

                    <div className={styles.shopDetail}>
                      <svg className={styles.detailSvg} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" fill="currentColor" />
                      </svg>
                      <span>{shop.address}</span>
                    </div>

                    <div className={styles.shopDetail}>
                      <svg className={styles.detailSvg} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span>{shop.metro}</span>
                    </div>

                    <table className={styles.hoursTable}>
                      <tbody>
                        {shop.hours.map(h => (
                          <tr key={h.days}>
                            <td className={styles.hoursDay}>{h.days}</td>
                            <td className={`${styles.hoursTime} ${h.time === 'выходной' ? styles.hoursOff : ''}`}>
                              {h.time}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              <div className={styles.contactCard}>
                <p className={styles.contactLabel}>Позвоните нам</p>
                <a href="tel:+375445381187" className={styles.contactPhone}>+375 44 538-11-87</a>
                <p className={styles.contactNote}>Ответим на любые вопросы</p>
              </div>
            </aside>

          </div>
        </div>

        <div className={`${styles.contactsSection} container`}>
          <h2 className={styles.contactsTitle}>Свяжитесь с нами</h2>
          <div className={styles.contactsGrid}>
            <div className={styles.contactsItem}>
              <span className={styles.contactsItemLabel}>Телефон</span>
              <a href="tel:+375445381187" className={styles.contactsItemValue}>+375 44 538-11-87</a>
            </div>
            {SOCIALS.map(s => (
              <Link
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialRow}
              >
                <Image src={s.icon} alt={s.label} width={22} height={22} className={styles.socialIcon} />
                <span className={styles.socialLabel}>{s.label}</span>
                <span className={styles.socialName}>{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

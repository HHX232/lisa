import Logo from "@/components/Logo/Logo";
import { categories, categoriesLinks } from "@/constants/header.constants";
import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.scss";

const instaSvg = "/social/insta.svg";
const telegramSvg = "/social/tg.svg";
const viberSvg = "/social/viber.svg";
const tiktokSvg = "/social/tiktok.svg";
const wkSvg = "/social/wk.svg";

function Footer() {
  return (
    <div className={styles.main}>
      <div className={`${styles.footer_box} container`}>

        {/* ЛЕВЫЙ БЛОК: лого + каталог вверху, лицензии внизу */}
        <div className={styles.left_block}>
          <div className={styles.top_row}>
            <div className={styles.logo_box}>
              <Logo extraClassName={styles.extra_logo} />
              <p>тел. +375 44 538-11-87</p>
            </div>
            <div className={styles.catalog_box}>
              <p className={styles.catalog_title}>Каталог</p>
              <ul className={styles.catalog_list}>
                {categories.map((cat, i) => (
                  <li key={i}>
                    <Link href={categoriesLinks[i]}>{cat}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.legal_block}>
            <p>
              ООО «МОНОСТИНЭКС» 220012, г. Минск, ул. Сурганова, д. 16, пом. 3Н (юрид., почт., факт.)
            </p>
            <p>
              Лицензия на деятельность, связанную с драгоценными металлами и
              драгоценными камнями № 02200/21-00630<br />
              Номер лицензии в ЕРЛ: 24200000014711
            </p>
            <p>
              Свидетельство о регистрации выдано 03.01.2025 г. Мингорисполкомом.<br />
              УНП 101453895.
            </p>
            <p>№ в торговом реестре 193235 от 06.02.2015г</p>
          </div>
        </div>

        {/* ПРАВЫЙ БЛОК: магазины + соцсети + информация */}
        <div className={styles.right_block}>
          <div className={styles.our_shops}>
            <div className={styles.section_title}>Наши магазины</div>
            <Link href="/locations" className={styles.shop_link}>
              <p className={styles.our_text}>
                <strong>Магазин &quot;СЕРЕБРО&quot;</strong><br />
                г.Минск, ул. Козлова, 6 ст.метро пл. Победы<br />
                <strong>Время работы:</strong><br />
                пн-пт с 11 до 19, сб с 11 до 18, воскресенье — выходной
              </p>
            </Link>
            <Link href="/locations" className={styles.shop_link}>
              <p className={styles.our_text}>
                салон &quot;ЗОЛОТО&quot;<br />
                г. Минск, ул. Сурганова,16<br />
                ст.метро Академия наук<br />
                Время работы пн-пт с 11 до 19, сб, вс с 11 до 18
              </p>
            </Link>
          </div>

          <div className={styles.our_social}>
            <p className={styles.section_title}>МЫ в сети</p>
            <div className={styles.social_links}>
              <Link href="https://www.instagram.com/serebrotut?igsh=MTJoYTdjNDM1M2V5Yw==" target="_blank" rel="noopener noreferrer">
                <Image width={25} height={25} src={instaSvg} alt="Instagram" />
              </Link>
              <Link href="https://t.me/serebro925tut" target="_blank" rel="noopener noreferrer">
                <Image width={25} height={25} src={telegramSvg} alt="Telegram" />
              </Link>
              <Link href="https://invite.viber.com/?g2=AQA23uQvQU%2Buo0p%2BQbFRMXr1kgN5NB%2FdUx0pfGp1iqiwNxDbXmvdOxdgmyHFdZOo" target="_blank" rel="noopener noreferrer">
                <Image width={25} height={25} src={viberSvg} alt="Viber" />
              </Link>
              <Link href="https://www.tiktok.com/@serebrotut?_r=1&_t=ZS-97FeO7gfQkG" target="_blank" rel="noopener noreferrer">
                <Image width={25} height={25} src={tiktokSvg} alt="TikTok" />
              </Link>
              <Link href="https://vk.com/id473561014" target="_blank" rel="noopener noreferrer">
                <Image width={25} height={25} src={wkSvg} alt="ВКонтакте" />
              </Link>
            </div>
            <Link className={styles.social_link} href="/privacy">
              Политика обработки персональных данных
            </Link>
            <Link className={styles.social_link} href="/locations">
              Контакты
            </Link>
          </div>

          <div className={styles.other}>
            <p className={styles.section_title}>Информация</p>
            <Link href="/locations" className={styles.info_link}>Наши магазины</Link>
            <Link href="/payment-delivery" className={styles.info_link}>Оплата и доставка</Link>
            <Link href="/care" className={styles.info_link}>Уход за изделиями</Link>
            <Link href="/reviews" className={styles.info_link}>Отзывы</Link>
            <Link href="/certificates" className={styles.info_link}>Подарочные сертификаты</Link>
            <Link href="/warranty" className={styles.info_link}>Гарантия качества</Link>
            <Link href="/returns" className={styles.info_link}>Возврат товара</Link>
            <Link href="/offer" className={styles.info_link}>Договор (Публичная оферта)</Link>
            <Link href="/promo-rules" className={styles.info_link}>Правила проведения акций и скидок</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Footer;

import Logo from "@/components/Logo/Logo";
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
        <div className={styles.base_info}>
          <div className={styles.logo_box}>
            <Logo extraClassName={styles.extra_logo} />
            <p>
              тел 360-76-10, <br />
              факс 361-65-76, <br />
              моб +375 29 299-56-18
            </p>
          </div>
          <div className={styles.catalog_box}>
            <p className={styles.catalog_title}>Каталог</p>
            <ul className={styles.catalog_list}>
              <li><Link href="/catalog/rings">Кольца</Link></li>
              <li><Link href="/catalog/inserts">Вставки</Link></li>
              <li><Link href="/catalog/earrings">Серьги</Link></li>
              <li><Link href="/catalog/bijouterie">Бижутерия</Link></li>
              <li><Link href="/catalog/sets">Комплекты</Link></li>
              <li><Link href="/catalog/souvenirs">Сувениры</Link></li>
              <li>
                <Link href="/catalog/certificates">
                  Подарочные <br />
                  сертификаты
                </Link>
              </li>
              <li><Link href="/catalog/brooches">Броши</Link></li>
              <li><Link href="/catalog/pendants">Подвески</Link></li>
            </ul>
          </div>
          <div className={styles.base_text_box}>
          <p className={styles.base_text}>
            ООО «МОНОСТИНЭКС» 220012, <br />
            г. Минск, ул. Сурганова, д. 16, пом. 3Н (юрид., почт., факт.)
          </p>
          <p className={styles.base_text}>
            Лицензия на деятельность, связанную с драгоценными металлами и
            драгоценными камнями № 02200/21-00630 <br /> Номер лицензии в ЕРЛ:
            24200000014711
          </p>
          </div>
        </div>
        <div className={styles.our}>
          <div className={styles.our_shops}>
            <div className={styles.title}>Наши магазины</div>
            <p className={`${styles.our_text} ${styles.first_our_text}`}>
              Магазин {"\"СЕРЕБРО\""}
              <br />
              г.Минск, ул. Козлова, 6 ст.метро пл. Победы <br />
              Время работы: пн-пт с 11 до 19, сб с 11 до 18, воскресенье -
              выходной
            </p>
            <p className={styles.our_text}>
              салон {"\"ЗОЛОТО\""} <br />
              г. Минск, ул. Сурганова,16 <br />
              ст.метро Академия наук <br />
              Время работы пн-пт с 11 до 19, сб, вс с 11 до 18
            </p>
          </div>
          <div className={styles.our_social}>
            <p className={styles.social_title}>МЫ в сети</p>
            <div className={styles.social_links}>
              <Link href="https://instagram.com" target="_blank">
                <Image width={25} height={25} src={instaSvg} alt="Instagram" />
              </Link>
              <Link href="https://t.me" target="_blank">
                <Image width={25} height={25} src={telegramSvg} alt="Telegram" />
              </Link>
              <Link href="viber://chat" target="_blank">
                <Image width={25} height={25} src={viberSvg} alt="Viber" />
              </Link>
              <Link href="https://tiktok.com" target="_blank">
                <Image width={25} height={25} src={tiktokSvg} alt="TikTok" />
              </Link>
              <Link href="https://wa.me" target="_blank">
                <Image width={25} height={25} src={wkSvg} alt="WhatsApp" />
              </Link>
            </div>
            <Link  className={styles.social_bottom_link_first} href="/privacy"><div className=""> Политика обработки персональных данных</div></Link>
            <Link className={styles.social_bottom_link} href="/contacts"><div className=""> Контакты</div></Link>
          </div>
          <p className={styles.our_text_bottom}>
            Свидетельство о регистрации выдано 03.01.2025 г. Мингорисполкомом.{" "}
            <br />
            УНП 101453895.
          </p>
          <p className={styles.our_text_bottom}>№ в торговом реестре 193235 от 06.02.2015г</p>
        </div>
        <div className={styles.other}>
          <p className={styles.other_title}>Информация</p>
          <Link href="/payment-delivery" className={styles.our_text_link}><div className=""> Оплата и доставка</div></Link>
          <Link href="/news" className={styles.our_text_link}><div className=""> Новости и акции</div></Link>
          <Link href="/care" className={styles.our_text_link}><div className=""> Уход за изделиями</div></Link>
          <Link href="/reviews" className={styles.our_text_link}><div className=""> Отзывы</div></Link>
          <Link href="/certificates" className={styles.our_text_link}><div className=""> Подарочные сертификаты</div></Link>
          <Link href="/faq" className={styles.our_text_link}><div className=""> Популярные вопросы</div></Link>
          <Link href="/warranty" className={styles.our_text_link}><div className=""> Гарантия качества</div></Link>
          <Link href="/returns" className={styles.our_text_link}><div className=""> Возврат товара</div></Link>
          <Link href="/offer" className={styles.our_text_link}>
            Договор <br />
            (Публичная оферта)
          </Link>
          <Link href="/promo-rules" className={styles.our_text_link}><div className=""> Правила проведения акций и скидок</div></Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
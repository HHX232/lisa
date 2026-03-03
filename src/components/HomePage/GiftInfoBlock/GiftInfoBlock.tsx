import Image from "next/image";
import styles from "./GiftInfoBlock.module.scss";
const imageUrl = "/info/gift/gift.png";

function GiftInfoBlock() {
  return (
    <div className={`${styles.giftInfoBlock} container`}>
      <h3 className={`${styles.accent_title} ${styles.mobile_title}`}>
        Хотите чтобы ваш подарок запомнился надолго? <br /> Подарите эмоцию
        выбора
      </h3>
      <Image className={styles.image} width={435} height={335} src={imageUrl} alt="gift" />
      <div className={styles.box}>
      <h3 className={`${styles.accent_title} ${styles.desktop_title}`}>
        Хотите чтобы ваш подарок запомнился надолго? <br /> Подарите эмоцию
        выбора
      </h3>
      <p className={styles.description}>
        Ваш близкий человек сам найдёт украшение своей мечты, <br />а вы станете
        причиной этого открытия. С сертификатом SEPTARIA вы точно попадёте в
        цель.
      </p>
      <button className={styles.button}>Заказать идеальный подарок</button>
      </div>
    </div>
  );
}

export default GiftInfoBlock;

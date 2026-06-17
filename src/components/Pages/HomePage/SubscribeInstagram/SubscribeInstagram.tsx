import Link from 'next/link'
import styles from './SubscribeInstagram.module.scss'

function SubscribeInstagram() {
  return (
    <div className={styles.main}>
      <div className="container">
         <h4 className={styles.subscribe}>Подпишитесь на наш Instagram и получите приятный бонус при покупке товара</h4>
         <Link
           href="https://www.instagram.com/serebrotut?igsh=MTJoYTdjNDM1M2V5Yw=="
           target="_blank"
           rel="noopener noreferrer"
           className={styles.button}
         >
           Перейти в Instagram <strong className={styles.font}>@serebrotut</strong>
         </Link>
      </div>
    </div>
  )
}

export default SubscribeInstagram
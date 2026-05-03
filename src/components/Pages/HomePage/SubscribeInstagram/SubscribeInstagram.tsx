import styles from './SubscribeInstagram.module.scss'

function SubscribeInstagram() {
  return (
    <div className={styles.main}>
      <div className="container">
         <h4 className={styles.subscribe}>Подпишитесь на наш Instagram и получите приятный бонус при покупке товара</h4>
         <button className={styles.button}>Перейти в Instagram</button>
      </div>
    </div>
  )
}

export default SubscribeInstagram
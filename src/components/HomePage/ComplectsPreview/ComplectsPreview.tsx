import Image from 'next/image'
import styles from './ComplectsPreview.module.scss'

type ComplectPreview = {
  id: number
  title?: string
  description?: string
  image: string
}

function ComplectsPreview({previews}: {previews: ComplectPreview[]}) {
  return (
    <div className={`${styles.complectsPreview} container`}>
      <h1>Выбери свой идеальный комплект</h1>
      <div className={`${styles.items_box}`}>
      {previews?.map((preview, i) => {
        if(i >= 4) return

        return  <div className={styles.complectPreview} key={preview.id}>
          <Image className={styles.complectPreviewImage} src={preview.image} alt={preview.title || ''} width={250} height={250} />
          {/* {preview.title && <h2>{preview.title}</h2>}
          {preview.description && <p>{preview.description}</p>} */}
        </div>
      })}
      </div>
      {previews.length >= 4 && <button className={styles.button_show_all}>Все комплекты</button>}
    </div>
  )
}

export default ComplectsPreview
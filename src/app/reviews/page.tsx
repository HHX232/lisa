import Footer from '@/components/Main/Footer/Footer'
import Header from '@/components/Main/Header/Header'
import SiteReviews from '@/components/Pages/SiteReviews/SiteReviews'

export const metadata = { title: 'Отзывы о нас' }

export default function ReviewsPage() {
  return (
    <>
      <Header />
      <main className="container" style={{ marginTop: 60, marginBottom: 80 }}>
        <h1 style={{ fontSize: 36, fontWeight: 400, marginBottom: 12, color: '#0d1b2e' }}>
          Отзывы о нас
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(13, 27, 46, 0.6)', marginBottom: 32, maxWidth: 640 }}>
          Нам важно ваше мнение! Расскажите, как прошёл ваш опыт покупки — это поможет
          нам стать лучше, а другим покупателям — сделать правильный выбор.
        </p>
        <SiteReviews />
      </main>
      <Footer />
    </>
  )
}

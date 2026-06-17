import Footer from '@/components/Main/Footer/Footer'
import Header from '@/components/Main/Header/Header'
import AllReviews from '@/components/Pages/AllReviews/AllReviews'

export const metadata = { title: 'Все отзывы' }

export default function ReviewsPage() {
  return (
    <>
      <Header />
      <main className="container" style={{ marginTop: 60, marginBottom: 80 }}>
        <h1 style={{ fontSize: 36, fontWeight: 400, marginBottom: 32, color: '#0d1b2e' }}>
          Все отзывы
        </h1>
        <AllReviews />
      </main>
      <Footer />
    </>
  )
}

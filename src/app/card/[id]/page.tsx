import type { Metadata } from 'next'
import CardPageComponent from "@/_pages/CardPage/CardPage";
import productService from "@/api/services/productService.service";
import Footer from "@/components/Main/Footer/Footer";
import Header from "@/components/Main/Header/Header";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://septaria.by'
const SITE_NAME = 'Septaria'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data } = await productService.getProductById(id)

  if (!data) {
    return { title: 'Товар не найден | Septaria' }
  }

  const title = `${data.title} | ${SITE_NAME}`
  const description = data.description?.slice(0, 160) || `Купить ${data.title} в интернет-магазине ${SITE_NAME}`
  const image = data.images?.[0]?.url ?? data.imageUrl
  const url = `${SITE_URL}/card/${id}`
  const price = data.currentPrice
  const currency = data.currency === 'BYN' ? 'BYR' : data.currency ?? 'BYR'

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: 'ru_RU',
      images: image ? [{ url: image, alt: data.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
    other: {
      'product:price:amount': String(price),
      'product:price:currency': currency,
    },
  }
}

async function CardPage({ params }: Props) {
  const { id } = await params
  const { data } = await productService.getProductById(id)

  if (!data) return <div>Товар не найден</div>

  const image = data.images?.[0]?.url ?? data.imageUrl
  const url = `${SITE_URL}/card/${id}`
  const currency = data.currency ?? 'BYN'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.title,
    description: data.description || undefined,
    image: data.images?.map(i => i.url).filter(Boolean) ?? (image ? [image] : []),
    url,
    sku: String(data.id),
    category: data.category || undefined,
    offers: {
      '@type': 'Offer',
      url,
      price: data.currentPrice,
      priceCurrency: currency,
      availability: (data.count ?? 1) > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
    ...(data.sale > 0 && {
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: data.currentPrice,
        highPrice: data.originalPrice ?? data.currentPrice,
        priceCurrency: currency,
        offerCount: 1,
        offers: [{
          '@type': 'Offer',
          url,
          price: data.currentPrice,
          priceCurrency: currency,
          availability: (data.count ?? 1) > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        }],
      },
    }),
    ...(data.characteristics?.length > 0 && {
      additionalProperty: data.characteristics.map(c => ({
        '@type': 'PropertyValue',
        name: c.name,
        value: c.value,
      })),
    }),
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <CardPageComponent
        title={data.title}
        id={id}
        currentPrice={`${data.currentPrice} р`}
        originalPrice={data.originalPrice ? `${data.originalPrice} р` : undefined}
        sale={data.sale ? `-${data.sale}%` : undefined}
        isComplect={data.isComplect}
        description={data.description}
        fullDescription={data.fullDescription}
        images={data.images.map(el => el.url)}
        stores={data.inShops}
        characteristics={data.characteristics}
        stockCount={data.quantityInStock ?? data.count ?? 1}
        complectItems={data.complectItems ?? []}
        currentProduct={{
          id: data.id,
          title: data.title,
          isComplect: data.isComplect,
          currentPrice: data.currentPrice,
          originalPrice: data.originalPrice,
          sale: data.sale,
          description: data.description,
          imageUrl: data.imageUrl,
          useFillImage: data.useFillImage,
          isSouvenir: data.isSouvenir,
        }}
      />
      <Footer />
    </>
  )
}

export default CardPage

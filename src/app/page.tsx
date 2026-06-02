import HomePage from "@/_pages/HomePage/HomePage";
import advertisementService from "@/api/services/add.service";
import productService from "@/api/services/productService.service";
import type { Metadata } from 'next'

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: 'Septaria — ювелирный магазин',
  },
  description: 'Ювелирный интернет-магазин Septaria. Украшения из серебра с натуральными камнями: кольца, серьги, браслеты, комплекты. Доставка по Беларуси.',
  openGraph: {
    title: 'Septaria — ювелирный магазин',
    description: 'Украшения из серебра с натуральными камнями. Кольца, серьги, браслеты, комплекты.',
    type: 'website',
  },
};

export default async function Home() {
  console.log('[Home] API URL:', process.env.NEXT_PUBLIC_API_URL);

  const { data } = await advertisementService.getAdvertisements();

  const productsRes = await productService.getProducts();
  console.log('[Home] products response:', JSON.stringify(productsRes));
  const { data: products, error } = productsRes;
  if (error) console.error('[Home] products error:', error);

  const complectRes = await productService.getProducts({ isComplect: true });
  const { data: complect } = complectRes;

  const souvenirsRes = await productService.getProducts({ isSouvenir: true, size: 10 });
  const { data: souvenirs } = souvenirsRes;

  return (
    <HomePage
      complect={complect?.content || []}
      souvenirs={souvenirs?.content || []}
      addSlides={data || []}
      products={products?.content || []}
    />
  );
}

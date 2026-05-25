import HomePage from "@/_pages/HomePage/HomePage";
import advertisementService from "@/api/services/add.service";
import productService from "@/api/services/productService.service";
export const dynamic = "force-dynamic";

export default async function Home() {
  console.log('[Home] API URL:', process.env.NEXT_PUBLIC_API_URL);

  const { data } = await advertisementService.getAdvertisements();

  const productsRes = await productService.getProducts();
  console.log('[Home] products response:', JSON.stringify(productsRes));
  const { data: products, error } = productsRes;
  if (error) console.error('[Home] products error:', error);

  const complectRes = await productService.getProducts({ isComplect: true });
  console.log('[Home] complect response:', JSON.stringify(complectRes));
  const { data: complect } = complectRes;

  const souvenirsRes = await productService.getProducts({ isSouvenir: true });
  console.log('[Home] souvenirs response:', JSON.stringify(souvenirsRes));
  const { data: souvenirs } = souvenirsRes;

  return (
    <HomePage
      souvenirs={souvenirs?.content || []}
      complect={complect?.content || []}
      addSlides={data || []}
      products={products?.content || []}
    />
  );
}

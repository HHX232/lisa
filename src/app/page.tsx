import HomePage from "@/_pages/HomePage/HomePage";
import advertisementService from "@/api/services/add.service";
import productService from "@/api/services/productService.service";
export const dynamic = 'force-dynamic';

export default async function Home() {
  const {data} = await advertisementService.getAdvertisements()
  const {data: products} = await productService.getProducts()
  console.log('products', products)
  return <HomePage mainSlides={data || []} decorSlides={products?.content || []}/>
}

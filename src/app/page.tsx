import advertisementService from "@/api/services/add.service";
import productService from "@/api/services/productService.service";
import HomePage from "@/pages/HomePage/HomePage";

export default async function Home() {
  const {data} = await advertisementService.getAdvertisements()
  const {data: products} = await productService.getProducts()
  console.log('products', products)
  return <HomePage mainSlides={data || []} decorSlides={products?.content || []}/>
}

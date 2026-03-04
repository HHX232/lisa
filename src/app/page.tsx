import HomePage from "@/_pages/HomePage/HomePage";
import advertisementService from "@/api/services/add.service";
import productService from "@/api/services/productService.service";
export const dynamic = 'force-dynamic';

export default async function Home() {
  const {data} = await advertisementService.getAdvertisements()
  const {data: products} = await productService.getProducts()
  const {data: complect} = await productService.getProducts({isComplect:true})
  const {data: souvenirs} = await productService.getProducts({isSouvenir:true})

  return <HomePage souvenirs={souvenirs?.content || []} complect={complect?.content || []} addSlides={data || []} products={products?.content || []}/>
}

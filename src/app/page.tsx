import HomePage from "@/_pages/HomePage/HomePage";
import { axiosClassic } from "@/api/helpers/api.interceptor";
import advertisementService from "@/api/services/add.service";
import productService from "@/api/services/productService.service";
import stoneCategoryService from "@/api/services/stoneCategory.service";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Septaria — ювелирный магазин",
  },
  description:
    "Ювелирный интернет-магазин Septaria. Украшения из серебра с натуральными камнями: кольца, серьги, браслеты, комплекты. Доставка по Беларуси.",
  openGraph: {
    title: "Septaria — ювелирный магазин",
    description:
      "Украшения из серебра с натуральными камнями. Кольца, серьги, браслеты, комплекты.",
    type: "website",
  },
};

export default async function Home() {
  console.log("[Home] API URL:", process.env.NEXT_PUBLIC_API_URL);

  const { data } = await advertisementService.getAdvertisements();

  const productsRes = await productService.getProducts();
  console.log("[Home] products response:", JSON.stringify(productsRes));
  const { data: products, error } = productsRes;
  if (error) console.error("[Home] products error:", error);

  const complectRes = await productService.getProducts({ isComplect: true });
  const { data: complect } = complectRes;
  const productsNaturalRes = await productService.getProducts({
    isNaturalStone: true,
  });
const advertisementRes = await productService.getProducts({ isAdvertisement: true, size: 100 });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoriesRes = await axiosClassic.get<any[]>('/categories').catch(() => null);
const categories = categoriesRes?.data ?? [];
  const souvenirsRes = await productService.getProducts({
    isSouvenir: true,
    size: 100,
  });
  const { data: souvenirs } = souvenirsRes;

  const stoneCategoriesRes = await stoneCategoryService
    .getStoneCategories()
    .catch(() => null);
  const stoneCategories = stoneCategoriesRes?.data ?? [];

  return (
    <HomePage
      complect={complect?.content || []}
      souvenirs={souvenirs?.content || []}
      addSlides={data || []}
      products={products?.content || []}
      stoneCategories={stoneCategories}
      naturalProducts={productsNaturalRes.data?.content || []}
       advertisementProducts={advertisementRes.data?.content || []}
    categories={categories}
    />
  );
}

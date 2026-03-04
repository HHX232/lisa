import CardPageComponent from "@/_pages/CardPage/CardPage";
import productService from "@/api/services/productService.service";
import Footer from "@/components/Main/Footer/Footer";
import Header from "@/components/Main/Header/Header";

export const cardPageMock = {
  title: "Серебряные серьги с корундами и фианитами",
  currentPrice: "40 р",
  originalPrice: "50 р",
  sale: "-20%",
  isComplect: true,
  pickupText: "Самовывоз из магазина",
  stores: [
    { name: 'Салон "ЗОЛОТО"' },
    { name: 'Магазин "СЕРЕБРО"' },
  ],
  description:
    "Корунд красного цвета - это рубин. Благодаря мощной энергии рубин делает человека независимым от чужого мнения, избавляет от мук сомнений и душевной боли. Люди со сложным характером с его помощью смогут побороть негативные черты, обрести гармонию и баланс. Сильнейшие экстрасенсы и маги носят амулеты с рубином, чтобы аккумулировать свои способности.",
  breadcrumbs: [
    { label: "Дом", href: "/" },
    { label: "Каталог", href: "/catalog" },
    { label: "Серьги", href: "/catalog/earrings" },
  ],
  characters: [
    { label: "Металл", value: "Серебро 925" },
    { label: "Вставка", value: "Корунд, фианит" },
    { label: "Вес", value: "3.2 г" },
    { label: "Длина", value: "3 см" },
    { label: "Артикул", value: "СЕ-10234" },
  ],
};
async function CardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await productService.getProductById(id);
console.log('dataProduct', data)
  if (!data) return <div>Товар не найден</div>;

  return (
    <>
      <Header />
      <CardPageComponent
        title={data.title}
        currentPrice={`${data.currentPrice} р`}
        originalPrice={data.originalPrice ? `${data.originalPrice} р` : undefined}
        sale={data.sale ? `-${data.sale}%` : undefined}
        isComplect={data.isComplect}
        description={data.description}
        fullDescription={data.fullDescription}
        images={data.images.map(el=>el.url)}
        stores={data.inShops}
        characteristics={data.characteristics}
      />
      <Footer />
    </>
  );
}

export default CardPage;

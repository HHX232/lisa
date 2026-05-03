import CardPageComponent from "@/_pages/CardPage/CardPage";
import productService from "@/api/services/productService.service";
import Footer from "@/components/Main/Footer/Footer";
import Header from "@/components/Main/Header/Header";


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
        id={id}
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

import Footer from "@/components/Main/Footer/Footer";
import Header from "@/components/Main/Header/Header";
import ComplectsPreview from "@/components/Pages/HomePage/ComplectsPreview/ComplectsPreview";
import GiftInfoBlock from "@/components/Pages/HomePage/GiftInfoBlock/GiftInfoBlock";
import MainSlider from "@/components/Pages/HomePage/MainSlider/MainSlider";
import PaymentCardSlider from "@/components/Pages/HomePage/PaymentCardSlider/PaymentCardSlider";
import SubscribeInstagram from "@/components/Pages/HomePage/SubscribeInstagram/SubscribeInstagram";
import SliderBigGrid from "@/components/UI/SliderBigGrid/SliderBigGrid";
import SliderLittleGrid from "@/components/UI/SliderLittleGrid/SliderLittleGrid";
import { Advertisement } from "@/types/Advertisement.types";
import { Product } from "@/types/Product.types";

function HomePage({
  addSlides,
  products,
  complect = [],
  souvenirs = [],
}: {
  addSlides: Advertisement[];
  products: Product[];
  complect: Product[];
  souvenirs: Product[];
}) {
  return (
    <>
      <Header />
      <MainSlider slides={addSlides || []} />
      {/* Фильтры */}
      <SliderLittleGrid
        title="Каталог украшений"
        slides={(products || []).map((slide) => ({
          image: slide.imageUrl,
          title: slide.title,
        }))}
      />

      <ComplectsPreview
        previews={(souvenirs.length === 0 ? products : souvenirs).map((el) => {
          return {
            id: el.id,
            image: el.imageUrl,
            description: el.description,
            title: el.title,
          };
        })}
      />
      {/* Фильтры камушков */}
      <SliderLittleGrid
        title="Каталог камней"
        slides={(products || []).map((slide) => ({
          image: slide.imageUrl,
          title: slide.title,
        }))}
      />

      <SubscribeInstagram />
      {/* Супер крутые украшения */}
      <SliderLittleGrid
        title="Эксклюзив для безупречного вкуса"
        slides={(products || []).map((slide) => ({
          image: slide.imageUrl,
          title: slide.title,
        }))}
      />

      <SliderBigGrid
        title="Бижутерия с натуральными камнями"
        useFillImage
        isCardSlider
        slides={complect.map((el) => ({
          image: el.imageUrl,
          title: el.title,
        }))}
        showCardTitle={false}
        cards={(complect || []).map((el) => ({ ...el, useFillImage: true }))}
      />

      <SliderBigGrid
        title="Сувениры"
        useFillImage
        isCardSlider
        slides={(products || []).map((el) => ({
          image: el.imageUrl,
          title: el.title,
        }))}
        showCardTitle={false}
        cards={(products || []).map((el) => ({ ...el, useFillImage: true }))}
      />

      <GiftInfoBlock />
      <PaymentCardSlider/>
      <Footer />
    </>
  );
}

export default HomePage;

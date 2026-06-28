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
import { StoneCategory } from "@/types/StoneCategory.types";
import styles from './HomePage.module.scss'
function HomePage({
  addSlides,
  products,
  complect = [],
  souvenirs = [],
  stoneCategories = [],
  naturalProducts = [],
  advertisementProducts = [],
  categories = [],
}: {
  addSlides: Advertisement[];
  products: Product[];
  complect: Product[];
  souvenirs: Product[];
  stoneCategories: StoneCategory[];
  naturalProducts: Product[];
  advertisementProducts: Product[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any[];
}) {
  return (
    <>
      <Header />
      <MainSlider slides={addSlides || []} />
      {/* Фильтры */}
      <SliderLittleGrid
      extraClass={styles.extra_style_grid}
        title="Каталог украшений"
        slides={categories.map((cat) => ({
          image: cat.preview,
          title: cat.label,
          href: `/catalog?category=${cat.slug}`,
        }))}
      />

      <ComplectsPreview products={complect} />
      {/* Фильтры камушков */}
      <SliderLittleGrid
        title="Каталог камней"
        subtitle={[
          "Натуральные камни, каждый — со своим характером",
          "Выберите камень и посмотрите все доступные украшения с этим камнем.",
        ]}
        slides={stoneCategories.map((stone) => ({
          image: stone.preview,
          title: stone.label,
          href: `/catalog?stone=${stone.slug}`,
        }))}
      />

      <SubscribeInstagram />
      {/* Супер крутые украшения */}
      <SliderLittleGrid
        title="Эксклюзив для безупречного вкуса"
        subtitle={[
          "Украшения с нестандартным дизайном и крупными формами —",
          "для тех, кто выбирает выразительные и смелые решения.",
        ]}
        imageSize={158}
        slides={advertisementProducts.map((slide) => ({
          image: slide.imageUrl,
          title: slide.title,
          href: `/card/${slide.id}`,
        }))}
      />

      <SliderBigGrid
        title="Бижутерия с натуральными камнями"
        useFillImage
        isCardSlider
        slides={naturalProducts.map((el) => ({
          image: el.imageUrl,
          title: el.title,
        }))}
        showCardTitle={false}
        cards={(naturalProducts || []).map((el) => ({
          ...el,
          useFillImage: true,
        }))}
      />

      <SliderBigGrid
        title="Сувениры"
        useFillImage
        isCardSlider
        slides={souvenirs.map((el) => ({
          image: el.imageUrl,
          title: el.title,
        }))}
        showCardTitle={false}
        cards={souvenirs.map((el) => ({ ...el, useFillImage: true }))}
        viewAllHref="/catalog?isSouvenir=true"
      />

      <GiftInfoBlock />
      <PaymentCardSlider />
      <Footer />
    </>
  );
}

export default HomePage;

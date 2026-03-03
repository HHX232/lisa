import ComplectsPreview from "@/components/HomePage/ComplectsPreview/ComplectsPreview";
import GiftInfoBlock from "@/components/HomePage/GiftInfoBlock/GiftInfoBlock";
import MainSlider from "@/components/HomePage/MainSlider/MainSlider";
import Footer from "@/components/Main/Footer/Footer";
import Header from "@/components/Main/Header/Header";
import SliderBigGrid from "@/components/UI/SliderBigGrid/SliderBigGrid";
import SliderLittleGrid from "@/components/UI/SliderLittleGrid/SliderLittleGrid";
import { Advertisement } from "@/types/Advertisement.types";
import { Product } from "@/types/Product.types";


 export const slides2 = [
    {
      image: '/mock/img2.png',
      title: 'Товар 1',
    },
    {
      image: '/mock/img2.png',
      title: 'Товар 2',
    },
    {
      image: '/mock/img2.png',
      title: 'Товар 3',
    },
    {
      image: '/mock/img1.png',
      title: 'Товар 4',
    },
    {
      image: '/mock/img1.png',
      title: 'Товар 5',
    },
    {
      image: '/mock/img1.png',
      title: 'Товар 6',
    },
    {
      image: '/mock/img1.png',
      title: 'Товар 7',
    },
    {
      image: '/mock/img1.png',
      title: 'Товар 8',
    },
    {
      image: '/mock/img1.png',
      title: 'Товар 9',
    },
    {
      image: '/mock/img1.png',
      title: 'Товар 10',
    }
  ]

function HomePage({mainSlides, decorSlides}:{mainSlides: Advertisement[], decorSlides: Product[]}) {
  return (
    <>
      <Header />
      <MainSlider slides={mainSlides} />
       <SliderLittleGrid title="Каталог украшений" slides={decorSlides.map((slide) => ({
         image: slide.imageUrl,
         title: slide.title
       }))} />
        <SliderBigGrid 
      title="Наши коллекции" 
      slides={decorSlides.map(el=>({image:el.imageUrl, title:el.title}))} 
    />
        <SliderBigGrid 
      title="Наши товары" 
      useFillImage
      isCardSlider
      slides={decorSlides.map(el=>({image:el.imageUrl, title:el.title}))}
      cards={decorSlides.map(el => ({ ...el, useFillImage: true }))}
    />
       <ComplectsPreview previews={decorSlides.map(el=>{
        return {id: el.id, image:el.imageUrl, description:el.description, title:el.title}
       })} />
       <GiftInfoBlock/>
       <Footer/>
    </>
  );
}

export default HomePage;

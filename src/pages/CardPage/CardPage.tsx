import MainCardSlider from "@/components/CardPage/MainCardSlider/MainCardSlider";
import Breadcrumbs from "@/components/UI/Bread/Bread";
import CharacterUI from "@/components/UI/CharacterUI/CharacterUI";
import SliderBigGrid, { mockCards } from "@/components/UI/SliderBigGrid/SliderBigGrid";
import style from "./CardPage.module.scss";
import { Characteristic } from "@/types/Product.types";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface CardPageComponentProps {
  title: string;
  currentPrice: string;
  originalPrice?: string;
  sale?: string;
  isComplect: boolean;
  pickupText?: string;
  stores?: string[];
  description?: string;
  fullDescription?: string;
  breadcrumbs?: BreadcrumbItem[];
  images?: string[];
  characteristics?: Characteristic[];
}

function CardPageComponent({
  title,
  currentPrice,
  originalPrice,
  sale,
  isComplect,
  pickupText = "Самовывоз из магазина",
  stores = [],
  description,
  fullDescription,
  images = [],
  characteristics = [],
  breadcrumbs = [
    { label: "Дом", href: "/" },
    { label: "Каталог", href: "/catalog" },
  ],
}: CardPageComponentProps) {
  return (
    <div className={`${style.margins} container`}>
      <Breadcrumbs extraClass={style.bred_extra} items={breadcrumbs} />
      <div className={style.top_container}>
        <MainCardSlider extraClass={style.extraSlider} isComplect={isComplect} images={images} />
        <div className={style.right}>
          <p className={style.title}>{title}</p>

          <div className={style.prices_box}>
            <p className={style.current_price}>{currentPrice}</p>
            {originalPrice && <p className={style.original_price}>{originalPrice}</p>}
            {sale && <p className={style.sale}>{sale}</p>}
          </div>

          <div className={style.button_box}>
            <div className={style.top}>
              <button className={style.basket}>В корзину</button>
              <div className={style.favorite}>
                <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.6875 0.75C3.40875 0.75 0.75 3.575 0.75 7.05875C0.75 14.0312 12 22 12 22C12 22 23.25 14.0312 23.25 7.05875C23.25 2.7425 20.5912 0.75 17.3125 0.75C14.9875 0.75 12.975 2.17 12 4.2375C11.025 2.17 9.0125 0.75 6.6875 0.75Z" stroke="#072761" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            {isComplect && (
              <button className={style.show_complect}>Смотреть комплект</button>
            )}
          </div>

          <div className={style.dostavka_from}>
            <div className={style.have_title_box}>
              <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.66667 8.33333C5.75 8.33333 5 7.58333 5 6.66667C5 5.75 5.75 5 6.66667 5C7.58333 5 8.33333 5.75 8.33333 6.66667C8.33333 7.58333 7.58333 8.33333 6.66667 8.33333ZM11.6667 6.83333C11.6667 3.80833 9.45833 1.66667 6.66667 1.66667C3.875 1.66667 1.66667 3.80833 1.66667 6.83333C1.66667 8.78333 3.29167 11.3667 6.66667 14.45C10.0417 11.3667 11.6667 8.78333 11.6667 6.83333ZM6.66667 0C10.1667 0 13.3333 2.68333 13.3333 6.83333C13.3333 9.6 11.1083 12.875 6.66667 16.6667C2.225 12.875 0 9.6 0 6.83333C0 2.68333 3.16667 0 6.66667 0Z" fill="#7C7D7E"/>
              </svg>
              {pickupText}
            </div>
          </div>

          {stores.length > 0 && (
            <div className={style.have_box}>
              <p className={style.have_title}>Наличие в магазинах</p>
              <ul className={style.stores_list}>
                {stores.map((store, i) => <li key={i}>{store}</li>)}
              </ul>
            </div>
          )}

          {characteristics.length > 0 && (
            <div className={style.character}>
              <p>Характеристики</p>
              <CharacterUI
                extraClass={style.extra__char__box}
                items={characteristics.map(c => ({ label: c.name, value: c.value }))}
              />
            </div>
          )}
        </div>
      </div>

      {description && <p className={style.description}>{description}</p>}
      {fullDescription && <p className={style.description}>{fullDescription}</p>}

      <h2 className={style.second_title}>Возможно вам понравится</h2>
      <SliderBigGrid isCardSlider slides={[]} cards={mockCards} />
      <h2 className={style.second_title}>Вы недавно смотрели</h2>
      <SliderBigGrid isCardSlider slides={[]} cards={mockCards} />
    </div>
  );
}

export default CardPageComponent;
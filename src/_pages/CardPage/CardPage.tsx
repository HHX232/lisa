import CurrencySymbol from "@/components/UI/BynIcon/CurrencySymbol";
import MainCardSlider from "@/components/Pages/MainCardSlider/MainCardSlider";
import ProductReviews from "@/components/Pages/ProductReviews/ProductReviews";
import Breadcrumbs from "@/components/UI/Bread/Bread";
import AddToCartButton from "@/components/UI/AddToCartButton/AddToCartButton";
import CharacterUI from "@/components/UI/CharacterUI/CharacterUI";
import ComplectModal from "@/components/UI/ComplectModal/ComplectModal";
import FavoriteButton from "@/components/UI/FavoriteButton/FavoriteButton";
import HintButton from "@/components/UI/HintButton/HintButton";
import SliderLittleGrid from "@/components/UI/SliderLittleGrid/SliderLittleGrid";
import RecentlyViewedTracker from "@/components/Pages/RecentlyViewed/RecentlyViewedTracker";
import RecentlyViewedSlider from "@/components/Pages/RecentlyViewed/RecentlyViewedSlider";
import { Characteristic, Product } from "@/types/Product.types";
import style from "./CardPage.module.scss";


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
  id: string;
  stockCount?: number;
  complectItems?: Product[];
  currentProduct?: Product;
  similarProducts?: Product[];
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
  id,
  stockCount,
  complectItems = [],
  currentProduct,
  similarProducts = [],
}: CardPageComponentProps) {
  return (
    <div className={`${style.margins} container`}>
      <Breadcrumbs extraClass={style.bred_extra} items={breadcrumbs} />
      <div className={style.top_container}>
        <MainCardSlider
          extraClass={style.extraSlider}
          isComplect={isComplect}
          images={images}
          hintSlot={<HintButton productId={id} />}
          currentProduct={currentProduct}
          complectItems={complectItems}
        />
        <div className={style.right}>
          <p className={style.title}>{title}</p>

          <div className={style.prices_box}>
            <p className={style.current_price}>{currentPrice}<CurrencySymbol size={20} /></p>
            {originalPrice && <p className={style.original_price}>{originalPrice}<CurrencySymbol size={18} /></p>}
            {sale && <p className={style.sale}>{sale}</p>}
          </div>

          <div className={style.button_box}>
            <div className={style.top}>
              <AddToCartButton productId={id} className={style.basket} stockCount={stockCount} />
             <FavoriteButton productId={id} />

            </div>
            {isComplect && currentProduct && (
              <ComplectModal
                currentProduct={currentProduct}
                complectItems={complectItems}
                buttonClassName={style.show_complect}
              />
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
      <p className={style.stone_note}>Внутренние трещинки, природные неровности и мелкие сколы натурального камня, являются особенностями его природного происхождения, что подтверждают натуральность камня и не считаются браком</p>

      <RecentlyViewedTracker
        id={Number(id)}
        title={title}
        imageUrl={currentProduct?.imageUrl ?? images[0] ?? ''}
      />

      <ProductReviews productId={id} />

      {similarProducts.length > 0 && (
        <>
          <h2 className={style.second_title}>Возможно вам понравится</h2>
          <SliderLittleGrid
            slides={similarProducts.map(p => ({
              image: p.imageUrl,
              title: p.title,
              href: `/card/${p.id}`,
            }))}
            imageSize={180}
          />
        </>
      )}
      <RecentlyViewedSlider excludeId={Number(id)} />
    </div>
  );
}

export default CardPageComponent;
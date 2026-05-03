"use client";

import { useEffect, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import { FreeMode, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./MainCardSlider.module.scss";

interface MainCardSliderProps {
  images?: string[];
  isComplect?: boolean;
  extraClass?: string;
  useDefaultAdaptive?: boolean;
}

const DEFAULT_IMAGES = [
  "/mock/compl1.png",
  "/mock/compl2.png",
  "/mock/compl3.png",
  "/mock/compl1.png",
  "/mock/compl2.png",
  "/mock/compl3.png",
];

export default function MainCardSlider({
  images = DEFAULT_IMAGES,
  isComplect,
  extraClass,
  useDefaultAdaptive = true,
}: MainCardSliderProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!useDefaultAdaptive) return;

    const mq = window.matchMedia("(max-width: 600px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [useDefaultAdaptive]);

  const isHorizontal = useDefaultAdaptive && isMobile;

  const syncThumbs = (realIndex: number) => {
    if (!thumbsSwiper) return;
    const offset = Math.floor(3.5 / 2);
    const targetIndex = Math.max(0, realIndex - offset);
    thumbsSwiper.slideTo(targetIndex);
  };

  return (
    <div
      className={[
        styles.mainCardSlider,
        isHorizontal ? styles.layoutMobile : "",
        extraClass ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* На мобиле уходит вниз через order в CSS */}
      <Swiper
        // key форсирует полный ремаунт при смене direction —
        // Swiper не поддерживает смену этого пропа в рантайме
        key={isHorizontal ? "thumb-h" : "thumb-v"}
        modules={[FreeMode, Thumbs]}
        direction={isHorizontal ? "horizontal" : "vertical"}
        slidesPerView={isHorizontal ? "auto" : 3.5}
        spaceBetween={isHorizontal ? 20 : 30}
        freeMode={isHorizontal ? false : { enabled: true, momentum: false }}
        watchSlidesProgress
        slideToClickedSlide
        onSwiper={setThumbsSwiper}
        className={styles.thumbSwiper}
      >
        {images.map((src, i) => (
          <SwiperSlide key={i} className={styles.thumbSlide}>
            <div
              className={styles.thumb}
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: "contain",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.mainWrap}>
        <Swiper
          modules={[Thumbs]}
          thumbs={{ swiper: thumbsSwiper }}
          loop
          onSlideChange={(swiper) => syncThumbs(swiper.realIndex)}
          className={styles.mainSwiper}
        >
          {images.map((src, i) => (
            <SwiperSlide key={i} className={styles.mainSlide}>
              <div
                className={styles.mainSlideInner}
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundSize: "contain",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {isComplect && (
          <span className={styles.complectLabel}>
            <svg
              width="13"
              height="16"
              viewBox="0 0 13 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.33333 6.33333L3.16667 1.9L4.43333 0H8.23333L9.5 1.9L6.33333 6.33333ZM9.10417 3.8L8.15417 5.14583C9.89583 5.85833 11.0833 7.52083 11.0833 9.5C11.0833 10.7598 10.5829 11.968 9.69209 12.8588C8.80129 13.7496 7.59311 14.25 6.33333 14.25C5.07355 14.25 3.86537 13.7496 2.97458 12.8588C2.08378 11.968 1.58333 10.7598 1.58333 9.5C1.58333 7.52083 2.77083 5.85833 4.5125 5.14583L3.5625 3.8C1.425 4.82917 0 6.96667 0 9.5C0 11.1797 0.66726 12.7906 1.85499 13.9783C3.04272 15.1661 4.65363 15.8333 6.33333 15.8333C8.01304 15.8333 9.62395 15.1661 10.8117 13.9783C11.9994 12.7906 12.6667 11.1797 12.6667 9.5C12.6667 6.96667 11.2417 4.82917 9.10417 3.8Z"
                fill="#072761"
              />
            </svg>
            Комплект
          </span>
        )}
      </div>
    </div>
  );
}
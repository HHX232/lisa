'use client'
import Logo from "@/components/Logo/Logo";
import {
  categories,
  categoriesLinks,
  CLEAR_PHONE,
  contactInfo,
  mainNav,
  mainNavLinks,
} from "@/constants/header.constants";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PriceCurrencyTab from "../money/PriceCurrencyTab";
import styles from "./Header.module.scss";
import SearchModal from "./SearchModal/SearchModal";

const placeUrl = "/header-svg/place.svg";
const searchUrl = "/header-svg/search.svg";
const heartUrl = "/header-svg/heart.svg";
const bagUrl = "/header-svg/bag.svg";
const personUrl = "/header-svg/person.svg";

function Header({ staticPos }: { staticPos?: boolean } = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCategorySticky, setIsCategorySticky] = useState(false);

 useEffect(() => {
    const handleScroll = () => {
      setIsCategorySticky(window.scrollY > 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
useEffect(() => {
  if (isMenuOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }

  return () => {
    document.body.style.overflow = ''
  }
}, [isMenuOpen])
  return (
    <header className={`${styles.header} ${staticPos ? styles.headerStatic : ''}`}>
      
      <div className={`${styles.main} container`}>
        <div className={styles.leftSection}>
          <button 
            className={`${styles.burgerButton} ${isMenuOpen ? styles.open : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={styles.mobileSearchIcon} onClick={() => setIsSearchOpen(true)} style={{ cursor: 'pointer' }}>
            <Image src={searchUrl} width={24} height={24} alt="search" />
          </div>
        </div>

        <div className={styles.mainNav}>
          {mainNav.map((item, index) => (
            <Link href={mainNavLinks[index]} key={index}>
              <div>{item}</div>
            </Link>
          ))}
        </div>

        <Logo extraClassName={styles.logo} />

        <div className={styles.header_buttons}>

         
          <div className={styles.contact_info_box}>
            <Link href="/locations" className={styles.locationLink}>
              <Image src={placeUrl} width={20} height={20} alt="place" />
              <p className={styles.contactInfo}>{contactInfo[0]}</p>
            </Link>
            <Link href={`tel:${CLEAR_PHONE}`}><p className={styles.contactInfo}>{contactInfo[1]}</p></Link>
          </div>
          <div className={styles.price_and_icon}>
             <PriceCurrencyTab/>
         
          <div className={styles.icons_group}>
            <div className={styles.desktopSearchIcon} onClick={() => setIsSearchOpen(true)}>
              <Image className={styles.cursorPointer} src={searchUrl} width={24} height={24} alt="search" />
            </div>
           <Link href={'/favorites'}> <Image className={styles.cursorPointer} src={heartUrl} width={24} height={24} alt="heart" /></Link>
            <Link href="/basket">
              <Image className={styles.cursorPointer} src={bagUrl} width={24} height={24} alt="bag" />
            </Link>
            <Link href="/profile">
              <Image className={styles.cursorPointer} src={personUrl} width={24} height={24} alt="person" />
            </Link>
          </div>
           </div>
        </div>
      </div>

      <div className={`${styles.categories_box} container`}>
        {categories.map((item, index) => (
          <Link href={categoriesLinks[index]} key={`${item} ${index}`}>
            <div className={styles.categories_box_item}>{item}</div>
          </Link>
        ))}
      </div>

      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''} container`}>
     <div className={styles.mobileMenuContent}>
  {/* Основная навигация */}
  <div className={styles.mobileMenuSection}>
    {mainNav.map((item, index) => (
      <Link
        href={mainNavLinks[index]}
        key={`mobile-nav-${index}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className={styles.mobileMenuItem}>{item}</div>
      </Link>
    ))}
  </div>

  <div className={styles.mobileMenuDivider} />

  {/* Категории */}
  <div className={styles.mobileMenuSection}>
    {categories.map((item, index) => (
      <Link
        href={categoriesLinks[index]}
        key={`mobile-cat-${item}-${index}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className={styles.mobileMenuItem}>{item}</div>
      </Link>
    ))}
  </div>
</div>
      </div>

      {isMenuOpen && (
        <div
          className={`${styles.overlay} container`}
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
         {isCategorySticky && (
        <div className={styles.categories_box_sticky}>
          <div className={`${styles.sticky_inner}`}>
          {categories.map((item, index) => (
            <Link href={categoriesLinks[index]} key={`sticky-${item}-${index}`}>
              <div className={styles.categories_box_item}>{item}</div>
            </Link>
          ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
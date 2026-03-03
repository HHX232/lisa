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
import { useState } from "react";
import PriceCurrencyTab from "../money/PriceCurrencyTab";
import styles from "./Header.module.scss";

const placeUrl = "/header-svg/place.svg";
const searchUrl = "/header-svg/search.svg";
const heartUrl = "/header-svg/heart.svg";
const bagUrl = "/header-svg/bag.svg";
const personUrl = "/header-svg/person.svg";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header  className={`${styles.header} `}>
      
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
          <div className={styles.mobileSearchIcon}>
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
            <Image src={placeUrl} width={20} height={20} alt="place" />
            <p className={styles.contactInfo}>{contactInfo[0]}</p>
          <Link href={`tel:${CLEAR_PHONE}`}>  <p className={styles.contactInfo}>{contactInfo[1]}</p></Link>
          </div>
          <div className={styles.price_and_icon}>
             <PriceCurrencyTab/>
         
          <div className={styles.icons_group}>
            <div className={styles.desktopSearchIcon}>
              <Image className={styles.cursorPointer} src={searchUrl} width={24} height={24} alt="search" />
            </div>
            <Image className={styles.cursorPointer} src={heartUrl} width={24} height={24} alt="heart" />
            <Image className={styles.cursorPointer} src={bagUrl} width={24} height={24} alt="bag" />
            <Image className={styles.cursorPointer} src={personUrl} width={24} height={24} alt="person" />
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
          {categories.map((item, index) => (
            <Link 
              href={categoriesLinks[index]} 
              key={`mobile-${item}-${index}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className={styles.mobileMenuItem}>{item}</div>
            </Link>
          ))}
        </div>
      </div>

      {isMenuOpen && (
        <div 
          className={`${styles.overlay} container`} 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}

export default Header;
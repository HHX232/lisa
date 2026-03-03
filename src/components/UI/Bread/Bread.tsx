import Link from 'next/link'
import React from 'react'
import styles from './Bread.module.scss'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  extraClass?:string
}

const Breadcrumbs = ({ items , extraClass}: BreadcrumbsProps) => {
  return (
    <nav aria-label="breadcrumb" className={extraClass}>
      <ol className={styles.breadcrumbs}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <React.Fragment key={index}>
              <li className={styles.item}>
                {isLast ? (
                  <span className={styles.active} aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href || ''} className={styles.link}>
                    {item.label}
                  </Link>
                )}
              </li>

              {!isLast && (
                <li className={styles.separator} aria-hidden="true">
                  /
                </li>
              )}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
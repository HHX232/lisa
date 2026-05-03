'use client'

import { axiosClassic } from '@/api/helpers/api.interceptor'
import Card from '@/components/Products/Card/Card'
import { useCurrency } from '@/hooks/useCurrency'
import { Product } from '@/types/Product.types'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import styles from './CatalogPage.module.scss'

// ─── Types ───────────────────────────────────────────────────────────────────

type SortField = 'ID' | 'TITLE' | 'PRICE'
type SortDir = 'ASC' | 'DESC'

interface ProductsResponse {
  content: Product[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

interface Filters {
  isAdvertisement?: boolean
  isComplect?: boolean
  isSouvenir?: boolean
  minPrice?: number
  maxPrice?: number
  title?: string
  advertisementType?: string
  sort?: SortField
  direction?: SortDir
  page: number
  size: number
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

const fetchProducts = async (filters: Filters): Promise<ProductsResponse> => {
  const params: Record<string, string> = {
    page: String(filters.page),
    size: String(filters.size),
  }

  if (filters.isAdvertisement !== undefined) params.isAdvertisement = String(filters.isAdvertisement)
  if (filters.isComplect !== undefined) params.isComplect = String(filters.isComplect)
  if (filters.isSouvenir !== undefined) params.isSouvenir = String(filters.isSouvenir)
  if (filters.minPrice !== undefined) params.minPrice = String(filters.minPrice)
  if (filters.maxPrice !== undefined) params.maxPrice = String(filters.maxPrice)
  if (filters.title) params.title = filters.title
  if (filters.advertisementType) params.advertisementType = filters.advertisementType
  if (filters.sort) params.sort = filters.sort
  if (filters.direction) params.direction = filters.direction

  const { data } = await axiosClassic.get('/products', { params })
  return data
}

// ─── useFilters ───────────────────────────────────────────────────────────────

function useFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filters: Filters = {
    page: Number(searchParams.get('page') ?? 0),
    size: Number(searchParams.get('size') ?? 12),
    title: searchParams.get('title') ?? undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    isAdvertisement: searchParams.get('isAdvertisement') === 'true' ? true : searchParams.get('isAdvertisement') === 'false' ? false : undefined,
    isComplect: searchParams.get('isComplect') === 'true' ? true : searchParams.get('isComplect') === 'false' ? false : undefined,
    isSouvenir: searchParams.get('isSouvenir') === 'true' ? true : searchParams.get('isSouvenir') === 'false' ? false : undefined,
    advertisementType: searchParams.get('advertisementType') ?? undefined,
    sort: (searchParams.get('sort') as SortField) ?? undefined,
    direction: (searchParams.get('direction') as SortDir) ?? undefined,
  }

  const setFilters = useCallback((updates: Partial<Filters>) => {
    const next = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        next.delete(key)
      } else {
        next.set(key, String(value))
      }
    })

    if (!('page' in updates)) next.set('page', '0')

    router.push(`${pathname}?${next.toString()}`)
  }, [searchParams, router, pathname])

  return { filters, setFilters }
}

// ─── FilterToggle ─────────────────────────────────────────────────────────────

function FilterToggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean | undefined
  onChange: (v: boolean | undefined) => void
}) {
  const cycle = () => {
    if (value === undefined) onChange(true)
    else if (value === true) onChange(false)
    else onChange(undefined)
  }

  return (
    <button
      className={`${styles.filterToggle} ${value === true ? styles.filterToggleOn : value === false ? styles.filterToggleOff : ''}`}
      onClick={cycle}
      type="button"
    >
      {label}
      {value !== undefined && (
        <span className={styles.filterToggleBadge}>{value ? 'Да' : 'Нет'}</span>
      )}
    </button>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 0; i < totalPages; i++) pages.push(i)
  } else {
    pages.push(0)
    if (page > 3) pages.push('...')
    for (let i = Math.max(1, page - 1); i <= Math.min(totalPages - 2, page + 1); i++) pages.push(i)
    if (page < totalPages - 4) pages.push('...')
    pages.push(totalPages - 1)
  }

  return (
    <div className={styles.pagination}>
      <button className={styles.pageBtn} onClick={() => onPageChange(page - 1)} disabled={page === 0}>←</button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className={styles.pageDots}>…</span>
        ) : (
          <button
            key={p}
            className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
            onClick={() => onPageChange(p as number)}
          >
            {(p as number) + 1}
          </button>
        )
      )}
      <button className={styles.pageBtn} onClick={() => onPageChange(page + 1)} disabled={page === totalPages - 1}>→</button>
    </div>
  )
}

// ─── CatalogPage ──────────────────────────────────────────────────────────────

export default function CatalogPage() {
  const { filters, setFilters } = useFilters()
const currency = useCurrency()
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice?.toString() ?? '')
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice?.toString() ?? '')
  const [titleInput, setTitleInput] = useState(filters.title ?? '')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['products', filters, currency],
    queryFn: () => fetchProducts(filters),
    placeholderData: (prev) => prev,
  })

  const handleTitleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ title: titleInput || undefined })
  }

  const handlePriceApply = () => {
    setFilters({
      minPrice: minPriceInput ? Number(minPriceInput) : undefined,
      maxPrice: maxPriceInput ? Number(maxPriceInput) : undefined,
    })
  }

  const handleSort = (sort: SortField) => {
    if (filters.sort === sort) {
      setFilters({ direction: filters.direction === 'ASC' ? 'DESC' : 'ASC' })
    } else {
      setFilters({ sort, direction: 'ASC' })
    }
  }

  const resetFilters = () => {
    setMinPriceInput('')
    setMaxPriceInput('')
    setTitleInput('')
    setFilters({
      isAdvertisement: undefined,
      isComplect: undefined,
      isSouvenir: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      title: undefined,
      advertisementType: undefined,
      sort: undefined,
      direction: undefined,
    })
  }

  const activeFiltersCount = [
    filters.isAdvertisement,
    filters.isComplect,
    filters.isSouvenir,
    filters.minPrice,
    filters.maxPrice,
    filters.title,
    filters.advertisementType,
  ].filter((v) => v !== undefined && v !== '').length

  const pageInfo = data?.page
  const products = data?.content ?? []

  return (
    <div className={styles.catalogPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Каталог</h1>
          {pageInfo && (
            <span className={styles.totalCount}>{pageInfo.totalElements} товаров</span>
          )}
        </div>

        <form className={styles.searchForm} onSubmit={handleTitleSearch}>
          <input
            className={styles.searchInput}
            placeholder="Поиск по названию..."
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
          />
          <button className={styles.searchBtn} type="submit">Найти</button>
        </form>
      </div>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${filtersOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarTitle}>
              Фильтры
              {activeFiltersCount > 0 && (
                <span className={styles.activeCount}>{activeFiltersCount}</span>
              )}
            </span>
            {activeFiltersCount > 0 && (
              <button className={styles.resetBtn} onClick={resetFilters}>Сбросить</button>
            )}
          </div>

          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Цена, ₽</p>
            <div className={styles.priceRow}>
              <input
                className={styles.priceInput}
                placeholder="От"
                type="number"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                onBlur={handlePriceApply}
                onKeyDown={(e) => e.key === 'Enter' && handlePriceApply()}
              />
              <span className={styles.priceSep}>—</span>
              <input
                className={styles.priceInput}
                placeholder="До"
                type="number"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                onBlur={handlePriceApply}
                onKeyDown={(e) => e.key === 'Enter' && handlePriceApply()}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Тип товара</p>
            <div className={styles.toggles}>
              <FilterToggle label="Реклама" value={filters.isAdvertisement} onChange={(v) => setFilters({ isAdvertisement: v })} />
              <FilterToggle label="Комплект" value={filters.isComplect} onChange={(v) => setFilters({ isComplect: v })} />
              <FilterToggle label="Сувенир" value={filters.isSouvenir} onChange={(v) => setFilters({ isSouvenir: v })} />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Сортировка</p>
            <div className={styles.sortList}>
              {(['ID', 'TITLE', 'PRICE'] as SortField[]).map((field) => {
                const labels: Record<SortField, string> = { ID: 'По ID', TITLE: 'По названию', PRICE: 'По цене' }
                const active = filters.sort === field
                return (
                  <button
                    key={field}
                    className={`${styles.sortBtn} ${active ? styles.sortBtnActive : ''}`}
                    onClick={() => handleSort(field)}
                  >
                    {labels[field]}
                    {active && <span className={styles.sortArrow}>{filters.direction === 'ASC' ? '↑' : '↓'}</span>}
                  </button>
                )
              })}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>Товаров на странице</p>
            <div className={styles.pageSizeRow}>
              {[12, 24, 48].map((s) => (
                <button
                  key={s}
                  className={`${styles.pageSizeBtn} ${filters.size === s ? styles.pageSizeBtnActive : ''}`}
                  onClick={() => setFilters({ size: s })}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile toggle */}
        <button
          className={styles.mobileFilterBtn}
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          {filtersOpen ? 'Скрыть фильтры' : `Фильтры${activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}`}
        </button>

        {/* Products */}
        <main className={`${styles.main} ${isFetching ? styles.mainFading : ''}`}>
          {isLoading && (
            <div className={styles.gridSkeleton}>
              {Array.from({ length: filters.size }).map((_, i) => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          )}

          {isError && (
            <div className={styles.stateBox}>
              <p className={styles.stateText}>Не удалось загрузить товары</p>
            </div>
          )}

          {!isLoading && !isError && products.length === 0 && (
            <div className={styles.stateBox}>
              <p className={styles.stateTitle}>Ничего не найдено</p>
              <p className={styles.stateText}>Попробуйте изменить фильтры</p>
              <button className={styles.resetBtnLarge} onClick={resetFilters}>Сбросить фильтры</button>
            </div>
          )}

          {!isLoading && products.length > 0 && (
            <>
              <div className={styles.grid}>
                {products.map((product) => (
                  <Card
                    key={product.id}
                    {...product}
                    showCardTitle={true}
                    useFillImage={product.useFillImage}
                  />
                ))}
              </div>

              {pageInfo && (
                <Pagination
                  page={pageInfo.number}
                  totalPages={pageInfo.totalPages}
                  onPageChange={(p) => setFilters({ page: p })}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
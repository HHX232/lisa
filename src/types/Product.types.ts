
export interface ProductSort {
  empty: boolean
  unsorted: boolean
  sorted: boolean
}

export interface ProductPageable {
  offset: number
  unpaged: boolean
  paged: boolean
  pageNumber: number
  pageSize: number
  sort: ProductSort
}

export interface Product {
  id: number
  title: string
  isComplect: boolean
  currentPrice: number
  originalPrice?: number
  sale: number
  description: string
  imageUrl: string
  useFillImage: boolean
  isSouvenir?: boolean
}
export interface Characteristic {
  name: string
  value: string
}

export interface ProductFull {
  id: number
  title: string
  isComplect: boolean
  currentPrice: number
  originalPrice: number
  sale: number
  description: string
  imageUrl: string
  useFillImage: boolean
  isSouvenir: boolean
  images: string[]
  inShops: string[]
  characteristics: Characteristic[]
  fullDescription: string
  category: string
  complectItems: Product[]
}
export interface PaginatedProducts {
  totalElements: number
  totalPages: number
  size: number
  content: Product[]
  number: number
  pageable: ProductPageable
  sort: ProductSort
  numberOfElements: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface ProductsRequestParams {
  page?: number
  size?: number
  sort?: string[]
}
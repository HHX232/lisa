import {
  PaginatedProducts,
  Product,
  ProductFull,
  ProductsRequestParams,
} from '@/types/Product.types'
import { axiosClassic } from '../helpers/api.interceptor'
import {
  validateAdvertisementType,
  validateBoolean,
  validateDirection,
  validatePage,
  validatePrice,
  validateSize,
  validateSortField,
  validateTitle,
} from '../validators/validate.params'

const productService = {
  getComplectItems: async (id: string | number) => {
  const { data } = await axiosClassic.get<Product[]>(`/products/${id}/complect-items`)
  return data ?? []
},
  async getProducts(params: ProductsRequestParams = {}, currentLang?: string) {
    const page = validatePage(params?.page)
    const size = validateSize(params?.size)
    const isNaturalStone = validateBoolean(params?.isNaturalStone)
    const sort = validateSortField(params?.sort)
    const direction = validateDirection(params?.direction)
    const isAdvertisement = validateBoolean(params?.isAdvertisement)
    const isComplect = validateBoolean(params?.isComplect)
    const isSouvenir = validateBoolean(params?.isSouvenir)
    const minPrice = validatePrice(params?.minPrice)
    const maxPrice = validatePrice(params?.maxPrice)
    const title = validateTitle(params?.title)
    const advertisementType = validateAdvertisementType(params?.advertisementType)

    const query = new URLSearchParams()
    query.set('page', String(page))
    query.set('size', String(size))
    if (sort) query.set('sort', sort)
    if (direction) query.set('direction', direction)
    if (isAdvertisement !== undefined) query.set('isAdvertisement', String(isAdvertisement))
    if (isComplect !== undefined) query.set('isComplect', String(isComplect))
    if (isSouvenir !== undefined) query.set('isSouvenir', String(isSouvenir))
    if (minPrice !== undefined) query.set('minPrice', String(minPrice))
      if (isNaturalStone !== undefined) query.set('isNaturalStone', String(isNaturalStone))

    if (maxPrice !== undefined) query.set('maxPrice', String(maxPrice))
    if (title) query.set('title', title)
    if (advertisementType) query.set('advertisementType', advertisementType)

    const url = `/products?${query.toString()}`
    try {
      const res = await axiosClassic.get<PaginatedProducts>(url, {
        headers: { 'Accept-Language': currentLang || 'en' },
      })
      return { data: res.data, isLoading: false, isError: false, error: null }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number; data: unknown }; message?: string }
      console.error('[productService.getProducts] error:', axiosErr?.response?.status, axiosErr?.response?.data ?? axiosErr?.message)
      return { data: null, isLoading: false, isError: true, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  },

  async getProductById(id: number | string, currentLang?: string) {
    try {
      const res = await axiosClassic.get<ProductFull>(`/products/${id}`, {
        headers: { 'Accept-Language': currentLang || 'en' },
      })
      return { data: res.data, isLoading: false, isError: false, error: null }
    } catch (err) {
      return { data: null, isLoading: false, isError: true, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  },

  async updateProduct(id: number | string, body: Partial<Product>, currentLang?: string) {
    try {
      const res = await axiosClassic.put<Product>(`/products/${id}`, body, {
        headers: { 'Accept-Language': currentLang || 'en' },
      })
      return { data: res.data, isLoading: false, isError: false, error: null }
    } catch (err) {
      return { data: null, isLoading: false, isError: true, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  },

  async deleteProduct(id: number | string, currentLang?: string) {
    try {
      await axiosClassic.delete(`/products/${id}`, {
        headers: { 'Accept-Language': currentLang || 'en' },
      })
      return { data: null, isLoading: false, isError: false, error: null }
    } catch (err) {
      return { data: null, isLoading: false, isError: true, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  },

  async getProductsByCategory(category: string, excludeId?: number, size = 20) {
    try {
      const query = new URLSearchParams({ category, size: String(size), page: '0' })
      const res = await axiosClassic.get<PaginatedProducts>(`/products?${query.toString()}`)
      const content = excludeId
        ? res.data.content.filter(p => p.id !== excludeId)
        : res.data.content
      return { data: content, isLoading: false, isError: false, error: null }
    } catch (err) {
      return { data: [] as Product[], isLoading: false, isError: true, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  },

  async getProductsByStone(stoneSlug: string, excludeId?: number, size = 20) {
    try {
      const query = new URLSearchParams({ stone: stoneSlug, size: String(size), page: '0' })
      const res = await axiosClassic.get<PaginatedProducts>(`/products?${query.toString()}`)
      const content = excludeId
        ? res.data.content.filter(p => p.id !== excludeId)
        : res.data.content
      return { data: content, isLoading: false, isError: false, error: null }
    } catch (err) {
      return { data: [] as Product[], isLoading: false, isError: true, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  },

  async getProductsMiddlePage(excludeId?: number, size = 20) {
    try {
      const firstRes = await axiosClassic.get<PaginatedProducts>(`/products?page=0&size=${size}`)
      const totalPages = firstRes.data.totalPages
      if (totalPages <= 1) {
        const content = excludeId
          ? firstRes.data.content.filter(p => p.id !== excludeId)
          : firstRes.data.content
        return { data: content, isLoading: false, isError: false, error: null }
      }
      const midPage = Math.floor(totalPages / 2)
      const res = await axiosClassic.get<PaginatedProducts>(`/products?page=${midPage}&size=${size}`)
      const content = excludeId
        ? res.data.content.filter(p => p.id !== excludeId)
        : res.data.content
      return { data: content, isLoading: false, isError: false, error: null }
    } catch (err) {
      return { data: [] as Product[], isLoading: false, isError: true, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  },
}

export default productService

import {
  PaginatedProducts,
  Product,
  ProductFull,
  ProductsRequestParams,
} from '@/types/Product.types'
import { axiosClassic } from '../helpers/api.interceptor'
import { getAccessToken } from '../helpers/auth.helper'
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
  async getProducts(params: ProductsRequestParams = {}, currentLang?: string) {
    const page = validatePage(params?.page)
    const size = validateSize(params?.size)
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

    // TODO перенести в валидацию
    if (sort) query.set('sort', sort)
    if (direction) query.set('direction', direction)
    if (isAdvertisement !== undefined) query.set('isAdvertisement', String(isAdvertisement))
    if (isComplect !== undefined) query.set('isComplect', String(isComplect))
    if (isSouvenir !== undefined) query.set('isSouvenir', String(isSouvenir))
    if (minPrice !== undefined) query.set('minPrice', String(minPrice))
    if (maxPrice !== undefined) query.set('maxPrice', String(maxPrice))
    if (title) query.set('title', title)
    if (advertisementType) query.set('advertisementType', advertisementType)

    try {
      const res = await axiosClassic.get<PaginatedProducts>(`/products?${query.toString()}`, {
        headers: {
          'Accept-Language': currentLang || 'en',
        },
      })
      return { data: res.data, isLoading: false, isError: false, error: null }
    } catch (err) {
      return {
        data: null,
        isLoading: false,
        isError: true,
        error: err instanceof Error ? err.message : 'Unknown error',
      }
    }
  },

  async getProductById(id: number | string, currentLang?: string) {
    const accessToken = await getAccessToken()
    try {
      const res = await axiosClassic.get<ProductFull>(`/products/${id}`, {
        headers: {
          'Accept-Language': currentLang || 'en',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return { data: res.data, isLoading: false, isError: false, error: null }
    } catch (err) {
      return {
        data: null,
        isLoading: false,
        isError: true,
        error: err instanceof Error ? err.message : 'Unknown error',
      }
    }
  },

  async updateProduct(id: number | string, body: Partial<Product>, currentLang?: string) {
    const accessToken = await getAccessToken()
    try {
      const res = await axiosClassic.put<Product>(`/products/${id}`, body, {
        headers: {
          'Accept-Language': currentLang || 'en',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return { data: res.data, isLoading: false, isError: false, error: null }
    } catch (err) {
      return {
        data: null,
        isLoading: false,
        isError: true,
        error: err instanceof Error ? err.message : 'Unknown error',
      }
    }
  },

  async deleteProduct(id: number | string, currentLang?: string) {
    const accessToken = await getAccessToken()
    try {
      await axiosClassic.delete(`/products/${id}`, {
        headers: {
          'Accept-Language': currentLang || 'en',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return { data: null, isLoading: false, isError: false, error: null }
    } catch (err) {
      return {
        data: null,
        isLoading: false,
        isError: true,
        error: err instanceof Error ? err.message : 'Unknown error',
      }
    }
  },
}

export default productService
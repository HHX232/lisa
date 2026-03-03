import { PaginatedProducts, Product, ProductFull, ProductsRequestParams } from "@/types/Product.types"
import { axiosClassic } from "../helpers/api.interceptor"
import { getAccessTokenServer } from "../helpers/auth.helper"



const productService = {
  async getProducts(params: ProductsRequestParams = {}, currentLang?: string) {
    const accessToken = await getAccessTokenServer()
    try {
      const res = await axiosClassic.get<PaginatedProducts>(
        `/products?page=${params.page}&size=${params.size}&sort=${params.sort}`,
        {
          headers: {
            'Accept-Language': currentLang || 'en',
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      console.log('response', res)
      return {
        data: res.data,
        isLoading: false,
        isError: false,
        error: null
      }
    } catch (err) {
      return {
        data: null,
        isLoading: false,
        isError: true,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }
  },

  async getProductById(id: number | string, currentLang?: string) {
    const accessToken = await getAccessTokenServer()
    try {
      const res = await axiosClassic.get<ProductFull>(
        `/products/${id}`,
        {
          headers: {
            'Accept-Language': currentLang || 'en',
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      return {
        data: res.data,
        isLoading: false,
        isError: false,
        error: null
      }
    } catch (err) {
      return {
        data: null,
        isLoading: false,
        isError: true,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }
  },

  async updateProduct(id: number | string, body: Partial<Product>, currentLang?: string) {
    const accessToken = await getAccessTokenServer()
    try {
      const res = await axiosClassic.put<Product>(
        `/products/${id}`,
        body,
        {
          headers: {
            'Accept-Language': currentLang || 'en',
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      return {
        data: res.data,
        isLoading: false,
        isError: false,
        error: null
      }
    } catch (err) {
      return {
        data: null,
        isLoading: false,
        isError: true,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }
  },

  async deleteProduct(id: number | string, currentLang?: string) {
    const accessToken = await getAccessTokenServer()
    try {
      await axiosClassic.delete(
        `/products/${id}`,
        {
          headers: {
            'Accept-Language': currentLang || 'en',
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      return {
        data: null,
        isLoading: false,
        isError: false,
        error: null
      }
    } catch (err) {
      return {
        data: null,
        isLoading: false,
        isError: true,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }
  }
}

export default productService
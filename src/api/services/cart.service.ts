import { CartApiItem, CartItemCard } from '@/types/Cart.types'
import { axiosClassic } from '../helpers/api.interceptor'

const cartService = {
  async getCart(): Promise<CartItemCard[]> {
    const res = await axiosClassic.get<CartApiItem[]>('/me/cart')
    return res.data.map(({ quantityInStock, ...item }) => ({
      ...item,
      stockCount: quantityInStock ?? 1,
    }))
  },

  async updateCartItem(productId: number, count: number): Promise<void> {
    await axiosClassic.put(`/me/cart/${productId}`, { count })
  },

  async removeCartItem(productId: number): Promise<void> {
    await axiosClassic.delete(`/me/cart/${productId}`)
  },
}

export default cartService

import { Product } from "@/types/Product.types"
import { axiosClassic } from "../helpers/api.interceptor"
import { IMe, IUpdateContactInfo, IChangeEmail, IChangePhone } from "@/types/user.types"

const userService = {
  async getMe() {
    try {
      const res = await axiosClassic.get<IMe>('/me')
      return { data: res.data, isLoading: false, isError: false, error: null }
    } catch (err) {
      return { data: null, isLoading: false, isError: true, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  },

  async updateContactInfo(body: IUpdateContactInfo) {
    const res = await axiosClassic.patch<IMe>('/me', body)
    return res.data
  },

  async changeEmail(body: IChangeEmail) {
    const res = await axiosClassic.patch('/me/change-email', body)
    return res.data
  },

  async changePhone(body: IChangePhone) {
    const res = await axiosClassic.patch('/me/change-phone-number', body)
    return res.data
  },

  async verifyEmail(email: string, otp: string) {
    const res = await axiosClassic.post(`/auth/verify-email/${email}`, { otp })
    return res.data
  },

  async verifyPhone(phoneNumber: string, otp: string) {
    const res = await axiosClassic.post(`/auth/verify-phone-number/${phoneNumber}`, { otp })
    return res.data
  },

  async getFavoriteProducts() {
    const res = await axiosClassic.get<Product[]>('/me/favorite-products')
    return res.data
  },

  async toggleFavoriteProduct(id: number | string) {
    const res = await axiosClassic.put(`/me/favorite-products/${id}`, null)
    return res.data
  }
}

export default userService

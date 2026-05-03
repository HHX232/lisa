import { Product } from "@/types/Product.types"
import { axiosClassic } from "../helpers/api.interceptor"
import { getAccessTokenServer } from "../helpers/auth.helper"
import { IMe, IUpdateContactInfo, IChangeEmail, IChangePhone } from "@/types/user.types"


const userService = {
  async getMe() {
    const accessToken = await getAccessTokenServer()
    try {
      const res = await axiosClassic.get<IMe>('/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      return { data: res.data, isLoading: false, isError: false, error: null }
    } catch (err) {
      return {
        data: null,
        isLoading: false,
        isError: true,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }
  },

  async updateContactInfo(body: IUpdateContactInfo) {
    const accessToken = await getAccessTokenServer()
    const res = await axiosClassic.patch<IMe>('/me', body, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    return res.data
  },

  async changeEmail(body: IChangeEmail) {
    const accessToken = await getAccessTokenServer()
    const res = await axiosClassic.patch('/me/change-email', body, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    return res.data
  },

  async changePhone(body: IChangePhone) {
    const accessToken = await getAccessTokenServer()
    const res = await axiosClassic.patch('/me/change-phone-number', body, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
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
    const accessToken = await getAccessTokenServer()
    const res = await axiosClassic.get<Product[]>('/me/favorite-products', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    console.log('res.data', res.data)
    return res.data
  },

  async toggleFavoriteProduct(id: number | string) {
    const accessToken = await getAccessTokenServer()
    const res = await axiosClassic.put(`/me/favorite-products/${id}`, null, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    return res.data
  }
}

export default userService
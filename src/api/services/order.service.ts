import { axiosClassic } from '../helpers/api.interceptor'

export interface OrderItem {
  productId: number
  count: number
}

export interface CreateOrderBody {
  address?: string
  items: OrderItem[]
}

const orderService = {
  async createOrder(body: CreateOrderBody) {
    const res = await axiosClassic.post('/me/orders', body)
    return res.data
  },

  async getOrders() {
    const res = await axiosClassic.get('/me/orders')
    return res.data
  },
}

export default orderService

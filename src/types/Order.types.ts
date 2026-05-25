import { UserRole } from './user.types'

export type OrderStatus = 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: 'Новый',
  PROCESSING: 'В обработке',
  SHIPPED: 'Отправлен',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменён',
}

export interface AdminOrderUser {
  id: number
  role: UserRole
  phoneNumber: string
  originalPhoneNumber: string
  phoneNumberVerified: boolean
  email: string
  emailVerified: boolean
  contactInfo: string
}

export interface AdminOrderProduct {
  id: number
  title: string
  isComplect: boolean
  currentPrice: number
  originalPrice: number
  currency: string
  sale: number
  description: string
  imageUrl: string
  useFillImage: boolean
  isSouvenir: boolean
  isAdvertisement: boolean
  advertisementType: string
  status: string
  quantityInStock: number
}

export interface AdminOrderItem {
  product: AdminOrderProduct
  count: number
}

export interface AdminOrder {
  id: number
  user: AdminOrderUser
  status: OrderStatus
  address: string
  createdAt: string
  items: AdminOrderItem[]
}

export interface AdminOrdersResponse {
  content: AdminOrder[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

export interface AdminOrdersParams {
  page?: number
  size?: number
  sort?: string
  direction?: string
  status?: string
}

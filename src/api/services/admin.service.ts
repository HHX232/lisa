import { axiosClassic } from '../helpers/api.interceptor'
import { UserRole } from '@/types/user.types'
import { Advertisement } from '@/types/Advertisement.types'
import { ProductFull, ProductStatus } from '@/types/Product.types'
import { AdminOrdersParams, AdminOrdersResponse, OrderStatus } from '@/types/Order.types'

export interface ProductRequestBody {
  id: number
  title: string
  description: string
  fullDescription: string
  isComplect: boolean
  quantityInStock: number
  complectItems: number[]
  sale: number
  currency: string
  useFillImage: boolean
  originalPrice: number
  inShops: string[]
  characteristics: { name: string; value: string }[]
  isSouvenir: boolean
  categoryId: number
  isAdvertisement: boolean
  advertisementType: string
  imagesMeta: { id: string | null; displayOrder: number; delete: boolean }[]
}

export interface AdvertisementBody {
  id: number
  title: string
  description: string
  specialLabel: string
  edgeColor: string
}

export interface AdminUser {
  id: number
  role: UserRole
  phoneNumber: string
  originalPhoneNumber: string
  phoneNumberVerified: boolean
  email: string
  emailVerified: boolean
  contactInfo: string
}

export interface AdminUsersResponse {
  content: AdminUser[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

export interface AdminUsersParams {
  search?: string
  role?: string
  phoneNumberVerified?: boolean
  emailVerified?: boolean
  sort?: string
  direction?: string
  page?: number
  size?: number
}

export interface UpdateAdminUserBody {
  role?: UserRole
  phoneNumber?: string
  phoneNumberVerified?: boolean
  email?: string
  emailVerified?: boolean
  contactInfo?: string
}

const adminService = {
  async getUsers(params: AdminUsersParams = {}) {
    const res = await axiosClassic.get<AdminUsersResponse>('/admin/users', { params })
    return res.data
  },

  async updateUser(id: number, body: UpdateAdminUserBody) {
    const res = await axiosClassic.put<AdminUser>(`/admin/users/${id}`, body)
    return res.data
  },

  async deleteUser(id: number) {
    await axiosClassic.delete(`/admin/users/${id}`)
  },

  async upsertAdvertisement(advertisement: AdvertisementBody, image?: File | null) {
    const formData = new FormData()
    formData.append('advertisement', new Blob([JSON.stringify(advertisement)], { type: 'application/json' }))
    if (image) {
      formData.append('image', image)
    }
    const payload = { ...advertisement, id: advertisement.id === 0 ? null : advertisement.id }
    formData.set('advertisement', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
    const res = await fetch(`/api/proxy/admin/advertisements`, {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<Advertisement>
  },

  async deleteAdvertisement(id: number) {
    await axiosClassic.delete(`/admin/advertisements/${id}`)
  },

  async deleteProduct(id: number) {
    await axiosClassic.delete(`/admin/products/${id}`)
  },

  async changeProductStatus(id: number, status: ProductStatus) {
    await axiosClassic.patch(`/admin/products/${id}/status`, { status })
  },

  async importProductsExcel(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`/api/proxy/admin/products/import/excel`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<{ message?: string }>
  },

  async upsertProduct(product: ProductRequestBody, images: File[]) {
    const payload = { ...product, id: product.id === 0 ? null : product.id }
    const formData = new FormData()
    formData.append('product', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
    images.forEach(img => formData.append('images', img))
    const res = await fetch(`/api/proxy/products`, {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<ProductFull>
  },

  async getAdminOrders(params: AdminOrdersParams = {}) {
    const res = await axiosClassic.get<AdminOrdersResponse>('/admin/orders', { params })
    return res.data
  },

  async changeOrderStatus(id: number, status: OrderStatus) {
    await axiosClassic.patch(`/admin/orders/${id}/status`, { status })
  },

  // ─── Reviews ──────────────────────────────────────────────────────────────

  async getAdminReviews(params: AdminReviewsParams = {}) {
    const res = await axiosClassic.get<AdminReviewsResponse>('/admin/product-reviews', { params })
    return res.data
  },

  async deleteAdminReview(id: number) {
    await axiosClassic.delete(`/admin/product-reviews/${id}`)
  },

  async changeReviewStatus(id: number, status: string) {
    await axiosClassic.patch(`/admin/product-reviews/${id}/status`, { status })
  },

  async updateAdminReview(productId: number, data: { text: string; stars: number; deleteImage?: boolean }, image?: File | null) {
    const fd = new FormData()
    fd.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
    if (image) fd.append('image', image)
    const res = await fetch(`/api/proxy/admin/product-reviews/${productId}`, {
      method: 'PUT',
      body: fd,
      credentials: 'include',
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  }
}

export default adminService

// ─── Review types ─────────────────────────────────────────────────────────────

export type ReviewStatus = 'PENDING' | 'ACTIVE' | 'REJECTED'

export interface AdminReview {
  id: number
  author: string
  status: ReviewStatus
  text: string
  image?: string
  stars: number
  createdAt: string
}

export interface AdminReviewsParams {
  productId?: number
  status?: string
  search?: string
  page?: number
  size?: number
}

export interface AdminReviewsResponse {
  content: AdminReview[]
  page: { size: number; number: number; totalElements: number; totalPages: number }
}

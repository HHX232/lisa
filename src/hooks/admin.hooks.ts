'use client'

import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import adminService, { AdminUsersParams, AdminReviewsParams, AdvertisementBody, ProductRequestBody, UpdateAdminUserBody } from '@/api/services/admin.service'
import advertisementService from '@/api/services/add.service'
import productService from '@/api/services/productService.service'
import { ProductStatus, ProductsRequestParams } from '@/types/Product.types'
import { AdminOrdersParams, OrderStatus } from '@/types/Order.types'

export const ADMIN_USERS_KEY = ['admin', 'users']
export const ADMIN_ADS_KEY = ['admin', 'advertisements']
export const ADMIN_ORDERS_KEY = ['admin', 'orders']
export const ADMIN_PRODUCTS_KEY = ['admin', 'products']
export const ADMIN_REVIEWS_KEY = ['admin', 'reviews']

// ─── Users ────────────────────────────────────────────────────────────────────

export function useAdminUsers(params: AdminUsersParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_USERS_KEY, params],
    queryFn: () => adminService.getUsers(params)
  })
}

export function useUpdateAdminUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateAdminUserBody }) =>
      adminService.updateUser(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_USERS_KEY })
  })
}

export function useDeleteAdminUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminService.deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_USERS_KEY })
  })
}

// ─── Advertisements ───────────────────────────────────────────────────────────

export function useAdminAdvertisements() {
  return useQuery({
    queryKey: ADMIN_ADS_KEY,
    queryFn: () => advertisementService.getAdvertisements(),
    select: (res) => res.data
  })
}

export function useUpsertAdvertisement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ advertisement, image }: { advertisement: AdvertisementBody; image?: File | null }) =>
      adminService.upsertAdvertisement(advertisement, image),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_ADS_KEY })
  })
}

export function useDeleteAdvertisement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminService.deleteAdvertisement(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_ADS_KEY })
  })
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function useAdminProducts(params: Omit<ProductsRequestParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: [...ADMIN_PRODUCTS_KEY, params],
    queryFn: ({ pageParam }) =>
      productService.getProducts({ ...params, page: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const data = lastPage.data
      if (!data || data.last || data.content.length === 0) return undefined
      return allPages.length
    },
    placeholderData: keepPreviousData,
    select: (res) => ({
      content: res.pages.flatMap(p => p.data?.content ?? []),
      totalElements: res.pages[0]?.data?.totalElements ?? 0,
    }),
  })
}

export function useDeleteAdminProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminService.deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY })
  })
}

export function useChangeProductStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ProductStatus }) =>
      adminService.changeProductStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY })
  })
}

export function useImportProductsExcel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => adminService.importProductsExcel(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY })
  })
}

export function useUpsertProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ product, images }: { product: ProductRequestBody; images: File[] }) =>
      adminService.upsertProduct(product, images),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_PRODUCTS_KEY })
  })
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export function useAdminOrders(params: AdminOrdersParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_ORDERS_KEY, params],
    queryFn: () => adminService.getAdminOrders(params)
  })
}

export function useChangeAdminOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      adminService.changeOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_ORDERS_KEY })
  })
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export function useAdminReviews(params: AdminReviewsParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_REVIEWS_KEY, params],
    queryFn: () => adminService.getAdminReviews(params),
    placeholderData: keepPreviousData,
  })
}

export function useDeleteAdminReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminService.deleteAdminReview(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEY })
  })
}

export function useChangeReviewStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminService.changeReviewStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEY })
  })
}

export function useUpdateAdminReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, data, images }: { productId: number; data: { text: string; stars: number; deleteImage?: boolean }; images?: File[] }) =>
      adminService.updateAdminReview(productId, data, images),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_REVIEWS_KEY })
  })
}

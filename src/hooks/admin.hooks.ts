'use client'

import { axiosClassic } from '@/api/helpers/api.interceptor'
import advertisementService from '@/api/services/add.service'
import adminService, { AdminReviewsParams, AdminSettingsBody, AdminUsersParams, AdvertisementBody, InstallmentCardBody, ProductRequestBody, UpdateAdminUserBody } from '@/api/services/admin.service'
import productService from '@/api/services/productService.service'
import { GiftCertificate, GiftCertificateBody } from '@/types/GiftCertificate.types'
import { AdminOrdersParams, OrderStatus } from '@/types/Order.types'
import { ProductStatus, ProductsRequestParams } from '@/types/Product.types'
import { StoneCategory, StoneCategoryBody } from '@/types/StoneCategory.types'
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const ADMIN_USERS_KEY = ['admin', 'users']
export const STONE_CATEGORIES_KEY = ['stone-categories']
export const GIFT_CERTIFICATES_KEY = ['gift-certificates']
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
export const useInstallmentCards = () =>
  useQuery({
    queryKey: ['admin', 'installment-cards'],
    queryFn: () => adminService.getInstallmentCards(),
  })

export const useUpsertInstallmentCard = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ card, image }: { card: InstallmentCardBody; image?: File | null }) =>
      adminService.upsertInstallmentCard(card, image),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'installment-cards'] }),
  })
}

export const useDeleteInstallmentCard = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminService.deleteInstallmentCard(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'installment-cards'] }),
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  totalElements: (res as any).pages[0]?.data?.page?.totalElements ?? 0,
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

// ─── Stone Categories ─────────────────────────────────────────────────────────

export function useStoneCategories() {
  return useQuery({
    queryKey: STONE_CATEGORIES_KEY,
    queryFn: async () => {
      const res = await axiosClassic.get<StoneCategory[]>('/stone-categories')
      return res.data
    },
    staleTime: Infinity,
  })
}
export const useAdminSettings = () =>
  useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => adminService.getAdminSettings(),
  })

export const useUpdateAdminSettings = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: AdminSettingsBody) => adminService.updateAdminSettings(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'settings'] }),
  })
}

export function useUpsertStoneCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ category, images }: { category: StoneCategoryBody; images: File[] }) =>
      adminService.upsertStoneCategory(category, images),
    onSuccess: () => qc.invalidateQueries({ queryKey: STONE_CATEGORIES_KEY }),
  })
}

export function useDeleteStoneCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminService.deleteStoneCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: STONE_CATEGORIES_KEY }),
  })
}

// ─── Gift Certificates ────────────────────────────────────────────────────────

export function useGiftCertificates() {
  return useQuery({
    queryKey: GIFT_CERTIFICATES_KEY,
    queryFn: async () => {
      const res = await axiosClassic.get<GiftCertificate[]>('/gift-certificates')
      return res.data
    },
    staleTime: Infinity,
  })
}

export function useUpsertGiftCertificate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ certificate, image }: { certificate: GiftCertificateBody; image?: File | null }) =>
      adminService.upsertGiftCertificate(certificate, image),
    onSuccess: () => qc.invalidateQueries({ queryKey: GIFT_CERTIFICATES_KEY }),
  })
}

export function useDeleteGiftCertificate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => adminService.deleteGiftCertificate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: GIFT_CERTIFICATES_KEY }),
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

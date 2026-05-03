'use client'

import userService from '@/api/services/user.service'
import { IUpdateContactInfo, IChangeEmail, IChangePhone } from '@/types/user.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'


export const USER_QUERY_KEY = ['me']
export const FAVORITES_QUERY_KEY = ['favorites']

// ─── Queries ───────────────────────────────────────────────────────────────

export function useMe() {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: () => userService.getMe(),
    select: (res) => res.data
  })
}

export function useFavoriteProducts() {
  return useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: () => userService.getFavoriteProducts()
  })
}

// ─── Mutations ─────────────────────────────────────────────────────────────

export function useUpdateContactInfo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: IUpdateContactInfo) => userService.updateContactInfo(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: USER_QUERY_KEY })
  })
}

export function useChangeEmail() {
  return useMutation({
    mutationFn: (body: IChangeEmail) => userService.changeEmail(body)
  })
}

export function useChangePhone() {
  return useMutation({
    mutationFn: (body: IChangePhone) => userService.changePhone(body)
  })
}

export function useVerifyEmail() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      userService.verifyEmail(email, otp),
    onSuccess: () => qc.invalidateQueries({ queryKey: USER_QUERY_KEY })
  })
}

export function useVerifyPhone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ phoneNumber, otp }: { phoneNumber: string; otp: string }) =>
      userService.verifyPhone(phoneNumber, otp),
    onSuccess: () => qc.invalidateQueries({ queryKey: USER_QUERY_KEY })
  })
}

export function useToggleFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => userService.toggleFavoriteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY })
  })
}
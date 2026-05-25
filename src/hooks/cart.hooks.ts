import cartService from '@/api/services/cart.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const CART_KEY = 'cart'

export const useCart = () => {
  return useQuery({
    queryKey: [CART_KEY],
    queryFn: () => cartService.getCart(),
  })
}

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, count }: { productId: number; count: number }) =>
      cartService.updateCartItem(productId, count),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CART_KEY] })
    },
  })
}

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: number) => cartService.removeCartItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CART_KEY] })
    },
  })
}

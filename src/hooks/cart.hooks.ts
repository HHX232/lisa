import cartService from '@/api/services/cart.service'
import { CartItemCard } from '@/types/Cart.types'
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
    onSuccess: (_, { productId, count }) => {
      const current = queryClient.getQueryData<CartItemCard[]>([CART_KEY])
      const exists = current?.some(item => item.id === productId)
      if (exists) {
        queryClient.setQueryData<CartItemCard[]>([CART_KEY], (old) =>
          old?.map(item => item.id === productId ? { ...item, count } : item)
        )
      } else {
        queryClient.invalidateQueries({ queryKey: [CART_KEY] })
      }
    },
  })
}

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: number) => cartService.removeCartItem(productId),
    onSuccess: (_, productId) => {
      queryClient.setQueryData<CartItemCard[]>([CART_KEY], (old) =>
        old?.filter(item => item.id !== productId)
      )
    },
  })
}

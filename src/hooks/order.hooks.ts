import orderService, { CreateOrderBody } from '@/api/services/order.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CART_KEY } from './cart.hooks'

export const ORDERS_KEY = 'orders'

export const useOrders = () => {
  return useQuery({
    queryKey: [ORDERS_KEY],
    queryFn: () => orderService.getOrders(),
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateOrderBody) => orderService.createOrder(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_KEY] })
      queryClient.invalidateQueries({ queryKey: [CART_KEY] })
    },
  })
}

import productService from '@/api/services/productService.service'
import { ProductsRequestParams, Product } from '@/types/Product.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const PRODUCTS_KEY = 'products'

export const useProducts = (params: ProductsRequestParams = {}, currentLang?: string) => {
  return useQuery({
    queryKey: [PRODUCTS_KEY, params, currentLang],
    queryFn: () => productService.getProducts(params, currentLang)
  })
}

export const useProductById = (id: number | string, currentLang?: string) => {
  return useQuery({
    queryKey: [PRODUCTS_KEY, id, currentLang],
    queryFn: () => productService.getProductById(id, currentLang),
    enabled: !!id
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({id, body, currentLang}: {id: number | string; body: Partial<Product>; currentLang?: string}) =>
      productService.updateProduct(id, body, currentLang),
    onSuccess: (_, {id}) => {
      queryClient.invalidateQueries({queryKey: [PRODUCTS_KEY]})
      queryClient.invalidateQueries({queryKey: [PRODUCTS_KEY, id]})
    }
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({id, currentLang}: {id: number | string; currentLang?: string}) =>
      productService.deleteProduct(id, currentLang),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [PRODUCTS_KEY]})
    }
  })
}
import { Product } from './Product.types'

export interface CartApiItem extends Product {
  count: number
  quantityInStock?: number
}

export interface CartItemCard extends Product {
  count: number
  stockCount: number
}

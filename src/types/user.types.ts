import { Product } from "./Product.types"

export type UserRole = 'ADMIN' | 'USER'

export interface IMe {
  id: number
  role: UserRole
  phoneNumber: string
  originalPhoneNumber: string
  phoneNumberVerified: boolean
  email: string
  emailVerified: boolean
  contactInfo: string
  name?: string
}

export interface IUpdateContactInfo {
  name?: string
  contactInfo: string
}

export interface IChangeEmail {
  email: string
}

export interface IChangePhone {
  phoneNumber: string
}

export type IFavoriteProducts = Product[]
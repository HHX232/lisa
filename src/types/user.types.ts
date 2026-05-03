import { Product } from "./Product.types"

export interface IMe {
  id: number
  phoneNumber: string
  originalPhoneNumber: string
  phoneNumberVerified: boolean
  email: string
  emailVerified: boolean
  contactInfo: string
}

export interface IUpdateContactInfo {
  contactInfo: string
}

export interface IChangeEmail {
  email: string
}

export interface IChangePhone {
  phoneNumber: string
}

export type IFavoriteProducts = Product[]
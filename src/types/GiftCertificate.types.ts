export interface GiftCertificate {
  id: number
  name: string
  description: string
  price: number
  currency: string
  imageUrl?: string
  gradient?: string
  textColor?: string
}

export interface GiftCertificateBody {
  id: number
  name: string
  description: string
  price: number
  gradient?: string
  textColor?: string
}

export interface StoneCategoryImage {
  id: string
  url: string
  displayOrder: number
}

export interface StoneCategory {
  id: number
  label: string
  slug: string
  images: StoneCategoryImage[]
  preview: string
}

export interface StoneCategoryImageMeta {
  id: string | null
  displayOrder: number
  delete: boolean | null
}

export interface StoneCategoryBody {
  id: number
  label: string
  slug: string
  imagesMeta: StoneCategoryImageMeta[]
}

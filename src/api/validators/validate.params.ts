import { SortField, SortDirection } from "@/types/Product.types"



const VALID_SORT_FIELDS: SortField[] = ['price', 'createdAt']
const VALID_DIRECTIONS: SortDirection[] = ['asc', 'desc']

function validatePage(value: string | undefined | number): number {
  if (value === undefined || value === null) return 0
  const parsed = parseInt(value.toString())
  if (isNaN(parsed) || parsed < 0) return 0
  return parsed
}

function validateSize(value: number | null | undefined): number {
  if (!value) return 10
  const parsed = Number(value)
  if (isNaN(parsed) || parsed < 1) return 10
  if (parsed > 100) return 100
  return parsed
}

function validateSortField(value: string | null | undefined): SortField | undefined {
  if (!value) return undefined
  return VALID_SORT_FIELDS.includes(value as SortField) ? (value as SortField) : undefined
}

function validateDirection(value: string | null | undefined): SortDirection | undefined {
  if (!value) return undefined
  return VALID_DIRECTIONS.includes(value as SortDirection) ? (value as SortDirection) : undefined
}

function validateBoolean(value: boolean | string | null | undefined): boolean | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  return undefined
}

function validatePrice(value: number | null | undefined): number | undefined {
  if (value === undefined || value === null) return undefined
  const parsed = Number(value)
  if (isNaN(parsed) || parsed < 0) return undefined
  return parsed
}

function validateTitle(value: string | null | undefined): string | undefined {
  if (!value || !value.trim()) return undefined
  return value.trim()
}

function validateAdvertisementType(value: string | null | undefined): string | undefined {
  if (!value || !value.trim()) return undefined
  return value.trim()
}

export {
   validateAdvertisementType, validateBoolean, validateDirection, validatePage, validatePrice, validateSize,
   validateSortField, validateTitle
}

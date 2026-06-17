const KEY = 'recently_viewed'
const MAX = 20

export interface RecentlyViewedItem {
  id: number
  title: string
  imageUrl: string
}

export function addToRecentlyViewed(item: RecentlyViewedItem): void {
  try {
    const raw = localStorage.getItem(KEY)
    const existing: RecentlyViewedItem[] = raw ? JSON.parse(raw) : []
    const filtered = existing.filter(i => i.id !== item.id)
    localStorage.setItem(KEY, JSON.stringify([item, ...filtered].slice(0, MAX)))
  } catch {}
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

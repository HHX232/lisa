import { axiosClassic } from '../helpers/api.interceptor'
import { StoneCategory } from '@/types/StoneCategory.types'

const stoneCategoryService = {
  async getStoneCategories() {
    let lastError: unknown
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await axiosClassic.get<StoneCategory[]>('/stone-categories', { timeout: 10000 })
      } catch (err) {
        lastError = err
        if (attempt < 2) await new Promise(r => setTimeout(r, 500 * (attempt + 1)))
      }
    }
    throw lastError
  },
}

export default stoneCategoryService

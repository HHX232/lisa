import { axiosClassic } from '../helpers/api.interceptor'
import { StoneCategory } from '@/types/StoneCategory.types'

const stoneCategoryService = {
  async getStoneCategories() {
    return axiosClassic.get<StoneCategory[]>('/stone-categories')
  },
}

export default stoneCategoryService

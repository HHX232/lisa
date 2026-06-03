import { Advertisement } from "@/types/Advertisement.types"
import { axiosClassic } from "../helpers/api.interceptor"

const advertisementService = {
  async getAdvertisements(currentLang?: string) {
    try {
      const res = await axiosClassic.get<Advertisement[]>('/advertisements', {
        headers: { 'Accept-Language': currentLang || 'en' }
      })
      return { data: res.data, isLoading: false, isError: false, error: null }
    } catch (err) {
      return { data: null, isLoading: false, isError: true, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  },

  async getAdvertisementById(id: number | string, currentLang?: string) {
    try {
      const res = await axiosClassic.get<Advertisement>(`/advertisements/${id}`, {
        headers: { 'Accept-Language': currentLang || 'en' }
      })
      return { data: res.data, isLoading: false, isError: false, error: null }
    } catch (err) {
      return { data: null, isLoading: false, isError: true, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }
}

export default advertisementService

import { axiosClassic } from "@/api/helpers/api.interceptor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export interface CategoryBody {
  id: number
  label: string
  slug: string
  imagesMeta: { id: string | null; displayOrder: number; delete: boolean | null }[]
}

export interface Category {
  id: number
  label: string
  slug: string
  images: { id: string; url: string; displayOrder: number }[]
  preview: string
}
// GET /api/admin/categories
export function useAdminCategories() {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => axiosClassic.get<Category[]>('/categories').then(r => r.data),
  })
}

// PUT /api/admin/categories
export function useUpsertCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ category, images }: { category: CategoryBody; images: File[] }) => {
      const fd = new FormData()
      fd.append('category', new Blob([JSON.stringify(category)], { type: 'application/json' }))
      images.forEach(f => fd.append('images', f))
      return axiosClassic.put<Category>('/admin/categories', fd).then(r => r.data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  })
}

// DELETE /api/admin/categories/{id}
export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => axiosClassic.delete(`/admin/categories/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'categories'] }),
  })
}
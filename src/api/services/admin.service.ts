import { Advertisement } from "@/types/Advertisement.types";
import {
  GiftCertificate,
  GiftCertificateBody,
} from "@/types/GiftCertificate.types";
import {
  AdminOrdersParams,
  AdminOrdersResponse,
  OrderStatus,
} from "@/types/Order.types";
import { ProductFull, ProductStatus } from "@/types/Product.types";
import { StoneCategory, StoneCategoryBody } from "@/types/StoneCategory.types";
import { UserRole } from "@/types/user.types";
import { axiosClassic } from "../helpers/api.interceptor";

export interface ProductRequestBody {
  id: number | null;
  title: string;
  description: string;
  fullDescription: string;
  isComplect: boolean;
  quantityInStock: number;
   article: string;
  complectItems: number[];
  sale: number;
  currency: string;
  useFillImage: boolean;
  originalPrice: number;
  inShops: string[];
  characteristics: { name: string; value: string }[];
  isSouvenir: boolean;
  categoryId: number;
  isAdvertisement: boolean;
   stoneCategoryId: number | null
  advertisementType: string;
  imagesMeta: { id: string | null; displayOrder: number; delete: boolean }[];
}
export interface AdminSettings {
  id: number
  phoneNumber: string
  email: string
}

export interface AdminSettingsBody {
  phoneNumber: string
  email: string
}

export interface AdvertisementBody {
  id: number;
  title: string;
  description: string;
  specialLabel: string;
  edgeColor: string;
  isActive: boolean;
  url: string;
  buttonUrl: string;
}

export interface InstallmentCard {
  id: number;
  image: string;
  address: string;
  period: string;
}

export interface InstallmentCardBody {
  id: number;
  address: string;
  period: string;
}

export interface AdminUser {
  id: number;
  role: UserRole;
  phoneNumber: string;
  originalPhoneNumber: string;
  phoneNumberVerified: boolean;
  email: string;
  emailVerified: boolean;
  contactInfo: string;
}

export interface AdminUsersResponse {
  content: AdminUser[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface AdminUsersParams {
  search?: string;
  role?: string;
  phoneNumberVerified?: boolean;
  emailVerified?: boolean;
  sort?: string;
  direction?: string;
  page?: number;
  size?: number;
}

export interface UpdateAdminUserBody {
  role?: UserRole;
  phoneNumber?: string;
  phoneNumberVerified?: boolean;
  email?: string;
  emailVerified?: boolean;
  contactInfo?: string;
}

const adminService = {
  async getUsers(params: AdminUsersParams = {}) {
    const res = await axiosClassic.get<AdminUsersResponse>("/admin/users", {
      params,
    });
    return res.data;
  },

  async updateUser(id: number, body: UpdateAdminUserBody) {
    const res = await axiosClassic.put<AdminUser>(`/admin/users/${id}`, body);
    return res.data;
  },

  async deleteUser(id: number) {
    await axiosClassic.delete(`/admin/users/${id}`);
  },
  async getInstallmentCards() {
    const res = await axiosClassic.get<InstallmentCard[]>(
      "/installment-cards",
    );
    return res.data;
  },
async getAdminSettings() {
  const res = await axiosClassic.get<AdminSettings>('/admin/admin-settings')
  return res.data
},

async updateAdminSettings(body: AdminSettingsBody) {
  const res = await axiosClassic.put<AdminSettings>('/admin/admin-settings', body)
  return res.data
},
  async upsertInstallmentCard(card: InstallmentCardBody, image?: File | null) {
    const payload = { ...card, id: card.id === 0 ? null : card.id };
    const fd = new FormData();
    fd.append(
      "data",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );
    if (image) fd.append("image", image);
    const res = await fetch(`/api/proxy/admin/installment-cards`, {
      method: "PUT",
      body: fd,
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<InstallmentCard>;
  },

  async deleteInstallmentCard(id: number) {
    await axiosClassic.delete(`/admin/installment-cards/${id}`);
  },
  async upsertAdvertisement(
    advertisement: AdvertisementBody,
    image?: File | null,
  ) {
    const formData = new FormData();
    formData.append(
      "advertisement",
      new Blob([JSON.stringify(advertisement)], { type: "application/json" }),
    );
    if (image) {
      formData.append("image", image);
    }
    const payload = {
      ...advertisement,
      id: advertisement.id === 0 ? null : advertisement.id,
    };
    formData.set(
      "advertisement",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );
    const res = await fetch(`/api/proxy/admin/advertisements`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<Advertisement>;
  },

  async deleteAdvertisement(id: number) {
    await axiosClassic.delete(`/admin/advertisements/${id}`);
  },

  async deleteProduct(id: number) {
    await axiosClassic.delete(`/admin/products/${id}`);
  },

  async changeProductStatus(id: number, status: ProductStatus) {
    await axiosClassic.patch(`/admin/products/${id}/status`, { status });
  },

  async importProductsExcel(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`/api/proxy/admin/products/import/excel`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<{ message?: string }>;
  },

  async upsertProduct(product: ProductRequestBody, images: File[]) {
    const payload = { ...product, id: product.id === 0 ? null : product.id };
    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );
    images.forEach((img) => formData.append("images", img));
    const res = await fetch(`/api/proxy/products`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<ProductFull>;
  },

  async getAdminOrders(params: AdminOrdersParams = {}) {
    const res = await axiosClassic.get<AdminOrdersResponse>("/admin/orders", {
      params,
    });
    return res.data;
  },

  async changeOrderStatus(id: number, status: OrderStatus) {
    await axiosClassic.patch(`/admin/orders/${id}/status`, { status });
  },

  // ─── Reviews ──────────────────────────────────────────────────────────────

  async getAdminReviews(params: AdminReviewsParams = {}) {
    const res = await axiosClassic.get<AdminReviewsResponse>(
      "/admin/product-reviews",
      { params },
    );
    return res.data;
  },

  async deleteAdminReview(id: number) {
    await axiosClassic.delete(`/admin/product-reviews/${id}`);
  },

  async changeReviewStatus(id: number, status: string) {
    await axiosClassic.patch(`/admin/product-reviews/${id}/status`, { status });
  },

  // ─── Stone Categories ──────────────────────────────────────────────────────

  async upsertStoneCategory(category: StoneCategoryBody, images: File[]) {
    const payload = { ...category, id: category.id === 0 ? null : category.id };
    const fd = new FormData();
    fd.append(
      "category",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );
    images.forEach((img) => fd.append("images", img));
    const res = await fetch(`/api/proxy/admin/stone-categories`, {
      method: "PUT",
      body: fd,
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<StoneCategory>;
  },

  async deleteStoneCategory(id: number) {
    await axiosClassic.delete(`/admin/stone-categories/${id}`);
  },

  // ─── Gift Certificates ────────────────────────────────────────────────────

  async upsertGiftCertificate(
    certificate: GiftCertificateBody,
    image?: File | null,
  ) {
    const payload = {
      ...certificate,
      id: certificate.id === 0 ? null : certificate.id,
    };
    const fd = new FormData();
    fd.append(
      "certificate",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );
    if (image) fd.append("image", image);
    const res = await fetch(`/api/proxy/admin/gift-certificates`, {
      method: "PUT",
      body: fd,
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<GiftCertificate>;
  },

  async deleteGiftCertificate(id: number) {
    await axiosClassic.delete(`/admin/gift-certificates/${id}`);
  },

  async updateAdminReview(
    productId: number,
    data: { text: string; stars: number; deleteImage?: boolean },
    images?: File[],
  ) {
    const fd = new FormData();
    fd.append(
      "data",
      new Blob([JSON.stringify(data)], { type: "application/json" }),
    );
    images?.forEach((img) => fd.append("image", img));
    const res = await fetch(`/api/proxy/admin/product-reviews/${productId}`, {
      method: "PUT",
      body: fd,
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

export default adminService;

// ─── Review types ─────────────────────────────────────────────────────────────

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminReview {
  id: number;
  author: string;
  status: ReviewStatus;
  text: string;
  image?: string;
  stars: number;
  createdAt: string;
}

export interface AdminReviewsParams {
  productId?: number;
  status?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface AdminReviewsResponse {
  content: AdminReview[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

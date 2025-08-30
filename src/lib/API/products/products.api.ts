import { apiFetch } from "../core/api-fetch";
import { ProductCategory, ProductOrigin } from "@/types/enum";
import { CreateProductDto, ProductFilterDto, ProductResponseDto, UpdateProductDto } from "@/types/product";

export const productsApi = {
  getAll: (params: ProductFilterDto = {}) => {
    const searchParams = new URLSearchParams();
   
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    const queryString = searchParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ""}`;
   
    return apiFetch<ProductResponseDto[]>(endpoint);
  },

  getById: (id: number) =>
    apiFetch<ProductResponseDto>(`/products/${id.toString()}`),

  getBySlug: (slug: string) =>
    apiFetch<ProductResponseDto>(`/products/slug/${slug}`),

  search: (query: string, params: Omit<ProductFilterDto, 'search'> = {}) => {
    const searchParams = new URLSearchParams({ q: query });
   
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    return apiFetch<ProductResponseDto[]>(`/products/search?${searchParams.toString()}`);
  },

  getByCategory: (category: ProductCategory, params: Omit<ProductFilterDto, 'category'> = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    
    const queryString = searchParams.toString();
    return apiFetch<ProductResponseDto[]>(`/products/category/${category}${queryString ? `?${queryString}` : ""}`);
  },

  getBySupplierId: (supplierId: number, params: Omit<ProductFilterDto, 'supplierId'> = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    
    const queryString = searchParams.toString();
    return apiFetch<ProductResponseDto[]>(`/products/supplier/${supplierId.toString()}${queryString ? `?${queryString}` : ""}`);
  },

  getByOrigin: (origin: ProductOrigin, params: Omit<ProductFilterDto, 'origin'> = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    
    const queryString = searchParams.toString();
    return apiFetch<ProductResponseDto[]>(`/products/origin/${origin}${queryString ? `?${queryString}` : ""}`);
  },

  create: (data: CreateProductDto, token: string) =>
    apiFetch<ProductResponseDto>("/products", { method: "POST", body: { ...data }, token }),

  update: (id: number, data: UpdateProductDto, token: string) =>
    apiFetch<ProductResponseDto>(`/products/${id.toString()}`, { method: "PATCH", body: { ...data }, token }),

  delete: (id: number, token: string) =>
    apiFetch<void>(`/products/${id.toString()}`, {
      method: "DELETE",
      token,
    }),
};

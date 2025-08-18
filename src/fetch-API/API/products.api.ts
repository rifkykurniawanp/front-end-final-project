import { apiFetch } from "./api-fetch";
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
    const endpoint = `/api/products${queryString ? `?${queryString}` : ""}`;
    
    return apiFetch<ProductResponseDto[]>(endpoint);
  },

  getById: (id: number) =>
    apiFetch<ProductResponseDto>(`/api/products/${id}`),

  getBySlug: (slug: string) =>
    apiFetch<ProductResponseDto>(`/api/products/slug/${slug}`),

  search: (query: string, params: Omit<ProductFilterDto, 'search'> = {}) => {
    const searchParams = new URLSearchParams({ search: query });
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    return apiFetch<ProductResponseDto[]>(`/api/products/search?${searchParams.toString()}`);
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
    const endpoint = `/api/products/category/${category}${queryString ? `?${queryString}` : ""}`;
    
    return apiFetch<ProductResponseDto[]>(endpoint);
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
    const endpoint = `/api/products/supplier/${supplierId}${queryString ? `?${queryString}` : ""}`;
    
    return apiFetch<ProductResponseDto[]>(endpoint);
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
    const endpoint = `/api/products/origin/${origin}${queryString ? `?${queryString}` : ""}`;
    
    return apiFetch<ProductResponseDto[]>(endpoint);
  },

  create: (data: CreateProductDto, token: string) =>
    apiFetch<ProductResponseDto>("/api/products", {
      method: "POST",
      body: data,
      token,
    }),

  update: (id: number, data: UpdateProductDto, token: string) =>
    apiFetch<ProductResponseDto>(`/api/products/${id}`, {
      method: "PUT",
      body: data,
      token,
    }),

 
  delete: (id: number, token: string) =>
    apiFetch<void>(`/api/products/${id}`, {
      method: "DELETE",
      token,
    }),
};

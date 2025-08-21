import { apiFetch } from "../core/api-fetch";
import { CreateProductOrderDto, UpdateProductOrderDto, ProductOrderResponseDto } from "@/types/order";

export const productOrdersApi = {
  // Get all orders (ADMIN only)
  getAll: (token: string) =>
    apiFetch<ProductOrderResponseDto[]>(`/product-orders`, { token }),

  // Get order by ID
  getById: (id: number, token: string) =>
    apiFetch<ProductOrderResponseDto>(`/product-orders/${id}`, { token }),

  // Create new order
  create: (data: CreateProductOrderDto, token: string) =>
    apiFetch<ProductOrderResponseDto>("/product-orders", {
      method: "POST",
      body: data,
      token,
    }),

  // Update order (ADMIN only)
  update: (id: number, data: UpdateProductOrderDto, token: string) =>
    apiFetch<ProductOrderResponseDto>(`/product-orders/${id}`, {
      method: "PUT",
      body: data,
      token,
    }),

  // Delete order (ADMIN only)  
  delete: (id: number, token: string) =>
    apiFetch<void>(`/product-orders/${id}`, {
      method: "DELETE",
      token,
    }),
};
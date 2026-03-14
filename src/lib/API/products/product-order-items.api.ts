import { apiFetch } from "../core/api-fetch";
import {
  CreateProductOrderItemDto,
  UpdateProductOrderDto,
  ProductOrderResponseDto,
} from "@/types/order";

export const productOrderItemsApi = {
  // Get all order items
  getAll: (token: string) =>
    apiFetch<CreateProductOrderItemDto[]>(`/product-order-items`, { token }),

  // Get single order item by ID
  getById: (id: number, token: string) =>
    apiFetch<CreateProductOrderItemDto>(`/product-order-items/${id}`, { token }),

  // Update order item
  update: (id: number, data: UpdateProductOrderDto, token: string) =>
    apiFetch<ProductOrderResponseDto>(`/product-order-items/${id}`, {
      method: "PATCH",
      body: { ...data },
      token,
    }),
};
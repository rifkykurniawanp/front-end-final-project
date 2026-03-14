import { apiFetch } from "../core/api-fetch";
import {
  CreateProductOrderDto,
  UpdateProductOrderDto,
  ProductOrderResponseDto,
  OrderFilterDto,
} from "@/types/order";
import { OrderStatus } from "@/types/enum";

export const productOrdersApi = {
  // Get all orders (ADMIN only)
  getAll: (token: string, params: OrderFilterDto = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    const queryString = searchParams.toString();
    const endpoint = `/orders${queryString ? `?${queryString}` : ""}`;
    return apiFetch<ProductOrderResponseDto[]>(endpoint, { token });
  },

  // Get order by ID
  getById: (id: number, token: string) =>
    apiFetch<ProductOrderResponseDto>(`/orders/${id}`, { token }),

  // Create new order
  create: (data: CreateProductOrderDto, token: string) =>
    apiFetch<ProductOrderResponseDto>("/orders", {
      method: "POST",
      body: { ...data },
      token,
    }),

  // Update order status
  updateStatus: (id: number, data: UpdateProductOrderDto, token: string) =>
    apiFetch<ProductOrderResponseDto>(`/orders/${id}`, {
      method: "PUT",
      body: { ...data },
      token,
    }),

  // Cancel order
  cancel: (id: number, token: string) =>
    apiFetch<void>(`/orders/${id}`, {
      method: "DELETE",
      token,
    }),

  // Get orders by user ID
  getByUserId: (
    userId: number,
    token: string,
    params: Omit<OrderFilterDto, "buyerId"> = {}
  ) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    const queryString = searchParams.toString();
    const endpoint = `/orders/user/${userId}${queryString ? `?${queryString}` : ""}`;
    return apiFetch<ProductOrderResponseDto[]>(endpoint, { token });
  },

  // Get orders by supplier ID
  getBySupplierId: (
    supplierId: number,
    token: string,
    params: Omit<OrderFilterDto, "supplierId"> = {}
  ) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    const queryString = searchParams.toString();
    const endpoint = `/orders/supplier/${supplierId}${queryString ? `?${queryString}` : ""}`;
    return apiFetch<ProductOrderResponseDto[]>(endpoint, { token });
  },

  // Get orders by status
  getByStatus: (
    status: OrderStatus,
    token: string,
    params: Omit<OrderFilterDto, "status"> = {}
  ) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    const queryString = searchParams.toString();
    const endpoint = `/orders/status/${status}${queryString ? `?${queryString}` : ""}`;
    return apiFetch<ProductOrderResponseDto[]>(endpoint, { token });
  },
};
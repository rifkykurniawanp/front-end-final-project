import { apiFetch } from "../core/api-fetch";
import { CreateProductOrderItemDto } from "@/types/order";
import { OrderStatus } from "@/types/enum";
import { CreateProductOrderDto, OrderFilterDto, ProductOrderResponseDto, UpdateProductOrderDto, ProductOrderItem } from "@/types/order";

export const productOrdersApi = {
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

  getById: (id: number, token: string) =>
    apiFetch<ProductOrderResponseDto>(`/orders/${id}`, { token }),

  create: (data: CreateProductOrderDto, token: string) =>
    apiFetch<ProductOrderResponseDto>("/orders", {
      method: "POST",
      body: data,
      token,
    }),

  updateStatus: (id: number, data: UpdateProductOrderDto, token: string) =>
    apiFetch<ProductOrderResponseDto>(`/orders/${id}`, {
      method: "PUT",
      body: data,
      token,
    }),

  cancel: (id: number, token: string) =>
    apiFetch<void>(`/orders/${id}`, {
      method: "DELETE",
      token,
    }),

  getItems: (id: number, token: string) =>
    apiFetch<CreateProductOrderItemDto[]>(`/orders/${id}/items`, { token }),

  getByUserId: (userId: number, token: string, params: Omit<OrderFilterDto, 'buyerId'> = {}) => {
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

  getBySupplierId: (supplierId: number, token: string, params: Omit<OrderFilterDto, 'supplierId'> = {}) => {
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

  getByStatus: (status: OrderStatus, token: string, params: Omit<OrderFilterDto, 'status'> = {}) => {
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

import { apiFetch } from "./api-fetch";
import { CreateProductOrderItemDto } from "@/types";
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
    const endpoint = `/api/v1/orders${queryString ? `?${queryString}` : ""}`;
    
    return apiFetch<ProductOrderResponseDto[]>(endpoint, { token });
  },

  /**
   * Fetches an order by its ID.
   * @param id The order ID.
   * @param token The bearer token.
   * @returns A promise of a single product order.
   */
  getById: (id: number, token: string) =>
    apiFetch<ProductOrderResponseDto>(`/api/v1/orders/${id}`, { token }),

  /**
   * Creates a new order.
   * @param data The order creation data.
   * @param token The bearer token.
   * @returns A promise of the newly created order.
   */
  create: (data: CreateProductOrderDto, token: string) =>
    apiFetch<ProductOrderResponseDto>("/api/v1/orders", {
      method: "POST",
      body: data,
      token,
    }),

  /**
   * Updates the status of an order.
   * @param id The order ID.
   * @param data The order update data (e.g., new status).
   * @param token The bearer token.
   * @returns A promise of the updated product order.
   */
  updateStatus: (id: number, data: UpdateProductOrderDto, token: string) =>
    apiFetch<ProductOrderResponseDto>(`/api/v1/orders/${id}`, {
      method: "PUT",
      body: data,
      token,
    }),

  /**
   * Cancels an order.
   * @param id The order ID.
   * @param token The bearer token.
   * @returns A promise that resolves when the delete operation is successful.
   */
  cancel: (id: number, token: string) =>
    apiFetch<void>(`/api/v1/orders/${id}`, {
      method: "DELETE",
      token,
    }),

  /**
   * Fetches the items within a specific order.
   * @param id The order ID.
   * @param token The bearer token.
   * @returns A promise of an array of order items.
   */
  getItems: (id: number, token: string) =>
    apiFetch<CreateProductOrderItemDto[]>(`/api/v1/orders/${id}/items`, { token }),

  /**
   * Fetches orders by a user ID with optional filters.
   * @param userId The user ID.
   * @param token The bearer token.
   * @param params Optional filter parameters.
   * @returns A promise of an array of product orders.
   */
  getByUserId: (userId: number, token: string, params: Omit<OrderFilterDto, 'buyerId'> = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/orders/user/${userId}${queryString ? `?${queryString}` : ""}`;
    
    return apiFetch<ProductOrderResponseDto[]>(endpoint, { token });
  },

  /**
   * Fetches orders by a supplier ID with optional filters.
   * @param supplierId The supplier ID.
   * @param token The bearer token.
   * @param params Optional filter parameters.
   * @returns A promise of an array of product orders.
   */
  getBySupplierId: (supplierId: number, token: string, params: Omit<OrderFilterDto, 'supplierId'> = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/orders/supplier/${supplierId}${queryString ? `?${queryString}` : ""}`;
    
    return apiFetch<ProductOrderResponseDto[]>(endpoint, { token });
  },

  /**
   * Fetches orders by status with optional filters.
   * @param status The order status.
   * @param token The bearer token.
   * @param params Optional filter parameters.
   * @returns A promise of an array of product orders.
   */
  getByStatus: (status: OrderStatus, token: string, params: Omit<OrderFilterDto, 'status'> = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/orders/status/${status}${queryString ? `?${queryString}` : ""}`;
    
    return apiFetch<ProductOrderResponseDto[]>(endpoint, { token });
  },
};

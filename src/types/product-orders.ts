const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://final-project-be-rifkykurniawanp-production.up.railway.app";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: any;
  token?: string;
  headers?: Record<string, string>;
}

async function apiFetch<T>(
  endpoint: string,
  { method = "GET", body, token, headers }: FetchOptions = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error: ${res.status} - ${errorText}`);
  }

  return res.json() as Promise<T>;
}

// ==============================
// PRODUCT ORDERS API INTERFACES (Updated)
// ==============================

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export interface ProductOrderResponseDto {
  id: number;
  buyerId: number;
  paymentId: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  buyer?: {
    id: number;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    address?: string;
  };
  payment?: {
    id: number;
    amount: number;
    paymentMethod: string;
    status: string;
    paidAt?: string;
  };
  items?: ProductOrderItemResponseDto[];
}

export interface ProductOrderItemResponseDto {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  priceEach: number;
  product?: {
    id: number;
    name: string;
    slug: string;
    image?: string;
    category: string;
    supplierId: number;
  };
}

export interface CreateProductOrderDto {
  paymentId: number;
  items: {
    productId: number;
    quantity: number;
    priceEach: number;
  }[];
}

export interface UpdateProductOrderDto {
  status?: OrderStatus;
}

export interface OrderFilterParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  buyerId?: number;
  supplierId?: number;
  dateFrom?: string;
  dateTo?: string;
}

// ==============================
// PRODUCT ORDERS API WRAPPER (Updated Routes)
// ==============================

export const productOrdersApi = {
  // Get all orders (ADMIN only)
  getAll: (token: string, params: OrderFilterParams = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/orders?${queryString}` : "/api/orders";
    
    return apiFetch<ProductOrderResponseDto[]>(endpoint, { token });
  },

  // Get order by ID (ADMIN, Own USER)
  getById: (id: number, token: string) =>
    apiFetch<ProductOrderResponseDto>(`/api/orders/${id}`, { token }),

  // Create new order (USER - Buyer)
  create: (data: CreateProductOrderDto, token: string) =>
    apiFetch<ProductOrderResponseDto>("/api/orders", {
      method: "POST",
      body: data,
      token,
    }),

  // Update order status (ADMIN, SUPPLIER)
  updateStatus: (id: number, data: UpdateProductOrderDto, token: string) =>
    apiFetch<ProductOrderResponseDto>(`/api/orders/${id}`, {
      method: "PUT",
      body: data,
      token,
    }),

  // Cancel order (ADMIN, Own USER)
  cancel: (id: number, token: string) =>
    apiFetch<void>(`/api/orders/${id}`, {
      method: "DELETE",
      token,
    }),

  // Get order items (ADMIN, Own USER)
  getItems: (id: number, token: string) =>
    apiFetch<ProductOrderItemResponseDto[]>(`/api/orders/${id}/items`, { token }),

  // Get orders by user (ADMIN, Own USER)
  getByUserId: (userId: number, token: string, params: Omit<OrderFilterParams, 'buyerId'> = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString 
      ? `/api/orders/user/${userId}?${queryString}` 
      : `/api/orders/user/${userId}`;
    
    return apiFetch<ProductOrderResponseDto[]>(endpoint, { token });
  },

  // Get orders by supplier (ADMIN, Own SUPPLIER)
  getBySupplierId: (supplierId: number, token: string, params: Omit<OrderFilterParams, 'supplierId'> = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString 
      ? `/api/orders/supplier/${supplierId}?${queryString}` 
      : `/api/orders/supplier/${supplierId}`;
    
    return apiFetch<ProductOrderResponseDto[]>(endpoint, { token });
  },

  // Get orders by status (ADMIN)
  getByStatus: (status: OrderStatus, token: string, params: Omit<OrderFilterParams, 'status'> = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString 
      ? `/api/orders/status/${status}?${queryString}` 
      : `/api/orders/status/${status}`;
    
    return apiFetch<ProductOrderResponseDto[]>(endpoint, { token });
  },
};
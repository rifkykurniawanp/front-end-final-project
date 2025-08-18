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
// PRODUCT REVIEWS API INTERFACES (Updated Routes)
// ==============================

export interface ProductReviewResponseDto {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: {
    id: number;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  product?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface CreateProductReviewDto {
  rating: number;
  comment?: string;
}

export interface UpdateProductReviewDto {
  rating?: number;
  comment?: string;
}

export interface ProductReviewsStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number; // rating: count
  };
}

// ==============================
// PRODUCT REVIEWS API WRAPPER (Updated Routes)
// ==============================

export const productReviewsApi = {
  // Get product reviews (Public)
  getByProductId: (productId: number, params: { page?: number; limit?: number } = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString 
      ? `/api/products/${productId}/reviews?${queryString}`
      : `/api/products/${productId}/reviews`;
    
    return apiFetch<ProductReviewResponseDto[]>(endpoint);
  },

  // Add product review (USER - Buyer only)
  create: (productId: number, data: CreateProductReviewDto, token: string) =>
    apiFetch<ProductReviewResponseDto>(`/api/products/${productId}/reviews`, {
      method: "POST",
      body: data,
      token,
    }),

  // Get average rating for a product (Public)
  getAverageRating: (productId: number) =>
    apiFetch<number>(`/api/products/${productId}/reviews/average`),

  // Get review by ID (Public)
  getById: (id: number) =>
    apiFetch<ProductReviewResponseDto>(`/api/reviews/${id}`),

  // Update review (ADMIN, Own USER only)
  update: (reviewId: number, data: UpdateProductReviewDto, token: string) =>
    apiFetch<ProductReviewResponseDto>(`/api/reviews/${reviewId}`, {
      method: "PUT",
      body: data,
      token,
    }),

  // Delete review (ADMIN, Own USER only)
  delete: (reviewId: number, token: string) =>
    apiFetch<void>(`/api/reviews/${reviewId}`, {
      method: "DELETE",
      token,
    }),

  // Get user's reviews (ADMIN, Own USER only)
  getByUserId: (userId: number, token: string, params: { page?: number; limit?: number } = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString 
      ? `/api/users/${userId}/reviews?${queryString}`
      : `/api/users/${userId}/reviews`;
    
    return apiFetch<ProductReviewResponseDto[]>(endpoint, { token });
  },

  // Get product review statistics (Public)
  getProductStats: (productId: number) =>
    apiFetch<ProductReviewsStats>(`/api/products/${productId}/reviews/stats`),
};
import { apiFetch } from "../core/api-fetch";
import { ProductReviewsStats, CreateProductReviewDto, UpdateProductReviewDto, ProductReviewResponseDto } from "@/types/product-reviews.api";

export const productReviewsApi = {
 
  getByProductId: (productId: number, params: { page?: number; limit?: number } = {}) => {
    const searchParams = new URLSearchParams();
   
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
   
    const queryString = searchParams.toString();
    const endpoint = `/products/${productId}/reviews${queryString ? `?${queryString}` : ""}`;
   
    return apiFetch<ProductReviewResponseDto[]>(endpoint);
  },

  create: (productId: number, data: CreateProductReviewDto, token: string) =>
    apiFetch<ProductReviewResponseDto>(`/products/${productId}/reviews`, {
      method: "POST",
      body: data,
      token,
    }),

  getAverageRating: (productId: number) =>
    apiFetch<number>(`/products/${productId}/reviews/average`),
  getById: (id: number) =>
    apiFetch<ProductReviewResponseDto>(`/reviews/${id}`),

  update: (reviewId: number, data: UpdateProductReviewDto, token: string) =>
    apiFetch<ProductReviewResponseDto>(`/reviews/${reviewId}`, {
      method: "PUT",
      body: data,
      token,
    }),

  delete: (reviewId: number, token: string) =>
    apiFetch<void>(`/reviews/${reviewId}`, {
      method: "DELETE",
      token,
    }),

  
  getByUserId: (userId: number, token: string, params: { page?: number; limit?: number } = {}) => {
    const searchParams = new URLSearchParams();
   
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
   
    const queryString = searchParams.toString();
    // FIXED: Remove /v1 from endpoint since it's already in API_VERSION
    const endpoint = `/users/${userId}/reviews${queryString ? `?${queryString}` : ""}`;
   
    return apiFetch<ProductReviewResponseDto[]>(endpoint, { token });
  },

  getProductStats: (productId: number) =>
    apiFetch<ProductReviewsStats>(`/products/${productId}/reviews/stats`),
};
import { apiFetch } from "../core/api-fetch";
import { ProductReviewsStats, CreateProductReviewDto, UpdateProductReviewDto, ProductReviewResponseDto } from "@/types/product-reviews.api";

export const productReviewsApi = {
 
  getByProductId: (productId: number, params: { page?: number; limit?: number } = {}) => {
    const searchParams = new URLSearchParams();
   
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
   
    const queryString = searchParams.toString();
    const endpoint = `/product-reviews/product/${productId}${queryString ? `?${queryString}` : ""}`;
   
    return apiFetch<ProductReviewResponseDto[]>(endpoint);
  },

  create: (userId: number, data: CreateProductReviewDto, token: string) =>
    apiFetch<ProductReviewResponseDto>(`/product-reviews?userId=${userId}`, {
      method: "POST",
      body: data,
      token,
    }),

  getAverageRating: (productId: number) =>
    apiFetch<number>(`/product-reviews/product/${productId}/average-rating`),

  getById: (reviewId: number) =>
    apiFetch<ProductReviewResponseDto>(`/product-reviews/${reviewId}`),

  update: (reviewId: number, data: UpdateProductReviewDto, token: string) =>
    apiFetch<ProductReviewResponseDto>(`/product-reviews/${reviewId}`, {
      method: "PATCH",
      body: data,
      token,
    }),

  delete: (reviewId: number, token: string) =>
    apiFetch<void>(`/product-reviews/${reviewId}`, {
      method: "DELETE",
      token,
    }),
 
  getByUserId: (userId: number, token: string, params: { page?: number; limit?: number } = {}) => {
    const searchParams = new URLSearchParams();
   
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
   
    const queryString = searchParams.toString();
    const endpoint = `/product-reviews/user/${userId}${queryString ? `?${queryString}` : ""}`;
   
    return apiFetch<ProductReviewResponseDto[]>(endpoint, { token });
  },

  // Note: This endpoint doesn't exist in backend - you may need to add it
  getProductStats: (productId: number) =>
    apiFetch<ProductReviewsStats>(`/product-reviews/product/${productId}/stats`),
};
import { apiFetch } from "./api-fetch";
import { ProductReviewsStats, CreateProductReviewDto, UpdateProductReviewDto, ProductReviewResponseDto } from "@/types/product-reviews.api";

// ==============================
// PRODUCT REVIEWS API WRAPPER
// ==============================

export const productReviewsApi = {
  /**
   * Fetches product reviews by product ID with optional pagination.
   * @param productId The ID of the product.
   * @param params Optional pagination parameters.
   * @returns A promise of an array of product reviews.
   */
  getByProductId: (productId: number, params: { page?: number; limit?: number } = {}) => {
    const searchParams = new URLSearchParams();
   
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
   
    const queryString = searchParams.toString();
    // FIXED: Remove /v1 from endpoint since it's already in API_VERSION
    const endpoint = `/products/${productId}/reviews${queryString ? `?${queryString}` : ""}`;
   
    return apiFetch<ProductReviewResponseDto[]>(endpoint);
  },

  /**
   * Creates a new product review for a specific product.
   * @param productId The ID of the product.
   * @param data The review creation data.
   * @param token The bearer token.
   * @returns A promise of the newly created product review.
   */
  create: (productId: number, data: CreateProductReviewDto, token: string) =>
    // FIXED: Remove /v1 from endpoint since it's already in API_VERSION
    apiFetch<ProductReviewResponseDto>(`/products/${productId}/reviews`, {
      method: "POST",
      body: data,
      token,
    }),

  /**
   * Fetches the average rating for a product.
   * @param productId The ID of the product.
   * @returns A promise of the average rating.
   */
  getAverageRating: (productId: number) =>
    // FIXED: Remove /v1 from endpoint since it's already in API_VERSION
    apiFetch<number>(`/products/${productId}/reviews/average`),

  /**
   * Fetches a single review by its ID.
   * @param id The review ID.
   * @returns A promise of a single product review.
   */
  getById: (id: number) =>
    // FIXED: Remove /v1 from endpoint since it's already in API_VERSION
    apiFetch<ProductReviewResponseDto>(`/reviews/${id}`),

  /**
   * Updates an existing review.
   * @param reviewId The ID of the review to update.
   * @param data The review update data.
   * @param token The bearer token.
   * @returns A promise of the updated product review.
   */
  update: (reviewId: number, data: UpdateProductReviewDto, token: string) =>
    // FIXED: Remove /v1 from endpoint since it's already in API_VERSION
    apiFetch<ProductReviewResponseDto>(`/reviews/${reviewId}`, {
      method: "PUT",
      body: data,
      token,
    }),

  /**
   * Deletes a review.
   * @param reviewId The ID of the review to delete.
   * @param token The bearer token.
   * @returns A promise that resolves when the delete operation is successful.
   */
  delete: (reviewId: number, token: string) =>
    // FIXED: Remove /v1 from endpoint since it's already in API_VERSION
    apiFetch<void>(`/reviews/${reviewId}`, {
      method: "DELETE",
      token,
    }),

  /**
   * Fetches a user's reviews with optional pagination.
   * @param userId The ID of the user.
   * @param token The bearer token.
   * @param params Optional pagination parameters.
   * @returns A promise of an array of product reviews.
   */
  getByUserId: (userId: number, token: string, params: { page?: number; limit?: number } = {}) => {
    const searchParams = new URLSearchParams();
   
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
   
    const queryString = searchParams.toString();
    // FIXED: Remove /v1 from endpoint since it's already in API_VERSION
    const endpoint = `/users/${userId}/reviews${queryString ? `?${queryString}` : ""}`;
   
    return apiFetch<ProductReviewResponseDto[]>(endpoint, { token });
  },

  /**
   * Fetches product review statistics.
   * @param productId The ID of the product.
   * @returns A promise of product review statistics.
   * NOTE: This endpoint might not exist in the current API documentation
   */
  getProductStats: (productId: number) =>
    // FIXED: Remove /v1 from endpoint since it's already in API_VERSION
    apiFetch<ProductReviewsStats>(`/products/${productId}/reviews/stats`),
};
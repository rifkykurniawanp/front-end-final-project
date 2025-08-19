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
    [key: number]: number;
  };
}
import { ProductCategory, ProductOrigin, ProductStatus, ProductTagName } from './enum';
import type { User } from './user';

export interface Product {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  image?: string | null;
  category: ProductCategory;
  status: ProductStatus;
  supplierId: number;
  rating: number;
  reviewCount: number;
  origin: ProductOrigin;
  weight?: string | null;
  tags: ProductTagName[];
  createdAt: Date;
}

export interface ProductWithRelations extends Product {
  supplier?: User;
  reviews?: ProductReview[];
  cartItems?: CartItem[];
  orderItems?: ProductOrderItem[];
}

export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment?: string | null;
  createdAt: Date;
  product?: Product;
  user?: User;
}

export interface CreateProductDto {
  slug: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image?: string;
  category: ProductCategory;
  status?: ProductStatus;
  supplierId: number;
  origin: ProductOrigin;
  weight?: string;
  tags?: ProductTagName[];
}

export interface UpdateProductDto {
  slug?: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  image?: string;
  category?: ProductCategory;
  status?: ProductStatus;
  origin?: ProductOrigin;
  weight?: string;
  tags?: ProductTagName[];
}

export interface CreateProductReviewDto {
  productId: number;
  rating: number;
  comment?: string;
}

export interface ProductResponseDto extends Product {
  supplier?: User;
  reviews?: ProductReview[];
}

export interface UpdateProductReviewDto {
  rating?: number;
  comment?: string;
}

// For filtering and searching
export interface ProductFilterDto {
  category?: ProductCategory[];
  origin?: ProductOrigin[];
  tags?: ProductTagName[];
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus[];
  search?: string;
  supplierId?: number;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

import type { CartItem } from './cart';
import type { ProductOrderItem } from './order';
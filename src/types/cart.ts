// =================== cart.types.ts - SYNCED WITH BACKEND ===================

import { CartItemType } from './enum';
import type { User } from './user';
import type { Product } from './product';
import type { Course } from './course';
import type { Payment } from './payment';

// ================= CART TYPES (synced with backend) =================

export interface Cart {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  user?: UserBasic;
  items?: CartItemWithDetails[];
  payments?: Payment[];
  // Backend calculates these
  totalItems?: number;
  totalAmount?: number;
}

// Backend response structure
export interface UserBasic {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface ProductBasic {
  id: number;
  name: string;
  slug: string;
  image?: string;
  price: number;
  stock: number;
}

export interface CourseBasic {
  id: number;
  title: string;
  slug: string;
  price: number;
  level?: string;
  category?: string;
}

export interface CartItem {
  id: number; // CartItem ID (used for deletion)
  cartId: number;
  itemType: CartItemType;
  itemId: number; // Product/Course ID
  quantity: number;
  price: number; // Price at time of adding
  // Backend calculates subtotal
  subtotal?: number; // price * quantity
  cart?: Cart;
}

export interface CartItemWithDetails extends CartItem {
  product?: ProductBasic | null;
  course?: CourseBasic | null;
}

// ================= REQUEST DTOs =================

export interface AddToCartDto {
  itemType: CartItemType;
  itemId: number; // Product or Course ID
  quantity: number;
}

export interface UpdateCartDto {
  userId?: number;
}

export interface UpdateCartItemDto {
  quantity?: number;
  price?: number;
}

// ================= RESPONSE TYPES =================

// Main cart response (what backend returns)
export interface CartWithItems extends Cart {
  items: CartItemWithDetails[];
  totalItems: number; // Backend calculated
  totalAmount: number; // Backend calculated
}

// For summary components
export interface CartSummary {
  totalItems: number;
  totalAmount: number;
  items: CartItemSummary[];
}

export interface CartItemSummary {
  id: number;
  itemType: CartItemType;
  itemId: number;
  itemName: string;
  itemImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
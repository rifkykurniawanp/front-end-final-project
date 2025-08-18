import { CartItemType } from './enum';
import type { User } from './user';
import type { Product } from './product';
import type { Course } from './course';
import type { Payment } from './payment';

// ================= CART TYPES =================

export interface Cart {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  items?: CartItem[];
  payments?: Payment[];
}

export interface CartItem {
  id: number;
  cartId: number;
  itemType: CartItemType;
  itemId: number;
  quantity: number;
  price: number;
  cart?: Cart;
  product?: Product | null;
  course?: Course | null;
}

// For API requests
export interface AddToCartDto {
  itemType: CartItemType;
  itemId: number;
  quantity?: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

// Cart with populated items for display
export interface CartWithItems extends Cart {
  items: CartItemWithDetails[];
}

export interface CartItemWithDetails extends CartItem {
  product?: Product;
  course?: Course;
}

// For checkout process
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
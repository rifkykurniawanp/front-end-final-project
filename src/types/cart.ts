// ================= FRONTEND CART TYPES =================
import { CartItemType } from './enum'; // your shared frontend enums
import { RoleName } from './enum';

// ----- User -----
export interface UserBasic {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

// ----- Product -----
export interface ProductBasic {
  id: number;
  name: string;
  slug: string;
  image?: string;
  price: number;
  stock: number;
}

// ----- Course -----
export interface CourseBasic {
  id: number;
  title: string;
  slug: string;
  price: number;
  level: string;
  category: string;
}

// ----- Cart Item -----
export interface CartItem {
  id: number;
  cartId: number;
  itemType: CartItemType;
  itemId: number;
  quantity: number;
  price: number;
  subtotal: number;
  product?: ProductBasic;
  course?: CourseBasic;
}

// ----- Cart -----
export interface CartResponse {
  id: number;
  userId: number;
  user?: UserBasic;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

// ----- Requests -----
// Create Cart
export interface CreateCartDto {
  userId: number;
}

// Update Cart (partial)
export interface UpdateCartDto {
  // can add optional fields in future, currently empty
}

// Add Item to Cart
export interface AddItemToCartDto {
  itemType: CartItemType;
  itemId: number;
  quantity: number;
  price: number;
}

// Update Cart Item
export interface UpdateCartItemDto {
  quantity?: number;
  price?: number;
}

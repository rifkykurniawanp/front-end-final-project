import { apiFetch } from "./api-fetch";
import { CartItem, AddToCartDto, UpdateCartItemDto, CartWithItems } from "@/types/cart";

export const cartApi = {
  // Get current user's cart
  getMyCart: (token: string) =>
    apiFetch<CartWithItems>("/carts", { token }),

  // Get cart items by cart ID
  getCartById: (cartId: number, token: string) =>
    apiFetch<CartWithItems>(`/carts/${cartId}/items`, { token }),

  // Add item to cart
  addItem: (cartId: number, data: AddToCartDto, token: string) =>
    apiFetch<CartWithItems>(`/carts/${cartId}/items`, {
      method: "POST",
      body: data,
      token,
    }),

  // Update cart item
  updateItem: (cartId: number, itemId: number, data: UpdateCartItemDto, token: string) =>
    apiFetch<CartWithItems>(`/carts/${cartId}/items/${itemId}`, {
      method: "PUT",
      body: data,
      token,
    }),

  // Remove cart item
  removeItem: (cartId: number, itemId: number, token: string) =>
    apiFetch<void>(`/carts/${cartId}/items/${itemId}`, {
      method: "DELETE",
      token,
    }),

  // Checkout cart
  checkout: (cartId: number, token: string) =>
    apiFetch<any>(`/carts/${cartId}/checkout`, {
      method: "POST",
      token,
    }),
};
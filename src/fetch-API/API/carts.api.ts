import { apiFetch } from "./api-fetch";
import { CartItem, AddToCartDto, UpdateCartItemDto, CartWithItems, CartSummary } from "@/types/cart";

export const cartApi = {
  /**
   * Get the current authenticated user's cart
   */
  getMyCart: (token: string) =>
    apiFetch<CartWithItems>("/cart", { token }),

  /**
   * Add an item to the current user's cart
   */
  addItem: (data: AddToCartDto, token: string) =>
    apiFetch<CartItem>("/cart/items", {
      method: "POST",
      body: data,
      token,
    }),

  /**
   * Update a cart item by its ID
   */
  updateItem: (itemId: number, data: UpdateCartItemDto, token: string) =>
    apiFetch<CartItem>(`/cart/items/${itemId}`, {
      method: "PATCH",
      body: data,
      token,
    }),

  /**
   * Remove a cart item by its ID
   */
  removeItem: (itemId: number, token: string) =>
    apiFetch<{ message: string }>(`/cart/items/${itemId}`, {
      method: "DELETE",
      token,
    }),

  /**
   * Clear all items in the current user's cart
   */
  clear: (token: string) =>
    apiFetch<{ message: string }>("/cart/clear", {
      method: "DELETE",
      token,
    }),

  /**
   * Get a summary of the current user's cart (total items, total amount)
   */
  getSummary: (token: string) =>
    apiFetch<CartSummary>("/cart/summary", { token }),
};

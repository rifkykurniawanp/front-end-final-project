// =================== cart-api.ts - SYNCED WITH BACKEND ===================

import { apiFetch } from "./api-fetch";
import {
  CartWithItems,
  AddToCartDto,
  UpdateCartDto,
} from "@/types";

export const cartApi = {
  // GET /carts - Get user's carts (backend returns array, filtered by user)
  getMyCart: (token: string) =>
    apiFetch<CartWithItems[]>("/carts", { token }),

  // GET /carts/:id - Get specific cart by ID
  getCartById: (cartId: number, token: string) =>
    apiFetch<CartWithItems>(`/carts/${cartId}`, { token }),

  // POST /carts - Create new cart
  createCart: (token: string) =>
    apiFetch<CartWithItems>("/carts", {
      method: "POST",
      body: {}, // Backend expects CreateCartDto (empty object is fine)
      token,
    }),

  // PUT /carts/:id - Update cart
  updateCart: (cartId: number, data: UpdateCartDto, token: string) =>
    apiFetch<CartWithItems>(`/carts/${cartId}`, {
      method: "PUT",
      body: data,
      token,
    }),

  // DELETE /carts/:id - Remove entire cart
  removeCart: (cartId: number, token: string) =>
    apiFetch<void>(`/carts/${cartId}`, { method: "DELETE", token }),

  // POST /carts/:id/items - Add item to cart
  // Backend expects: { itemType: 'PRODUCT' | 'COURSE'; itemId: number; quantity: number }
  addItem: (cartId: number, data: AddToCartDto, token: string) =>
    apiFetch<CartWithItems>(`/carts/${cartId}/items`, {
      method: "POST",
      body: {
        itemType: data.itemType,
        itemId: data.itemId,
        quantity: data.quantity,
      },
      token,
    }),

  // DELETE /carts/:id/items/:itemId - Remove item from cart
  // NOTE: Backend's :itemId refers to CartItem.id, NOT the itemId field
  removeItem: (cartId: number, cartItemId: number, token: string) =>
    apiFetch<void>(`/carts/${cartId}/items/${cartItemId}`, {
      method: "DELETE",
      token,
    }),

  // NOTE: Backend doesn't have update item endpoint yet
  // This would need to be added to backend as PUT /carts/:id/items/:itemId
  // For now, we'll use addItem to "update" by replacing
  updateItemQuantity: async (cartId: number, data: AddToCartDto, token: string) => {
    // Since backend doesn't have update endpoint, we'll re-add with new quantity
    return cartApi.addItem(cartId, data, token);
  },
};
// =================== cart-api.ts ===================
import { apiFetch } from "./api-fetch";
import {
  CartWithItems,
  AddToCartDto,
  UpdateCartDto,
} from "@/types";

export const cartApi = {
  getMyCart: (token: string) =>
    apiFetch<CartWithItems[]>("/carts", { token }),

  getCartById: (cartId: number, token: string) =>
    apiFetch<CartWithItems>(`/carts/${cartId}`, { token }),

  createCart: (token: string) =>
    apiFetch<CartWithItems>("/carts", {
      method: "POST",
      body: {},
      token,
    }),

  updateCart: (cartId: number, data: UpdateCartDto, token: string) =>
    apiFetch<CartWithItems>(`/carts/${cartId}`, {
      method: "PUT",
      body: data,
      token,
    }),

  removeCart: (cartId: number, token: string) =>
    apiFetch<void>(`/carts/${cartId}`, { method: "DELETE", token }),

  addItem: (cartId: number, data: AddToCartDto, token: string) =>
    apiFetch<CartWithItems>(`/carts/${cartId}/items`, {
      method: "POST",
      body: data,
      token,
    }),

  removeItem: (cartId: number, itemId: number, token: string) =>
    apiFetch<void>(`/carts/${cartId}/items/${itemId}`, {
      method: "DELETE",
      token,
    }),
};

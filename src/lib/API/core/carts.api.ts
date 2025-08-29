// lib/API/core/carts.api.ts
'use client';
import { apiFetch } from './api-fetch';
import type {
  CartResponse,
  CreateCartDto,
  UpdateCartDto,
  AddItemToCartDto,
  UpdateCartItemDto,
} from '@/types/cart';

const BASE_URL = '/carts';

export const cartsApi = {
  create: (data: CreateCartDto, token: string) =>
    apiFetch<CartResponse>(`${BASE_URL}`, { method: 'POST', body: data, token }),

  findAll: (page = 1, limit = 10, token: string) =>
    apiFetch<CartResponse[]>(`${BASE_URL}?page=${page}&limit=${limit}`, { token }),

  findOne: (id: number, token: string) =>
    apiFetch<CartResponse>(`${BASE_URL}/${id}`, { token }),

  update: (id: number, data: UpdateCartDto, token: string) =>
    apiFetch<CartResponse>(`${BASE_URL}/${id}`, { method: 'PUT', body: data, token }),

  remove: (id: number, token: string) =>
    apiFetch<void>(`${BASE_URL}/${id}`, { method: 'DELETE', token }),

  addItem: (cartId: number, data: AddItemToCartDto, token: string) =>
    apiFetch<CartResponse>(`${BASE_URL}/${cartId}/items`, { method: 'POST', body: data, token }),

  removeItem: (cartId: number, itemId: number, token: string) =>
    apiFetch<CartResponse>(`${BASE_URL}/${cartId}/items/${itemId}`, { method: 'DELETE', token }),

  updateItem: (cartId: number, itemId: number, data: UpdateCartItemDto, token: string) =>
    apiFetch<CartResponse>(`${BASE_URL}/${cartId}/items/${itemId}`, { method: 'PUT', body: data, token }),
};

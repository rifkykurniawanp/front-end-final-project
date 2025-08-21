import { Payment } from "@/types/payment";
import { apiFetch } from "./api-fetch";

export const paymentsApi = {
  getAll: (token: string) =>
    apiFetch<Payment[]>("/payments", { method: "GET", token }),

  getById: (id: number, token: string) =>
    apiFetch<Payment>(`/payments/${id}`, { method: "GET", token }),

  create: (data: Partial<Payment>, token: string) =>
    apiFetch<Payment>("/payments", { method: "POST", body: data, token }),

  updateStatus: (id: number, data: { status: string }, token: string) =>
    apiFetch<Payment>(`/payments/${id}/status`, { method: "PUT", body: data, token }),

  getUserPayments: (userId: number, token: string) =>
    apiFetch<Payment[]>(`/payments/user/${userId}`, { method: "GET", token }),

  verify: (id: number, token: string) =>
    apiFetch<Payment>(`/payments/${id}/verify`, { method: "POST", token }),

  cancel: (id: number, data: { reason?: string }, token: string) =>
    apiFetch<Payment>(`/payments/${id}/cancel`, { method: "POST", body: data, token }),
};
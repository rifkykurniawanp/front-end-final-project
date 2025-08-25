import { apiFetch } from './api-fetch';
import type {
  Payment,
  CreatePaymentDto,
  UpdatePaymentDto,
  CancelPaymentDto,
  PaymentResponseDto,
  PaymentStatsDto,
} from '@/types/payment';

export const paymentsApi = {
  // Create a new payment
  create: (data: CreatePaymentDto, token: string) =>
    apiFetch<PaymentResponseDto>('/payments', { method: 'POST', body: data, token }),

  // Get all payments (admin only)
  getAll: (page?: number, limit?: number, token?: string) =>
    apiFetch<PaymentResponseDto[]>(`/payments?page=${page || 1}&limit=${limit || 10}`, { token }),

  // Get soft deleted payments (admin only)
  getDeleted: (page?: number, limit?: number, token?: string) =>
    apiFetch<PaymentResponseDto[]>(`/payments/deleted?page=${page || 1}&limit=${limit || 10}`, { token }),

  // Get payment stats (admin only)
  getStats: (token: string) =>
    apiFetch<PaymentStatsDto>('/payments/stats', { token }),

  // Get payments by status (admin only)
  getByStatus: (status: string, token: string) =>
    apiFetch<PaymentResponseDto[]>(`/payments/status/${status}`, { token }),

  // Get payments by payable type (admin only)
  getByPayableType: (payableType: string, token: string) =>
    apiFetch<PaymentResponseDto[]>(`/payments/type/${payableType}`, { token }),

  // Get payments by user
  getUserPayments: (userId: number, token: string) =>
    apiFetch<PaymentResponseDto[]>(`/payments/user/${userId}`, { token }),

  getUserStats: (userId: number, token: string) =>
    apiFetch<PaymentStatsDto>(`/payments/user/${userId}/stats`, { token }),

  // Get a payment by ID
  getById: (id: number, token: string) =>
    apiFetch<PaymentResponseDto>(`/payments/${id}`, { token }),

  // Update payment
  update: (id: number, data: UpdatePaymentDto, token: string) =>
    apiFetch<PaymentResponseDto>(`/payments/${id}`, { method: 'PATCH', body: data, token }),

  // Cancel payment
  cancel: (id: number, data: CancelPaymentDto, token: string) =>
    apiFetch<PaymentResponseDto>(`/payments/${id}/cancel`, { method: 'POST', body: data, token }),

  // Verify payment
  verify: (id: number, token: string) =>
    apiFetch<PaymentResponseDto>(`/payments/${id}/verify`, { method: 'POST', token }),

  // Soft delete
  remove: (id: number, token: string) =>
    apiFetch<void>(`/payments/${id}`, { method: 'DELETE', token }),

  // Force delete (admin only)
  forceDelete: (id: number, token: string) =>
    apiFetch<void>(`/payments/${id}/force`, { method: 'DELETE', token }),

  // Restore soft deleted payment (admin only)
  restore: (id: number, token: string) =>
    apiFetch<PaymentResponseDto>(`/payments/${id}/restore`, { method: 'PATCH', token }),
};

import { apiFetch } from "./api-fetch";
import { User } from "@/types/user";
import { RoleName } from "@/types/auth";

export const usersApi = {
  // Get all users with pagination
  getAll: (page?: number, limit?: number, token?: string) =>
    apiFetch<User[]>(`/users?page=${page || 1}&limit=${limit || 10}`, { token }),

  // Get user by ID
  getById: (id: number, token?: string) =>
    apiFetch<User>(`/users/${id}`, { token }),

  // Create new user
  create: (data: { email: string; name?: string; password: string }, token?: string) =>
    apiFetch<User>("/users", {
      method: "POST",
      body: data,
      token,
    }),

  // Update user
  update: (id: number, data: Partial<User>, token?: string) =>
    apiFetch<User>(`/users/${id}`, {
      method: "PATCH",
      body: data,
      token,
    }),

  // Delete user
  delete: (id: number, token?: string) =>
    apiFetch<{ message: string }>(`/users/${id}`, {
      method: "DELETE",
      token,
    }),

  // Get users by role
  getByRole: (role: RoleName, token?: string) =>
    apiFetch<User[]>(`/users/role/${role}`, { token }),

  // User-related resources
  getProductOrders: (userId: number, token?: string) =>
    apiFetch(`/users/${userId}/product-orders`, { token }),

  getEnrollments: (userId: number, token?: string) =>
    apiFetch(`/users/${userId}/enrollments`, { token }),

  getCertificates: (userId: number, token?: string) =>
    apiFetch(`/users/${userId}/certificates`, { token }),

  getProgress: (userId: number, token?: string) =>
    apiFetch(`/users/${userId}/progress`, { token }),
};

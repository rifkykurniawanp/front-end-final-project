// ================= users-api.ts =================
import { apiFetch } from "../core/api-fetch";
import { RoleName } from "@/types";
import type { User, CreateUserDto, UpdateUserDto, AuthResponse } from "@/types";

export const usersApi = {
  // Get all users (paginated) — ADMIN only
  getAll: (page?: number, limit?: number, token?: string) =>
    apiFetch<User[]>(`/users?page=${page || 1}&limit=${limit || 10}`, { token }),

  // Get users by role — ADMIN only
  getByRole: (role: RoleName, token?: string) =>
    apiFetch<User[]>(`/users/role/${role}`, { token }),

  // Get single user by ID — any authenticated role (with RBAC)
  getById: (id: number, token?: string) =>
    apiFetch<User>(`/users/${id}`, { token }),

  // Create new user — public or ADMIN
  create: (data: CreateUserDto, token?: string) =>
    apiFetch<User>("/users", { method: "POST", body: data, token }),

  // Update user — any authenticated role (RBAC enforced)
  update: (id: number, data: UpdateUserDto, token?: string) =>
    apiFetch<User>(`/users/${id}`, { method: "PATCH", body: data, token }),

  // Soft delete user — authenticated roles
  remove: (id: number, token?: string) =>
    apiFetch<void>(`/users/${id}`, { method: "DELETE", token }),

  // Get soft deleted users — ADMIN only
  getDeleted: (page?: number, limit?: number, token?: string) =>
    apiFetch<User[]>(`/users/deleted?page=${page || 1}&limit=${limit || 10}`, { token }),

  // Force delete user — ADMIN only
  forceDelete: (id: number, token?: string) =>
    apiFetch<void>(`/users/${id}/force`, { method: "DELETE", token }),

  // Restore soft deleted user — ADMIN only
  restore: (id: number, token?: string) =>
    apiFetch<User>(`/users/${id}/restore`, { method: "PATCH", token }),

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

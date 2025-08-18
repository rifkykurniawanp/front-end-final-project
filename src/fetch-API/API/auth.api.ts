// src/fetch-API/API/auth.api.ts
import { AuthResponse, LoginDto, RegisterDto } from "@/types/auth";
import { apiFetch } from "@/fetch-API/API/api-fetch";

export const authApi = {
  // Login user
  login: (data: LoginDto) =>
    apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: data, // langsung objek
    }),

  // Register user baru
  register: (data: RegisterDto) =>
    apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: data, // langsung objek
    }),
};

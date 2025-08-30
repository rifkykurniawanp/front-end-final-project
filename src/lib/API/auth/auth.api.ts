import { AuthResponse, LoginDto, RegisterDto } from "@/types/auth";
import { apiFetch } from "@/lib/API/core/api-fetch";

export const authApi = {
  login: (data: LoginDto) =>
    apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: { ...data },
    }),

  // Register user baru
  register: (data: RegisterDto) =>
    apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: { ...data },
    }),
};

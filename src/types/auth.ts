// src/types/auth.ts

export type RoleName = "ADMIN" | "SUPPLIER" | "INSTRUCTOR" | "USER";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;   // typo 'addres' diperbaiki
  role?: RoleName;
  isBuyer?: boolean;
  isStudent?: boolean;
}

export interface UserPayload {
  id: number;
  email: string;
  role: RoleName;
}

export interface AuthResponse {
  accessToken: string;
  user: UserPayload;
}

"use client";
import { useState, useEffect } from "react";
import { authApi } from "@/fetch-API/API/auth.api";
import { AuthResponse, LoginDto, RegisterDto } from "@/types/auth";

export function useAuth() {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Coba ambil dari localStorage saat mount
    const saved = localStorage.getItem("auth");
    if (saved) {
      const parsed = JSON.parse(saved) as AuthResponse;
      setUser(parsed.user);
      setToken(parsed.accessToken);
    }
  }, []);

  const login = async (data: LoginDto) => {
    const res = await authApi.login(data);
    setUser(res.user);
    setToken(res.accessToken);
    localStorage.setItem("auth", JSON.stringify(res));
    return res;
  };

  const register = async (data: RegisterDto) => {
    const res = await authApi.register(data);
    setUser(res.user);
    setToken(res.accessToken);
    localStorage.setItem("auth", JSON.stringify(res));
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth");
  };

  return { user, token, login, register, logout };
}

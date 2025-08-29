"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/API/auth/auth.api";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) window.location.href = "/dashboard";
    else setChecking(false);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authApi.login({ email, password });
      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("user", JSON.stringify(res.user));
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err?.message || "Login failed");
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <Card className="border border-[#A47C52] shadow-md">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A47C52] mx-auto mb-4"></div>
            <p className="text-[#FFEEDB]">Checking authentication...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-[#5C4435] to-[#7B5E4D] transform transition-transform hover:scale-[1.02] duration-300">
      <CardHeader className="text-center space-y-1 p-6">
        <CardTitle className="text-3xl font-playfair font-bold text-[#FFEEDB]">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-[#FFEEDB] text-sm">
          Please sign in to continue
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-[#FFEEDB] font-medium text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              className="focus:ring-[#D4AF7F] focus:border-[#D4AF7F]"
            />
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password" className="text-[#FFEEDB] font-medium text-sm">
                Password
              </Label>
              <a href="#" className="ml-auto text-sm text-[#D4AF7F] hover:text-[#C9A86F] hover:underline transition-colors">
                Forgot?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="focus:ring-[#D4AF7F] focus:border-[#D4AF7F]"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF7F] hover:bg-[#C9A86F] text-[#3E2F2F] font-semibold rounded-lg shadow-md transition-all duration-200 hover:scale-105"
          >
            {loading ? "Signing in..." : "Login"}
          </Button>

          {/* Signup link */}
          <p className="text-center text-sm text-[#FFEEDB]">
            Don&apos;t have an account?{" "}
            <a href="#" className="font-medium text-[#D4AF7F] hover:text-[#C9A86F] hover:underline transition-colors">
              Sign up
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authApi } from "@/lib/API/auth/auth.api"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  // Check for existing token on component mount
  useEffect(() => {
    const checkExistingToken = () => {
      try {
        const token = localStorage.getItem("token")
        const user = localStorage.getItem("user")
        
        if (token && user) {
          // Optional: Validate token with backend before redirecting
          // You could add an API call here to verify the token is still valid
          window.location.href = "/dashboard"
          return
        }
      } catch (error) {
        // Handle any localStorage errors (e.g., in incognito mode)
        console.error("Error checking localStorage:", error)
      }
      
      setChecking(false)
    }

    checkExistingToken()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await authApi.login({ email, password })
      
      // Store token (keeping your existing structure)
      localStorage.setItem("token", res.accessToken)
      
      // Store user data for dashboard role checking
      localStorage.setItem("user", JSON.stringify(res.user))
      
      // Redirect to dashboard
      window.location.href = "/dashboard"
      
    } catch (err: any) {
      setError(err?.message || "Login failed")
      setLoading(false)
    }
  }

  // Show loading spinner while checking for existing token
  if (checking) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="border border-amber-200 shadow-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Checking authentication...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border border-amber-200 shadow-md">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold text-amber-600">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-500">
            Please sign in to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="focus:ring-amber-500"
              />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="ml-auto text-sm text-amber-600 hover:underline">
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
                className="focus:ring-amber-500"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-sm"
            >
              {loading ? "Signing in..." : "Login"}
            </Button>

            {/* Signup link */}
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className="font-medium text-amber-600 hover:text-amber-700 hover:underline"
              >
                Sign up
              </a>
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Terms */}
      <p className="text-center text-xs text-gray-500">
        By clicking login, you agree to our{" "}
        <a href="#" className="text-amber-600 hover:text-amber-700 underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-amber-600 hover:text-amber-700 underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  )
}
"use client"

import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4">
      <LoginForm className="w-full max-w-md" />
    </main>
  )
}

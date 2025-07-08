import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-4 py-10 bg-amber-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-white to-amber-50 z-0" />
      <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-amber-200/30 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-amber-300/20 rounded-full blur-2xl animate-pulse delay-700" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Logo & Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center items-center gap-3">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 rounded-xl shadow-md shadow-amber-400/30">
              <GalleryVerticalEnd className="text-white size-6" />
            </div>
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800">
              RUIND EDU-COMMERS
            </h2>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-sm text-gray-600">Please sign in to continue</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-20 blur-md" />
          <div className="relative bg-white/90 backdrop-blur-sm border border-amber-100 rounded-2xl p-6 shadow-lg shadow-amber-400/10">
            <LoginForm />
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-gray-500">
          © {new Date().getFullYear()} RUIND EDU-COMMERS. All rights reserved.
        </p>
      </div>
    </div>
  );
}

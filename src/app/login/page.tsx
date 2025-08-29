"use client";

import { LoginForm } from "@/components/auth/login-form";

const Pattern = ({ id }: { id: string }) => (
  <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none">
    <defs>
      <pattern id={id} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="2" fill="#5C4435" />
        <circle cx="15" cy="15" r="2" fill="#A47C52" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
);

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#3E2F2F] px-4">
      <Pattern id="login-pattern" />
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <LoginForm />
      </div>

      <style jsx>{`
        .animate-fade-in-up { 
          opacity: 0; 
          transform: translateY(20px); 
          animation: fadeInUp 0.8s forwards; 
        }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  );
}

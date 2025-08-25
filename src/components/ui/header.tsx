// /dashboard/components/ui/Header.tsx
"use client";

import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <Button variant="outline">Logout</Button>
    </header>
  );
}

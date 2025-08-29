"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RoleName } from "@/types/enum";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        switch (user.role) {
          case RoleName.ADMIN:
            router.push("/dashboard/admin");
            break;
          case RoleName.SUPPLIER:
            router.push("/dashboard/supplier");
            break;
          case RoleName.INSTRUCTOR:
            router.push("/dashboard/instructor");
            break;
          case RoleName.USER:
            router.push("/dashboard/user");
            break;
          default:
            router.push("/login");
        }
      } catch {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  return null;
}

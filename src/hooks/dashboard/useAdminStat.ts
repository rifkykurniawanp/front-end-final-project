import { AdminData } from "@/hooks/dashboard/useAdminData";
import { useMemo } from "react";

export const useAdminStats = (data: AdminData) => {
  return useMemo(() => {
    const totalRevenue = data.orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const activeProducts = data.products.filter((p) => p.status === "ACTIVE").length;

    const roleStats = {
      ADMIN: data.users.filter((u) => u.role === "ADMIN").length,
      SUPPLIER: data.users.filter((u) => u.role === "SUPPLIER").length,
      INSTRUCTOR: data.users.filter((u) => u.role === "INSTRUCTOR").length,
      USER: data.users.filter((u) => u.role === "USER").length,
    };

    const recentOrders = data.orders.slice(0, 5);
    const recentEnrollments = data.enrollments.slice(0, 5);

    const statsCards = [
      {
        title: "Total Revenue",
        value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
        description: "from all transactions",
        icon: () => null, // bisa diisi ikon di page
        trend: "+12.5%",
      },
      {
        title: "Total Users",
        value: data.users.length,
        description: "registered users",
        icon: () => null,
        trend: "+5.2%",
      },
      {
        title: "Active Products",
        value: activeProducts,
        description: "published products",
        icon: () => null,
        trend: "+8.1%",
      },
      {
        title: "Total Courses",
        value: data.courses.length,
        description: "available courses",
        icon: () => null,
        trend: "+15.3%",
      },
      {
        title: "Total Orders",
        value: data.orders.length,
        description: "all time orders",
        icon: () => null,
        trend: "+23.4%",
      },
      {
        title: "Enrollments",
        value: data.enrollments.length,
        description: "course enrollments",
        icon: () => null,
        trend: "+18.7%",
      },
    ];

    return {
      totalRevenue,
      activeProducts,
      roleStats,
      recentOrders,
      recentEnrollments,
      statsCards,
    };
  }, [data]);
};

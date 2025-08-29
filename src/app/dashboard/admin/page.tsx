"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Package,
  GraduationCap,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useAdminData } from "@/hooks/dashboard/useAdminData";
import { useAdminStats } from "@/hooks/dashboard/useAdminStat";

// 🎨 Palet warna kopi–teh–herbal
const colors = {
  coffee: "text-amber-700", // kopi
  tea: "text-emerald-700",  // teh & herbal
  rose: "text-rose-600",    // transaksi
  indigo: "text-indigo-700",// user
  neutral: "text-gray-600", // sekunder
};

// --- StatCard ---
interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  color,
  trend,
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-gray-600">
        {trend && <span className="text-green-600 font-medium">{trend}</span>}{" "}
        {description}
      </p>
    </CardContent>
  </Card>
);

// --- RecentActivities ---
interface RecentActivitiesProps {
  recentOrders: any[];
  recentEnrollments: any[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({
  recentOrders,
  recentEnrollments,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Orders */}
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest product orders</CardDescription>
      </CardHeader>
      <CardContent>
        {recentOrders.length > 0 ? (
          recentOrders.map((o) => (
            <div
              key={o.id}
              className="flex justify-between py-2 border-b last:border-b-0"
            >
              <div>
                <p className="font-medium text-sm">Order #{o.id}</p>
                <p className="text-xs text-gray-500">
                  {new Date(o.createdAt).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">
                  Rp {o.totalPrice?.toLocaleString("id-ID")}
                </p>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    o.status === "completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : o.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {o.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No recent orders</p>
        )}
      </CardContent>
    </Card>

    {/* Enrollments */}
    <Card>
      <CardHeader>
        <CardTitle>Recent Enrollments</CardTitle>
        <CardDescription>Latest course enrollments</CardDescription>
      </CardHeader>
      <CardContent>
        {recentEnrollments.length > 0 ? (
          recentEnrollments.map((e) => (
            <div
              key={e.id}
              className="flex justify-between py-2 border-b last:border-b-0"
            >
              <div>
                <p className="font-medium text-sm">Enrollment #{e.id}</p>
                <p className="text-xs text-gray-500">
                  {new Date(e.enrolledAt).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">
                  Rp {e.pricePaid?.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-gray-600">{e.progress}% complete</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No recent enrollments</p>
        )}
      </CardContent>
    </Card>
  </div>
);

// --- RoleDistribution dengan Bar ---
interface RoleDistributionProps {
  roleStats: Record<string, number>;
}

const RoleDistribution: React.FC<RoleDistributionProps> = ({ roleStats }) => {
  const total = Object.values(roleStats).reduce((a, b) => a + b, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Distribution</CardTitle>
        <CardDescription>Users by role</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(roleStats).map(([role, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={role}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize">{role}</span>
                <span className="text-gray-600">{count} users</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded">
                <div
                  className="h-2 rounded bg-amber-600"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

// --- Page Export ---
export default function AdminDashboardPage() {
  const { data, loading, error } = useAdminData();
  const stats = data ? useAdminStats(data) : null;

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        Loading dashboard...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-8 text-red-600">Error: {error}</div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-amber-800">Admin Dashboard</h1>
        <p className="text-gray-600">Manage and monitor your platform</p>
      </div>

      {stats && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.statsCards.map((s, i) => {
              const statIcons = [
                { icon: DollarSign, color: colors.coffee },
                { icon: Users, color: colors.indigo },
                { icon: Package, color: colors.coffee },
                { icon: GraduationCap, color: colors.tea },
                { icon: ShoppingCart, color: colors.rose },
                { icon: TrendingUp, color: colors.tea },
              ];
              return (
                <StatCard
                  key={i}
                  {...s}
                  icon={statIcons[i].icon}
                  color={statIcons[i].color}
                />
              );
            })}
          </div>

          {/* Activities */}
          <RecentActivities
            recentOrders={stats.recentOrders}
            recentEnrollments={stats.recentEnrollments}
          />

          {/* Role + Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RoleDistribution roleStats={stats.roleStats} />

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Platform Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {/* Products */}
                <div className="relative text-center p-6 bg-amber-50 rounded overflow-hidden">
                  <div className="absolute right-3 bottom-3 text-amber-200 text-6xl opacity-20">
                    <Package />
                  </div>
                  <div className="text-2xl font-bold text-amber-700">
                    {data.products.length}
                  </div>
                  <p className="text-gray-700">Products</p>
                </div>

                {/* Courses */}
                <div className="relative text-center p-6 bg-emerald-50 rounded overflow-hidden">
                  <div className="absolute right-3 bottom-3 text-emerald-200 text-6xl opacity-20">
                    <GraduationCap />
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {data.courses.length}
                  </div>
                  <p className="text-gray-700">Courses</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

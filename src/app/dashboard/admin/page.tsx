"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Package, GraduationCap, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { useAdminData } from "@/hooks/dashboard/useAdminData";
import { useAdminStats } from "@/hooks/dashboard/useAdminStat";

// --- StatCard ---
interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: Icon, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">
        {trend && <span className="text-green-600">{trend}</span>} {description}
      </p>
    </CardContent>
  </Card>
);

// --- RecentActivities ---
interface RecentActivitiesProps {
  recentOrders: any[];
  recentEnrollments: any[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ recentOrders, recentEnrollments }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest product orders</CardDescription>
      </CardHeader>
      <CardContent>
        {recentOrders.length > 0 ? recentOrders.map((o) => (
          <div key={o.id} className="flex justify-between py-2 border-b last:border-b-0">
            <div>
              <p className="font-medium text-sm">Order #{o.id}</p>
              <p className="text-xs">{new Date(o.createdAt).toLocaleDateString("id-ID")}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm">Rp {o.totalPrice?.toLocaleString("id-ID")}</p>
              <p className="text-xs">{o.status}</p>
            </div>
          </div>
        )) : <p className="text-muted-foreground text-sm">No recent orders</p>}
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Recent Enrollments</CardTitle>
        <CardDescription>Latest course enrollments</CardDescription>
      </CardHeader>
      <CardContent>
        {recentEnrollments.length > 0 ? recentEnrollments.map((e) => (
          <div key={e.id} className="flex justify-between py-2 border-b last:border-b-0">
            <div>
              <p className="font-medium text-sm">Enrollment #{e.id}</p>
              <p className="text-xs">{new Date(e.enrolledAt).toLocaleDateString("id-ID")}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm">Rp {e.pricePaid?.toLocaleString("id-ID")}</p>
              <p className="text-xs">{e.progress}% complete</p>
            </div>
          </div>
        )) : <p className="text-muted-foreground text-sm">No recent enrollments</p>}
      </CardContent>
    </Card>
  </div>
);

// --- RoleDistribution ---
interface RoleDistributionProps {
  roleStats: Record<string, number>;
}

const RoleDistribution: React.FC<RoleDistributionProps> = ({ roleStats }) => (
  <Card>
    <CardHeader>
      <CardTitle>User Distribution</CardTitle>
      <CardDescription>Users by role</CardDescription>
    </CardHeader>
    <CardContent>
      {Object.entries(roleStats).map(([role, count]) => (
        <div key={role} className="flex justify-between text-sm py-1">
          <span>{role}</span>
          <span className="text-muted-foreground">{count} users</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

// --- Page Export ---
export default function AdminDashboardPage() {
  const { data, loading, error } = useAdminData();
  const stats = data ? useAdminStats(data) : null;

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Manage and monitor your platform</p>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.statsCards.map((s, i) => {
              // assign proper icons here
              const icons = [DollarSign, Users, Package, GraduationCap, ShoppingCart, TrendingUp];
              return <StatCard key={i} {...s} icon={icons[i]} />;
            })}
          </div>

          <RecentActivities
            recentOrders={stats.recentOrders}
            recentEnrollments={stats.recentEnrollments}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RoleDistribution roleStats={stats.roleStats} />
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Platform Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-amber-50 rounded">
                  <div className="text-2xl font-bold text-amber-600">{data.products.length}</div>
                  <p>Products</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">{data.courses.length}</div>
                  <p>Courses</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

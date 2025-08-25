"use client";

import React from "react";
import { useAdminData } from "@/hooks/dashboard/useAdminData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminUsersPage() {
  const { data, loading, error } = useAdminData();

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.users?.map(u => (
          <Card key={u.id}>
            <CardHeader>
              <CardTitle>{u.firstName} {u.lastName}</CardTitle>
              <CardDescription>{u.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Email: {u.email}</p>
              <p className="text-sm">Buyer: {u.isBuyer ? "Yes" : "No"}</p>
              <p className="text-sm">Student: {u.isStudent ? "Yes" : "No"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

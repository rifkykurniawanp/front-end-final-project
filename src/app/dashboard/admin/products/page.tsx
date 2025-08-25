"use client";

import React from "react";
import { useAdminData } from "@/hooks/dashboard/useAdminData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminProductsPage() {
  const { data, loading, error } = useAdminData();

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Products Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.products?.map(p => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
              <CardDescription>{p.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Price: Rp {p.price.toLocaleString("id-ID")}</p>
              <p className="text-sm">Stock: {p.stock}</p>
              <p className="text-sm">Status: {p.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

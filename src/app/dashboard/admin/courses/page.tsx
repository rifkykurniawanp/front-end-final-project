"use client";

import React from "react";
import { useAdminData } from "@/hooks/dashboard/useAdminData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminCoursesPage() {
  const { data, loading, error } = useAdminData();

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Courses Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.courses?.map(c => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>{c.title}</CardTitle>
              <CardDescription>{c.level} - {c.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Price: Rp {c.price.toLocaleString("id-ID")}</p>
              <p className="text-sm">Students: {c.students}</p>
              <p className="text-sm">Instructor: {c.instructor.firstName} {c.instructor.lastName}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

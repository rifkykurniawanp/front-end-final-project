"use client";
import React from 'react';
import { AdminDashboard } from '@/components/dashboard/user/admin-dashboard';
import { UserDashboard } from '@/components/dashboard/user/user-dashboard';
import { InstructorDashboard } from '@/components/dashboard/user/instructor-dashboard';
import { SupplierDashboard } from '@/components/dashboard/user/supplier-dashboard';
import LoginPage from '@/app/login/page';

const MainDashboard: React.FC = () => {
  const currentUserRole = "SUPPLIER";
  
  const getDashboardComponent = (role: string) => {
    switch (role) {
      case "ADMIN":
        return AdminDashboard;
      case "USER":
        return UserDashboard;
      case "INSTRUCTOR":
        return InstructorDashboard;
      case "SUPPLIER":
        return SupplierDashboard;
      default:
        return LoginPage;
    }
  };

  const ActiveComponent = getDashboardComponent(currentUserRole);

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
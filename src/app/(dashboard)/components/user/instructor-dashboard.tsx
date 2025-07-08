import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DollarSign, Users, BookOpen, Star } from "lucide-react";

import { StatCard } from '../shared/stat-card';
import { ChartCard } from '../shared/chart-card';
import { CrudTable } from '../shared/crud-table';
import { DataService } from '@/app/data/dashboard';

export const InstructorDashboard: React.FC = () => {
  const courses = DataService.getCourses();
  const users = DataService.getUsers();
  const salesData = DataService.getSalesData();
  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);

  const stats = [
    { title: 'Total Revenue', icon: DollarSign, value: 'Rp 8.4M', description: '+12.5% from last month' },
    { title: 'Total Students', icon: Users, value: totalStudents, description: '+30 from last month' },
    { title: 'Active Courses', icon: BookOpen, value: courses.length, description: 'Currently published' },
    { title: 'Avg. Rating', icon: Star, value: '4.8/5.0', description: 'Across all courses' }
  ];

  const courseColumns = [
    { Header: 'Title', accessor: 'title' as const },
    { Header: 'Students', accessor: 'students' as const }
  ];

  const studentColumns = [
    { Header: 'Name', accessor: 'name' as const },
    { Header: 'Email', accessor: 'email' as const }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <ChartCard title="Student Enrollment" description="Monthly new sign-ups">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="courses" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="courses">Manage Courses</TabsTrigger>
          <TabsTrigger value="students">Manage Students</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <CrudTable title="My Courses" data={courses} columns={courseColumns} />
        </TabsContent>
        <TabsContent value="students">
          <CrudTable title="My Students" data={users.students} columns={studentColumns} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
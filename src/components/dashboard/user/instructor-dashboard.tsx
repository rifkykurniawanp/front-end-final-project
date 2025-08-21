import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Users, BookOpen, Star } from "lucide-react";

import { StatCard } from '../shared/stat-card';
import { ChartCard } from '../shared/chart-card';
import  CrudTable  from '../shared/crud-table';
import { DataService } from '@/app/data/dashboard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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
          <AreaChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCourses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#475569" fontSize={12} />
            <YAxis stroke="#475569" fontSize={12} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip contentStyle={{ backgroundColor: 'white', borderColor: '#f59e0b' }} />
            <Area type="monotone" dataKey="courses" stroke="#f59e0b" fillOpacity={1} fill="url(#colorCourses)" />
          </AreaChart>
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

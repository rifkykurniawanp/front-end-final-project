"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, Users, ShoppingCart, Activity } from "lucide-react";
import CrudTable from "@/components/dashboard/shared/crud-table";

import { CourseWithRelations } from "@/types/course";
import { ProductResponseDto } from "@/types/product";
import { User } from "@/types/user";
import { RoleName } from "@/types/enum";
import { coursesApi } from "@/lib/API/courses";
import { productsApi } from "@/lib/API/products";
import { usersApi } from "@/lib/API/auth";

// ------------------- StatCard -------------------
const StatCard: React.FC<{ title: string; icon: React.ComponentType<any>; value: string | number; description: string }> = ({ title, icon: Icon, value, description }) => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
    <div className="flex justify-between items-center pb-2">
      <div className="text-sm font-medium">{title}</div>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <p className="text-xs text-muted-foreground">{description}</p>
  </div>
);

// ------------------- ChartCard -------------------
const ChartCard: React.FC<{ title: string; description: string; className?: string; children: React.ReactNode }> = ({ title, description, className = "", children }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm p-6 ${className}`}>
    <div className="pb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    {children}
  </div>
);

// ------------------- AdminDashboard -------------------
export const AdminDashboard = () => {
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [products, setProducts] = useState<ProductResponseDto[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [suppliers, setSuppliers] = useState<User[]>([]);
  const [buyers, setBuyers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ------------------- Fetch Data -------------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [coursesData, productsData, allUsers] = await Promise.all([
          coursesApi.getAll(),
          productsApi.getAll(),
          usersApi.getAll(1, 1000),
        ]);
        setCourses(coursesData);
        setProducts(productsData);
        setUsers(allUsers);

        // Users by role
        const [studentsData, instructorsData, suppliersData] = await Promise.all([
          usersApi.getByRole(RoleName.USER),
          usersApi.getByRole(RoleName.INSTRUCTOR),
          usersApi.getByRole(RoleName.SUPPLIER),
        ]);

        setStudents(studentsData.filter(u => u.isStudent));
        setBuyers(studentsData.filter(u => u.isBuyer));
        setInstructors(instructorsData);
        setSuppliers(suppliersData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  // ------------------- Stats -------------------
  const totalUsers = users.length;
  const totalCourses = courses.length;
  const totalProducts = products.length;

  const totalRevenue = courses.reduce((sum, c) => sum + (c.price * (c.students || 0)), 0) +
                       products.reduce((sum, p) => sum + (p.price * 10), 0);

  const totalSales = courses.reduce((sum, c) => sum + (c.students || 0), 0) + (products.length * 10);

  const stats = [
    { title: "Total Revenue", icon: DollarSign, value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, description: "+20.1% from last month" },
    { title: "Total Users", icon: Users, value: totalUsers.toString(), description: `${students.length} students, ${instructors.length} instructors` },
    { title: "Sales", icon: ShoppingCart, value: `+${totalSales}`, description: `${totalCourses} courses, ${totalProducts} products` },
    { title: "Active Now", icon: Activity, value: "+573", description: "+201 since last hour" }
  ];

  // ------------------- Chart Data -------------------
  const salesData = [
    { name: 'Jan', courses: 4000, products: 2400 },
    { name: 'Feb', courses: 3000, products: 1398 },
    { name: 'Mar', courses: 2000, products: 9800 },
    { name: 'Apr', courses: 2780, products: 3908 },
    { name: 'May', courses: 1890, products: 4800 },
    { name: 'Jun', courses: 2390, products: 3800 },
  ];

  const recentSales = users.slice(0, 5).map(user => ({
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
    email: user.email,
    amount: `+Rp ${Math.floor(Math.random() * 1000000).toLocaleString('id-ID')}`
  }));

  // ------------------- Table Columns -------------------
  const userColumns = [
    { Header: "Name", accessor: "firstName" as keyof User },
    { Header: "Email", accessor: "email" as keyof User },
    { Header: "Phone", accessor: "phone" as keyof User },
  ];

  const courseColumns = [
    { Header: "Title", accessor: "title" as keyof CourseWithRelations },
    { Header: "Level", accessor: "level" as keyof CourseWithRelations },
    { Header: "Students", accessor: "students" as keyof CourseWithRelations },
    { Header: "Price", accessor: "price" as keyof CourseWithRelations },
  ];

  const productColumns = [
    { Header: "Name", accessor: "name" as keyof ProductResponseDto },
    { Header: "Category", accessor: "category" as keyof ProductResponseDto },
    { Header: "Price", accessor: "price" as keyof ProductResponseDto },
    { Header: "Stock", accessor: "stock" as keyof ProductResponseDto },
  ];

  // ------------------- CRUD Handlers -------------------
  const handleDeleteUser = async (user: User) => {
  if (!usersApi.delete) return;
  await usersApi.delete(user.id); // pakai method yang ada
  // update state setelah delete
  setStudents(prev => prev.filter(u => u.id !== user.id));
  setInstructors(prev => prev.filter(u => u.id !== user.id));
  setSuppliers(prev => prev.filter(u => u.id !== user.id));
  setBuyers(prev => prev.filter(u => u.id !== user.id));
};


  return (
    <div className="space-y-8 p-4">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <ChartCard title="Sales Comparison" description="Courses vs Products this year" className="lg:col-span-4">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData} margin={{ bottom: 20 }}>
              <defs>
                <linearGradient id="coursesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="productsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={v => `Rp${v/1000}K`} tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="courses" stroke="#f59e0b" fill="url(#coursesGradient)" name="Courses" />
              <Area type="monotone" dataKey="products" stroke="#eab308" fill="url(#productsGradient)" name="Products" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Recent Sales" description={`You made ${totalSales} sales`} className="lg:col-span-3">
          <div className="space-y-4">
            {recentSales.map(s => (
              <div key={s.email} className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  {s.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.email}</p>
                </div>
                <div className="ml-auto font-medium">{s.amount}</div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* CRUD Tables */}
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="instructors">Instructors</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="buyers">Buyers</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <CrudTable<User>
            title="Manage Students"
            columns={userColumns}
            fetchData={() => usersApi.getByRole(RoleName.USER)}
            onDelete={handleDeleteUser}
          />

        </TabsContent>

        <TabsContent value="instructors">
          <CrudTable<User>
            title="Manage Instructors"
            columns={userColumns}
            fetchData={async () => instructors}
          />
        </TabsContent>

        <TabsContent value="suppliers">
          <CrudTable<User>
            title="Manage Suppliers"
            columns={userColumns}
            fetchData={async () => suppliers}
          />
        </TabsContent>

        <TabsContent value="buyers">
          <CrudTable<User>
            title="Manage Buyers"
            columns={userColumns}
            fetchData={async () => buyers}
          />
        </TabsContent>

        <TabsContent value="courses">
          <CrudTable<CourseWithRelations>
            title="Manage Courses"
            columns={courseColumns}
            fetchData={async () => courses}
          />
        </TabsContent>

        <TabsContent value="products">
          <CrudTable<ProductResponseDto>
            title="Manage Products"
            columns={productColumns}
            fetchData={async () => products}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

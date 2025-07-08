import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { DollarSign, Users, ShoppingCart, Activity } from 'lucide-react';
import { StatCard } from '../shared/stat-card';
import { ChartCard } from '../shared/chart-card';
import { CrudTable } from '../shared/crud-table';
import { DataService } from '@/app/data/dashboard';


export const AdminDashboard: React.FC = () => {
  const users = DataService.getUsers();
  const courses = DataService.getCourses();
  const products = DataService.getProducts();
  const salesData = DataService.getSalesData();
  const recentSales = DataService.getRecentSales();

  const stats = [
    { title: 'Total Revenue', icon: DollarSign, value: 'Rp 45.231.890', description: '+20.1% from last month' },
    { title: 'Total Users', icon: Users, value: Object.values(users).flat().length, description: '+180.1% from last month' },
    { title: 'Sales', icon: ShoppingCart, value: '+12,234', description: '+19% from last month' },
    { title: 'Active Now', icon: Activity, value: '+573', description: '+201 since last hour' }
  ];

  const userColumns = [
    { Header: 'Name', accessor: 'name' as const },
    { Header: 'Email', accessor: 'email' as const }
  ];

  const courseColumns = [
    { Header: 'Title', accessor: 'title' as const },
    { Header: 'Instructor', accessor: 'instructor' as const },
    { Header: 'Students', accessor: 'students' as const }
  ];

  const productColumns = [
    { Header: 'Name', accessor: 'name' as const },
    { Header: 'Supplier', accessor: 'supplier' as const },
    { Header: 'Price', accessor: 'price' as const }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <ChartCard 
          title="Sales Comparison" 
          description="Courses vs Products this year"
          className="lg:col-span-4"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData} margin={{ bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={v => `Rp${v/1000}K`} tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="courses" name="Courses" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
              <Bar dataKey="products" name="Products" fill="hsl(var(--secondary))" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard 
          title="Recent Sales" 
          description="You made 265 sales"
          className="lg:col-span-3"
        >
          <div className="space-y-4">
            {recentSales.map(sale => (
              <div key={sale.email} className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  {sale.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{sale.name}</p>
                  <p className="text-xs text-muted-foreground">{sale.email}</p>
                </div>
                <div className="ml-auto font-medium">{sale.amount}</div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* CRUD Management */}
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
          <CrudTable title="Manage Students" data={users.students} columns={userColumns} />
        </TabsContent>
        <TabsContent value="instructors">
          <CrudTable title="Manage Instructors" data={users.instructors} columns={userColumns} />
        </TabsContent>
        <TabsContent value="suppliers">
          <CrudTable title="Manage Suppliers" data={users.suppliers} columns={userColumns} />
        </TabsContent>
        <TabsContent value="buyers">
          <CrudTable title="Manage Buyers" data={users.buyers} columns={userColumns} />
        </TabsContent>
        <TabsContent value="courses">
          <CrudTable title="Manage Courses" data={courses} columns={courseColumns} />
        </TabsContent>
        <TabsContent value="products">
          <CrudTable title="Manage Products" data={products} columns={productColumns} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
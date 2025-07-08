import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";

import { StatCard } from '../shared/stat-card';
import { ChartCard } from '../shared/chart-card';
import { CrudTable } from '../shared/crud-table';
import { DataService } from '@/app/data/dashboard';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export const SupplierDashboard: React.FC = () => {
  const products = DataService.getProducts();
  const users = DataService.getUsers();
  const salesData = DataService.getSalesData();
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);

  const stats = [
    { title: 'Total Sales', icon: DollarSign, value: 'Rp 15.6M', description: '+18.2% from last month' },
    { title: 'New Orders', icon: ShoppingCart, value: '+15', description: '+5 from last week' },
    { title: 'Total Stock', icon: Package, value: `${totalStock} units`, description: 'Across all products' },
    { title: 'Active Buyers', icon: Users, value: users.buyers.length, description: 'Currently purchasing' }
  ];

  const productColumns = [
    { Header: 'Name', accessor: 'name' as const },
    { Header: 'Price', accessor: 'price' as const },
    { Header: 'Stock', accessor: 'stock' as const }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <ChartCard title="Sales Performance" description="Last months revenue">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="products" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="products">Manage Products</TabsTrigger>
          <TabsTrigger value="buyers">View Buyers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <CrudTable 
            title="My Products" 
            data={products.filter(p => p.supplier === 'SupplyCo')} 
            columns={productColumns} 
          />
        </TabsContent>
        <TabsContent value="buyers">
          <Card>
            <CardHeader>
              <CardTitle>My Buyers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.buyers.map(buyer => (
                    <TableRow key={buyer.id}>
                      <TableCell>{buyer.name}</TableCell>
                      <TableCell>{buyer.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
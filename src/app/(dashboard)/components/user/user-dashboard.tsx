import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { BookOpen, ShoppingCart, User, GraduationCap, Award } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const profile = { name: 'Ahmad Wijaya', email: 'ahmad@example.com', joined: '12 Jan 2024' };
  const activeCourses = [
    { title: 'Tea Brewing Excellence', progress: 75, instructor: 'Master Chen' },
    { title: 'Barista Professional', progress: 45, instructor: 'Sarah Williams' }
  ];
  const orders = [
    { id: 'ORD-12389', name: 'Premium Green Tea', status: 'Shipped', date: '28 Jun 2024' },
    { id: 'ORD-12390', name: 'Arabica Coffee Beans', status: 'Processing', date: '01 Jul 2024' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {profile.name}!</h2>
        <p className="text-muted-foreground">Your learning and shopping hub.</p>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="courses">
            <BookOpen className="w-4 h-4 mr-2" /> My Courses
          </TabsTrigger>
          <TabsTrigger value="products">
            <ShoppingCart className="w-4 h-4 mr-2" /> My Products
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" /> My Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeCourses.map((course, i) => (
                <div key={i} className="p-4 border rounded-lg bg-muted/40">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                    </div>
                    <Button size="sm">Continue</Button>
                  </div>
                  <Progress value={course.progress} className="h-2 mb-2" />
                  <span className="text-sm text-muted-foreground">{course.progress}% Complete</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Track your purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.name}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'Shipped' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile & Achievements</CardTitle>
              <CardDescription>Manage info & track progress</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Account Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <strong>Name:</strong>
                    <span>{profile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>Email:</strong>
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>Joined:</strong>
                    <span>{profile.joined}</span>
                  </div>
                </div>
                <Button className="w-full">Edit Profile</Button>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="text-primary" />
                      <span>Courses Completed</span>
                    </div>
                    <span className="font-bold text-lg">5</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-3">
                      <Award className="text-primary" />
                      <span>Certificates Earned</span>
                    </div>
                    <span className="font-bold text-lg">3</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
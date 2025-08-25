// // components/AdminDashboard.tsx
// "use client";

// import React, { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { DollarSign, Users, ShoppingCart, Activity } from "lucide-react";

// // Import separated components
// import { StatCard } from '../shared/stat-card';
// import { SalesChart } from '../shared/SalesChart';
// import { RecentSales } from '../shared/RecentSale';
// import { CrudTable } from '../shared/crud-table';
// import { UserFormModal } from '../shared/UserFormModal';
// import { CourseFormModal } from '../shared/CourseFormModal';
// import { ProductFormModal } from '../shared/ProductFormModal';

// // Import hooks and utilities
// import { useAdminData } from '@/hooks/useAdminData';
// import { useAdminCrudHandlers } from '@/hooks/useAdminCrudHandle';
// import { formatCurrency, generateMockSalesData, generateRecentSales } from './admin-utils';
// import { userColumns, courseColumns, productColumns } from '../shared/AdminTableConfigurasi';
// import { mapUserToPartialFormData, mapCourseToPartialFormData, mapProductToPartialFormData } from './mapping-utils'; // ADD THIS IMPORT

// // Import types
// import { CourseWithRelations } from "@/types/course";
// import { ProductResponseDto } from "@/types/product";
// import { User } from "@/types/user";
// import { UserFormData, CourseFormData, ProductFormData } from '@/types/dashboard';

// export const AdminDashboard = () => {
//   // Data fetching
//   const { data, loading, error, refetch } = useAdminData();
//   const crudHandlers = useAdminCrudHandlers(refetch);

//   // Modal states
//   const [userModalOpen, setUserModalOpen] = useState(false);
//   const [courseModalOpen, setCourseModalOpen] = useState(false);
//   const [productModalOpen, setProductModalOpen] = useState(false);
  
//   // Editing states
//   const [editingUser, setEditingUser] = useState<User | null>(null);
//   const [editingCourse, setEditingCourse] = useState<CourseWithRelations | null>(null);
//   const [editingProduct, setEditingProduct] = useState<ProductResponseDto | null>(null);

//   // Loading and error states
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//         <span className="ml-3 text-lg">Loading dashboard...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-red-500 text-center p-8">
//         <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
//         <p>{error}</p>
//         <button 
//           onClick={refetch} 
//           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   // Calculate statistics
//   const { courses, products, users, students, instructors, suppliers, buyers } = data;
  
//   const totalUsers = users.length;
//   const totalCourses = courses.length;
//   const totalProducts = products.length;
  
//   const totalRevenue = courses.reduce((sum, c) => sum + (c.price * (c.students || 0)), 0) +
//                        products.reduce((sum, p) => sum + (p.price * Math.min(p.stock, 10)), 0);
  
//   const totalSales = courses.reduce((sum, c) => sum + (c.students || 0), 0) + 
//                      products.reduce((sum, p) => sum + Math.min(p.stock, 10), 0);

//   // Stats configuration
//   const stats = [
//     { 
//       title: "Total Revenue", 
//       icon: DollarSign, 
//       value: formatCurrency(totalRevenue), 
//       description: "+20.1% from last month" 
//     },
//     { 
//       title: "Total Users", 
//       icon: Users, 
//       value: totalUsers.toString(), 
//       description: `${students.length} students, ${instructors.length} instructors` 
//     },
//     { 
//       title: "Sales", 
//       icon: ShoppingCart, 
//       value: `+${totalSales}`, 
//       description: `${totalCourses} courses, ${totalProducts} products` 
//     },
//     { 
//       title: "Active Now", 
//       icon: Activity, 
//       value: "+573", 
//       description: "+201 since last hour" 
//     }
//   ];

//   // Chart data
//   const salesData = generateMockSalesData();
//   const recentSales = generateRecentSales(users);

//   // CRUD handlers with modal management
//   const handleCreateUser = async (formData: UserFormData) => {
//     await crudHandlers.handleCreateUser(formData);
//     setUserModalOpen(false);
//   };

//   const handleUpdateUser = async (formData: UserFormData) => {
//     if (editingUser) {
//       await crudHandlers.handleUpdateUser(editingUser.id, formData);
//       setEditingUser(null);
//       setUserModalOpen(false);
//     }
//   };

//   const handleEditUser = (user: User) => {
//     setEditingUser(user);
//     setUserModalOpen(true);
//   };

//   const handleCreateCourse = async (formData: CourseFormData) => {
//     await crudHandlers.handleCreateCourse(formData);
//     setCourseModalOpen(false);
//   };

//   const handleUpdateCourse = async (formData: CourseFormData) => {
//     if (editingCourse) {
//       await crudHandlers.handleUpdateCourse(editingCourse.id, formData);
//       setEditingCourse(null);
//       setCourseModalOpen(false);
//     }
//   };

//   const handleEditCourse = (course: CourseWithRelations) => {
//     setEditingCourse(course);
//     setCourseModalOpen(true);
//   };

//   const handleCreateProduct = async (formData: ProductFormData) => {
//     await crudHandlers.handleCreateProduct(formData);
//     setProductModalOpen(false);
//   };

//   const handleUpdateProduct = async (formData: ProductFormData) => {
//     if (editingProduct) {
//       await crudHandlers.handleUpdateProduct(editingProduct.id, formData);
//       setEditingProduct(null);
//       setProductModalOpen(false);
//     }
//   };

//   const handleEditProduct = (product: ProductResponseDto) => {
//     setEditingProduct(product);
//     setProductModalOpen(true);
//   };

//   const closeModals = () => {
//     setUserModalOpen(false);
//     setCourseModalOpen(false);
//     setProductModalOpen(false);
//     setEditingUser(null);
//     setEditingCourse(null);
//     setEditingProduct(null);
//   };

//   return (
//     <div className="space-y-8 p-4 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//           <p className="text-muted-foreground">Manage your platform efficiently</p>
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat, index) => (
//           <StatCard key={index} {...stat} />
//         ))}
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
//         <SalesChart 
//           data={salesData} 
//           className="lg:col-span-4" 
//         />
//         <RecentSales 
//           sales={recentSales}
//           totalSales={totalSales}
//           className="lg:col-span-3"
//         />
//       </div>

//       {/* Management Tables */}
//       <Tabs defaultValue="students" className="w-full">
//         <TabsList className="grid grid-cols-6 w-full">
//           <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
//           <TabsTrigger value="instructors">Instructors ({instructors.length})</TabsTrigger>
//           <TabsTrigger value="suppliers">Suppliers ({suppliers.length})</TabsTrigger>
//           <TabsTrigger value="buyers">Buyers ({buyers.length})</TabsTrigger>
//           <TabsTrigger value="courses">Courses ({courses.length})</TabsTrigger>
//           <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
//         </TabsList>

//         <TabsContent value="students" className="mt-6">
//           <CrudTable<User>
//             title="Manage Students"
//             columns={userColumns}
//             data={students}
//             loading={false}
//             onAdd={() => setUserModalOpen(true)}
//             onEdit={handleEditUser}
//             onDelete={crudHandlers.handleDeleteUser}
//             onRefresh={refetch}
//           />
//         </TabsContent>

//         <TabsContent value="instructors" className="mt-6">
//           <CrudTable<User>
//             title="Manage Instructors"
//             columns={userColumns}
//             data={instructors}
//             loading={false}
//             onAdd={() => setUserModalOpen(true)}
//             onEdit={handleEditUser}
//             onDelete={crudHandlers.handleDeleteUser}
//             onRefresh={refetch}
//           />
//         </TabsContent>

//         <TabsContent value="suppliers" className="mt-6">
//           <CrudTable<User>
//             title="Manage Suppliers"
//             columns={userColumns}
//             data={suppliers}
//             loading={false}
//             onAdd={() => setUserModalOpen(true)}
//             onEdit={handleEditUser}
//             onDelete={crudHandlers.handleDeleteUser}
//             onRefresh={refetch}
//           />
//         </TabsContent>

//         <TabsContent value="buyers" className="mt-6">
//           <CrudTable<User>
//             title="Manage Buyers"
//             columns={userColumns}
//             data={buyers}
//             loading={false}
//             onAdd={() => setUserModalOpen(true)}
//             onEdit={handleEditUser}
//             onDelete={crudHandlers.handleDeleteUser}
//             onRefresh={refetch}
//           />
//         </TabsContent>

//         <TabsContent value="courses" className="mt-6">
//           <CrudTable<CourseWithRelations>
//             title="Manage Courses"
//             columns={courseColumns}
//             data={courses}
//             loading={false}
//             onAdd={() => setCourseModalOpen(true)}
//             onEdit={handleEditCourse}
//             onDelete={(course) => crudHandlers.handleDeleteCourse(course.id, course.title)}
//             onRefresh={refetch}
//           />
//         </TabsContent>

//         <TabsContent value="products" className="mt-6">
//           <CrudTable<ProductResponseDto>
//             title="Manage Products"
//             columns={productColumns}
//             data={products}
//             loading={false}
//             onAdd={() => setProductModalOpen(true)}
//             onEdit={handleEditProduct}
//             onDelete={(product) => crudHandlers.handleDeleteProduct(product.id, product.name)}
//             onRefresh={refetch}
//           />
//         </TabsContent>
//       </Tabs>

//       {/* Modals */}
//       <UserFormModal
//         isOpen={userModalOpen}
//         onClose={closeModals}
//         onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
//         initialData={editingUser ? mapUserToPartialFormData(editingUser) : undefined}
//         isEdit={!!editingUser}
//       />

//       <CourseFormModal
//         isOpen={courseModalOpen}
//         onClose={closeModals}
//         onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
//         initialData={editingCourse ? mapCourseToPartialFormData(editingCourse) : undefined}
//         isEdit={!!editingCourse}
//       />

//       <ProductFormModal
//         isOpen={productModalOpen}
//         onClose={closeModals}
//         onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
//         initialData={editingProduct ? mapProductToPartialFormData(editingProduct) : undefined}
//         isEdit={!!editingProduct}
//       />
//     </div>
//   );
// };
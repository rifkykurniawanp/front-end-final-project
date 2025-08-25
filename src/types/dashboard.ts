// types/dashboard.ts
import { CourseWithRelations } from "@/types/course";
import { ProductResponseDto } from "@/types/product";
import { User } from "@/types/user";
import { RoleName, CourseCategory, CourseLevel, ProductCategory, ProductOrigin, ProductStatus } from "@/types/enum";

export interface Column<T> {
  Header: string;
  accessor: keyof T;
}

export interface CrudTableProps<T extends { id: number }> {
  title: string;
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onRefresh: () => void;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: RoleName;
  isBuyer: boolean;
  isStudent: boolean;
}

export interface CourseFormData {
  title: string;
  slug?: string;              // Added optional slug
  description: string;
  syllabus: string;
  price: number;
  instructorId: number;       // Added missing instructorId
  duration: string;
  level: CourseLevel;
  category: CourseCategory;
  language: string;
  certificate: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  imageUrl: string;
  origin: ProductOrigin;      // Made required to match API
  status?: ProductStatus;     // Keep optional
  weight?: string;            // Keep optional
}

export interface StatCardProps {
  title: string;
  icon: React.ComponentType<any>;
  value: string | number;
  description: string;
}

export interface ChartCardProps {
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
}

export interface SalesDataPoint {
  name: string;
  courses: number;
  products: number;
}

export interface RecentSale {
  name: string;
  email: string;
  amount: string;
}
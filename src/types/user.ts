import { RoleName } from './enum';

// ================= USER TYPES =================

export interface User {
  id: number;
  email: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  address?: string | null;
  role: RoleName;
  isBuyer: boolean;
  isStudent: boolean;
  createdAt: Date;
}

// User with relations (optional, for when you need populated data)
export interface UserWithRelations extends User {
  products?: Product[];
  productReviews?: ProductReview[];
  courses?: Course[];
  lessonProgresses?: LessonProgress[];
  carts?: Cart[];
  payments?: Payment[];
  productOrders?: ProductOrder[];
  courseEnrollments?: CourseEnrollment[];
  assignmentSubmissions?: AssignmentSubmission[];
}

// For forms and API requests
export interface CreateUserDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  role: RoleName;
  isBuyer?: boolean;
  isStudent?: boolean;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  role?: RoleName;
  isBuyer?: boolean;
  isStudent?: boolean;
}

// For login
export interface LoginDto {
  email: string;
  password: string;
}

// For auth response
export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// Import types from other files (these will be defined in other files)
import type { Product } from './product';
import type { ProductReview } from './product';
import type { Course } from './course';
import type { LessonProgress } from './course';
import type { Cart } from './cart';
import type { Payment } from './payment';
import type { ProductOrder } from './order';
import type { CourseEnrollment } from './course';
import type { AssignmentSubmission } from './course';
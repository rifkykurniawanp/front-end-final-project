import { RoleName } from "./enum";

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

export interface UserWithRelations extends User {
  products?: any[];
  productReviews?: any[];
  courses?: any[];
  lessonProgresses?: any[];
  carts?: any[];
  payments?: any[];
  productOrders?: any[];
  courseEnrollments?: any[];
  assignmentSubmissions?: any[];
}

import { CourseLevel, CourseCategory } from './enum';

// ================= COURSE TYPES =================

export interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description?: string;
  syllabus?: string;
  price: number;
  rating: number;
  students: number;
  duration?: string;
  level: CourseLevel;
  category: CourseCategory;
  language: string;
  certificate: boolean;
  createdAt: Date;
  instructor: Instructor;
}

export interface CreateCourseDto {
  title: string;
  slug: string;
  description?: string;
  syllabus?: string;
  price: number;
  instructorId: number;
  duration?: string;
  level: CourseLevel;
  category: CourseCategory;
  language?: string;
  certificate?: boolean;
}

export interface UpdateCourseDto {
  title?: string;
  slug?: string;
  description?: string;
  syllabus?: string;
  price?: number;
  instructorId?: number;
  duration?: string;
  level?: CourseLevel;
  category?: CourseCategory;
  language?: string;
  certificate?: boolean;
}

export interface CourseWithRelations extends Course {
  modules?: Array<any>;
  enrollments?: Array<any>;
}

export interface CourseResponseDto {
  id: number;
  title: string;
  slug: string;
  description?: string;
  syllabus?: string;
  price: number;
  rating: number;
  students: number;
  duration?: string;
  level: CourseLevel;
  category: CourseCategory;
  language: string;
  certificate: boolean;
  createdAt: Date;
  instructor: Instructor;
  modules?: Array<any>;
  enrollments?: Array<any>;
}

export interface CoursePaginationParams {
  page?: number;
  limit?: number;
}

// ================= PAGINATION TYPES =================
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
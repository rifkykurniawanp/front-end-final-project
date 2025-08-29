import { CourseLevel, CourseCategory } from './enum';
import { ModuleWithLessons, Enrollment } from './course-dto';

// ================= INSTRUCTOR TYPES =================
export interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

// ================= COURSE TYPES =================
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
  modules?: ModuleWithLessons[];
  enrollments?: Enrollment[];
}


export interface CourseResponseDto extends Course {
  modules?: ModuleWithLessons[];
  enrollments?: Enrollment[];
}

// ================= PAGINATION TYPES =================
export interface CoursePaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ================= FILTER TYPES =================
export interface CourseFilterParams {
  level?: CourseLevel;
  category?: CourseCategory;
  priceMin?: number;
  priceMax?: number;
  language?: string;
}

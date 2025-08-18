import { CourseCategory, CourseLevel, LessonType } from './enum';
import type { User } from './user';

// ================= COURSE TYPES =================

export interface Course {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  syllabus?: string | null;
  price: number;
  instructorId: number;
  rating: number;
  students: number;
  duration?: string | null;
  level: CourseLevel;
  category: CourseCategory;
  language: string;
  certificate: boolean;
  createdAt: Date;
}

export interface CourseWithRelations extends Course {
  instructor?: User;
  modules?: CourseModule[];
  cartItems?: CartItem[];
  enrollments?: CourseEnrollment[];
}

export interface CourseModule {
  id: number;
  courseId: number;
  title: string;
  orderNumber: number;
  course?: Course;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  moduleId: number;
  slug?: string | null;
  title: string;
  description?: string | null;
  duration?: string | null;
  type: LessonType;
  videoUrl?: string | null;
  content?: string | null;
  quizQuestions?: any; // JSON type
  passingScore: number;
  orderNumber: number;
  createdAt: Date;
  module?: CourseModule;
  progresses?: LessonProgress[];
  assignments?: Assignment[];
}

export interface LessonProgress {
  lessonId: number;
  userId: number;
  completed: boolean;
  updatedAt: Date;
  lesson?: Lesson;
  user?: User;
}

export interface Assignment {
  id: number;
  lessonId: number;
  title: string;
  instructions: string;
  dueDate?: Date | null;
  createdAt: Date;
  lesson?: Lesson;
  submissions?: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  userId: number;
  content?: string | null;
  grade?: number | null;
  submittedAt: Date;
  assignment?: Assignment;
  user?: User;
}

export interface CourseEnrollment {
  id: number;
  courseId: number;
  studentId: number;
  paymentId: number;
  pricePaid: number;
  progress: number;
  certificateAwarded: boolean;
  enrolledAt: Date;
  course?: Course;
  student?: User;
  payment?: Payment;
  certificate?: Certificate;
}

export interface Certificate {
  id: number;
  enrollmentId: number;
  finalLessonsCompleted: boolean;
  finalAssignmentsCompleted: boolean;
  eligible: boolean;
  issuedAt?: Date | null;
  certificateUrl?: string | null;
  enrollment?: CourseEnrollment;
}

// For forms and API requests
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
  duration?: string;
  level?: CourseLevel;
  category?: CourseCategory;
  language?: string;
  certificate?: boolean;
}

export interface CreateCourseModuleDto {
  courseId: number;
  title: string;
  orderNumber: number;
}

export interface UpdateCourseModuleDto {
  title?: string;
  orderNumber?: number;
}

export interface CreateLessonDto {
  moduleId: number;
  slug?: string;
  title: string;
  description?: string;
  duration?: string;
  type: LessonType;
  videoUrl?: string;
  content?: string;
  quizQuestions?: any;
  passingScore?: number;
  orderNumber: number;
}

export interface UpdateLessonDto {
  slug?: string;
  title?: string;
  description?: string;
  duration?: string;
  type?: LessonType;
  videoUrl?: string;
  content?: string;
  quizQuestions?: any;
  passingScore?: number;
  orderNumber?: number;
}

export interface CreateAssignmentDto {
  lessonId: number;
  title: string;
  instructions: string;
  dueDate?: Date;
}

export interface UpdateAssignmentDto {
  title?: string;
  instructions?: string;
  dueDate?: Date;
}

export interface CreateAssignmentSubmissionDto {
  assignmentId: number;
  content?: string;
}

export interface UpdateAssignmentSubmissionDto {
  content?: string;
  grade?: number;
}

export interface UpdateLessonProgressDto {
  completed: boolean;
}

// For filtering and searching
export interface CourseFilterDto {
  category?: CourseCategory[];
  level?: CourseLevel[];
  minPrice?: number;
  maxPrice?: number;
  instructorId?: number;
  language?: string;
  certificate?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'price' | 'rating' | 'students' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Import types from other files
import type { CartItem } from './cart';
import type { Payment } from './payment';
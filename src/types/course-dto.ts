import { Course, CourseModule, Lesson, CourseLevel, CourseCategory, LessonType } from "./";

// ================= LESSON TYPES =================
export interface LessonWithProgress {
  id: number;
  title: string;
  type: LessonType;
  duration?: string; // Sesuai Prisma, string? (misal "10m", "1h")
  completed: boolean;
  description?: string;
  orderNumber?: number;
}

// ================= MODULE TYPES =================
export interface ModuleWithLessons {
  id: number;
  title: string;
  orderNumber: number; // Sesuai Prisma: CourseModule.orderNumber
  description?: string; // opsional, jika API menambahkan
  lessons?: LessonWithProgress[];
}

// ================= COURSE TYPES =================
export interface CourseWithRelationsDTO extends Course {
  modules?: ModuleWithLessons[];
  enrollments?: any[];
  originalPrice?: number; // opsional, jika API menyediakan diskon atau harga awal
}

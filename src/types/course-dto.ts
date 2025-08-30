import { Course, CourseModule, Lesson, CourseLevel, CourseCategory, LessonType } from "./";

// ================= LESSON TYPES =================
export interface LessonWithProgress {
  id: number;
  title: string;
  slug?: string | null;
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
export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: Date;
  // Add more fields as needed
}

export interface CourseWithRelationsDTO extends Course {
  modules?: ModuleWithLessons[];
  enrollments?: Enrollment[];
  originalPrice?: number; // opsional, jika API menyediakan diskon atau harga awal
}

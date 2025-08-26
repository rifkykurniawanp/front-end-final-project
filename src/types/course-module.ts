import type { Lesson } from "./lesson";

// ================= COURSE MODULE TYPES =================
export interface CourseModule {
  id: number;
  title: string;
  orderNumber: number;
  courseId: number;
  createdAt: Date;
  deletedAt?: Date | null;
  lessons?: Lesson[];
}

export interface CreateCourseModuleDto {
  title: string;
  orderNumber: number;
  courseId: number;
}

export interface UpdateCourseModuleDto {
  title?: string;
  orderNumber?: number;
}

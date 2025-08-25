import type { Lesson } from './lesson';

// ================= COURSE MODULE TYPES =================

export interface CourseModule {
  id: number;
  title: string;
  orderNumber: number;
  courseId: number;
  lessons: Lesson[];
  createdAt: Date;
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
import { LessonType } from "./enum";

// ================= LESSON TYPES =================
export interface Lesson {
  id: number;
  title: string;
  slug: string | null;
  description?: string;
  duration?: string;
  type: LessonType;
  moduleId: number;
  orderNumber: number;
  videoUrl?: string;
  content?: string;
  quizQuestions?: any;
  passingScore?: number;
  createdAt: Date;
}

export interface CreateLessonDto {
  title: string;
  slug?: string | null;
  description?: string;
  duration?: string;
  type?: LessonType;
  videoUrl?: string;
  content?: string;
  quizQuestions?: any;
  passingScore?: number;
  orderNumber: number;
  moduleId: number;
}

export interface UpdateLessonDto {
  title?: string;
  slug?: string | null;
  description?: string;
  duration?: string;
  type?: LessonType;
  videoUrl?: string;
  content?: string;
  quizQuestions?: any;
  passingScore?: number;
  orderNumber?: number;
}

export interface LessonResponseDto extends Lesson {}

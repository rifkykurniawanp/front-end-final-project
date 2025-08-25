import { LessonType } from './enum';

// ================= LESSON TYPES =================

export interface Lesson {
  id: number;
  title: string;
  slug?: string;
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
  description?: string;
  duration?: string;
  type?: LessonType;
  videoUrl?: string;
  content?: string;
  quizQuestions?: any;
  passingScore?: number;
  orderNumber: number;
}

export interface UpdateLessonDto {
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

export interface LessonResponseDto {
  id: number;
  title: string;
  description?: string;
  duration?: string;
  type: LessonType;
  moduleId: number;
  orderNumber: number;
  createdAt: Date;
}

export interface LessonWithRelations extends Lesson {
  module?: any;
  progress?: any;
}
import { LessonType } from "./enum";
// Define QuizQuestion type or import if exists
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct answer
  explanation: string;
}

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
  quizQuestions?: QuizQuestion[];
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
  quizQuestions?: QuizQuestion[];
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
  quizQuestions?: QuizQuestion[];
  passingScore?: number;
  orderNumber?: number;
}

export interface LessonResponseDto extends Lesson {}

// ================= LESSON PROGRESS TYPES =================

export interface LessonProgress {
  lessonId: number;
  userId: number;
  completed: boolean;
  updatedAt: Date;
}

export interface CreateLessonProgressDto {
  lessonId: number;
  userId: number;
  completed?: boolean;
}

export interface LessonProgressParams {
  userId: number;
  lessonId: number;
}

export interface LessonProgressResponseDto {
  lessonId: number;
  userId: number;
  completed: boolean;
  updatedAt: Date;
}
export interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'reading' | 'quiz' | 'practice';
  videoUrl?: string;
  content?: string;
  quiz?: QuizQuestion[];
  bookmarked?: boolean;
  notes?: string;
  completedAt?: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Module {
  id: string;
  title: string;
  slug: string;
  description: string;
  lessons: Lesson[];
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prerequisites?: string[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructor: string;
  instructorBio: string;
  instructorAvatar: string;
  rating: number;
  students: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: Module[];
  icon: React.ReactNode;
  color: string;
  category: 'Tea' | 'Coffee' | 'Herbal';
  price: number;
  originalPrice?: number;
  tags: string[];
  whatYouWillLearn: string[];
  requirements: string[];
  targetAudience: string[];
  language: string;
  lastUpdated: Date;
  certificate: boolean;
}

export interface UserProgress {
  courseId: string;
  completedLessons: string[];
  bookmarkedLessons: string[];
  notes: { [lessonId: string]: string };
  currentModule: string;
  currentLesson: string;
  totalTimeSpent: number;
  startedAt: Date;
  lastAccessedAt: Date;
}

export interface Assessment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit: number;
  attempts: number;
  maxAttempts: number;
}

export interface Certificate {
  id: string;
  courseId: string;
  studentName: string;
  completedAt: Date;
  score: number;
  instructorName: string;
  certificateUrl: string;
}
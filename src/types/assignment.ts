// ================= ASSIGNMENT TYPES =================

export interface Assignment {
  id: number;
  lessonId: number;
  title: string;
  instructions: string;
  dueDate?: Date | null;
  createdAt: Date;
  lesson?: {
    id: number;
    title: string;
    slug?: string;
    type: string;
    module: {
      id: number;
      title: string;
      course: {
        id: number;
        title: string;
        slug: string;
        instructorId: number;
      };
    };
  };
  submissionCount: number;
  gradedSubmissionCount: number;
}

export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  userId: number;
  content?: string | null;
  grade?: number | null;
  submittedAt: Date;
  user?: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  assignment?: {
    id: number;
    title: string;
    dueDate?: Date | null;
    lesson?: {
      id: number;
      title: string;
      module: {
        id: number;
        title: string;
        course: {
          id: number;
          title: string;
        };
      };
    };
  };
}

// ================= ASSIGNMENT DTOs =================

export interface CreateAssignmentDto {
  lessonId: number;
  title: string;
  instructions: string;
  dueDate?: Date;
}

export interface UpdateAssignmentDto {
  lessonId?: number;
  title?: string;
  instructions?: string;
  dueDate?: Date;
}

// ================= ASSIGNMENT SUBMISSION DTOs =================

// From assignment.ts version
export interface CreateAssignmentSubmissionDto {
  assignmentId: number;
  userId: number;
  content?: string;
}

// From assignment-submission.ts version (alternative)
export interface CreateAssignmentSubmissionDtoAlt {
  content: string;
}

// Unified version for update
export interface UpdateAssignmentSubmissionDto {
  content?: string;
  grade?: number;
}

export interface GradeAssignmentSubmissionDto {
  grade: number;
  feedback?: string;
}

// ================= ASSIGNMENT SUBMISSION STATS & LISTS =================

export interface AssignmentSubmissionStats {
  totalSubmissions: number;
  gradedSubmissions: number;
  pendingGrading: number;
  averageGrade?: number;
  highestGrade?: number;
  lowestGrade?: number;
}

export interface AssignmentSubmissionList {
  submissions: AssignmentSubmission[];
  total?: number;
  page?: number;
  limit?: number;
  stats?: {
    totalSubmissions: number;
    gradedSubmissions: number;
    averageGrade?: number;
  };
}
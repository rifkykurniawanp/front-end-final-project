import { apiFetch } from '@/lib/API/core/api-fetch';
import type { 
  Assignment, 
  AssignmentSubmission, 
  CreateAssignmentDto, 
  UpdateAssignmentDto,
  CreateAssignmentSubmissionDto,
  UpdateAssignmentSubmissionDto
} from '@/types/course';

const getAuthToken = (): string | undefined => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token') || undefined;
  }
  return undefined;
};

// ================= ASSIGNMENT MANAGEMENT =================

/**
 * Get lesson assignments
 * GET /api/lessons/{lessonId}/assignments
 * Auth: Enrolled USER, INSTRUCTOR, ADMIN
 */
export const getLessonAssignments = async (lessonId: number): Promise<Assignment[]> => {
  return apiFetch<Assignment[]>(`/lessons/${lessonId}/assignments`, {
    token: getAuthToken(),
  });
};

/**
 * Get assignment by ID
 * GET /api/assignments/{id}
 * Auth: Enrolled USER, INSTRUCTOR, ADMIN
 */
export const getAssignment = async (id: number): Promise<Assignment> => {
  return apiFetch<Assignment>(`/assignments/${id}`, {
    token: getAuthToken(),
  });
};

/**
 * Create new assignment
 * POST /api/lessons/{lessonId}/assignments
 * Auth: ADMIN, Own INSTRUCTOR
 */
export const createAssignment = async (
  lessonId: number, 
  data: CreateAssignmentDto
): Promise<Assignment> => {
  return apiFetch<Assignment>(`/lessons/${lessonId}/assignments`, {
    method: 'POST',
    body: data,
    token: getAuthToken(),
  });
};

/**
 * Update assignment
 * PUT /api/assignments/{id}
 * Auth: ADMIN, Own INSTRUCTOR
 */
export const updateAssignment = async (
  id: number, 
  data: UpdateAssignmentDto
): Promise<Assignment> => {
  return apiFetch<Assignment>(`/assignments/${id}`, {
    method: 'PUT',
    body: data,
    token: getAuthToken(),
  });
};

/**
 * Delete assignment
 * DELETE /api/assignments/{id}
 * Auth: ADMIN, Own INSTRUCTOR
 */
export const deleteAssignment = async (id: number): Promise<void> => {
  return apiFetch<void>(`/assignments/${id}`, {
    method: 'DELETE',
    token: getAuthToken(),
  });
};

// ================= ASSIGNMENT SUBMISSIONS =================

/**
 * Get assignment submissions
 * GET /api/assignments/{id}/submissions
 * Auth: ADMIN, Own INSTRUCTOR
 */
export const getAssignmentSubmissions = async (assignmentId: number): Promise<AssignmentSubmission[]> => {
  return apiFetch<AssignmentSubmission[]>(`/assignments/${assignmentId}/submissions`, {
    token: getAuthToken(),
  });
};

/**
 * Submit assignment
 * POST /api/assignments/{id}/submit
 * Auth: USER (Student)
 */
export const submitAssignment = async (
  assignmentId: number, 
  data: CreateAssignmentSubmissionDto
): Promise<AssignmentSubmission> => {
  return apiFetch<AssignmentSubmission>(`/assignments/${assignmentId}/submit`, {
    method: 'POST',
    body: data,
    token: getAuthToken(),
  });
};

/**
 * Get submission by ID
 * GET /api/submissions/{id}
 * Auth: ADMIN, INSTRUCTOR, Own USER
 */
export const getSubmission = async (id: number): Promise<AssignmentSubmission> => {
  return apiFetch<AssignmentSubmission>(`/submissions/${id}`, {
    token: getAuthToken(),
  });
};

/**
 * Update submission
 * PUT /api/submissions/{id}
 * Auth: ADMIN, Own USER
 */
export const updateSubmission = async (
  id: number, 
  data: UpdateAssignmentSubmissionDto
): Promise<AssignmentSubmission> => {
  return apiFetch<AssignmentSubmission>(`/submissions/${id}`, {
    method: 'PUT',
    body: data,
    token: getAuthToken(),
  });
};

/**
 * Delete submission
 * DELETE /api/submissions/{id}
 * Auth: ADMIN, Own USER
 */
export const deleteSubmission = async (id: number): Promise<void> => {
  return apiFetch<void>(`/submissions/${id}`, {
    method: 'DELETE',
    token: getAuthToken(),
  });
};

/**
 * Grade submission
 * PUT /api/submissions/{id}/grade
 * Auth: ADMIN, Own INSTRUCTOR
 */
export const gradeSubmission = async (
  id: number, 
  grade: number
): Promise<AssignmentSubmission> => {
  return apiFetch<AssignmentSubmission>(`/submissions/${id}/grade`, {
    method: 'PUT',
    body: { grade },
    token: getAuthToken(),
  });
};

// ================= UTILITY FUNCTIONS =================

/**
 * Get user's submissions for a specific assignment
 * This is a helper function that filters submissions by user
 */
export const getUserAssignmentSubmission = async (
  assignmentId: number,
  userId: number
): Promise<AssignmentSubmission | null> => {
  try {
    const submissions = await getAssignmentSubmissions(assignmentId);
    return submissions.find(sub => sub.userId === userId) || null;
  } catch (error) {
    console.error('Error getting user assignment submission:', error);
    return null;
  }
};

/**
 * Check if user has submitted assignment
 */
export const hasUserSubmittedAssignment = async (
  assignmentId: number,
  userId: number
): Promise<boolean> => {
  const submission = await getUserAssignmentSubmission(assignmentId, userId);
  return submission !== null;
};

/**
 * Get assignment with submissions (for instructors)
 */
export const getAssignmentWithSubmissions = async (id: number): Promise<Assignment & { submissions: AssignmentSubmission[] }> => {
  const [assignment, submissions] = await Promise.all([
    getAssignment(id),
    getAssignmentSubmissions(id)
  ]);
  
  return {
    ...assignment,
    submissions
  };
};

/**
 * Get assignments for multiple lessons at once
 */
export const getMultipleLessonAssignments = async (lessonIds: number[]): Promise<Record<number, Assignment[]>> => {
  const promises = lessonIds.map(async (lessonId) => {
    try {
      const assignments = await getLessonAssignments(lessonId);
      return { lessonId, assignments };
    } catch (error) {
      console.error(`Error fetching assignments for lesson ${lessonId}:`, error);
      return { lessonId, assignments: [] };
    }
  });

  const results = await Promise.all(promises);
  
  return results.reduce((acc, { lessonId, assignments }) => {
    acc[lessonId] = assignments;
    return acc;
  }, {} as Record<number, Assignment[]>);
};

/**
 * Get user's submission status for multiple assignments
 */
export const getUserSubmissionStatuses = async (
  assignmentIds: number[],
  userId: number
): Promise<Record<number, boolean>> => {
  const promises = assignmentIds.map(async (assignmentId) => {
    try {
      const hasSubmitted = await hasUserSubmittedAssignment(assignmentId, userId);
      return { assignmentId, hasSubmitted };
    } catch (error) {
      console.error(`Error checking submission status for assignment ${assignmentId}:`, error);
      return { assignmentId, hasSubmitted: false };
    }
  });

  const results = await Promise.all(promises);
  
  return results.reduce((acc, { assignmentId, hasSubmitted }) => {
    acc[assignmentId] = hasSubmitted;
    return acc;
  }, {} as Record<number, boolean>);
};

// ================= EXPORT DEFAULT =================

const assignmentApi = {
  // Assignment CRUD
  getLessonAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  
  // Submission CRUD
  getAssignmentSubmissions,
  submitAssignment,
  getSubmission,
  updateSubmission,
  deleteSubmission,
  gradeSubmission,
  
  // Utility functions
  getUserAssignmentSubmission,
  hasUserSubmittedAssignment,
  getAssignmentWithSubmissions,
  getMultipleLessonAssignments,
  getUserSubmissionStatuses,
};

export default assignmentApi;
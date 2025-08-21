import { apiFetch } from '@/lib/API/core/api-fetch';
import type { 
  Assignment, 
  CreateAssignmentDto, 
  UpdateAssignmentDto
} from '@/types/course';

const getAuthToken = (): string | undefined => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token') || undefined;
  }
  return undefined;
};

// ================= ASSIGNMENT MANAGEMENT =================

/**
 * Get all assignments
 * GET /api/assignments
 * Auth: ADMIN, INSTRUCTOR, USER
 */
export const getAllAssignments = async (): Promise<Assignment[]> => {
  return apiFetch<Assignment[]>('/assignments', {
    token: getAuthToken(),
  });
};

/**
 * Get assignment by ID
 * GET /api/assignments/{id}
 * Auth: ADMIN, INSTRUCTOR, USER
 */
export const getAssignment = async (id: number): Promise<Assignment> => {
  return apiFetch<Assignment>(`/assignments/${id}`, {
    token: getAuthToken(),
  });
};

/**
 * Create new assignment
 * POST /api/assignments
 * Auth: ADMIN, INSTRUCTOR
 */
export const createAssignment = async (data: CreateAssignmentDto): Promise<Assignment> => {
  return apiFetch<Assignment>('/assignments', {
    method: 'POST',
    body: data,
    token: getAuthToken(),
  });
};

/**
 * Update assignment
 * PUT /api/assignments/{id}
 * Auth: ADMIN, INSTRUCTOR
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
 * Auth: ADMIN, INSTRUCTOR
 */
export const deleteAssignment = async (id: number): Promise<void> => {
  return apiFetch<void>(`/assignments/${id}`, {
    method: 'DELETE',
    token: getAuthToken(),
  });
};

// ================= EXPORT DEFAULT =================

const assignmentApi = {
  getAllAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};

export default assignmentApi;
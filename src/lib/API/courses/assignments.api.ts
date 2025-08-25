// src/lib/API/assignmentApi.ts
import { apiFetch } from '@/lib/API/core/api-fetch';
import type {
  Assignment,
  AssignmentSubmission,
  CreateAssignmentDto,
  UpdateAssignmentDto,
  CreateAssignmentSubmissionDto,
  UpdateAssignmentSubmissionDto,
  GradeAssignmentSubmissionDto,
  AssignmentSubmissionStats,
} from '@/types/assignment';

const getAuthToken = (): string | undefined => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token') || undefined;
  }
  return undefined;
};

// ================= ASSIGNMENTS =================
export const assignmentApi = {
  getAll: (): Promise<Assignment[]> =>
    apiFetch<Assignment[]>('/assignments', { token: getAuthToken() }),

  getById: (id: number): Promise<Assignment> =>
    apiFetch<Assignment>(`/assignments/${id}`, { token: getAuthToken() }),

  create: (data: CreateAssignmentDto): Promise<Assignment> =>
    apiFetch<Assignment>('/assignments', {
      method: 'POST',
      body: data,
      token: getAuthToken(),
    }),

  update: (id: number, data: UpdateAssignmentDto): Promise<Assignment> =>
    apiFetch<Assignment>(`/assignments/${id}`, {
      method: 'PUT',
      body: data,
      token: getAuthToken(),
    }),

  delete: (id: number): Promise<void> =>
    apiFetch<void>(`/assignments/${id}`, {
      method: 'DELETE',
      token: getAuthToken(),
    }),

  getByLesson: (lessonId: number): Promise<Assignment[]> =>
    apiFetch<Assignment[]>(`/assignments/lesson/${lessonId}`, {
      token: getAuthToken(),
    }),

  getByCourse: (courseId: number): Promise<Assignment[]> =>
    apiFetch<Assignment[]>(`/assignments/course/${courseId}`, {
      token: getAuthToken(),
    }),
};

// ================= SUBMISSIONS =================
export const assignmentSubmissionApi = {
  getByAssignment: (
    assignmentId: number,
    params?: { page?: number; limit?: number; graded?: boolean; userId?: number }
  ): Promise<AssignmentSubmission[]> => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.graded !== undefined) query.append('graded', params.graded.toString());
    if (params?.userId) query.append('userId', params.userId.toString());

    const queryString = query.toString();
    return apiFetch<AssignmentSubmission[]>(
      `/assignments/${assignmentId}/submissions${queryString ? `?${queryString}` : ''}`,
      { token: getAuthToken() }
    );
  },

  getById: (id: number): Promise<AssignmentSubmission> =>
    apiFetch<AssignmentSubmission>(`/submissions/${id}`, { token: getAuthToken() }),

  create: (data: CreateAssignmentSubmissionDto): Promise<AssignmentSubmission> =>
    apiFetch<AssignmentSubmission>('/assignments/submissions', {
      method: 'POST',
      body: data,
      token: getAuthToken(),
    }),

  update: (id: number, data: UpdateAssignmentSubmissionDto): Promise<AssignmentSubmission> =>
    apiFetch<AssignmentSubmission>(`/submissions/${id}`, {
      method: 'PATCH',
      body: data,
      token: getAuthToken(),
    }),

  delete: (id: number): Promise<void> =>
    apiFetch<void>(`/submissions/${id}`, {
      method: 'DELETE',
      token: getAuthToken(),
    }),

  grade: (id: number, data: GradeAssignmentSubmissionDto): Promise<AssignmentSubmission> =>
    apiFetch<AssignmentSubmission>(`/submissions/${id}/grade`, {
      method: 'PUT',
      body: data,
      token: getAuthToken(),
    }),

  getStats: (assignmentId: number): Promise<AssignmentSubmissionStats> =>
    apiFetch<AssignmentSubmissionStats>(`/assignments/${assignmentId}/submissions/stats`, {
      token: getAuthToken(),
    }),
};

export default { ...assignmentApi, ...assignmentSubmissionApi };

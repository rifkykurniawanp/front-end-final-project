import { apiFetch } from "../core/api-fetch";
import type {
  AssignmentSubmission,
  AssignmentSubmissionList,
  CreateAssignmentSubmissionDto,
  UpdateAssignmentSubmissionDto,
  GradeAssignmentSubmissionDto,
  AssignmentSubmissionStats,
} from "@/types";

export const assignmentSubmissionsApi = {
  getByAssignment: (
    assignmentId: number, 
    token: string,
    params?: { page?: number; limit?: number; graded?: boolean; userId?: number }
  ) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.graded !== undefined) queryParams.append('graded', params.graded.toString());
    if (params?.userId) queryParams.append('userId', params.userId.toString());
    
    const queryString = queryParams.toString();
    return apiFetch<AssignmentSubmissionList>(
      `/assignments/${assignmentId}/submissions${queryString ? `?${queryString}` : ''}`, 
      { token }
    );
  },
   
  getById: (id: number, token: string) =>
    apiFetch<AssignmentSubmission>(`/submissions/${id}`, { token }),
   
  submit: (assignmentId: number, data: CreateAssignmentSubmissionDto, token: string) =>
    apiFetch<AssignmentSubmission>(`/assignments/${assignmentId}/submit`, {
      method: "POST",
      body: { ...data },
      token,
    }),
   
  update: (id: number, data: UpdateAssignmentSubmissionDto, token: string) =>
    apiFetch<AssignmentSubmission>(`/submissions/${id}`, {
      method: "PUT",
      body: { ...data },
      token,
    }),
   
  delete: (id: number, token: string) =>
    apiFetch<void>(`/submissions/${id}`, {
      method: "DELETE",
      token,
    }),
   
  grade: (id: number, data: GradeAssignmentSubmissionDto, token: string) =>
    apiFetch<AssignmentSubmission>(`/submissions/${id}/grade`, {
      method: "PUT",
      body: { ...data },
      token,
    }),

  getStats: (assignmentId: number, token: string) =>
    apiFetch<AssignmentSubmissionStats>(`/assignments/${assignmentId}/submissions/stats`, { token }),
};


import { apiFetch } from "../core/api-fetch";
import { AssignmentSubmission, CreateAssignmentSubmissionDto, UpdateAssignmentSubmissionDto } from "@/types/course";

export const assignmentSubmissionsApi = {

  getByAssignment: (assignmentId: number, token: string) =>
    apiFetch<AssignmentSubmission[]>(`/assignments/${assignmentId}/submissions`, { token }),
   
  getByUser: (userId: number, token: string) =>
    apiFetch<AssignmentSubmission[]>(`/users/${userId}/assignment-submissions`, { token }),
    
  getById: (id: number, token: string) =>
    apiFetch<AssignmentSubmission>(`/assignment-submissions/${id}`, { token }),
   
  create: (data: CreateAssignmentSubmissionDto, token: string) =>
    apiFetch<AssignmentSubmission>("/assignment-submissions", {
      method: "POST",
      body: data,
      token,
    }),
   
  update: (id: number, data: UpdateAssignmentSubmissionDto, token: string) =>
    apiFetch<AssignmentSubmission>(`/assignment-submissions/${id}`, {
      method: "PATCH",
      body: data,
      token,
    }),
    
  delete: (id: number, token: string) =>
    apiFetch<{ message: string }>(`/assignment-submissions/${id}`, {
      method: "DELETE",
      token,
    }),
    
 
  grade: (id: number, grade: number, token: string) =>
    apiFetch<AssignmentSubmission>(`/assignment-submissions/${id}/grade`, {
      method: "PATCH",
      body: { grade },
      token,
    }),
};

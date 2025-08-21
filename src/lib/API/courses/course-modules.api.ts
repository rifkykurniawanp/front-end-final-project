// course-modules-api.ts
import { apiFetch } from "../core/api-fetch";
import { CourseModule, CreateCourseModuleDto, UpdateCourseModuleDto } from "@/types/course";

export const courseModulesApi = {
  // Matches: POST /api/courses/:courseId/modules
  create: (courseId: number, data: CreateCourseModuleDto, token: string) =>
    apiFetch<CourseModule>(`/courses/${courseId}/modules`, {
      method: "POST",
      body: data,
      token,
    }),

  // Matches: GET /api/courses/:courseId/modules  
  getByCourse: (courseId: number, token?: string) =>
    apiFetch<CourseModule[]>(`/courses/${courseId}/modules`, { token }),
   
  // Matches: GET /api/modules/:id
  getById: (id: number, token?: string) =>
    apiFetch<CourseModule>(`/modules/${id}`, { token }),
   
  // Matches: PUT /api/modules/:id
  update: (id: number, data: UpdateCourseModuleDto, token: string) =>
    apiFetch<CourseModule>(`/modules/${id}`, {
      method: "PUT",
      body: data,
      token,
    }),
   
  // Matches: DELETE /api/modules/:id
  delete: (id: number, token: string) =>
    apiFetch<void>(`/modules/${id}`, {
      method: "DELETE",
      token,
    }),
};
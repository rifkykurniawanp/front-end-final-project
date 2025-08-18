import { apiFetch } from "./api-fetch";
import { CourseModule, CreateCourseModuleDto, UpdateCourseModuleDto } from "@/types/course";

export const courseModulesApi = {
 
  getByCourse: (courseId: number, token?: string) =>
    apiFetch<CourseModule[]>(`/api/v1/courses/${courseId}/modules`, { token }),

  getById: (id: number, token?: string) =>
    apiFetch<CourseModule>(`/api/v1/course-modules/${id}`, { token }),
    
  create: (data: CreateCourseModuleDto, token: string) =>
    apiFetch<CourseModule>("/api/v1/course-modules", {
      method: "POST",
      body: data,
      token,
    }),
   
  update: (id: number, data: UpdateCourseModuleDto, token: string) =>
    apiFetch<CourseModule>(`/api/v1/course-modules/${id}`, {
      method: "PATCH",
      body: data,
      token,
    }),
    
  delete: (id: number, token: string) =>
    apiFetch<{ message: string }>(`/api/v1/course-modules/${id}`, {
      method: "DELETE",
      token,
    }),
};

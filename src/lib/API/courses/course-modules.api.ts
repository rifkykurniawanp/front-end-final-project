import { apiFetch } from "../core/api-fetch";
import { CourseModule, CreateCourseModuleDto, UpdateCourseModuleDto } from "@/types/course";

export const courseModulesApi = {
 
  getByCourse: (courseId: number, token?: string) =>
    apiFetch<CourseModule[]>(`/courses/${courseId}/modules`, { token }),

  getById: (id: number, token?: string) =>
    apiFetch<CourseModule>(`/course-modules/${id}`, { token }),
    
  create: (data: CreateCourseModuleDto, token: string) =>
    apiFetch<CourseModule>("/course-modules", {
      method: "POST",
      body: data,
      token,
    }),
   
  update: (id: number, data: UpdateCourseModuleDto, token: string) =>
    apiFetch<CourseModule>(`/course-modules/${id}`, {
      method: "PATCH",
      body: data,
      token,
    }),
    
  delete: (id: number, token: string) =>
    apiFetch<{ message: string }>(`/course-modules/${id}`, {
      method: "DELETE",
      token,
    }),
};

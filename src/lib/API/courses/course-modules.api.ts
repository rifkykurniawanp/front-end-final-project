import { apiFetch } from "../core/api-fetch";
import {
  CourseModule,
  CreateCourseModuleDto,
  UpdateCourseModuleDto,
} from "@/types/course-module";

export const courseModulesApi = {
  // Create module
  create: (data: CreateCourseModuleDto, token: string) =>
    apiFetch<CourseModule>(`/course-modules`, { method: "POST", body: data, token }),

  // Get all modules of a course
  getByCourse: (courseId: number, token?: string) =>
    apiFetch<CourseModule[]>(`/course-modules/course/${courseId}`, { token }),

  // Get module by ID
  getById: (id: number, token?: string) =>
    apiFetch<CourseModule>(`/course-modules/${id}`, { token }),

  // Update module by ID
  update: (id: number, data: UpdateCourseModuleDto, token: string) =>
    apiFetch<CourseModule>(`/course-modules/${id}`, { method: "PATCH", body: data, token }),

  // Soft delete module
  delete: (id: number, token: string) =>
    apiFetch<void>(`/course-modules/${id}`, { method: "DELETE", token }),

  // Restore soft deleted module
  restore: (id: number, token: string) =>
    apiFetch<CourseModule>(`/course-modules/${id}/restore`, { method: "PATCH", token }),

  // Force delete (admin only)
  forceDelete: (id: number, token: string) =>
    apiFetch<void>(`/course-modules/${id}/force`, { method: "DELETE", token }),
};

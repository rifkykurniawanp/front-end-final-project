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
    apiFetch<CourseModule[]>(`/course-modules/course/${courseId.toString()}`, { token }),

  // Get module by ID
  getById: (id: number, token?: string) =>
    apiFetch<CourseModule>(`/course-modules/${id.toString()}`, { token }),

  // Update module by ID
  update: (id: number, data: UpdateCourseModuleDto, token: string) =>
    apiFetch<CourseModule>(`/course-modules/${id.toString()}`, { method: "PATCH", body: data, token }),

  // Soft delete module
  delete: (id: number, token: string) =>
    apiFetch<void>(`/course-modules/${id.toString()}`, { method: "DELETE", token }),

  // Restore soft deleted module
  restore: (id: number, token: string) =>
    apiFetch<CourseModule>(`/course-modules/${id.toString()}/restore`, { method: "PATCH", token }),

  // Force delete (admin only)
  forceDelete: (id: number, token: string) =>
    apiFetch<void>(`/course-modules/${id.toString()}/force`, { method: "DELETE", token }),
};
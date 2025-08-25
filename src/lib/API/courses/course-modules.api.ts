// src/lib/API/course-modules-api.ts
import { apiFetch } from '../core/api-fetch';
import { CourseModule, CreateCourseModuleDto, UpdateCourseModuleDto } from '@/types/course-module';

export const courseModulesApi = {
  create: (courseId: number, data: CreateCourseModuleDto, token: string) =>
    apiFetch<CourseModule>(`/courses/${courseId}/modules`, { method: 'POST', body: data, token }),

  getByCourse: (courseId: number, token?: string) =>
    apiFetch<CourseModule[]>(`/courses/${courseId}/modules`, { token }),

  getById: (id: number, token?: string) =>
    apiFetch<CourseModule>(`/modules/${id}`, { token }),

  update: (id: number, data: UpdateCourseModuleDto, token: string) =>
    apiFetch<CourseModule>(`/modules/${id}`, { method: 'PUT', body: data, token }),

  delete: (id: number, token: string) =>
    apiFetch<void>(`/modules/${id}`, { method: 'DELETE', token }),
};

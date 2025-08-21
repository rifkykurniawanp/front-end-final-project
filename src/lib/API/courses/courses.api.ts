// courses-api.ts
import { Course, CreateCourseDto, UpdateCourseDto, CourseWithRelations } from "@/types/course";
import { apiFetch } from "../core/api-fetch";

export const coursesApi = {
  getAll: (params?: { page?: number; limit?: number }, token?: string) =>
    apiFetch<Course[]>(`/courses${params ? `?page=${params.page || 1}&limit=${params.limit || 10}` : ''}`, { token }),
   
  getById: (id: number, token?: string) =>
    apiFetch<CourseWithRelations>(`/courses/${id}`, { token }),
 
  // ADD: getBySlug method using getAll as workaround since backend doesn't have slug endpoint
  getBySlug: async (slug: string, token?: string): Promise<CourseWithRelations | null> => {
    try {
      // Get all courses and find by slug
      const allCourses = await apiFetch<Course[]>(`/courses?page=1&limit=100`, { token });
      
      // Find course by slug
      const foundCourse = allCourses.find((course: any) => course.slug === slug);
      
      if (foundCourse) {
        // Get full course details with relations
        return await apiFetch<CourseWithRelations>(`/courses/${foundCourse.id}`, { token });
      }
      
      return null;
    } catch (error) {
      console.error("Error finding course by slug:", error);
      throw error;
    }
  },
 
  create: (data: CreateCourseDto, token: string) =>
    apiFetch<Course>("/courses", {
      method: "POST",
      body: data,
      token,
    }),
   
  update: (id: number, data: UpdateCourseDto, token: string) =>
    apiFetch<Course>(`/courses/${id}`, {
      method: "PATCH",
      body: data,
      token,
    }),
   
  delete: (id: number, token: string) =>
    apiFetch<void>(`/courses/${id}`, {
      method: "DELETE",
      token,
    }),
};
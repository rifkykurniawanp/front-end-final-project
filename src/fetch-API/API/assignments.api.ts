import { apiFetch } from "./api-fetch";
import { Certificate } from "@/types/course";

export const certificatesApi = {
 
  getByEnrollment: (enrollmentId: number, token: string) =>
    apiFetch<Certificate>(`/api/v1/course-enrollments/${enrollmentId}/certificate`, { token }),
    
  getByStudent: (studentId: number, token: string) =>
    apiFetch<Certificate[]>(`/api/v1/students/${studentId}/certificates`, { token }),
   
  getById: (id: number, token: string) =>
    apiFetch<Certificate>(`/api/v1/certificates/${id}`, { token }),
    
  generate: (enrollmentId: number, token: string) =>
    apiFetch<Certificate>(`/api/v1/certificates/generate/${enrollmentId}`, {
      method: "POST",
      token,
    }),
    
  download: (id: number, token: string) =>
    apiFetch<Blob>(`/api/v1/certificates/${id}/download`, { token, isBlob: true }),
};

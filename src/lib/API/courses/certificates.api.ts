import { apiFetch } from "../core/api-fetch";
import { Certificate } from "@/types/course";

export const certificatesApi = {
  getByEnrollment: (enrollmentId: number, token: string) =>
    apiFetch<Certificate>(`/course-enrollments/${enrollmentId}/certificate`, { token }),
    

  getByStudent: (studentId: number, token: string) =>
    apiFetch<Certificate[]>(`/users/${studentId}/certificates`, { token }),
    
  getById: (id: number, token: string) =>
    apiFetch<Certificate>(`/certificates/${id}`, { token }),
    
  generate: (enrollmentId: number, token: string) =>
    apiFetch<Certificate>(`/certificates/generate`, {
      method: "POST",
      body: { enrollmentId },
      token,
    }),
    
  download: (id: number, token: string) =>
    apiFetch<Blob>(`/certificates/${id}/download`, { token, isBlob: true }),
};

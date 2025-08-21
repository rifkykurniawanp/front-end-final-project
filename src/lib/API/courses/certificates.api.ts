import { apiFetch } from "../core/api-fetch";
import { Certificate, IssueCertificateDto } from "@/types/course";

export const certificatesApi = {
  // Get all certificates (ADMIN only)
  getAll: (token: string) =>
    apiFetch<Certificate[]>(`/certificates`, { token }),

  // Get certificate by ID
  getById: (id: number, token: string) =>
    apiFetch<Certificate>(`/certificates/${id}`, { token }),
   
  // Get certificates by user ID
  getByUser: (userId: number, token: string) =>
    apiFetch<Certificate[]>(`/certificates/users/${userId}`, { token }),

  // Get certificates by course ID  
  getByCourse: (courseId: number, token: string) =>
    apiFetch<Certificate[]>(`/certificates/courses/${courseId}`, { token }),
   
  // Generate certificate
  generate: (data: IssueCertificateDto, token: string) =>
    apiFetch<Certificate>(`/certificates/generate`, {
      method: "POST",
      body: data,
      token,
    }),
   
  // Download certificate PDF
  download: (id: number, token: string) =>
    apiFetch<Blob>(`/certificates/${id}/download`, { token, isBlob: true }),

  // Verify certificate eligibility
  verifyEligibility: (id: number, token: string) =>
    apiFetch<Certificate>(`/certificates/${id}/verify`, {
      method: "PUT",
      token,
    }),

  // Delete certificate (ADMIN only)
  delete: (id: number, token: string) =>
    apiFetch<void>(`/certificates/${id}`, {
      method: "DELETE",
      token,
    }),
};
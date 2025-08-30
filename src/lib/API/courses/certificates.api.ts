// src/lib/API/certificatesApi.ts
import { apiFetch } from "../core/api-fetch";
import type { Certificate, IssueCertificateDto } from "@/types/certificate";

const getAuthToken = (): string | undefined => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token') || undefined;
  }
  return undefined;
};

export const certificatesApi = {
  getAll: (): Promise<Certificate[]> =>
    apiFetch<Certificate[]>(`/certificates`, { token: getAuthToken() }),

  getById: (id: number): Promise<Certificate> =>
    apiFetch<Certificate>(`/certificates/${id}`, { token: getAuthToken() }),

  getByUser: (userId: number): Promise<Certificate[]> =>
    apiFetch<Certificate[]>(`/certificates/users/${userId}`, { token: getAuthToken() }),

  getByCourse: (courseId: number): Promise<Certificate[]> =>
    apiFetch<Certificate[]>(`/certificates/courses/${courseId}`, { token: getAuthToken() }),

  generate: (data: IssueCertificateDto): Promise<Certificate> =>
    apiFetch<Certificate>(`/certificates/generate`, {
      method: "POST",
      body: { ...data },
      token: getAuthToken(),
    }),

  download: (id: number): Promise<Blob> =>
    apiFetch<Blob>(`/certificates/${id}/download`, { token: getAuthToken(), isBlob: true }),

  verifyEligibility: (id: number): Promise<Certificate> =>
    apiFetch<Certificate>(`/certificates/${id}/verify`, {
      method: "PUT",
      token: getAuthToken(),
    }),

  delete: (id: number): Promise<void> =>
    apiFetch<void>(`/certificates/${id}`, { method: "DELETE", token: getAuthToken() }),
};

export default certificatesApi;

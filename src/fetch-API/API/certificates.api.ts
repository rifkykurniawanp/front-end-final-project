/**
 * src/fetch-API/API/certificates.api.ts
 *
 * This file contains a set of API functions for managing certificates.
 * It encapsulates all logic for interacting with certificate-related endpoints,
 * using the shared 'apiFetch' utility for a consistent and reusable approach.
 */

import { apiFetch } from "./api-fetch";
import { Certificate } from "@/types/course";

/**
 * `certificatesApi` is an object containing all API-related functions for certificates.
 * It provides methods for retrieving, generating, and downloading certificates.
 */
export const certificatesApi = {
  /**
   * Fetches a certificate associated with a specific course enrollment.
   * NOTE: This endpoint does not exist in the provided backend controller.
   * You may need to add it to your backend.
   * @param enrollmentId The ID of the course enrollment.
   * @param token The user's authentication token (required).
   * @returns A promise that resolves to a Certificate object.
   */
  getByEnrollment: (enrollmentId: number, token: string) =>
    apiFetch<Certificate>(`/course-enrollments/${enrollmentId}/certificate`, { token }),
    
  /**
   * Fetches all certificates for a specific student.
   * @param studentId The ID of the student.
   * @param token The user's authentication token (required).
   * @returns A promise that resolves to an array of Certificate objects.
   */
  getByStudent: (studentId: number, token: string) =>
    apiFetch<Certificate[]>(`/users/${studentId}/certificates`, { token }),
    
  /**
   * Fetches a single certificate by its ID.
   * @param id The ID of the certificate.
   * @param token The user's authentication token (required).
   * @returns A promise that resolves to a single Certificate object.
   */
  getById: (id: number, token: string) =>
    apiFetch<Certificate>(`/certificates/${id}`, { token }),
    
  /**
   * Generates a new certificate. This endpoint is typically called by a system process.
   * It sends the enrollmentId in the request body.
   * @param enrollmentId The ID of the course enrollment.
   * @param token The user's authentication token (required).
   * @returns A promise that resolves to the newly generated Certificate object.
   */
  generate: (enrollmentId: number, token: string) =>
    apiFetch<Certificate>(`/certificates/generate`, {
      method: "POST",
      body: { enrollmentId },
      token,
    }),
    
  /**
   * Downloads a specific certificate as a PDF file.
   * @param id The ID of the certificate to download.
   * @param token The user's authentication token (required).
   * @returns A promise that resolves to a Blob containing the certificate file.
   */
  download: (id: number, token: string) =>
    apiFetch<Blob>(`/certificates/${id}/download`, { token, isBlob: true }),
};

/**
 * src/types/api.ts
 *
 * This file contains reusable types and classes for API requests,
 * ensuring consistency and a single source of truth for API-related logic.
 */

// ================= TYPES & INTERFACES =================
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

export interface FetchOptions {
  method?: HttpMethod;
  body?: any;
  token?: string;
  headers?: Record<string, string>;
  isBlob?: boolean;
  timeout?: number;
}

// ================= ERROR CLASS =================
/**
 * A custom error class for handling API-related errors.
 * It provides helper methods for identifying common error types.
 */
export class GeneralApiError extends Error {
  constructor(
    public message: string, 
    public status: number, 
    public details?: any,
    public code?: string
  ) {
    super(message);
    this.name = "GeneralApiError";
    this.code = code;
  }

  static isNetworkError(error: unknown): error is GeneralApiError {
    return error instanceof GeneralApiError && error.status === 0;
  }

  static isServerError(error: unknown): error is GeneralApiError {
    return error instanceof GeneralApiError && error.status >= 500;
  }

  static isClientError(error: unknown): error is GeneralApiError {
    return error instanceof GeneralApiError && error.status >= 400 && error.status < 500;
  }

  static isUnauthorized(error: unknown): error is GeneralApiError {
    return error instanceof GeneralApiError && error.status === 401;
  }

  static isForbidden(error: unknown): error is GeneralApiError {
    return error instanceof GeneralApiError && error.status === 403;
  }

  static isNotFound(error: unknown): error is GeneralApiError {
    return error instanceof GeneralApiError && error.status === 404;
  }

  static isValidationError(error: unknown): error is GeneralApiError {
    return error instanceof GeneralApiError && error.status === 422;
  }
}

// ================= HELPER FUNCTIONS =================
/**
 * Parses a failed HTTP response into a custom GeneralApiError.
 * @param response The failed fetch Response object.
 * @param errorText The response body text containing error details.
 * @returns A new GeneralApiError instance.
 */
export function parseApiError(response: Response, errorText: string): GeneralApiError {
  try {
    const data = JSON.parse(errorText);
    return new GeneralApiError(
      data.message || `API Error: ${response.status}`,
      response.status,
      data,
      data.code
    );
  } catch {
    return new GeneralApiError(
      `API Error: ${response.status} - ${errorText || response.statusText}`,
      response.status
    );
  }
}

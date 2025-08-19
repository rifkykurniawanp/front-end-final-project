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

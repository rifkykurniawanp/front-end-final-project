// lib/API/api-fetch.ts
import { GeneralApiError, FetchOptions, parseApiError } from "@/types/api";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://final-project-be-rifkykurniawanp-production.up.railway.app";
const API_VERSION = "/api/v1";
const API_TIMEOUT = 30000;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";


// Utility function to get token consistently (same as your other files)
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const parsed = JSON.parse(auth);
      return parsed.accessToken || null;
    }
    return null;
  } catch (error) {
    console.error("Error parsing auth from localStorage:", error);
    return null;
  }
};

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    token,
    headers = {},
    isBlob = false,
    timeout = 30000
  } = options;

  const url = `${API_BASE_URL}${API_VERSION}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  // ✅ FIX: Use consistent token access
  const authToken = token || getAuthToken();

  const requestHeaders: Record<string, string> = {
    ...(!isBlob && { "Content-Type": "application/json" }),
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw parseApiError(response, errorText);
    }

    if (isBlob) {
      return (await response.blob()) as T;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return {} as T;
    }

    const text = await response.text();
    return text ? JSON.parse(text) as T : {} as T;
  } catch (error) {
    clearTimeout(timeoutId);
   
    if (error instanceof GeneralApiError) throw error;
   
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new GeneralApiError("Request timeout", 408);
    }
   
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new GeneralApiError("Network connection failed", 0);
    }
   
    if (error instanceof Error) {
      throw new GeneralApiError(error.message, 500);
    }
   
    throw new GeneralApiError("Unknown network error", 500);
  }
}
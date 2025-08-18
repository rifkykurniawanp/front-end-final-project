/**
 * src/fetch-API/API/fetch-api.ts
 *
 * A robust, generic fetch wrapper for making API calls.
 * Handles headers, JSON bodies, timeouts, and custom error handling.
 */

import { GeneralApiError, FetchOptions, parseApiError } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://final-project-be-rifkykurniawanp-production.up.railway.app";
const API_VERSION = "/api/v1";

/**
 * A robust, generic fetch wrapper for making API calls.
 * It uses the shared types and error classes from `src/types/api.ts`.
 * @param endpoint The API endpoint to call (e.g., "/users").
 * @param options Fetch options including method, body, token, isBlob, and timeout.
 * @returns A promise of the parsed JSON response or a Blob.
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  // Destructure options to apply default values
  const { 
    method = "GET", 
    body, 
    token, 
    headers = {}, 
    isBlob = false, 
    timeout = 30000 
  } = options;

  // Construct the full URL
  const url = `${API_BASE_URL}${API_VERSION}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  // Build request headers, setting content type and authorization as needed
  const requestHeaders: Record<string, string> = {
    ...(!isBlob && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...headers,
  };

  // Create AbortController to handle request timeouts
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      // Stringify the body only if it exists
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal, // Connect the signal to the fetch request
    });

    // Clear the timeout as the request has completed
    clearTimeout(timeoutId);

    // If the response is not OK (status >= 200 and < 300), throw a custom error
    if (!response.ok) {
      const errorText = await response.text();
      // Use the helper function to parse the error into a custom GeneralApiError
      throw parseApiError(response, errorText);
    }

    // If a Blob is requested, return the Blob object
    if (isBlob) {
      return (await response.blob()) as T;
    }

    // Handle responses that may not have JSON content (e.g., 204 No Content)
    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return {} as T;
    }

    // Parse JSON from the response
    const text = await response.text();
    return text ? JSON.parse(text) as T : {} as T;
  } catch (error) {
    // Ensure the timeout is cleared even if an error occurs
    clearTimeout(timeoutId);
    
    // Re-throw if it's already a GeneralApiError
    if (error instanceof GeneralApiError) throw error;
    
    // Handle network-related and timeout errors
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new GeneralApiError("Request timeout", 408);
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new GeneralApiError("Network connection failed", 0);
    }
    
    // Catch other unexpected errors and wrap them in GeneralApiError
    if (error instanceof Error) {
      throw new GeneralApiError(error.message, 500);
    }
    
    throw new GeneralApiError("Unknown network error", 500);
  }
}

// lib/API/api-fetch.ts
import { GeneralApiError, FetchOptions, parseApiError } from "@/types/api";

// Ganti default URL ke Railway
const API_BASE_URL =
 process.env.NEXT_PUBLIC_API_BASE_URL ||
 "https://final-project-be-rifkykurniawanp-production.up.railway.app";
const API_VERSION = "/api/v1";
const DEFAULT_TIMEOUT = 30000;

// Utility untuk ambil token dari localStorage
const getAuthToken = (): string | null => {
 if (typeof window === "undefined") return null;
 try {
   const auth = localStorage.getItem("auth");
   if (!auth) return null;
   const parsed = JSON.parse(auth);
   return parsed?.accessToken || null;
 } catch (err) {
   console.error("Failed to parse auth token:", err);
   return null;
 }
};

export async function apiFetch<T = unknown>(
 endpoint: string,
 options: FetchOptions = {}
): Promise<T> {
 const { method = "GET", body, token, headers = {}, isBlob = false, timeout = DEFAULT_TIMEOUT } = options;
 const url = `${API_BASE_URL}${API_VERSION}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
 
 // DEBUG LOGGING
 console.log("API Request:", {
   url,
   method,
   body,
   endpoint
 });

 const authToken = token || getAuthToken();
 const requestHeaders: Record<string, string> = {
   ...(!isBlob ? { "Content-Type": "application/json" } : {}),
   ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
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

   console.log("API Response:", {
     url,
     status: response.status,
     ok: response.ok
   });

   clearTimeout(timeoutId);

   if (!response.ok) {
     const errorText = await response.text();
     console.log("API Error:", {
       url,
       status: response.status,
       errorText
     });
     throw parseApiError(response, errorText);
   }

   if (isBlob) return (await response.blob()) as T;
   const contentType = response.headers.get("content-type");
   if (!contentType?.includes("application/json")) return {} as T;
   const text = await response.text();
   return text ? JSON.parse(text) as T : {} as T;
 } catch (err: any) {
   clearTimeout(timeoutId);
   if (err instanceof GeneralApiError) throw err;
   if (err instanceof DOMException && err.name === "AbortError") {
     throw new GeneralApiError("Request timeout", 408);
   }
   if (err instanceof TypeError && err.message.includes("fetch")) {
     throw new GeneralApiError("Network connection failed", 0);
   }
   if (err instanceof Error) {
     throw new GeneralApiError(err.message, 500);
   }
   throw new GeneralApiError("Unknown network error", 500);
 }
}
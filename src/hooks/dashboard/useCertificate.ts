import { useState, useEffect } from "react";
import { certificatesApi } from "@/lib/API/courses";
import type { Certificate } from "@/types/certificate";

export function useCertificate(enrollmentId: number, token: string) {
  const [data, setData] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const allCertificates = await certificatesApi.getAll();
      const res = allCertificates.find((c) => c.enrollmentId === enrollmentId) || null;
      setData(res);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch certificate");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [enrollmentId, token]);

  return { data, isLoading, error, refetch: fetchData };
}

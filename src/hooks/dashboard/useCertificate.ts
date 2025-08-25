import { useState, useEffect } from "react";
import { certificatesApi } from "@/lib/API/courses";
import { Certificate } from "@/types";

export function useCertificate(enrollmentId: number, token: string) {
  const [data, setData] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await certificatesApi.getByEnrollment(enrollmentId, token);
      setData(res); // <- sudah Certificate penuh
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

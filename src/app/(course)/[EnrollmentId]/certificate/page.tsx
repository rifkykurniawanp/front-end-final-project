"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Certificate } from "@/types/course";
import { apiFetch } from "@/fetch-API/API/api-fetch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CertificatePage() {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enrollmentId) return;
    const id = Number(enrollmentId);

    apiFetch<Certificate>(`/certificates/${id}`)
      .then((data) => setCertificate(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [enrollmentId]);

  if (loading) return <p>Loading certificate...</p>;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!certificate) return <p>No certificate found</p>;

  return (
    <div className="container mx-auto p-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Course Certificate</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Course:</strong>{" "}
            {certificate.enrollment?.course?.title ?? "Unknown Course"}
          </p>
          <p>
            <strong>Category:</strong>{" "}
            {certificate.enrollment?.course?.category ?? "N/A"}
          </p>
          <p>
            <strong>Issued At:</strong>{" "}
            {certificate.issuedAt
              ? new Date(certificate.issuedAt).toLocaleDateString()
              : "Not Issued"}
          </p>
          <p>
            <strong>Eligible:</strong>{" "}
            {certificate.eligible ? "✅ Yes" : "❌ No"}
          </p>
          <p>
            <strong>Certificate URL:</strong>{" "}
            {certificate.certificateUrl ? (
              <a
                href={certificate.certificateUrl}
                className="text-blue-600 underline"
                target="_blank"
              >
                View Certificate
              </a>
            ) : (
              "Not available"
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/API/core/api-fetch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ================= TYPES =================
export interface Certificate {
  id: number;
  enrollmentId: number;
  userId: number;
  courseId: number;
  finalLessonsCompleted: boolean;
  finalAssignmentsCompleted: boolean;
  eligible: boolean;
  issuedAt?: Date;
  certificateUrl?: string;
}

export interface CertificateWithRelations extends Certificate {
  enrollment?: {
    course: {
      id: number;
      title: string;
      category?: string;
    };
  };
}

// ================= COMPONENT =================
export default function CertificatePage() {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const [certificate, setCertificate] = useState<CertificateWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enrollmentId) return;

    const id = Number(enrollmentId);
    if (isNaN(id)) {
      setError("Invalid enrollment ID");
      setLoading(false);
      return;
    }

    apiFetch<CertificateWithRelations>(`/certificates/${id}`)
      .then((data) => setCertificate(data ?? null))
      .catch((err) => setError(err.message ?? "Failed to fetch certificate"))
      .finally(() => setLoading(false));
  }, [enrollmentId]);

  if (loading) return <p>Loading certificate...</p>;
  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;
  if (!certificate) return <p>No certificate found</p>;

  return (
    <div className="container mx-auto p-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Course Certificate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Course:</strong> {certificate.enrollment?.course?.title ?? "Unknown Course"}</p>
          <p><strong>Category:</strong> {certificate.enrollment?.course?.category ?? "N/A"}</p>
          <p><strong>Issued At:</strong> {certificate.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString() : "Not Issued"}</p>
          <p><strong>Eligible:</strong> {certificate.eligible ? "✅ Yes" : "❌ No"}</p>
          <p>
            <strong>Certificate URL:</strong>{" "}
            {certificate.certificateUrl ? (
              <a href={certificate.certificateUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                View Certificate
              </a>
            ) : "Not available"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

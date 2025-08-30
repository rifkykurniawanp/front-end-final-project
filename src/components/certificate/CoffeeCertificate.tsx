import React from "react";
import { Coffee } from "lucide-react";
import { Certificate } from "@/types/certificate";

// Extend Certificate type to include enrollment relation for UI
interface CertificateWithRelations extends Certificate {
  enrollment?: {
    student?: { firstName?: string };
    course?: { title?: string };
  };
}

interface Props {
  certificate: CertificateWithRelations;
}

export function CoffeeCertificate({ certificate }: Props) {
  const studentName = certificate.enrollment?.student?.firstName ?? "Student";
  const courseName = certificate.enrollment?.course?.title ?? "Coffee Course";
  const issuedAt = certificate.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString()
    : "Not issued";

  return (
    <div className="bg-white shadow-lg rounded-2xl p-10 text-center">
      <div className="flex justify-center items-center gap-2 mb-4">
        <Coffee className="w-8 h-8 text-amber-600" />
        <h1 className="text-3xl font-bold text-gray-800">Coffee Mastery Certificate</h1>
      </div>
      <p className="text-lg text-gray-600 mb-6">
        This certifies that <strong>{studentName}</strong> has achieved excellence in
        <strong> {courseName}</strong>.
      </p>
      <p className="text-sm text-gray-500">Issued on: {issuedAt}</p>
    </div>
  );
}

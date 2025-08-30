import React from "react";
import { Leaf } from "lucide-react";
import { Certificate } from "@/types/certificate";

// Extend Certificate type locally for UI relations
interface CertificateWithRelations extends Certificate {
  enrollment?: {
    student?: { firstName?: string };
    course?: { title?: string };
  };
}

interface Props {
  certificate: CertificateWithRelations;
}

export function TeaCertificate({ certificate }: Props) {
  const studentName = certificate.enrollment?.student?.firstName ?? "Student";
  const courseName = certificate.enrollment?.course?.title ?? "Tea Course";
  const issuedAt = certificate.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString()
    : "Not issued";

  return (
    <div className="bg-white shadow-lg rounded-2xl p-10 text-center">
      <div className="flex justify-center items-center gap-2 mb-4">
        <Leaf className="w-8 h-8 text-green-600" />
        <h1 className="text-3xl font-bold text-gray-800">Tea Mastery Certificate</h1>
      </div>
      <p className="text-lg text-gray-600 mb-6">
        This is to certify that <strong>{studentName}</strong> has successfully
        completed the course <strong>{courseName}</strong>.
      </p>
      <p className="text-sm text-gray-500">Issued on: {issuedAt}</p>
    </div>
  );
}

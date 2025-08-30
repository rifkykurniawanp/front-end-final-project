import React from "react";
import { Sprout } from "lucide-react";
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

export function HerbalCertificate({ certificate }: Props) {
  const studentName = certificate.enrollment?.student?.firstName ?? "Student";
  const courseName = certificate.enrollment?.course?.title ?? "Herbal Course";
  const issuedAt = certificate.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString()
    : "Not issued";

  return (
    <div className="bg-white shadow-lg rounded-2xl p-10 text-center">
      <div className="flex justify-center items-center gap-2 mb-4">
        <Sprout className="w-8 h-8 text-emerald-600" />
        <h1 className="text-3xl font-bold text-gray-800">Herbal Mastery Certificate</h1>
      </div>
      <p className="text-lg text-gray-600 mb-6">
        This certifies that <strong>{studentName}</strong> has completed{" "}
        <strong>{courseName}</strong> with excellence in herbal knowledge.
      </p>
      <p className="text-sm text-gray-500">Issued on: {issuedAt}</p>
    </div>
  );
}

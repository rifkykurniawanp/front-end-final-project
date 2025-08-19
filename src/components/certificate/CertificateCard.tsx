"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Certificate } from "@/types/course";
import { Button } from "@/components/ui/button";

interface CertificateCardProps {
  certificate: Certificate;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const printRef = useRef<HTMLDivElement>(null);

  // ✅ Hook-based approach with proper typing
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Course Certificate",
    // optional: you can add pageStyle or onAfterPrint here
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={printRef}
        className="w-[900px] h-[600px] bg-white border-8 border-yellow-500 shadow-2xl flex flex-col items-center justify-center text-center p-12"
      >
        <h1 className="text-4xl font-extrabold mb-4">Certificate of Completion</h1>
        <p className="text-lg italic mb-6">This is proudly presented to</p>
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          {certificate.enrollment?.student?.firstName ?? "Student Name"}
        </h2>
        <p className="text-lg mb-4">For successfully completing the course:</p>
        <h3 className="text-2xl font-semibold mb-6">
          {certificate.enrollment?.course?.title ?? "Course Title"}
        </h3>
        <p className="text-md mb-2">
          Issued on:{" "}
          {certificate.issuedAt
            ? new Date(certificate.issuedAt).toLocaleDateString()
            : "Not Issued"}
        </p>
        <p className="text-md">
          Category: {certificate.enrollment?.course?.category ?? "N/A"}
        </p>

        <div className="mt-12 w-full flex justify-between px-12">
          <div className="text-center">
            <p className="border-t-2 border-black w-40 mx-auto"></p>
            <p className="text-sm mt-1">Instructor</p>
          </div>
          <div className="text-center">
            <p className="border-t-2 border-black w-40 mx-auto"></p>
            <p className="text-sm mt-1">Director</p>
          </div>
        </div>
      </div>

      {/* Print button */}
      <Button onClick={handlePrint}>Print Certificate</Button>
    </div>
  );
}

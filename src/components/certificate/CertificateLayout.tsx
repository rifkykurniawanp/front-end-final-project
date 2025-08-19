"use client";

import React from "react";
import { Printer, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { certificatesApi } from "@/lib/API/courses";

interface Props {
  certificateId: number;
  title: string;
  token: string;
  children: React.ReactNode;
}

export function CertificateLayout({ certificateId, title, token, children }: Props) {
  const handlePrint = () => window.print();

  const handleDownload = async () => {
    try {
      const blob = await certificatesApi.download(certificateId, token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download certificate PDF.");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${title} Certificate`,
        text: "Check out my certificate!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Certificate link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-green-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center gap-4 mb-8 print:hidden">
          <Button onClick={handlePrint} className="bg-amber-600 hover:bg-amber-700">
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </Button>
          <Button onClick={handleShare} variant="outline" className="border-orange-300 hover:bg-orange-50">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

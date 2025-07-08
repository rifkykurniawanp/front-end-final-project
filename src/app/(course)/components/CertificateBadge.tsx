"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Download } from "lucide-react";

interface CertificateBadgeProps {
  courseId: string;
  onViewCertificate: (courseId: string) => void;
  variant?: "badge" | "button";
}

export function CertificateBadge({ 
  courseId, 
  onViewCertificate, 
  variant = "badge" 
}: CertificateBadgeProps) {
  
  if (variant === "button") {
    return (
      <Button
        onClick={() => onViewCertificate(courseId)}
        variant="outline"
        size="sm"
        className="border-green-200 text-green-700 hover:bg-green-50"
      >
        <Award className="w-4 h-4 mr-2" />
        View Certificate
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <Award className="w-3 h-3 mr-1" />
        Completed
      </Badge>
      <Button
        onClick={() => onViewCertificate(courseId)}
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-green-700 hover:bg-green-50"
      >
        <Download className="w-3 h-3" />
      </Button>
    </div>
  );
}
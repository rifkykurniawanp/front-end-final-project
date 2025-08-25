// ================= CERTIFICATE TYPES =================

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

export interface IssueCertificateDto {
  enrollmentId: number;
}
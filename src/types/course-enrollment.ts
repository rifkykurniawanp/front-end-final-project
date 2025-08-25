import { EnrollmentStatus } from './enum';

// ================= COURSE ENROLLMENT TYPES =================

export interface CourseEnrollment {
  id: number;
  courseId: number;
  studentId: number;
  paymentId: number;
  pricePaid: number;
  status: EnrollmentStatus;
  progress: number;
  certificateAwarded: boolean;
  enrolledAt: string;
  updatedAt: string;
  course?: {
    id: number;
    title: string;
    slug?: string;
    instructorId: number;
  };
  student?: {
    id: number;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

export interface EnrollCourseDto {
  courseId: number;
  studentId: number;
  paymentId: number;
  pricePaid: number;
}

export interface UpdateEnrollmentDto {
  status?: EnrollmentStatus;
  progress?: number;
  certificateAwarded?: boolean;
}
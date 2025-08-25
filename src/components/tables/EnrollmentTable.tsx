import React, { useState } from "react";
import { CourseEnrollment, UpdateEnrollmentDto } from "@/types/course-enrollment";
import { EnrollmentStatus } from "@/types/enum";

interface EnrollmentsTableProps {
  enrollments: CourseEnrollment[];
  onUpdate: (data: UpdateEnrollmentDto & { id: number }) => void;
}

const EnrollmentsTable: React.FC<EnrollmentsTableProps> = ({ enrollments, onUpdate }) => {
  const [selectedEnrollment, setSelectedEnrollment] = useState<UpdateEnrollmentDto & { id: number } | null>(null);

  const handleUpdate = (enrollment: CourseEnrollment) => {
    const updateData: UpdateEnrollmentDto & { id: number } = {
      id: enrollment.id,
      status: enrollment.status as EnrollmentStatus,
      progress: enrollment.progress,
      certificateAwarded: enrollment.certificateAwarded,
    };
    setSelectedEnrollment(updateData);
    onUpdate(updateData);
  };

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th>Enrollment ID</th>
          <th>Student</th>
          <th>Course</th>
          <th>Status</th>
          <th>Progress</th>
          <th>Certificate</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {enrollments.map((enrollment) => (
          <tr key={enrollment.id}>
            <td>{enrollment.id}</td>
            <td>{enrollment.student?.firstName} {enrollment.student?.lastName}</td>
            <td>{enrollment.course?.title ?? enrollment.courseId}</td>
            <td>{enrollment.status}</td>
            <td>{enrollment.progress}%</td>
            <td>{enrollment.certificateAwarded ? "Yes" : "No"}</td>
            <td>
              <button onClick={() => handleUpdate(enrollment)}>Update</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EnrollmentsTable;

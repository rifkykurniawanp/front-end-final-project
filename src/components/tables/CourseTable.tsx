import React, { useState } from "react";
import { CourseResponseDto, UpdateCourseDto } from "@/types/course";
import { CourseLevel, CourseCategory } from "@/types";

interface CoursesTableProps {
  courses: CourseResponseDto[];
  onEdit: (data: UpdateCourseDto) => void;
}

const CoursesTable: React.FC<CoursesTableProps> = ({ courses, onEdit }) => {
  const [selectedCourse, setSelectedCourse] = useState<UpdateCourseDto | null>(null);

  const handleEdit = (course: CourseResponseDto) => {
    const formData: UpdateCourseDto = {
      title: course.title,
      slug: course.slug,
      description: course.description ?? undefined,
      syllabus: course.syllabus ?? undefined,
      price: course.price,
      instructorId: course.instructor.id,
      duration: course.duration ?? undefined,
      level: course.level as CourseLevel,
      category: course.category as CourseCategory,
      language: course.language ?? undefined,
      certificate: course.certificate,
    };
    setSelectedCourse(formData);
    onEdit(formData);
  };

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Instructor</th>
          <th>Level</th>
          <th>Category</th>
          <th>Certificate</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id}>
            <td>{course.title}</td>
            <td>{course.price}</td>
            <td>{course.instructor.firstName} {course.instructor.lastName}</td>
            <td>{course.level}</td>
            <td>{course.category}</td>
            <td>{course.certificate ? "Yes" : "No"}</td>
            <td>
              <button onClick={() => handleEdit(course)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CoursesTable;

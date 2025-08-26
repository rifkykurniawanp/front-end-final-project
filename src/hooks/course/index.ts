// hooks/courses/index.ts - Centralized exports
export {
  // Basic course hooks
  useCourses,
  useCourse,
  useCourseBySlug,
  useInstructorCourses,
  courseKeys,
} from './useCourses';

export {
  // Module hooks
  useCourseModules,
  moduleKeys,
} from './useCourseModules';

export {
  // Lesson hooks
  useLessonsByModule,
  useLesson,
  lessonKeys,
} from './useLessons';

export {
  // Progress hooks
  useLessonProgress,
  useMarkLessonComplete,
  progressKeys,
} from './useLessonProgress';

export {
  // Enrollment hooks
  useStudentEnrollments,
  useCourseEnrollments,
  useCheckEnrollment,
  useEnrollCourse,
  useUpdateEnrollment,
  enrollmentKeys,
} from './useCourseEnrollment';

export {
  // Composite hooks
  useCourseWithProgress,
} from './composite/useCourseWithProgress';

export {
  // Course lesson composite hook
  useCourseLesson,
} from './composite/useCourseLesson';

export {
  // Course mutations
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from './mutations/useCourseMutation';

export {
  // Performance optimizations
  usePrefetchCourse,
} from './prefetch/usePrefetchCourse';
// components/course/course-detail.tsx
import { Course } from "@/types/course"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CourseDetailProps {
  course: Course
}

export const CourseDetail = ({ course }: CourseDetailProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <img src={course.instructorAvatar} alt={course.instructor} className="w-16 h-16 rounded-full object-cover" />
          <div>
            <CardTitle className="text-lg">{course.instructor}</CardTitle>
            <p className="text-sm text-slate-600">{course.instructorBio}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-700">
        <div>
          <h4 className="font-semibold">What You Will Learn</h4>
          <ul className="list-disc list-inside">
            {course.whatYouWillLearn.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Requirements</h4>
          <ul className="list-disc list-inside">
            {course.requirements.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Target Audience</h4>
          <ul className="list-disc list-inside">
            {course.targetAudience.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-2">
          {course.tags.map((tag, index) => (
            <Badge variant="outline" key={index}>{tag}</Badge>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Language: {course.language} | Last updated: {course.lastUpdated.toLocaleDateString()} | Certificate: {course.certificate ? 'Yes' : 'No'}
        </p>
      </CardContent>
    </Card>
  )
}

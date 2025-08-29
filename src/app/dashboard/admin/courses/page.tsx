"use client";
import React, { useState } from "react";
import { useCourses } from "@/hooks/course/useCourses";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { CourseForm } from "@/components/form/CourseForm";
import { DeleteUserDialog } from "@/components/form/DeleteUserDialog"; // bisa rename jadi DeleteCourseDialog kalau mau
import { Plus, Edit, Trash2, RotateCcw, RefreshCw } from "lucide-react";
import type { CourseResponseDto, CreateCourseDto, UpdateCourseDto } from "@/types/course";

export default function AdminCoursesPage() {
  const { data, isLoading, error, refetch } = useCourses();
  
  const [showDeleted, setShowDeleted] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isForceDelete, setIsForceDelete] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseResponseDto | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleCreateCourse = async (data: CreateCourseDto) => {
    setActionLoading(true);
    setActionError(null);
    try {
      // ganti dengan API create course
      // await coursesApi.create(data, token)
      setIsCreateModalOpen(false);
    } catch (err: any) {
      setActionError(err.message || "Failed to create course");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCourse = async (data: UpdateCourseDto) => {
    if (!selectedCourse) return;
    setActionLoading(true);
    setActionError(null);
    try {
      // await coursesApi.update(selectedCourse.id, data, token)
      setIsEditModalOpen(false);
      setSelectedCourse(null);
    } catch (err: any) {
      setActionError(err.message || "Failed to update course");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    setActionLoading(true);
    setActionError(null);
    try {
      // isForceDelete ? coursesApi.forceDelete(selectedCourse.id, token) : coursesApi.delete(selectedCourse.id, token)
      setIsDeleteDialogOpen(false);
      setSelectedCourse(null);
      setIsForceDelete(false);
    } catch (err: any) {
      setActionError(err.message || "Failed to delete course");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestoreCourse = async (course: CourseResponseDto) => {
    setActionLoading(true);
    setActionError(null);
    try {
      // await coursesApi.restore(course.id, token)
    } catch (err: any) {
      setActionError(err.message || "Failed to restore course");
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (course: CourseResponseDto) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
    setActionError(null);
  };

  const openDeleteDialog = (course: CourseResponseDto, forceDelete = false) => {
    setSelectedCourse(course);
    setIsForceDelete(forceDelete);
    setIsDeleteDialogOpen(true);
    setActionError(null);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedCourse(null);
    setActionError(null);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedCourse(null);
    setIsForceDelete(false);
    setActionError(null);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="h-8 w-8 animate-spin text-gray-600" />
      <p className="mt-2 text-gray-600">Loading courses...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-8">
      <div className="text-red-600 mb-4 bg-red-50 border border-red-200 rounded p-4">
        <strong>Error:</strong> {error.toString()}
      </div>
      <Button onClick={() => refetch()} className="flex items-center gap-2 mx-auto">
        <RefreshCw className="h-4 w-4" /> Retry
      </Button>
    </div>
  );

  const currentCourses = data || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses Dashboard</h1>
        <div className="flex items-center gap-4">
          <Switch
            id="show-deleted"
            checked={showDeleted}
            onCheckedChange={setShowDeleted}
          />
          <Label htmlFor="show-deleted">Show Deleted Courses</Label>
          {!showDeleted && (
            <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Course
            </Button>
          )}
          <Button variant="outline" onClick={() => refetch()} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {actionError}
        </div>
      )}

      {/* Courses Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCourses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  {showDeleted ? "No deleted courses found." : "No courses available. Add one."}
                </td>
              </tr>
            ) : (
              currentCourses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{course.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${course.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.level}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {showDeleted ? (
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestoreCourse(course)}
                          disabled={actionLoading}
                        >
                          <RotateCcw className="h-3 w-3" /> Restore
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(course, true)}
                        >
                          <Trash2 className="h-3 w-3" /> Permanent Delete
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openEditModal(course)}>
                          <Edit className="h-3 w-3" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(course)}>
                          <Trash2 className="h-3 w-3" /> Delete
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Course Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        title="Create New Course"
        className="sm:max-w-lg"
      >
        <CourseForm
  mode="update"
  initialData={selectedCourse??undefined}
  onSubmit={handleUpdateCourse}
  onCancel={closeModals}
/>

      </Modal>

            {/* Edit Course Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        title="Edit Course"
        className="sm:max-w-lg"
      >
        {selectedCourse && (
          <CourseForm
  mode="update"
  // course={selectedCourse}
  onSubmit={handleUpdateCourse}
  onCancel={closeModals}
/>
        )}
      </Modal>

      {/* Delete Course Dialog */}
      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={handleDeleteCourse}
        onCancel={closeDeleteDialog}
        userName={selectedCourse ? selectedCourse.title : ""}
        isLoading={actionLoading}
        isForceDelete={isForceDelete}
      />
    </div>
  );
}


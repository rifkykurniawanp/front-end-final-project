"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteCourseDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  courseTitle: string;
  isLoading?: boolean;
  isForceDelete?: boolean; // Permanent delete
}

export const DeleteCourseDialog: React.FC<DeleteCourseDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  courseTitle,
  isLoading,
  isForceDelete = false,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isForceDelete ? "Permanently Delete Course" : "Delete Course"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isForceDelete ? (
              <>
                Are you sure you want to <strong>permanently delete</strong> the
                course <strong>"{courseTitle}"</strong>? This action{" "}
                <span className="text-red-600 font-medium">cannot be undone</span>.
              </>
            ) : (
              <>
                Are you sure you want to delete course{" "}
                <strong>"{courseTitle}"</strong>? You can restore it later if
                needed.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={
              isForceDelete
                ? "bg-red-600 hover:bg-red-700"
                : "bg-orange-600 hover:bg-orange-700"
            }
          >
            {isLoading
              ? isForceDelete
                ? "Permanently Deleting..."
                : "Deleting..."
              : isForceDelete
              ? "Permanently Delete"
              : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

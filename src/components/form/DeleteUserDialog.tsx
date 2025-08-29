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
import { Button } from "@/components/ui/button";

interface DeleteUserDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  userName: string;
  isLoading?: boolean;
  isForceDelete?: boolean; // For permanent deletion
}

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  userName,
  isLoading,
  isForceDelete = false,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isForceDelete ? "Permanently Delete User" : "Delete User"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isForceDelete ? (
              <>
                Are you sure you want to permanently delete user{" "}
                <strong>"{userName}"</strong>? This action cannot be undone and
                will completely remove all user data from the system.
              </>
            ) : (
              <>
                Are you sure you want to delete user{" "}
                <strong>"{userName}"</strong>? The user will be moved to trash
                and can be restored later.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={isLoading} onClick={onCancel}>
              Cancel
            </Button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              disabled={isLoading}
              onClick={onConfirm}
            >
              {isLoading
                ? isForceDelete
                  ? "Permanently Deleting..."
                  : "Deleting..."
                : isForceDelete
                ? "Permanently Delete"
                : "Delete"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

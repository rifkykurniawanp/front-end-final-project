"use client";

import React, { useState } from "react";
import { useAdminData } from "@/hooks/dashboard/useAdminData";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { UserForm } from "@/components/form/UserForm";
import { DeleteUserDialog } from "@/components/form/DeleteUserDialog";
import {
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  UserX,
  RefreshCw,
  Users as UsersIcon,
  User as UserIcon,
  ShoppingCart,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User, CreateUserDto, UpdateUserDto } from "@/types/user";

/**
 * Full refactor Admin Users page:
 * - Consistent palette: coffee (amber), tea (emerald), indigo, rose
 * - Stats as Card components
 * - Table with clear badges and actions
 * - Modals & dialogs kept (UserForm, DeleteUserDialog)
 *
 * Note: useAdminData hook is assumed to provide same API as before.
 */

export default function AdminUsersPage() {
  const {
    data,
    loading,
    error,
    showDeleted,
    setShowDeleted,
    createUser,
    updateUser,
    deleteUser,
    restoreUser,
    forceDeleteUser,
    refetch,
  } = useAdminData();

  // UI state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isForceDelete, setIsForceDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Omit<User, "password"> | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // defensive: if data is undefined, show placeholders
  const safeData = data ?? {
    users: [],
    deletedUsers: [],
    // other fields used by hook may exist but not required here
  };

  // Which list to render
  const currentUsers = showDeleted ? safeData.deletedUsers : safeData.users;

  // Actions handlers (wrap hook calls with UI state control)
  const handleCreateUser = async (userData: CreateUserDto) => {
    setActionLoading(true);
    setActionError(null);

    const result = await createUser(userData);

    setActionLoading(false);

    if (result.success) {
      setIsCreateModalOpen(false);
    } else {
      setActionError(result.error || "Failed to create user");
    }

    return result;
  };

  const handleUpdateUser = async (userData: CreateUserDto) => {
    if (!selectedUser) return { success: false, error: "No user selected" };

    setActionLoading(true);
    setActionError(null);

    const updateData: UpdateUserDto = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      role: userData.role,
      isBuyer: userData.isBuyer,
      isStudent: userData.isStudent,
    };

    const result = await updateUser(selectedUser.id, updateData);

    setActionLoading(false);

    if (result.success) {
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } else {
      setActionError(result.error || "Failed to update user");
    }

    return result;
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    setActionError(null);

    const result = isForceDelete
      ? await forceDeleteUser(selectedUser.id)
      : await deleteUser(selectedUser.id);

    setActionLoading(false);

    if (result.success) {
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      setIsForceDelete(false);
    } else {
      setActionError(result.error || "Failed to delete user");
    }
  };

  const handleRestoreUser = async (user: Omit<User, "password">) => {
    setActionLoading(true);
    setActionError(null);

    const result = await restoreUser(user.id);

    setActionLoading(false);

    if (!result.success) {
      setActionError(result.error || "Failed to restore user");
    }
  };

  // UI helpers
  const openEditModal = (user: Omit<User, "password">) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
    setActionError(null);
  };

  const openDeleteDialog = (user: Omit<User, "password">, forceDelete = false) => {
    setSelectedUser(user);
    setIsForceDelete(forceDelete);
    setIsDeleteDialogOpen(true);
    setActionError(null);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setActionError(null);
    setIsForceDelete(false);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
    setIsForceDelete(false);
    setActionError(null);
  };

  // Loading / error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-600" />
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4 bg-red-50 border border-red-200 rounded p-4 inline-block">
          <strong>Error:</strong> {error}
        </div>
        <div className="mt-4">
          <Button onClick={() => refetch()} className="flex items-center gap-2 mx-auto">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // palette classes (kopi-teh-herbal)
  const palette = {
    coffeeBg: "bg-amber-50",
    coffeeText: "text-amber-700",
    teaBg: "bg-emerald-50",
    teaText: "text-emerald-700",
    userText: "text-indigo-700",
    dangerText: "text-rose-700",
    muted: "text-gray-600",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold">Users Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {showDeleted ? "Manage deleted users" : "Manage active users"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-3">
            <Switch
              id="show-deleted"
              checked={showDeleted}
              onCheckedChange={setShowDeleted}
            />
            <Label htmlFor="show-deleted">Show Deleted Users</Label>
          </div>

          {!showDeleted && (
            <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          )}

          <Button variant="outline" onClick={() => refetch()} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Action error */}
      {actionError && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded">
          <strong>Error:</strong> {actionError}
        </div>
      )}

      {/* Stats (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UsersIcon className={`h-5 w-5 ${palette.userText}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${palette.userText}`}>
              {safeData.users.length}
            </div>
            <div className="text-sm text-gray-600">Active users</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Deleted Users</CardTitle>
            <UserX className={`h-5 w-5 ${palette.dangerText}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${palette.dangerText}`}>
              {safeData.deletedUsers.length}
            </div>
            <div className="text-sm text-gray-600">Soft deleted</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Buyers</CardTitle>
            <ShoppingCart className={`h-5 w-5 ${palette.teaText}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${palette.teaText}`}>
              {safeData.users.filter((u) => u.isBuyer).length}
            </div>
            <div className="text-sm text-gray-600">Users who purchased</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className={`h-5 w-5 ${palette.coffeeText}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${palette.coffeeText}`}>
              {safeData.users.filter((u) => u.isStudent).length}
            </div>
            <div className="text-sm text-gray-600">Course enrollees</div>
          </CardContent>
        </Card>
      </div>

      {/* Users table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {(!currentUsers || currentUsers.length === 0) ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  {showDeleted ? "No deleted users found." : "No users found. Click 'Add User' to create the first user."}
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-500">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        {user.phone && <div className="text-sm text-gray-500">{user.phone}</div>}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    {user.address && <div className="text-sm text-gray-500 truncate max-w-xs">{user.address}</div>}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === "ADMIN" ? "bg-purple-100 text-purple-800" :
                      user.role === "INSTRUCTOR" ? "bg-emerald-100 text-emerald-800" :
                      user.role === "SUPPLIER" ? "bg-amber-100 text-amber-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isBuyer ? "bg-emerald-100 text-emerald-800" : "bg-red-50 text-red-700"
                    }`}>
                      {user.isBuyer ? "Yes" : "No"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isStudent ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {user.isStudent ? "Yes" : "No"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {showDeleted ? (
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestoreUser(user)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Restore
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(user, true)}
                          className="inline-flex items-center gap-1"
                        >
                          <UserX className="h-3 w-3" />
                          Permanent
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(user)}
                          className="inline-flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(user, false)}
                          className="inline-flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
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

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={closeModals} title="Create New User" className="sm:max-w-lg">
        <UserForm onSubmit={handleCreateUser} onCancel={closeModals} isLoading={actionLoading} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeModals} title="Edit User" className="sm:max-w-lg">
        {selectedUser && (
          <UserForm user={selectedUser} onSubmit={handleUpdateUser} onCancel={closeModals} isLoading={actionLoading} />
        )}
      </Modal>

      {/* Delete Dialog */}
      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={handleDeleteUser}
        onCancel={closeDeleteDialog}
        userName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ""}
        isLoading={actionLoading}
        isForceDelete={isForceDelete}
      />
    </div>
  );
}

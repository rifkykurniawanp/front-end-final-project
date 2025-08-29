"use client";
import React, { useState } from "react";
import { useAdminData } from "@/hooks/dashboard/useAdminData";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { UserForm } from "@/components/form/UserForm";
import { DeleteUserDialog } from "@/components/form/DeleteUserDialog";
import { Plus, Edit, Trash2, RotateCcw, UserX, RefreshCw } from "lucide-react";
import type { User, CreateUserDto, UpdateUserDto } from "@/types/user";

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
    refetch 
  } = useAdminData();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isForceDelete, setIsForceDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Omit<User, "password"> | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const currentUsers = showDeleted ? data.deletedUsers : data.users;

  const handleCreateUser = async (userData: CreateUserDto) => {
    setActionLoading(true);
    setActionError(null);
    const result = await createUser(userData);
    setActionLoading(false);
    if (result.success) setIsCreateModalOpen(false);
    else setActionError(result.error || "Failed to create user");
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
    if (!result.success) setActionError(result.error || "Failed to restore user");
  };

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
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
    setIsForceDelete(false);
    setActionError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-coffee-700" />
          <p className="mt-2 text-coffee-700">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4 bg-red-50 border border-red-200 rounded p-4">
          <strong>Error:</strong> {error}
        </div>
        <Button onClick={() => refetch()} className="flex items-center gap-2 mx-auto bg-coffee-600 hover:bg-coffee-700 text-white">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-coffee-800">Users Dashboard</h1>
          <p className="text-coffee-600 mt-1">
            {showDeleted ? "Manage deleted users" : "Manage active users"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-deleted"
              checked={showDeleted}
              onCheckedChange={setShowDeleted}
            />
            <Label htmlFor="show-deleted">Show Deleted Users</Label>
          </div>
          {!showDeleted && (
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          )}
          <Button 
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-coffee-600 hover:bg-coffee-700 text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error */}
      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {actionError}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-700">{data.users.length}</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-red-600">{data.deletedUsers.length}</div>
          <div className="text-sm text-gray-600">Deleted Users</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-coffee-700">
            {data.users.filter(u => u.isBuyer).length}
          </div>
          <div className="text-sm text-gray-600">Buyers</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-orange-600">
            {data.users.filter(u => u.isStudent).length}
          </div>
          <div className="text-sm text-gray-600">Students</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-coffee-50">
            <tr>
              {["Name", "Email", "Role", "Buyer", "Student", "Actions"].map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-medium text-coffee-700 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  {showDeleted 
                    ? "No deleted users found." 
                    : "No users found. Click 'Add User' to create the first user."}
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-coffee-50/50">
                  {/* Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-coffee-900">
                      {user.firstName} {user.lastName}
                    </div>
                    {user.phone && (
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    )}
                  </td>
                  {/* Email */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-coffee-900">{user.email}</div>
                    {user.address && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {user.address}
                      </div>
                    )}
                  </td>
                  {/* Role */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'INSTRUCTOR' ? 'bg-green-100 text-green-800' :
                      user.role === 'SUPPLIER' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  {/* Buyer */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isBuyer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isBuyer ? "Yes" : "No"}
                    </span>
                  </td>
                  {/* Student */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isStudent ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isStudent ? "Yes" : "No"}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {showDeleted ? (
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleRestoreUser(user)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Restore
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => openDeleteDialog(user, true)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                          <UserX className="h-3 w-3" />
                          Permanent Delete
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => openEditModal(user)}
                          className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => openDeleteDialog(user, false)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white"
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

      {/* Modals */}
      <Modal isOpen={isCreateModalOpen} onClose={closeModals} title="Create New User" className="sm:max-w-lg">
        <UserForm onSubmit={handleCreateUser} onCancel={closeModals} isLoading={actionLoading} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={closeModals} title="Edit User" className="sm:max-w-lg">
        {selectedUser && (
          <UserForm
            user={selectedUser}
            onSubmit={handleUpdateUser}
            onCancel={closeModals}
            isLoading={actionLoading}
          />
        )}
      </Modal>

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

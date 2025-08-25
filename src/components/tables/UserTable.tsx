import React, { useState } from "react";
import { User, CreateUserDto, UpdateUserDto } from "@/types/user";
import { RoleName } from "@/types";

interface UserTableProps {
  users: User[];
  onEdit: (data: CreateUserDto | UpdateUserDto) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit }) => {
  const [selectedUser, setSelectedUser] = useState<CreateUserDto | UpdateUserDto | null>(null);

  const handleEdit = (user: User) => {
    // normalisasi null ke undefined
    const formData: UpdateUserDto = {
      email: user.email,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      phone: user.phone ?? undefined,
      address: user.address ?? undefined,
      role: user.role as RoleName, // pakai enum cast
      isBuyer: user.isBuyer,
      isStudent: user.isStudent,
    };
    setSelectedUser(formData);
    onEdit(formData);
  };

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.firstName} {user.lastName}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <button onClick={() => handleEdit(user)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;

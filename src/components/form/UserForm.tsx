"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { User, CreateUserDto } from "@/types/user";
import { RoleName } from "@/types/enum"; // pastikan import enum

export interface UserFormProps {
  user?: Omit<User, "password">;
  onSubmit: (data: CreateUserDto) => Promise<any>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel, isLoading }) => {
  const [form, setForm] = useState<CreateUserDto>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    role: RoleName.USER, // ✅ pakai enum, bukan string literal
    isBuyer: false,
    isStudent: false,
    password: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",     // ✅ fix null → ""
        address: user.address ?? "", // ✅ fix null → ""
        role: user.role,
        isBuyer: user.isBuyer,
        isStudent: user.isStudent,
        password: "",
      });
    }
  }, [user]);

  const handleChange = (field: keyof CreateUserDto, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* First Name */}
      <div className="space-y-1">
        <Label>First Name</Label>
        <Input
          value={form.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          required
        />
      </div>

      {/* Last Name */}
      <div className="space-y-1">
        <Label>Last Name</Label>
        <Input
          value={form.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <Label>Email</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <Label>Phone</Label>
        <Input
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
      </div>

      {/* Address */}
      <div className="space-y-1">
        <Label>Address</Label>
        <Input
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </div>

      {/* Role */}
      <div className="space-y-1">
        <Label>Role</Label>
        <Select
          value={form.role}
          onValueChange={(val) => handleChange("role", val as RoleName)} // ✅ cast ke RoleName
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={RoleName.USER}>User</SelectItem>
            <SelectItem value={RoleName.ADMIN}>Admin</SelectItem>
            <SelectItem value={RoleName.INSTRUCTOR}>Instructor</SelectItem>
            <SelectItem value={RoleName.SUPPLIER}>Supplier</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buyer & Student Switch */}
      <div className="flex items-center justify-between">
        <Label htmlFor="buyer">Buyer</Label>
        <Switch
          id="buyer"
          checked={form.isBuyer}
          onCheckedChange={(val) => handleChange("isBuyer", val)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="student">Student</Label>
        <Switch
          id="student"
          checked={form.isStudent}
          onCheckedChange={(val) => handleChange("isStudent", val)}
        />
      </div>

      {/* Password hanya untuk create */}
      {!user && (
        <div className="space-y-1">
          <Label>Password</Label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};
